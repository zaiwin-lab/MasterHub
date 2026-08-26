'use client';

import { cn } from '@/lib/utils';
import { usePresentationMode } from '@/lib/use-mode';

/**
 * Radial gauge — the anchor figure on a panel.
 *
 * Two variants: a full ring (utilisation, budget) and a 240° dial (index
 * scores). Both use a gradient stroke with a soft outer glow, which is what
 * gives a dark control-room panel its depth.
 */
export function RadialGauge({
  value,
  max = 100,
  size = 200,
  stroke = 16,
  arc = 360,
  label,
  caption,
  sublabel,
  tone = 'brand',
  segments,
  className,
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  /** 360 for a full ring, 240 for a dial. */
  arc?: 360 | 240;
  label: string;
  caption?: string;
  sublabel?: string;
  tone?: 'brand' | 'violet' | 'gold' | 'warn' | 'risk';
  /** Optional stacked second value (e.g. committed alongside approved). */
  segments?: { value: number; tone: 'brand' | 'violet' | 'gold' }[];
  className?: string;
}) {
  const mode = usePresentationMode();
  // A dark canvas carries a wide bloom; on white the same blur reads as smudge.
  const glow = mode === 'dark' ? 6 : 2.5;
  const id = `g-${tone}-${arc}-${Math.round(size)}`;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const usable = (arc / 360) * circumference;
  const pct = Math.max(0, Math.min(1, value / max));
  const rotation = arc === 360 ? -90 : 150;

  const colours: Record<string, [string, string]> = {
    brand: ['rgb(var(--c-brand))', 'rgb(var(--c-violet))'],
    violet: ['rgb(var(--c-violet))', 'rgb(var(--c-brand))'],
    gold: ['rgb(var(--c-gold))', 'rgb(var(--c-brand))'],
    warn: ['rgb(var(--c-warn))', 'rgb(var(--c-gold))'],
    risk: ['rgb(var(--c-risk))', 'rgb(var(--c-warn))'],
  };
  const [from, to] = colours[tone];

  let offsetSoFar = 0;

  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: arc === 360 ? size : size * 0.78 }}>
      <svg width={size} height={size} style={{ transform: `rotate(${rotation}deg)` }} role="img" aria-label={`${label}: ${value} of ${max}`}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="58%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
          <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={glow} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="rgb(var(--c-tint) / 0.10)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${usable} ${circumference}`}
        />

        {segments?.map((seg, i) => {
          const segLen = Math.max(0, Math.min(1, seg.value / max)) * usable;
          const dashOffset = -offsetSoFar;
          offsetSoFar += segLen;
          return (
            <circle
              key={i}
              cx={size / 2} cy={size / 2} r={radius} fill="none"
              stroke={seg.tone === 'violet' ? 'rgb(var(--c-violet))' : seg.tone === 'gold' ? 'rgb(var(--c-gold))' : 'rgb(var(--c-brand))'}
              strokeWidth={stroke} strokeLinecap="round"
              strokeDasharray={`${segLen} ${circumference}`}
              strokeDashoffset={dashOffset}
              opacity={0.55}
            />
          );
        })}

        {!segments ? (
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={`url(#${id})`} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={`${pct * usable} ${circumference}`}
            filter={`url(#${id}-glow)`}
            style={{ transition: 'stroke-dasharray .7s cubic-bezier(.2,.8,.2,1)' }}
          />
        ) : null}
      </svg>

      <div className={cn('absolute inset-x-0 flex flex-col items-center text-center', arc === 360 ? 'inset-y-0 justify-center' : 'top-[26%]')}>
        <span className="label">{label}</span>
        <span className="mt-1 max-w-[80%] font-display text-[30px] font-semibold leading-none tabular-nums text-head">{caption}</span>
        {sublabel ? <span className="mt-1.5 max-w-[78%] text-[12px] leading-snug text-ink-muted">{sublabel}</span> : null}
      </div>
    </div>
  );
}

/**
 * Horizontal meter list — the "active appliances" pattern from the reference
 * dashboards, used here for spend by service category and similar rankings.
 */
export function MeterList({
  items,
  formatValue,
  className,
}: {
  items: { label: string; value: number; hint?: string }[];
  formatValue: (v: number) => string;
  className?: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  const tones = ['from-brand/80 to-brand', 'from-violet/80 to-violet', 'from-gold/80 to-gold', 'from-info/80 to-info', 'from-ok/80 to-ok'];
  return (
    <ul className={cn('space-y-3', className)}>
      {items.map((item, i) => (
        <li key={item.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span className="truncate text-[13px] text-ink">{item.label}</span>
            <span className="shrink-0 text-[13px] font-medium tabular-nums text-head">{formatValue(item.value)}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-tint/[0.08]">
            <div
              className={cn('h-full rounded-full bg-gradient-to-r transition-[width] duration-700', tones[i % tones.length])}
              style={{ width: `${Math.max(2, (item.value / max) * 100)}%` }}
            />
          </div>
          {item.hint ? <p className="mt-1 text-[11.5px] text-ink-soft">{item.hint}</p> : null}
        </li>
      ))}
    </ul>
  );
}

/** Delta chip — a signed change with its own colour logic. */
export function Delta({ value, suffix = '', goodWhenDown }: { value: number; suffix?: string; goodWhenDown?: boolean }) {
  const up = value > 0;
  const neutral = value === 0;
  const good = neutral ? null : goodWhenDown ? !up : up;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium tabular-nums',
        neutral ? 'bg-tint/[0.08] text-ink-muted' : good ? 'bg-ok/12 text-ok' : 'bg-risk/12 text-risk',
      )}
    >
      {neutral ? '—' : up ? '▲' : '▼'} {Math.abs(value)}{suffix}
    </span>
  );
}
