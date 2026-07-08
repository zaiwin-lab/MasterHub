import { TRAINING_CATEGORIES } from '../../lib/constants';
import type { ProgrammeInfo } from '../../lib/types';

interface Props {
  value: ProgrammeInfo;
  onChange: (patch: Partial<ProgrammeInfo>) => void;
}

export default function Step2Programme({ value, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Programme Information</h2>
        <p className="mt-1 text-sm text-ink/55">
          Key delivery details the Committee needs for context.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="category">Training category</label>
          <select
            id="category"
            className="field-input"
            value={value.category}
            onChange={(e) => onChange({ category: e.target.value })}
          >
            <option value="">Select category…</option>
            {TRAINING_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="target">Target participants</label>
          <input
            id="target"
            className="field-input"
            placeholder="e.g. SME owners, association members"
            value={value.target}
            onChange={(e) => onChange({ target: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="expected">Expected number of participants</label>
          <input
            id="expected"
            className="field-input"
            type="number"
            min="1"
            placeholder="e.g. 30"
            value={value.expected}
            onChange={(e) => onChange({ expected: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="location">Training location</label>
          <input
            id="location"
            className="field-input"
            placeholder="e.g. Kuching, Sarawak"
            value={value.location}
            onChange={(e) => onChange({ location: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="date">Proposed training date</label>
          <input
            id="date"
            className="field-input"
            type="date"
            value={value.date}
            onChange={(e) => onChange({ date: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="duration">Programme duration</label>
          <input
            id="duration"
            className="field-input"
            placeholder="e.g. 2 days"
            value={value.duration}
            onChange={(e) => onChange({ duration: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="budget">Estimated budget / requested amount (RM)</label>
          <input
            id="budget"
            className="field-input"
            placeholder="e.g. 25,000"
            value={value.budget}
            onChange={(e) => onChange({ budget: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="objective">Short programme objective</label>
          <textarea
            id="objective"
            className="field-input min-h-[88px] resize-y"
            placeholder="One or two sentences on what the programme aims to achieve."
            value={value.objective}
            onChange={(e) => onChange({ objective: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
