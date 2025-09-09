import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, readingTitle, date, time } = body;

    if (!userEmail || !readingTitle || !date || !time) {
      return NextResponse.json({ message: 'Faltan campos requeridos.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const formattedDate = new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // --- Google Calendar Integration ---
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);

    // Create start date/time
    const startDate = new Date(year, month - 1, day, hours, minutes);
    const startFormatted = startDate.toISOString().replace(/[-:]|\.\d{3}/g, '');

    // Create end date/time (assuming 1 hour duration)
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
    const endFormatted = endDate.toISOString().replace(/[-:]|\.\d{3}/g, '');

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(readingTitle)}&dates=${startFormatted}/${endFormatted}&details=${encodeURIComponent(`Tu lectura de tarot: ${readingTitle} con Lunaria.`)}&sf=true&output=xml`;
    // --- End Google Calendar Integration ---

    const mailOptions = {
      from: `"La Madriguera de Lunaria" <${process.env.GMAIL_EMAIL}>`,
      to: userEmail,
      subject: `Tu cita en La Madriguera de Lunaria para ${readingTitle}`,
      html: `
        <div style="font-family: 'Garamond', 'Times New Roman', serif; background-color: #1a1a2e; color: #e0e0e0; padding: 40px; border-radius: 15px; border: 1px solid #7b3f9e;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-family: 'Cinzel Decorative', cursive; color: #d4b3ff; font-size: 28px; margin: 0;">~ Una Cita con el Destino ~</h1>
            <p style="color: #c7a5ff; font-size: 18px;">La Madriguera de Lunaria</p>
          </div>
          <div style="font-size: 16px; line-height: 1.8;">
            <p>Saludos, alma curiosa,</p>
            <p>¡Las estrellas han confirmado tu encuentro con los arcanos! Tu cita para la lectura de <strong>${readingTitle}</strong> ha sido sellada en el gran libro del destino.</p>
            <hr style="border: none; border-top: 1px solid #5a3a70; margin: 25px 0;">
            <p style="font-size: 18px;"><strong>Detalles de tu encuentro cósmico:</strong></p>
            <p><strong>Fecha:</strong> ${formattedDate}</p>
            <p style="font-size: 18px;"><strong>Hora:</strong> ${time}</p>
            <hr style="border: none; border-top: 1px solid #5a3a70; margin: 25px 0;">
            <p>Prepárate para desvelar los susurros del universo y recibir la sabiduría que te aguarda. Si los hilos del destino tejen un nuevo camino y necesitas ajustar tu encuentro, por favor, responde a este mensaje arcano.</p>
            <p style="text-align: center; margin-top: 30px;">
              <a href="${googleCalendarUrl}" target="_blank" style="display: inline-block; padding: 12px 25px; background-color: #7b3f9e; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">
                Añadir a Google Calendar
              </a>
            </p>
            <p>¡Que la luz de la luna ilumine tu sendero hasta nuestro encuentro en La Madriguera de Lunaria!</p>
            <br>
            <p><em>Con gratitud y magia,</em></p>
            <p><em>Lunaria</em></p>
          </div>
          <div style="text-align: center; margin-top: 40px;">
            <p style="font-size: 12px; color: #8a6e9e;">&copy; 2025 La Madriguera de Lunaria. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      
      return NextResponse.json({ message: 'Correo de confirmación enviado exitosamente.' }, { status: 200 });
    } catch (mailError) {
      console.error('Error al enviar el correo con Nodemailer:', mailError);
      return NextResponse.json({ message: 'Fallo al enviar el correo.', error: (mailError as Error).message }, { status: 500 });
    }

  } catch (error) {
    console.error('Error en la API de confirmación:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: (error as Error).message }, { status: 500 });
  }
}