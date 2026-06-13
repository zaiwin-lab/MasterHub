// ===========================================================================
// DB — optional Supabase backend (zero-dependency, uses PostgREST over fetch).
// When window.KOBIS_CONFIG has a url + anon key, the app becomes a real
// multi-device service: data is hydrated from Supabase on boot and every
// change is mirrored back. With no config, this module is inert and the app
// runs in browser-only (localStorage) mode exactly as before.
//
// Anon keys are designed to be public; security is enforced by Row Level
// Security policies in Supabase (see supabase-schema.sql).
// ===========================================================================

const TABLES = ['prospects', 'clients', 'orders', 'referrals', 'credit_wallets', 'waitlist', 'team_members'];

function cfg() {
  const c = (typeof window !== 'undefined' && window.KOBIS_CONFIG) || {};
  return { url: (c.supabaseUrl || '').replace(/\/$/, ''), key: c.supabaseAnonKey || '' };
}

export function isConfigured() {
  const { url, key } = cfg();
  return !!(url && key && url.startsWith('http'));
}

function headers() {
  const { key } = cfg();
  return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
}

// Pull every table into one snapshot. Returns null on any failure so the
// caller can fall back to local data instead of showing an empty app.
export async function hydrateAll() {
  if (!isConfigured()) return null;
  const { url } = cfg();
  try {
    const out = {};
    await Promise.all(TABLES.map(async (t) => {
      const res = await fetch(`${url}/rest/v1/${t}?select=data`, { headers: headers() });
      if (!res.ok) throw new Error(`${t}: ${res.status}`);
      const rows = await res.json();
      out[t] = rows.map(r => r.data); // each row is { id, data: <object> }
    }));
    return out;
  } catch (e) {
    console.warn('[KOBIS] Supabase hydrate failed, using local data:', e.message);
    return null;
  }
}

// Mirror the in-memory state back to Supabase. Debounced by the caller.
// Upsert per table (merge on primary key). Fire-and-forget; never blocks UI.
export async function pushAll(state) {
  if (!isConfigured()) return;
  const { url } = cfg();
  // Push every table in parallel so one slow/large table can't delay the rest
  // and an early tab-close is far less likely to leave tables unsynced.
  await Promise.all(TABLES.map(async (t) => {
    const rows = state[t];
    if (!Array.isArray(rows) || !rows.length) return;
    try {
      // Document model: every row is { id, data } — drift-proof against new fields.
      const docs = rows.map(r => ({ id: r.id, data: r, updated_at: new Date().toISOString() }));
      await fetch(`${url}/rest/v1/${t}?on_conflict=id`, {
        method: 'POST',
        headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify(docs),
      });
    } catch (e) {
      console.warn(`[KOBIS] Supabase push ${t} failed:`, e.message);
    }
  }));
}

// Push only the specific rows that changed (not the whole table) — kills the
// write-amplification where one edit re-uploaded every row.
export async function upsertRows(table, rows) {
  if (!isConfigured() || !rows || !rows.length) return;
  const { url } = cfg();
  try {
    const docs = rows.map(r => ({ id: r.id, data: r, updated_at: new Date().toISOString() }));
    await fetch(`${url}/rest/v1/${table}?on_conflict=id`, {
      method: 'POST',
      headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(docs),
    });
  } catch (e) { console.warn(`[KOBIS] upsert ${table} failed:`, e.message); }
}

// Real delete so removed items (waitlist invites, wiped data) don't resurrect.
export async function deleteRow(table, id) {
  if (!isConfigured() || !id) return;
  const { url } = cfg();
  try {
    await fetch(`${url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', headers: headers() });
  } catch (e) { console.warn(`[KOBIS] delete ${table} failed:`, e.message); }
}

// Fetch a single prospect by its preview slug (jsonb filter) — lets the public
// preview load one record instead of the whole database (scale + Phase B prep).
export async function fetchBySlug(slug) {
  if (!isConfigured() || !slug) return null;
  const { url } = cfg();
  try {
    const res = await fetch(`${url}/rest/v1/prospects?data->>demo_slug=eq.${encodeURIComponent(slug)}&select=data&limit=1`, { headers: headers() });
    if (!res.ok) return null;
    const rows = await res.json();
    return rows[0]?.data || null;
  } catch { return null; }
}

export const SUPABASE_TABLES = TABLES;
