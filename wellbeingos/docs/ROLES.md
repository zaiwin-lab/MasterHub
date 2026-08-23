# Roles and permissions

Seven roles, one matrix, enforced in the data layer. `src/core/access/permissions.ts`
is the single source of truth; the Administration → Roles & permissions screen
renders that same matrix rather than a copy of it.

| Role | Sees | Never sees |
|---|---|---|
| **Employee** | Own wallet, own ledger, own vault, own consent, clinic directory, programmes | Anyone else's anything |
| **HR** | Eligibility, entitlement, claim status, MC dates, exceptions, programmes, utilisation analytics | The wellbeing vault; pulse answers; screening results |
| **Finance** | Utilisation, values, committed, exposure, recovery, forecasting, exceptions | Any wellbeing data; diagnosis; personal detail |
| **Panel clinic** | For the person in front of them: name, staff number, eligibility, remaining balance. Own submissions | Other clinics' visits; wellbeing; grade; salary |
| **Wellbeing team** | Programmes, participation, aggregated signals, interventions | Individual pulse answers; medical claims; who reported what |
| **Management** | Organisation-wide trends, forecasts, participation, anonymous signals | Any individual medical record; any named wellbeing data; groups below the floor |
| **Administrator** | Configuration, users, permissions, clinics, audit | Clinical detail; the wellbeing vault |

## How enforcement works

Two independent locks:

1. **Data boundary.** `listTransactions`, `listExceptions`, `myCheckIns`,
   `verifyEligibility` and the rest take a `Session` and scope or refuse.
   A role without the capability gets an empty result — not a hidden button.
2. **Route guard.** `RequireCapability` renders an explicit "not available for
   your role" state for a direct URL.

Navigation is derived from the same matrix plus the tenant's module flags
(`src/core/config/navigation.ts`), so a disabled module disappears from every
role's navigation automatically.

## Capabilities

Grouped by zone:

- **Zone 1** — `benefit.read.own|any`, `transaction.read.own|any`,
  `transaction.create|verify|approve|pay`, `employee.read.directory|record`,
  `exception.read|manage`, `clinic.read|manage|verifyEligibility`
- **Zone 2** — `wellbeing.own`, `consent.own` *(no role holds a capability to
  read another person's vault; there is no such capability to grant)*
- **Zone 3** — `analytics.utilisation|financial|wellbeing|management`,
  `signal.read`, `intervention.manage`, `programme.read|register|manage`
- **Governance** — `report.read`, `audit.read`, `tenant.configure`, `user.manage`

## Changing the matrix

Edit `matrix` in `src/core/access/permissions.ts`. Navigation, route guards,
data scoping, the admin screen and the SQL policy helper all follow from it.
