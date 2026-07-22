import { getStore } from "@netlify/blobs";

// Shared cross-device storage for the ZK30 MFDB Command Centre.
// Data lives in Netlify Blobs (private to this site) so every device
// (office PC, home PC, phone) reads and writes the same records.
//
// GET  /api/data?key=lexa      -> { data: <json or null> }
// POST /api/data?key=lexa      -> body { data: <json> }  -> { ok: true }
//
// A lightweight shared header (x-zk) blocks casual public hits on the
// endpoint. Real access control is Netlify's site-wide password (Pro).

const SHARED = "zk30-sync-9f3a2c";
const ALLOWED_KEYS = new Set(["lexa", "calendar"]);

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type,x-zk"
    }
  });
}

export default async (req) => {
  if (req.method === "OPTIONS") return json({ ok: true });

  if (req.headers.get("x-zk") !== SHARED) {
    return json({ error: "forbidden" }, 403);
  }

  const url = new URL(req.url);
  const key = url.searchParams.get("key") || "";
  if (!ALLOWED_KEYS.has(key)) {
    return json({ error: "invalid key" }, 400);
  }

  const store = getStore("zk30-data");

  try {
    if (req.method === "GET") {
      const data = await store.get(key, { type: "json" });
      return json({ data: data ?? null });
    }
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      await store.setJSON(key, body?.data ?? null);
      return json({ ok: true });
    }
    return json({ error: "method not allowed" }, 405);
  } catch (err) {
    return json({ error: "store error", detail: String(err) }, 500);
  }
};

export const config = { path: "/api/data" };
