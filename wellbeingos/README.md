# WellbeingOS

**Enterprise Medical Benefit & Workforce Wellbeing Intelligence Platform.**

First configured deployment: **STIDC SEJAHTERA360 — From Medical Claims to
Proactive Wellbeing.**

Understand the workforce. Support the individual. Protect privacy.

---

## What this is

A reusable platform that turns fragmented medical-benefit administration into
continuous visibility, governance, employee experience and organisational
intelligence.

STIDC is tenant `stidc` — the first implementation, not the shape of the
product. A second organisation ships in the repository as proof
([`docs/REPLICATION-CHECK.md`](docs/REPLICATION-CHECK.md)): different
entitlement, branding, structure, thresholds, terminology, modules and privacy
floor, added with **no code changes**.

**Live:** https://sejahtera360.netlify.app — sign in with any demonstration
persona; the light/dark toggle is in the top bar.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
```

Sign in with any demonstration persona on the front page — Employee, HR,
Finance, Panel Clinic, Wellbeing, Management or Administrator. Seven roles, seven
genuinely different experiences.

To walk someone through it in five minutes: [`docs/DEMO-SCRIPT.md`](docs/DEMO-SCRIPT.md).

## What works end to end

Not screens — a working journey. A panel clinic verifies eligibility and records
a visit; HR verifies and approves it; the employee's wallet moves; the threshold
banner escalates; an exception opens if policy requires it; and every step lands
in the audit trail. Change the entitlement in the configuration centre and every
wallet in the organisation re-derives.

| Capability | Where |
|---|---|
| Benefit wallet, derived from a ledger | `/app/benefit` |
| Claims, approval workflow, timeline | `/app/claims` |
| Clinic eligibility check and submission | `/app/clinic-portal` |
| Exception centre with ownership and history | `/app/exceptions` |
| HR / Finance / Management dashboards | `/app/overview`, `/app/insights` |
| Personal wellbeing vault (Zone 2) | `/app/wellbeing` |
| Programmes and participation | `/app/programmes` |
| Signal → insight → response → measure | `/app/signals` |
| Privacy & consent centre | `/app/privacy` |
| Reporting centre, eight templates, CSV/print | `/app/reports` |
| ESG value with an evidence register | `/app/esg` |
| Tenant configuration centre | `/app/admin` |
| Audit trail | `/app/audit` |

## Architecture in one paragraph

Four layers: a **universal core** (`src/core`) that knows nothing about any
client; **tenant configuration** (`src/tenants`) that supplies everything which
varies; **optional modules** as feature flags; and **integration adapters**
(`src/integrations`) that keep external systems out of the core. Nothing in
`src/core` imports from `src/tenants`. That constraint is what makes the
platform reusable rather than merely reused.

Full detail: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Privacy is structural

Three zones, enforced at the data boundary rather than in the interface:

- **Zone 1 — Administrative.** Entitlement, transactions, MC dates, approvals.
- **Zone 2 — Personal vault.** Pulse, notes, goals, screening. There is no
  capability to read another person's vault, so there is none to grant.
- **Zone 3 — Organisational.** Aggregates only, suppressed below the tenant's
  aggregation floor — suppressed, not rounded, because a rounded number can
  still identify someone in a small team.

Full detail: [`docs/PRIVACY.md`](docs/PRIVACY.md).

## Honest boundaries

- **Persistence and authentication are mocked.** The demonstration build seeds a
  deterministic dataset and persists it in the browser, so the whole journey is
  genuinely exercisable without infrastructure. Every calculation, permission
  check, workflow transition and audit write is real.
  `supabase/schema.sql` is the target schema — tenant-scoped, with row level
  security enforcing the same three zones — and
  [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) sets out the swap.
- **All data is fictional.** No real person and no real health information is
  used anywhere in this repository.
- **The platform is not a medical service.** It does not diagnose, does not
  recommend treatment, and must not inform employment decisions. Every
  intervention records the human who decided it.

## Documentation

| | |
|---|---|
| [Architecture](docs/ARCHITECTURE.md) | How the platform is organised |
| [Data model](docs/DATA-MODEL.md) | Entities, relationships, what is derived |
| [Roles & permissions](docs/ROLES.md) | The capability matrix and how it is enforced |
| [Privacy model](docs/PRIVACY.md) | The three zones, consent, the aggregation floor |
| [Tenant configuration](docs/TENANT-CONFIGURATION.md) | Onboarding another organisation |
| [Portal structure](docs/PORTAL-STRUCTURE.md) | Public site, sign-in flow, role panels, floating controls |
| [Localisation](docs/LOCALISATION.md) | Four languages, the fallback chain, adding a fifth |
| [Design system](docs/THEMING.md) | Light and dark modes, tokens, white-labelling |
| [Policy](docs/POLICY.md) | Entitlement, thresholds, approval, eligibility gates |
| [Feature flags](docs/FEATURE-FLAGS.md) | Modules and how gating works |
| [Replication check](docs/REPLICATION-CHECK.md) | The second tenant, proved |
| [Integrations](docs/INTEGRATIONS.md) | Adapters, sequencing, and the AI boundary |
| [KPI framework](docs/KPI-FRAMEWORK.md) | Six dimensions, each traceable to code |
| [Deployment](docs/DEPLOYMENT.md) | Environments, Netlify, pilot checklist |
| [Demo script](docs/DEMO-SCRIPT.md) | Five to seven minutes, ten scenes |

## Two surfaces

**A public corporate site** at `/` — overview, how it works, capabilities,
dedicated pages for management and for employees, privacy architecture and
support — with a top navigation bar, a four-language selector and a clean
sign-in at `/signin`. Demo personas sit behind an **Explore Demo Access**
control rather than beside the login form, so the portal presents to a board
the way a live system would.

**Role-based panels** at `/app/*` behind a collapsible sidebar that names its
destination: Management Panel, Employee Portal, HR, Finance, Clinic, Wellbeing,
Administration. Navigation is derived from capability and module; the route
guard refuses direct URLs independently.

Both surfaces carry **AI Help 24/7** bottom-left and **WhatsApp Support**
bottom-right. See [`docs/PORTAL-STRUCTURE.md`](docs/PORTAL-STRUCTURE.md).

## Languages

English · Bahasa Malaysia · 中文 · Iban. The selector is wired to a real
dictionary with an English fallback chain, not a decorative control — the whole
public site and every piece of authenticated chrome switches.
See [`docs/LOCALISATION.md`](docs/LOCALISATION.md).

## Design

Two presentation modes — **bright by default**, dark as a full alternate,
toggled from the top bar. Geometric sans, radial gauges, meter bars and a faint
command-deck grid. Deliberately unlike the sibling deployment in this portfolio
(warm cream, emerald, serif): two products for one client should not be
mistaken for each other. See [`docs/THEMING.md`](docs/THEMING.md).

## Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS ·
Recharts · Lucide · Space Grotesk / Inter.

---

Delivery leadership: Zaiwin Kassim with the KOBIS AI Prodigy Team.
Built with the #AZUGAI7 and #KODE5 frameworks.
