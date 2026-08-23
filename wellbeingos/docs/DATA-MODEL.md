# Data model

Every organisational record carries `tenantId`. The repository refuses a read
whose tenant does not match the session, and the hosted schema repeats the rule
as a row level security policy.

## Entities

| Entity | Zone | Purpose |
|---|---|---|
| `Tenant` / `TenantConfig` | — | Everything that varies between organisations |
| `OrganisationUnit` | 1 | Divisions and departments |
| `Employee` | 1 | Workforce record, eligibility, age **band** (no date of birth) |
| `BenefitPolicy` | 1 | Entitlement, period, categories, thresholds, approval rules |
| `EmployeeBenefit` | 1 | Entitlement for one person for one period |
| `Clinic` | 1 | Panel network, coverage, agreement status |
| `MedicalTransaction` | 1 | The ledger. Immutable by convention; status moves, values do not |
| `Approval` | 1 | Who decided what, when, with remarks |
| `ExceptionCase` / `ExceptionComment` | 1 | The issue queue and its history |
| `Notification` | 1 | Role- or person-addressed messages |
| `WellbeingCheckIn` | **2** | Voluntary pulse. `note` never leaves the vault |
| `WellbeingGoal` | **2** | Personal goals and progress |
| `ScreeningRecord` | **2** | Attendance plus the employee's own summary |
| `Consent` | **2** | Purpose-scoped, versioned, timestamped |
| `WellbeingProgramme` | 3 | Programme definition and outcome indicator |
| `ProgrammeParticipation` | 3 | Registration and completion |
| `InsightSignal` | 3 | Observation, insight, recommended response, population size |
| `Intervention` | 3 | The response, its measure, and the person who decided it |
| `AuditEvent` | 1 | Actor, action, entity, zone, time |

## Relationships

```
Tenant ─┬─ OrganisationUnit ──< Employee ──< EmployeeBenefit >── BenefitPolicy
        │                            │
        │                            ├──< MedicalTransaction >── Clinic
        │                            │         └──< Approval
        │                            ├──< WellbeingCheckIn      (Zone 2)
        │                            ├──< WellbeingGoal         (Zone 2)
        │                            ├──< ScreeningRecord       (Zone 2)
        │                            ├──< Consent               (Zone 2)
        │                            └──< ProgrammeParticipation >── WellbeingProgramme
        ├─ ExceptionCase ──< ExceptionComment
        ├─ InsightSignal ──< Intervention
        └─ AuditEvent
```

## Derived, not stored

- `Wallet` — computed from the ledger by `computeWallet()`.
- `OrgOverview`, `MonthPoint`, `UnitBreakdown`, `ParticipationRow` — computed by
  `src/core/analytics/organisation.ts`, each passed through the aggregation floor.
- Exception cases in the demonstration dataset are *generated from the data* by
  the same rules the live engine applies — thresholds crossed, duplicates by
  (employee, clinic, date, amount), values above the 97th percentile, ageing
  approvals, eligibility mismatches — rather than hand-placed.

## Deliberate omissions

The platform holds no diagnosis, no clinical notes, no test results, and no date
of birth. Age is stored pre-banded. Supporting records live in secure document
storage; the ledger holds a reference only.
