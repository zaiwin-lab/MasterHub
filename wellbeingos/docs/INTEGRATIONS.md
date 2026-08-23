# Integration points

Integration logic stays out of the core. Each external system is reached through
an interface in `src/integrations/index.ts`; the MVP ships mocks so the platform
runs end to end, and a deployment swaps in a real adapter through
`resolveAdapters()`.

| Adapter | Connects | Used by | MVP status |
|---|---|---|---|
| `HrisAdapter` | HR system of record | Employee sync, structure, eligibility confirmation | Mock — seeded workforce |
| `ClinicAdapter` | Panel clinic systems | Electronic visit submission, status write-back | Mock — the clinic portal covers the manual path |
| `FinanceAdapter` | Finance / payment | Settlement posting for approved utilisation | Mock — status moves to `paid` in-platform |
| `NotificationAdapter` | Email, SMS, WhatsApp | Threshold alerts, exception notices, programme invitations | In-app feed only |
| `IdentityAdapter` | SSO / employee directory | Authentication | Persona picker |
| `DocumentAdapter` | Secure document storage | Supporting record upload and retrieval | Reference field only |
| `WearableAdapter` | Wearables, screening providers | Zone 2 activity data, consented aggregation only | Not wired |

## Design rules

1. **The core never imports an adapter implementation.** It depends on the
   interface; the registry resolves the implementation from environment
   configuration.
2. **Adapters do not decide policy.** An HRIS says who exists and who is
   employed; `BenefitPolicy` decides who is eligible.
3. **Zone 2 data entering through an adapter stays in Zone 2.** Wearable and
   screening data is employee-owned on arrival, and reaches Zone 3 only through
   the same consent and aggregation floor as anything else.
4. **Write-backs are explicit.** `publishStatus` and `postSettlement` are the
   only paths out of the platform, so what leaves is auditable.

## Sequencing for a real deployment

1. `IdentityAdapter` — SSO first; everything else depends on knowing who is asking.
2. `HrisAdapter` — the workforce becomes real; eligibility stops being seeded.
3. `NotificationAdapter` — thresholds start reaching people where they are.
4. `DocumentAdapter` — supporting records.
5. `FinanceAdapter` — settlement.
6. `ClinicAdapter` — per clinic, as each network's system allows.

## AI, if and when

Suitable: summarising organisational trends, explaining what changed on a
dashboard, drafting the annual report, proposing candidate programmes, anomaly
detection in the exception queue, forecasting.

Excluded by design: diagnosing an individual, exposing personal information,
making or influencing employment or disciplinary decisions, and recommending
treatment. Any AI-produced recommendation is a draft for a named human to
accept — which is why `Intervention.decidedBy` exists as a required part of the
record rather than a note field.
