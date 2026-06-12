# KOBIS Website Growth Engine (WGE)

> **Build First. Sell Later. Grow Forever.**
> KOBIS builds a complete website preview for a business *before* they buy.
> They see it, love it, and activate ownership for a one-time **RM500**.

A production-grade MVP of the full engine — admin, AI generation, themed client
previews, activation, client portal, and referrals — as a **zero-build static
SPA** (vanilla ES modules). Runs anywhere, deploys to Netlify in one drop, and
the data layer is **Supabase-shaped** so it swaps to a real backend with no
shape changes.

---

## Run it

```bash
npm run dev          # serves on http://localhost:8099
# or: python3 -m http.server 8099
```

Open `http://localhost:8099/`. State persists in `localStorage`
(`kobis_wge_v1`). To reset the demo data, run `localStorage.clear()` in the
console, or call `reset()` from `js/lib/store.js`.

```bash
npm test             # headless smoke test (24 checks) via jsdom
```

---

## Surfaces

| Route | What it is |
|-------|-----------|
| `#/` | **Launch Hub** — public marketing + waitlist (Rec 6) with referral capture (Rec 8) |
| `#/admin` | **Command Center** — KPIs, revenue mix, pipeline health, automation feed |
| `#/admin/pipeline` | **Lead Pipeline** — kanban across the 7 statuses, one-click advance |
| `#/admin/prospects` | **Prospects** — sortable/filterable, live lead scoring on add |
| `#/admin/prospect/:id` | **Prospect detail** — score breakdown, AI generation, link analytics (Rec 3), WhatsApp SOP (Rec 4), activation |
| `#/admin/clients` | **Clients & Orders** — revenue ledger (Admin-only, RBAC Rec 9) |
| `#/admin/referrals` | **Referrals & Credits** — wallets, attribution, cash redemption (Rec 5) |
| `#/admin/waitlist` | **Waitlist** — batch onboarding (Rec 6) |
| `#/preview/:slug` | **Live themed preview site** (Module B) + activation popup (C) → WhatsApp (D) |
| `#/client/:id` | **Client Portal** (Module E) — gallery, announcements, referral dashboard |

---

## Automation (the "engine")

1. **Lead scoring** (`lib/scoring.js`) — every prospect ranked 0–100 on entry
   across category tier, social reach, web-presence gap, engagement and
   affordability. ≥70 auto-qualifies for generation.
2. **AI website generation** (`lib/aigen.js`) — turns business info + socials
   into a complete site spec (hero, about, services/menu, gallery plan, contact)
   with an industry-matched theme. On-device + instant here; a Claude call in
   production (same output shape).
3. **WhatsApp quoting** (`lib/pricing.js`) — pre-filled activation messages and
   the Day 1/3/7 follow-up cadence.
4. **Referral auto-credit** (`lib/store.js`) — on payment confirmation, the
   referrer's wallet is credited RM50 automatically (Rec 5 timing).

---

## All 10 strategic recommendations, implemented

| # | Recommendation | Where |
|---|----------------|-------|
| 1 | Lead scoring system | `lib/scoring.js`, add-prospect modal, list filters |
| 2 | Preview expiry policy | `preview_expires_at`, countdown on preview + cards |
| 3 | Link analytics | `recordOpen`, opens/unique/last-open on prospect detail |
| 4 | WhatsApp follow-up SOP | `FOLLOWUP_CADENCE`, SOP checklist on prospect detail |
| 5 | Referral timing clarity | credit released on `payment_status=confirmed` |
| 6 | Soft-launch waitlist | `#/admin/waitlist`, Launch Hub "Join waitlist" |
| 7 | Template standardization | per-tier themes in `aigen.js` (`themeFor`) |
| 8 | Referral code on inbound | `referral_code` on waitlist form, `?ref=` capture |
| 9 | Role-based access | `role` switcher, financial views gated to Admin |
| 10 | Pre-launch pipeline | seed ships 15 previews across the pipeline |

---

## Architecture

```
index.html            shell + font/CSS links
css/styles.css        design system (admin + portal)
css/preview.css       launch hub, themed preview sites, popups, portal
js/app.js             router wiring, admin shell, RBAC, reactive re-render
js/lib/
  store.js            Supabase-shaped data layer + seed + mutations
  scoring.js          lead scoring engine (Rec 1)
  aigen.js            AI website-copy generator
  pricing.js          pricing + WhatsApp message/cadence (Module C/D)
  ui.js               formatting, toasts, sparklines, metrics
  router.js           hash router
  modal.js            body-level modal helper
  icons.js            inline SVG icon set
js/views/             one module per surface
smoke.mjs             jsdom smoke test (npm test)
```

### Data model (Supabase-shaped)

`store.js` mirrors the blueprint tables 1:1: `prospects`, `clients`, `orders`,
`referrals`, `credit_wallets`, `link_events`, `followups`, `waitlist`,
`team_members`. To go live, replace the `localStorage` read/write in `store.js`
with `@supabase/supabase-js` calls against tables of the same names and columns;
no view or component changes are required. RBAC (Rec 9) maps directly to
Supabase **Row Level Security** policies keyed on `team_members.role`.

---

## Pricing (single source of truth: `lib/pricing.js`)

- **Activation** RM500 one-time (RM1,000 value) — hosting, domain, 1 email,
  dashboard, support.
- **Add-ons** — AI Chatbot RM200 · News Module RM100 · Extra email RM50/yr.
  First-payment potential up to **RM800**.
- **Renewal** RM300/year.
- **Referral** RM50 renewal credit per activation · cash-out at RM500.
