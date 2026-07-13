import { useI18n } from '../lib/i18n/context';

export default function Footer() {
  const { t } = useI18n();
  // Render the credit line with "KOBIS" linked to the company site.
  const [before, after] = t.footer.line2.split('KOBIS');
  return (
    <footer className="panel-dark no-print border-t border-white/10 py-10">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <p className="text-sm font-semibold text-white/90">{t.footer.line1}</p>
        <p className="mt-1 text-xs text-white/50">
          {before}
          <a
            href="https://www.kobisberhad.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white/70 underline decoration-white/30 underline-offset-2 transition hover:text-white"
          >
            KOBIS
          </a>
          {after}
        </p>
      </div>
    </footer>
  );
}
