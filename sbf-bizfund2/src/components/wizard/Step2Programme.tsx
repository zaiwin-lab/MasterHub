import { TRAINING_CATEGORIES } from '../../lib/constants';
import { useI18n } from '../../lib/i18n/context';
import type { ProgrammeInfo } from '../../lib/types';

interface Props {
  value: ProgrammeInfo;
  onChange: (patch: Partial<ProgrammeInfo>) => void;
}

export default function Step2Programme({ value, onChange }: Props) {
  const { t } = useI18n();
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-navy-900">{t.step2.title}</h2>
        <p className="mt-1 text-sm text-ink/55">{t.step2.desc}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="category">{t.step2.categoryLabel}</label>
          <select
            id="category"
            className="field-input"
            value={value.category}
            onChange={(e) => onChange({ category: e.target.value })}
          >
            <option value="">{t.step2.categoryPlaceholder}</option>
            {TRAINING_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="target">{t.step2.targetLabel}</label>
          <input
            id="target"
            className="field-input"
            placeholder={t.step2.targetPlaceholder}
            value={value.target}
            onChange={(e) => onChange({ target: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="expected">{t.step2.expectedLabel}</label>
          <input
            id="expected"
            className="field-input"
            type="number"
            min="1"
            placeholder={t.step2.expectedPlaceholder}
            value={value.expected}
            onChange={(e) => onChange({ expected: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="location">{t.step2.locationLabel}</label>
          <input
            id="location"
            className="field-input"
            placeholder={t.step2.locationPlaceholder}
            value={value.location}
            onChange={(e) => onChange({ location: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="date">{t.step2.dateLabel}</label>
          <input
            id="date"
            className="field-input"
            type="date"
            value={value.date}
            onChange={(e) => onChange({ date: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="duration">{t.step2.durationLabel}</label>
          <input
            id="duration"
            className="field-input"
            placeholder={t.step2.durationPlaceholder}
            value={value.duration}
            onChange={(e) => onChange({ duration: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="budget">{t.step2.budgetLabel}</label>
          <input
            id="budget"
            className="field-input"
            placeholder={t.step2.budgetPlaceholder}
            value={value.budget}
            onChange={(e) => onChange({ budget: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="objective">{t.step2.objectiveLabel}</label>
          <textarea
            id="objective"
            className="field-input min-h-[88px] resize-y"
            placeholder={t.step2.objectivePlaceholder}
            value={value.objective}
            onChange={(e) => onChange({ objective: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
