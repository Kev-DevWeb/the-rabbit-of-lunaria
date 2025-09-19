import { NextResponse } from 'next/server';
import { adminDb as db } from '@/lib/firebaseAdmin';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { readingsData } from '@/lib/readings-data';

// Helper para el link de Google Calendar
function generateGoogleCalendarLink(title: string, description: string, startDate: string, startTime: string, durationMinutes: number): string {
  const startDateTime = new Date(`${startDate}T${startTime}:00`);
  const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60 * 1000);
  const formatDateTime = (date: Date) => date.toISOString().replace(/[-:]|\.\d{3}/g, '');
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

    let userMailSubject = '';
    let userMailHtml = '';
    let adminMailSubject = '';
    let adminMailHtml = '';

    if (bookingStatus === 'confirmed') { // Para PayPal
      userMailSubject = "¡Tu cita de Tarot ha sido confirmada!";
      userMailHtml = `
      <!DOCTYPE html><html><head><meta charset="UTF-8"><link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative&family=Cormorant+Garamond&display=swap" rel="stylesheet"><style>body{margin:0;padding:0;background-color:#1a1a2e;}.wrapper{font-family:'Cormorant Garamond',serif;background-color:#1a1a2e;color:#e0e0e0;padding:20px;max-width:600px;margin:auto;}.header{text-align:center;margin-bottom:30px;}.title{font-family:'Cinzel Decorative',cursive;color:#FFFFFF;font-size:28px;margin:0;}.subtitle{color:#FFFFFF;font-size:18px;}.content{font-size:16px;line-height:1.8;}.hr{border:none;border-top:1px solid #5a3a70;margin:25px 0;}.p-strong{font-size:18px;margin:10px 0;}.p-strong strong{color:#FFFFFF;}.footer{text-align:center;margin-top:40px;}.footer-text{font-size:12px;color:#9ca3af;}</style></head><body><div class="wrapper"><div class="header"><h1 class="title">~ La Madriguera de Lunaria ~</h1><p class="subtitle">¡Cita Confirmada!</p></div><div class="content"><p>Saludos, ${name},</p><p>¡Excelente noticia! Tu pago ha sido recibido y tu cita para la lectura de tarot ha sido confirmada.</p><hr class="hr"><p class="p-strong"><strong>Detalles de tu cita:</strong></p><p><strong>Fecha:</strong> ${date}</p><p><strong>Hora:</strong> ${time}</p><p><strong>Lectura:</strong> ${readingTitle}</p><hr class="hr"><p>¡Estamos ansiosos por nuestro encuentro!</p><p><em>Con gratitud y magia,</em></p><p><em>Lunaria</em></p></div><div class="footer"><p class="footer-text">&copy; 2025 La Madriguera de Lunaria. Todos los derechos reservados.</p></div></div></body></html>`;

      adminMailSubject = `¡Cita Confirmada por PayPal: ${readingTitle} con ${name}!`;
      adminMailHtml = `
      <!DOCTYPE html><html><head><meta charset="UTF-8"><link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative&family=Cormorant+Garamond&display=swap" rel="stylesheet"><style>body{margin:0;padding:0;background-color:#1a1a2e;}.wrapper{font-family:'Cormorant Garamond',serif;background-color:#1a1a2e;color:#e0e0e0;padding:20px;max-width:600px;margin:auto;}.header{text-align:center;margin-bottom:30px;}.title{font-family:'Cinzel Decorative',cursive;color:#FFFFFF;font-size:28px;margin:0;}.subtitle{color:#FFFFFF;font-size:18px;}.content{font-size:16px;line-height:1.8;}.hr{border:none;border-top:1px solid #5a3a70;margin:25px 0;}.p-strong{font-size:18px;margin:10px 0;}.p-strong strong{color:#FFFFFF;}.link{color:#fde047;text-decoration:none;font-weight:bold;}.footer{text-align:center;margin-top:40px;}.footer-text{font-size:12px;color:#9ca3af;}</style></head><body><div class="wrapper"><div class="header"><h1 class="title">~ Cita Confirmada ~</h1><p class="subtitle">La Madriguera de Lunaria</p></div><div class="content"><p>¡Excelente noticia! Una cita ha sido confirmada automáticamente a través de PayPal.</p><hr class="hr"><p class="p-strong"><strong>Detalles de la cita:</strong></p><p><strong>Nombre del cliente:</strong> ${name}</p><p><strong>Email del cliente:</strong> ${email}</p><p><strong>Fecha:</strong> ${date}</p><p><strong>Hora:</strong> ${time}</p><p><strong>Lectura:</strong> ${readingTitle}</p><p><strong>Método de Pago:</strong> PayPal (Pago Recibido)</p><p><strong>ID de Transacción:</strong> ${paymentId}</p><hr class="hr"><p>Añade esta cita a tu calendario:</p><p><a href="${calendarLink}" target="_blank" class="link">Añadir a Google Calendar</a></p></div><div class="footer"><p class="footer-text">&copy; 2025 La Madriguera de Lunaria. Todos los derechos reservados.</p></div></div></body></html>`;

    } else { // Para Transferencia Bancaria
      userMailSubject = "Confirmación pendiente para tu lectura de Tarot";
      userMailHtml = `
      <!DOCTYPE html><html><head><meta charset="UTF-8"><link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative&family=Cormorant+Garamond&display=swap" rel="stylesheet"><style>body{margin:0;padding:0;background-color:#1a1a2e;}.wrapper{font-family:'Cormorant Garamond',serif;background-color:#1a1a2e;color:#e0e0e0;padding:20px;max-width:600px;margin:auto;}.header{text-align:center;margin-bottom:30px;}.title{font-family:'Cinzel Decorative',cursive;color:#FFFFFF;font-size:28px;margin:0;}.subtitle{color:#FFFFFF;font-size:18px;}.content{font-size:16px;line-height:1.8;}.hr{border:none;border-top:1px solid #5a3a70;margin:25px 0;}.p-strong{font-size:18px;margin:10px 0;}.p-strong strong{color:#FFFFFF;}.link{color:#fde047;text-decoration:none;}.footer{text-align:center;margin-top:40px;}.footer-text{font-size:12px;color:#9ca3af;}.payment-info{font-size:18px;color:#FFFFFF;}</style></head><body><div class="wrapper"><div class="header"><h1 class="title">~ La Madriguera de Lunaria ~</h1><p class="subtitle">Confirmación de Cita</p></div><div class="content"><p>Saludos, buscador/a de la verdad,</p><p>Tu intención de explorar los misterios del tarot ha sido recibida. Tu solicitud para una lectura ha sido anotada y está a la espera de su confirmación.</p><hr class="hr"><p class="p-strong"><strong>Los hilos del destino tejen tu cita:</strong></p><p><strong>Fecha:</strong> ${date}</p><p><strong>Hora:</strong> ${time}</p><p><strong>Lectura:</strong> ${readingTitle}</p><hr class="hr"><p><strong>Para confirmar tu cita:</strong></p><p>Se requiere el pago de la lectura para asegurar tu espacio. Por favor, realiza el depósito a la siguiente cuenta:</p><p class="payment-info"><strong>Número de cuenta:</strong> [Tu número de cuenta]</p><p class="payment-info"><strong>A nombre de:</strong> [Tu Nombre]</p><p>Una vez realizado el pago, <strong>responde a este correo</strong> con tu comprobante para confirmar tu cita.</p><p>Si los vientos del cambio te llevan por otro sendero, puedes liberar tu compromiso aquí: <a href="${appBaseUrl}/api/cancelAppointment?token=${cancelToken}" class="link">Cancelar Cita</a></p><br><p>¡Que la luz de la luna ilumine tu camino hasta nuestro encuentro!</p><p><em>Con gratitud y magia,</em></p><p><em>Lunaria</em></p></div><div class="footer"><p class="footer-text">&copy; 2025 La Madriguera de Lunaria. Todos los derechos reservados.</p></div></div></body></html>`;

      adminMailSubject = `Nueva cita pendiente por ${name} (Transferencia)`;
      adminMailHtml = `
      <!DOCTYPE html><html><head><meta charset="UTF-8"><link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative&family=Cormorant+Garamond&display=swap" rel="stylesheet"><style>body{margin:0;padding:0;background-color:#1a1a2e;}.wrapper{font-family:'Cormorant Garamond',serif;background-color:#1a1a2e;color:#e0e0e0;padding:20px;max-width:600px;margin:auto;}.header{text-align:center;margin-bottom:30px;}.title{font-family:'Cinzel Decorative',cursive;color:#FFFFFF;font-size:28px;margin:0;}.subtitle{color:#FFFFFF;font-size:18px;}.content{font-size:16px;line-height:1.8;}.hr{border:none;border-top:1px solid #5a3a70;margin:25px 0;}.p-strong{font-size:18px;margin:10px 0;}.p-strong strong{color:#FFFFFF;}.link{color:#fde047;text-decoration:none;font-weight:bold;}.link-white{color:#FFFFFF;text-decoration:none;}.footer{text-align:center;margin-top:40px;}.footer-text{font-size:12px;color:#9ca3af;}</style></head><body><div class="wrapper"><div class="header"><h1 class="title">~ Nueva Cita Pendiente ~</h1><p class="subtitle">La Madriguera de Lunaria</p></div><div class="content"><p>Un nuevo hilo se ha tejido en el tapiz del destino. Aquí están los detalles de la cita pendiente:</p><hr class="hr"><p class="p-strong"><strong>Nombre del buscador:</strong> ${name}</p><p class="p-strong"><strong>Email de contacto:</strong> ${email}</p><p class="p-strong"><strong>Fecha del encuentro:</strong> ${date}</p><p class="p-strong"><strong>Hora señalada:</strong> ${time}</p><p class="p-strong"><strong>Lectura solicitada:</strong> ${readingTitle}</p><p class="p-strong"><strong>Método de Pago:</strong> ${paymentMethod}</p><hr class="hr"><p>Añade esta cita a tu calendario:</p><p><a href="${calendarLink}" target="_blank" class="link">Añadir a Google Calendar</a></p></div><div class="footer"><p class="footer-text">&copy; 2025 La Madriguera de Lunaria. Todos los derechos reservados.</p></div></div></body></html>`;
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