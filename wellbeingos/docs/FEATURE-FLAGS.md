# Modules and feature flags

`TenantConfig.modules` is a flat map of `ModuleKey → boolean`. A disabled module
disappears from navigation, its routes, and the dashboards that draw on it.

| Module | What it turns on |
|---|---|
| `medical-benefit` | Entitlement, wallet, ledger, approval workflow. **Cannot be disabled** — it is the core |
| `panel-clinic` | Clinic directory, clinic portal, eligibility verification |
| `employee-wellbeing` | Personal vault, goals, the employee journey |
| `health-screening` | Screening programmes and personal screening records |
| `activity-challenge` | Movement / team challenge programme type |
| `mental-wellbeing` | Resilience and support programme type |
| `ergonomics` | Ergonomics programme type and its signal |
| `preventive-campaigns` | Awareness campaign programme type |
| `absenteeism-insights` | MC and absence patterns in analytics |
| `wellness-rewards` | Recognition for participation |
| `esg-reporting` | The ESG value dashboard and evidence register |
| `annual-wellbeing-report` | The annual report template |
| `wellbeing-pulse` | The five-question voluntary pulse and its aggregate signal |
| `intelligence-signals` | Signal detection, insights, intervention register |

## How gating works

`src/core/config/navigation.ts` declares each route's owning module and the
capabilities that reach it. The shell filters on both:

```ts
navigation.filter((item) =>
  (!item.module || config.modules[item.module]) &&
  (item.capabilities.length === 0 || canAny(session, item.capabilities)))
```

Data follows the same flag: with `wellbeing-pulse` off, the seed generates no
check-ins and `pulseTrend` has nothing to aggregate, so the organisational pulse
card disappears rather than rendering an empty chart.

Toggle modules at runtime in **Administration → Modules**.
