import { Link } from 'react-router-dom'
import { useLang } from '../store/useLang'
import { useDesk } from '../store/useDesk'
import { useDeskQuote } from '../store/useDeskQuote'
import { useDeepLink } from '../store/useDeepLink'
import { useBenang } from '../store/useBenang'
import { t } from '../lib/i18n'
import { rm } from '../lib/format'
import { PACKAGES } from '../lib/packages'
import { COORDINATORS, VENUE } from '../lib/venue'
import { DatePicker, PaxDial, PackageRows, QuoteWaterfall, SectionLabel } from '../components/DeskControls'
import { ContactFields, BenangField } from '../components/ContactFields'
import { HoldButton } from '../components/HoldButton'
import { WeekStrip } from '../components/MonthGrid'
import { BenangTicker } from '../components/BenangBits'
import { HallStill } from '../components/HallStill'
import { ResumeToast } from '../components/ResumeToast'

export function Home() {
  const { lang } = useLang()
  const desk = useDesk()
  const { quote, ref } = useDeskQuote()
  const { cfgLoaded } = useDeepLink()
  const benang = useBenang()

  return (
    <>
      <ResumeToast cfgLoaded={cfgLoaded} />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        {/* Mobile keeps a title above the desk; desktop moves it into the
            context column so the desk itself owns the first screen. */}
        <div className="lg:hidden pt-6 pb-5">
          <h1 className="display text-[clamp(28px,7vw,38px)] leading-[1.08] tracking-tight">
            {t('heroTitle', lang)}
          </h1>
          <p className="mt-2 text-[14.5px] text-inksoft">{t('heroLead', lang)}</p>
        </div>

        <div className="grid lg:grid-cols-[46fr_54fr] gap-8 lg:gap-12 pt-0 lg:pt-5 pb-10">
          {/* ------------------------------------------------ Booking desk */}
          <div className="lg:sticky lg:top-[72px] lg:self-start">
            <div className="sheet p-5 grid gap-4">
              <DatePicker />
              <hr className="rule" />
              <PaxDial quote={quote} />
              <hr className="rule" />
              <PackageRows />
              <hr className="rule" />
              <QuoteWaterfall quote={quote} benangName={ref.ok ? ref.name : undefined} />
              <hr className="rule" />

              <section>
                <SectionLabel n={5}>{t('stepContact', lang)}</SectionLabel>
                <div className="mt-3 grid gap-3">
                  <ContactFields />
                  {(desk.benang || benang.mine) && <BenangField check={ref} />}
                </div>
              </section>

              <div>
                <HoldButton />
                <div className="mt-1 flex flex-wrap gap-x-4 text-[13px]">
                  <Link to="/tempah" className="inline-flex items-center min-h-[44px] underline-copper">
                    {t('completeMenu', lang)}
                  </Link>
                  <Link to="/pakej" className="inline-flex items-center min-h-[44px] text-inksoft hover:text-ink">
                    {t('seePackages', lang)}
                  </Link>
                  <Link to="/benang" className="inline-flex items-center min-h-[44px] text-inksoft hover:text-ink">
                    {t('openBenang', lang)}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------- Context */}
          <aside className="grid gap-7 content-start">
            <div className="hidden lg:block">
              <h1 className="display text-[clamp(30px,3.4vw,46px)] leading-[1.04] tracking-tight">
                {t('heroTitle', lang)}
              </h1>
              <p className="mt-3 text-[15px] text-inksoft max-w-[34rem]">{t('heroLead', lang)}</p>
            </div>

            <HallStill />

            <p className="display text-[19px] leading-snug max-w-[30rem]">{t('exclusive', lang)}</p>

            <div>
              <div className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
                {t('navPakej', lang)}
              </div>
              <div className="mt-2 border-t border-ink/12">
                {PACKAGES.map((p) => (
                  <Link
                    key={p.id}
                    to={`/pakej/${p.id}`}
                    className="flex items-baseline justify-between gap-4 py-2.5 border-b border-ink/12 hover:bg-paper2/50 transition-colors duration-150"
                  >
                    <span className="display text-[15px]">{lang === 'bm' ? p.nameBm : p.nameEn}</span>
                    <span className="tnum text-[13px] shrink-0">
                      {rm(p.current, lang)}{' '}
                      <span className="text-inksoft line-through">{rm(p.usual, lang)}</span>
                    </span>
                  </Link>
                ))}
              </div>
              <p className="mt-2 text-[12px] text-inksoft">{t('futureSlot', lang)}</p>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
                  {lang === 'bm' ? 'Sabtu terdekat' : 'Coming Saturdays'}
                </span>
                <Link
                  to="/kalendar"
                  className="inline-flex items-center min-h-[44px] text-[12px] underline-copper"
                >
                  {t('navKalendar', lang)}
                </Link>
              </div>
              <div className="mt-2">
                <WeekStrip />
              </div>
            </div>

            <BenangTicker />

            <div className="text-[13px] text-inksoft">
              <div className="text-ink">{VENUE.hall}</div>
              <p className="mt-1">{VENUE.address}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {COORDINATORS.map((c) => (
                  <a
                    key={c.wa}
                    href={`https://wa.me/${c.wa}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center min-h-[44px] text-ink underline-copper"
                  >
                    {c.name}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile: the hold stays reachable without scrolling back up. */}
      <MobileHoldBar />
    </>
  )
}

function MobileHoldBar() {
  const { lang } = useLang()
  const { quote } = useDeskQuote()
  const desk = useDesk()
  if (!desk.date) return null
  return (
    <div className="lg:hidden sticky bottom-0 z-30 bg-paper border-t border-ink/15 px-4 py-2.5">
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <div className="tnum display text-[20px] leading-none">{rm(quote.total, lang)}</div>
          <div className="text-[11px] text-inksoft tnum truncate">
            {quote.pax} {t('guests', lang)} · {t('priceFrame', lang)}
          </div>
        </div>
        <div className="ml-auto w-[52%] shrink-0">
          <HoldButton compact />
        </div>
      </div>
    </div>
  )
}
