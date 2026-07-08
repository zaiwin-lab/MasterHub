import { Check } from 'lucide-react';

const STEPS = ['Organisation', 'Programme', 'Materials', 'Scoring', 'Summary'];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="no-print mx-auto flex max-w-2xl items-center">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <span
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition',
                  done
                    ? 'border-teal-600 bg-teal-600 text-white'
                    : active
                      ? 'border-navy-800 bg-white text-navy-800 ring-4 ring-navy-100'
                      : 'border-navy-200 bg-white text-ink/35',
                ].join(' ')}
              >
                {done ? <Check size={14} strokeWidth={3} /> : step}
              </span>
              <span
                className={[
                  'mt-1.5 hidden text-[11px] font-semibold sm:block',
                  active || done ? 'text-navy-800' : 'text-ink/35',
                ].join(' ')}
              >
                {label}
              </span>
            </div>
            {step < STEPS.length && (
              <div
                className={[
                  'mx-1.5 h-0.5 flex-1 rounded-full',
                  done ? 'bg-teal-600' : 'bg-navy-100',
                ].join(' ')}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
