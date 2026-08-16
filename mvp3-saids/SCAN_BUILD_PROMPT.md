# MVP³ Potential Scan — Build Prompt (survey-first)

**This is the build to do first.** It replaces `PORTAL_BUILD_PROMPT.md` for v1 — that
document is now Phase 2 and should not be built until this one has produced real scans.

**How to use:** open a fresh Claude Code session in the new repo with `MasterHub` loaded and
paste everything below the line. `SURVEY_INSTRUMENT.md` in this folder is a normative input —
if you are pasting into a tool that cannot see it, paste that file too. It carries the
question set, the scoring weights and the leak formulas, and the build cannot be completed
without it.

**Target repo:** `zaiwin-lab/MVP3-Potential-Scan` (new)
**Ship window:** 7 days
**Scope rule:** if it is not the survey or the report the survey produces, it is not in v1.

---

## PROMPT START

You are building the **MVP³ Potential Scan** — a free, 8-minute business diagnostic that
ends in a personalised report putting a ringgit figure on what the respondent's business is
losing every month.

The Scan is the entire product. There is no marketing website in this build, and building
one would be a mistake — a homepage that has not earned its copy from real scan data is
guesswork. The Scan opens on a short intro screen, runs 22 questions, and delivers a report
called the **Potential Snapshot**. The Snapshot is what sells. Everything you build serves
either *getting them through the questions* or *making the Snapshot impossible to ignore*.

Built by **KAPT (KOBIS AI Prodigy Team)** for **SAIDS — Smart AI Digital Solutions**, a
practice of **KOBIS Berhad**, led by **Ts. Zaiwin Kassim, MBA**.

Read `SURVEY_INSTRUMENT.md` in full before writing any code. It is normative for the
question set, the nine scoring dimensions and weights, the six leak formulas, the constants,
the MVP³ candidate lookup table and the Snapshot structure. Do not redesign any of it.

---

### 1. The one thing this build must get right

A stranger arrives, answers 22 questions, and leaves believing a number about their own
business that they did not know when they arrived — and wanting to talk to us about it.

Two metrics decide whether the build succeeded. Instrument both from the first commit:

| Metric | Target | If it misses |
|---|---|---|
| **Completion** — completes ÷ starts | ≥ 60% | The instrument is too heavy. Cut questions. Do not add persuasion. |
| **Snapshot → contact** — WhatsApp or booking ÷ completes | ≥ 20% | The Snapshot isn't landing the pain. Sharpen the Ledger and the Delay Clock, not the buttons. |

**Pre-decided cut list.** If completion comes in under 50%, remove in this order and
re-measure: `Q6 differentiation` → `Q20 dormant_assets` → `Q13 bottleneck`. Deciding this
now stops it becoming a debate later.

---

### 2. Stack

Match `zaiwin-lab/MVP-FAME-Survey` so proven modules can be lifted directly.

- **Vite + React 18 + TypeScript** (strict), **Tailwind CSS v4** via `@tailwindcss/vite`
- Fonts self-hosted: `@fontsource-variable/inter`, `@fontsource-variable/newsreader`
- **No UI library, no animation library, no router, no state library.** A typed reducer in
  `src/state/store.ts` with `localStorage` persistence, and a `screen` union for navigation.
- `netlify.toml`: build `npm run build`, publish `dist`, SPA redirect, security headers
  (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`), immutable caching on `/assets/*`
- `npm run typecheck` passes clean, zero `any` in `src/lib/` and `src/state/`

**Lift from the FAME repo rather than rebuilding** — these are solved and re-solving them
costs days you do not have:

| Module | What it does |
|---|---|
| `src/lib/magicbox.ts` | Link parsing, platform classification, tracking-param stripping, dedupe |
| `src/i18n/` | Dictionary architecture and language switching |
| `src/components/FloatingBubbles.tsx` | Assistant + WhatsApp bubbles |
| `src/components/ui.tsx` | Question controls — radio cards, chips, scale, segmented |

---

### 3. The flow

```
intro → consent → respondent type → survey (22q) → magic box → review → processing → SNAPSHOT → save
```

**Intro screen — short, and it is not a homepage.** One screen, no scrolling on desktop:

> **Eyebrow:** MVP³ Potential Scan · KOBIS Berhad
> **H1:** Every business has an untapped MVP.
> **Sub:** Yours is leaking money while you look for it. Twenty-two questions, about eight minutes, and you'll know where — how much it costs a month, and three things you can fix yourself this week.
> **Primary:** Start the Scan →
> **Trust line:** Free · No signup to see your result · Nothing shared with anyone
> **Returning visitor:** if a saved session exists, show *"Continue where you left off — you're 14 questions in"* above the primary button.

Below the fold, **three short blocks only** — resist adding more:

1. **What you get.** Six one-line bullets: your MVP³ Index · three lens scores · your top 3 leaks in RM per month · a 90-day cost of delay · three fixes you can do yourself this week · one product opportunity hiding in your business.
2. **The six leaks.** `L1` Response Lag · `L2` Manual Repetition · `L3` Invisible Offer · `L4` Quote Drag · `L5` One-Head Dependency · `L6` Untapped Asset. One line each. This makes the visitor self-diagnose before answering a single question, which is exactly what makes them start.
3. **Who's behind it.** Two sentences, a real photograph of Zaiwin, KOBIS Berhad, a link to kobisberhad.com. Nothing more.

**Survey behaviour** — all proven in the FAME build:

- One question per screen. Progress bar, section trail, back navigation always available.
- Autosave to `localStorage` on every change; offer resume on return.
- "Not sure" on judgement questions, "Prefer not to say" on money questions. Both recorded
  as absent, never as zero.
- Branching by respondent type per `SURVEY_INSTRUMENT.md` §2.
- Keyboard-completable end to end: number keys select options, Enter advances.
- **Money questions get a reassurance line under the control**, not in a tooltip:
  *"Used only to keep the estimates in a sensible range. Never shared."* Q4 and Q10 are where
  people abandon; this line is worth more than any progress bar.

**Magic Box** — paste every link at once, any format, parsed into editable confirm/remove
cards. Every asset recorded `declared`, never verified. Then three optional free-text
fields feeding `asset_depth` and the MVP³ candidate.

**Processing screen** — 2.5–4 seconds with real stage labels: *"Scoring nine dimensions" →
"Estimating leak exposure" → "Selecting your MVP³ candidate."* It must reflect work actually
happening, not fake a progress bar. This is a deliberate beat; an instant result feels cheap.

---

### 4. The Snapshot — this is the product

Build exactly to `SURVEY_INSTRUMENT.md` §8, in that order. Specific requirements beyond it:

**The score reveal.** Dark ground, the MVP³ Index large and monospaced with
`font-variant-numeric: tabular-nums`, band label beneath, confidence level stated openly
next to it. Count up once on reveal; disabled under `prefers-reduced-motion`. **No band is
insulting** — a dismissive low score ends the relationship on the spot.

**The Leakage Ledger.** The commercial heart of the build. Top three leaks by value, each a
row carrying: the `L`-code, the leak name, the estimated RM/month set large in mono, a
one-line plain-language explanation of why it happens, and the specific SAIDS fix. Below
them, a single line — *"Show me how these were calculated"* — expanding the full arithmetic
with **their own inputs substituted in** and any defaults named.

**The Cost of Delay Clock.** One sentence, one number:
*"If nothing changes, the next 90 days cost you approximately **RM X**."*
Estimate label visible, arithmetic one tap away.

**The First 7.** Three fixes they can do themselves this week, free, specific enough to
actually act on. These appear **before** any paid call-to-action. That ordering is
conversion mechanics — reciprocity, plus proof we are not withholding the obvious to force
a sale. Do not move them below the CTAs.

**Your MVP³ candidate.** Selected from the lookup table in `SURVEY_INSTRUMENT.md` §7 —
deterministic, never generated. One name, one paragraph, one realistic build window in days.
This is the highest-converting single element in the report; give it real space.

**Conversion surface at the end, in this order:**

1. **Save this Snapshot** — email capture, framed as *"Send me a copy"*, never as a gate
2. **Talk it through — RM 1,500 Potential Readout, 90 minutes** — booking link with the scan ID attached
3. **WhatsApp us** — pre-filled with the scan ID and the headline leak figure, so the conversation opens with the number already on the table

**Print stylesheet** so "Save as PDF" produces a clean document with the KOBIS footer. People
forward this to their business partner; that forward is the cheapest lead source you will
ever have. Make the PDF good.

---

### 5. Scoring

`src/lib/scoring.ts` is a **pure function** from answers to a typed `Snapshot` object. No
randomness, no model call, no network. Same inputs, same Snapshot, every time. The Snapshot
page renders from that object and never from free text.

Implement all six leak formulas per `SURVEY_INSTRUMENT.md` §6, including:

- the **35%-of-revenue cap** on total monthly leak
- **L3 and L6 presented as opportunity and excluded from the headline figure** — inflating
  the headline by folding opportunity into loss is the fastest way to lose a serious buyer
- the **all-declined case**: if leads, deal value and hours were all skipped, show **no
  ringgit figure at all**. Switch to a qualitative ledger and say why. Build this path
  properly; it is not an edge case, it is roughly one respondent in eight.

Commit **three hand-verified answer sets as fixtures** — a high scorer, a heavy leaker, and
an all-declined respondent — with their expected outputs. This is the only automated testing
in v1 and it is not optional: the scoring is the product, and a silent regression in it is
invisible until a client challenges a number in a meeting.

---

### 6. Honesty rules — enforced in code, not claimed in copy

1. **Nothing is fabricated.** No traffic, follower counts, engagement, rankings, revenue or
   competitor figures appear anywhere, because none of it was measured.
2. **Declared is not verified.** A browser cannot fetch third-party pages. Every link is
   labelled `declared`, `assets_reviewed` stays `0`, confidence is capped at `moderate`.
3. **Missing data is missing, never zero.**
4. **Every finding is classified** — fact, inference, recommendation, limitation — and the
   classification renders on screen next to it.
5. **Every estimate shows its arithmetic on demand**, with their inputs and any defaults named.
6. **The Snapshot renders from a structured object.** *"Show the structured output behind
   this report"* reveals the exact JSON.
7. **No peer comparison until the cohort is real.** Until ≥ 50 completed scans, nothing may
   say "businesses like yours scored X". Build the component, flag it, leave the flag off.
8. **No partner name, logo or endorsement without written approval** — reuse FAME's
   `src/config/branding.ts` build-time flag pattern.

---

### 7. Languages — English and Bahasa Malaysia only in v1

A deliberate scope cut from the FAME build's four. Chinese and Iban are Phase 2, once the
instrument has stopped changing — translating a question set that is still being edited
means paying for the same work twice.

Dictionaries in `src/i18n/`, rows ordered `[en, bm]`, structured so `zh` and `ib` columns
can be added without touching component code: `dict.ui.ts` · `dict.survey.ts` ·
`dict.report.ts`. The scoring engine emits every generated sentence twice — once as English
so the stored JSON reads on its own, once as a translation key the UI resolves. Missing cells
fall back to English rather than rendering blank.

**Answer values are stable keys** (`fnb`, `under_1hr`), never display strings — this is what
makes the cohort comparable later.

Mark the BM copy in the README as **awaiting native-speaker review**, the same honest caveat
the FAME build carries.

---

### 8. Capture and handoff

- On save: `POST` name, email, phone, business name, the full snapshot JSON and the consent
  record to **Supabase** — one `scans` table, insert-only via the anon key, RLS permitting
  insert and denying select. Pick this, not Brevo-plus-functions; one moving part.
- Mirror the contact into a **Brevo** list with attributes `mvp3_index`,
  `total_monthly_leak`, `mvp3_candidate`, `timeline`, `industry` — so follow-up can segment
  on leak size and urgency without anyone opening a spreadsheet.
- **WhatsApp:** floating bubble plus the Snapshot CTA, pre-filled in the active language with
  the scan ID and headline leak figure. Number from `VITE_WHATSAPP_NUMBER`, defaulting to a
  deliberately invalid placeholder so a demo build can never dial a stranger.
- **Booking:** Cal.com or Calendly, scan ID passed as a query parameter.
- **Consent:** three separate checkboxes, none pre-ticked — research use (anonymised,
  aggregate), send me my Snapshot, future contact. State what is stored, for how long, and
  that KOBIS Berhad is the data controller. Store the consent version with the response.

---

### 9. Analytics — seven events, no more

`scan_started` · `question_answered` *(id, elapsed)* · `scan_abandoned` *(last question id)*
· `scan_completed` *(index, total leak, duration)* · `arithmetic_opened` · `email_captured` ·
`cta_clicked` *(which)*

`scan_abandoned` with the question ID is the single most valuable event in the build —
without it you cannot fix completion, and completion is the top of everything.

Plausible or GA4. No session recording, no third-party pixels — a product selling data
discipline cannot leak its respondents to ad networks.

---

### 10. Design

Inherit FAME's typographic system so the two properties read as siblings; shift the palette
darker and more commercial.

- **Serif display, sans body, mono data.** `Newsreader Variable` headings (weight 500,
  `letter-spacing: -0.018em`, `text-wrap: balance`), `Inter Variable` body, `ui-monospace`
  for every number, score, `L`-code and label. **Every ringgit figure is monospaced with
  `font-variant-numeric: tabular-nums`** — this one choice does more for perceived rigour
  than anything else on the page.
- **Light survey, dark Snapshot.** The questions stay calm and legible. The report opens on
  near-black for the score reveal. Dark reads as authority and data.
- **Gold means money, cyan means data. Red is never used for the respondent's own results** —
  a low score must not render as an alarm. Pressure comes from the words; the colour stays
  composed.
- Motion 200–320ms, `cubic-bezier(0.22, 1, 0.36, 1)`. Nothing loops or bounces.
  `prefers-reduced-motion: reduce` disables the count-up and every transition.
- **No stock photography.** Typography, data, whitespace, and one real photograph of Zaiwin.

**Mobile is the primary target, not the responsive afterthought.** This audience answers on
a phone, often on mobile data, often mid-task. Tap targets ≥ 44px, one question filling the
viewport without scrolling, the action bar reachable by thumb, and the whole thing usable
one-handed. Test on a real mid-range Android before calling anything done.

Accessibility: semantic landmarks, real `<button>` and `<label>` elements, visible
`:focus-visible` rings, AA contrast including on the dark Snapshot.

---

### 11. Definition of done

- [ ] `npm run build` and `npm run typecheck` pass clean
- [ ] All 22 questions across all three respondent paths, in EN and BM
- [ ] Scoring matches `SURVEY_INSTRUMENT.md` §5, verified against the three committed fixtures
- [ ] All six leak formulas per §6, with the 35%-of-revenue cap enforced
- [ ] L3 and L6 shown as opportunity and **excluded** from the headline figure
- [ ] The all-declined case produces a qualitative ledger and **no** ringgit figure
- [ ] Arithmetic disclosure works on every estimate, showing their own inputs
- [ ] "Show the structured output behind this report" reveals the real JSON
- [ ] Peer-comparison component built, flagged, **off**
- [ ] Autosave, resume, back navigation, keyboard-only completion all work
- [ ] Print stylesheet produces a clean, forwardable PDF
- [ ] Supabase row written, Brevo contact created, WhatsApp deep link carries the leak figure
- [ ] All seven analytics events verified firing in the live dashboard
- [ ] Tested on a real mid-range Android on mobile data
- [ ] Lighthouse ≥ 95 performance and ≥ 95 accessibility on mobile

---

### 12. Not in v1 — do not build these

A marketing website · a `/method` page · pricing pages · client login · dashboards · admin UI
· a live LLM behind the assistant (scripted answers, labelled as scripted) · server-side PDF
generation · a blog · case studies · CRM integration beyond Supabase, Brevo and a WhatsApp
link · verified link fetching · Chinese and Iban · A/B testing infrastructure · tests beyond
the three scoring fixtures.

The Scan runs at a subdomain and needs nothing else to sell. Once 100 real scans have told
us which leaks actually dominate and which language moves people, the marketing site writes
itself from evidence instead of guesswork — and `PORTAL_BUILD_PROMPT.md` becomes buildable.

## PROMPT END

---

## Before you launch

1. **Run the Scan on three businesses you already know well.** If the Snapshot's findings
   don't match what you know to be true about them, the scoring weights are wrong. This is
   the cheapest bug-fix window you will ever have.
2. **Set `VITE_WHATSAPP_NUMBER` to the real line.** The default is deliberately invalid.
3. **Send it to 40 people in your warm network personally, not as a broadcast.** Target 25
   completed scans in the first fortnight, then call every respondent whose leak exceeds
   RM 10,000/month.
