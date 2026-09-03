import { Link } from 'react-router-dom'
import { useLang } from '../store/useLang'
import { useDesk } from '../store/useDesk'
import { t } from '../lib/i18n'
import { FACILITIES_BM, FACILITIES_EN, VENUE } from '../lib/venue'
import { HallStill } from '../components/HallStill'
import { HallSchematic } from '../components/Stage'
import { computeQuote } from '../lib/quote'

export function Dewan() {
  const { lang } = useLang()
  const desk = useDesk()
  const q = computeQuote({ pkg: desk.pkg, pax: desk.pax })

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-8">
      <h1 className="display text-[clamp(28px,4.6vw,44px)] leading-tight">{VENUE.hall}</h1>
      <p className="mt-2 text-[15px] text-inksoft max-w-[42rem]">
        {lang === 'bm'
          ? `${VENUE.building} — mercu tanda baharu berinspirasikan tengkolok di Petra Jaya. 500 hingga 2,000 tetamu.`
          : `${VENUE.building} — the new tengkolok-inspired landmark in Petra Jaya. 500 to 2,000 guests.`}
      </p>

      <div className="mt-7 grid lg:grid-cols-2 gap-8 items-start">
        <HallStill />

        <div className="grid gap-6">
          <p className="display text-[19px] leading-snug">{t('exclusive', lang)}</p>

          <div className="sheet p-5">
            <div className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
              {lang === 'bm' ? 'Susun atur' : 'Layout'}
            </div>
            <div className="mt-2">
              <HallSchematic pax={q.pax} led={q.ledIncluded} />
            </div>
          </div>

          <div>
            <div className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
              {t('facilities', lang)}
            </div>
            <ul className="mt-2 border-t border-ink/12 grid sm:grid-cols-2 gap-x-6 text-[14px]">
              {(lang === 'bm' ? FACILITIES_BM : FACILITIES_EN).map((f) => (
                <li key={f} className="py-2 border-b border-ink/12">
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-[13.5px]">
            <p className="text-inksoft">{VENUE.address}</p>
            <a href={VENUE.maps} target="_blank" rel="noreferrer" className="mt-1 inline-block underline-copper">
              {lang === 'bm' ? 'Buka dalam Google Maps' : 'Open in Google Maps'}
            </a>
          </div>

          <Link
            to="/"
            className="ctl bg-ink text-paper px-5 min-h-[52px] inline-flex items-center justify-center text-[15px] hover:bg-black transition-colors duration-150"
          >
            {t('holdCta', lang)}
          </Link>
        </div>
      </div>
    </div>
  )
}
