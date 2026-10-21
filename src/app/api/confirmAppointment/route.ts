import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { readingsData } from '@/lib/readings-data';
import { googleCalendarLink } from '@/lib/booking';
import { sendMailSafe } from '@/lib/mailer';
import { adminTransferConfirmedEmail, escapeHtml, userTransferConfirmedEmail } from '@/lib/email-templates';

/**
 * Confirmación de citas por transferencia, desde el enlace del correo de la administradora.
 * - GET solo muestra los datos y un botón: los escáneres de correo y las vistas previas
 *   abren enlaces solos, así que abrir el enlace no puede confirmar nada.
 * - POST (el botón) confirma y envía los correos. Si alguno falla, el mismo botón lo reintenta.
 */

async function findByToken(token: string) {
  const snapshot = await adminDb.collection('bookings').where('confirmToken', '==', token).limit(1).get();
  return snapshot.empty ? null : snapshot.docs[0];
}

const page = (title: string, body: string, status = 200) =>
  new NextResponse(
    `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title>
    <style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#07061a;color:#ece6ff;font-family:Georgia,serif;padding:16px}
    main{max-width:520px;width:100%;border:1px solid rgba(233,196,106,.4);border-radius:20px;padding:32px;background:#110e2b}
    h1{margin:0 0 16px;font-size:26px;color:#fdf8ff}dl{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin:0 0 24px}dt{color:#a79fc9}dd{margin:0}
    button{min-height:48px;padding:0 28px;border:0;border-radius:999px;background:#e9c46a;color:#07061a;font-size:16px;font-weight:600;cursor:pointer}
    p{color:#d7cfef}</style></head><body><main>${body}</main></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token');
  const doc = token ? await findByToken(token).catch(() => null) : null;
  if (!token || !doc) {
    return page('Enlace no válido', '<h1>Enlace no válido</h1><p>No encontramos una cita con este enlace.</p>', 404);
  }

  const a = doc.data();
  const mailsPending = a.status === 'confirmed' && !(a.mails?.customerConfirmed && a.mails?.adminConfirmed);
  const details = `<dl><dt>Cliente</dt><dd>${escapeHtml(a.name)}</dd><dt>Correo</dt><dd>${escapeHtml(a.email)}</dd>
    <dt>Lectura</dt><dd>${escapeHtml(a.readingTitle)}</dd><dt>Fecha</dt><dd>${escapeHtml(a.date)} · ${escapeHtml(a.time)}</dd>
    <dt>Estado</dt><dd>${escapeHtml(a.status)}</dd></dl>`;
  const form = (label: string) =>
    `<form method="post"><input type="hidden" name="token" value="${escapeHtml(token)}"><button type="submit">${label}</button></form>`;

  if (a.status === 'confirmed' && !mailsPending) {
    return page('Cita confirmada', `<h1>Esta cita ya está confirmada</h1>${details}<p>Los correos ya se enviaron.</p>`);
  }
  if (mailsPending) {
    return page('Reenviar correos', `<h1>Cita confirmada, faltan correos</h1>${details}<p>Algún correo de confirmación no se pudo enviar.</p>${form('Reenviar correos')}`);
  }
  return page(
    'Confirmar cita',
    `<h1>¿Recibiste la transferencia?</h1>${details}<p>Al confirmar, se le avisa al cliente por correo.</p>${form('Confirmar cita')}`,
  );
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const token = form?.get('token');
  const doc = typeof token === 'string' && token ? await findByToken(token).catch(() => null) : null;
  if (!doc) {
    return NextResponse.redirect(new URL('/confirmation/error', request.url), 303);
  }

  try {
    const appointment = doc.data();
    if (appointment.status !== 'confirmed') {
      await doc.ref.update({ status: 'confirmed', confirmedAt: new Date().toISOString() });
    }

    const reading = readingsData.find(r => r.id === appointment.readingId);
    const emailData = {
      name: appointment.name,
      email: appointment.email,
      date: appointment.date,
      time: appointment.time,
      readingTitle: appointment.readingTitle,
      paymentMethod: appointment.paymentMethod,
      cancelToken: appointment.cancelToken,
      appBaseUrl: process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin,
      calendarLink: googleCalendarLink(
        `Lectura de tarot: ${appointment.readingTitle}`,
        `Cliente: ${appointment.name}\nEmail: ${appointment.email}\nLectura: ${appointment.readingTitle}`,
        appointment.date,
        appointment.time,
        reading?.duration || 30,
      ),
    };

    // Solo se envía lo que falta; el resultado de cada correo queda guardado para poder reintentar
    const mails = { customerConfirmed: false, adminConfirmed: false, ...(appointment.mails ?? {}) };
    if (!mails.customerConfirmed) {
      mails.customerConfirmed = await sendMailSafe(appointment.email, 'Tu cita en La Madriguera de Lunaria está confirmada', userTransferConfirmedEmail(emailData));
    }
    if (!mails.adminConfirmed) {
      mails.adminConfirmed = await sendMailSafe(
        process.env.ADMIN_EMAIL,
        `¡Cita Confirmada Manualmente: ${appointment.readingTitle} con ${appointment.name}!`,
        adminTransferConfirmedEmail(emailData),
      );
    }
    await doc.ref.update({ mails });

    // Si falta algún correo se vuelve a la página del enlace, que ofrece reenviarlo
    if (!mails.customerConfirmed || !mails.adminConfirmed) {
      return NextResponse.redirect(new URL(`/api/confirmAppointment?token=${encodeURIComponent(token as string)}`, request.url), 303);
    }
    return NextResponse.redirect(new URL('/confirmation/confirmed', request.url), 303);
  } catch (error) {
    console.error('Error confirming appointment:', error);
    return NextResponse.redirect(new URL('/confirmation/error', request.url), 303);
  }
}
