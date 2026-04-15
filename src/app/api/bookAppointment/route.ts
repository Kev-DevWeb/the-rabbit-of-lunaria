import { NextResponse } from 'next/server';
import { adminDb as db } from '@/lib/firebaseAdmin';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { readingsData } from '@/lib/readings-data';
import {
  userConfirmedEmail,
  adminConfirmedEmail,
  userPendingEmail,
  adminPendingEmail,
} from '@/lib/email-templates';

// Helper para el link de Google Calendar
function generateGoogleCalendarLink(title: string, description: string, startDate: string, startTime: string, durationMinutes: number): string {
  const startDateTime = new Date(`${startDate}T${startTime}:00`);
  const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60 * 1000);
  const formatDateTime = (date: Date) => date.toISOString().replace(/[-:]|\.\\d{3}/g, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatDateTime(startDateTime)}/${formatDateTime(endDateTime)}`,
    details: description,
    sf: 'true',
    output: 'xml',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export async function POST(request: Request) {
  const { date, time, name, email, readingId, readingTitle, paymentMethod, paymentId } = await request.json();

  if (!date || !time || !name || !email || !readingId || !readingTitle || !paymentMethod) {
    return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
  }

  const selectedReading = readingsData.find(r => r.id === readingId);
  if (!selectedReading) {
    return NextResponse.json({ error: 'Lectura no válida.' }, { status: 400 });
  }

  try {
    const bookingsRef = db.collection('bookings');
    const existingBookingQuery = await bookingsRef
      .where('date', '==', date)
      .where('time', '==', time)
      .where('status', 'in', ['confirmed', 'pending'])
      .limit(1)
      .get();

    if (!existingBookingQuery.empty) {
      return NextResponse.json({ error: 'Este horario ya no está disponible. Por favor, elige otro.' }, { status: 409 });
    }

    const cancelToken = uuidv4();
    const bookingStatus = paymentMethod === 'paypal' ? 'confirmed' : 'pending';

    const newBooking = {
      date,
      time,
      name,
      email,
      readingId,
      readingTitle,
      status: bookingStatus,
      paymentMethod,
      paymentId: paymentId || null,
      cancelToken,
      createdAt: new Date().toISOString(),
    };

    await bookingsRef.add(newBooking);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const calendarLink = generateGoogleCalendarLink(
        `Cita de Tarot: ${readingTitle} con ${name}`,
        `Detalles:\nCliente: ${name}\nEmail: ${email}\nLectura: ${readingTitle}\nMétodo de Pago: ${paymentMethod}`,
        date, time, selectedReading.duration || 30
    );

    const emailData = {
      name, email, date, time, readingTitle,
      paymentId, paymentMethod, cancelToken,
      calendarLink, appBaseUrl,
    };

    let userMailSubject = '';
    let userMailHtml = '';
    let adminMailSubject = '';
    let adminMailHtml = '';

    if (bookingStatus === 'confirmed') {
      userMailSubject = "¡Tu cita de Tarot ha sido confirmada!";
      userMailHtml = userConfirmedEmail(emailData);
      adminMailSubject = `¡Cita Confirmada por PayPal: ${readingTitle} con ${name}!`;
      adminMailHtml = adminConfirmedEmail(emailData);
    } else {
      userMailSubject = "Confirmación pendiente para tu lectura de Tarot";
      userMailHtml = userPendingEmail(emailData);
      adminMailSubject = `Nueva cita pendiente por ${name} (Transferencia)`;
      adminMailHtml = adminPendingEmail(emailData);
    }

    await transporter.sendMail({
        from: `"La Madriguera de Lunaria" <${process.env.GMAIL_EMAIL}>`,
        to: email,
        subject: userMailSubject,
        html: userMailHtml
    });

    await transporter.sendMail({
        from: `"La Madriguera de Lunaria" <${process.env.GMAIL_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: adminMailSubject,
        html: adminMailHtml
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("API Error en bookAppointment:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Ocurrió un error inesperado en el servidor.' }, { status: 500 });
  }
}