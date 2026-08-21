# Product — KO-PUSAKA ASSET360

> Code lives in **zaiwin-lab/MVP-PUSAKA**, branch `claude/kopusaka-asset360-platform-jk3gbq`.
> This file is the hub-side brief; the application, schema and demo script are in that repo.

## Register

platform

## Users

Four audiences share one system.

1. **Public visitors** — business owners, tenants and buyers in Sarawak looking for
   commercial, industrial or residential space. Most arrive on a phone, often from a
   WhatsApp share, and decide within a minute whether a listing is credible.
2. **Referrers** — staff, cooperative members, partners, agents and approved members of the
   public who introduce tenants and buyers, each with a unique code, link and QR.
3. **KO-PUSAKA officers** — the people who list properties, answer enquiries, run viewings,
   negotiate and keep tenancy and rental records current.
4. **Management** — CEO, GM, board and finance, who need to understand portfolio
   performance, income and risk in about thirty seconds.

## Product Purpose

KO-PUSAKA holds property on behalf of its members. Asset360 exists to keep those assets
working: market every available unit, capture every enquiry with its source, drive each
opportunity to a signed tenancy, and account for the rental income the portfolio should be
earning. Success is measured as occupancy up, vacancy days down, lead response time down,
collection rate up, and unrealised income falling.

**One line:** *From Idle Assets to Active Income.*

## Brand Personality

Institutional but not bureaucratic. Premium, calm, corporate, trustworthy — appropriate for a
board paper and a WhatsApp share alike. Deep emerald with restrained gold on near-white,
Fraunces for figures and headings, Inter for interface text. Confident numbers, generous
whitespace, no decoration that does not carry information.

## Anti-references

- Internal government database aesthetics — grey tables, tiny fonts, no hierarchy.
- Neon, cyberpunk or heavy gradients; over-animation.
- Generic AI stock imagery.
- Dashboards that are decorative rather than actionable.
- Full accounting software — this is management monitoring, not a general ledger.

## Design Principles

- **Every asset must have a next action.** No property sits in the database without an owner,
  a status and a deadline.
- **Monetisation-first.** Every screen answers: what turns this property into income?
- **Surface the action, not the report.** Management should not have to read a report to find
  the five properties that need a decision.
- **Conversion on the public side.** An obvious next step on every listing; enquiry possible
  in about thirty seconds; sticky Enquire and WhatsApp on mobile.
- **Attribution never lost.** A referral code captured on landing survives to the enquiry,
  the deal, and the incentive record.
- **Policy stays configurable.** No commission rate is hard-coded; incentive model and
  vacancy thresholds are settings.

## Accessibility & Inclusion

- WCAG AA contrast on body text and on all status colours; health status is never conveyed by
  colour alone — every dot carries a label.
- Mobile-first public experience; no horizontal scrolling at 390 px on any route.
- Short forms, large tap targets, visible focus rings.
- Referrers see enquiry progress only — prospect contact details stay with KO-PUSAKA.

## Delivery

- **Stack:** Next.js 15 (App Router), TypeScript, Tailwind, Recharts, Lucide, `qrcode.react`.
- **Data:** seeded demo dataset in the browser today; `supabase/schema.sql` in MVP-PUSAKA
  carries the full PostgreSQL schema, views and row-level security for the swap.
- **Demo:** `docs/DEMO_SCRIPT.md` in MVP-PUSAKA is a ten-minute run-through for management.
