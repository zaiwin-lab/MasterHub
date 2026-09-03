import { useLang } from '../store/useLang'
import { useDesk } from '../store/useDesk'
import { useDeskQuote } from '../store/useDeskQuote'
import { t } from '../lib/i18n'
import { encodeCfg } from '../lib/cfg'
import { buildQuoteText } from '../lib/whatsapp'
import { useCopy } from '../hooks'

/** Sharing that does not hold the date — the quote, and the family draft. */
export function ShareRow() {
  const { lang } = useLang()
  const desk = useDesk()
  const { quote, ref } = useDeskQuote()
  const [copiedQuote, copyQuote] = useCopy()
  const [copiedDraft, copyDraft] = useCopy()

  const cfg = encodeCfg({
    date: desk.date,
    pkg: desk.pkg,
    pax: desk.pax,
    dishes: desk.dishes,
    names: desk.names,
    notes: desk.notes,
    benang: desk.benang,
  })
  const draftUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/tempah?cfg=${cfg}`

  const quoteText = buildQuoteText({
    date: desk.date,
    pkg: desk.pkg,
    pax: desk.pax,
    dishes: desk.dishes,
    names: desk.names,
    phone: desk.phone,
    notes: desk.notes,
    benangCode: ref.ok ? ref.code : undefined,
    benangName: ref.ok ? ref.name : undefined,
    quote,
    lang,
  })

  const btn =
    'ctl min-h-[44px] px-3 border border-ink/25 hover:border-ink text-[13px] transition-colors duration-150'

  return (
    <div className="flex flex-wrap gap-1.5">
      <button onClick={() => copyQuote(quoteText)} className={btn}>
        {copiedQuote ? t('copied', lang) : t('copyQuote', lang)}
      </button>
      <button onClick={() => copyDraft(draftUrl)} className={btn}>
        {copiedDraft ? t('copied', lang) : t('shareDraft', lang)}
      </button>
    </div>
  )
}
