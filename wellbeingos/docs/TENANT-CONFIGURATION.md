# Onboarding another organisation

The target: a new client is configuration, not a rebuild. In practice that means
writing one `TenantConfig` object and registering it.

## Steps

1. **Create the config.** Copy `src/tenants/stidc.ts` to
   `src/tenants/<client>.ts` and edit it. Every field is documented by its type
   in `src/core/config/tenant.ts`.
2. **Register it.** Add it to `tenants` in `src/tenants/registry.ts`.
3. **Point the deployment at it.** Set `NEXT_PUBLIC_DEFAULT_TENANT=<id>`.
4. **Run it.** The seed generator builds a coherent demonstration dataset from
   the config — structure, people, clinics, twelve months of transactions,
   exceptions, programmes and signals — without touching seed code.

That is the whole process. A worked example is
[`REPLICATION-CHECK.md`](./REPLICATION-CHECK.md).

## What the config controls

| Area | Field | Effect |
|---|---|---|
| Identity | `organisationName`, `organisationCode`, `shortName`, `productName`, `tagline`, `logoMark`, `welcomeText` | Sign-in, navigation, reports, exports |
| Branding | `theme` | Design tokens at runtime — see [THEMING.md](./THEMING.md) |
| Language | `terminology` | Every user-visible noun that differs between clients |
| Modules | `modules` | Feature flags — see [FEATURE-FLAGS.md](./FEATURE-FLAGS.md) |
| Benefit | `policies`, `defaultPolicyId` | Entitlement, period, categories, thresholds, approval — see [POLICY.md](./POLICY.md) |
| Structure | `organisation` | Divisions, departments, locations, categories, grades |
| Journey | `journey` | The employee journey stages and their destinations |
| Programmes | `programmeCategories` | The programme taxonomy |
| Services | `serviceCategories` | Claimable service categories |
| Privacy | `privacy` | Aggregation floor, consent purposes, retention, disclosure table |
| Analytics | `managementKpis` | Which KPIs the command centre shows |
| Reporting | `reports` | Templates, their audiences and their zone |
| Demo data | `seed` | Headcount, clinics, months, deterministic seed |

## Runtime configuration

Administrators change most of this without a deployment, in
**Administration → Configuration centre**: organisation identity, branding
colours, terminology, entitlement, thresholds, approval rules, modules, the
aggregation floor and retention. Changes are stored as overrides against the
tenant's base config, and a policy change re-derives every wallet in the
organisation immediately.

Structure (`organisation`) is presented read-only in the UI: in production it is
synchronised from the HRIS adapter, and editing it in two places would diverge
from the source of record.

## What is *not* configuration

Deliberately: the three privacy zones, the derivation of balances from the
ledger, the capability matrix's shape, the requirement that an intervention
records a human decision-maker, and the fact that the aggregation floor exists.
A client can set the floor to 8; a client cannot remove it.
