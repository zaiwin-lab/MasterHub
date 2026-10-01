import { db, normalise } from '@/lib/db';
import { verifyContribution } from '@/lib/payments';

export const runtime = 'nodejs';

/**
 * ToyyibPay server-to-server callback (POST, form-encoded: refno, status, billcode, order_id, amount...).
 * The payload only tells us WHICH bill to check. Payment state comes from ToyyibPay's API.
 */
export async function POST(req: Request) {
  let billCode = '';
  try {
    const form = await req.formData();
    billCode = String(form.get('billcode') ?? '');
  } catch {
    return new Response('Bad request', { status: 400 });
  }
  if (!/^[A-Za-z0-9]{4,32}$/.test(billCode)) return new Response('Bad request', { status: 400 });

  const { data, error } = await db().from('contributions').select('*').eq('toyyibpay_bill_code', billCode).maybeSingle();
  if (error) {
    console.error('[callback] lookup failed', error);
    return new Response('Error', { status: 500 });
  }
  if (!data) return new Response('OK', { status: 200 });

  try {
    await verifyContribution(normalise(data));
  } catch (err) {
    console.error('[callback] verify failed', billCode, err);
    return new Response('Error', { status: 500 });
  }
  return new Response('OK', { status: 200 });
}
