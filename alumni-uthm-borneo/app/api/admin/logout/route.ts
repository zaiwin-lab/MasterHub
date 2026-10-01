import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, sameOrigin } from '@/lib/admin-auth';

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 0 });
  return res;
}
