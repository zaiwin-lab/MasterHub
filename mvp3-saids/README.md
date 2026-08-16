# MVP³ / SAIDS — Portal + Killer Survey

Strategy and build specification for the SAIDS revenue portal and the **MVP³ Potential
Scan** — the free diagnostic that converts a stranger into a prospect with a quantified,
ringgit-denominated problem.

| File | What it is | Read it when |
|---|---|---|
| **`app-bringai/`** | **Live — https://bringaitomybiz.netlify.app** — urgency-first front door. Opens on the AI shift; MVP³ is revealed only on the Snapshot. | Driving cold traffic |
| **`app/`** | **Live — https://yourbestmvp.netlify.app** — method-first front door. Opens on MVP³ itself. | Warm network, referrals |
| **`SCAN_BUILD_PROMPT.md`** | Survey-first build prompt — the Scan, the Snapshot, and nothing else. Both apps implement it. | Rebuilding or extending |
| `SURVEY_INSTRUMENT.md` | **Normative.** The 22 questions, nine scoring dimensions and weights, six leak formulas, constants, MVP³ candidate lookup, Snapshot structure | Building or changing the Scan |
| `GTM_STRATEGY.md` | The go-to-market framework — category, positioning, ICP, offer ladder, urgency architecture, channels, funnel model, 90-day plan, metrics, risks | Deciding *what to sell and to whom* |
| `PORTAL_BUILD_PROMPT.md` | **Phase 2.** The full marketing portal. Deferred until the Scan has produced ~100 real responses. | After the Scan is live and measured |

## Two front doors, one instrument

Both apps run the **same 22 questions, the same scoring engine and the same instrument
version (`2026.1`)**, so responses from either pool into one comparable cohort. Only the
framing differs:

- **bringaitomybiz** leads with the threat — the AI shift, the faster competitor, the buyer
  who decides before ever speaking to you. MVP³ is never named until the Snapshot, where it
  arrives as the explanation of what just happened. Built for cold traffic and paid reach.
- **yourbestmvp** leads with the method. Built for people who already know you.

Run both, compare completion and Snapshot-to-contact rates, and put the budget behind
whichever earns it. That comparison is the cheapest market research available.

**Do not fork the question set.** Fork the framing only — the moment the instruments diverge,
the cohort stops being poolable and the benchmark work in `GTM_STRATEGY.md` §4.1 becomes
unbuildable.

## Before promoting either link

Verify the three statistics in `app-bringai/src/data/proof.ts`. Each carries
`checked: false` until someone has opened the primary source and confirmed the figure and
its framing.

## The one-sentence version

Give away a diagnostic so sharp that the prospect arrives at the sales call already knowing
what they are losing, already believing the number, and already asking how fast we can stop it.

## The funnel

```
Portal → MVP³ Potential Scan (free, 8 min) → Potential Snapshot (leak in RM/month)
      → Potential Readout (RM 1,500) → Clarity Sprint (RM 4,800) → Launch Sprint (RM 18k+)
      → Momentum retainer (RM 3,500/mo+)
```

## Before anything ships

1. **Verify every statistic.** `GTM_STRATEGY.md` §5.2 lists candidates with confidence
   ratings — they are leads to verify, not approved copy. No source line and working link,
   no statistic.
2. **Run the Scan on three businesses you already know.** If the Snapshot's findings don't
   match what you know to be true, the scoring is wrong. Fix it before launch.
3. **Keep the peer-comparison flag off** until there are ≥ 50 real completed scans.

## Lineage

The architecture is carried over from the live `zaiwin-lab/MVP-FAME-Survey` build —
deterministic scoring, one question per screen, autosave and resume, the Magic Box, the
four-language dictionary system, and the honesty rules the build enforces in code rather
than claims in copy. Lift those modules; don't rebuild them.

---

*KAPT — KOBIS AI Prodigy Team · [KOBIS Berhad](https://www.kobisberhad.com)
Business-first. Human-directed. AI-accelerated. Impact-focused.*
