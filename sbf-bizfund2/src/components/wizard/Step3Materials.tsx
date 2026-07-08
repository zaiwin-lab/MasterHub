import { CheckCircle2, Upload } from 'lucide-react';
import { UPLOAD_SLOTS } from '../../lib/constants';
import type { Materials } from '../../lib/types';

interface Props {
  value: Materials;
  onChange: (patch: Partial<Materials>) => void;
}

export default function Step3Materials({ value, onChange }: Props) {
  const setFile = (key: string, name: string) =>
    onChange({ files: { ...value.files, [key]: name } });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Proposal Materials</h2>
        <p className="mt-1 text-sm text-ink/55">
          Attach the submission package and any supporting references.
        </p>
      </div>

      <div>
        <label className="field-label" htmlFor="links">
          Reference links
        </label>
        <textarea
          id="links"
          className="field-input min-h-[110px] resize-y font-mono text-xs leading-relaxed"
          placeholder={
            'Paste proposal links, Google Drive links, Canva links, YouTube links, WhatsApp notes or other references…'
          }
          value={value.links}
          onChange={(e) => onChange({ links: e.target.value })}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {UPLOAD_SLOTS.map((slot) => {
          const fileName = value.files[slot.key];
          return (
            <label
              key={slot.key}
              className={[
                'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition',
                fileName
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-dashed border-navy-200 bg-navy-50/40 hover:bg-navy-50',
              ].join(' ')}
            >
              <span
                className={[
                  'flex h-9 w-9 flex-none items-center justify-center rounded-lg',
                  fileName ? 'bg-teal-600 text-white' : 'bg-navy-100 text-navy-700',
                ].join(' ')}
              >
                {fileName ? <CheckCircle2 size={17} /> : <Upload size={16} />}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink/80">{slot.label}</span>
                <span className="block truncate text-xs text-ink/45">
                  {fileName ?? 'Click to attach (PDF, DOC, PPT, image)'}
                </span>
              </span>
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFile(slot.key, f.name);
                  e.target.value = '';
                }}
              />
            </label>
          );
        })}
      </div>

      <div>
        <label className="field-label" htmlFor="notes">
          Additional notes
        </label>
        <textarea
          id="notes"
          className="field-input min-h-[72px] resize-y"
          placeholder="Anything else the Committee should be aware of."
          value={value.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
        />
      </div>
    </div>
  );
}
