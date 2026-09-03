import type { Lang } from './i18n'

export function rm(n: number, lang: Lang = 'bm'): string {
  return new Intl.NumberFormat(lang === 'bm' ? 'ms-MY' : 'en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })
    .format(n)
    .replace(/^MYR\s?/, 'RM ')
    .replace(/^RM(?=\d)/, 'RM ')
}

export function num(n: number, lang: Lang = 'bm'): string {
  return new Intl.NumberFormat(lang === 'bm' ? 'ms-MY' : 'en-MY').format(n)
}

/** ISO yyyy-mm-dd in Asia/Kuching terms (dates here are date-only, no TZ drift). */
export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function longDate(iso: string, lang: Lang = 'bm'): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat(lang === 'bm' ? 'ms-MY' : 'en-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(fromISODate(iso))
}

export function shortDate(iso: string, lang: Lang = 'bm'): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat(lang === 'bm' ? 'ms-MY' : 'en-MY', {
    day: 'numeric',
    month: 'short',
  }).format(fromISODate(iso))
}

export function monthLabel(d: Date, lang: Lang = 'bm'): string {
  return new Intl.DateTimeFormat(lang === 'bm' ? 'ms-MY' : 'en-MY', {
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

/** Next N Saturdays that clear the 14-day lead and the 30 Jun 2027 horizon. */
export function upcomingSaturdays(count: number, from: Date = new Date(), leadDays = 14): string[] {
  const out: string[] = []
  const start = addDays(from, leadDays)
  const cursor = new Date(start)
  while (cursor.getDay() !== 6) cursor.setDate(cursor.getDate() + 1)
  const horizon = fromISODate('2027-06-30')
  while (out.length < count && cursor <= horizon) {
    out.push(toISODate(cursor))
    cursor.setDate(cursor.getDate() + 7)
  }
  return out
}

export function hoursLeft(untilMs: number, nowMs: number = Date.now()) {
  const ms = Math.max(0, untilMs - nowMs)
  return {
    ms,
    h: Math.floor(ms / 3_600_000),
    m: Math.floor((ms % 3_600_000) / 60_000),
    s: Math.floor((ms % 60_000) / 1000),
    expired: ms <= 0,
  }
}
