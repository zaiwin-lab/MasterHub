# Replication check — Sarawak Agency B

The architecture claim is "build once, deploy many". This is the test of it,
run as a real second tenant that ships in the repository
(`src/tenants/sarawak-agency-b.ts`) rather than as an assertion.

## The brief

| Requirement | Result |
|---|---|
| RM3,000 entitlement instead of RM2,500 | `policies[0].annualAmount: 3000` |
| Different branding | `theme` — blue/teal palette, `productName: 'StaffWell360'`, `logoMark: 'SW'` |
| Four departments instead of six divisions | `organisation.divisions` — four entries |
| Different clinics | `seed.clinics: 6`, generated for the new locations |
| Alerts at 60 / 80 / 95 / 100 | `policies[0].thresholds` — four bands, new messages |
| No wellbeing pulse module | `modules['wellbeing-pulse']: false` |
| Additional fitness challenge | `programmeCategories` includes `Fitness Challenge`; `modules['activity-challenge']: true` |
| Different management KPIs | `managementKpis` — eight entries instead of ten |

Two further changes were made because they were easy and realistic: stricter
aggregation floor (8 rather than 5), `allowExcess: false`, and different
terminology (*Officer* rather than *Staff member*, *Healthcare Benefit* rather
than *Medical Benefit*).

## Code changed to add this tenant

**None.** One configuration file, one line in the registry. No component, route,
calculation, chart, report or database column was modified.

## Verified behaviour after switching tenant

- Entitlement reads RM3,000 on the employee wallet.
- Threshold bands display as 60 / 80 / 95 / 100 with the new messages.
- Branding, product name and mark change across every page.
- Terminology changes throughout the interface.
- The wellbeing pulse disappears from navigation, from the employee vault and
  from the management dashboard — including the aggregate card, because there is
  no consented data to aggregate.
- Aggregation suppression tightens: divisions with fewer than 8 eligible people
  show `Suppressed` instead of a figure.
- The demonstration dataset regenerates at the new headcount with clinics in the
  new locations, and exceptions are re-derived from the new thresholds.

## Where the remaining ~10–20% would go

For a real second client, the work not covered by configuration is:

1. **Integration adapters** (LAYER D) — their HRIS, clinic network, finance
   system and SSO. Interfaces exist; implementations are per client.
2. **Report templates** beyond the eight shipped, if the client's governance
   requires a specific statutory format.
3. **Data migration** from whatever they use today.

None of that requires changing the core.
