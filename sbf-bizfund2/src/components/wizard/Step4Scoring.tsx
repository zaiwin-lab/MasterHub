import { CRITERIA, SCORE_LABELS } from '../../lib/constants';
import { bandFor, percentFor } from '../../lib/scoring';
import type { Scores } from '../../lib/types';

interface Props {
  scores: Scores;
  onChange: (key: string, score: number) => void;
}

const BAND_TEXT: Record<string, string> = {
  recommended: 'text-teal-700',
  clarify: 'text-gold-600',
  revise: 'text-amber-600',
  reject: 'text-red-600',
};

export default function Step4Scoring({ scores, onChange }: Props) {
  const percent = percentFor(scores);
  const { band, label } = bandFor(percent);

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Committee Assessment</h2>
          <p className="mt-1 text-sm text-ink/55">
            Rate each criterion from 1 (Poor) to 5 (Excellent).
          </p>
        </div>
        <div className="rounded-xl border border-navy-100 bg-navy-50/60 px-4 py-2.5 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/45">
            Overall score
          </p>
          <p className="text-2xl font-extrabold leading-tight text-navy-900">{percent}%</p>
          <p className={`text-xs font-bold ${BAND_TEXT[band]}`}>{label}</p>
        </div>
      </div>

      <ul className="space-y-3">
        {CRITERIA.map((c) => {
          const current = scores[c.key];
          return (
            <li key={c.key} className="rounded-xl border border-navy-100 bg-white px-4 py-3.5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink/85">{c.label}</p>
                  <p className="mt-0.5 text-xs text-ink/45">{c.hint}</p>
                </div>
                <div
                  className="flex flex-none items-center gap-1"
                  role="radiogroup"
                  aria-label={c.label}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={current === n}
                      title={SCORE_LABELS[n]}
                      onClick={() => onChange(c.key, n)}
                      className={[
                        'h-9 w-9 rounded-lg border text-sm font-bold transition',
                        current === n
                          ? 'border-navy-800 bg-navy-800 text-white'
                          : 'border-navy-200 bg-white text-ink/55 hover:border-navy-400 hover:text-navy-800',
                      ].join(' ')}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-1.5 text-right text-[11px] font-medium text-ink/40 sm:mt-1">
                {SCORE_LABELS[current]}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
