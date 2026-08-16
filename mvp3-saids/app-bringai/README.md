# Bring AI To My Biz — AI Readiness Scan

Live: **https://bringaitomybiz.netlify.app**

The second front door to the same instrument. Same 22 questions, same scoring engine, same
leak math as `../app` — a completely different way in.

## What is different, and why

| | `app` (yourbestmvp) | `app-bringai` (this one) |
|---|---|---|
| **Opens with** | The method — "every business has an untapped MVP" | The threat — "AI is rewriting who wins in your market. Right now." |
| **MVP³ named** | On the landing page, immediately | **Only on the Snapshot**, after there is a result to attach it to |
| **Palette** | Light survey, dark report. Navy, cyan, gold. | Deep navy alternating with warm cream. Gold is the single accent. |
| **Type** | Serif display, calm, institutional | Humanist sans, 700 weight, relaxed tracking, 17px/1.65 body |
| **Tone** | Diagnostic and considered | Confident and warm — built to be read on a phone in daylight |
| **Languages** | EN · BM | **EN · BM · 中 · IB** |

The reason for the split: telling someone what MVP³ is before they have a result is
explaining a method to a person with nothing to attach it to. This build sells the *problem*
first — the shift, the speed, the leak — and reveals the method on the Snapshot as the
explanation of what just happened to them. "You have just been through MVP³."

**The instrument version is unchanged (`2026.1`).** Both front doors write comparable
responses, so the cohort stays poolable for the benchmark work later. Do not fork the
question set — fork the framing only.

## Design system

Deep navy (`#0B1B29`) and warm cream (`#FAF6EC`) alternate section by section. Gold
(`#E3B341`) is the only accent and carries pill badges, icon tiles, primary buttons and every
money figure; green appears only on the lens meters. Cards are soft-cornered with quiet
borders. Type is humanist sans at 700 with relaxed tracking — deliberately more readable than
the tight 800-weight it replaced.

**House trademarks**, both live on every screen: the four-language toggle (EN · BM · 中 · IB)
in the header, and the two floating bubbles — Digital Staff bottom-left, WhatsApp
bottom-right. The assistant is scripted, not a live model, and says so on its own panel.

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

- **None of the three translations has had a native-speaker review.** BM, 中 and IB are all
  complete across the chrome, the instrument and the report headings, but every one needs a
  local reader before this goes out widely. Iban especially — treat it as a first draft.
- **Some report internals still fall back to English** in 中 and IB: the arithmetic workings,
  the `limitations[]` lines and the MVP³ candidate description paragraphs. The fallback is
  deliberate (`t()` returns English when a cell is missing) so nothing renders blank, but
  those strings are the next translation batch.
- **The three statistics are unverified.** See above. This is the one thing to do before the
  link goes anywhere with money behind it.
- **Nothing is captured yet** until the Supabase variables are set. Responses live in
  `localStorage` and are never transmitted.
