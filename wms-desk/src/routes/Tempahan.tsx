import { Link, useParams } from 'react-router-dom'
import { useLang } from '../store/useLang'
import { useHolds } from '../store/useHolds'
import { useDesk } from '../store/useDesk'
import { useBenang } from '../store/useBenang'
import { computeQuote } from '../lib/quote'
import { t } from '../lib/i18n'
import { longDate, rm } from '../lib/format'
import { getPackage } from '../lib/packages'
import { COORDINATORS, VENUE } from '../lib/venue'
import { buildBrief, waLink } from '../lib/whatsapp'
import { validateReferral } from '../lib/referral'
import { Undangan } from '../components/Stage'
import { HoldCountdown } from '../components/DeskControls'
import { ShareRow } from '../components/ShareRow'
import { useCopy, useNow } from '../hooks'
import { MintBenang } from '../components/MintBenang'

export function Tempahan() {
  const { ref: refParam } = useParams()
  const { lang } = useLang()
  const holds = useHolds()
  const desk = useDesk()
  const benang = useBenang()
  const now = useNow(30_000)
  const [copied, copy] = useCopy()

  const hold = refParam ? holds.byRef(refParam) : undefined

  if (!hold) {
    return (
      <div className="mx-auto max-w-[720px] px-4 sm:px-6 py-16">
        <h1 className="display text-[28px]">
          {lang === 'bm' ? 'Tempahan tidak dijumpai' : 'Booking not found'}
        </h1>
        <p className="mt-2 text-[14px] text-inksoft">
          {lang === 'bm'
            ? 'Rujukan ini tiada dalam pelayar ini. Hubungi kakitangan untuk semakan.'
            : 'That reference is not in this browser. Ask staff to check it for you.'}
        </p>
        <Link to="/" className="mt-4 inline-block ctl bg-ink text-paper px-4 min-h-[44px] leading-[44px]">
          {t('back', lang)}
        </Link>
      </div>
    )
  }

  const expired =
    hold.status === 'expired' ||
    (hold.status === 'held' && now - hold.createdAt > VENUE.holdHours * 3_600_000)
  const p = getPackage(hold.pkg)
  const refCheck = validateReferral(hold.referralCode, { directory: benang.directory })
  const quote = computeQuote({
    pkg: hold.pkg,
    pax: hold.pax,
    referralApplied: refCheck.ok && refCheck.appliesCash,
  })

  const brief = buildBrief({
    ref: hold.ref,
    date: hold.date,
    pkg: hold.pkg,
    pax: hold.pax,
    dishes: desk.dishes,
    names: desk.names,
    phone: desk.phone,
    notes: desk.notes,
    benangCode: refCheck.ok ? refCheck.code : undefined,
    benangName: refCheck.ok ? refCheck.name : undefined,
    plannerNote: refCheck.kind === 'planner',
    quote,
    lang,
  })

  return (
    <div className="mx-auto max-w-[1080px] px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="display text-[clamp(26px,4vw,38px)] leading-tight">
          {expired ? t('expired', lang) : t('holdMade', lang)}
        </h1>
        {!expired && <HoldCountdown createdAt={hold.createdAt} now={now} />}
      </div>

      <p className="mt-1 text-[13px] text-inksoft">
        {t('holdRef', lang)}: <span className="tnum text-ink">{hold.ref}</span>
      </p>

      <div className="mt-6 grid lg:grid-cols-[minmax(0,280px)_1fr] gap-8 items-start">
        <div className="max-lg:max-w-[280px]">
          <Undangan names={desk.names} date={hold.date} pkg={hold.pkg} />
        </div>

        <div className="grid gap-6">
          <div className="sheet p-5">
            <dl className="grid gap-2 text-[13.5px]">
              <Line k={t('stepDate', lang)} v={longDate(hold.date, lang)} />
              <Line k={t('stepPkg', lang)} v={lang === 'bm' ? p.nameBm : p.nameEn} />
              <Line k={t('stepPax', lang)} v={`${hold.pax} · ${quote.tablesEst} ${lang === 'bm' ? 'meja' : 'tables'}`} />
              <Line
                k={t('priceFrame', lang)}
                v={`${rm(quote.unit, lang)} × ${hold.pax} = ${rm(quote.semasaTotal, lang)}`}
              />
              {quote.refDisc > 0 && (
                <Line k={t('benangLine', lang)} v={`− ${rm(quote.refDisc, lang)}`} />
              )}
              <Line k={t('totalLabel', lang)} v={rm(quote.total, lang)} strong />
            </dl>
            <p className="mt-3 text-[11.5px] text-inksoft">{t('subjectToChange', lang)}</p>
          </div>

          {expired ? (
            <div className="ctl border border-hold/40 bg-hold/[0.06] p-4">
              <p className="text-[13.5px]">
                {lang === 'bm'
                  ? 'Tahanan 48 jam sudah tamat dan tarikh dibuka semula.'
                  : 'The 48-hour hold has lapsed and the date has reopened.'}
              </p>
              <Link
                to="/"
                className="mt-3 inline-block ctl bg-ink text-paper px-4 min-h-[44px] leading-[44px] text-[14px]"
              >
                {lang === 'bm' ? 'Tahan tarikh semula' : 'Hold a date again'}
              </Link>
            </div>
          ) : (
            <div>
              <div className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
                {lang === 'bm' ? 'Hantar kepada kakitangan' : 'Send to staff'}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {COORDINATORS.map((c) => (
                  <a
                    key={c.wa}
                    href={waLink(c.wa, brief)}
                    target="_blank"
                    rel="noreferrer"
                    className="ctl min-h-[46px] px-4 inline-flex items-center bg-ink text-paper text-[13.5px] hover:bg-black transition-colors duration-150"
                  >
                    {t('waStaff', lang, { name: c.name.split(' ').slice(-1)[0] })}
                  </a>
                ))}
                <button
                  onClick={() => copy(brief)}
                  className="ctl min-h-[46px] px-4 border border-ink/25 hover:border-ink text-[13.5px] transition-colors duration-150"
                >
                  {copied ? t('copied', lang) : t('copyBrief', lang)}
                </button>
              </div>
              <div className="mt-2">
                <ShareRow />
              </div>
              <p className="mt-3 text-[12.5px] text-inksoft">{t('timeline', lang)}</p>
            </div>
          )}

          <div className="sheet p-5">
            <MintBenang holdRef={hold.ref} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Line({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-1.5">
      <dt className="text-inksoft">{k}</dt>
      <dd className={`tnum text-right ${strong ? 'display text-[20px]' : ''}`}>{v}</dd>
    </div>
  )
}
