# Sarawak OTA Distribution Portal — Solution Blueprint

**Status:** Concept / pre-pilot
**Product direction:** Zaiwin Kassim, KOBIS AI Prodigy Team
**Operator channel:** Sarawak Entrepreneur Association (SEA)
**Date:** August 2026

---

## 1. The ask

> "One web portal that can become manager to the OTA — one web portal with the robot
> that can register a lot of listings, helping many businesses in Sarawak, then start
> doing the listings for them."

The reference point is the Cakrasoft ad: one dashboard fanning inventory out to
Traveloka, Agoda, Booking.com, Tiket.com and Expedia through a channel manager.

That product is buildable. But the ad shows the *end state* of a certified
connectivity business, and the path to it is not the path it looks like. This
document sets out what the robot can and cannot legally do, which market to enter
first, and a four-phase build that produces revenue in month two rather than month
eighteen.

---

## 2. Reality check — read this before scoping anything

Three constraints shape every decision that follows.

### 2.1 You cannot bot-register listings on OTAs

Booking.com, Agoda, Expedia, Airbnb and Traveloka all prohibit automated account
creation in their terms of service. Property and operator onboarding requires a
verified legal entity, bank and payout details, a tax identity, and a contract
signed by the owner. A headless browser driving an extranet form is a ToS breach
that ends in banned accounts — and the account it burns belongs to the client, not
to KOBIS.

**Consequence:** the robot never *creates* accounts. It prepares, validates and
syncs content into accounts that the operator legally owns.

### 2.2 Direct connectivity is a 6–18 month certification, not an integration

The legitimate route to "push rates and availability into Booking.com" is the
Connectivity Partner Programme — apply, build against the Content, Rates &
Availability and Reservations APIs, pass certification, commit to a minimum
connected-property count, and carry a support SLA. Expedia, Agoda YCS and
Traveloka each run their own equivalent. Airbnb's API is effectively closed to new
partners for this use case.

**Consequence:** do not build connectivity. Rent it. See §4.

### 2.3 Sarawak's underserved supply is not hotels

Kuching's hotels are already on Booking.com and Agoda — they have revenue managers
and existing channel managers. What is genuinely missing from global distribution
is the experience layer:

- Day trips — Bako, Semenggoh, Kubah, Santubong
- Longhouse stays and kampung homestay programmes — Batang Ai, Skrang, Lemanak
- Mulu and Niah caving, Miri diving, Baram and Rajang river trips
- Cultural, craft and food experiences around Kuching and Sibu
- Airport transfers, 4WD charters, licensed guiding

These sell on **Klook, GetYourGuide, Viator, Airbnb Experiences, Traveloka
Xperience and Trip.com** — a completely different distribution stack from hotel
ARI, with far lower barriers to entry.

**Consequence:** enter through tours and activities. Add accommodation later.

---

## 3. The recommendation

> **Build a managed distribution portal for Sarawak experience operators. Rent
> channel connectivity from an aggregator. Point the AI at listing production and
> compliance — the work that actually blocks these operators — not at form-filling.**

Two candidate beachheads, and why one wins:

| | Accommodation (the ad's model) | **Tours & activities (recommended)** |
|---|---|---|
| Channels | Booking, Agoda, Expedia, Traveloka, Tiket | Klook, GetYourGuide, Viator, Airbnb Experiences, Traveloka Xperience |
| Connectivity route | Certified channel manager, or rent via Channex.io | Bókun (Tripadvisor-owned) fans out to Viator, GYG, Expedia, Airbnb Experiences from one integration |
| Barrier to first listing | High — legal entity, ARI sync, overbooking risk | Low — self-serve supplier onboarding on most channels |
| Time to first live listing | 3–6 months | 2–4 weeks |
| Sarawak supply gap | Small — hotels are already distributed | **Large — most operators sell only via WhatsApp and walk-in** |
| Overbooking blast radius | Severe (guaranteed room, legal exposure) | Contained (capacity per departure) |
| Typical channel commission | 15–18% | 20–30% |

Tours and activities wins on every axis that matters in the first year. The
accommodation path is Phase 2, once the portal, the ops muscle and the operator
roster already exist.

---

## 4. Rent connectivity, build the layer above it

The defensible asset is **not** the API plumbing — it is the operator
relationships, the listing quality, and the Sarawak inventory itself. Buy the
plumbing.

| Layer | Choice | Why |
|---|---|---|
| Tours & activities connectivity | **Bókun** (Tripadvisor) | One integration reaches Viator, GetYourGuide, Expedia, Airbnb Experiences; full REST API; low/no base cost |
| Direct high-value channel | **Klook Merchant API** | Klook dominates Malaysian and Greater China inbound — worth a direct integration, not just an aggregated one |
| Accommodation connectivity (Phase 2) | **Channex.io** | API-first channel manager built explicitly to be embedded — you own the UI, they own the certifications |
| Alternatives to keep warm | Rezdy, Checkfront, TicketingHub; HotelRunner or Beds24 for lodging | Fallbacks if commercial terms sour |

This is the single highest-leverage decision in the document. It converts an
18-month certification project into a 6-week integration.

---

## 5. What the robot actually does

The robot is a **listing production and compliance agent**, not a form-filler.
This is where the AI earns its place, because it removes the real blocker: Sarawak
micro-operators have superb products and no ability to produce
distribution-grade content in five languages.

**Intake.** Operator sends photos and voice notes over WhatsApp, or uploads
through the portal, in Bahasa Malaysia, English, Iban or Chinese. No forms to
start.

**Content generation.** Claude produces, against a per-channel JSON schema so
field limits are never exceeded: title, short and long description, highlights,
inclusions and exclusions, itinerary with durations, meeting point with geocoded
coordinates, what to bring, accessibility notes, age and fitness requirements,
cancellation policy.

**Translation.** EN, BM, 简体中文, 日本語, 한국어 — the languages that actually
drive Sarawak inbound.

**Photo QC.** Resolution and aspect-ratio checks, per-channel hero-image rules,
auto-crop to each channel's spec, EXIF strip, generated alt text. Rejected photos
come back with a plain-language reason.

**Pricing intelligence.** Operator states their net take-home; the robot grosses
up per channel so a 25% Klook commission and an 18% Booking commission both land
on the same net. Flags rate-parity conflicts before they breach a contract.

**Compliance vault.** MOTAC tourism operator licence (Tourism Industry Act 1992),
tourist guide licences, insurance certificates, SST registration, vessel permits.
Collected once, reused across every channel, with expiry reminders. This alone
is worth the subscription to most operators.

**Readiness scorecard.** A single percentage per channel, with the exact blocking
items listed. Nothing is pushed until it scores green.

**Post-launch monitoring.** Content drift, availability gaps, calendar sync,
review-reply drafting, and booking notifications pushed to the operator's
WhatsApp.

A human — KOBIS ops — approves every push. The robot drafts; a person ships.

---

## 6. Architecture

Matches the stack already in use across this hub (Netlify, static-first, JS).

**Front end.** Next.js 15 App Router + TypeScript + Tailwind, on Netlify.
Operator-facing wizard, ops-facing console, and later a public storefront.

**Data.** Supabase — Postgres, Auth, Storage, Row Level Security for hard
multi-tenant isolation between operators.

**Core tables.**

| Table | Role |
|---|---|
| `orgs` | Operator legal entity, MOTAC licence no., payout details |
| `products` | Internal canonical product — the single source of truth |
| `product_variants` | Private charter vs join-in, adult/child, language of guide |
| `rate_plans` / `availability` | Net rates, capacity per departure, blackout dates |
| `media` | Originals plus per-channel derivatives |
| `documents` | Licences, insurance, permits, with expiry dates |
| `channel_accounts` | Encrypted per-operator channel credentials (Supabase Vault) |
| **`channel_listings`** | **The mapping table — one product ↔ N channel listings, each with field overrides, status, last sync, last error** |
| `sync_jobs` | Queue, retries, per-channel rate limits |
| `bookings` / `payouts` | Reservation ledger and commission reconciliation |

`channel_listings` is the heart of the system. Every hard problem — partial
failure, per-channel field divergence, resync, delisting — lives there.

**Jobs.** Inngest or Trigger.dev for sync, retry with backoff, and per-channel
rate limiting. Availability sync must be near-real-time with pessimistic locking;
overbooking is the failure mode that kills the business.

**AI.** Claude API with structured outputs bound to per-channel schemas.

**Notifications.** WhatsApp Business Cloud API — near-universal among Malaysian
SMEs and the only channel these operators reliably read.

**Payments (Phase 2+).** Billplz or ToyyibPay for local rails, Stripe for cards.

**Security.** Never store OTA passwords. API keys and OAuth tokens only,
encrypted at rest. Listings are always created under the *operator's* legal
entity with KOBIS added as an authorised user — never under a KOBIS account.

---

## 7. Phasing

### Phase 0 — Prove it by hand · Weeks 1–4

Ten operators recruited through SEA. No portal. Intake in a shared sheet, listings
created manually by KOBIS staff as authorised agents on the operators' own Klook,
GetYourGuide and Viator accounts.

*Exit criterion:* real bookings from at least three operators. If this fails,
no amount of software fixes it.

### Phase 1 — Portal and robot · Months 2–4

Next.js + Supabase. Onboarding wizard, AI content generation, translation, media
pipeline, document vault, readiness scorecard, ops approval console. Single
integration: **Bókun**, which fans out to Viator, GetYourGuide, Expedia and
Airbnb Experiences.

*Exit criterion:* 40 operators live, listing produced in under 30 minutes of
human time.

### Phase 2 — Direct channels and accommodation · Months 5–9

Klook Merchant API direct. **Channex.io** for homestays and boutique lodging.
Booking engine, WhatsApp notifications, payments, commission reconciliation.

*Exit criterion:* 120 operators, positive unit economics per operator.

### Phase 3 — The Sarawak marketplace · Months 10+

Consumer-facing storefront with unified availability and a package builder —
Bako plus Semenggoh plus a longhouse night, sold as one basket. This is the
position no OTA can replicate, because no OTA holds the whole Sarawak inventory
in one place. Only here does building your own connectivity certifications start
to make sense.

---

## 8. Money

Most Sarawak micro-operators will not pay RM300/month for SaaS. Price for that
reality.

| Line | Model |
|---|---|
| Onboarding | RM299 one-time — content production, translation, compliance vault setup |
| Subscription | RM49–99/month per operator, tiered by product count |
| Distribution override | 5–10% of OTA-originated booking value — the real engine |
| Grant-funded cohorts | SME Digitalisation Grant (RM5,000 matching), MDEC, SDEC, Sarawak Tourism Board and MOTAC digitalisation programmes |

The override is what makes this work: it aligns KOBIS with operator success,
survives operators who cannot pay a subscription, and scales with the inventory
rather than the headcount. Phase 0 and 1 cohorts are strong grant candidates —
digitalising Sarawak tourism SMEs is squarely inside the state's digital economy
agenda, and SEA is the recruitment channel.

---

## 9. Risks

| Risk | Mitigation |
|---|---|
| **Overbooking** — the business-killer | Near-real-time availability sync, pessimistic locking, conservative capacity buffers in Phase 1 |
| **Rate parity breach** — differing rates across channels can void OTA contracts | Robot flags divergence before push; single net-rate source of truth |
| **Account ownership resentment** | Listings always under the operator's entity; KOBIS is an authorised user, and offboarding hands over cleanly |
| **Operator misrepresentation** — unlicensed guides, overstated capacity | Compliance vault is mandatory, not optional; readiness scorecard blocks the push |
| **Aggregator dependency** — Bókun terms change | Abstract channel logic behind an internal adapter interface from day one; keep Rezdy and Checkfront warm |
| **Chasing the ad's model too early** | Accommodation is explicitly Phase 2, gated on Phase 1 exit criteria |

---

## 10. What to decide next

1. **Confirm the beachhead** — tours and activities first, accommodation deferred to Phase 2.
2. **Open the Bókun account** and validate the API against one real Sarawak product before writing portal code.
3. **Recruit the Phase 0 ten through SEA** — weight toward Kuching day trips and Batang Ai longhouses, which have the clearest inbound demand.
4. **Confirm commission and grant figures.** Every percentage and grant amount in this document is a planning estimate and must be verified against current channel contracts and programme terms before it reaches a funding submission.
