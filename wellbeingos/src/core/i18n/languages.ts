/**
 * LAYER A — Localisation.
 *
 * Four languages ship because the audience is a Sarawak state agency: English
 * and Bahasa Malaysia are the working languages, Chinese is widely read in the
 * commercial sector, and Iban is the largest indigenous language in the state.
 *
 * A missing key falls back to English rather than rendering the key itself, so
 * a partially translated deployment degrades to readable copy instead of
 * developer strings. That fallback is the contract: translation can be
 * completed incrementally without ever breaking a page.
 */
export type LanguageKey = 'en' | 'ms' | 'zh' | 'iba';

export interface LanguageMeta {
  key: LanguageKey;
  /** Endonym — a language is listed the way its speakers write it. */
  label: string;
  /** Short form for the compact selector. */
  short: string;
  /** BCP-47 tag applied to <html lang>. */
  locale: string;
}

export const languages: LanguageMeta[] = [
  { key: 'en', label: 'English', short: 'EN', locale: 'en-MY' },
  { key: 'ms', label: 'Bahasa Malaysia', short: 'BM', locale: 'ms-MY' },
  { key: 'zh', label: '中文', short: '中文', locale: 'zh-Hans' },
  { key: 'iba', label: 'Iban', short: 'IBA', locale: 'iba' },
];

export const defaultLanguage: LanguageKey = 'en';

export function isLanguage(value: unknown): value is LanguageKey {
  return typeof value === 'string' && languages.some((l) => l.key === value);
}

export function languageMeta(key: LanguageKey): LanguageMeta {
  return languages.find((l) => l.key === key) ?? languages[0];
}
