
import { NextResponse } from 'next/server';
import { readingsData } from '@/lib/readings-data';

// Función para obtener el token de acceso de PayPal
async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    console.error('Error al obtener token de PayPal:', errorDetails);
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const { readingId, currency } = await request.json();
    const reading = readingsData.find(r => r.id === readingId);

    if (!reading) {
      return NextResponse.json({ error: 'Lectura no encontrada.' }, { status: 404 });
    }

    const accessToken = await getPayPalAccessToken();

    let price = reading.priceValue;
    let currency_code = 'MXN';

    if (currency === 'USD') {
      price = Math.round(price * 0.05443);
      currency_code = 'USD';
    }

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency_code, // Moneda
            value: price.toString(), // El precio desde tus datos seguros
          },
          description: reading.title, // Descripción del item
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
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Error al crear la orden en PayPal:', errorDetails);
        return NextResponse.json({ error: 'No se pudo crear la orden de PayPal.' }, { status: 500 });
    }

    const order = await response.json();
    return NextResponse.json({ orderId: order.id });

  } catch (error) {
    console.error('Error interno del servidor:', error);
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Ocurrió un error inesperado.' }, { status: 500 });
  }
}
