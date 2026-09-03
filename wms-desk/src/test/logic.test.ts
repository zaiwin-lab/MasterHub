import { describe, expect, it } from 'vitest'
import { decodeCfg, encodeCfg } from '../lib/cfg'
import { buildBrief } from '../lib/whatsapp'
import { computeQuote } from '../lib/quote'
import { anonymise, creditFor, mintReference, nextTier } from '../lib/referral'
import { clampPax } from '../lib/quote'
import { isValidMyPhone, canHold } from '../store/useDesk'
import { upcomingSaturdays, fromISODate } from '../lib/format'

describe('family-review cfg link', () => {
  it('round-trips a draft', () => {
    const draft = {
      date: '2026-12-26',
      pkg: 'seri-keringkam' as const,
      pax: 800,
      dishes: { nasi: 'nasi-minyak', ikan: 'tongkol-masak-hitam' },
      names: 'Nadia & Syafiq',
      notes: 'Pentas di tengah',
      benang: 'WMS-AINA',
    }
    const back = decodeCfg(encodeCfg(draft))
    expect(back).toMatchObject(draft)
  })

  it('survives non-ASCII names', () => {
    const back = decodeCfg(encodeCfg({ names: 'Nurul ‘Aina & Hafiz — Kuching' }))
    expect(back?.names).toBe('Nurul ‘Aina & Hafiz — Kuching')
  })

  it('returns null for a truncated link instead of throwing', () => {
    expect(decodeCfg('not-a-real-cfg-%%%')).toBeNull()
  })
})

describe('WhatsApp brief', () => {
  const base = {
    ref: 'YBMS-261226-K7QP',
    date: '2026-12-26',
    pkg: 'seri-keringkam' as const,
    pax: 800,
    names: 'Nadia & Syafiq',
    phone: '012-345 6789',
    notes: '',
    quote: computeQuote({ pkg: 'seri-keringkam', pax: 800 }),
  }

  it('names harga pakej semasa and never a percentage discount', () => {
    const brief = buildBrief({ ...base, dishes: {}, lang: 'bm' })
    expect(brief).toContain('Assalamualaikum')
    expect(brief).toContain('YBMS-261226-K7QP')
    expect(brief).toContain('Harga pakej semasa')
    expect(brief).toMatch(/RM\s58,400/) // Intl uses a non-breaking space
    expect(brief).not.toMatch(/10\s?%/)
    expect(brief).not.toMatch(/diskaun/i)
    expect(brief).toContain('Semua harga tertakluk kepada perubahan semasa.')
  })

  it('lists every unpicked course as belum dipilih', () => {
    const brief = buildBrief({ ...base, dishes: { nasi: 'nasi-minyak' }, lang: 'bm' })
    expect(brief).toContain('Nasi Minyak')
    expect((brief.match(/belum dipilih/g) ?? []).length).toBeGreaterThanOrEqual(6)
  })

  it('follows the UI language', () => {
    const brief = buildBrief({ ...base, dishes: {}, lang: 'en' })
    expect(brief).toContain('Current package price')
    expect(brief).toContain('not yet chosen')
  })

  it('adds the planner commission note instead of cash off', () => {
    const brief = buildBrief({
      ...base,
      dishes: {},
      lang: 'bm',
      benangCode: 'YBMS-PL-IRFAN',
      plannerNote: true,
    })
    expect(brief).toContain('Nota komisen 5%')
    expect(brief).not.toContain('Benang Emas: −')
  })
})

describe('duta credit ladder', () => {
  it('unlocks at 1, 3 and 5 confirmed', () => {
    expect(creditFor(0)).toEqual({ credit: 0, tier: 0 })
    expect(creditFor(1)).toEqual({ credit: 250, tier: 1 })
    expect(creditFor(2)).toEqual({ credit: 250, tier: 1 })
    expect(creditFor(3)).toEqual({ credit: 750, tier: 2 })
    expect(creditFor(5)).toEqual({ credit: 1500, tier: 3 })
    expect(creditFor(9)).toEqual({ credit: 1500, tier: 3 })
  })

  it('points at the next rung', () => {
    expect(nextTier(0)?.confirmed).toBe(1)
    expect(nextTier(3)?.confirmed).toBe(5)
    expect(nextTier(5)).toBeNull()
  })

  it('spends credit on the duta own quote', () => {
    const q = computeQuote({ pkg: 'darul-hana', pax: 500, credit: 750 })
    expect(q.total).toBe(21750)
  })

  it('never lets credit push a total below zero', () => {
    const q = computeQuote({ pkg: 'darul-hana', pax: 500, credit: 999999 })
    expect(q.total).toBe(0)
  })
})

describe('references and phone validation', () => {
  it('mints a reference with no ambiguous glyphs', () => {
    for (let i = 0; i < 200; i++) {
      const ref = mintReference(new Date('2026-12-26T10:00:00+08:00'))
      expect(ref).toMatch(/^YBMS-261226-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/)
    }
  })

  it('accepts Malaysian mobile shapes', () => {
    expect(isValidMyPhone('011-2233 4455')).toBe(true)
    expect(isValidMyPhone('0123456789')).toBe(true)
    expect(isValidMyPhone('+60123456789')).toBe(true)
    expect(isValidMyPhone('082-239 460')).toBe(false)
    expect(isValidMyPhone('hello')).toBe(false)
  })

  it('requires date, name, phone and a legal pax before a hold', () => {
    const ok = { date: '2026-12-26', names: 'Nadia & Syafiq', phone: '012-345 6789', pax: 800 }
    expect(canHold(ok)).toBe(true)
    expect(canHold({ ...ok, date: '' })).toBe(false)
    expect(canHold({ ...ok, phone: '123' })).toBe(false)
    expect(canHold({ ...ok, names: ' ' })).toBe(false)
  })

  it('anonymises couple names for the public ticker', () => {
    expect(anonymise('Nadia & Syafiq')).toBe('N**** & S****')
    expect(anonymise('Zu')).toBe('Z**')
  })
})

describe('date rules', () => {
  it('offers Saturdays that clear the 14-day lead and the horizon', () => {
    const sats = upcomingSaturdays(8)
    expect(sats).toHaveLength(8)
    for (const iso of sats) {
      const d = fromISODate(iso)
      expect(d.getDay()).toBe(6)
      expect(d.getTime()).toBeGreaterThan(Date.now() + 13 * 86_400_000)
      expect(iso <= '2027-06-30').toBe(true)
    }
  })

  it('keeps pax inside 500–2000 whatever arrives', () => {
    expect(clampPax(Number.NaN)).toBe(500)
    expect(clampPax(-40)).toBe(500)
    expect(clampPax(1e9)).toBe(2000)
  })
})
