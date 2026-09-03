import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../store/useLang'
import { useDesk, canHold, isValidMyPhone } from '../store/useDesk'
import { useHolds } from '../store/useHolds'
import { useBenang } from '../store/useBenang'
import { useDeskQuote } from '../store/useDeskQuote'
import { t } from '../lib/i18n'
import { anonymise } from '../lib/referral'
import { nearestOpen } from './DeskControls'
import { shortDate } from '../lib/format'

export function HoldButton({ compact }: { compact?: boolean }) {
  const { lang } = useLang()
  const desk = useDesk()
  const holds = useHolds()
  const benang = useBenang()
  const { ref } = useDeskQuote()
  const nav = useNavigate()
  const [busy, setBusy] = useState(false)
  const [taken, setTaken] = useState<string[] | null>(null)

  const ready = canHold(desk)
  const why = !desk.date
    ? t('holdNeedDate', lang)
    : !desk.names.trim() || !isValidMyPhone(desk.phone)
      ? t('holdNeedName', lang)
      : null

  const submit = () => {
    if (!ready || busy) return
    setBusy(true)
    setTaken(null)

    const res = holds.create({
      date: desk.date,
      pkg: desk.pkg,
      pax: desk.pax,
      referralCode: ref.ok ? ref.code : undefined,
    })

    if (!res.ok || !res.hold) {
      // Somebody took the date between load and submit. Never a dead end —
      // hand back three open dates, weekends first.
      setTaken(nearestOpen(desk.date, holds.statusOf, 3))
      setBusy(false)
      return
    }

    if (ref.ok && ref.code) {
      benang.log(ref.code, 'hold', {
        holdRef: res.hold.ref,
        who: anonymise(desk.names || 'Pengantin'),
      })
    }
    desk.setRef(res.hold.ref)

    // A short confirmation, not a two-second film.
    window.setTimeout(() => {
      setBusy(false)
      nav(`/tempahan/${res.hold!.ref}`)
    }, 400)
  }

  return (
    <div className={compact ? '' : 'mt-1'}>
      <button
        onClick={submit}
        disabled={!ready || busy}
        className={`w-full ctl min-h-[52px] px-4 text-[15px] transition-colors duration-150 ${
          ready
            ? 'bg-ink text-paper hover:bg-black'
            : 'bg-ink/10 text-inksoft cursor-not-allowed'
        }`}
      >
        {busy ? (lang === 'bm' ? 'Menahan tarikh…' : 'Holding the date…') : t('holdCta', lang)}
      </button>

      <p className="mt-2 text-[12px] text-inksoft">{why ?? t('holdHelp', lang)}</p>

      {taken && (
        <div className="mt-3 ctl border border-hold/40 bg-hold/[0.06] p-3 rise">
          <div className="text-[13px]">{t('dateTaken', lang)}</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {taken.map((iso) => (
              <button
                key={iso}
                onClick={() => {
                  desk.setDate(iso)
                  setTaken(null)
                }}
                className="ctl min-h-[40px] px-3 border border-ink/30 hover:border-ink text-[13px] tnum transition-colors duration-150"
              >
                {shortDate(iso, lang)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
