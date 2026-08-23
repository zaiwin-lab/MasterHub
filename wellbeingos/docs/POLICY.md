# Benefit policy configuration

A policy is data (`BenefitPolicy` in `src/core/domain/types.ts`). Changing it
changes behaviour across the wallet, the clinic gate, the alert engine, the
exception queue and every dashboard.

## Fields

```ts
{
  annualAmount: 2500,                 // entitlement per period
  period: 'calendar-year',            // or 'financial-year' (April start)
  serviceCategories: [...],           // what may be claimed
  eligibility: { categories, minMonthsService },
  thresholds: [...],                  // see below
  approval: {
    autoApproveUnder: 300,            // verified automatically at submission
    approverRoles: ['hr', 'finance'], // escalation order
    allowExcess: true,                // may a clinic submit above the balance?
  },
  carryForward: false,
}
```

## Thresholds

Each band declares the percentage, a level, a label, the employee message and
whether crossing it raises an exception for HR and Finance.

```ts
{ at: 90, level: 'important', label: 'Important',
  employeeMessage: '{available} of your {benefit} remains. If you expect further treatment this period, speak to HR early so options can be arranged calmly.',
  raisesException: true, notify: ['employee', 'hr'] }
```

Message tokens: `{name}` `{used}` `{available}` `{pct}` `{benefit}`.

Messages are written to be supportive rather than punitive — the employee is
told where they stand and what happens next, never what they have done wrong.
That is a product decision, and it is configurable per client.

STIDC uses 50 / 75 / 90 / 100. Agency B uses 60 / 80 / 95 / 100. Neither
required a code change.

## The approval gate

`autoApprovable(amount, policy)` decides whether a submission is verified
immediately. `availableTransitions(txn, ctx)` derives the buttons a given role
sees on a given transaction — so the workflow is policy-driven, not hard-coded
per client.

## The eligibility gate

`eligibilityDecision()` runs before a clinic may record a visit:

- not eligible, or exited → **refused**
- within available balance → **allowed**
- above balance and `allowExcess: true` → **allowed, routed to the policy
  exception workflow** (raises a `policy-exception` case automatically)
- above balance and `allowExcess: false` → **refused, referred to HR**

## Editing at runtime

Administration → Benefit policy. Changing `annualAmount` re-derives every
`EmployeeBenefit` in the tenant immediately; the employee's utilisation
percentage and threshold band recalculate on their next page load.
