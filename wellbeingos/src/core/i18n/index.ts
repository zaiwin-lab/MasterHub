import { dictionaries } from './dictionary';
import { en, type TranslationKey } from './dictionary';
import { defaultLanguage, type LanguageKey } from './languages';

export * from './languages';
export type { TranslationKey } from './dictionary';

/**
 * Resolve a key for a language, falling back to English, then to the key.
 *
 * `vars` interpolates `{name}` placeholders so a translated sentence can carry
 * tenant values (organisation name, currency, entitlement) without the
 * translator needing to know word order in advance.
 */
export function translate(
  language: LanguageKey,
  key: TranslationKey,
  vars?: Record<string, string | number>,
): string {
  const table = dictionaries[language] ?? dictionaries[defaultLanguage];
  const raw = table[key] ?? en[key] ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

/** Coverage of a language against the English reference — used by the docs and tests. */
export function coverage(language: LanguageKey): number {
  const total = Object.keys(en).length;
  const have = Object.keys(dictionaries[language] ?? {}).length;
  return total === 0 ? 1 : have / total;
}
