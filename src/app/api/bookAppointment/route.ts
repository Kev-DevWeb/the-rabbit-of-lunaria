import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { readingsData } from '@/lib/readings-data';
import { availableTimes, googleCalendarLink, isValidDate, isValidTime, reserveSlot, SlotTakenError } from '@/lib/booking';
import { captureOrder, priceFor } from '@/lib/paypal';
import { sendMailSafe } from '@/lib/mailer';
import {
  userConfirmedEmail,
  adminConfirmedEmail,
  userPendingEmail,
  adminPendingEmail,
} from '@/lib/email-templates';

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request: Request) {
  const { date, time, name, email, readingId, paymentMethod, orderId, currency } = await request.json();

  if (!isValidDate(date) || !isValidTime(time) || typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Faltan datos o no son válidos.' }, { status: 400 });
  }
  if (paymentMethod !== 'paypal' && paymentMethod !== 'bankTransfer') {
    return NextResponse.json({ error: 'Método de pago no válido.' }, { status: 400 });
  }
  if (paymentMethod === 'paypal' && (typeof orderId !== 'string' || !orderId)) {
    return NextResponse.json({ error: 'Falta la orden de PayPal.' }, { status: 400 });
  }

  const reading = readingsData.find(r => r.id === readingId);
  if (!reading) {
    return NextResponse.json({ error: 'Lectura no válida.' }, { status: 400 });
  }

  // El horario tiene que estar en el calendario (no en el pasado ni fuera de horario)
  if (!(await availableTimes(date)).includes(time)) {
    return NextResponse.json({ error: 'Este horario ya no está disponible. Por favor, elige otro.' }, { status: 409 });
  }

  const cancelToken = uuidv4();
  const confirmToken = paymentMethod === 'bankTransfer' ? uuidv4() : null;
  const cleanName = name.trim().slice(0, 120);

  // 1. Apartar el horario (transacción). Con PayPal queda "processing" hasta cobrar.
  let bookingRef;
  try {
    bookingRef = await reserveSlot(date, time, {
      name: cleanName,
      email,
      readingId: reading.id,
      readingTitle: reading.title,
      status: paymentMethod === 'paypal' ? 'processing' : 'pending',
      paymentMethod,
      paymentId: null,
      paypalOrderId: paymentMethod === 'paypal' ? orderId : null,
      cancelToken,
      confirmToken,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof SlotTakenError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error('API Error al apartar el horario:', error);
    return NextResponse.json({ error: 'No se pudo agendar la cita. Inténtalo de nuevo.' }, { status: 500 });
  }

  // 2. Con PayPal, el cobro se hace aquí en el servidor y se verifica el monto.
  //    Si no se cobra bien, se libera el horario.
  let paymentId: string | null = null;
  if (paymentMethod === 'paypal') {
    try {
      const capture = await captureOrder(orderId, priceFor(reading, currency === 'USD' ? 'USD' : 'MXN'));
      if (!capture.ok) {
        await bookingRef.delete();
        console.error('Pago de PayPal no válido:', { orderId, reason: capture.reason, captureId: capture.captureId });
        return NextResponse.json({ error: 'No se pudo completar el pago con PayPal. No se agendó la cita.' }, { status: 402 });
      }
      paymentId = capture.captureId ?? null;
      await bookingRef.update({ status: 'confirmed', paymentId });
    } catch (error) {
      await bookingRef.delete().catch(() => undefined);
      console.error('API Error al cobrar con PayPal:', error);
      return NextResponse.json({ error: 'No se pudo procesar el pago. Inténtalo de nuevo.' }, { status: 500 });
    }
  }

  // 3. Correos: si fallan, la cita ya está guardada y no se marca error al cliente
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const emailData = {
    name: cleanName,
    email,
    date,
    time,
    readingTitle: reading.title,
    paymentId: paymentId ?? undefined,
    paymentMethod,
    cancelToken,
    confirmToken: confirmToken ?? undefined,
    appBaseUrl,
    calendarLink: googleCalendarLink(
      `Cita de Tarot: ${reading.title} con ${cleanName}`,
      `Cliente: ${cleanName}\nEmail: ${email}\nLectura: ${reading.title}\nMétodo de pago: ${paymentMethod}`,
      date,
      time,
      reading.duration || 30,
    ),
  };

  if (paymentMethod === 'paypal') {
    await sendMailSafe(email, '¡Tu cita de Tarot ha sido confirmada!', userConfirmedEmail(emailData));
    await sendMailSafe(process.env.ADMIN_EMAIL, `¡Cita Confirmada por PayPal: ${reading.title} con ${cleanName}!`, adminConfirmedEmail(emailData));
  } else {
    await sendMailSafe(email, 'Confirmación pendiente para tu lectura de Tarot', userPendingEmail(emailData));
    await sendMailSafe(process.env.ADMIN_EMAIL, `Nueva cita pendiente por ${cleanName} (Transferencia)`, adminPendingEmail(emailData));
  }

  return NextResponse.json({ success: true, status: paymentMethod === 'paypal' ? 'confirmed' : 'pending' });
}
