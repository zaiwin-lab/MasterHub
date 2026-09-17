# ProgramOS Lite — recovered structure

Reverse-engineered from the live production bundle at
https://angkasatda.netlify.app (deploy `6aa8add7e03dbf8f5c3d82f4`, 15 Sep 2026).
This is an **inventory**, not source code.

## Routes (React Router, 18)

| Route | Purpose (inferred) |
|---|---|
| `/` | Landing page |
| `/program` | Programme agenda |
| `/daftar` | Registration (Malay) |
| `/register` | Registration (English) |
| `/check-in` | QR check-in |
| `/readiness` | AI Readiness Snapshot assessment |
| `/prompt-hub` | Prompt library index |
| `/prompt-hub/:areaId` | Prompts by business area |
| `/prompt-hub/:areaId/:missionId` | Individual prompt / mission |
| `/journey` | 90-day journey plan |
| `/sumber` | Resources / downloads |
| `/galeri` | Gallery |
| `/faq` | FAQ |
| `/my` | Participant dashboard |
| `/login` | Auth |
| `/admin` | Admin panel |
| `/admin/participant/:id` | Participant detail |
| `*` | 404 |

## Supabase tables (6)

- `participants`
- `company_profiles`
- `attendance`
- `assessment_results`
- `action_plans`
- `reflections`

Project: `https://avnnuxotsoqykoqlizbk.supabase.co`

## Stack

Vite · React · React Router · Tailwind CSS · Supabase JS

## Files here

- `content-strings.json` — 1,136 copy strings lifted from the bundle
  (bilingual MS/EN: agenda, FAQ, ~60 prompts, journey steps, UI labels)
- `live-styles.css` — the deployed compiled stylesheet (38 KB)
- `live-index.html` — the deployed HTML shell

## What could NOT be recovered

No sourcemaps are published, so the original `.tsx`/`.ts` sources are gone
from the client. Component structure, application logic, Supabase queries,
auth rules and the database schema are **not** reconstructable from the
minified bundle with any fidelity.
