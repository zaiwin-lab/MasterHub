import 'server-only';
import { NextResponse } from 'next/server';
import { isAdmin, sameOrigin } from './admin-auth';
import { db, normalise, type ContributionRow } from './db';

/** Shared guard for admin actions: same-origin, signed session, and a valid row id. */
export async function loadAdminTarget(req: Request): Promise<ContributionRow | NextResponse> {
  if (!sameOrigin(req) || !(await isAdmin())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { id } = (await req.json().catch(() => ({}))) as { id?: unknown };
  if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const { data, error } = await db().from('contributions').select('*').eq('id', id).maybeSingle();
  if (error) return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return normalise(data);
}
