import 'server-only';
import { NextResponse } from 'next/server';
import { isAdmin, sameOrigin } from './admin-auth';
import { db, normalise, type ContributionRow } from './db';

const ID_RE = /^[0-9a-f-]{36}$/i;

export async function findById(id: unknown): Promise<ContributionRow | NextResponse> {
  if (typeof id !== 'string' || !ID_RE.test(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const { data, error } = await db().from('contributions').select('*').eq('id', id).maybeSingle();
  if (error) return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return normalise(data);
}

/** Shared guard for admin actions: same-origin, signed session, and a valid row id. */
export async function loadAdminTarget(
  req: Request,
): Promise<{ row: ContributionRow; body: Record<string, unknown> } | NextResponse> {
  if (!sameOrigin(req) || !(await isAdmin())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const row = await findById(body.id);
  return row instanceof NextResponse ? row : { row, body };
}

/** Strip the payer's private access token before sending a row to the admin browser. */
export function forAdmin(row: ContributionRow) {
  const { access_token: _token, ...rest } = row;
  return rest;
}
