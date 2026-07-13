import { useI18n } from '../lib/i18n/context';
import { LANGS } from '../lib/i18n/types';

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-white/20 bg-white/10 p-0.5">
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
                ? 'bg-gold-500 text-navy-950'
                : 'text-white/60 hover:bg-white/10 hover:text-white',
            ].join(' ')}
          >
            {l.short}
          </button>
        );
      })}
    </div>
  );
}
