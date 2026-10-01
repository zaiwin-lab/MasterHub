import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, checkPassword, createSessionValue, sameOrigin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { password } = (await req.json().catch(() => ({}))) as { password?: unknown };
  if (typeof password !== 'string' || !checkPassword(password)) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }
  const session = createSessionValue();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: session.maxAge,
  });
  return res;
}
