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
  for (const t of TABLES) {
    const rows = state[t];
    if (!Array.isArray(rows) || !rows.length) continue;
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
  }
}

export const SUPABASE_TABLES = TABLES;
