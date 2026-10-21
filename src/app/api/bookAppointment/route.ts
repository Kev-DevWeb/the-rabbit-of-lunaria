import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { readingsData } from '@/lib/readings-data';
import { availableTimes, googleCalendarLink, HOLD_MINUTES, isValidDate, isValidTime, reserveSlot, SlotTakenError } from '@/lib/booking';
import { captureOrder, priceFor, validateOrderBeforeCapture, type CaptureOutcome } from '@/lib/paypal';
import { sendMailSafe } from '@/lib/mailer';
import {
  escapeHtml,
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
  const expected = priceFor(reading, currency === 'USD' ? 'USD' : 'MXN');

  // 0. Con PayPal, antes de apartar nada se revisa la orden: aprobada y por el monto correcto.
  //    Si no cumple, no se cobra.
  if (paymentMethod === 'paypal') {
    try {
      const check = await validateOrderBeforeCapture(orderId, expected);
      if (!check.ok) {
        console.error('Orden de PayPal no válida antes de cobrar:', { orderId, status: check.status });
        return NextResponse.json({ error: 'La orden de PayPal no es válida. No se hizo ningún cobro.' }, { status: 402 });
      }
    } catch (error) {
      console.error('No se pudo revisar la orden de PayPal:', error);
      return NextResponse.json({ error: 'No se pudo verificar el pago. No se hizo ningún cobro; inténtalo de nuevo.' }, { status: 502 });
    }
  }

  // 1. Apartar el horario (transacción). Con PayPal queda "processing" hasta cobrar, con vencimiento.
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
      holdExpiresAt: paymentMethod === 'paypal' ? new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString() : null,
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

  // 2. Cobro en el servidor. Solo se libera el horario si PayPal dijo claramente que no cobró;
  //    si el resultado es dudoso, la cita queda "payment_review" y se avisa a la administradora.
  let paymentId: string | null = null;
  if (paymentMethod === 'paypal') {
    let outcome: CaptureOutcome;
    try {
      outcome = await captureOrder(orderId, expected);
    } catch (error) {
      outcome = { kind: 'review', reason: `TOKEN_OR_UNKNOWN: ${String(error)}` };
    }

    if (outcome.kind === 'declined') {
      await bookingRef.delete().catch((error) => console.error('No se pudo liberar el horario:', error));
      console.error('PayPal rechazó el cobro:', { orderId, reason: outcome.reason });
      return NextResponse.json({ error: 'PayPal no pudo completar el pago. No se hizo ningún cobro.' }, { status: 402 });
    }

    if (outcome.kind === 'completed') {
      paymentId = outcome.captureId;
      try {
        await bookingRef.update({ status: 'confirmed', paymentId, holdExpiresAt: null });
      } catch (error) {
        // El pago ya entró: no se borra nada. Al vencer el apartado, la conciliación lo detecta.
        outcome = { kind: 'review', reason: `UPDATE_FAILED: ${String(error)}`, captureId: paymentId };
      }
    }

    if (outcome.kind === 'review') {
      console.error('Cobro de PayPal para revisión:', { orderId, reason: outcome.reason, captureId: outcome.captureId });
      await bookingRef
        .update({ status: 'payment_review', reviewReason: outcome.reason, paymentId: outcome.captureId ?? null, holdExpiresAt: null })
        .catch((error) => console.error('No se pudo marcar la cita para revisión:', error));
      await sendMailSafe(
        process.env.ADMIN_EMAIL,
        `Revisar pago de PayPal: ${reading.title} con ${cleanName}`,
        `<p>Una cita quedó en <strong>revisión de pago</strong>. El horario sigue apartado.</p>
         <p>Cliente: ${escapeHtml(cleanName)} (${escapeHtml(email)})<br>Fecha: ${date} ${time}<br>Lectura: ${escapeHtml(reading.title)}</p>
         <p>Orden de PayPal: ${escapeHtml(orderId)}<br>Captura: ${escapeHtml(outcome.captureId ?? '—')}<br>Motivo: ${escapeHtml(outcome.reason)}</p>
         <p>Revisa la orden en PayPal y confirma o reembolsa. Documento en Firestore: bookings/${bookingRef.id}</p>`,
      );
      return NextResponse.json({ success: true, status: 'review' }, { status: 202 });
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
