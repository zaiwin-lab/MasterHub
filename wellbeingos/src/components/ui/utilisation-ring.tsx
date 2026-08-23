'use client';

import { cn } from '@/lib/utils';
import { usePresentationMode } from '@/lib/use-mode';

/**
 * The single most important number in the employee experience: how much of the
 * entitlement is used. Colour follows the policy bands, not decoration — the
 * ring shifts from brand to gold to amber to red as the thresholds are crossed.
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
  const mode = usePresentationMode();
  const glow = mode === 'dark' ? 5 : 2;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const used = Math.min(100, Math.max(0, pct));
  const committed = Math.min(100 - used, Math.max(0, committedPct));

  const band = used >= 100 ? 'risk' : used >= 90 ? 'warn' : used >= 75 ? 'gold' : 'brand';
  /**
   * Each band stays within its own hue. Blending across families (gold into
   * teal) smears into an unreadable olive on a light canvas, and the band is
   * meant to be recognised at a glance.
   */
  const gradients: Record<string, [string, string]> = {
    brand: ['rgb(var(--c-brand))', 'rgb(var(--c-violet))'],
    gold: ['rgb(var(--c-gold) / 0.75)', 'rgb(var(--c-gold))'],
    warn: ['rgb(var(--c-warn) / 0.75)', 'rgb(var(--c-warn))'],
    risk: ['rgb(var(--c-risk) / 0.75)', 'rgb(var(--c-risk))'],
  };
  const [from, to] = gradients[band];
  const id = `ring-${band}-${size}`;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${used.toFixed(0)} percent utilised`}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={from} />
              <stop offset="60%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
            <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation={glow} result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgb(var(--c-tint) / 0.10)" strokeWidth={stroke} />

          {committed > 0 ? (
            <circle
              cx={size / 2} cy={size / 2} r={radius} fill="none"
              stroke="rgb(var(--c-violet))" strokeWidth={stroke} strokeLinecap="round"
              strokeDasharray={`${(committed / 100) * circumference} ${circumference}`}
              strokeDashoffset={-((used / 100) * circumference)}
              opacity={0.5}
            />
          ) : null}

          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={`url(#${id})`} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={`${(used / 100) * circumference} ${circumference}`}
            filter={`url(#${id}-glow)`}
            style={{ transition: 'stroke-dasharray .7s cubic-bezier(.2,.8,.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {centreLabel ? <span className="label">{centreLabel}</span> : null}
          <span className="font-display text-[28px] font-semibold leading-none tabular-nums text-head sm:text-[32px]">
            {centreValue ?? `${used.toFixed(0)}%`}
          </span>
          {caption ? <span className="mt-1.5 px-6 text-[12px] leading-tight text-ink-muted">{caption}</span> : null}
        </div>
      </div>
    </div>
  );
}
