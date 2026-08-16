# MVP³ / SAIDS Portal + Potential Scan — Master Build Prompt

**How to use:** open a fresh Claude Code session in the new repo with `MasterHub` loaded,
and paste everything below the line. `SURVEY_INSTRUMENT.md` and `GTM_STRATEGY.md` in this
folder are normative inputs — if you are pasting this into a tool that cannot see them,
paste `SURVEY_INSTRUMENT.md` as well. It carries the question set, scoring weights and leak
formulas, and the build cannot be completed without it.

**Target repo:** `zaiwin-lab/SAIDS-MVP3-Portal` (new)
**Ship window:** 14 days. Scope is frozen — see §14.

---

## PROMPT START

You are building the flagship revenue portal for **SAIDS — Smart AI Digital Solutions**,
the productised AI practice of **KOBIS Berhad**, delivered by **KAPT (KOBIS AI Prodigy
Team)** and led by **Ts. Zaiwin Kassim, MBA**.

This is not a brochure site. It is a **conversion instrument**: a short, credible marketing
narrative that funnels every visitor into an 8-minute diagnostic called the **MVP³ Potential
Scan**, which ends in a personalised report — the **Potential Snapshot** — that puts a
ringgit figure on what the visitor's business is losing every month. That number is the
product. Everything else on the site exists to get people to it and to make them believe it.

Read `SURVEY_INSTRUMENT.md` in full before writing any code. It is the normative spec for
the question set, the nine scoring dimensions and weights, the six leak formulas, the
constants, the MVP³ candidate lookup table and the Snapshot structure. Do not redesign any
of it. Where this prompt and that document disagree, that document wins.

---

### 1. What we sell (get this right or the copy will be generic)

The **MVP³ method** — three lenses on one business:

| Lens | Question it answers |
|---|---|
| **Minimum Viable Product** | What can we build and test *now*? |
| **Most Valuable Potential** | What is already here, unused? |
| **Market Value Proposition** | What does the market actually want to buy? |

**We do not sell AI.** We sell *found money and a fast fix*. AI is how we deliver in 30 days
what used to take nine months. Every line of copy must respect this: the hero is about their
business, not about our technology. The word "AI" should appear far less often than a
visitor expects, and always attached to an outcome.

**The offer ladder** (build the pricing section from exactly this):

| Rung | Offer | Price | Duration |
|---|---|---|---|
| 0 | **MVP³ Potential Scan** | Free | 8 minutes |
| 1 | **Potential Readout** | RM 1,500 | 90-minute live session + written 1-pager |
| 2 | **MVP³ Clarity Sprint** | from RM 4,800 | 5 working days · **fully credited into Rung 3** |
| 3 | **SAIDS Launch Sprint** | from RM 18,000 | 21–30 days to something live |
| 4 | **SAIDS Momentum** | from RM 3,500/mo | ongoing |

Carry the **Leak Guarantee** on the pricing section: *if the Clarity Sprint doesn't identify
recoverable value worth at least 3× the fee within 12 months, the fee is refunded in full.*

---

### 2. Tech stack

Match the proven FAME build — `zaiwin-lab/MVP-FAME-Survey` — so the two properties share a
house style and so proven modules can be lifted directly.

- **Vite + React 18 + TypeScript** (strict), **Tailwind CSS v4** via `@tailwindcss/vite`
- Fonts: `@fontsource-variable/inter` + `@fontsource-variable/newsreader`, self-hosted
- **No UI component library, no animation library, no state library.** A typed reducer in
  `src/state/store.ts` with `localStorage` persistence is the whole state layer.
- Client-side routing only, no router dependency — a `screen` union in state, same as FAME
- `netlify.toml`: build `npm run build`, publish `dist`, SPA redirect, and the security
  headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`) plus immutable caching on `/assets/*`
- `npm run typecheck` must pass clean with zero `any` in `src/lib/` and `src/state/`

**Lift these three modules from the FAME repo essentially unchanged** — they are solved
problems and re-solving them is wasted days:
- `src/lib/magicbox.ts` — link parsing, platform classification, tracking-param stripping, dedupe
- `src/i18n/` — the four-language dictionary architecture, `[en, bm, zh, ib]` row ordering
- `src/components/FloatingBubbles.tsx` — assistant + WhatsApp bubbles

---

### 3. Design direction — "engineered luxury"

The visual job is to make a small team read as a serious institution, without looking like a
template. The reference feeling: a Bloomberg terminal designed by a Swiss typographer.
Confident, dense with signal, expensive-looking, zero stock-photo energy.

**Rules:**
- **Dark hero, light body.** The site opens on near-black navy and resolves into light. The
  Snapshot returns to dark for the score reveal. Dark = authority and data; light = clarity
  and readability.
- **Serif display, sans body, mono data.** `Newsreader Variable` for headings (weight 500,
  `letter-spacing: -0.018em`, `text-wrap: balance`), `Inter Variable` for body,
  `ui-monospace` for every number, score, code and label. **Every ringgit figure and score is
  monospaced with `font-variant-numeric: tabular-nums`.** This single choice does more for
  perceived rigour than any other decision on the page.
- **Gold means money, cyan means data, red is never used for the visitor's own results.** A
  low score must never render as an alarm. Pressure comes from the words; the colour stays
  composed.
- **A fine grid ground** behind hero and section breaks — 46px, ~5% brand blue — reading as
  engineering drafting, not decoration. (Lift `.grid-ground` from FAME's `index.css`.)
- **Motion is restrained and purposeful:** 200–320ms, `cubic-bezier(0.22, 1, 0.36, 1)`.
  Numbers count up once on reveal. Nothing loops, nothing bounces, nothing parallaxes.
  `prefers-reduced-motion: reduce` disables the count-up and every transition.
- **No stock photography anywhere.** Typography, data, generous whitespace and one real
  photograph of Zaiwin. A real face beats every illustration in this market.

**Palette — Tailwind v4 `@theme` tokens, oklch:**

```css
@theme {
  /* Ink — near-black navy through to mute */
  --color-ink:        oklch(0.19 0.045 258);
  --color-ink-soft:   oklch(0.40 0.040 254);
  --color-ink-mute:   oklch(0.53 0.028 250);

  /* Ground */
  --color-void:       oklch(0.15 0.038 260);   /* hero + snapshot background */
  --color-surface:    oklch(0.985 0.008 240);
  --color-surface-2:  oklch(0.963 0.018 236);
  --color-line:       oklch(0.905 0.016 238);

  /* Brand — blue carries identity */
  --color-brand:      oklch(0.52 0.155 258);
  --color-brand-deep: oklch(0.34 0.120 260);
  --color-brand-tint: oklch(0.94 0.032 250);

  /* Cyan carries data and scores */
  --color-cyan:       oklch(0.74 0.145 210);
  --color-cyan-deep:  oklch(0.56 0.130 215);

  /* Gold carries money, value and the leak figures */
  --color-gold:       oklch(0.78 0.115 84);
  --color-gold-deep:  oklch(0.56 0.098 76);

  --color-signal-strong: oklch(0.58 0.115 165);
  --color-signal-warn:   oklch(0.66 0.125 68);

  --font-display: 'Newsreader Variable', Georgia, serif;
  --font-sans:    'Inter Variable', system-ui, -apple-system, sans-serif;
  --font-mono:    ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, monospace;

  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Accessibility is not optional: semantic landmarks, real `<button>` and `<label>` elements,
visible `:focus-visible` rings, AA contrast throughout including on the dark hero, and a
survey that is fully completable by keyboard alone.

---

### 4. Information architecture

Five routes. No more.

| Route | Purpose |
|---|---|
| `/` | The narrative → the Scan. The only page most visitors see. |
| `/scan` | The MVP³ Potential Scan (the survey flow and the Snapshot) |
| `/method` | How MVP³ works, the scoring weights, the leak formulas, the constants — published openly |
| `/saids` | The five rungs, what each delivers, the Leak Guarantee |
| `/about` | Zaiwin, KAPT, KOBIS Berhad, the GitHub portfolio |

---

### 5. Homepage — section by section, with copy

Write real copy. Every line below is either final or a starting point to sharpen — never
replace it with placeholder text.

**5.1 · Hero** (dark, grid ground, full viewport minus nav)

> **Eyebrow:** MVP³ · A KOBIS Berhad practice
> **H1:** Every business has an untapped MVP.
> **Sub:** Yours is leaking money while you look for it. Eight minutes tells you where, how much, and what to do about it this week.
> **Primary CTA:** Start the free 8-minute Scan →
> **Secondary:** See how the scoring works
> **Trust line under CTA:** No signup to see your result · Four languages · Nothing shared with anyone

The hero must never say "we are an AI company." It says *your business is leaking and we can
show you where.*

**5.2 · The urgency band** — Beat 1: the wave is real

Exactly **three** statistics, each with a visible source and year and a working outbound
link. Full-width, dark, monospaced figures, generous spacing.

> **HARD REQUIREMENT.** Every statistic must be verified against its primary source before
> this ships, and must render its source and year on screen. If a number cannot be verified,
> **cut it** — two verified numbers beat five impressive ones. Candidate sources are listed
> in `GTM_STRATEGY.md` §5.2 with confidence ratings; treat them as *leads to verify*, not as
> approved copy. Do not invent a statistic, do not round one in our favour, and do not cite a
> figure whose original framing you have not read.

Closing line under the band:

> Most businesses read numbers like these and do nothing, because none of them say what to do on Monday. Ours does.

**5.3 · The enemy** — Beat 2: standing still

> **H2:** Late can be bought back. Still can't.
>
> The businesses that get overtaken are rarely the failing ones. They're the comfortable ones — profitable enough not to panic, busy enough never to change. Nothing goes wrong. They just get quietly passed, and by the time it's obvious, catching up costs ten times what moving early would have.
>
> Your competitor doesn't have to be better than you. They only have to be earlier.

**5.4 · The six leaks** — the IP, presented as a grid

Six cards, monospaced `L1`–`L6` codes, one line each. This section makes the visitor
self-diagnose before they have answered a single question, which is precisely what makes
them start the Scan.

> **H2:** Six places money leaves a business quietly.
> **Sub:** We've never scanned a business with none of them. Most have four.

- **L1 · Response Lag** — the enquiry that waited two days for a reply and bought elsewhere.
- **L2 · Manual Repetition** — hours a week retyping what a machine should have moved.
- **L3 · Invisible Offer** — you're genuinely good at something nobody can find you for.
- **L4 · Quote Drag** — the proposal that took five days while the customer's urgency cooled.
- **L5 · One-Head Dependency** — the business stops when you take a week off.
- **L6 · Untapped Asset** — data, know-how or an audience you already own and don't sell.

> **CTA:** Find out which ones are yours, and what they cost →

**5.5 · What the Scan gives you** — reduce the risk of starting

Show the Snapshot, don't describe it. A real rendered component, scaled down, with sample
data clearly watermarked **EXAMPLE**. Beside it, six short lines: your MVP³ Index · three
lens scores · your top 3 leaks in RM/month · a 90-day cost of delay · three fixes you can do
this week yourself · one product opportunity hiding in your business.

> **Under it:** No calls booked. No email required to see your result. If it's useful, we'll tell you what we'd do next. If it isn't, close the tab and keep the three free fixes.

**5.6 · How we work** — MVP³ + SAIDS + KAPT, in one screen

Three columns for the three lenses, then one line on delivery:

> Diagnosis in 8 minutes. Clarity in 5 days. Something live in 30. Delivered by KAPT — the KOBIS AI Prodigy Team — under a named, accountable human lead.

**5.7 · Why you can trust the numbers** — the differentiator, given real space

> **H2:** We show our working.
>
> Every figure in your Snapshot is an estimate built from what you told us, and you can open the arithmetic on any of them. We publish the scoring weights and the formulas on our method page. We label what we measured, what we inferred and what we simply couldn't know. Nothing is fetched, verified or claimed that we didn't actually check.
>
> Ask any other AI vendor to show you theirs.

Link to `/method`.

**5.8 · The principal**

Real photograph. Name, title, MBA, KOBIS Berhad, Sarawak. Two sentences in first person.
Links to LinkedIn and github.com/zaiwin-lab. This section carries more conversion weight in
this market than any testimonial we don't yet have.

**5.9 · Offer ladder** — the five rungs from §1 as a clean table, Rung 2 visually emphasised,
Leak Guarantee stated in full, single CTA back to the Scan.

**5.10 · Final CTA** (dark, mirrors the hero)

> **H2:** Eight minutes. Then you'll know.
> **Sub:** What it's costing you, where it's leaking, and the three things you can fix yourself this week.
> **CTA:** Start the free Scan →

**5.11 · Footer**

Follow the KOBIS house pattern: brand block, quick links, contact, copyright, then the
`.kobis-bar` credit — *"This Digital Experience is Part of the [KOBIS Berhad] Innovation
Ecosystem"* — with the glossy gradient hover on the KOBIS link. Reserve bottom lane clearance
so the floating bubbles never land on the credit.

---

### 6. The Scan flow

```
intro → consent → respondent type → survey → magic box → review → processing → SNAPSHOT → save/email
```

Behaviour, all of it proven in the FAME build:

- **One question per screen.** Progress bar, section trail, back navigation always available.
- **Autosave to `localStorage` on every change.** Returning visitors are offered a resume.
- **Escape hatches** — "Not sure" on judgement questions, "Prefer not to say" on money
  questions. Both are recorded as absent, never as zero. See `SURVEY_INSTRUMENT.md` §5.4.
- **Branching** by respondent type per `SURVEY_INSTRUMENT.md` §2.
- **Magic Box** — paste every link at once, any format, parsed into editable confirm/remove
  cards. Every asset recorded `declared`, never verified.
- **Processing screen** — 2.5–4 seconds with real stage labels ("Scoring nine dimensions",
  "Estimating leak exposure", "Selecting your MVP³ candidate"). It must reflect actual work,
  not fake a progress bar. This is a deliberate beat: instant results feel cheap.
- **Snapshot** built exactly to `SURVEY_INSTRUMENT.md` §8, in that order.
- **Email is asked for after the Snapshot is on screen**, framed as *"Save this and send me a
  copy"* — never as a gate before the result.
- **Print stylesheet** so "Save as PDF" produces a clean document with the KOBIS footer.

**Scoring is deterministic.** Same inputs, same Snapshot, every time. No randomness, no
model call. `src/lib/scoring.ts` is a pure function from answers to a typed `Snapshot`
object, and the Snapshot page renders from that object — never from free text.

---

### 7. Honesty rules — enforce these in code, not in copy

Carry these directly from the FAME build. They are the trust architecture and they are
non-negotiable.

1. **Nothing is fabricated.** No traffic, follower counts, engagement, rankings, revenue or
   competitor figures appear anywhere, because none of it was measured.
2. **Declared is not verified.** A browser cannot fetch third-party pages. Every submitted
   link is labelled `declared`, `assets_reviewed` stays `0`, and confidence is capped at
   `moderate` while anything is unverified.
3. **Missing data is missing, never zero.**
4. **Every finding is classified** — fact, inference, recommendation or limitation — and the
   classification renders on screen next to the finding.
5. **Every estimate shows its arithmetic on demand**, with the respondent's own inputs
   substituted in and any defaults named.
6. **The Snapshot renders from a structured object.** *"Show the structured output behind
   this report"* reveals the exact JSON.
7. **No peer comparison until the cohort is real.** Until there are ≥ 50 completed scans,
   nothing may say "businesses like yours scored X". Build the component, keep it behind a
   flag, leave the flag off.
8. **No partner name, logo or endorsement renders without written approval.** Reuse FAME's
   `src/config/branding.ts` build-time flag pattern.

---

### 8. Languages

Four: **EN / BM / 中 / IB**, switchable from the header at any point, including on a Snapshot
already generated. Persist to `localStorage`, seed the first visit from the browser language.

Copy lives in `src/i18n/` as dictionaries with rows ordered `[en, bm, zh, ib]`:
`dict.ui.ts` (chrome, buttons, all page copy, assistant Q&A) · `dict.survey.ts` (all 22
questions, help text, every option) · `dict.report.ts` (everything the scoring engine emits).

The scoring engine emits every generated sentence twice — once as English so the stored JSON
reads on its own, once as a translation key the UI resolves — so the engine stays independent
of the active language. A missing cell falls back to English rather than rendering blank.

**Answer values are stable keys** (`fnb`, `under_1hr`), never display strings.

> Ship EN complete and reviewed. BM, 中 and IB are written but must be marked in the README
> as **awaiting native-speaker review** — the same honest caveat the FAME build carries.

---

### 9. Lead capture and handoff

Minimum viable, no CRM:

- On save/email: `POST` name, email, phone, business name, the full snapshot JSON and the
  consent record to **Supabase** (single `scans` table, insert-only via anon key with RLS
  permitting insert and denying select) **or** a Netlify Function relaying to **Brevo**.
  Pick one, wire it, do not build both.
- Add the contact to a Brevo list with attributes `mvp3_index`, `total_monthly_leak`,
  `mvp3_candidate`, `timeline`, `industry` — so the follow-up sequence can segment on leak
  size and urgency without anyone opening a spreadsheet.
- **WhatsApp handoff:** floating bubble plus a Snapshot CTA, pre-filled in the active
  language with the scan ID and headline leak figure so the conversation opens with the
  number already on the table. Number from `VITE_WHATSAPP_NUMBER`, defaulting to a
  deliberately invalid placeholder so a demo build can never dial a stranger.
- **Booking:** the Rung 1 CTA opens a Cal.com or Calendly link with the scan ID passed as a
  query parameter.

---

### 10. Analytics — instrument this from day one

Without these events the funnel cannot be fixed, and the funnel is the business.

`scan_started` · `question_answered` *(question id, elapsed)* · `scan_abandoned` *(last
question id — **the single most valuable event on the site**)* · `magicbox_used` ·
`scan_completed` *(index, total leak, duration)* · `snapshot_viewed` · `arithmetic_opened` ·
`email_captured` · `cta_clicked` *(which rung)* · `whatsapp_opened` · `language_changed`

Plausible or GA4. No session recording, no third-party pixels before launch — a page selling
data discipline cannot leak its visitors to ad networks.

---

### 11. Performance and SEO

- Lighthouse ≥ 95 performance and ≥ 95 accessibility on mobile
- LCP under 2.0s on a mid-range Android over 4G — this market is phone-first and network-poor
- Self-hosted fonts, no external requests on first paint, no layout shift
- Per-route `<title>` and meta description, Open Graph and Twitter cards, a custom OG image
  for the Scan, `Organization` and `Service` JSON-LD naming KOBIS Berhad, `sitemap.xml`,
  `robots.txt`
- Target phrases in real copy, never stuffed: *AI solutions Sarawak · business automation
  Malaysia · SME AI readiness · digital transformation Kuching*

---

### 12. Repo hygiene

- `README.md` in the FAME house style: what it is, how to run it, what it covers, the honesty
  rules the build enforces, what is deliberately out of scope, and known limitations stated
  plainly
- `.env.example` documenting every `VITE_` variable with safe defaults
- Conventional commits, small and reviewable
- No secrets committed, ever. No partner logo file in the repo until approval is held.

---

### 13. Definition of done

- [ ] `npm run build` and `npm run typecheck` both pass clean
- [ ] All 22 questions across all three respondent paths, complete in four languages
- [ ] Scoring matches `SURVEY_INSTRUMENT.md` §5 exactly — verify by hand against three
      constructed answer sets and commit them as fixtures
- [ ] All six leak formulas implemented per §6, with the 35%-of-revenue cap enforced
- [ ] L3 and L6 presented as opportunity and **excluded** from the headline leak figure
- [ ] The all-declined case produces a qualitative ledger and **no** ringgit figure
- [ ] Arithmetic disclosure works on every estimate, with the respondent's own inputs shown
- [ ] "Show the structured output behind this report" reveals the real JSON
- [ ] Every homepage statistic carries a verified source, year and working link — or is gone
- [ ] Peer-comparison component built, flagged, and **off**
- [ ] Autosave, resume, back navigation and keyboard-only completion all work
- [ ] Print stylesheet produces a clean PDF
- [ ] Lead capture writes a real row and adds a real Brevo contact
- [ ] All analytics events fire, verified in the live dashboard
- [ ] Tested on a real mid-range Android phone on mobile data, not just a desktop viewport
- [ ] `prefers-reduced-motion` disables the count-up and every transition
- [ ] Lighthouse ≥ 95 / ≥ 95 on mobile

---

### 14. Deliberately out of scope for v1 — do not build these

Client login · dashboards · admin UI · a live LLM behind the assistant (scripted answers,
labelled as scripted) · server-side PDF generation · blog or CMS · case-study library ·
CRM integration beyond a list and a WhatsApp link · verified fetching of submitted links ·
multi-currency · A/B testing infrastructure · automated tests beyond the scoring fixtures.

If you find yourself building any of these, stop. The ship window is 14 days and the funnel
teaches us what to build next. **Speed and quality, not completeness.**

## PROMPT END

---

## Notes for reuse

- Distilled from the live `MVP-FAME-Survey` build. The scoring engine, i18n architecture,
  Magic Box and floating bubbles are all proven there — lift, don't rebuild.
- The FAME survey and this one should feel like siblings: same typographic system, same
  honesty rules, different palette weight (FAME is light and institutional; SAIDS is dark
  and commercial).
- After 50 completed scans, revisit `GTM_STRATEGY.md` §4.1 — the peer-comparison flag comes
  on and the Sarawak Business Potential Index becomes buildable.
