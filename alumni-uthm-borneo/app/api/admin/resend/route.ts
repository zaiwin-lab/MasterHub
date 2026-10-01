import { NextResponse } from 'next/server';
import { loadAdminTarget } from '@/lib/admin-route';
import { deliverReceipt } from '@/lib/payments';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const row = await loadAdminTarget(req);
  if (row instanceof NextResponse) return row;
  if (row.payment_status !== 'PAID') {
    return NextResponse.json({ error: 'Receipts can only be sent for PAID contributions.' }, { status: 409 });
  }
  try {
    await deliverReceipt(row);
    return NextResponse.json({ ok: true, message: `Receipt sent to ${row.email}` });
  } catch (err) {
    console.error('[admin-resend]', row.contribution_id, err);
    return NextResponse.json({ error: 'Email could not be sent. Check the email provider settings.' }, { status: 502 });
  }
}
