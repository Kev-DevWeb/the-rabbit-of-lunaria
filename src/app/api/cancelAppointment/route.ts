import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import * as nodemailer from 'nodemailer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token'); // Changed from 'id' to 'token'

  if (!token) {
    return NextResponse.redirect(new URL('/confirmation/error?message=' + encodeURIComponent('Missing cancellation token.'), request.url));
  }

  try {
    // Find the appointment using the cancelToken
    const bookingsRef = adminDb.collection("bookings");
    const q = bookingsRef.where("cancelToken", "==", token);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return NextResponse.redirect(new URL('/confirmation/error?message=' + encodeURIComponent('Invalid or expired cancellation token.'), request.url));
    }

    // Assuming tokens are unique, there should only be one document
    const appointmentDoc = querySnapshot.docs[0];
    const appointmentData = appointmentDoc.data();

    const userEmail = appointmentData?.email;
    const readingTitle = appointmentData?.readingTitle;
    const date = appointmentData?.date;
    const time = appointmentData?.time;
    const name = appointmentData?.name;

    await adminDb.collection("bookings").doc(appointmentDoc.id).delete(); // Delete the document

    // Send cancellation email to the user
    if (userEmail) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const userMailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: userEmail,
        subject: "Tu cita en La Madriguera de Lunaria ha sido cancelada",
        html: `
          <div style="font-family: 'Garamond', 'Times New Roman', serif; background-color: #1a1a2e; color: #FFFFFF; padding: 40px; border-radius: 15px; border: 1px solid #9e7b9e;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="font-family: 'Cinzel Decorative', cursive; color: #FFFFFF; font-size: 28px; margin: 0;">~ Un Velo de Incertidumbre ~</h1>
              <p style="color: #FFFFFF; font-size: 18px;">La Madriguera de Lunaria</p>
            </div>
            <div style="font-size: 16px; line-height: 1.8;">
              <p>Saludos, ${name},</p>
              <p>Lamentamos informarte que tu cita para la lectura de <strong>${readingTitle}</strong>, programada para el <strong>${date}</strong> a las <strong>${time}</strong>, ha sido cancelada.</p>
              <hr style="border: none; border-top: 1px solid #5a3a70; margin: 25px 0;">
              <p>Los hilos del destino a veces se deshilachan, pero nuevas oportunidades siempre surgen. Si deseas reagendar en otro momento, no dudes en visitar nuestra madriguera nuevamente.</p>
              <br>
              <p><em>Con gratitud y comprensión,</em></p>
              <p><em>Lunaria</em></p>
            </div>
            <div style="text-align: center; margin-top: 40px;">
              <p style="font-size: 12px; color: #FFFFFF;">&copy; ${new Date().getFullYear()} La Madriguera de Lunaria. Todos los derechos reservados.</p>
            </div>
          </div>
        `,
      };
      await transporter.sendMail(userMailOptions);
    }

    return NextResponse.redirect(new URL('/confirmation/cancelled', request.url));

  } catch (error: unknown) {
    console.error("Error canceling appointment:", error);
    let errorMessage = 'Ocurrió un error al cancelar la cita.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.redirect(new URL('/confirmation/error?message=' + encodeURIComponent(errorMessage), request.url));
  }
}