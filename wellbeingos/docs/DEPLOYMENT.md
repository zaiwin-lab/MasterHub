# Deployment

## Local

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run typecheck    # tsc --noEmit
```

Node 20+ is required (built and verified on Node 22).

## Environment

Copy `.env.example` to `.env.local`. Nothing is required for the demonstration
build; everything has a safe default.

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_DEFAULT_TENANT` | Which tenant this deployment serves | `stidc` |
| `NEXT_PUBLIC_ENABLE_DEMO_PERSONAS` | Show the persona picker on sign-in. **Set to `false` for a pilot** | `true` |
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` | Hosted backend, when attached | unset |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-side only.** Never expose to the browser | unset |
| `HRIS_ADAPTER`, `CLINIC_ADAPTER`, `NOTIFY_ADAPTER` | Adapter selection | `mock` |

## Live deployment

| | |
|---|---|
| URL | https://sejahtera360.netlify.app |
| Netlify project | `sejahtera360` (team `zaiwin`) |
| Source | `MasterHub/wellbeingos` on `claude/wellbeingos-platform-architecture-jo65ah` |
| Presentation | Light by default; the toggle sits in the top bar |

The site is a demonstration build: the persona picker is enabled and the data
layer is the seeded in-browser dataset. Before a pilot with real people, work
through the checklist at the end of this document.

## Netlify

`netlify.toml` is committed and uses the official Next.js runtime:

```toml
[build]
  command = "npm run build"
  publish = ".next"
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Set the environment variables in the site's build settings. No other
configuration is needed.

## Security headers

Applied to every route from `next.config.mjs`: `X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` (camera, microphone
and geolocation denied). The app is marked `noindex` — this is an internal
platform, not a public site.

## Going from demo to pilot

The MVP persists to the browser. To attach a backend:

1. Apply `supabase/schema.sql`.
2. Replace the function bodies in `src/core/data/repository.ts` with queries.
   Signatures already take a `Session`; keep the capability checks — RLS is the
   second lock, not the only one.
3. Replace the mutation bodies in `src/core/data/store.tsx` with API calls.
   Keep the audit write on every privileged action.
4. Set `app.tenant_id`, `app.user_id`, `app.employee_id`, `app.clinic_id` and
   `app.capabilities` per request so the RLS policies resolve.
5. Replace the persona picker with the `IdentityAdapter` (SSO) and set
   `NEXT_PUBLIC_ENABLE_DEMO_PERSONAS=false`.

No UI component changes in any of those steps.

## Before a pilot with real people

- [ ] SSO wired; persona picker disabled
- [ ] Hosted database with RLS applied and verified per role
- [ ] Backup and restore tested
- [ ] Retention job scheduled against `TenantConfig.privacy.retentionMonths`
- [ ] Consent text reviewed by the organisation's legal or governance function
- [ ] Penetration test of the API surface
- [ ] Named data owner for each of the three zones
