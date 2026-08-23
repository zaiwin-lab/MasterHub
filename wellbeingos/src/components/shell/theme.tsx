'use client';

import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import type { TenantConfig, ThemeConfig } from '@/core/config/tenant';
import type { Mode } from '@/core/data/store';
import { hexToRgbTriplet } from '@/lib/utils';

const map: Record<keyof ThemeConfig, string> = {
  canvas: '--c-canvas', surface: '--c-surface', raised: '--c-raised', line: '--c-line',
  head: '--c-head', primary: '--c-primary', onPrimary: '--c-on-primary', tint: '--c-tint',
  brand: '--c-brand', violet: '--c-violet', gold: '--c-gold', ink: '--c-ink',
  inkMuted: '--c-ink-muted', inkSoft: '--c-ink-soft', ok: '--c-ok', warn: '--c-warn',
  risk: '--c-risk', info: '--c-info',
};

/**
 * White-labelling in one effect: the tenant's palette for the active mode
 * becomes the design tokens. No component knows which mode is showing.
 */
export function TenantTheme({ config, mode }: { config: TenantConfig; mode: Mode }) {
  useEffect(() => {
    const root = document.documentElement;
    const palette = mode === 'dark' ? config.theme : config.themeLight;
    (Object.keys(map) as (keyof ThemeConfig)[]).forEach((key) => {
      root.style.setProperty(map[key], hexToRgbTriplet(palette[key]));
    });
    root.dataset.mode = mode;
    document.title = `${config.productName} — WellbeingOS`;
  }, [config, mode]);
  return null;
}

/** Sun/moon control. Presentation mode is a viewing preference, not a setting. */
export function ModeToggle({ mode, onChange, className }: { mode: Mode; onChange: (next: Mode) => void; className?: string }) {
  const next = mode === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={() => onChange(next)}
      aria-label={`Switch to ${next} presentation`}
      title={`Switch to ${next} presentation`}
      className={`grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface/70 text-ink-muted transition-colors hover:border-brand/40 hover:text-brand ${className ?? ''}`}
    >
      {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
