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

const amountMatches = (amount: { currency_code?: string; value?: string } | undefined, expected: { value: number; currency: string }) =>
  amount?.currency_code === expected.currency && Number(amount?.value) === Number(expected.value);

/** Lee una orden sin tocarla */
export async function getOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error(`PayPal GET order ${response.status}`);
  return response.json();
}

/**
 * Antes de cobrar: la orden tiene que estar aprobada por el cliente y ser por el monto y la moneda
 * de la lectura. Así nunca se cobra una orden que después habría que rechazar.
 */
export async function validateOrderBeforeCapture(orderId: string, expected: { value: number; currency: string }) {
  const order = await getOrder(orderId);
  const ok = order?.status === 'APPROVED' && amountMatches(order?.purchase_units?.[0]?.amount, expected);
  return { ok, status: order?.status as string | undefined };
}

/**
 * Resultado del cobro:
 * - `completed`: PayPal confirmó el pago por el monto correcto.
 * - `declined`: PayPal respondió con error y no cobró; se puede liberar el horario.
 * - `review`: el resultado no es seguro (pago pendiente, respuesta perdida, monto raro).
 *   No se libera el horario: queda para revisión manual.
 */
export type CaptureOutcome =
  | { kind: 'completed'; captureId: string }
  | { kind: 'declined'; reason: string }
  | { kind: 'review'; reason: string; captureId?: string };

export async function captureOrder(orderId: string, expected: { value: number; currency: string }): Promise<CaptureOutcome> {
  const accessToken = await getPayPalAccessToken();
  let response: Response;
  try {
    response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`, 'PayPal-Request-Id': `capture-${orderId}` },
    });
  } catch (error) {
    // Sin respuesta no se sabe si PayPal cobró
    return { kind: 'review', reason: `NETWORK: ${String(error)}` };
  }

  const data = await response.json().catch(() => null);
  if (!data) return { kind: 'review', reason: `UNPARSEABLE_RESPONSE_${response.status}` };

  if (!response.ok) {
    const issue = data?.details?.[0]?.issue || data?.name || 'CAPTURE_FAILED';
    // Un 5xx no garantiza que no se haya cobrado
    return response.status >= 500 ? { kind: 'review', reason: issue } : { kind: 'declined', reason: issue };
  }

  const capture = data?.purchase_units?.[0]?.payments?.captures?.[0];
  if (data.status === 'COMPLETED' && capture?.status === 'COMPLETED' && amountMatches(capture?.amount, expected)) {
    return { kind: 'completed', captureId: capture.id };
  }
  return { kind: 'review', reason: `STATUS_${capture?.status ?? data.status}`, captureId: capture?.id };
}
