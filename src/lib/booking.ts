import 'server-only';
import { adminDb } from '@/lib/firebaseAdmin';
import { getOrder } from '@/lib/paypal';

/**
 * Reglas de agenda del lado del servidor. Todo se calcula en hora de Ciudad de México,
 * no en la del servidor (Vercel corre en UTC) ni en la del navegador de quien agenda.
 */

export const TIMEZONE = 'America/Mexico_City';
// México dejó el horario de verano en 2022: el centro del país es UTC-6 todo el año
const MX_OFFSET = '-06:00';

const WEEKEND_SLOTS = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
const WEEKDAY_SLOTS = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
// processing: apartado mientras se cobra con PayPal · payment_review: cobro dudoso, revisar a mano
const ACTIVE_STATUSES = ['pending', 'confirmed', 'processing', 'payment_review'];
// Tiempo máximo de un apartado "processing"; después se concilia con PayPal
export const HOLD_MINUTES = 15;

export class SlotTakenError extends Error {
  constructor() {
    super('Este horario ya no está disponible. Por favor, elige otro.');
  }
}

export const isValidDate = (date: unknown): date is string =>
  typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(`${date}T00:00:00Z`));

export const isValidTime = (time: unknown): time is string => typeof time === 'string' && /^\d{2}:\d{2}$/.test(time);

/** Instante real (UTC) de una fecha y hora de Ciudad de México */
export const mexicoDateTime = (date: string, time: string) => new Date(`${date}T${time}:00${MX_OFFSET}`);

/** Horarios que ofrece el calendario para ese día, sin los que ya pasaron */
export function baseSlotsFor(date: string, now = new Date()): string[] {
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  const slots = weekday === 0 || weekday === 6 ? WEEKEND_SLOTS : WEEKDAY_SLOTS;
  return slots.filter((time) => mexicoDateTime(date, time).getTime() > now.getTime());
}

/** Id del documento: uno por día y hora, así Firestore no deja guardar dos citas en el mismo horario */
export const slotId = (date: string, time: string) => `${date}_${time.replace(':', '')}`;

/**
 * Apartados "processing" vencidos (el proceso se cortó entre apartar y cobrar).
 * Se concilian con PayPal antes de soltarlos: si la orden sí se cobró, el horario se queda
 * en revisión; si no se cobró, se libera. Si PayPal no responde, se deja como está.
 */
export async function reconcileExpiredHolds(date: string): Promise<void> {
  const snapshot = await adminDb.collection('bookings').where('date', '==', date).where('status', '==', 'processing').get();
  const now = Date.now();

  await Promise.all(
    snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const expiresAt = Date.parse(data.holdExpiresAt ?? data.createdAt ?? '');
      if (!Number.isFinite(expiresAt) || expiresAt > now) return;
      try {
        const order = data.paypalOrderId ? await getOrder(data.paypalOrderId) : null;
        if (order?.status === 'COMPLETED') {
          const captureId = order.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? null;
          await doc.ref.update({ status: 'payment_review', paymentId: captureId, reviewReason: 'HOLD_EXPIRED_BUT_PAID' });
        } else {
          await doc.ref.delete();
        }
      } catch (error) {
        console.error('No se pudo conciliar el apartado vencido', doc.id, error);
      }
    }),
  );
}

/** Horas ocupadas de un día. Solo regresa horas, nunca datos de clientes. */
export async function takenTimes(date: string): Promise<Set<string>> {
  await reconcileExpiredHolds(date);
  const snapshot = await adminDb
    .collection('bookings')
    .where('date', '==', date)
    .where('status', 'in', ACTIVE_STATUSES)
    .get();
  return new Set(snapshot.docs.map((doc) => doc.data().time as string));
}

export async function availableTimes(date: string): Promise<string[]> {
  const taken = await takenTimes(date);
  return baseSlotsFor(date).filter((time) => !taken.has(time));
}

/**
 * Aparta el horario dentro de una transacción. Revisa el documento del horario y también
 * las citas antiguas que se guardaron con id aleatorio. Lanza SlotTakenError si está ocupado.
 */
export async function reserveSlot(date: string, time: string, data: Record<string, unknown>) {
  const ref = adminDb.collection('bookings').doc(slotId(date, time));
  const legacyQuery = adminDb
    .collection('bookings')
    .where('date', '==', date)
    .where('time', '==', time)
    .where('status', 'in', ACTIVE_STATUSES)
    .limit(1);

  await adminDb.runTransaction(async (tx) => {
    const [slotDoc, legacy] = await Promise.all([tx.get(ref), tx.get(legacyQuery)]);
    const slotBusy = slotDoc.exists && ACTIVE_STATUSES.includes(slotDoc.data()?.status);
    const legacyBusy = legacy.docs.some((doc) => doc.id !== ref.id);
    if (slotBusy || legacyBusy) throw new SlotTakenError();
    tx.set(ref, { ...data, date, time });
  });

  return ref;
}

/** Link de Google Calendar con la hora correcta de México */
export function googleCalendarLink(title: string, description: string, date: string, time: string, durationMinutes: number) {
  const start = mexicoDateTime(date, time);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: description,
    ctz: TIMEZONE,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
