import { useEffect, useState } from 'react'
import { useLang } from '../store/useLang'
import { useDesk } from '../store/useDesk'
import { t } from '../lib/i18n'
import { shortDate } from '../lib/format'
import { getPackage } from '../lib/packages'

/** Designed states rather than alert(): resume a draft, or a loaded cfg link. */
export function ResumeToast({ cfgLoaded }: { cfgLoaded?: boolean }) {
  const { lang } = useLang()
  const desk = useDesk()
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // A draft older than a few minutes is worth offering back; a fresh one is
    // just the session the visitor is already in.
    const stale = desk.savedAt && Date.now() - desk.savedAt > 5 * 60_000
    if (desk.touched && desk.date && stale) setShow(true)
  }, [desk.touched, desk.date, desk.savedAt])

  if (cfgLoaded && !dismissed) {
    return (
      <Bar onClose={() => setDismissed(true)}>
        <span className="text-copperhot">{t('cfgLoaded', lang)}</span>
      </Bar>
    )
  }

  if (!show || dismissed) return null

  return (
    <Bar onClose={() => setDismissed(true)}>
      <span>
        {t('resumeDraft', lang, {
          d: shortDate(desk.date, lang),
          p: lang === 'bm' ? getPackage(desk.pkg).nameBm : getPackage(desk.pkg).nameEn,
        })}
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="ml-3 ctl border border-ink/25 px-2.5 min-h-[36px] text-[12.5px] hover:border-ink transition-colors duration-150"
      >
        {t('resumeYes', lang)}
      </button>
      <button
        onClick={() => {
          desk.reset()
          setDismissed(true)
        }}
        className="ml-1.5 text-[12.5px] text-inksoft hover:text-ink min-h-[36px] px-1"
      >
        {t('resumeNo', lang)}
      </button>
    </Bar>
  )
}

function Bar({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const { lang } = useLang()
  return (
    <div className="bg-paper2 border-b border-ink/12 rise">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-2 flex items-center text-[13px]">
        {children}
        <button
          onClick={onClose}
          className="ml-auto text-inksoft hover:text-ink min-h-[36px] px-2"
          aria-label={t('close', lang)}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
