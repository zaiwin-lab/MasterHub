import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLang } from '../store/useLang'
import { useDesk } from '../store/useDesk'
import { t } from '../lib/i18n'
import { num, rm } from '../lib/format'
import { PACKAGES, getPackage, isPackageId } from '../lib/packages'
import { FACILITIES_BM, FACILITIES_EN, VENUE } from '../lib/venue'
import { clampPax, computeQuote } from '../lib/quote'
import { NotFound } from './NotFound'

export function Pakej() {
  const { lang } = useLang()
  const [pax, setPax] = useState(500)
  const desk = useDesk()
  const nav = useNavigate()

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="display text-[clamp(28px,4.6vw,44px)] leading-tight">{t('navPakej', lang)}</h1>
        <span className="ctl border border-copper px-2 py-0.5 text-[11px] text-copperhot">
          {t('currentBadge', lang)}
        </span>
      </div>
      <p className="mt-2 text-[15px] text-inksoft max-w-[42rem]">{t('priceFrame', lang)}.</p>

      <div className="mt-6 sheet p-5 max-w-[46rem]">
        <div className="flex items-end gap-3">
          <div className="tnum display text-[clamp(40px,8vw,64px)] leading-none">
            {num(pax, lang)}
          </div>
          <div className="pb-2 text-[13px] text-inksoft">{t('guests', lang)}</div>
        </div>
        <label className="sr-only" htmlFor="pakej-pax">
          {t('stepPax', lang)}
        </label>
        <input
          id="pakej-pax"
          type="range"
          min={VENUE.minPax}
          max={VENUE.maxPax}
          step={10}
          value={pax}
          onChange={(e) => setPax(clampPax(Number(e.target.value)))}
        />
        <div className="flex justify-between text-[11px] tnum text-inksoft">
          <span>500</span>
          <span>2,000</span>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {PACKAGES.map((p) => {
          const q = computeQuote({ pkg: p.id, pax })
          return (
            <div key={p.id} className="sheet p-5 flex flex-col">
              <div className="text-[11px] uppercase tracking-[0.16em] text-inksoft">
                {lang === 'bm' ? p.roleBm : p.roleEn}
              </div>
              <h2 className="mt-1 display text-[21px]">{lang === 'bm' ? p.nameBm : p.nameEn}</h2>
              <p className="mt-1.5 text-[13px] text-inksoft">
                {lang === 'bm' ? p.blurbBm : p.blurbEn}
              </p>

              <hr className="rule my-4" />

              <div className="flex items-baseline gap-2">
                <span className="tnum display text-[30px] leading-none">{rm(p.current, lang)}</span>
                <span className="tnum text-[13px] text-inksoft line-through">{rm(p.usual, lang)}</span>
                <span className="text-[12px] text-inksoft">/ {t('perPax', lang)}</span>
              </div>

              <div className="mt-3 text-[13px] tnum">
                <span className="text-inksoft">
                  {rm(p.current, lang)} × {num(pax, lang)} ={' '}
                </span>
                <span className="display text-[20px]">{rm(q.semasaTotal, lang)}</span>
              </div>
              <div className="mt-1 text-[12px] text-inksoft tnum">
                {t('tablesEst', lang, { n: q.tablesEst })} ·{' '}
                {q.ledIncluded ? t('ledYes', lang) : t('ledNo', lang)}
              </div>

              <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
                <button
                  onClick={() => {
                    desk.setPkg(p.id)
                    desk.setPax(pax)
                    nav('/')
                  }}
                  className="ctl bg-ink text-paper px-3 min-h-[44px] text-[13px] hover:bg-black transition-colors duration-150"
                >
                  {lang === 'bm' ? 'Guna pakej ini' : 'Use this package'}
                </button>
                <Link
                  to={`/pakej/${p.id}`}
                  className="ctl border border-ink/25 px-3 min-h-[44px] inline-flex items-center text-[13px] hover:border-ink transition-colors duration-150"
                >
                  {lang === 'bm' ? 'Menu penuh' : 'Full menu'}
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-5 text-[13px] text-inksoft max-w-[46rem]">{t('futureSlot', lang)}</p>
      <p className="mt-1 text-[12.5px] text-inksoft">{t('subjectToChange', lang)}</p>
    </div>
  )
}

export function PakejDetail() {
  const { slug } = useParams()
  const { lang } = useLang()
  const desk = useDesk()
  const nav = useNavigate()

  if (!isPackageId(slug)) return <NotFound />
  const p = getPackage(slug)

  return (
    <div className="mx-auto max-w-[980px] px-4 sm:px-6 py-8">
      <Link to="/pakej" className="text-[13px] underline-copper">
        {t('navPakej', lang)}
      </Link>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="display text-[clamp(26px,4.4vw,40px)] leading-tight">
          {lang === 'bm' ? p.nameBm : p.nameEn}
        </h1>
        <span className="tnum text-[15px]">
          {rm(p.current, lang)}{' '}
          <span className="text-inksoft line-through">{rm(p.usual, lang)}</span>{' '}
          <span className="text-inksoft">/ {t('perPax', lang)}</span>
        </span>
      </div>
      <p className="mt-2 text-[14.5px] text-inksoft max-w-[42rem]">
        {lang === 'bm' ? p.blurbBm : p.blurbEn}
      </p>

      <div className="mt-7 grid md:grid-cols-2 gap-8">
        <div>
          <div className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
            {lang === 'bm' ? 'Papan menu' : 'Menu board'}
          </div>
          <div className="mt-2 border-t border-ink/12">
            {p.courses.map((c) => (
              <div key={c.id} className="py-3 border-b border-ink/12">
                <div className="text-[12px] text-inksoft">
                  {lang === 'bm' ? c.labelBm : c.labelEn}
                  <span className="ml-2 text-[11px] text-copperhot">
                    {lang === 'bm' ? 'pilih satu' : 'pick one'}
                  </span>
                </div>
                <div className="mt-1 text-[14px]">
                  {c.options.map((o) => (lang === 'bm' ? o.bm : o.en)).join(' · ')}
                </div>
              </div>
            ))}
            <div className="py-3">
              <div className="text-[12px] text-inksoft">{t('included', lang)}</div>
              <div className="mt-1 text-[14px]">
                {(lang === 'bm' ? p.includedBm : p.includedEn).join(' · ')}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
            {t('facilities', lang)}
          </div>
          <ul className="mt-2 border-t border-ink/12 text-[14px]">
            {(lang === 'bm' ? FACILITIES_BM : FACILITIES_EN).map((f) => (
              <li key={f} className="py-2 border-b border-ink/12">
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={() => {
              desk.setPkg(p.id)
              nav('/')
            }}
            className="mt-5 w-full ctl bg-ink text-paper min-h-[52px] text-[15px] hover:bg-black transition-colors duration-150"
          >
            {lang === 'bm' ? 'Buka desk dengan pakej ini' : 'Open the desk with this package'}
          </button>
          <p className="mt-2 text-[12px] text-inksoft">{t('subjectToChange', lang)}</p>
        </div>
      </div>
    </div>
  )
}
