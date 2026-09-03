# WMS Desk

Booking desk for **Dewan Wisma Melayu Sarawak** — Yayasan Budaya Melayu Sarawak
(YBMS), Petra Jaya, Kuching.

The first screen **is** the booking desk. A couple lands on the page with a
date, a guest count, a package and a live total already in front of them, picks
an open Saturday, and holds it for 48 hours. Venue story, packages and the
Benang Emas referral product sit around that, not in front of it.

```bash
npm install
npm run dev        # http://0.0.0.0:8080
npm test           # quote math, campaign engine, referral rules, QR round-trip
npm run build      # production build to dist/
```

## Prices

| Package | Harga biasa | Harga pakej semasa |
|---|---|---|
| Pakej Darul Hana | RM 57 | **RM 45** |
| Pakej Seri Santubong | RM 70 | **RM 58** (default) |
| Pakej Seri Keringkam | RM 85 | **RM 73** |

The *harga pakej semasa* is the selling price. It is not framed as a discount
anywhere in the UI, the WhatsApp brief, or the meta copy — no percentage, no
"early bird", no countdown to a deadline.

## Posting a future promotion

All pricing runs through one module: `src/lib/campaigns.ts`. Today exactly one
campaign is active, and it only *names* the selling price:

```ts
{ id: 'pakej-semasa', active: true, kind: 'current-list', ... }
```

A later discount is a one-line flip on the example already sitting in that file:

```ts
{ id: 'contoh-promosi-akan-datang', active: false, kind: 'percent-off', percent: 5, ... }
```

Set `active: true` and, inside its date window, the quote grows exactly one
labelled line (`Promosi seterusnya − RM X`) under harga semasa. Nothing else in
the UI changes. Only one extra campaign ever stacks on top of harga semasa; two
percentage campaigns never combine. `src/test/quote.test.ts` pins this,
including that the flipped campaign introduces no percentage language.

## Quote formula

```
pax           = clamp(round(pax), 500, 2000)
semasaTotal   = currentPrice * pax
afterCampaign = semasaTotal - extraCampaignOff      // 0 when no promo is live
refDisc       = min(0.05 * afterCampaign, 1500)     // valid foreign code only
total         = afterCampaign - refDisc - dutaCredit
ledIncluded   = pax >= 700 or duta tier >= 3
```

Sanity cases, all covered by tests:

| Case | Total |
|---|---|
| 500 pax Darul Hana | RM 22,500 |
| …plus `WMS-AINA` | RM 21,375 |
| 800 pax Keringkam | RM 58,400 |
| 2,000 pax Keringkam + referral (capped) | RM 144,500 |

## Benang Emas

A referred couple takes 5% off the amount after any extra campaign, capped at
RM 1,500. One code per booking; a duta's own code and a phone matching the code
owner are both rejected. Credit unlocks for the duta only when a referred hold
is **confirmed**: 1 → RM 250, 3 → RM 750 + LED under 700 guests, 5 → RM 1,500 +
2 VIP parking bays. Planner codes (`YBMS-PL-…`) run the same pipeline but never
auto-apply cash — they carry a staff-handled commission note instead.

`/benang?kod=WMS-AINA` loads that identity; `/b/WMS-AINA` is the gift page
shared over WhatsApp. **Simulasi: kakitangan sahkan** stands in for staff
confirming a hold, so the tapestry, ledger and tier bar can be seen moving.

## Routes

| Route | Job |
|---|---|
| `/` | The desk: date, guests, package, live total, name/phone, hold |
| `/tempah` | Full board — sheet plus stage (undangan, hall layout, quote) |
| `/pakej`, `/pakej/:slug` | Packages and menu boards |
| `/dewan` | Hall, facilities, map |
| `/kalendar` | Two-month grid, Saturdays warmer |
| `/tempahan/:ref` | Hold sheet: countdown, WhatsApp briefs, Benang CTA |
| `/benang`, `/b/:kod` | Referral product and gift page |
| `/hubungi` | Coordinators, office, visit request |

Deep links: `?pakej=`, `?pax=`, `?tarikh=`, `?benang=` (aliases `?rujukan=`,
`?ref=`), and `?cfg=` for the compact family-review draft.

## Data and privacy

No payment gateway — deposits are arranged by staff on WhatsApp. Holds persist
only `ref_code`, `event_date`, `package_id`, `pax`, `status`, `referral_code`
and `created_at`. Couple names, phone and notes stay in the client draft and in
the WhatsApp message the couple sends themselves.

Occupancy, three live 48-hour holds, and the referral tapestry are seeded on
first paint, so the calendar and the ledger are alive without a backend.

## Venue photography

Drop real images into `public/images/` as `hero-exterior.jpg`,
`hall-banquet.jpg` or `hero-dusk.jpg` and they are picked up automatically. With
none present the page falls back to a line drawing of the tengkolok roofline —
never stock photography. The probe logs a 404 per missing candidate in the
console; that is the fallback working, not an error.
