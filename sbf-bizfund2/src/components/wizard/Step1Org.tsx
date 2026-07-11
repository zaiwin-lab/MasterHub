import { NGOS } from '../../lib/constants';
import type { OrgDetails } from '../../lib/types';

interface Props {
  value: OrgDetails;
  onChange: (patch: Partial<OrgDetails>) => void;
  showErrors: boolean;
}

export default function Step1Org({ value, onChange, showErrors }: Props) {
  const err = (field: keyof OrgDetails) => showErrors && !value[field].trim();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Organisation Details</h2>
        <p className="mt-1 text-sm text-ink/55">
          Only the association is required. Provider and programme title are
          optional — leave them blank and they can be completed later from the
          uploaded links and files.
        </p>
      </div>

      <div>
        <label className="field-label" htmlFor="ngo">
          Select Your NGO / Association <span className="text-teal-600">*</span>
        </label>
        <select
          id="ngo"
          className={`field-input ${err('ngo') ? '!border-red-400' : ''}`}
          value={value.ngo}
          onChange={(e) => onChange({ ngo: e.target.value })}
        >
          <option value="">Choose an association…</option>
          {NGOS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {err('ngo') && (
          <p className="mt-1 text-xs font-medium text-red-600">Please select an association.</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="provider">
            Training Provider Name{' '}
            <span className="text-xs font-normal text-ink/40">(optional)</span>
          </label>
          <input
            id="provider"
            className="field-input"
            placeholder="e.g. ABC Training Academy Sdn Bhd"
            value={value.provider}
            onChange={(e) => onChange({ provider: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="title">
            Programme / Training Title{' '}
            <span className="text-xs font-normal text-ink/40">(optional)</span>
          </label>
          <input
            id="title"
            className="field-input"
            placeholder="e.g. Digital Marketing for SMEs"
            value={value.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
