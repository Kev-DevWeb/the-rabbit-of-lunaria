import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import * as nodemailer from 'nodemailer';
import { readingsData } from '@/lib/readings-data'; // Import readingsData

// Helper function to generate Google Calendar link
function generateGoogleCalendarLink(
  title: string,
  description: string,
  startDate: string, // YYYY-MM-DD
  startTime: string, // HH:MM
  durationMinutes: number,
  location?: string
): string {
  const startDateTime = new Date(`${startDate}T${startTime}:00`);
  const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60 * 1000);

  const formatDateTime = (date: Date) => {
    return date.toISOString().replace(/[-:]|\.\d{3}/g, '');
  };

  const formattedStart = formatDateTime(startDateTime);
  const formattedEnd = formatDateTime(endDateTime);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formattedStart}/${formattedEnd}`,
    details: description,
    sf: 'true',
    output: 'xml',
  });

  if (location) {
    params.append('location', location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/confirmation/error', request.url));
  }

  try {
    const bookingsRef = adminDb.collection("bookings");
    const q = bookingsRef.where("confirmToken", "==", token);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      console.error("No appointment found with the provided confirmation token.");
      return NextResponse.redirect(new URL('/confirmation/error', request.url));
    }

    const appointmentDoc = querySnapshot.docs[0];
    const appointmentRef = appointmentDoc.ref;
    const appointmentData = appointmentDoc.data();

    if (appointmentData.status === 'confirmed') {
      return NextResponse.redirect(new URL('/confirmation/confirmed', request.url));
    }

    await appointmentRef.update({
      status: "confirmed",
    });

    const appBaseUrl = new URL(request.url).origin;

    // Send confirmation email to the user
    await fetch(`${appBaseUrl}/api/send-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: appointmentData.email,
          readingTitle: appointmentData.readingTitle,
          date: appointmentData.date,
          time: appointmentData.time,
        }),
      });

    // Send confirmation email to admin
    const selectedReading = readingsData.find(r => r.id === appointmentData.readingId);
    const readingDuration = selectedReading?.duration || 30; // Default to 30 minutes if not specified
    const calendarLink = generateGoogleCalendarLink(
      `Cita de Tarot Confirmada: ${appointmentData.readingTitle} con ${appointmentData.name}`,
      `Detalles de la cita:\nCliente: ${appointmentData.name}\nEmail: ${appointmentData.email}\nLectura: ${appointmentData.readingTitle}\n\n¡No olvides añadir esta cita a tu calendario!`, 
      appointmentData.date,
      appointmentData.time,
      readingDuration
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const adminMailOptionsConfirmed = {
      from: `"La Madriguera de Lunaria" <${process.env.GMAIL_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `¡Cita Confirmada Manualmente: ${appointmentData.readingTitle} con ${appointmentData.name}!`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative&family=Cormorant+Garamond&display=swap" rel="stylesheet">
        <style>
          body { margin: 0; padding: 0; background-color: #1a1a2e; }
          .wrapper { font-family: 'Cormorant Garamond', serif; background-color: #1a1a2e; color: #e0e0e0; padding: 20px; max-width: 600px; margin: auto; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-family: 'Cinzel Decorative', cursive; color: #FFFFFF; font-size: 28px; margin: 0; }
          .subtitle { color: #FFFFFF; font-size: 18px; }
          .content { font-size: 16px; line-height: 1.8; }
          .hr { border: none; border-top: 1px solid #5a3a70; margin: 25px 0; }
          .p-strong { font-size: 18px; margin: 10px 0; }
          .p-strong strong { color: #FFFFFF; }
          .link { color: #fde047; text-decoration: none; font-weight: bold; }
          .footer { text-align: center; margin-top: 40px; }
          .footer-text { font-size: 12px; color: #9ca3af; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1 class="title">~ Cita Confirmada Manualmente ~</h1>
            <p class="subtitle">La Madriguera de Lunaria</p>
          </div>
          <div class="content">
            <p>Una cita ha sido confirmada manualmente.</p>
            <hr class="hr">
            <p class="p-strong"><strong>Detalles de la cita:</strong></p>
            <p><strong>Nombre del cliente:</strong> ${appointmentData.name}</p>
            <p><strong>Email del cliente:</strong> ${appointmentData.email}</p>
            <p><strong>Fecha:</strong> ${appointmentData.date}</p>
            <p><strong>Hora:</strong> ${appointmentData.time}</p>
            <p><strong>Lectura:</strong> ${appointmentData.readingTitle}</p>
            <hr class="hr">
            <p>Añade esta cita a tu calendario:</p>
            <p><a href="${calendarLink}" target="_blank" class="link">Añadir a Google Calendar</a></p>
          </div>
          <div class="footer">
            <p class="footer-text">&copy; 2025 La Madriguera de Lunaria. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
      `,
    };
    await transporter.sendMail(adminMailOptionsConfirmed);
    console.log("API: Admin confirmation email sent for manual confirmation.");

    return NextResponse.redirect(new URL('/confirmation/confirmed', request.url));

  } catch (error) {
    console.error("Error confirming appointment:", error);
    return NextResponse.redirect(new URL('/confirmation/error', request.url));
  }
}
