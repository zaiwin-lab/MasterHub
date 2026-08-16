# Your Best MVP — MVP³ Potential Scan

Live: **https://yourbestmvp.netlify.app**

A free 8-minute business diagnostic. Twenty-two questions, then a report — the **Potential
Snapshot** — that puts a ringgit figure on what the respondent's business is losing every
month, names the leaks, and hands back three fixes they can do themselves this week.

Built by **KAPT (KOBIS AI Prodigy Team)** for **SAIDS**, a practice of
[KOBIS Berhad](https://www.kobisberhad.com).

The instrument, the scoring weights and the leak formulas are specified in
`../SURVEY_INSTRUMENT.md`, which is normative. This app implements it.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run typecheck  # strict, zero `any` in src/lib and src/state
npm run fixtures   # the scoring fixtures — see below
```

## What is here

The full journey: `intro → consent → respondent type → 22 questions → magic box → review →
processing → Snapshot`.

- **Three branching paths.** Owner (22 questions), executive (20), founder (18). Questions
  that have no operating history behind them are skipped rather than answered blind.
- **One question per screen**, with a progress bar, section trail, back navigation, and
  autosave to `localStorage` on every change. Close the tab and the intro offers to resume.
- **Keyboard-completable end to end** — number keys select, Enter advances.
- **Escape hatches.** "Not sure" on judgement questions, "Prefer not to say" on the two money
  questions, both stored as their own sentinel values so a skipped answer is never confused
  with a zero.
- **The Magic Box.** Paste every link at once, in any format. They are parsed, classified by
  platform, stripped of tracking parameters and deduplicated into editable cards. Bare
  `@handles` are detected and suppressed when a matching profile URL is already present.
- **Deterministic scoring.** Nine weighted dimensions across three lenses, a six-leak
  estimation engine, and a rule-based MVP³ candidate. Same answers in, same Snapshot out —
  no randomness, no network, no model call.
- **Two languages**, EN and BM, switchable at any point including on a Snapshot already
  generated. See the caveat below.

## Honesty rules the build enforces

These are in code, not in copy. They are the reason the number gets believed.

- **Nothing is fabricated.** No traffic, follower, engagement, ranking, revenue or competitor
  figures appear anywhere, because none of it was measured.
- **Declared is not verified.** A browser cannot fetch third-party pages, so every submitted
  link is recorded as `declared`, `assets_reviewed` stays `0`, and confidence is capped at
  `moderate`.
- **Missing data is missing, never zero.** A skipped question is excluded from its dimension.
  A dimension with no usable input reports as insufficient data, not as a low score.
- **Every estimate shows its arithmetic**, with the respondent's own inputs substituted in and
  the constants named. "Show me how these were calculated" expands the lot.
- **L3 and L6 are opportunity, not loss**, and are never summed into the headline figure.
  Only L1, L2, L4 and L5 are.
- **The all-declined case shows no ringgit figure at all.** If volume, value and hours were
  all skipped, the report says so instead of inventing a number.
- **The Snapshot renders from a structured object.** "Show the structured output behind this
  report" reveals the exact JSON.
- **No band is insulting.** A low score is framed as upside, because a dismissive report ends
  the relationship on the spot.

## The leak engine

| Code | Leak | Estimated from |
|---|---|---|
| `L1` | Response Lag | reconciled monthly pipeline × miss rate for the declared response speed |
| `L2` | Manual Repetition | hours/week × 4.33 × loaded hourly cost × automatable share |
| `L3` | Invisible Offer | pipeline × discoverability gap × 25% reachable — **opportunity** |
| `L4` | Quote Drag | quoted pipeline × decay rate for the declared turnaround |
| `L5` | One-Head Dependency | owner-only hours × 4.33 × owner hourly value |
| `L6` | Untapped Asset | qualitative — becomes the MVP³ candidate |

Constants live in one place, `CONST` in `src/lib/scoring.ts`, and every one of them is shown
to the respondent on request: RM 25 loaded hourly cost, RM 60 owner hourly value, 25% assumed
close rate, 60% automatable share, and a hard cap of 35% of estimated monthly revenue on the
total.

**Pipeline reconciliation.** Band midpoints multiplied together routinely imply a pipeline
larger than the revenue the respondent just declared. The 35% cap would still hold the
headline down, but the arithmetic panel would show a monthly pipeline several times the
business the owner described — and they would spot it immediately. So when a revenue band is
given, the pipeline is held to it, and the workings say so in plain language.

## Scoring fixtures

`npm run fixtures` runs three hand-checked respondents through the engine and asserts 17
invariants: a strong performer, a heavy leaker, and one who declined every money question.

This is the only automated testing here and it is not decoration — the scoring *is* the
product, and a silent regression in it stays invisible until a client challenges a number in
a meeting. Run it before every deploy.

## Configuration

Everything in `.env.example`. All of it is optional, and each feature stays hidden until its
variable is set — nothing pretends to work.

| Variable | Effect while unset |
|---|---|
| `VITE_WHATSAPP_NUMBER` | WhatsApp CTA is hidden. The default is a deliberately invalid number so a demo build can never dial a stranger. |
| `VITE_BOOKING_URL` | The RM 1,500 Potential Readout CTA is hidden. Scan ID is appended as `?scan=…`. |
| `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` | **The email capture form does not render at all.** A form that promises to send a copy and silently drops it is worse than no form. |

Supabase expects a `scans` table, insert-only via the anon key, with RLS permitting insert and
denying select.

## Deploying

Netlify, via the committed `netlify.toml`: build `npm run build`, publish `dist`, SPA
redirect, security headers, immutable caching on `/assets/*`.

## Known limitations

- **The Bahasa Malaysia copy has not had a native-speaker review.** The infrastructure is
  complete and coverage is full, but it needs a local reader before this goes out widely.
- **Nothing is captured yet.** Until the Supabase variables are set, responses live in
  `localStorage` only and are never transmitted. Respondents can still print their Snapshot
  to PDF.
- **Estimates are estimates.** Every figure derives from declared band midpoints, not from
  anything measured. That is stated on screen, and the arithmetic is always one tap away.
- **The three macro statistics are not on this build.** The scan does not need them; if they
  are added later, each needs a verified primary source and a working link before it ships.

## Deliberately not here

A marketing website · a method or pricing page · client login · dashboards · admin UI · a
live model behind any assistant · server-side PDF generation · a blog · case studies · CRM
integration beyond Supabase and a WhatsApp link · verified link fetching · Chinese and Iban ·
A/B testing · tests beyond the scoring fixtures.

The Scan sells on its own. Once a hundred real responses have shown which leaks actually
dominate and which language moves people, the marketing site can be written from evidence
instead of guesswork.
