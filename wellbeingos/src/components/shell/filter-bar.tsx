'use client';

import { Select, Button } from '@/components/ui/primitives';
import { SlidersHorizontal } from 'lucide-react';

export interface FilterDef {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

export function FilterBar({
  filters,
  value,
  onChange,
  onReset,
  children,
}: {
  filters: FilterDef[];
  value: Record<string, string>;
  onChange: (key: string, next: string) => void;
  onReset?: () => void;
  children?: React.ReactNode;
}) {
  const active = Object.values(value).filter(Boolean).length;
  return (
    <div className="mb-5 rounded-2xl border border-line bg-surface px-4 py-3.5 shadow-card">
      <div className="flex flex-wrap items-end gap-3">
        <span className="mb-2 hidden items-center gap-1.5 text-[12px] font-medium text-ink-soft sm:flex">
          <SlidersHorizontal size={14} /> Filters
        </span>
        {filters.map((f) => (
          <label key={f.key} className="min-w-[150px] flex-1 sm:flex-none">
            <span className="mb-1 block text-[11.5px] font-medium text-ink-muted">{f.label}</span>
            <Select value={value[f.key] ?? ''} onChange={(e) => onChange(f.key, e.target.value)} className="h-9 py-1.5 text-[13px]">
              <option value="">All</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </label>
        ))}
        {children}
        {onReset && active > 0 ? (
          <Button size="sm" variant="quiet" onClick={onReset} className="mb-0.5">Clear {active}</Button>
        ) : null}
      </div>
    </div>
  );
}
