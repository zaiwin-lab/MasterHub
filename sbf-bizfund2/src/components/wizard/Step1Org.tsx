import { NGOS } from '../../lib/constants';
import { useI18n } from '../../lib/i18n/context';
import type { OrgDetails } from '../../lib/types';

interface Props {
  value: OrgDetails;
  onChange: (patch: Partial<OrgDetails>) => void;
  showErrors: boolean;
}

export default function Step1Org({ value, onChange, showErrors }: Props) {
  const { t } = useI18n();
  const ngoErr = showErrors && !value.ngo.trim();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-navy-900">{t.step1.title}</h2>
        <p className="mt-1 text-sm text-ink/55">{t.step1.desc}</p>
      </div>

      <div>
        <label className="field-label" htmlFor="ngo">
          {t.step1.ngoLabel} <span className="text-teal-600">*</span>
        </label>
        <select
          id="ngo"
          className={`field-input ${ngoErr ? '!border-red-400' : ''}`}
          value={value.ngo}
          onChange={(e) => onChange({ ngo: e.target.value })}
        >
          <option value="">{t.step1.ngoPlaceholder}</option>
          {NGOS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {ngoErr && (
          <p className="mt-1 text-xs font-medium text-red-600">{t.step1.ngoError}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="provider">
            {t.step1.providerLabel}{' '}
            <span className="text-xs font-normal text-ink/40">{t.step1.optional}</span>
          </label>
          <input
            id="provider"
            className="field-input"
            placeholder={t.step1.providerPlaceholder}
            value={value.provider}
            onChange={(e) => onChange({ provider: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="title">
            {t.step1.titleLabel}{' '}
            <span className="text-xs font-normal text-ink/40">{t.step1.optional}</span>
          </label>
          <input
            id="title"
            className="field-input"
            placeholder={t.step1.titlePlaceholder}
            value={value.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
