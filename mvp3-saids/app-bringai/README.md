# Bring AI To My Biz — AI Readiness Scan

Live: **https://bringaitomybiz.netlify.app**

The second front door to the same instrument. Same 22 questions, same scoring engine, same
leak math as `../app` — a completely different way in.

## What is different, and why

| | `app` (yourbestmvp) | `app-bringai` (this one) |
|---|---|---|
| **Opens with** | The method — "every business has an untapped MVP" | The threat — "AI is rewriting who wins in your market. Right now." |
| **MVP³ named** | On the landing page, immediately | **Only on the Snapshot**, after there is a result to attach it to |
| **Palette** | Light survey, dark report. Navy, cyan, gold. | Near-black throughout. Amber for urgency and money, steel for data. |
| **Type** | Serif display, calm, institutional | Heavy sans at 800, tight tracking, mono labels. Blunt and fast. |
| **Tone** | Diagnostic and considered | Operations terminal at 3am |

The reason for the split: telling someone what MVP³ is before they have a result is
explaining a method to a person with nothing to attach it to. This build sells the *problem*
first — the shift, the speed, the leak — and reveals the method on the Snapshot as the
explanation of what just happened to them. "You have just been through MVP³."

**The instrument version is unchanged (`2026.1`).** Both front doors write comparable
responses, so the cohort stays poolable for the benchmark work later. Do not fork the
question set — fork the framing only.

## The landing sequence

1. **Hero** — the shift, stated as fact, with the eight-minute promise
2. **The shift already happened** — three sourced statistics (see below)
3. **What is actually happening in your market** — the speed argument, the younger buyer who
   decides before ever speaking to you, and the reframe that experience is the asset
4. **AI works for you, not the other way round** — AI as the operator underneath, not a tool
   to learn
5. **The six leaks** — makes the visitor self-diagnose before question one
6. **What you get** · **Who is behind this** · **Close**

A sticky amber ticker carries the urgency lines. It pauses entirely under
`prefers-reduced-motion`.

## The statistics — read this before promoting the link

All three live in one file, `src/data/proof.ts`, each with its figure, claim, source, year
and a working outbound link. Nothing renders without all three.

**They are widely reported figures, not our own research, and every one carries
`checked: false`.** Open each primary source, confirm the figure and the framing, then set
`checked: true`. The MIT one in particular is frequently misquoted — read the original
framing before standing behind it.

A single prospect who checks a number and finds it hollow costs more than all three of them
gained. If a figure will not verify, delete it. Two verified numbers beat three impressive
ones.

The generational argument in section 3 is deliberately written as an *argument*, not a
statistic — no number is claimed for it, because we do not have one.

## Everything else

Identical to `../app`, and documented there: the branching instrument, deterministic scoring
across nine dimensions and three lenses, the six-leak engine with its constants and the 35%
cap, pipeline reconciliation, the honesty rules enforced in code, the all-declined path, and
the three scoring fixtures.

```bash
npm install
npm run dev
npm run build
npm run fixtures   # 17 assertions across three hand-checked respondents
npm run typecheck
```

Configuration is the same `.env.example`: WhatsApp, booking and Supabase capture each stay
hidden until their variable is set.

## Known limitations

- **The Bahasa Malaysia copy has not had a native-speaker review.** Coverage is complete; it
  needs a local reader.
- **The three statistics are unverified.** See above. This is the one thing to do before the
  link goes anywhere with money behind it.
- **Nothing is captured yet** until the Supabase variables are set. Responses live in
  `localStorage` and are never transmitted.
