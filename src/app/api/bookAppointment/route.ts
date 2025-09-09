import { NextResponse } from 'next/server';

import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const { date, time, name, email, readingId, readingTitle } = await request.json();

  if (!date || !time || !name || !email || !readingId || !readingTitle) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    console.log("API: Inicia el proceso de agendar cita.");
    const cancelToken = uuidv4();
    const confirmToken = uuidv4();

    try {
      await addDoc(collection(db, "bookings"), {
        date,
        time,
        name,
        email,
        status: "pending",
        readingId,
        readingTitle,
        cancelToken,
        confirmToken,
      });
      console.log("API: Cita guardada en Firestore.");
    } catch (dbError) {
      console.error("API Error: Fallo al guardar en Firestore:", dbError);
      throw new Error("Error al guardar la cita en la base de datos.");
    }

    const appBaseUrl = new URL(request.url).origin;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const userMailOptions = {
      from: `"La Madriguera de Lunaria" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: "Confirmación pendiente para tu lectura de Tarot",
      text: `
      Saludos, ${name},

      Tu solicitud de cita para una lectura de tarot en La Madriguera de Lunaria ha sido recibida.

      Detalles de la cita:
      - Lectura: ${readingTitle}
      - Fecha: ${date}
      - Hora: ${time}

      Para confirmar tu cita, se requiere el pago de la lectura ($20 MXN o $1 USD). Por favor, realiza el depósito a la siguiente cuenta:
      - Número de cuenta: 012180015310706887
      - A nombre de: Kevin Garcia

      Una vez realizado el pago, responde a este correo con tu comprobante para confirmar tu cita.

      Si deseas cancelar, puedes hacerlo aquí: ${appBaseUrl}/api/cancelAppointment?token=${cancelToken}

      ¡Que la luz de la luna ilumine tu camino!

      Lunaria
      La Madriguera de Lunaria
      `,
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
          .link { color: #fde047; text-decoration: none; }
          .footer { text-align: center; margin-top: 40px; }
          .footer-text { font-size: 12px; color: #9ca3af; }
          .payment-info { font-size: 18px; color: #FFFFFF; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1 class="title">~ La Madriguera de Lunaria ~</h1>
            <p class="subtitle">Confirmación de Cita</p>
          </div>
          <div class="content">
            <p>Saludos, buscador/a de la verdad,</p>
            <p>Tu intención de explorar los misterios del tarot ha sido recibida. Tu solicitud para una lectura ha sido anotada y está a la espera de su confirmación.</p>
            <hr class="hr">
            <p class="p-strong"><strong>Los hilos del destino tejen tu cita:</strong></p>
            <p><strong>Fecha:</strong> ${date}</p>
            <p><strong>Hora:</strong> ${time}</p>
            <p><strong>Lectura:</strong> ${readingTitle}</p>
            <hr class="hr">
            <p><strong>Para confirmar tu cita:</strong></p>
            <p>Se requiere el pago de la lectura ($20 MXN o $1 USD) para asegurar tu espacio. Por favor, realiza el depósito a la siguiente cuenta:</p>
            <p class="payment-info"><strong>Número de cuenta:</strong> 012180015310706887</p>
            <p class="payment-info"><strong>A nombre de:</strong> Kevin Garcia</p>
            <p>Una vez realizado el pago, <strong>responde a este correo</strong> con tu comprobante para confirmar tu cita.</p>
            <p>Si los vientos del cambio te llevan por otro sendero, puedes liberar tu compromiso aquí: <a href="${appBaseUrl}/api/cancelAppointment?token=${cancelToken}" class="link">Cancelar Cita</a></p>
            <br>
            <p>¡Que la luz de la luna ilumine tu camino hasta nuestro encuentro!</p>
            <p><em>Con gratitud y magia,</em></p>
            <p><em>Lunaria</em></p>
          </div>
          <div class="footer">
            <p class="footer-text">&copy; 2025 La Madriguera de Lunaria. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
      `,
    };

    const adminMailOptions = {
      from: `"La Madriguera de Lunaria" <${process.env.GMAIL_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Nueva cita agendada por ${name}`,
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
          .link-white { color: #FFFFFF; text-decoration: none; }
          .footer { text-align: center; margin-top: 40px; }
          .footer-text { font-size: 12px; color: #9ca3af; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1 class="title">~ Nueva Cita Pendiente ~</h1>
            <p class="subtitle">La Madriguera de Lunaria</p>
          </div>
          <div class="content">
            <p>Un nuevo hilo se ha tejido en el tapiz del destino. Una nueva alma busca guía en los arcanos. Aquí están los detalles de la cita pendiente:</p>
            <hr class="hr">
            <p class="p-strong"><strong>Nombre del buscador:</strong> ${name}</p>
            <p class="p-strong"><strong>Email de contacto:</strong> ${email}</p>
            <p class="p-strong"><strong>Fecha del encuentro:</strong> ${date}</p>
            <p class="p-strong"><strong>Hora señalada:</strong> ${time}</p>
            <p class="p-strong"><strong>Lectura solicitada:</strong> ${readingTitle}</p>
            <hr class="hr">
            <p>Una vez que la ofrenda de energía haya sido confirmada, sella este encuentro en el calendario cósmico:</p>
            <p><a href="${appBaseUrl}/api/confirmAppointment?token=${confirmToken}" class="link">Confirmar Cita</a></p>
            <p>Si los astros no se alinean y la cita debe ser disuelta, puedes hacerlo aquí:</p>
            <p><a href="${appBaseUrl}/api/cancelAppointment?token=${cancelToken}" class="link-white">Cancelar Cita</a></p>
          </div>
          <div class="footer">
            <p class="footer-text">&copy; 2025 La Madriguera de Lunaria. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
      `,
    };

    try {
      await Promise.all([
        transporter.sendMail(userMailOptions),
        transporter.sendMail(adminMailOptions),
      ]);
      console.log("API: Correos enviados exitosamente.");
    } catch (emailError) {
      console.error("API Error: Fallo al enviar correos:", emailError);
      throw new Error("Error al enviar los correos de confirmación.");
    }

    console.log("API: Proceso completado, enviando respuesta exitosa.");
    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error("API Error: Error general en bookAppointment:", error);
    let errorMessage = 'Ocurrió un error al agendar la cita.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}