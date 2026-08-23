'use client';

import { cn } from '@/lib/utils';

/**
 * The single most important number in the employee experience: how much of the
 * entitlement is used. Colour follows the policy bands, not decoration.
 */
export function UtilisationRing({
  pct,
  committedPct = 0,
  size = 176,
  stroke = 14,
  centreLabel,
  centreValue,
  caption,
  className,
}: {
  pct: number;
  committedPct?: number;
  size?: number;
  stroke?: number;
  centreLabel?: string;
  centreValue?: string;
  caption?: string;
  className?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const used = Math.min(100, Math.max(0, pct));
  const committed = Math.min(100 - used, Math.max(0, committedPct));
  const tone = used >= 100 ? 'risk' : used >= 90 ? 'warn' : used >= 75 ? 'gold' : 'brand';
  const strokeColour =
    tone === 'risk' ? 'rgb(var(--c-risk))' : tone === 'warn' ? 'rgb(var(--c-warn))' : tone === 'gold' ? 'rgb(var(--c-gold))' : 'rgb(var(--c-brand))';

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${used.toFixed(0)} percent utilised`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgb(var(--c-navy) / 0.08)" strokeWidth={stroke} />
          {committed > 0 ? (
            <circle
              cx={size / 2} cy={size / 2} r={radius} fill="none"
              stroke="rgb(var(--c-accent))" strokeWidth={stroke} strokeLinecap="round"
              strokeDasharray={`${(committed / 100) * circumference} ${circumference}`}
              strokeDashoffset={-((used / 100) * circumference)}
              opacity={0.55}
            />
          ) : null}
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={strokeColour} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={`${(used / 100) * circumference} ${circumference}`}
            style={{ transition: 'stroke-dasharray .6s cubic-bezier(.2,.8,.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {centreLabel ? <span className="label">{centreLabel}</span> : null}
          <span className="font-display text-[26px] leading-none text-navy sm:text-[30px]">{centreValue ?? `${used.toFixed(0)}%`}</span>
          {caption ? <span className="mt-1 px-6 text-[12px] leading-tight text-ink-muted">{caption}</span> : null}
        </div>
      </div>
    </div>
  );
}
