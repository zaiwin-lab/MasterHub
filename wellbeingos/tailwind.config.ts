import type { Config } from 'tailwindcss';

/**
 * Tokens resolve to CSS custom properties so a tenant can be re-skinned at
 * runtime from TenantConfig.theme without a rebuild. Values are "R G B"
 * triplets so Tailwind alpha modifiers (bg-brand/10) keep working.
 *
 * The palette is semantic rather than literal — `head`, `primary`, `tint` —
 * so the same components render correctly on a dark or a light canvas.
 */
const t = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: t('--c-canvas'),
        surface: t('--c-surface'),
        raised: t('--c-raised'),
        line: t('--c-line'),
        head: t('--c-head'),
        primary: t('--c-primary'),
        onPrimary: t('--c-on-primary'),
        /** Neutral wash for hovers and overlays — light on dark, dark on light. */
        tint: t('--c-tint'),
        brand: t('--c-brand'),
        violet: t('--c-violet'),
        gold: t('--c-gold'),
        ink: {
          DEFAULT: t('--c-ink'),
          muted: t('--c-ink-muted'),
          soft: t('--c-ink-soft'),
        },
        ok: t('--c-ok'),
        warn: t('--c-warn'),
        risk: t('--c-risk'),
        info: t('--c-info'),
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.125rem', '3xl': '1.5rem' },
      boxShadow: {
        card: 'var(--card-shadow)',
        lift: 'var(--card-lift)',
        glow: '0 0 0 1px rgb(var(--c-brand) / 0.28), 0 12px 40px -12px rgb(var(--c-brand) / 0.45)',
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'none' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        sweep: { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(200%)' } },
      },
      animation: {
        'fade-up': 'fade-up .45s cubic-bezier(.2,.8,.2,1) both',
        'fade-in': 'fade-in .3s ease both',
        sweep: 'sweep 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
