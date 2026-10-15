import { NextResponse } from 'next/server';
import { forAdmin, loadAdminTarget } from '@/lib/admin-route';
import { rejectPayment } from '@/lib/payments';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const target = await loadAdminTarget(req);
  if (target instanceof NextResponse) return target;
  const reason = typeof target.body.reason === 'string' ? target.body.reason.trim().slice(0, 300) : '';
  if (!reason) return NextResponse.json({ error: 'Give a reason so the contributor knows what to fix.' }, { status: 400 });
  try {
    const row = await rejectPayment(target.row, reason);
    return NextResponse.json({ ok: true, row: forAdmin(row), message: `${row.contribution_id} marked as not verified.` });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 409 });
  }
}
