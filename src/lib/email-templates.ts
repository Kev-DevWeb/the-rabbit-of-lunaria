/**
 * Templates HTML para emails de La Madriguera de Lunaria.
 * Centralizados para evitar duplicación y facilitar mantenimiento.
 */

const currentYear = () => new Date().getFullYear();

/** Estilos CSS base compartidos por todos los templates */
const BASE_STYLES = `body{margin:0;padding:0;background-color:#1a1a2e;}.wrapper{font-family:'Cormorant Garamond',serif;background-color:#1a1a2e;color:#e0e0e0;padding:20px;max-width:600px;margin:auto;}.header{text-align:center;margin-bottom:30px;}.title{font-family:'Cinzel Decorative',cursive;color:#FFFFFF;font-size:28px;margin:0;}.subtitle{color:#FFFFFF;font-size:18px;}.content{font-size:16px;line-height:1.8;}.hr{border:none;border-top:1px solid #5a3a70;margin:25px 0;}.p-strong{font-size:18px;margin:10px 0;}.p-strong strong{color:#FFFFFF;}.link{color:#fde047;text-decoration:none;font-weight:bold;}.footer{text-align:center;margin-top:40px;}.footer-text{font-size:12px;color:#9ca3af;}`;

/** Head HTML compartido con fuentes y estilos */
const htmlHead = (extraStyles = '') =>
  `<!DOCTYPE html><html><head><meta charset="UTF-8"><link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative&family=Cormorant+Garamond&display=swap" rel="stylesheet"><style>${BASE_STYLES}${extraStyles}</style></head>`;

/** Footer HTML compartido */
const htmlFooter = () =>
  `<div class="footer"><p class="footer-text">&copy; ${currentYear()} La Madriguera de Lunaria. Todos los derechos reservados.</p></div></div></body></html>`;

// ─── Templates de Email ─────────────────────────────────────────────────────

interface BookingEmailData {
  name: string;
  email: string;
  date: string;
  time: string;
  readingTitle: string;
  paymentId?: string;
  paymentMethod?: string;
  cancelToken?: string;
  calendarLink: string;
  appBaseUrl: string;
}

/**
 * Email al usuario: Cita confirmada (PayPal pagado)
 */
export function userConfirmedEmail(data: BookingEmailData): string {
  return `${htmlHead()}<body><div class="wrapper">
    <div class="header"><h1 class="title">~ La Madriguera de Lunaria ~</h1><p class="subtitle">¡Cita Confirmada!</p></div>
    <div class="content">
      <p>Saludos, ${data.name},</p>
      <p>¡Excelente noticia! Tu pago ha sido recibido y tu cita para la lectura de tarot ha sido confirmada.</p>
      <hr class="hr">
      <p class="p-strong"><strong>Detalles de tu cita:</strong></p>
      <p><strong>Fecha:</strong> ${data.date}</p>
      <p><strong>Hora:</strong> ${data.time}</p>
      <p><strong>Lectura:</strong> ${data.readingTitle}</p>
      <hr class="hr">
      <p>¡Estamos ansiosos por nuestro encuentro!</p>
      <p><em>Con gratitud y magia,</em></p>
      <p><em>Lunaria</em></p>
    </div>${htmlFooter()}`;
}

/**
 * Email al admin: Cita confirmada por PayPal
 */
export function adminConfirmedEmail(data: BookingEmailData): string {
  return `${htmlHead()}<body><div class="wrapper">
    <div class="header"><h1 class="title">~ Cita Confirmada ~</h1><p class="subtitle">La Madriguera de Lunaria</p></div>
    <div class="content">
      <p>¡Excelente noticia! Una cita ha sido confirmada automáticamente a través de PayPal.</p>
      <hr class="hr">
      <p class="p-strong"><strong>Detalles de la cita:</strong></p>
      <p><strong>Nombre del cliente:</strong> ${data.name}</p>
      <p><strong>Email del cliente:</strong> ${data.email}</p>
      <p><strong>Fecha:</strong> ${data.date}</p>
      <p><strong>Hora:</strong> ${data.time}</p>
      <p><strong>Lectura:</strong> ${data.readingTitle}</p>
      <p><strong>Método de Pago:</strong> PayPal (Pago Recibido)</p>
      <p><strong>ID de Transacción:</strong> ${data.paymentId}</p>
      <hr class="hr">
      <p>Añade esta cita a tu calendario:</p>
      <p><a href="${data.calendarLink}" target="_blank" class="link">Añadir a Google Calendar</a></p>
    </div>${htmlFooter()}`;
}

/**
 * Email al usuario: Cita pendiente (transferencia bancaria)
 */
export function userPendingEmail(data: BookingEmailData): string {
  const extraStyles = `.payment-info{font-size:18px;color:#FFFFFF;}.link{color:#fde047;text-decoration:none;}`;
  return `${htmlHead(extraStyles)}<body><div class="wrapper">
    <div class="header"><h1 class="title">~ La Madriguera de Lunaria ~</h1><p class="subtitle">Confirmación de Cita</p></div>
    <div class="content">
      <p>Saludos, buscador/a de la verdad,</p>
      <p>Tu intención de explorar los misterios del tarot ha sido recibida. Tu solicitud para una lectura ha sido anotada y está a la espera de su confirmación.</p>
      <hr class="hr">
      <p class="p-strong"><strong>Los hilos del destino tejen tu cita:</strong></p>
      <p><strong>Fecha:</strong> ${data.date}</p>
      <p><strong>Hora:</strong> ${data.time}</p>
      <p><strong>Lectura:</strong> ${data.readingTitle}</p>
      <hr class="hr">
      <p><strong>Para confirmar tu cita:</strong></p>
      <p>Se requiere el pago de la lectura para asegurar tu espacio. Por favor, realiza el depósito a la siguiente cuenta:</p>
      <p class="payment-info"><strong>Número de cuenta:</strong> [Tu número de cuenta]</p>
      <p class="payment-info"><strong>A nombre de:</strong> [Tu Nombre]</p>
      <p>Una vez realizado el pago, <strong>responde a este correo</strong> con tu comprobante para confirmar tu cita.</p>
      <p>Si los vientos del cambio te llevan por otro sendero, puedes liberar tu compromiso aquí: <a href="${data.appBaseUrl}/api/cancelAppointment?token=${data.cancelToken}" class="link">Cancelar Cita</a></p>
      <br><p>¡Que la luz de la luna ilumine tu camino hasta nuestro encuentro!</p>
      <p><em>Con gratitud y magia,</em></p>
      <p><em>Lunaria</em></p>
    </div>${htmlFooter()}`;
}

/**
 * Email al admin: Nueva cita pendiente (transferencia)
 */
export function adminPendingEmail(data: BookingEmailData): string {
  const extraStyles = `.link-white{color:#FFFFFF;text-decoration:none;}`;
  return `${htmlHead(extraStyles)}<body><div class="wrapper">
    <div class="header"><h1 class="title">~ Nueva Cita Pendiente ~</h1><p class="subtitle">La Madriguera de Lunaria</p></div>
    <div class="content">
      <p>Un nuevo hilo se ha tejido en el tapiz del destino. Aquí están los detalles de la cita pendiente:</p>
      <hr class="hr">
      <p class="p-strong"><strong>Nombre del buscador:</strong> ${data.name}</p>
      <p class="p-strong"><strong>Email de contacto:</strong> ${data.email}</p>
      <p class="p-strong"><strong>Fecha del encuentro:</strong> ${data.date}</p>
      <p class="p-strong"><strong>Hora señalada:</strong> ${data.time}</p>
      <p class="p-strong"><strong>Lectura solicitada:</strong> ${data.readingTitle}</p>
      <p class="p-strong"><strong>Método de Pago:</strong> ${data.paymentMethod}</p>
      <hr class="hr">
      <p>Añade esta cita a tu calendario:</p>
      <p><a href="${data.calendarLink}" target="_blank" class="link">Añadir a Google Calendar</a></p>
    </div>${htmlFooter()}`;
}
