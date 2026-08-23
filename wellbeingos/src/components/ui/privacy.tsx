'use client';

import { ShieldCheck, Lock, BarChart3 } from 'lucide-react';
import type { PrivacyZone } from '@/core/domain/types';
import { zoneLabels } from '@/core/domain/privacy';
import { cn } from '@/lib/utils';

const zoneIcon = { zone1: ShieldCheck, zone2: Lock, zone3: BarChart3 };
const zoneTone = {
  zone1: 'border-info/25 bg-info/[0.07] text-info',
  zone2: 'border-brand/25 bg-brand/[0.07] text-brand',
  zone3: 'border-gold/30 bg-gold/[0.08] text-gold',
};

/** Shown wherever data of a given zone is displayed, so the boundary is visible. */
export function PrivacyIndicator({ zone, note, className }: { zone: PrivacyZone; note?: string; className?: string }) {
  const Icon = zoneIcon[zone];
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium', zoneTone[zone], className)}
      title={note ?? zoneLabels[zone]}
    >
      <Icon size={13} strokeWidth={2} aria-hidden />
      {zoneLabels[zone]}
      {note ? <span className="hidden font-normal opacity-80 sm:inline">· {note}</span> : null}
    </span>
  );
}

export function SuppressedNotice({ reason }: { reason?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gold/40 bg-gold/[0.06] px-4 py-3 text-[13px] leading-relaxed text-ink-muted">
      <span className="font-medium text-navy">Suppressed to protect privacy.</span>{' '}
      {reason ?? 'The group is too small to display without risking re-identification.'}
    </div>
  );
}
