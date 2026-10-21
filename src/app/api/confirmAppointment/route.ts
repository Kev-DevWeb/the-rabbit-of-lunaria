import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { readingsData } from '@/lib/readings-data';
import { googleCalendarLink } from '@/lib/booking';
import { sendMailSafe } from '@/lib/mailer';
import { adminTransferConfirmedEmail, userTransferConfirmedEmail } from '@/lib/email-templates';

// Enlace del correo de "Nueva cita pendiente": la administradora confirma una cita por transferencia
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/confirmation/error', request.url));
  }

  try {
    const querySnapshot = await adminDb.collection('bookings').where('confirmToken', '==', token).limit(1).get();

    if (querySnapshot.empty) {
      console.error('No appointment found with the provided confirmation token.');
      return NextResponse.redirect(new URL('/confirmation/error', request.url));
    }

    const appointmentDoc = querySnapshot.docs[0];
    const appointment = appointmentDoc.data();

    if (appointment.status === 'confirmed') {
      return NextResponse.redirect(new URL('/confirmation/confirmed', request.url));
    }

    await appointmentDoc.ref.update({ status: 'confirmed', confirmedAt: new Date().toISOString() });

    const reading = readingsData.find(r => r.id === appointment.readingId);
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const emailData = {
      name: appointment.name,
      email: appointment.email,
      date: appointment.date,
      time: appointment.time,
      readingTitle: appointment.readingTitle,
      paymentMethod: appointment.paymentMethod,
      cancelToken: appointment.cancelToken,
      appBaseUrl,
      calendarLink: googleCalendarLink(
        `Lectura de tarot: ${appointment.readingTitle}`,
        `Cliente: ${appointment.name}\nEmail: ${appointment.email}\nLectura: ${appointment.readingTitle}`,
        appointment.date,
        appointment.time,
        reading?.duration || 30,
      ),
    };

    await sendMailSafe(appointment.email, `Tu cita en La Madriguera de Lunaria está confirmada`, userTransferConfirmedEmail(emailData));
    await sendMailSafe(
      process.env.ADMIN_EMAIL,
      `¡Cita Confirmada Manualmente: ${appointment.readingTitle} con ${appointment.name}!`,
      adminTransferConfirmedEmail(emailData),
    );

    return NextResponse.redirect(new URL('/confirmation/confirmed', request.url));
  } catch (error) {
    console.error('Error confirming appointment:', error);
    return NextResponse.redirect(new URL('/confirmation/error', request.url));
  }
}
