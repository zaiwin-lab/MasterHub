import type { PackageId } from './packages'

export type Campaign = {
  id: string
  active: boolean
  kind: 'current-list' | 'percent-off' | 'amount-off'
  labelBm: string
  labelEn: string
  percent?: number // e.g. 5 means 5% off the current package total
  amount?: number // flat RM off
  startsAt?: string // ISO date, Asia/Kuching (+08)
  endsAt?: string
  appliesTo?: 'all' | PackageId[]
}

/**
 * All pricing flows through this list so staff can post a later discount
 * without redesigning the site.
 *
 * `current-list` names the selling price (RM 45 / 58 / 73). It takes no
 * further money off. Exactly one extra campaign (percent-off / amount-off)
 * may stack on top of harga semasa — never two.
 */
export const CAMPAIGNS: Campaign[] = [
  {
    id: 'pakej-semasa',
    active: true,
    kind: 'current-list',
    labelBm: 'Harga pakej semasa',
    labelEn: 'Current package price',
  },
  // Future promotion slot. Flip `active: true` and the quote grows one
  // labelled line. Nothing else in the UI needs to change.
  {
    id: 'contoh-promosi-akan-datang',
    active: false,
    kind: 'percent-off',
    percent: 5,
    labelBm: 'Promosi seterusnya',
    labelEn: 'Next promotion',
    startsAt: '2027-01-01',
    endsAt: '2027-01-31',
    appliesTo: 'all',
  },
]

function withinDates(c: Campaign, now: Date): boolean {
  if (c.startsAt && now < new Date(`${c.startsAt}T00:00:00+08:00`)) return false
  if (c.endsAt && now > new Date(`${c.endsAt}T23:59:59+08:00`)) return false
  return true
}

function coversPackage(c: Campaign, pkg: PackageId): boolean {
  if (!c.appliesTo || c.appliesTo === 'all') return true
  return c.appliesTo.includes(pkg)
}

/** The list campaign that names the selling price. Always present. */
export function listCampaign(campaigns: Campaign[] = CAMPAIGNS): Campaign {
  return (
    campaigns.find((c) => c.active && c.kind === 'current-list') ?? {
      id: 'pakej-semasa',
      active: true,
      kind: 'current-list',
      labelBm: 'Harga pakej semasa',
      labelEn: 'Current package price',
    }
  )
}

/**
 * The single extra campaign stacking on top of harga semasa, if any.
 * Returns null when no future promotion is live — the normal state today.
 */
export function extraCampaign(
  pkg: PackageId,
  now: Date = new Date(),
  campaigns: Campaign[] = CAMPAIGNS,
): Campaign | null {
  const eligible = campaigns.filter(
    (c) =>
      c.active &&
      (c.kind === 'percent-off' || c.kind === 'amount-off') &&
      withinDates(c, now) &&
      coversPackage(c, pkg),
  )
  return eligible[0] ?? null
}
