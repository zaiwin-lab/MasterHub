import type { Config } from 'tailwindcss';

/**
 * Design tokens resolve to CSS custom properties so a tenant can be re-branded
 * at runtime from TenantConfig.theme (see src/core/config/theme.ts) without a
 * rebuild. Values are stored as "R G B" triplets so Tailwind alpha modifiers
 * (e.g. bg-brand/10) keep working.
 */
const withAlpha = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: withAlpha('--c-canvas'),
        surface: withAlpha('--c-surface'),
        line: withAlpha('--c-line'),
        navy: withAlpha('--c-navy'),
        brand: withAlpha('--c-brand'),
        accent: withAlpha('--c-accent'),
        gold: withAlpha('--c-gold'),
        ink: {
          DEFAULT: withAlpha('--c-ink'),
          muted: withAlpha('--c-ink-muted'),
          soft: withAlpha('--c-ink-soft'),
        },
        ok: withAlpha('--c-ok'),
        warn: withAlpha('--c-warn'),
        risk: withAlpha('--c-risk'),
        info: withAlpha('--c-info'),
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.125rem', '3xl': '1.5rem' },
      boxShadow: {
        card: '0 1px 2px rgba(18,35,58,0.04), 0 10px 28px -18px rgba(18,35,58,0.28)',
        lift: '0 2px 6px rgba(18,35,58,0.06), 0 22px 48px -22px rgba(18,35,58,0.34)',
        ring: '0 0 0 1px rgb(var(--c-line))',
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'none' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'fade-up': 'fade-up .4s cubic-bezier(.2,.8,.2,1) both',
        'fade-in': 'fade-in .25s ease both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
