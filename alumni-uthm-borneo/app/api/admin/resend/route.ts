import { NextResponse } from 'next/server';
import { loadAdminTarget } from '@/lib/admin-route';
import { emailEnabled } from '@/lib/email';
import { deliverReceipt } from '@/lib/payments';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const target = await loadAdminTarget(req);
  if (target instanceof NextResponse) return target;
  const { row } = target;
  if (row.payment_status !== 'PAID') {
    return NextResponse.json({ error: 'Receipts can only be sent for verified contributions.' }, { status: 409 });
  }
  if (!emailEnabled()) {
    return NextResponse.json({ error: 'Email is not configured yet (RESEND_API_KEY / EMAIL_FROM_ADDRESS).' }, { status: 503 });
  }
  try {
    await deliverReceipt(row);
    return NextResponse.json({ ok: true, message: `Receipt sent to ${row.email}` });
  } catch (err) {
    console.error('[admin-resend]', row.contribution_id, err);
    return NextResponse.json({ error: 'Email could not be sent. Check the email provider settings.' }, { status: 502 });
  }
}
