import 'server-only';
import * as nodemailer from 'nodemailer';

const transporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_EMAIL, pass: process.env.GMAIL_APP_PASSWORD },
  });

/**
 * Envía un correo sin tumbar la operación que lo pidió: si Gmail falla,
 * la cita ya quedó guardada y solo se registra el error.
 */
export async function sendMailSafe(to: string | undefined, subject: string, html: string): Promise<boolean> {
  if (!to) return false;
  try {
    await transporter().sendMail({
      from: `"La Madriguera de Lunaria" <${process.env.GMAIL_EMAIL}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error(`Error al enviar el correo "${subject}":`, error);
    return false;
  }
}
