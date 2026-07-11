import { useI18n } from '../lib/i18n/context';
import { LANGS } from '../lib/i18n/types';

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-navy-200 bg-white p-0.5">
      {LANGS.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            title={l.name}
            aria-pressed={active}
            className={[
              'rounded-full px-2.5 py-1 text-xs font-bold transition',
              active
                ? 'bg-navy-800 text-white'
                : 'text-ink/55 hover:bg-navy-50 hover:text-navy-800',
            ].join(' ')}
          >
            {l.short}
          </button>
        );
      })}
    </div>
  );
}
