'use client';

import { Info, Bell, AlertTriangle, ShieldAlert } from 'lucide-react';
import type { AlertThreshold } from '@/core/domain/types';
import { cn } from '@/lib/utils';

const levelStyle: Record<AlertThreshold['level'], { wrap: string; icon: typeof Info; label: string; accent: string }> = {
  awareness: { wrap: 'border-info/30 bg-info/[0.08]', icon: Info, label: 'Awareness', accent: 'text-info' },
  reminder: { wrap: 'border-gold/35 bg-gold/[0.09]', icon: Bell, label: 'Reminder', accent: 'text-gold' },
  important: { wrap: 'border-warn/40 bg-warn/[0.10]', icon: AlertTriangle, label: 'Important', accent: 'text-warn' },
  policy: { wrap: 'border-risk/40 bg-risk/[0.10]', icon: ShieldAlert, label: 'Policy workflow', accent: 'text-risk' },
};

/**
 * Threshold messaging is supportive by design: it tells the employee where they
 * stand and what happens next, never what they have done wrong.
 */
export function AlertBanner({
  level,
  title,
  message,
  action,
  className,
}: {
  level: AlertThreshold['level'];
  title: string;
  message: string;
  action?: React.ReactNode;
  className?: string;
}) {
  const style = levelStyle[level];
  const Icon = style.icon;
  return (
    <div className={cn('flex flex-wrap items-start gap-3 rounded-2xl border px-4 py-3.5 sm:px-5', style.wrap, className)} role="status">
      <Icon size={18} className={cn('mt-0.5 shrink-0', style.accent)} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-semibold text-head">{title}</p>
        <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted">{message}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
