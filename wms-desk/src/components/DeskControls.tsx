import { useMemo, useState } from 'react'
import { useLang } from '../store/useLang'
import { useDesk } from '../store/useDesk'
import { useHolds } from '../store/useHolds'
import { t } from '../lib/i18n'
import {
  addDays,
  fromISODate,
  hoursLeft,
  longDate,
  num,
  rm,
  shortDate,
  toISODate,
  upcomingSaturdays,
} from '../lib/format'
import { PACKAGES } from '../lib/packages'
import { VENUE } from '../lib/venue'
import type { Quote } from '../lib/quote'
import { useCountUp } from '../hooks'
import { MonthGrid } from './MonthGrid'

export function SectionLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="tnum text-[11px] text-copper">{String(n).padStart(2, '0')}</span>
      <h2 className="text-[12px] uppercase tracking-[0.16em] text-inksoft">{children}</h2>
    </div>
  )
}

/* ---------------------------------------------------------------- Tarikh */

export function DatePicker() {
  const { lang } = useLang()
  const { date, setDate } = useDesk()
  const holds = useHolds()
  const [openCal, setOpenCal] = useState(false)
  const [rejected, setRejected] = useState<string | null>(null)

  const saturdays = useMemo(() => upcomingSaturdays(8), [])

  const alternatives = useMemo(() => {
    if (!rejected) return []
    return nearestOpen(rejected, holds.statusOf, 3)
  }, [rejected, holds])

  const pick = (iso: string) => {
    if (holds.statusOf(iso) !== 'open') {
      setRejected(iso)
      return
    }
    setRejected(null)
    setDate(iso)
  }

  return (
    <section>
      <SectionLabel n={1}>{t('stepDate', lang)}</SectionLabel>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {saturdays.map((iso, i) => {
          const st = holds.statusOf(iso)
          const active = date === iso
          const taken = st !== 'open'
          return (
            <button
              key={iso}
              onClick={() => pick(iso)}
              aria-pressed={active}
              className={`ctl min-h-[44px] px-3 border text-[13px] transition-colors duration-150 ${
                active
                  ? 'border-ink bg-ink text-paper'
                  : taken
                    ? 'border-ink/15 text-inksoft/70 line-through decoration-hold/70'
                    : 'border-ink/25 hover:border-ink text-ink'
              }`}
              title={
                taken
                  ? st === 'held'
                    ? t('dateHeld', lang)
                    : t('dateFull', lang)
                  : t('dateOpen', lang)
              }
            >
              <span className="tnum">{shortDate(iso, lang)}</span>
              {i === 0 && !taken && (
                <span className="ml-1.5 text-[10.5px] opacity-70">{t('nextSaturday', lang)}</span>
              )}
            </button>
          )
        })}

        <button
          onClick={() => setOpenCal((v) => !v)}
          className="ctl min-h-[44px] px-3 border border-dashed border-ink/35 text-[13px] text-inksoft hover:text-ink hover:border-ink transition-colors duration-150"
          aria-expanded={openCal}
        >
          {t('openCalendar', lang)}
        </button>
      </div>

      {openCal && (
        <div className="mt-3 rise">
          <MonthGrid onPick={pick} selected={date} />
        </div>
      )}

      {rejected && (
        <div className="mt-3 ctl border border-hold/40 bg-hold/[0.06] p-3 rise">
          <div className="text-[13px] text-ink">
            {t('dateTaken', lang)} — <span className="tnum">{longDate(rejected, lang)}</span>
          </div>
          <div className="mt-2 text-[12px] text-inksoft">{t('nearestOpen', lang)}</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {alternatives.map((iso) => (
              <button
                key={iso}
                onClick={() => {
                  setDate(iso)
                  setRejected(null)
                }}
                className="ctl min-h-[40px] px-3 border border-ink/30 hover:border-ink text-[13px] tnum transition-colors duration-150"
              >
                {shortDate(iso, lang)}
                {fromISODate(iso).getDay() === 6 && (
                  <span className="ml-1.5 text-[10.5px] text-copper">
                    {lang === 'bm' ? 'Sabtu' : 'Sat'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-2.5 text-[13px]">
        {date ? (
          <span className="text-ink">
            {t('pickedDate', lang)}: <span className="tnum">{longDate(date, lang)}</span>
          </span>
        ) : (
          <span className="text-inksoft">
            {t('noDateYet', lang)}
            <span className="text-ink/25"> · </span>
            <span className="text-[12px]">{t('weekendNote', lang)}</span>
          </span>
        )}
      </p>
    </section>
  )
}

/** Nearest open dates, weekends first, then any weekday. */
export function nearestOpen(
  fromISO: string,
  statusOf: (d: string) => 'open' | 'held' | 'confirmed',
  count: number,
): string[] {
  const start = fromISODate(fromISO)
  const horizon = fromISODate(VENUE.lastEventDate)
  const weekend: string[] = []
  const weekday: string[] = []
  for (let off = 1; off <= 120 && weekend.length + weekday.length < count * 4; off++) {
    for (const dir of [1, -1]) {
      const d = addDays(start, off * dir)
      if (d > horizon) continue
      if (d < addDays(new Date(), VENUE.minLeadDays)) continue
      const iso = toISODate(d)
      if (statusOf(iso) !== 'open') continue
      const bucket = d.getDay() === 6 || d.getDay() === 0 ? weekend : weekday
      if (!bucket.includes(iso)) bucket.push(iso)
    }
  }
  return [...weekend, ...weekday].slice(0, count)
}

/* ---------------------------------------------------------------- Tetamu */

const PRESETS = [500, 700, 1000, 1500, 2000]

export function PaxDial({ quote }: { quote: Quote }) {
  const { lang } = useLang()
  const { pax, setPax, bumpPax } = useDesk()
  const shown = useCountUp(pax, 260)

  return (
    <section>
      <SectionLabel n={2}>{t('stepPax', lang)}</SectionLabel>

      <div className="mt-1 flex items-end gap-3">
        <div
          className="tnum display leading-[0.85] text-[clamp(52px,9vw,76px)]"
          aria-live="polite"
        >
          {num(Math.round(shown), lang)}
        </div>
        <div className="pb-3 text-[13px] text-inksoft">{t('guests', lang)}</div>

        <div className="ml-auto pb-2 flex gap-1.5">
          <button
            onClick={() => bumpPax(-50)}
            className="ctl h-11 w-11 border border-ink/25 hover:border-ink text-[15px] transition-colors duration-150"
            aria-label="−50"
          >
            −50
          </button>
          <button
            onClick={() => bumpPax(50)}
            className="ctl h-11 w-11 border border-ink/25 hover:border-ink text-[15px] transition-colors duration-150"
            aria-label="+50"
          >
            +50
          </button>
        </div>
      </div>

      <label className="sr-only" htmlFor="pax-range">
        {t('stepPax', lang)}
      </label>
      <input
        id="pax-range"
        type="range"
        min={VENUE.minPax}
        max={VENUE.maxPax}
        step={10}
        value={pax}
        onChange={(e) => setPax(Number(e.target.value))}
        className="mt-1"
      />
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setPax(p)}
            aria-pressed={pax === p}
            className={`ctl min-h-[44px] px-3 border text-[13px] tnum transition-colors duration-150 ${
              pax === p ? 'border-ink bg-ink text-paper' : 'border-ink/25 hover:border-ink'
            }`}
          >
            {num(p, lang)}
            {p === 500 && <span className="ml-1.5 text-[10.5px] opacity-70">{t('presetMesra', lang)}</span>}
            {p === 700 && <span className="ml-1.5 text-[10.5px] opacity-70">{t('presetLed', lang)}</span>}
            {p === 2000 && <span className="ml-1.5 text-[10.5px] opacity-70">{t('presetPenuh', lang)}</span>}
          </button>
        ))}
      </div>

      <p className="mt-2 text-[13px] text-inksoft tnum">
        {t('tablesEst', lang, { n: quote.tablesEst })} ·{' '}
        <span className={quote.ledIncluded ? 'text-confirmed' : ''}>
          {quote.ledIncluded ? t('ledYes', lang) : t('ledNo', lang)}
        </span>
      </p>
    </section>
  )
}

/* ----------------------------------------------------------------- Pakej */

export function PackageRows() {
  const { lang } = useLang()
  const { pkg, setPkg } = useDesk()

  return (
    <section>
      <div className="flex items-baseline justify-between gap-3">
        <SectionLabel n={3}>{t('stepPkg', lang)}</SectionLabel>
        <span className="ctl border border-copper px-2 py-0.5 text-[11px] text-copperhot">
          {t('currentBadge', lang)}
        </span>
      </div>

      <div className="mt-3 border-t border-ink/12">
        {PACKAGES.map((p) => {
          const active = pkg === p.id
          return (
            <button
              key={p.id}
              onClick={() => setPkg(p.id)}
              aria-pressed={active}
              className={`w-full text-left border-b border-ink/12 py-2.5 px-2 -mx-2 flex items-center gap-3 transition-colors duration-150 ${
                active ? 'bg-paper2' : 'hover:bg-paper2/50'
              }`}
            >
              <span
                className={`shrink-0 h-3.5 w-3.5 rounded-full border transition-colors duration-150 ${
                  active ? 'border-ink bg-ink' : 'border-ink/35'
                }`}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="display text-[16px]">{lang === 'bm' ? p.nameBm : p.nameEn}</span>
                <span className="ml-2 text-[11px] text-inksoft whitespace-nowrap">
                  {lang === 'bm' ? p.roleBm : p.roleEn}
                </span>
              </span>
              <span className="shrink-0 text-right whitespace-nowrap">
                <span className="tnum text-[17px]">{rm(p.current, lang)}</span>
                <span className="ml-1.5 tnum text-[11.5px] text-inksoft line-through">
                  {rm(p.usual, lang)}
                </span>
              </span>
            </button>
          )
        })}
      </div>

    </section>
  )
}

/* ---------------------------------------------------------------- Jumlah */

export function QuoteWaterfall({
  quote,
  benangName,
  compact,
}: {
  quote: Quote
  benangName?: string
  compact?: boolean
}) {
  const { lang } = useLang()
  const { pax, useCredit, setUseCredit } = useDesk()
  const total = useCountUp(quote.total)

  const Row = ({
    label,
    value,
    strike,
    accent,
  }: {
    label: React.ReactNode
    value: string
    strike?: boolean
    accent?: 'copper' | 'confirmed'
  }) => (
    <div className="flex items-baseline justify-between gap-4 py-1.5 text-[13px]">
      <span className={strike ? 'text-inksoft' : accent ? 'text-copperhot' : 'text-inksoft'}>
        {label}
      </span>
      <span
        className={`tnum shrink-0 ${
          strike
            ? 'text-inksoft line-through'
            : accent === 'copper'
              ? 'text-copperhot'
              : accent === 'confirmed'
                ? 'text-confirmed'
                : 'text-ink'
        }`}
      >
        {value}
      </span>
    </div>
  )

  return (
    <section>
      {!compact && <SectionLabel n={4}>{t('stepTotal', lang)}</SectionLabel>}

      <div className={compact ? '' : 'mt-3'}>
        <Row
          label={`${t('usualPrice', lang)} · ${rm(quote.usualUnit, lang)} × ${num(pax, lang)}`}
          value={rm(quote.usualTotal, lang)}
          strike
        />
        <Row
          label={`${t('priceFrame', lang)} · ${rm(quote.unit, lang)} × ${num(pax, lang)}`}
          value={rm(quote.semasaTotal, lang)}
        />

        {quote.campaign && (
          <Row
            label={lang === 'bm' ? quote.campaign.labelBm : quote.campaign.labelEn}
            value={`− ${rm(quote.campaignOff, lang)}`}
            accent="copper"
          />
        )}

        {quote.refDisc > 0 && (
          <Row
            label={
              <>
                {t('benangLine', lang)}
                {benangName ? ` · ${benangName}` : ''}
                {quote.refCapped && (
                  <span className="ml-1 text-[11px] text-inksoft">({t('cappedAt', lang)})</span>
                )}
              </>
            }
            value={`− ${rm(quote.refDisc, lang)}`}
            accent="copper"
          />
        )}

        {quote.credit > 0 && (
          <Row
            label={t('creditLine', lang)}
            value={`− ${rm(quote.credit, lang)}`}
            accent="confirmed"
          />
        )}

        <hr className="rule-copper my-2" />

        <div className="flex items-baseline justify-between gap-4">
          <span className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
            {t('totalLabel', lang)}
          </span>
          <span className="tnum display text-[clamp(30px,6vw,42px)] leading-none" aria-live="polite">
            {rm(Math.round(total), lang)}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-inksoft tnum">
          <span>
            {rm(Math.round(quote.perPax * 100) / 100, lang)} {t('perPax', lang)}
          </span>
          <span className="text-ink/20">·</span>
          <span>{t('tablesEst', lang, { n: quote.tablesEst })}</span>
          <span className="text-ink/20">·</span>
          <span className={quote.ledIncluded ? 'text-confirmed' : ''}>
            {quote.ledIncluded ? t('ledYes', lang) : t('ledNo', lang)}
          </span>
        </div>

        {quote.credit > 0 && (
          <label className="mt-2 flex items-center gap-2 text-[12.5px] text-inksoft">
            <input
              type="checkbox"
              checked={useCredit}
              onChange={(e) => setUseCredit(e.target.checked)}
              className="h-4 w-4 accent-[#2F5A40]"
            />
            {t('useCredit', lang)}
          </label>
        )}

        <p className="mt-2 text-[11.5px] text-inksoft">{t('subjectToChange', lang)}</p>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- Hold bar */

export function HoldCountdown({ createdAt, now }: { createdAt: number; now: number }) {
  const { lang } = useLang()
  const left = hoursLeft(createdAt + VENUE.holdHours * 3_600_000, now)
  if (left.expired) return <span className="text-hold">{t('expired', lang)}</span>
  return (
    <span className="tnum text-hold">
      {left.h}h {String(left.m).padStart(2, '0')}m · {t('timeLeft', lang)}
    </span>
  )
}
