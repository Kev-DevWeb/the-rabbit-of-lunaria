import { NextResponse } from 'next/server';
import { availableTimes, isValidDate } from '@/lib/booking';

// Horarios libres de un día. Sustituye la lectura directa de Firestore desde el navegador,
// que exponía nombres, correos y tokens de todas las citas.
export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get('date');
  if (!isValidDate(date)) {
    return NextResponse.json({ error: 'Fecha inválida.' }, { status: 400 });
  }

  try {
    const times = await availableTimes(date);
    return NextResponse.json({ times }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Error al consultar disponibilidad:', error);
    return NextResponse.json({ error: 'No se pudieron cargar los horarios.' }, { status: 500 });
  }
}
