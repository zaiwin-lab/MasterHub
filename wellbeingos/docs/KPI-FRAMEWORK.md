# Transformation KPI framework

Six dimensions. Each metric names where it is computed, so a claim on a slide
can be traced to a line of code.

## Operational
| Metric | Source |
|---|---|
| Decision turnaround (days) | `orgOverview().avgTurnaroundDays` — submission to approve/reject |
| Transactions this period | `orgOverview().transactionCount` |
| Open exceptions | `orgOverview().openExceptions` |
| Exceptions resolved | `exception_cases.status = 'resolved'` |

## Financial governance
| Metric | Source |
|---|---|
| YTD utilisation | `orgOverview().ytdUtilisationPct` |
| Committed (pending decision) | `computeWallet().committed`, summed |
| Projected year-end | `projectPeriodEnd()` — straight-line run rate |
| Recovery exposure | `computeWallet().excess`, summed |
| Unspent entitlement | entitlement − approved |

## Employee experience
| Metric | Source |
|---|---|
| Staff with self-service visibility | eligible headcount with a derived wallet |
| Above-threshold population | `orgOverview().aboveThreshold` |
| Programme participation | distinct participants ÷ eligible |

## Wellbeing
| Metric | Source |
|---|---|
| Screening participation | distinct attendees ÷ eligible |
| Wellbeing signal index | `wellbeingIndexOf()` — consented responses, suppressed below the floor |
| Average MC days | `orgOverview().avgMcDays` |

## Governance
| Metric | Source |
|---|---|
| Consent coverage | recorded consent decisions ÷ (people × purposes) |
| Audit completeness | `audit_events` count and coverage by zone |
| Zone 2 access by non-owners | structurally zero — no capability exists to grant |

## Leadership
| Metric | Source |
|---|---|
| Interventions from aggregated insight | `interventions` count |
| Interventions with a named decision-maker | `interventions.decided_by` populated |
| Movement against baseline | `intervention.baseline → intervention.latest` |

## The projection, stated plainly

Year-end projection is a straight-line run rate: `(approved ÷ months elapsed) × 12`.
It is deliberately simple so Finance can defend it in a meeting. It does not
model seasonality — and the platform says so on the chart rather than implying
a sophistication it does not have.
