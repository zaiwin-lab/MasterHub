import { useLang } from '../store/useLang'
import { useDesk, isValidMyPhone } from '../store/useDesk'
import { t } from '../lib/i18n'
import type { ReferralCheck } from '../lib/referral'

export function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string
  children: React.ReactNode
  hint?: string
  error?: string
}) {
  return (
    <label className="block">
      <span className="block text-[12px] text-inksoft mb-1">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-[11.5px] text-hold">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-[11.5px] text-inksoft">{hint}</span>
      ) : null}
    </label>
  )
}

const inputCls =
  'w-full ctl border border-ink/25 bg-paper px-3 min-h-[44px] text-[15px] placeholder:text-inksoft/50 focus:border-ink transition-colors duration-150'

export function ContactFields({ withNotes }: { withNotes?: boolean }) {
  const { lang } = useLang()
  const desk = useDesk()
  const phoneBad = desk.phone.length > 3 && !isValidMyPhone(desk.phone)

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label={t('coupleNames', lang)}>
        <input
          className={inputCls}
          value={desk.names}
          onChange={(e) => desk.setField('names', e.target.value)}
          placeholder={t('coupleNamesPh', lang)}
          autoComplete="name"
        />
      </Field>
      <Field
        label={t('phone', lang)}
        error={phoneBad ? (lang === 'bm' ? 'Nombor Malaysia tidak sah' : 'Not a valid Malaysian number') : undefined}
      >
        <input
          className={inputCls}
          value={desk.phone}
          onChange={(e) => desk.setField('phone', e.target.value)}
          placeholder={t('phonePh', lang)}
          inputMode="tel"
          autoComplete="tel"
        />
      </Field>
      {withNotes && (
        <div className="sm:col-span-2">
          <Field label={t('notes', lang)}>
            <textarea
              className={`${inputCls} py-2 min-h-[88px] resize-y`}
              value={desk.notes}
              onChange={(e) => desk.setField('notes', e.target.value)}
              placeholder={t('notesPh', lang)}
            />
          </Field>
        </div>
      )}
    </div>
  )
}

export function BenangField({ check }: { check: ReferralCheck }) {
  const { lang } = useLang()
  const desk = useDesk()

  const message = () => {
    if (!desk.benang.trim()) return null
    if (check.ok && check.kind === 'planner')
      return <span className="text-inksoft">{t('benangPlanner', lang)}</span>
    if (check.ok)
      return (
        <span className="text-copperhot">{t('benangFrom', lang, { name: check.name ?? '' })}</span>
      )
    if (check.reason === 'own-code') return <span className="text-hold">{t('benangOwn', lang)}</span>
    if (check.reason === 'same-phone')
      return <span className="text-hold">{t('benangSamePhone', lang)}</span>
    return <span className="text-hold">{t('benangInvalid', lang)}</span>
  }

  return (
    <div>
      <Field label={lang === 'bm' ? 'Kod Benang Emas (jika ada)' : 'Benang Emas code (optional)'}>
        <input
          className={`${inputCls} uppercase`}
          value={desk.benang}
          onChange={(e) => desk.setField('benang', e.target.value.toUpperCase())}
          placeholder="WMS-XXXX"
          spellCheck={false}
        />
      </Field>
      <div className="mt-1 text-[12px] min-h-[18px]">{message()}</div>
    </div>
  )
}
