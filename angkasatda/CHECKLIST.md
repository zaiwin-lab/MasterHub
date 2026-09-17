# angkasatda — completion checklist

Status as of **17 Sep 2026**. Live site: https://angkasatda.netlify.app

---

## Current status

**The website is healthy and fully live. Nothing is broken in production.**

| Check | Result |
|---|---|
| Live site | ✅ HTTP 200 |
| All 18 routes | ✅ 200 (SPA fallback working) |
| JS bundle (549 KB) | ✅ serving |
| CSS bundle (38 KB) | ✅ serving |
| Current deploy `6aa8add7e…` | ✅ ready / published 15 Sep 2026 |
| Supabase backend | ✅ alive (401 = reachable, key-protected) |
| Secret scan on last deploy | ✅ 57 files, 0 matches |
| Password / SSO gate | none — site is public |
| Netlify Forms | not enabled (app uses Supabase instead) |

**What is incomplete is the *workflow*, not the website.** The site is
publishable only by manual upload from one unknown folder, and its source
is not in version control anywhere we can reach.

| Gap | Impact |
|---|---|
| No Git repo attached to the Netlify site | No CI/CD, no deploy history tied to commits, no rollback-by-revert |
| Source not in this repo (or any known repo) | Cannot edit or rebuild the site from Claude Desktop |
| Deploys are `deploy_source: "api"` uploads | Whoever holds that local folder is a single point of failure |
| No sourcemaps published | Source is unrecoverable from the live bundle |

---

## Checklist

### Phase 1 — Connect the workspace ✅ done

- [x] Locate the Netlify project and confirm ownership (team `zaiwin`, Pro)
- [x] Capture site ID `16b936fb-e8dc-44fd-b7b8-4e07b0cd3419`
- [x] Link the folder — `.netlify/state.json`
- [x] Add `netlify.toml` mirroring live config (Vite build, `dist`, SPA redirect)
- [x] Add `.env.example` for the Supabase project
- [x] Audit live health — routes, assets, backend
- [x] Salvage what the bundle still holds → `recovered/`
- [x] Document routes, tables and stack → `recovered/SITE-MAP.md`

### Phase 2 — Recover the source 🔴 blocked, and blocking everything below

This is the only thing standing between here and a working edit/deploy loop.
Pick whichever applies:

- [ ] **Find the folder the last deploy was run from.** Check the machine that
      ran `netlify deploy` around 15 Sep 2026. Look for a Vite project
      containing `src/`, `package.json` and a `.netlify/state.json` whose
      `siteId` is `16b936fb-e8dc-44fd-b7b8-4e07b0cd3419`.
- [ ] **Or** check whether it already lives in a Git repo that just was never
      attached to Netlify — search GitHub for `ProgramOS` / `angkasatda`.
- [ ] **Or** ask whoever built it (the ANGKASA / KOBIS / SDEC dev) for the repo.
- [ ] Push it to GitHub under `zaiwin-lab`.
- [ ] Tell Claude the repo name so it can be added to the session.

> ⚠️ If the source is genuinely lost, the honest options are a rebuild from
> `recovered/` (weeks of work, and the Supabase schema still has to be
> re-derived from the live tables) or continuing to ship the current build
> untouched. Do not deploy a partial rebuild over the live site — see below.

### Phase 3 — Wire it up locally

- [ ] Move the source into `angkasatda/` (or point the Netlify link at its repo)
- [ ] `npm install`
- [ ] `cp .env.example .env` and fill `VITE_SUPABASE_ANON_KEY`
- [ ] `npm run dev` — confirm it boots and talks to Supabase
- [ ] Walk the critical paths locally: registration, QR check-in, readiness
      assessment, admin login
- [ ] Reconcile `netlify.toml` here against the source's own config if it has one

### Phase 4 — Verify before the first deploy

The live site serves a running programme — registration, attendance and
e-certificates are real participant data in Supabase. Treat the first deploy
as a production change, not a test.

- [ ] `npm run build` succeeds
- [ ] Diff the built `dist/index.html` against `recovered/live-index.html` —
      large unexplained differences mean the source is not the deployed version
- [ ] `netlify deploy` (no `--prod`) → check the deploy preview URL first
- [ ] Verify all 18 routes on the preview
- [ ] Confirm Supabase reads/writes work against the preview
- [ ] Only then `netlify deploy --prod`

### Phase 5 — Harden the pipeline

- [ ] Attach the GitHub repo in the Netlify dashboard → Site configuration →
      Build & deploy (this cannot be done via the MCP tools; it is a dashboard
      action) so deploys become commit-driven with rollback
- [ ] Set `VITE_SUPABASE_*` as Netlify environment variables
- [ ] Enable deploy previews on pull requests
- [ ] Consider a custom domain instead of `*.netlify.app`
- [ ] Back up the Supabase schema into this repo (as `MVP-CRM/` does with
      `supabase/schema.sql`)
- [ ] Review Supabase Row Level Security on all 6 tables — the site is public
      and holds participant records

### Phase 6 — Security (independent of the above) 🔴

- [ ] **Rotate the Netlify token committed in `client-portal/deploy.sh` and
      both `.github/workflows/deploy-*.yml`.** It is in Git history and grants
      API access to this same team. Rotation is the fix; removing the file is
      not. See the queued task card for full steps.

---

## Quick reference

```bash
# relink after a fresh clone / new container
netlify link --id 16b936fb-e8dc-44fd-b7b8-4e07b0cd3419

npm install && npm run dev      # edit
npm run build                   # -> dist/
netlify deploy                  # preview first
netlify deploy --prod           # publish
```
