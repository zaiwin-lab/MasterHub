import { useRef, useState } from 'react';
import { FileText, UploadCloud, X } from 'lucide-react';
import type { Materials } from '../../lib/types';

interface Props {
  value: Materials;
  onChange: (patch: Partial<Materials>) => void;
}

export default function Step3Materials({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const names = Array.from(list).map((f) => f.name);
    // de-dupe by name
    const merged = Array.from(new Set([...value.files, ...names]));
    onChange({ files: merged });
  };

  const removeFile = (name: string) =>
    onChange({ files: value.files.filter((f) => f !== name) });

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

      {/* Single "magic box" — accepts any file type, multiple files */}
      <div>
        <label className="field-label">Upload documents</label>
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={[
            'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-9 text-center transition',
            dragging
              ? 'border-teal-500 bg-teal-50'
              : 'border-navy-200 bg-navy-50/40 hover:border-teal-400 hover:bg-navy-50',
          ].join(' ')}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-800 text-white">
            <UploadCloud size={22} />
          </span>
          <p className="mt-3 text-sm font-semibold text-navy-900">
            Drag &amp; drop files here, or click to browse
          </p>
          <p className="mt-1 text-xs text-ink/50">
            One box for everything — proposal, budget, trainer profile, poster, images.
            Any file type, attach as many as you need.
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>

        {value.files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {value.files.map((name) => (
              <li
                key={name}
                className="flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50/60 px-3.5 py-2.5"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-teal-600 text-white">
                  <FileText size={15} />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink/80">
                  {name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(name)}
                  className="flex h-7 w-7 flex-none items-center justify-center rounded-lg text-ink/40 transition hover:bg-navy-100 hover:text-ink/70"
                  aria-label={`Remove ${name}`}
                >
                  <X size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
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
