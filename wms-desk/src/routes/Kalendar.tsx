import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../store/useLang'
import { useDesk } from '../store/useDesk'
import { useHolds } from '../store/useHolds'
import { t } from '../lib/i18n'
import { longDate, shortDate } from '../lib/format'
import { MonthGrid } from '../components/MonthGrid'
import { nearestOpen } from '../components/DeskControls'

export function Kalendar() {
  const { lang } = useLang()
  const desk = useDesk()
  const holds = useHolds()
  const nav = useNavigate()
  const [taken, setTaken] = useState<string | null>(null)

  const pick = (iso: string) => {
    if (holds.statusOf(iso) !== 'open') {
      setTaken(iso)
      return
    }
    desk.setDate(iso)
    nav('/')
  }

  return (
    <div className="mx-auto max-w-[1080px] px-4 sm:px-6 py-8">
      <h1 className="display text-[clamp(28px,4.6vw,44px)] leading-tight">{t('navKalendar', lang)}</h1>
      <p className="mt-2 text-[15px] text-inksoft max-w-[42rem]">
        {t('weekendNote', lang)}{' '}
        {lang === 'bm'
          ? 'Satu majlis sehari, jadi tarikh yang ditempah tidak dibuka semula.'
          : 'One event a day, so a booked date does not reopen.'}
      </p>

      {taken && (
        <div className="mt-5 ctl border border-hold/40 bg-hold/[0.06] p-4 rise max-w-[46rem]">
          <div className="text-[13.5px]">
            {t('dateTaken', lang)} — <span className="tnum">{longDate(taken, lang)}</span>
          </div>
          <div className="mt-2 text-[12px] text-inksoft">{t('nearestOpen', lang)}</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {nearestOpen(taken, holds.statusOf, 3).map((iso) => (
              <button
                key={iso}
                onClick={() => {
                  desk.setDate(iso)
                  nav('/')
                }}
                className="ctl min-h-[44px] px-3 border border-ink/30 hover:border-ink text-[13px] tnum transition-colors duration-150"
              >
                {shortDate(iso, lang)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 sheet p-5 max-w-[46rem]">
        <MonthGrid onPick={pick} selected={desk.date} months={2} />
      </div>
    </div>
  )
}
