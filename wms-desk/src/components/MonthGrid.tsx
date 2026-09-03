import { useMemo, useState } from 'react'
import { useLang } from '../store/useLang'
import { useHolds } from '../store/useHolds'
import { t } from '../lib/i18n'
import { addDays, fromISODate, monthLabel, toISODate } from '../lib/format'
import { VENUE } from '../lib/venue'

type DayState = 'open' | 'held' | 'confirmed' | 'too-soon' | 'too-far' | 'blank'

const DOW_BM = ['A', 'I', 'S', 'R', 'K', 'J', 'S']
const DOW_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function MonthGrid({
  onPick,
  selected,
  months = 1,
}: {
  onPick: (iso: string) => void
  selected?: string
  months?: number
}) {
  const { lang } = useLang()
  const holds = useHolds()
  const first = useMemo(() => {
    const d = addDays(new Date(), VENUE.minLeadDays)
    return new Date(d.getFullYear(), d.getMonth(), 1)
  }, [])
  const [offset, setOffset] = useState(0)

  const cursor = new Date(first.getFullYear(), first.getMonth() + offset, 1)
  const horizon = fromISODate(VENUE.lastEventDate)
  const earliest = addDays(new Date(), VENUE.minLeadDays)

  const stateOf = (d: Date): DayState => {
    if (d > horizon) return 'too-far'
    if (d < earliest) return 'too-soon'
    const st = holds.statusOf(toISODate(d))
    return st === 'open' ? 'open' : st
  }

  const grids = Array.from({ length: months }, (_, m) => {
    const base = new Date(cursor.getFullYear(), cursor.getMonth() + m, 1)
    const lead = base.getDay()
    const days = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate()
    const cells: (Date | null)[] = [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: days }, (_, i) => new Date(base.getFullYear(), base.getMonth(), i + 1)),
    ]
    const openCount = cells.filter((c) => c && stateOf(c) === 'open').length
    return { base, cells, openCount }
  })

  const dow = lang === 'bm' ? DOW_BM : DOW_EN

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setOffset((o) => Math.max(0, o - 1))}
          disabled={offset === 0}
          className="ctl h-10 w-10 border border-ink/25 disabled:opacity-30 hover:border-ink transition-colors duration-150"
          aria-label={lang === 'bm' ? 'Bulan sebelum' : 'Previous month'}
        >
          ←
        </button>
        <div className="display text-[15px] tnum">{monthLabel(cursor, lang)}</div>
        <button
          onClick={() => setOffset((o) => o + 1)}
          className="ctl h-10 w-10 border border-ink/25 hover:border-ink transition-colors duration-150"
          aria-label={lang === 'bm' ? 'Bulan seterusnya' : 'Next month'}
        >
          →
        </button>
      </div>

      {grids.map(({ base, cells, openCount }) => (
        <div key={toISODate(base)} className="mt-3">
          {months > 1 && (
            <div className="display text-[14px] mb-1.5">{monthLabel(base, lang)}</div>
          )}
          <div className="grid grid-cols-7 gap-1 text-center text-[10.5px] text-inksoft">
            {dow.map((d, i) => (
              <div key={i} className={i === 6 ? 'text-copper' : ''}>
                {d}
              </div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <div key={`b${i}`} />
              const iso = toISODate(d)
              const st = stateOf(d)
              const isSel = selected === iso
              const weekend = d.getDay() === 6 || d.getDay() === 0
              const disabled = st === 'too-soon' || st === 'too-far'
              const hold = st === 'held' ? holds.holdFor(iso) : undefined
              const hrs = hold
                ? Math.max(
                    0,
                    Math.round(
                      (hold.createdAt + VENUE.holdHours * 3_600_000 - Date.now()) / 3_600_000,
                    ),
                  )
                : 0
              return (
                <button
                  key={iso}
                  onClick={() => !disabled && onPick(iso)}
                  disabled={disabled}
                  aria-pressed={isSel}
                  aria-label={`${iso} — ${
                    st === 'open'
                      ? t('dateOpen', lang)
                      : st === 'held'
                        ? t('dateHeld', lang)
                        : st === 'confirmed'
                          ? t('dateFull', lang)
                          : st === 'too-soon'
                            ? t('tooSoon', lang)
                            : t('tooFar', lang)
                  }`}
                  className={`relative aspect-square min-h-[38px] ctl border text-[12.5px] tnum transition-colors duration-150 ${
                    isSel
                      ? 'border-ink bg-ink text-paper'
                      : st === 'confirmed'
                        ? 'border-ink/10 bg-paper2 text-inksoft/60 line-through'
                        : st === 'held'
                          ? 'border-hold/45 text-hold'
                          : disabled
                            ? 'border-transparent text-inksoft/30'
                            : weekend
                              ? 'border-copper/40 hover:border-ink bg-paper2/60'
                              : 'border-ink/15 hover:border-ink'
                  }`}
                  title={st === 'held' ? `${t('dateHeld', lang)} · ${hrs}h` : undefined}
                >
                  {d.getDate()}
                  {st === 'held' && (
                    <span
                      className="pulse-hold absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-hold"
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>
          {openCount === 0 && (
            <p className="mt-2 text-[12px] text-inksoft">{t('emptyMonth', lang)}</p>
          )}
        </div>
      ))}

      <Legend />
    </div>
  )
}

export function Legend() {
  const { lang } = useLang()
  const item = (cls: string, label: string) => (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 ctl border ${cls}`} aria-hidden="true" />
      {label}
    </span>
  )
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-inksoft">
      {item('border-ink/25', t('dateOpen', lang))}
      {item('border-hold/60 bg-hold/25', t('dateHeld', lang))}
      {item('border-ink/10 bg-paper2', t('dateFull', lang))}
    </div>
  )
}

/** Compact week strip of the coming Saturdays, for the home column. */
export function WeekStrip() {
  const { lang } = useLang()
  const holds = useHolds()
  const sats = useMemo(() => {
    const out: string[] = []
    const d = addDays(new Date(), VENUE.minLeadDays)
    while (d.getDay() !== 6) d.setDate(d.getDate() + 1)
    for (let i = 0; i < 6; i++) {
      out.push(toISODate(d))
      d.setDate(d.getDate() + 7)
    }
    return out
  }, [])

  return (
    <div className="flex gap-1">
      {sats.map((iso) => {
        const st = holds.statusOf(iso)
        return (
          <div key={iso} className="flex-1 min-w-0">
            <div
              className={`h-1.5 ${
                st === 'open' ? 'bg-ink/20' : st === 'held' ? 'bg-hold/70' : 'bg-ink/60'
              }`}
              title={`${iso} — ${
                st === 'open' ? t('dateOpen', lang) : st === 'held' ? t('dateHeld', lang) : t('dateFull', lang)
              }`}
            />
            <div className="mt-1 text-[10px] tnum text-inksoft truncate">
              {fromISODate(iso).getDate()}
            </div>
          </div>
        )
      })}
    </div>
  )
}
