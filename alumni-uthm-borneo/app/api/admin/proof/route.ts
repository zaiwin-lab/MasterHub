import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { findById } from '@/lib/admin-route';
import { proofSignedUrl } from '@/lib/payments';

export const runtime = 'nodejs';

/** Opens the private proof file through a 2-minute signed link. */
export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const row = await findById(new URL(req.url).searchParams.get('id'));
  if (row instanceof NextResponse) return row;
  const url = await proofSignedUrl(row);
  if (!url) return NextResponse.json({ error: 'No proof uploaded for this contribution.' }, { status: 404 });
  return NextResponse.redirect(url, { headers: { 'Cache-Control': 'no-store' } });
}
