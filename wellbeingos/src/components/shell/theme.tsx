'use client';

import { useEffect } from 'react';
import type { ThemeConfig } from '@/core/config/tenant';
import { hexToRgbTriplet } from '@/lib/utils';

const map: Record<keyof ThemeConfig, string> = {
  canvas: '--c-canvas', surface: '--c-surface', line: '--c-line', navy: '--c-navy',
  brand: '--c-brand', accent: '--c-accent', gold: '--c-gold', ink: '--c-ink',
  inkMuted: '--c-ink-muted', inkSoft: '--c-ink-soft', ok: '--c-ok', warn: '--c-warn',
  risk: '--c-risk', info: '--c-info',
};

/** White-labelling in one effect: tenant colours become the design tokens. */
export function TenantTheme({ theme, productName }: { theme: ThemeConfig; productName: string }) {
  useEffect(() => {
    const root = document.documentElement;
    (Object.keys(map) as (keyof ThemeConfig)[]).forEach((key) => {
      root.style.setProperty(map[key], hexToRgbTriplet(theme[key]));
    });
    document.title = `${productName} — WellbeingOS`;
  }, [theme, productName]);
  return null;
}
