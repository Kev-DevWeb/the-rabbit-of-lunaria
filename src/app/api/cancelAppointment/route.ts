import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { sendMailSafe } from '@/lib/mailer';
import { escapeHtml } from '@/lib/email-templates';

/**
 * Cancelación desde el enlace del correo del cliente.
 * - GET solo muestra la cita y un botón: los escáneres de correo abren enlaces solos
 *   y antes eso bastaba para borrar la cita.
 * - POST (el botón) la cancela y libera el horario.
 */

async function findByToken(token: string) {
  const snapshot = await adminDb.collection('bookings').where('cancelToken', '==', token).limit(1).get();
  return snapshot.empty ? null : snapshot.docs[0];
}

const page = (title: string, body: string, status = 200) =>
  new NextResponse(
    `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title>
    <style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#07061a;color:#ece6ff;font-family:Georgia,serif;padding:16px}
    main{max-width:520px;width:100%;border:1px solid rgba(233,196,106,.4);border-radius:20px;padding:32px;background:#110e2b}
    h1{margin:0 0 16px;font-size:26px;color:#fdf8ff}p{color:#d7cfef}
    button{min-height:48px;padding:0 28px;border:1px solid #e9c46a;border-radius:999px;background:transparent;color:#e9c46a;font-size:16px;cursor:pointer}</style></head>
    <body><main>${body}</main></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token');
  const doc = token ? await findByToken(token).catch(() => null) : null;
  if (!token || !doc) {
    return page('Enlace no válido', '<h1>Enlace no válido</h1><p>Esta cita no existe o ya fue cancelada.</p>', 404);
  }
  const a = doc.data();
  return page(
    'Cancelar cita',
    `<h1>¿Cancelar tu cita?</h1>
     <p>${escapeHtml(a.readingTitle)}<br>${escapeHtml(a.date)} · ${escapeHtml(a.time)} (hora del centro de México)</p>
     <form method="post"><input type="hidden" name="token" value="${escapeHtml(token)}"><button type="submit">Sí, cancelar cita</button></form>`,
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
    const a = doc.data();
    await doc.ref.delete();

    await sendMailSafe(
      a.email,
      'Tu cita en La Madriguera de Lunaria ha sido cancelada',
      `<div style="font-family:Georgia,serif;background-color:#1a1a2e;color:#FFFFFF;padding:40px;border-radius:15px;border:1px solid #9e7b9e;">
        <h1 style="font-size:26px;text-align:center;">~ Un Velo de Incertidumbre ~</h1>
        <p>Saludos, ${escapeHtml(a.name)},</p>
        <p>Tu cita para la lectura de <strong>${escapeHtml(a.readingTitle)}</strong>, programada para el <strong>${escapeHtml(a.date)}</strong> a las <strong>${escapeHtml(a.time)}</strong>, ha sido cancelada.</p>
        <p>Si deseas reagendar en otro momento, visita nuevamente nuestra madriguera.</p>
        <p><em>Con gratitud y comprensión,</em><br><em>Lunaria</em></p>
      </div>`,
    );

    return NextResponse.redirect(new URL('/confirmation/cancelled', request.url), 303);
  } catch (error) {
    console.error('Error canceling appointment:', error);
    return NextResponse.redirect(new URL('/confirmation/error', request.url), 303);
  }
}
