import 'server-only';
import { adminDb } from '@/lib/firebaseAdmin';

/**
 * Reglas de agenda del lado del servidor. Todo se calcula en hora de Ciudad de México,
 * no en la del servidor (Vercel corre en UTC) ni en la del navegador de quien agenda.
 */

export const TIMEZONE = 'America/Mexico_City';
// México dejó el horario de verano en 2022: el centro del país es UTC-6 todo el año
const MX_OFFSET = '-06:00';

const WEEKEND_SLOTS = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
const WEEKDAY_SLOTS = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
const ACTIVE_STATUSES = ['pending', 'confirmed', 'processing'];

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

/** Horas ocupadas de un día. Solo regresa horas, nunca datos de clientes. */
export async function takenTimes(date: string): Promise<Set<string>> {
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
