import { Link } from 'react-router-dom'
import { useLang } from '../store/useLang'
import { useDesk } from '../store/useDesk'
import { useBenang } from '../store/useBenang'
import { t } from '../lib/i18n'
import { REFERRAL_CAP, REFERRAL_RATE } from '../lib/quote'
import { rm } from '../lib/format'

/** After a hold, the couple can open their own thread. */
export function MintBenang({ holdRef }: { holdRef?: string }) {
  const { lang } = useLang()
  const desk = useDesk()
  const benang = useBenang()
  const mine = benang.mine

  if (mine) {
    return (
      <div>
        <div className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
          {t('benangTitle', lang)}
        </div>
        <p className="mt-2 text-[14px]">
          {lang === 'bm' ? 'Kod anda' : 'Your code'}:{' '}
          <span className="tnum display text-[20px]">{mine.code}</span>
        </p>
        <Link
          to={`/benang?kod=${mine.code}`}
          className="mt-3 inline-block ctl bg-ink text-paper px-4 min-h-[44px] leading-[44px] text-[14px]"
        >
          {t('openBenang', lang)}
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
        {t('benangTitle', lang)}
      </div>
      <p className="mt-2 text-[14px] max-w-[38rem]">
        {lang === 'bm'
          ? `Kongsi rezeki. Kawan anda dapat potongan ${REFERRAL_RATE * 100}% (had ${rm(
              REFERRAL_CAP,
              lang,
            )}). Anda kumpul kredit setiap kali satu majlis disahkan.`
          : `Share the good fortune. Your friends get ${REFERRAL_RATE * 100}% off (capped at ${rm(
              REFERRAL_CAP,
              lang,
            )}). You collect credit each time one is confirmed.`}
      </p>
      <button
        onClick={() => {
          const amb = benang.mint(desk.names.trim() || 'Pengantin', desk.phone)
          if (holdRef) benang.log(amb.code, 'view')
        }}
        disabled={!desk.names.trim()}
        className="mt-3 ctl bg-ink text-paper px-4 min-h-[44px] text-[14px] disabled:bg-ink/10 disabled:text-inksoft hover:bg-black transition-colors duration-150"
      >
        {t('mintCta', lang)}
      </button>
      {!desk.names.trim() && (
        <p className="mt-1.5 text-[12px] text-inksoft">
          {lang === 'bm' ? 'Isi nama pengantin dahulu.' : 'Add the couple names first.'}
        </p>
      )}
    </div>
  )
}
