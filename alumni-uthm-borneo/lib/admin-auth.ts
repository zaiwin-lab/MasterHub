import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { adminConfig } from './env';

export const ADMIN_COOKIE = 'aub_admin';
const SESSION_HOURS = 12;

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  // Hash first so lengths always match and nothing leaks through timing.
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(candidate: string): boolean {
  return safeEqual(candidate, adminConfig().password);
}

export function createSessionValue(): { value: string; maxAge: number } {
  const exp = Date.now() + SESSION_HOURS * 3600 * 1000;
  const payload = String(exp);
  return { value: `${payload}.${sign(payload, adminConfig().secret)}`, maxAge: SESSION_HOURS * 3600 };
}

export function isValidSession(value: string | undefined): boolean {
  if (!value) return false;
  const [payload, signature] = value.split('.');
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload, adminConfig().secret))) return false;
  return Number(payload) > Date.now();
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return isValidSession(jar.get(ADMIN_COOKIE)?.value);
}

/** Admin POSTs must come from this site (cookie is SameSite=Strict too). */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
