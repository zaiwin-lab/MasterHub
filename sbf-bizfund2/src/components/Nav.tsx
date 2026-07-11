import { ClipboardCheck } from 'lucide-react';
import { useI18n } from '../lib/i18n/context';
import LanguageSwitcher from './LanguageSwitcher';

export default function Nav() {
  const { t } = useI18n();
  const links = [
    { href: '#assessment', label: t.nav.assessment },
    { href: '#framework', label: t.nav.framework },
    { href: '#report-preview', label: t.nav.reportPreview },
    { href: '#about', label: t.nav.about },
  ];

  return (
    <header className="no-print sticky top-0 z-40 border-b border-navy-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 text-white">
            <ClipboardCheck size={18} />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-tight text-navy-900">
              SBF BizFund2
            </span>
            <span className="block text-[11px] font-medium text-ink/50">{t.nav.brandSub}</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-ink/65 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-navy-800">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a href="#assessment" className="btn-primary hidden !px-4 !py-2 sm:inline-flex">
            {t.nav.start}
          </a>
        </div>
      </div>
    </header>
  );
}
