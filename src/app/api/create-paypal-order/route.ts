import { NextResponse } from 'next/server';
import { readingsData } from '@/lib/readings-data';
import { availableTimes, isValidDate, isValidTime } from '@/lib/booking';
import { getPayPalAccessToken, priceFor } from '@/lib/paypal';

export async function POST(request: Request) {
  try {
    const { readingId, currency, date, time } = await request.json();
    const reading = readingsData.find(r => r.id === readingId);

    if (!reading) {
      return NextResponse.json({ error: 'Lectura no encontrada.' }, { status: 404 });
    }

    // Antes de abrir PayPal se comprueba que el horario siga libre, para no cobrar un horario ocupado
    if (!isValidDate(date) || !isValidTime(time) || !(await availableTimes(date)).includes(time)) {
      return NextResponse.json({ error: 'Este horario ya no está disponible. Por favor, elige otro.' }, { status: 409 });
    }

    const price = priceFor(reading, currency === 'USD' ? 'USD' : 'MXN');
    const accessToken = await getPayPalAccessToken();

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: { currency_code: price.currency, value: price.value.toString() },
          description: reading.title,
        },
      ],
      application_context: {
        brand_name: 'La Madriguera de Lunaria',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/confirmation`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/citas`,
      },
    };

    const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      console.error('Error al crear la orden en PayPal:', await response.text());
      return NextResponse.json({ error: 'No se pudo crear la orden de PayPal.' }, { status: 500 });
    }

    const order = await response.json();
    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error('Error interno del servidor:', error);
    return NextResponse.json({ error: 'Ocurrió un error inesperado.' }, { status: 500 });
  }
}
