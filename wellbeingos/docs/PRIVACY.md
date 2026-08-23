# Privacy model

The design constraint: a management dashboard must never become an employee
surveillance mechanism. That is enforced structurally, not by policy alone.

## Three zones

| Zone | Contents | Who |
|---|---|---|
| **Zone 1 — Administrative** | Entitlement, transactions, clinic visits, MC dates, approvals, exceptions | Authorised HR, Finance, administrators — per capability |
| **Zone 2 — Personal vault** | Pulse check-ins, private notes, personal goals, screening detail | The employee. Nobody else — there is no capability to grant |
| **Zone 3 — Organisational** | Aggregated trends, participation, anonymous signals, forecasts | Authorised leadership and the wellbeing team, suppressed below the floor |

Every page states its zone in the header (`PrivacyIndicator`), so the boundary
is visible while the data is being read, not buried in a policy document.

## The aggregation floor

`aggregate()` in `src/core/domain/privacy.ts` wraps every Zone 3 figure:

```ts
aggregate(populationSize, config.privacy.minimumAggregationGroup, () => compute())
```

Below the floor the result is **suppressed**, not rounded — a rounded number can
still identify a person in a team of three. Suppression is visible in the UI
(`Suppressed` badge, `SuppressedNotice`) rather than silently blanked, so a
manager understands why a figure is missing.

Default floor: 5 (STIDC). Tenant `agency-b` uses 8. It is configurable per
tenant, in Administration → Privacy.

## Consent

Consent is purpose-scoped, versioned and timestamped. Withdrawal is retroactive:
turning off `aggregate-wellbeing` flips `shareAggregate` on the employee's past
check-ins, so their prior contributions leave Zone 3 immediately rather than
persisting in already-computed aggregates.

The Privacy & Consent centre shows, in plain language, what each audience can
and cannot see — driven by `TenantConfig.privacy.disclosure`, so the disclosure
and the enforcement come from the same configuration.

## What the platform deliberately does not hold

No diagnosis. No clinical notes. No test results. No date of birth (age is
stored pre-banded). Supporting records stay in secure document storage; the
ledger holds a reference.

## Zone 2 in the hosted schema

`wellbeing_check_ins`, `wellbeing_goals`, `screening_records` and `consents`
carry a `vault_owner_only` RLS policy — the row is visible only to its owner,
including to administrators. Zone 3 reads the `consented_pulse` view, which
excludes both the personal note and any employee identifier.

## Intelligence, not diagnosis

The signals engine describes groups and recommends *organisational* actions. It
does not diagnose individuals, does not recommend treatment, and does not feed
employment decisions. Every intervention records the person who decided it
(`Intervention.decidedBy`). Human oversight is a data field, not a slogan.
