import { describe, expect, it } from 'vitest'
import { computeQuote, clampPax } from '../lib/quote'
import { CAMPAIGNS, extraCampaign, type Campaign } from '../lib/campaigns'
import { validateReferral } from '../lib/referral'

describe('quote sanity — extra campaign OFF', () => {
  it('500 pax Darul Hana, no referral → RM 22,500', () => {
    const q = computeQuote({ pkg: 'darul-hana', pax: 500 })
    expect(q.total).toBe(22500)
    expect(q.unit).toBe(45)
    expect(q.perPax).toBe(45)
    expect(q.campaign).toBeNull()
  })

  it('same + WMS-AINA → RM 21,375', () => {
    const q = computeQuote({ pkg: 'darul-hana', pax: 500, referralApplied: true })
    expect(q.refDisc).toBe(1125)
    expect(q.total).toBe(21375)
  })

  it('800 pax Keringkam, no referral → RM 58,400', () => {
    const q = computeQuote({ pkg: 'seri-keringkam', pax: 800 })
    expect(q.total).toBe(58400)
    expect(q.ledIncluded).toBe(true)
  })

  it('2,000 pax Keringkam + referral → capped at RM 1,500 → RM 144,500', () => {
    const q = computeQuote({ pkg: 'seri-keringkam', pax: 2000, referralApplied: true })
    expect(q.semasaTotal).toBe(146000)
    expect(q.refDisc).toBe(1500)
    expect(q.refCapped).toBe(true)
    expect(q.total).toBe(144500)
  })

  it('referral is 5% of the semasa total, never of harga biasa', () => {
    // 500 pax Santubong: semasa 29,000 vs biasa 35,000. 5% of semasa = 1,450, under the cap.
    const q = computeQuote({ pkg: 'seri-santubong', pax: 500, referralApplied: true })
    expect(q.usualTotal).toBe(35000)
    expect(q.semasaTotal).toBe(29000)
    expect(q.refDisc).toBe(1450)
    expect(q.refDisc).not.toBe(0.05 * 35000)
    expect(q.total).toBe(27550)
  })

  it('caps the referral at RM 1,500 once 5% would exceed it', () => {
    const q = computeQuote({ pkg: 'seri-santubong', pax: 900, referralApplied: true })
    expect(0.05 * q.semasaTotal).toBeGreaterThan(1500)
    expect(q.refDisc).toBe(1500)
    expect(q.refCapped).toBe(true)
  })

  it('pax clamps to 500–2000', () => {
    expect(clampPax(120)).toBe(500)
    expect(clampPax(9000)).toBe(2000)
    expect(clampPax(1234.6)).toBe(1235)
  })

  it('LED included from 700 pax, or duta tier 3', () => {
    expect(computeQuote({ pkg: 'darul-hana', pax: 699 }).ledIncluded).toBe(false)
    expect(computeQuote({ pkg: 'darul-hana', pax: 700 }).ledIncluded).toBe(true)
    expect(computeQuote({ pkg: 'darul-hana', pax: 500, dutaTier: 3 }).ledIncluded).toBe(true)
  })
})

describe('campaign module', () => {
  it('ships with no extra campaign active', () => {
    expect(extraCampaign('seri-santubong', new Date('2026-11-01T00:00:00+08:00'))).toBeNull()
    expect(CAMPAIGNS.filter((c) => c.active && c.kind !== 'current-list')).toHaveLength(0)
  })

  it('flipping the sample campaign adds one labelled line and no 10% language', () => {
    const flipped: Campaign[] = CAMPAIGNS.map((c) =>
      c.id === 'contoh-promosi-akan-datang' ? { ...c, active: true } : c,
    )
    const q = computeQuote({
      pkg: 'darul-hana',
      pax: 500,
      campaigns: flipped,
      now: new Date('2027-01-15T10:00:00+08:00'),
    })
    expect(q.campaign?.labelBm).toBe('Promosi seterusnya')
    expect(q.campaignOff).toBe(1125)
    expect(q.afterCampaign).toBe(21375)
    expect(q.total).toBe(21375)
    expect(JSON.stringify(q)).not.toContain('10%')
  })

  it('an out-of-window campaign stays off', () => {
    const flipped: Campaign[] = CAMPAIGNS.map((c) =>
      c.id === 'contoh-promosi-akan-datang' ? { ...c, active: true } : c,
    )
    const q = computeQuote({
      pkg: 'darul-hana',
      pax: 500,
      campaigns: flipped,
      now: new Date('2026-11-01T10:00:00+08:00'),
    })
    expect(q.campaign).toBeNull()
    expect(q.total).toBe(22500)
  })

  it('referral is 5% of the amount AFTER an extra campaign', () => {
    const flipped: Campaign[] = CAMPAIGNS.map((c) =>
      c.id === 'contoh-promosi-akan-datang' ? { ...c, active: true } : c,
    )
    const q = computeQuote({
      pkg: 'darul-hana',
      pax: 500,
      referralApplied: true,
      campaigns: flipped,
      now: new Date('2027-01-15T10:00:00+08:00'),
    })
    expect(q.refDisc).toBeCloseTo(0.05 * 21375, 6)
  })
})

describe('referral validation', () => {
  it('accepts a seeded foreign code', () => {
    expect(validateReferral('WMS-AINA', {}).ok).toBe(true)
    expect(validateReferral('wms-aina', {}).ok).toBe(true)
  })

  it('rejects an unknown code', () => {
    expect(validateReferral('WMS-NOPE', {}).reason).toBe('unknown')
  })

  it('rejects the ambassador using their own code', () => {
    expect(validateReferral('WMS-AINA', { ownCode: 'WMS-AINA' }).reason).toBe('own-code')
  })

  it('rejects the same phone as the referrer', () => {
    expect(validateReferral('WMS-AINA', { phone: '011-2233 4455' }).reason).toBe('same-phone')
  })

  it('flags a planner code as staff-handled commission, not cash off', () => {
    const r = validateReferral('YBMS-PL-IRFAN', {})
    expect(r.ok).toBe(true)
    expect(r.kind).toBe('planner')
    expect(r.appliesCash).toBe(false)
  })
})
