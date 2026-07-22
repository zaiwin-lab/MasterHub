# ZK30 MFDB Command Centre

Executive intelligence dashboard (LEXA / SP3B / MVP / Calendar / KPI) with
optional cross-device sync via Netlify Blobs.

## Pages
- `index.html` — Overview
- `acis-dashboard.html` — LEXA (relationship database, inline Fix/Delete)
- `sp3b-dashboard.html` — SP3B proposal queue
- `mvp-dashboard.html` — MVP product pipeline
- `executive-calendar.html` — Calendar (add / edit / remove events)
- `partnership-dashboard.html`, `executive-kpi.html`
- `acis-modules.css` — shared styles

## Cross-device sync (optional but recommended)
The data function stores LEXA and Calendar data in **Netlify Blobs**, so every
device (office PC, home PC, phone) reads and writes the same records.

- `netlify/functions/data.mjs` — `GET/POST /api/data?key=lexa|calendar`
- `package.json` — declares `@netlify/blobs`
- `netlify.toml` — publish dir, functions dir, `/api/data` route, SPA fallback

**Progressive enhancement:** if the function is not deployed, the pages fall
back to per-browser `localStorage` and keep working — a "This device only"
badge shows in that case; "Synced across your devices" shows when the backend
is live.

## One-time Netlify setup (to turn on sync)
1. Netlify → the `zk30-mfdb` site → **Site configuration → Build & deploy →
   Continuous deployment → Link repository** → pick `zaiwin-lab/MasterHub`.
2. Set **Base directory** = `zk30-mfdb`, **Publish directory** = `zk30-mfdb`,
   **Functions directory** = `zk30-mfdb/netlify/functions`. Build command: none.
3. Deploy. Netlify runs `npm install` and bundles the function automatically.
4. Netlify Blobs needs no setup — it is enabled per-site by default.

## Password protection
Netlify Pro → **Site configuration → Access & security → Visitor access →
Password protection** → set a site-wide password. This protects every page
*and* the data function behind one password.
