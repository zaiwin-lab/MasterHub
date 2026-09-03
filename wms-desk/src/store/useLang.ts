import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lang } from '../lib/i18n'

type LangState = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void }

export const useLang = create<LangState>()(
  persist(
    (set, get) => ({
      lang: 'bm',
      setLang: (lang) => set({ lang }),
      toggle: () => set({ lang: get().lang === 'bm' ? 'en' : 'bm' }),
    }),
    { name: 'wms.lang' },
  ),
)
