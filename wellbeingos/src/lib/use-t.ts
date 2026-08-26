'use client';

import { useCallback } from 'react';
import { useStore } from '@/core/data/store';
import { translate, type TranslationKey } from '@/core/i18n';

/**
 * The single translation hook. Components call `t('nav.overview')` and never
 * touch the dictionary or the active language directly, so adding a language
 * is a data change rather than a component change.
 */
export function useT() {
  const { language } = useStore();
  return useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => translate(language, key, vars),
    [language],
  );
}
