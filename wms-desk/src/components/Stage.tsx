import { useLang } from '../store/useLang'
import { useDesk } from '../store/useDesk'
import { t } from '../lib/i18n'
import { longDate, num } from '../lib/format'
import { getPackage, type PackageId } from '../lib/packages'
import { VENUE } from '../lib/venue'

/* ------------------------------------------------------------- Undangan */

export function Undangan({
  names,
  date,
  pkg,
  compact,
}: {
  names: string
  date: string
  pkg: PackageId
  compact?: boolean
}) {
  const { lang } = useLang()
  const p = getPackage(pkg)
  const shown = names.trim() || t('coupleNamesPh', lang)

  return (
    <div
      className={`bg-paper border border-ink/20 ${compact ? 'p-4' : 'p-6 sm:p-8'} flex flex-col`}
      style={{ aspectRatio: compact ? undefined : '3 / 4' }}
    >
      <div className="text-[10px] uppercase tracking-[0.22em] text-inksoft">
        {lang === 'bm' ? 'Walimatulurus' : 'Wedding reception'}
      </div>

      <div className="flex-1 grid place-items-center py-6">
        <div className="text-center">
          <div
            className={`display italic ${
              compact ? 'text-[22px]' : 'text-[clamp(24px,3.4vw,38px)]'
            } leading-[1.15]`}
          >
            {shown}
          </div>
          <hr className="rule-copper my-4 mx-auto w-16" />
          <div className={`tnum ${compact ? 'text-[12px]' : 'text-[14px]'} text-ink`}>
            {date ? longDate(date, lang) : t('noDateYet', lang)}
          </div>
          <div className="mt-1 text-[12px] text-inksoft">{lang === 'bm' ? p.nameBm : p.nameEn}</div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 text-[10.5px] text-inksoft">
        <span className="min-w-0 leading-snug">
          {VENUE.hall}
          <br />
          Petra Jaya, Kuching
        </span>
        <span className="shrink-0 display text-[13px] text-ink">YBMS</span>
      </div>
    </div>
  )
}

/* --------------------------------------------------------- Hall schematic */

/**
 * Density bands, not 200 table nodes. Four bands fill as pax climbs, which
 * stays cheap at 2,000 guests and reads faster than a CAD plan.
 */
export function HallSchematic({ pax, led }: { pax: number; led: boolean }) {
  const { lang } = useLang()
  const filled = (pax / VENUE.maxPax) * 4
  const tables = Math.ceil(pax / 10)

  return (
    <div>
      <svg viewBox="0 0 320 200" className="w-full h-auto" role="img" aria-label={`${pax} ${t('guests', lang)}`}>
        <rect x="8" y="8" width="304" height="184" fill="none" stroke="#1A1714" strokeOpacity="0.25" />

        {/* Stage */}
        <rect
          x="104"
          y="14"
          width="112"
          height="20"
          fill={led ? '#1A1714' : 'none'}
          stroke="#1A1714"
          strokeOpacity={led ? 1 : 0.4}
        />
        <text
          x="160"
          y="28"
          textAnchor="middle"
          fontSize="9"
          fill={led ? '#F7F4EE' : '#5A534A'}
          fontFamily="Schibsted Grotesk, sans-serif"
        >
          {led ? (lang === 'bm' ? 'PENTAS + LED' : 'STAGE + LED') : lang === 'bm' ? 'PENTAS' : 'STAGE'}
        </text>

        {/* Four density bands */}
        {[0, 1, 2, 3].map((i) => {
          const fill = Math.max(0, Math.min(1, filled - i))
          const y = 48 + i * 33
          return (
            <g key={i}>
              <rect x="24" y={y} width="272" height="26" fill="none" stroke="#1A1714" strokeOpacity="0.12" />
              <rect
                x="24"
                y={y}
                width={272 * fill}
                height="26"
                fill="#B08A4F"
                fillOpacity={0.2 + i * 0.06}
                style={{ transition: 'width 200ms cubic-bezier(0.2,0.8,0.2,1)' }}
              />
              {fill > 0.04 && (
                <line
                  x1="24"
                  y1={y + 26}
                  x2={24 + 272 * fill}
                  y2={y + 26}
                  stroke="#B08A4F"
                  strokeWidth="1"
                  style={{ transition: 'all 200ms cubic-bezier(0.2,0.8,0.2,1)' }}
                />
              )}
            </g>
          )
        })}

        {/* Bridal bays */}
        <rect x="24" y="178" width="26" height="10" fill="none" stroke="#1A1714" strokeOpacity="0.3" />
        <rect x="54" y="178" width="26" height="10" fill="none" stroke="#1A1714" strokeOpacity="0.3" />
        <text x="86" y="187" fontSize="7.5" fill="#5A534A" fontFamily="Schibsted Grotesk, sans-serif">
          {lang === 'bm' ? 'parkir pengantin' : 'bridal parking'}
        </text>
      </svg>

      <p className="mt-1.5 text-[12px] text-inksoft tnum">
        {t('tablesEst', lang, { n: tables })} · {num(pax, lang)} {t('guests', lang)}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------ Menu tasting */

export function MenuTasting() {
  const { lang } = useLang()
  const desk = useDesk()
  const p = getPackage(desk.pkg)

  return (
    <div>
      {p.courses.map((c) => (
        <div key={c.id} className="py-3 border-b border-ink/12">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[12px] uppercase tracking-[0.14em] text-inksoft">
              {lang === 'bm' ? c.labelBm : c.labelEn}
            </span>
            {!desk.dishes[c.id] && (
              <span className="text-[11px] text-inksoft/70">{t('notPicked', lang)}</span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {c.options.map((o) => {
              const active = desk.dishes[c.id] === o.id
              return (
                <button
                  key={o.id}
                  onClick={() => desk.setDish(c.id, o.id)}
                  aria-pressed={active}
                  className={`ctl min-h-[40px] px-3 border text-[13px] transition-colors duration-150 ${
                    active ? 'border-ink bg-ink text-paper' : 'border-ink/25 hover:border-ink'
                  }`}
                >
                  {lang === 'bm' ? o.bm : o.en}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div className="py-3">
        <span className="text-[12px] uppercase tracking-[0.14em] text-inksoft">
          {lang === 'bm' ? 'Disertakan' : 'Included'}
        </span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(lang === 'bm' ? p.includedBm : p.includedEn).map((inc) => (
            <span
              key={inc}
              className="ctl min-h-[40px] px-3 inline-flex items-center gap-2 border border-ink/15 bg-paper2 text-[13px] text-inksoft"
            >
              {inc}
              <span className="text-[10px] uppercase tracking-[0.12em] text-copperhot">
                {t('included', lang)}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
