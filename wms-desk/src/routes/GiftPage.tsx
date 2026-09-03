import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLang } from '../store/useLang'
import { useBenang } from '../store/useBenang'
import { useDesk } from '../store/useDesk'
import { t } from '../lib/i18n'
import { rm } from '../lib/format'
import { REFERRAL_CAP, REFERRAL_RATE } from '../lib/quote'
import { VENUE } from '../lib/venue'
import { HallStill } from '../components/HallStill'

/** One screen, paper, no dashboard chrome. This is what WhatsApp opens. */
export function GiftPage() {
  const { kod } = useParams()
  const { lang } = useLang()
  const benang = useBenang()
  const desk = useDesk()

  const code = (kod ?? '').toUpperCase()
  const amb = benang.find(code)

  useEffect(() => {
    if (amb) {
      desk.setField('benang', amb.code)
      benang.log(amb.code, 'view')
    }
    // Opening the gift page is the view event; it fires once on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amb?.code])

  if (!amb) {
    return (
      <div className="mx-auto max-w-[640px] px-4 sm:px-6 py-16">
        <h1 className="display text-[26px]">{t('benangInvalid', lang)}</h1>
        <p className="mt-2 text-[14px] text-inksoft">
          {lang === 'bm'
            ? 'Pautan ini mungkin tersalah taip. Anda masih boleh tempah dewan seperti biasa.'
            : 'That link may be mistyped. You can still book the hall as usual.'}
        </p>
        <Link
          to="/"
          className="mt-4 inline-block ctl bg-ink text-paper px-4 min-h-[44px] leading-[44px]"
        >
          {t('navTempah', lang)}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[760px] px-4 sm:px-6 py-10 sm:py-14">
      <div className="text-[11px] uppercase tracking-[0.22em] text-copperhot">
        {t('benangTitle', lang)}
      </div>

      <h1 className="mt-3 display text-[clamp(26px,5vw,42px)] leading-[1.12]">
        <span className="italic">{amb.name}</span>{' '}
        {lang === 'bm'
          ? `menjemput anda tempah ${VENUE.hall}.`
          : `invites you to book ${VENUE.hall}.`}
      </h1>

      <hr className="rule-copper my-6 w-20" />

      <p className="text-[15px] max-w-[38rem]">
        {lang === 'bm'
          ? `Guna kod ini dan anda dapat potongan tambahan ${
              REFERRAL_RATE * 100
            }% daripada harga pakej semasa, had ${rm(REFERRAL_CAP, lang)}.`
          : `Use this code and you take an additional ${
              REFERRAL_RATE * 100
            }% off the current package price, capped at ${rm(REFERRAL_CAP, lang)}.`}
      </p>

      <div className="mt-4 inline-flex items-baseline gap-3 ctl border border-ink/25 px-4 py-2.5">
        <span className="text-[12px] text-inksoft">{lang === 'bm' ? 'Kod' : 'Code'}</span>
        <span className="tnum display text-[24px]">{amb.code}</span>
      </div>

      <div className="mt-7 max-w-[420px]">
        <HallStill />
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        <Link
          to={`/tempah?benang=${amb.code}`}
          className="ctl bg-ink text-paper px-5 min-h-[52px] inline-flex items-center text-[15px] hover:bg-black transition-colors duration-150"
        >
          {lang === 'bm' ? 'Buka desk tempahan' : 'Open the booking desk'}
        </Link>
        <Link
          to="/pakej"
          className="ctl border border-ink/25 px-5 min-h-[52px] inline-flex items-center text-[15px] hover:border-ink transition-colors duration-150"
        >
          {t('seePackages', lang)}
        </Link>
      </div>

      <p className="mt-6 text-[12.5px] text-inksoft max-w-[38rem]">
        {VENUE.hall}, Petra Jaya, Kuching. 500–2,000 {t('guests', lang)}.{' '}
        {t('exclusive', lang)} {t('subjectToChange', lang)}
      </p>
    </div>
  )
}
