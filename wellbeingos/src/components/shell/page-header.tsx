'use client';

import type { PrivacyZone } from '@/core/domain/types';
import { PrivacyIndicator } from '@/components/ui/privacy';

export function PageHeader({
  title,
  description,
  zone,
  zoneNote,
  action,
}: {
  title: string;
  description?: string;
  zone?: PrivacyZone;
  zoneNote?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-display text-[22px] leading-tight text-navy sm:text-[26px]">{title}</h1>
          {zone ? <PrivacyIndicator zone={zone} note={zoneNote} /> : null}
        </div>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-ink-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap gap-2">{action}</div> : null}
    </header>
  );
}

export function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-3 mt-8 flex flex-wrap items-baseline justify-between gap-2 first:mt-0">
      <h2 className="font-display text-[17px] text-navy">{children}</h2>
      {hint ? <p className="text-[12.5px] text-ink-muted">{hint}</p> : null}
    </div>
  );
}
