# angkasatda — ProgramOS Lite

**Transformasi Digital & AI untuk Koperasi**
An initiative of ANGKASA × KOBIS Berhad × SDEC.

This folder is the Netlify-connected workspace for the live site.

---

## Netlify connection

| | |
|---|---|
| Project | `angkasatda` |
| Live URL | https://angkasatda.netlify.app |
| Site ID | `16b936fb-e8dc-44fd-b7b8-4e07b0cd3419` |
| Team | `zaiwin` (zaiwin's team, Pro) |
| Dashboard | https://app.netlify.com/projects/angkasatda |
| Framework | Vite |
| Current deploy | `6aa8add7e03dbf8f5c3d82f4` — ready, published 15 Sep 2026 |

The link lives in `.netlify/state.json`. That path is gitignored, so after a
fresh clone (or a new cloud container) re-establish it with:

```bash
netlify link --id 16b936fb-e8dc-44fd-b7b8-4e07b0cd3419
```

## ⚠️ The source code is not here yet

The live site is **not connected to any Git repository**. Its deploys come
from direct uploads (`deploy_source: "api"`, `commit_ref: null`), which means
the real source sits in whichever folder the last `netlify deploy` was run
from — most likely a local machine, not this repo.

No sourcemaps are published, so the original source **cannot** be recovered
from the live bundle. See `recovered/SITE-MAP.md` for what was salvaged.

**Do not deploy from this folder until the real source is in place.** A
rebuilt approximation pushed over the top would take down a working
production site — registration, QR check-in, assessments and e-certificates
all run against live Supabase tables.

### To finish connecting

Drop the real project into this folder (or tell Claude where it lives), then:

```bash
npm install
cp .env.example .env     # add VITE_SUPABASE_ANON_KEY
npm run dev              # edit locally
npm run build            # -> dist/
netlify deploy --prod    # publishes to angkasatda.netlify.app
```

## Status & next steps

See `CHECKLIST.md` for live health, the outstanding gaps and the steps to
finish connecting this project.

See `IMPROVEMENTS.md` for the security, performance and product roadmap
derived from analysing the live build.

## What the app does

18 routes and 6 Supabase tables — a full participant platform, not a
brochure site: registration (MS/EN), QR check-in, an AI Readiness Snapshot,
a ~60-prompt Prompt Hub, a 90-day journey, gallery, participant dashboard,
and an admin panel. Full inventory in `recovered/SITE-MAP.md`.

## Stack

Vite · React · React Router · Tailwind CSS · Supabase
(The same stack as `MVP-CRM/`, which is a useful reference for conventions.)
