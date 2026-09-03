import { Link } from 'react-router-dom'
import { useLang } from '../store/useLang'
import { useDesk } from '../store/useDesk'
import { useDeskQuote } from '../store/useDeskQuote'
import { useDeepLink } from '../store/useDeepLink'
import { t } from '../lib/i18n'
import { rm } from '../lib/format'
import { DatePicker, PaxDial, PackageRows, QuoteWaterfall, SectionLabel } from '../components/DeskControls'
import { ContactFields, BenangField } from '../components/ContactFields'
import { HoldButton } from '../components/HoldButton'
import { HallSchematic, MenuTasting, Undangan } from '../components/Stage'
import { ResumeToast } from '../components/ResumeToast'
import { ShareRow } from '../components/ShareRow'

export function Tempah() {
  const { lang } = useLang()
  const desk = useDesk()
  const { quote, ref } = useDeskQuote()
  const { cfgLoaded } = useDeepLink()

  return (
    <>
      <ResumeToast cfgLoaded={cfgLoaded} />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 pb-24 lg:pb-10">
        <div className="pt-7 pb-5 flex items-baseline justify-between gap-4 flex-wrap">
          <h1 className="display text-[clamp(24px,3.6vw,34px)] leading-tight">
            {lang === 'bm' ? 'Papan tempahan penuh' : 'The full booking board'}
          </h1>
          <Link to="/" className="text-[13px] underline-copper">
            {lang === 'bm' ? 'Desk ringkas' : 'Quick desk'}
          </Link>
        </div>

        <div className="grid lg:grid-cols-[42fr_58fr] gap-8 lg:gap-10">
          {/* --------------------------------------------------- Sheet */}
          <div className="order-2 lg:order-1">
            <div className="sheet p-5 sm:p-6 grid gap-6">
              <DatePicker />
              <hr className="rule" />
              <PaxDial quote={quote} />
              <hr className="rule" />
              <PackageRows />
              <hr className="rule" />

              <section>
                <SectionLabel n={4}>{lang === 'bm' ? 'Menu' : 'Menu'}</SectionLabel>
                <div className="mt-1">
                  <MenuTasting />
                </div>
              </section>

              <hr className="rule" />

              <section>
                <SectionLabel n={5}>{t('stepContact', lang)}</SectionLabel>
                <div className="mt-3 grid gap-3">
                  <ContactFields withNotes />
                  <BenangField check={ref} />
                </div>
              </section>
            </div>
          </div>

          {/* --------------------------------------------------- Stage */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-[72px] grid gap-6">
              <div className="grid sm:grid-cols-[minmax(0,220px)_1fr] gap-5 items-start">
                <div className="max-sm:max-w-[240px]">
                  <Undangan names={desk.names} date={desk.date} pkg={desk.pkg} />
                </div>
                <div className="sheet p-4 sm:p-5">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
                    {lang === 'bm' ? 'Susun atur dewan' : 'Hall layout'}
                  </div>
                  <div className="mt-2">
                    <HallSchematic pax={quote.pax} led={quote.ledIncluded} />
                  </div>
                </div>
              </div>

              <div className="sheet p-5">
                <QuoteWaterfall quote={quote} benangName={ref.ok ? ref.name : undefined} />
                <hr className="rule my-4" />
                <div className="hidden lg:block">
                  <HoldButton />
                </div>
                <div className="mt-3">
                  <ShareRow />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: total + hold pinned. */}
      <div className="lg:hidden sticky bottom-0 z-30 bg-paper border-t border-ink/15 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <div className="tnum display text-[20px] leading-none">{rm(quote.total, lang)}</div>
            <div className="text-[11px] text-inksoft tnum truncate">
              {quote.pax} {t('guests', lang)} · {quote.tablesEst} {lang === 'bm' ? 'meja' : 'tables'}
            </div>
          </div>
          <div className="ml-auto w-[52%] shrink-0">
            <HoldButton compact />
          </div>
        </div>
      </div>
    </>
  )
}
