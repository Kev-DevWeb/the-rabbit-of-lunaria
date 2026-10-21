import 'server-only';
import type { TarotReading } from '@/types/readings';

export type Currency = 'MXN' | 'USD';

export async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  if (!response.ok) {
    console.error('Error al obtener token de PayPal:', await response.text());
    throw new Error('Failed to get PayPal access token');
  }
  return (await response.json()).access_token;
}

/** Precio que se cobra por una lectura, calculado siempre en el servidor */
export function priceFor(reading: TarotReading, currency: Currency) {
  return currency === 'USD'
    ? { value: reading.priceValueUSD, currency: 'USD' as const }
    : { value: reading.priceValue, currency: 'MXN' as const };
}

export interface CaptureResult {
  ok: boolean;
  captureId?: string;
  reason?: string;
}

/**
 * Cobra la orden en el servidor y comprueba que el monto y la moneda sean los de la lectura.
 * Así una cita solo queda confirmada si PayPal de verdad recibió el pago correcto.
 */
export async function captureOrder(orderId: string, expected: { value: number; currency: string }): Promise<CaptureResult> {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json();

  if (!response.ok) {
    console.error('Error al capturar la orden de PayPal:', data);
    return { ok: false, reason: data?.details?.[0]?.issue || data?.name || 'CAPTURE_FAILED' };
  }

  const capture = data?.purchase_units?.[0]?.payments?.captures?.[0];
  const amount = capture?.amount;
  const paidRight =
    data.status === 'COMPLETED' &&
    capture?.status === 'COMPLETED' &&
    amount?.currency_code === expected.currency &&
    Number(amount?.value) === Number(expected.value);

  return paidRight ? { ok: true, captureId: capture.id } : { ok: false, captureId: capture?.id, reason: 'AMOUNT_MISMATCH' };
}
