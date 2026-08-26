'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { useT } from '@/lib/use-t';
import { languageMeta, languages } from '@/core/i18n/languages';
import { cn } from '@/lib/utils';

/**
 * Compact globe menu. Four languages is few enough to show every option at
 * once — a select element would hide the choice behind a native picker that
 * looks different on every platform.
 */
export function LanguageSelector({ align = 'right', className }: { align?: 'left' | 'right'; className?: string }) {
  const { language, setLanguage } = useStore();
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = languageMeta(language);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('lang.change')}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-surface/70 px-2.5 text-[12.5px] font-medium text-ink-muted transition-colors hover:border-brand/40 hover:text-brand"
      >
        <Globe size={15} aria-hidden />
        <span>{active.short}</span>
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={t('lang.label')}
          className={cn(
            'absolute top-11 z-50 w-56 overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-lift animate-fade-in',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          <p className="label px-2.5 py-1.5">{t('lang.label')}</p>
          {languages.map((l) => {
            const selected = l.key === language;
            return (
              <button
                key={l.key}
                role="option"
                aria-selected={selected}
                lang={l.locale}
                onClick={() => {
                  setLanguage(l.key);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-[13.5px] transition-colors',
                  selected ? 'bg-brand/[0.10] font-medium text-head' : 'text-ink-muted hover:bg-tint/[0.06] hover:text-head',
                )}
              >
                <span className="truncate">{l.label}</span>
                {selected ? <Check size={15} className="shrink-0 text-brand" aria-hidden /> : (
                  <span className="shrink-0 text-[11px] text-ink-soft">{l.short}</span>
                )}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
