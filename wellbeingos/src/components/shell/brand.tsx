'use client';

import { cn } from '@/lib/utils';

export function BrandMark({
  mark,
  productName,
  organisation,
  size = 'md',
  className,
}: {
  mark: string;
  productName: string;
  organisation?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        className={cn(
          'grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet font-display font-semibold tracking-tight text-white',
          size === 'sm' && 'h-8 w-8 text-[11px]',
          size === 'md' && 'h-10 w-10 text-[12.5px]',
          size === 'lg' && 'h-12 w-12 text-sm',
        )}
        aria-hidden
      >
        {mark}
      </span>
      <span className="min-w-0">
        <span
          className={cn(
            'block truncate font-display leading-tight text-head',
            size === 'sm' ? 'text-[14px]' : size === 'lg' ? 'text-lg' : 'text-[15.5px]',
          )}
        >
          {productName}
        </span>
        {organisation ? (
          <span className="block truncate text-[11.5px] leading-tight text-ink-muted">{organisation}</span>
        ) : null}
      </span>
    </div>
  );
}
