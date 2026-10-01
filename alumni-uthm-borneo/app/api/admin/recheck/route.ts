import { NextResponse } from 'next/server';
import { loadAdminTarget } from '@/lib/admin-route';
import { verifyContribution } from '@/lib/payments';

export const runtime = 'nodejs';

/** Re-query ToyyibPay for a PENDING/FAILED row, e.g. if a callback never arrived. */
export async function POST(req: Request) {
  const row = await loadAdminTarget(req);
  if (row instanceof NextResponse) return row;
  try {
    const { access_token: _token, ...updated } = await verifyContribution(row);
    return NextResponse.json({ ok: true, status: updated.payment_status, row: updated });
  } catch (err) {
    console.error('[admin-recheck]', row.contribution_id, err);
    return NextResponse.json({ error: 'ToyyibPay could not be reached. Try again shortly.' }, { status: 502 });
  }
}
