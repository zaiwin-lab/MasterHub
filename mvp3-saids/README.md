# MVP³ / SAIDS — Portal + Killer Survey

Strategy and build specification for the SAIDS revenue portal and the **MVP³ Potential
Scan** — the free diagnostic that converts a stranger into a prospect with a quantified,
ringgit-denominated problem.

| File | What it is | Read it when |
|---|---|---|
| **`SCAN_BUILD_PROMPT.md`** | **Build this first.** Survey-first build prompt — the Scan, the Snapshot, and nothing else. 7-day ship window. | Starting the build |
| `SURVEY_INSTRUMENT.md` | **Normative.** The 22 questions, nine scoring dimensions and weights, six leak formulas, constants, MVP³ candidate lookup, Snapshot structure | Building or changing the Scan |
| `GTM_STRATEGY.md` | The go-to-market framework — category, positioning, ICP, offer ladder, urgency architecture, channels, funnel model, 90-day plan, metrics, risks | Deciding *what to sell and to whom* |
| `PORTAL_BUILD_PROMPT.md` | **Phase 2.** The full marketing portal. Deferred until the Scan has produced ~100 real responses. | After the Scan is live and measured |

## Build order

The Scan sells on its own and needs no marketing site around it. Build the instrument,
send it to the warm network, and let 100 real responses tell you which leaks dominate and
which language moves people — then the portal writes itself from evidence instead of
guesswork. Building the portal first means writing its copy from assumptions.

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
