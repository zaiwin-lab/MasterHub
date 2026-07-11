import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { DICTS } from './dict';
import type { Dict, Lang } from './types';

const STORAGE_KEY = 'sbf-bizfund2-lang';

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}

const I18nContext = createContext<I18nValue | null>(null);

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'en' || saved === 'ms' || saved === 'zh' || saved === 'ib') return saved;
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'zh' ? 'zh' : lang === 'ms' ? 'ms' : lang === 'ib' ? 'ms' : 'en';
  }, [lang]);

  const value: I18nValue = { lang, setLang: setLangState, t: DICTS[lang] };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
