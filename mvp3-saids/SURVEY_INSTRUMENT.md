# MVP³ Potential Scan — Instrument, Scoring and Leak Engine

**Normative specification.** The build prompt (`PORTAL_BUILD_PROMPT.md`) references this
document. Where the two disagree, this document wins.

**Instrument version:** `2026.1`
**Scoring version:** `1.0.0`
**Report version:** `1.0.0`

---

## 1. Design constraints

| Constraint | Value | Reason |
|---|---|---|
| Question count | **22 max** on the longest path | 8-minute promise; completion rate is the top of the whole funnel |
| Screens | **One question per screen** | Proven in the FAME build; keeps mobile completion high |
| Persistence | Autosave to `localStorage` on every change | Resume after a dropped session |
| Missing data | Recorded absent, **never scored as zero** | A skipped question must not read as a failure |
| Answer storage | Stable keys (`fnb`, `under_1hr`), never display strings | Cohort stays comparable across copy edits and languages |
| Escape hatches | "Not sure" on judgement questions, "Prefer not to say" on money questions | Removes the reason to abandon |
| Estimates | Always labelled, arithmetic always viewable | Credibility; see §6.6 |

---

## 2. Respondent paths

Asked on screen 2, drives branching.

| Key | Label | Description | Path length |
|---|---|---|---|
| `owner` | I own or lead this business | Established business, owner-operator | 22 questions |
| `executive` | I manage a function or department | Corporate, GLC, agency, statutory body | 20 questions |
| `founder` | I'm starting something new | Pre-revenue or under 12 months | 18 questions |

Branch rules:
- `founder` skips: Q12 (repetitive hours), Q14 (quote drag), Q15 (owner-only hours) — no
  operating history to report. Their Hidden Potential lens is scored on `asset_depth` and
  `ai_leverage` only, and the Snapshot says so.
- `executive` skips: Q15 (owner-only hours), Q21 (decision authority is asked differently —
  see Q21b).
- `owner` sees all.

---

## 3. Sections

| ID | Name | Questions | Lens fed |
|---|---|---|---|
| `profile` | About the business | Q1–Q4 | context, no score |
| `offer` | What you sell | Q5–Q7 | Market Pull |
| `demand` | Where customers come from | Q8–Q10 | Market Pull |
| `operations` | How the work gets done | Q11–Q15 | Build Readiness + leak inputs |
| `digital` | Your digital presence | Q16–Q17 + Magic Box | Market Pull |
| `ai` | AI today | Q18–Q19 | Hidden Potential |
| `potential` | What's sitting unused | Q20 | Hidden Potential |
| `decision` | Making it happen | Q21–Q22 | Build Readiness + qualification |

---

## 4. The instrument

Types match the FAME build's `QuestionType` union: `single` · `multi` · `scale` ·
`segmented` · `select` · `text` · `longtext`.

### Section: profile

**Q1 · `industry` · select** — *What line of business are you in?*
`fnb` F&B / restaurant · `retail` Retail / trading · `services` Professional services ·
`construction` Construction / contracting · `automotive` Automotive / workshop ·
`health` Health / clinic / wellness · `education` Education / training ·
`logistics` Logistics / transport · `agro` Agriculture / agro-based ·
`manufacturing` Manufacturing · `property` Property / real estate ·
`tourism` Tourism / hospitality · `tech` Technology / digital · `other` Something else

**Q2 · `respondent_type` · single** — *Which of these sounds most like you?*
(see §2 — `owner` / `executive` / `founder`)

**Q3 · `headcount` · segmented** — *How many people work in the business, including you?*
`solo` Just me · `2_9` 2–9 · `10_29` 10–29 · `30_79` 30–79 · `80_plus` 80+
→ midpoints for cost math: 1 · 5 · 19 · 54 · 120

**Q4 · `revenue_band` · segmented · allowDecline** — *Roughly what does the business turn over in a year?*
`under_500k` Under RM 500k · `500k_2m` RM 500k–2m · `2m_10m` RM 2m–10m ·
`10m_50m` RM 10m–50m · `over_50m` Over RM 50m · `decline` Prefer not to say
→ midpoints: 250k · 1.25m · 6m · 30m · 75m · null
*Note under the control: "Used only to keep the estimates in a sensible range. Never shared."*

### Section: offer

**Q5 · `offer_clarity` · scale 1–5** — *If I asked five of your customers what you do, would they all give the same answer?*
1 = They'd all say something different · 5 = Word for word the same

**Q6 · `differentiation` · single · allowNotSure** — *Why do customers choose you over the alternative?*
`price` We're cheaper · `speed` We're faster · `quality` Better quality or craft ·
`relationship` They know and trust us personally · `access` We're the only ones nearby who do it ·
`expertise` Specialist knowledge others don't have · `unclear` Honestly, I'm not sure

**Q7 · `offer_written` · segmented** — *Is your offer written down anywhere a stranger could read it — a page, a profile, a proper brochure?*
`no` Nowhere · `informal` Roughly, in a WhatsApp or social post · `yes_basic` Yes, basic ·
`yes_strong` Yes, and it's genuinely good

### Section: demand

**Q8 · `lead_sources` · multi (max 3)** — *Where do most new customers come from?*
`referral` Word of mouth · `walk_in` Walk-in / passing trade · `social` Social media ·
`search` Google or maps search · `marketplace` Shopee / Lazada / delivery apps ·
`tender` Tenders or contracts · `outbound` We go out and find them ·
`repeat` Existing customers buying again · `unsure` Not sure

**Q9 · `leads_per_month` · segmented · allowNotSure** — *How many new enquiries reach you in a typical month?*
`under_10` Under 10 · `10_30` 10–30 · `31_100` 31–100 · `101_300` 101–300 · `over_300` More than 300
→ midpoints: 5 · 20 · 65 · 200 · 450

**Q10 · `avg_deal_value` · segmented · allowDecline** — *What's a typical sale or job worth?*
`under_500` Under RM 500 · `500_2k` RM 500–2,000 · `2k_10k` RM 2,000–10,000 ·
`10k_50k` RM 10,000–50,000 · `over_50k` Over RM 50,000
→ midpoints: 250 · 1,250 · 6,000 · 30,000 · 90,000

### Section: operations

**Q11 · `response_time` · segmented** — *When a new enquiry comes in, how quickly does someone actually reply?*
`under_15m` Within 15 minutes · `under_1hr` Within the hour · `same_day` Same day ·
`next_day` Next day · `varies` Longer, or it depends
→ **L1 miss rates:** 0.05 · 0.10 · 0.22 · 0.35 · 0.50

**Q12 · `repetitive_hours` · segmented** *(skipped for `founder`)* — *Across your team, how many hours a week go into repetitive work — retyping, copying between systems, chasing the same information?*
`under_5` Under 5 · `5_15` 5–15 · `16_40` 16–40 · `41_100` 41–100 · `over_100` More than 100
→ midpoints: 3 · 10 · 28 · 70 · 140

**Q13 · `bottleneck` · single** — *When things slow down, where does it usually jam?*
`sales` Getting enquiries in · `response` Replying fast enough · `quoting` Preparing quotes or proposals ·
`delivery` Actually delivering the work · `collection` Getting paid · `admin` Paperwork and admin ·
`people` Not enough of the right people · `owner` Everything waits for me

**Q14 · `quote_days` · segmented` *(skipped for `founder`)* — *From enquiry to a quote or proposal in the customer's hands — how long, typically?*
`same_day` Same day · `1_2_days` 1–2 days · `3_5_days` 3–5 days · `1_2_weeks` 1–2 weeks · `longer` Longer
→ **L4 decay rates:** 0.02 · 0.06 · 0.14 · 0.25 · 0.35

**Q15 · `owner_only_hours` · segmented** *(`owner` only)* — *How many hours a week go to work that only you can do?*
`under_5` Under 5 · `5_15` 5–15 · `16_30` 16–30 · `over_30` More than 30
→ midpoints: 3 · 10 · 23 · 38

### Section: digital

**Q16 · `digital_presence` · multi** — *Which of these does the business actually have and use?*
`website` A website · `gbp` Google Business Profile · `facebook` Facebook page ·
`instagram` Instagram · `tiktok` TikTok · `linkedin` LinkedIn · `whatsapp_biz` WhatsApp Business ·
`marketplace` Shopee / Lazada / delivery app listing · `none` None of these

**Q17 · `findability` · scale 1–5** — *If someone in your area needed exactly what you sell and searched online, would they find you?*
1 = No chance · 5 = They'd find us first

**MAGIC BOX** *(not a scored question — reuse the FAME `magicbox.ts` module wholesale)*
Paste every link at once, any format. Parsed, platform-classified, tracking parameters
stripped, deduplicated, shown as editable cards. Bare `@handles` detected and suppressed
when a matching profile URL is already present. Every asset is recorded as **`declared`**,
never `verified` — the browser cannot fetch third-party pages, and the Snapshot must say so.

Followed by three short free-text fields (all optional, feed `asset_depth` and the MVP³
candidate): *What does the business do, in your own words* · *Who are your best customers* ·
*Anything you're proud of that most people don't know about you*.

### Section: ai

**Q18 · `ai_usage` · single** — *Where are you with AI right now?*
`none` Haven't touched it · `personal` I use ChatGPT or similar personally, not in the business ·
`scattered` A few people use it, nothing organised · `some_process` It's built into one or two real processes ·
`core` It runs core parts of what we do

**Q19 · `ai_blocker` · single · allowNotSure** — *What's actually stopping you from doing more with it?*
`dont_know_where` I don't know where it would even apply · `no_time` No time to work it out ·
`cost` Worried about the cost · `trust` Don't trust the output · `skills` Nobody here knows how ·
`data` Our information is too messy · `tried_failed` We tried and it didn't stick ·
`nothing` Nothing — we're moving on it

### Section: potential

**Q20 · `dormant_assets` · multi** — *Which of these do you have sitting there, not really being used?*
`customer_data` Years of customer records · `expertise` Deep know-how in someone's head ·
`audience` A following or mailing list · `content` Photos, videos, written material ·
`process` A way of working that's genuinely better than the norm ·
`equipment` Equipment or space with spare capacity · `supplier` Supplier or partner relationships ·
`brand` A name people in the area already trust · `none` Nothing I can think of

### Section: decision

**Q21 · `decision_authority` · segmented** *(`owner` / `founder`)* — *If you decided today to fix the biggest thing, could you just decide?*
`yes_alone` Yes, it's my call · `yes_with_partner` Yes, with one other person · `board` Needs board or family agreement · `no` Not my decision

**Q21b · `decision_authority_exec` · segmented** *(`executive`)* — *How would a decision like this get made?*
`my_budget` I have budget for it · `recommend` I'd recommend, someone else approves ·
`committee` Committee or procurement process · `unclear` Genuinely unclear

**Q22 · `timeline` · segmented** — *If the numbers made sense, when would you want something working?*
`this_month` This month · `this_quarter` This quarter · `this_year` Sometime this year ·
`exploring` Just exploring for now

---

## 5. Scoring

### 5.1 Dimensions and weights

Nine dimensions, three per lens. Weights sum to `1.00`.

| Lens | Dimension | Key | Weight | Built from |
|---|---|---|---|---|
| **Market Pull** | Offer clarity | `offer_clarity` | 0.12 | Q5, Q6, Q7 |
| | Demand signal | `demand_signal` | 0.12 | Q8, Q9, Q10 |
| | Discoverability | `discoverability` | 0.09 | Q16, Q17, declared assets |
| **Build Readiness** | Delivery capacity | `delivery_capacity` | 0.12 | Q13, Q11, Q3 |
| | Process readiness | `process_readiness` | 0.12 | Q12, Q14, Q19 (`data` blocker) |
| | Decision velocity | `decision_velocity` | 0.09 | Q21/Q21b, Q22 |
| **Hidden Potential** | Leakage control | `leakage_control` | 0.14 | inverse of total leak vs. revenue band |
| | AI leverage | `ai_leverage` | 0.11 | Q18, Q19 |
| | Asset depth | `asset_depth` | 0.09 | Q20, free-text richness |

**MVP³ Index** = weighted mean of all nine, `0–100`, rounded.
**Lens sub-scores** = weighted mean within each lens, renormalised to that lens's weight sum.

### 5.2 Bands

| Range | Band key | Label | Snapshot tone |
|---|---|---|---|
| 80–100 | `market_ready` | Market-Ready | "You're close. The gap is execution speed, not capability." |
| 65–79 | `compounding` | Compounding | "The engine works. It's running below what it could." |
| 50–64 | `building` | Building | "Real foundations, real leaks. This is the best moment to move." |
| 32–49 | `stirring` | Stirring | "The potential is clear and mostly untouched." |
| 0–31 | `dormant` | Dormant | "Almost everything here is still upside." |

**No band is insulting.** A dismissive low band ends the relationship on the spot. Every
band frames the position as an opportunity with a next move.

### 5.3 Confidence

Mirrors the FAME rule. `evidence_coverage` = share of scored questions answered.

| Condition | Confidence |
|---|---|
| coverage < 0.5 | `low` |
| coverage ≥ 0.5, any asset unverified (always true in v1) | `moderate` — **capped** |
| coverage ≥ 0.8 and assets server-verified | `good` — unreachable in v1 |

Confidence is displayed on the Snapshot, next to the Index. It is never hidden.

### 5.4 Missing data

A skipped or declined question is excluded from its dimension's mean and recorded in
`limitations`. It is **never** substituted with zero. If a dimension has no answered inputs,
it is reported as `insufficient data`, not scored — and the Snapshot names it as something
the Clarity Sprint would establish.

---

## 6. The Leak Engine

### 6.1 Constants

```
LOADED_HOURLY_COST   = RM 25    // ~RM 4,300/mo loaded ÷ ~173 hrs. SME Malaysia baseline.
OWNER_HOURLY_VALUE   = RM 60    // owner opportunity cost
DEFAULT_CLOSE_RATE   = 0.25     // used when the respondent declines revenue/value questions
AUTOMATABLE_SHARE    = 0.60     // share of declared repetitive hours realistically automatable
LEAK_CAP_VS_REVENUE  = 0.35     // total monthly leak may never exceed 35% of est. monthly revenue
```

Every constant is displayed on the public `/method` page with this reasoning. A constant we
cannot defend in a sales call is a constant we should not use.

### 6.2 The six leaks

| Code | Name | Formula | Output |
|---|---|---|---|
| **L1** | Response Lag | `leads × missRate(Q11) × dealValue × closeRate` | RM/month |
| **L2** | Manual Repetition | `hours(Q12) × 4.33 × 25 × 0.60` | RM/month |
| **L3** | Invisible Offer | `leads × (1 − discoverability/100) × 0.25 × dealValue × closeRate` | RM/month **opportunity** |
| **L4** | Quote Drag | `leads × 0.5 × dealValue × closeRate × decay(Q14)` | RM/month |
| **L5** | One-Head Dependency | `hours(Q15) × 4.33 × 60` | RM/month |
| **L6** | Untapped Asset | not monetised — qualitative | named opportunity |

### 6.3 Aggregation — and the honesty rule that makes it credible

```
totalMonthlyLeak = L1 + L2 + L4 + L5          // hard leaks only
                 → capped at revenueMonthly × 0.35

L3 and L6 are presented alongside, labelled "opportunity, not loss",
and are NEVER added into the headline figure.
```

Inflating the headline by folding opportunity into loss is the single fastest way to lose a
sophisticated buyer. The restraint is the credibility.

### 6.4 Cost of Delay Clock

```
costOfDelay90 = totalMonthlyLeak × 3
```

Presented as: *"If nothing changes, the next 90 days cost you approximately **RM X**."*
Always with the estimate label and the arithmetic one tap away.

### 6.5 Ranking and presentation

Show the **top 3 leaks by value**. Each card carries: the leak name, the estimated RM/month,
a one-line plain-language explanation of why it happens, and the specific SAIDS fix.
Below the three, a single line: *"Show me how these were calculated"* → expands the full
arithmetic with the respondent's own inputs substituted in.

### 6.6 Estimation discipline — non-negotiable

- Every figure carries the word **estimate** in the visible UI, not in a footnote.
- The arithmetic is always viewable, with their inputs shown.
- Where an input was declined, the default used is named on screen.
- Nothing is presented as measured that was not measured.
- If `leads`, `dealValue` and `hours` were all skipped or declined, **no ringgit figure is
  shown at all** — the Snapshot switches to a qualitative ledger and says why. This case
  must be built, not hand-waved.

---

## 7. The MVP³ candidate

The highest-converting single element in the Snapshot: one named product or service
opportunity hiding inside their existing operation. Rule-based selection, deterministic,
never invented free-text.

Selection order — first match wins:

| If | Then the candidate is |
|---|---|
| `dormant_assets` includes `expertise` **and** `ai_usage` ≤ `scattered` | **Packaged knowledge** — turn what's in your head into a paid product (assisted diagnostic, training, subscription advisory) |
| `dormant_assets` includes `customer_data` **and** `leads_per_month` ≥ `31_100` | **Reactivation engine** — a repeatable offer to the customers you already have |
| `dormant_assets` includes `process` | **Productised service** — sell the way you work, not just the work |
| `dormant_assets` includes `audience` or `content` | **Audience-to-offer** — convert the attention you already own |
| `dormant_assets` includes `equipment` | **Capacity-as-a-service** — sell the spare hours on what you already own |
| `bottleneck` = `owner` **and** `owner_only_hours` ≥ `16_30` | **The second you** — an assisted layer that answers, quotes and briefs in your voice |
| `industry` = `fnb` / `retail` **and** `digital_presence` lacks `gbp` | **Findable storefront** — the demand is already searching; it cannot see you |
| default | **First responder** — an always-on front door that answers every enquiry in under a minute |

Each candidate maps to a fixed SAIDS module name, a one-paragraph "what it is", and a
realistic build window in days. Written once, reused — this is a lookup table, not generation.

---

## 8. Snapshot structure

Order is deliberate: earn belief, then apply pressure, then give something free, then ask.

1. **MVP³ Index + band + confidence**
2. **The three lenses** — Build Readiness · Hidden Potential · Market Pull, with a one-line read on each
3. **The Leakage Ledger** — top 3, RM/month, arithmetic on demand
4. **Cost of Delay Clock** — 90-day figure
5. **Your MVP³ candidate** — named, described, with a build window
6. **The First 7** — three fixes they can do themselves this week, free, specific
7. **The Next 30 / The Next 90** — two moves that need a partner (= the Clarity Sprint scope)
8. **SAIDS fit** — the module, the KAPT capability, the timeline
9. **Honesty panel** — declared vs. verified, constants used, what was not measured, `limitations[]`, and *"Show the structured output behind this report"* revealing the raw JSON
10. **Three CTAs, in this order** — Save/email this Snapshot · Book a Potential Readout (RM 1,500) · WhatsApp us

> Placing the free "First 7" *before* every paid CTA is not generosity, it is conversion
> mechanics: reciprocity, plus proof that we are not withholding the obvious to force a sale.

---

## 9. Data captured per response

```
scan_id · instrument_version · scoring_version · started_at · completed_at
language · respondent_type · answers{} (stable keys) · declared_assets[]
business_context{} · mvp3_index · lens_scores{} · dimension_scores[]
leaks[] (code, estimate, inputs_used) · total_monthly_leak · cost_of_delay_90
mvp3_candidate_key · confidence · evidence_coverage · limitations[]
consent{research, report_email, future_comms, version, timestamp}
contact{name, email, phone, business_name} — captured at save/email step, never before
```

Answers are stored as stable keys so the cohort survives copy edits, translation and
instrument revisions. This is what makes the **Sarawak Business Potential Index** possible
later — see `GTM_STRATEGY.md` §4.1.

---

## 10. Consent and data handling

Reuse the FAME consent screen pattern, three separate checkboxes, none pre-ticked:

1. **Research use** — anonymised, aggregate only, for the Sarawak Business Potential Index
2. **Send me my Snapshot** — the email capture, framed as a benefit
3. **Future contact** — optional, and genuinely optional

State plainly on the consent screen: what is stored, for how long, who the data controller
is (KOBIS Berhad), and that no sensitive personal data is collected. Consent version is
stored with the response.
