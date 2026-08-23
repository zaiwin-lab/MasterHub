# Architecture

WellbeingOS is built as a product with a tenant, not as a system for one client.
STIDC SEJAHTERA360 is tenant `stidc` — the first configured deployment, not the
shape of the platform.

## Layers

```
LAYER A — Universal core          src/core/**
  domain/      entities, wallet arithmetic, alert engine, privacy primitives
  access/      capability matrix and session guard
  workflow/    transaction state machine, eligibility gate
  data/        repository (permission-enforcing reads), seed, store
  analytics/   Zone 3 aggregates with suppression
  config/      TenantConfig schema, navigation model

LAYER B — Tenant configuration    src/tenants/**
  stidc.ts               tenant #01
  sarawak-agency-b.ts    replication proof (docs/REPLICATION-CHECK.md)
  registry.ts            resolution and the default tenant

LAYER C — Optional modules        TenantConfig.modules (feature flags)

LAYER D — Integration adapters    src/integrations/**
  interfaces only in the core path; mocks ship with the MVP
```

Nothing in `src/core` imports from `src/tenants`. Configuration flows in as
data. That constraint is what keeps 80–90% of the platform reusable.

## Request path

```
UI component
   │  useStore()                     ← session + tenant config + dataset
   ▼
repository.ts                        ← capability check + tenant check + scoping
   ▼
domain (benefit.ts / privacy.ts)     ← one definition of every calculation
   ▼
analytics/organisation.ts            ← Zone 3 only, suppression applied
```

Reads are scoped at the data boundary, not in the view. An employee session
calling `listTransactions` receives only their own rows even if a route is
reached directly; a clinic session receives only what that clinic submitted.
Route guards (`RequireCapability`) are the second lock, not the only one.

## Where the data lives in the MVP

The demonstration build persists a deterministically seeded dataset in the
browser (`localStorage`, key prefix `wellbeingos:v1`), so the full journey —
submit, verify, approve, wallet update, exception, audit — is genuinely
exercisable without hosted infrastructure. This is a deliberate MVP boundary,
stated plainly rather than disguised:

- **What is real:** the domain model, the wallet arithmetic, the workflow state
  machine, the capability matrix, the aggregation floor, the audit trail, and
  every calculation behind every dashboard.
- **What is mocked:** persistence and authentication.

`supabase/schema.sql` is the target schema for a hosted deployment: the same
entities, tenant-scoped, with row level security enforcing the same three zones
in the database. Moving to it means replacing the bodies of the functions in
`src/core/data/repository.ts` and the mutation actions in
`src/core/data/store.tsx`. Call sites do not change.

## Balances are derived, never stored

`computeWallet()` in `src/core/domain/benefit.ts` is the single definition of a
balance:

```
available = entitlement − approved utilisation
spendable = entitlement − approved − committed (pending decisions)
```

The employee dashboard, the clinic eligibility check, the finance exposure
figure and the management forecast all call it. There is no editable "remaining
balance" column anywhere in the system, and the same view exists in SQL
(`employee_wallets`) for the hosted target.

## Key files

| Concern | File |
|---|---|
| Entities | `src/core/domain/types.ts` |
| Wallet & thresholds | `src/core/domain/benefit.ts` |
| Aggregation floor | `src/core/domain/privacy.ts` |
| Capabilities | `src/core/access/permissions.ts` |
| Workflow | `src/core/workflow/engine.ts` |
| Scoped reads | `src/core/data/repository.ts` |
| Mutations + audit | `src/core/data/store.tsx` |
| Organisational analytics | `src/core/analytics/organisation.ts` |
| Tenant schema | `src/core/config/tenant.ts` |
| Navigation model | `src/core/config/navigation.ts` |
