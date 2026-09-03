import { extraCampaign, listCampaign, type Campaign } from './campaigns'
import { getPackage, type PackageId } from './packages'
import { VENUE } from './venue'

export const REFERRAL_RATE = 0.05
export const REFERRAL_CAP = 1500

export type QuoteInput = {
  pkg: PackageId
  pax: number
  /** A valid foreign referral code, already validated. */
  referralApplied?: boolean
  /** Duta credit the user chose to spend. */
  credit?: number
  now?: Date
  campaigns?: Campaign[]
  /** Duta tier — tier 3+ includes LED regardless of pax. */
  dutaTier?: number
}

export type Quote = {
  pax: number
  unit: number
  usualUnit: number
  usualTotal: number
  semasaTotal: number
  campaign: Campaign | null
  campaignOff: number
  afterCampaign: number
  refDisc: number
  refCapped: boolean
  credit: number
  total: number
  perPax: number
  tablesEst: number
  ledIncluded: boolean
  savedVsUsual: number
  listLabelBm: string
  listLabelEn: string
}

export function clampPax(pax: number): number {
  const n = Math.round(Number.isFinite(pax) ? pax : VENUE.minPax)
  return Math.min(VENUE.maxPax, Math.max(VENUE.minPax, n))
}

export function computeQuote(input: QuoteInput): Quote {
  const pax = clampPax(input.pax)
  const p = getPackage(input.pkg)
  const unit = p.current
  const usualUnit = p.usual

  const usualTotal = usualUnit * pax
  const semasaTotal = unit * pax

  const campaign = extraCampaign(input.pkg, input.now ?? new Date(), input.campaigns)
  let campaignOff = 0
  if (campaign) {
    if (campaign.kind === 'percent-off' && campaign.percent) {
      campaignOff = (campaign.percent / 100) * semasaTotal
    } else if (campaign.kind === 'amount-off' && campaign.amount) {
      campaignOff = campaign.amount
    }
  }
  campaignOff = Math.min(campaignOff, semasaTotal)
  const afterCampaign = semasaTotal - campaignOff

  const refRaw = input.referralApplied ? REFERRAL_RATE * afterCampaign : 0
  const refDisc = Math.min(refRaw, REFERRAL_CAP)
  const refCapped = refRaw > REFERRAL_CAP

  const credit = Math.max(0, Math.min(input.credit ?? 0, afterCampaign - refDisc))
  const total = afterCampaign - refDisc - credit

  const list = listCampaign(input.campaigns)

  return {
    pax,
    unit,
    usualUnit,
    usualTotal,
    semasaTotal,
    campaign,
    campaignOff,
    afterCampaign,
    refDisc,
    refCapped,
    credit,
    total,
    perPax: total / pax,
    tablesEst: Math.ceil(pax / 10),
    ledIncluded: pax >= VENUE.ledFromPax || (input.dutaTier ?? 0) >= 3,
    savedVsUsual: usualTotal - total,
    listLabelBm: list.labelBm,
    listLabelEn: list.labelEn,
  }
}
