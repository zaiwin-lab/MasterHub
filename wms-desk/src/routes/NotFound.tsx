import { Link } from 'react-router-dom'
import { useLang } from '../store/useLang'
import { t } from '../lib/i18n'

export function NotFound() {
  const { lang } = useLang()
  return (
    <div className="mx-auto max-w-[640px] px-4 sm:px-6 py-16">
      <h1 className="display text-[28px]">
        {lang === 'bm' ? 'Halaman tidak dijumpai' : 'Page not found'}
      </h1>
      <p className="mt-2 text-[14px] text-inksoft">
        {lang === 'bm'
          ? 'Pautan itu tiada di sini. Desk tempahan sentiasa terbuka.'
          : 'That link is not here. The booking desk is always open.'}
      </p>
      <Link to="/" className="mt-4 inline-block ctl bg-ink text-paper px-4 min-h-[44px] leading-[44px]">
        {t('navTempah', lang)}
      </Link>
    </div>
  )
}
