'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ Card */
export function Card({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('card', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6', className)}>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold leading-tight">{title}</h3>
        {subtitle ? <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('px-5 py-5 sm:px-6', className)}>{children}</div>;
}

/* ---------------------------------------------------------------- Button */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
  size?: 'sm' | 'md';
};

export function Button({ variant = 'secondary', size = 'md', className, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-45',
        size === 'sm' ? 'h-8 px-3 text-[13px]' : 'h-10 px-4 text-sm',
        variant === 'primary' &&
          'bg-primary text-onPrimary shadow-[0_8px_24px_-10px_rgb(var(--c-primary)/0.9)] hover:brightness-110',
        variant === 'secondary' && 'border border-line bg-raised text-ink hover:border-brand/40 hover:text-head',
        variant === 'quiet' && 'text-ink-muted hover:bg-tint/[0.07] hover:text-head',
        variant === 'danger' && 'border border-risk/35 bg-risk/10 text-risk hover:bg-risk/20',
        className,
      )}
      {...rest}
    />
  );
}

/* ----------------------------------------------------------------- Badge */
export type Tone = 'ok' | 'warn' | 'risk' | 'info' | 'muted' | 'accent';

const toneClasses: Record<Tone, string> = {
  ok: 'bg-ok/12 text-ok border-ok/30',
  warn: 'bg-warn/12 text-warn border-warn/30',
  risk: 'bg-risk/14 text-risk border-risk/30',
  info: 'bg-info/12 text-info border-info/30',
  muted: 'bg-tint/[0.07] text-ink-muted border-line',
  accent: 'bg-violet/15 text-violet border-violet/35',
};

export function Badge({ tone = 'muted', children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium', toneClasses[tone], className)}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------ Stat / KPI */
export function Stat({
  label,
  value,
  hint,
  tone,
  trend,
  spark,
  accent,
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: Tone;
  trend?: { value: string; direction: 'up' | 'down' | 'flat'; good?: boolean };
  /** Optional series drawn as a bare sparkline behind the figure. */
  spark?: number[];
  accent?: 'brand' | 'violet' | 'gold';
  className?: string;
}) {
  return (
    <div className={cn('card overflow-hidden p-4 sm:p-5', className)}>
      <p className="label">{label}</p>
      <p className={cn('mt-2 font-display text-[26px] font-semibold leading-none tabular-nums sm:text-[30px]', tone === 'risk' && 'text-risk', tone === 'warn' && 'text-warn', tone === 'ok' && 'text-ok', !tone && 'text-head')}>
        {value}
      </p>
      {spark && spark.length > 1 ? <Sparkline values={spark} accent={accent ?? 'brand'} /> : null}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {trend ? (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-[12px] font-medium',
              trend.good === false ? 'text-risk' : trend.good === true ? 'text-ok' : 'text-ink-muted',
            )}
          >
            {trend.direction === 'up' ? '▲' : trend.direction === 'down' ? '▼' : '■'} {trend.value}
          </span>
        ) : null}
        {hint ? <span className="text-[12px] leading-snug text-ink-muted">{hint}</span> : null}
      </div>
    </div>
  );
}

/** Bare sparkline — no axes, no grid; it exists to show shape, not values. */
export function Sparkline({ values, accent = 'brand', className }: { values: number[]; accent?: 'brand' | 'violet' | 'gold'; className?: string }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const points = values.map((v, i) => `${(i / (values.length - 1)) * 100},${28 - ((v - min) / span) * 24}`).join(' ');
  const stroke = accent === 'violet' ? 'rgb(var(--c-violet))' : accent === 'gold' ? 'rgb(var(--c-gold))' : 'rgb(var(--c-brand))';
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={cn('mt-3 h-8 w-full', className)} aria-hidden>
      <polyline points={points} fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity={0.9} />
    </svg>
  );
}

/* ----------------------------------------------------------- Empty state */
export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-12 text-center">
      {icon ? <div className="mb-3 text-ink-soft">{icon}</div> : null}
      <p className="font-medium text-head">{title}</p>
      <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-ink-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/* -------------------------------------------------------------- Skeleton */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-tint/[0.06]', className)} />;
}

/* ------------------------------------------------------------ Form field */
export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 flex items-center gap-1 text-[13px] font-medium text-ink">
        {label}
        {required ? <span className="text-risk">*</span> : null}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-[12.5px] text-risk">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-[12.5px] leading-snug text-ink-muted">{hint}</span>
      ) : null}
    </label>
  );
}

const controlClass =
  'w-full rounded-xl border border-line bg-raised px-3 py-2 text-sm text-head placeholder:text-ink-soft focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-canvas disabled:text-ink-soft';

export function Input({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClass, className)} {...rest} />;
}

export function Select({ className, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(controlClass, 'appearance-none bg-[length:16px] pr-8', className)} {...rest}>
      {children}
    </select>
  );
}

export function Textarea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlClass, 'min-h-[84px] resize-y', className)} {...rest} />;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-[13.5px] font-medium text-ink">{label}</p>
        {description ? <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-muted">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-40',
          checked ? 'bg-brand' : 'bg-tint/20',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  );
}

/* ----------------------------------------------------------------- Modal */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/70 p-0 backdrop-blur-[2px] sm:items-center sm:p-6">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-line bg-surface shadow-lift animate-fade-up sm:rounded-2xl',
          wide ? 'sm:max-w-3xl' : 'sm:max-w-lg',
        )}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-surface px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-[15px] font-semibold text-head">{title}</h2>
            {description ? <p className="mt-1 text-[13px] text-ink-muted">{description}</p> : null}
          </div>
          <Button variant="quiet" size="sm" onClick={onClose} aria-label="Close">✕</Button>
        </div>
        <div className="px-5 py-5 sm:px-6">{children}</div>
        {footer ? (
          <div className="sticky bottom-0 flex flex-wrap justify-end gap-2 border-t border-line bg-surface px-5 py-4 sm:px-6">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Table */
export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="scroll-x">
      <table className={cn('w-full min-w-[640px] border-collapse text-sm', className)}>{children}</table>
    </div>
  );
}

export function Th({ children, className, align = 'left' }: { children?: React.ReactNode; className?: string; align?: 'left' | 'right' | 'center' }) {
  return (
    <th
      className={cn(
        'whitespace-nowrap border-b border-line px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-soft',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className, align = 'left' }: { children?: React.ReactNode; className?: string; align?: 'left' | 'right' | 'center' }) {
  return (
    <td
      className={cn(
        'border-b border-line/60 px-3 py-2.5 align-middle text-[13.5px] text-ink',
        align === 'right' && 'text-right tabular-nums',
        align === 'center' && 'text-center',
        className,
      )}
    >
      {children}
    </td>
  );
}

/* ----------------------------------------------------------- Progress bar */
export function Progress({ value, tone = 'brand', className }: { value: number; tone?: 'brand' | 'warn' | 'risk' | 'accent'; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-tint/[0.10]', className)}>
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-500',
          tone === 'brand' && 'bg-gradient-to-r from-brand/70 to-brand',
          tone === 'warn' && 'bg-gradient-to-r from-warn/70 to-warn',
          tone === 'risk' && 'bg-gradient-to-r from-risk/70 to-risk',
          tone === 'accent' && 'bg-gradient-to-r from-violet/70 to-violet',
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
