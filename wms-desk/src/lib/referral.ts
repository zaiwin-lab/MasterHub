export type AmbassadorKind = 'couple' | 'planner'

export type Ambassador = {
  code: string
  name: string
  phone: string
  kind: AmbassadorKind
}

export type BenangEventKind = 'view' | 'draft' | 'hold' | 'confirm'

export type BenangEvent = {
  id: string
  code: string
  kind: BenangEventKind
  holdRef?: string
  /** Anonymised display name, e.g. "N*** & S***". */
  who?: string
  at: number
}

export const AMBASSADOR_SEED: Ambassador[] = [
  { code: 'WMS-AINA', name: 'Aina & Hafiz', phone: '011-2233 4455', kind: 'couple' },
  { code: 'WMS-DAYA', name: 'Dayang & Faris', phone: '013-8877 6655', kind: 'couple' },
  {
    code: 'YBMS-PL-IRFAN',
    name: 'Wan Mohd Irfan (perancang)',
    phone: '+60 16-579 5789',
    kind: 'planner',
  },
]

export const TIERS = [
  { confirmed: 1, credit: 250, perkBm: '—', perkEn: '—' },
  {
    confirmed: 3,
    credit: 750,
    perkBm: 'LED disertakan walaupun tetamu kurang 700',
    perkEn: 'LED included even under 700 guests',
  },
  {
    confirmed: 5,
    credit: 1500,
    perkBm: '+2 petak parkir VIP',
    perkEn: '+2 VIP parking bays',
  },
] as const

/** Credit unlocked, and the tier index (0 = none, 1/2/3 = tiers). */
export function creditFor(confirmed: number): { credit: number; tier: number } {
  let credit = 0
  let tier = 0
  TIERS.forEach((t, i) => {
    if (confirmed >= t.confirmed) {
      credit = t.credit
      tier = i + 1
    }
  })
  return { credit, tier }
}

export function nextTier(confirmed: number) {
  return TIERS.find((t) => confirmed < t.confirmed) ?? null
}

export function normalisePhone(p: string): string {
  return p.replace(/[^0-9]/g, '').replace(/^0/, '60')
}

export function isPlannerCode(code: string): boolean {
  return code.toUpperCase().startsWith('YBMS-PL-')
}

export type ReferralCheck = {
  ok: boolean
  code?: string
  name?: string
  kind?: AmbassadorKind
  /** Planner codes never auto-apply cash to the quote. */
  appliesCash: boolean
  reason?: 'unknown' | 'own-code' | 'same-phone' | 'empty'
}

export function validateReferral(
  raw: string | null | undefined,
  ctx: { ownCode?: string | null; phone?: string | null; directory?: Ambassador[] },
): ReferralCheck {
  const code = (raw ?? '').trim().toUpperCase()
  if (!code) return { ok: false, appliesCash: false, reason: 'empty' }

  const dir = ctx.directory ?? AMBASSADOR_SEED
  const amb = dir.find((a) => a.code.toUpperCase() === code)
  if (!amb) return { ok: false, appliesCash: false, reason: 'unknown' }

  if (ctx.ownCode && ctx.ownCode.toUpperCase() === code) {
    return { ok: false, appliesCash: false, reason: 'own-code' }
  }

  if (ctx.phone && normalisePhone(ctx.phone) === normalisePhone(amb.phone)) {
    return { ok: false, appliesCash: false, reason: 'same-phone' }
  }

  return {
    ok: true,
    code: amb.code,
    name: amb.name,
    kind: amb.kind,
    appliesCash: amb.kind === 'couple',
  }
}

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function pick(n: number): string {
  let s = ''
  const buf = new Uint32Array(n)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(buf)
  else for (let i = 0; i < n; i++) buf[i] = Math.floor(Math.random() * 0xffffffff)
  for (let i = 0; i < n; i++) s += CODE_ALPHABET[buf[i] % CODE_ALPHABET.length]
  return s
}

/** Ambassador code, e.g. WMS-K7QP. */
export function mintAmbassadorCode(): string {
  return `WMS-${pick(4)}`
}

/** Booking reference, e.g. YBMS-261226-K7QP. */
export function mintReference(date: Date = new Date()): string {
  const y = String(date.getFullYear()).slice(2)
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `YBMS-${y}${m}${d}-${pick(4)}`
}

export function anonymise(name: string): string {
  return name
    .split(/\s*&\s*/)
    .map((part) => {
      const t = part.trim()
      if (!t) return t
      return `${t[0]}${'*'.repeat(Math.max(2, Math.min(4, t.length - 1)))}`
    })
    .join(' & ')
}
