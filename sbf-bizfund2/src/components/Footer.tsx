import { useI18n } from '../lib/i18n/context';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="no-print border-t border-navy-100 bg-navy-900 py-8">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <p className="text-sm font-semibold text-white/90">{t.footer.line1}</p>
        <p className="mt-1 text-xs text-white/50">{t.footer.line2}</p>
      </div>
    </footer>
  );
}
