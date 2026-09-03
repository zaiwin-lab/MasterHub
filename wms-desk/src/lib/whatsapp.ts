import { rm, longDate } from './format'
import type { Lang } from './i18n'
import { getPackage, type PackageId } from './packages'
import type { Quote } from './quote'
import { VENUE } from './venue'

export type BriefInput = {
  ref?: string
  date: string
  pkg: PackageId
  pax: number
  dishes: Record<string, string>
  names: string
  phone: string
  notes: string
  benangCode?: string
  benangName?: string
  plannerNote?: boolean
  quote: Quote
  lang: Lang
}

/**
 * The brief staff receive. It names the harga pakej semasa total and never a
 * percentage discount — the selling price IS the current package price.
 */
export function buildBrief(i: BriefInput): string {
  const bm = i.lang === 'bm'
  const p = getPackage(i.pkg)
  const L = (a: string, b: string) => (bm ? a : b)
  const lines: string[] = []

  lines.push(L('Assalamualaikum dan salam sejahtera.', 'Assalamualaikum and warm greetings.'))
  lines.push('')
  lines.push(
    L(
      `Saya ingin tempah ${VENUE.hall}.`,
      `I would like to book ${VENUE.hall}.`,
    ),
  )
  lines.push('')
  if (i.ref) lines.push(`${L('Rujukan', 'Reference')}: ${i.ref}`)
  lines.push(`${L('Tarikh', 'Date')}: ${longDate(i.date, i.lang)}`)
  lines.push(`${L('Pakej', 'Package')}: ${bm ? p.nameBm : p.nameEn}`)
  lines.push(`${L('Tetamu', 'Guests')}: ${i.pax}`)
  lines.push(
    `${L('Anggaran meja', 'Estimated tables')}: ${i.quote.tablesEst} · ${L('LED', 'LED')}: ${
      i.quote.ledIncluded ? L('ya', 'yes') : L('tidak', 'no')
    }`,
  )
  lines.push('')
  lines.push(
    `${L('Harga pakej semasa', 'Current package price')}: ${rm(i.quote.unit, i.lang)} × ${i.pax} = ${rm(
      i.quote.semasaTotal,
      i.lang,
    )}`,
  )
  if (i.quote.campaign) {
    lines.push(
      `${bm ? i.quote.campaign.labelBm : i.quote.campaign.labelEn}: − ${rm(i.quote.campaignOff, i.lang)}`,
    )
  }
  if (i.quote.refDisc > 0) {
    lines.push(
      `${L('Benang Emas', 'Benang Emas')}${i.benangCode ? ` (${i.benangCode})` : ''}: − ${rm(
        i.quote.refDisc,
        i.lang,
      )}`,
    )
  }
  if (i.quote.credit > 0) {
    lines.push(`${L('Kredit duta', 'Ambassador credit')}: − ${rm(i.quote.credit, i.lang)}`)
  }
  lines.push(`${L('Jumlah', 'Total')}: ${rm(i.quote.total, i.lang)}`)
  lines.push('')

  lines.push(`${L('Menu', 'Menu')}:`)
  for (const c of p.courses) {
    const chosen = i.dishes[c.id]
    const opt = c.options.find((o) => o.id === chosen)
    const label = bm ? c.labelBm : c.labelEn
    const value = opt ? (bm ? opt.bm : opt.en) : L('belum dipilih', 'not yet chosen')
    lines.push(`- ${label}: ${value}`)
  }
  for (const inc of bm ? p.includedBm : p.includedEn) {
    lines.push(`- ${inc} (${L('termasuk', 'included')})`)
  }
  lines.push('')

  lines.push(`${L('Pengantin', 'Couple')}: ${i.names || L('belum dipilih', 'not yet chosen')}`)
  lines.push(`${L('Telefon', 'Contact')}: ${i.phone || L('belum dipilih', 'not yet chosen')}`)
  if (i.notes.trim()) lines.push(`${L('Nota', 'Notes')}: ${i.notes.trim()}`)
  if (i.benangCode) {
    lines.push(
      `${L('Kod Benang Emas', 'Benang Emas code')}: ${i.benangCode}${
        i.benangName ? ` — ${i.benangName}` : ''
      }`,
    )
    if (i.plannerNote) {
      lines.push(L('Nota komisen 5% — kakitangan urus.', '5% commission noted — staff to handle.'))
    }
  }
  lines.push('')
  lines.push(L('Semua harga tertakluk kepada perubahan semasa.', 'All prices are subject to prevailing changes.'))
  lines.push(
    L(
      'Mohon sahkan tarikh ini. Terima kasih.',
      'Please confirm this date. Thank you.',
    ),
  )

  return lines.join('\n')
}

export function waLink(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export function buildQuoteText(i: BriefInput): string {
  const bm = i.lang === 'bm'
  const p = getPackage(i.pkg)
  const L = (a: string, b: string) => (bm ? a : b)
  const out = [
    `${VENUE.hall} — ${L('sebut harga', 'quote')}`,
    `${L('Tarikh', 'Date')}: ${i.date ? longDate(i.date, i.lang) : L('belum dipilih', 'not yet chosen')}`,
    `${L('Pakej', 'Package')}: ${bm ? p.nameBm : p.nameEn}`,
    `${L('Tetamu', 'Guests')}: ${i.pax} · ${i.quote.tablesEst} ${L('meja', 'tables')}`,
    `${L('Harga biasa', 'Usual price')}: ${rm(i.quote.usualUnit, i.lang)} × ${i.pax}`,
    `${L('Harga pakej semasa', 'Current package price')}: ${rm(i.quote.unit, i.lang)} × ${i.pax} = ${rm(i.quote.semasaTotal, i.lang)}`,
  ]
  if (i.quote.campaign) {
    out.push(`${bm ? i.quote.campaign.labelBm : i.quote.campaign.labelEn}: − ${rm(i.quote.campaignOff, i.lang)}`)
  }
  if (i.quote.refDisc > 0) out.push(`Benang Emas: − ${rm(i.quote.refDisc, i.lang)}`)
  if (i.quote.credit > 0) out.push(`${L('Kredit', 'Credit')}: − ${rm(i.quote.credit, i.lang)}`)
  out.push(`${L('Jumlah', 'Total')}: ${rm(i.quote.total, i.lang)}`)
  out.push(L('Semua harga tertakluk kepada perubahan semasa.', 'All prices are subject to prevailing changes.'))
  return out.join('\n')
}
