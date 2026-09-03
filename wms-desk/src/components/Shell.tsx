import { NavLink, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useLang } from '../store/useLang'
import { useDesk } from '../store/useDesk'
import { t } from '../lib/i18n'
import { rm, num } from '../lib/format'
import { computeQuote } from '../lib/quote'
import { COORDINATORS, VENUE } from '../lib/venue'
import { validateReferral } from '../lib/referral'

const NAV = [
  { to: '/', key: 'navHome' },
  { to: '/pakej', key: 'navPakej' },
  { to: '/dewan', key: 'navDewan' },
  { to: '/kalendar', key: 'navKalendar' },
  { to: '/benang', key: 'navBenang' },
  { to: '/hubungi', key: 'navHubungi' },
] as const

export function Header() {
  const { lang, toggle } = useLang()
  const desk = useDesk()
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => setOpen(false), [loc.pathname])

  const ref = validateReferral(desk.benang, { phone: desk.phone })
  const quote = computeQuote({
    pkg: desk.pkg,
    pax: desk.pax,
    referralApplied: ref.ok && ref.appliesCash,
  })
  const hasDraft = desk.touched && !!desk.date

  return (
    <header className="sticky top-0 z-40 bg-paper border-b border-ink/15">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="flex h-14 items-center gap-3">
          <Link to="/" className="display text-[19px] tracking-tight shrink-0 inline-flex items-center min-h-[44px]">
            WMS<span className="italic ml-[0.22em]">Desk</span>
          </Link>

          <nav className="ml-4 hidden lg:flex items-center gap-5 text-[13.5px]">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `py-1 transition-colors duration-150 ${
                    isActive ? 'text-ink underline-copper' : 'text-inksoft hover:text-ink'
                  }`
                }
              >
                {t(n.key, lang)}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggle}
              className="ctl border border-ink/25 px-2.5 h-11 text-[12.5px] tracking-wide text-inksoft hover:text-ink hover:border-ink/50 transition-colors duration-150"
              aria-label={lang === 'bm' ? 'Tukar ke English' : 'Switch to Bahasa Melayu'}
            >
              <span className={lang === 'bm' ? 'text-ink font-medium' : ''}>BM</span>
              <span className="mx-1 text-ink/30">/</span>
              <span className={lang === 'en' ? 'text-ink font-medium' : ''}>EN</span>
            </button>

            <Link
              to="/tempah"
              className="ctl bg-ink text-paper h-11 px-3.5 inline-flex items-center gap-2 text-[13px] hover:bg-black transition-colors duration-150"
            >
              {hasDraft ? (
                <span className="tnum">
                  {rm(quote.total, lang)} · {num(quote.pax, lang)}
                </span>
              ) : (
                t('navTempah', lang)
              )}
            </Link>

            <button
              className="lg:hidden ctl border border-ink/25 h-11 w-11 grid place-items-center"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={t(open ? 'close' : 'menu', lang)}
            >
              <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
                <path
                  d={open ? 'M2 2l12 8M14 2L2 10' : 'M0 1h16M0 6h16M0 11h16'}
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="none"
                />
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden pb-3 grid grid-cols-2 gap-x-4 gap-y-1 rise">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `py-2.5 text-[14px] ${isActive ? 'text-ink' : 'text-inksoft'}`
                }
              >
                {t(n.key, lang)}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

export function Footer() {
  const { lang } = useLang()
  return (
    <footer className="mt-16 border-t border-ink/15">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3 text-[13px]">
        <div>
          <div className="display text-[17px]">{VENUE.hall}</div>
          <p className="mt-2 text-inksoft leading-relaxed">{VENUE.address}</p>
          <a
            href={VENUE.maps}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center min-h-[44px] underline-copper text-ink"
          >
            {lang === 'bm' ? 'Buka peta' : 'Open map'}
          </a>
        </div>
        <div>
          <div className="text-inksoft">{lang === 'bm' ? 'Penyelaras' : 'Coordinators'}</div>
          <ul className="mt-2 space-y-1.5">
            {COORDINATORS.map((c) => (
              <li key={c.wa}>
                <a href={`https://wa.me/${c.wa}`} target="_blank" rel="noreferrer" className="inline-flex items-center min-h-[44px] text-ink">
                  {c.name} <span className="tnum text-inksoft">· {c.phone}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-inksoft tnum">
            {VENUE.officePhone} · {VENUE.officeMobile}
          </div>
          <a href={`mailto:${VENUE.bookingEmail}`} className="inline-flex items-center min-h-[44px] text-ink break-all">
            {VENUE.bookingEmail}
          </a>
        </div>
        <div>
          <div className="text-inksoft">{VENUE.org}</div>
          <a href={VENUE.site} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center min-h-[44px] text-ink">
            melayusarawak.org.my
          </a>
          <p className="mt-3 text-inksoft">{t('subjectToChange', lang)}</p>
          <p className="mt-1 text-inksoft">
            {lang === 'bm'
              ? 'Deposit diuruskan oleh kakitangan di WhatsApp.'
              : 'Deposits are arranged by staff on WhatsApp.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
