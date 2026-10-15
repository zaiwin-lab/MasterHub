import { NextResponse } from 'next/server';
import { forAdmin, loadAdminTarget } from '@/lib/admin-route';
import { verifyPayment } from '@/lib/payments';

export const runtime = 'nodejs';

/** Admin confirms the money is on the KOBIS bank statement. */
export async function POST(req: Request) {
  const target = await loadAdminTarget(req);
  if (target instanceof NextResponse) return target;
  const reference = typeof target.body.reference === 'string' ? target.body.reference.slice(0, 80) : '';
  try {
    const result = await verifyPayment(target.row, reference);
    return NextResponse.json({
      ok: true,
      row: forAdmin(result.row),
      message: result.emailed
        ? `Verified. Receipt emailed to ${result.row.email}.`
        : `Verified. Receipt not emailed: ${result.emailError}.`,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 409 });
  }
}
