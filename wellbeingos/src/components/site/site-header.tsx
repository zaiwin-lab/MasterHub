'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { useT } from '@/lib/use-t';
import { BrandMark } from '@/components/shell/brand';
import { LanguageSelector } from '@/components/shell/language-selector';
import { ModeToggle } from '@/components/shell/theme';
import { Button } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';
import type { TranslationKey } from '@/core/i18n';

/**
 * Anchors are absolute (`/#benefits`) rather than bare (`#benefits`) so the
 * same header works from the dedicated audience pages, where a bare hash would
 * scroll to nothing.
 */
const links: { key: TranslationKey; href: string }[] = [
  { key: 'nav.overview', href: '/#overview' },
  { key: 'nav.howItWorks', href: '/#how-it-works' },
  { key: 'nav.benefits', href: '/#benefits' },
  { key: 'nav.management', href: '/for-management' },
  { key: 'nav.employees', href: '/for-employees' },
  { key: 'nav.support', href: '/#support' },
];

export function SiteHeader() {
  const { config, mode, setMode, session } = useStore();
  const t = useT();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const signedIn = !!session;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors no-print',
        scrolled ? 'border-line bg-surface/85 backdrop-blur-xl' : 'border-transparent bg-transparent',
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-[13px] focus:text-onPrimary"
      >
        {t('nav.skip')}
      </a>

      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="shrink-0 rounded-xl" aria-label={config.productName}>
          <BrandMark mark={config.logoMark} productName={config.productName} organisation={config.shortName} />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden min-w-0 flex-1 justify-center xl:flex">
          <ul className="flex items-center gap-0.5">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors',
                      active ? 'text-head' : 'text-ink-muted hover:text-head',
                    )}
                  >
                    {t(link.key)}
                    {active ? (
                      <span className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-brand to-violet" aria-hidden />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSelector className="hidden sm:block" />
          <ModeToggle mode={mode} onChange={setMode} className="hidden sm:grid" />
          <Link href={signedIn ? '/app/overview' : '/signin'} className="hidden sm:block">
            <Button variant="primary" size="sm" className="h-9 px-4">
              {signedIn ? t('nav.dashboard') : t('nav.signIn')} <ArrowRight size={14} />
            </Button>
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label={t('nav.openMenu')}
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface/70 text-ink-muted transition-colors hover:border-brand/40 hover:text-brand xl:hidden"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile & tablet drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-canvas/85 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col border-l border-line bg-surface shadow-lift animate-fade-in">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <BrandMark mark={config.logoMark} productName={config.productName} size="sm" />
              <button
                onClick={() => setOpen(false)}
                aria-label={t('nav.closeMenu')}
                className="rounded-lg p-2 text-ink-muted hover:bg-tint/[0.06] hover:text-head"
              >
                <X size={18} />
              </button>
            </div>

            <nav aria-label="Primary" className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-0.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-[14.5px] font-medium text-ink transition-colors hover:bg-brand/[0.07] hover:text-head"
                    >
                      {t(link.key)}
                      <ArrowRight size={15} className="text-ink-soft" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-3 border-t border-line px-5 py-5">
              <Link href={signedIn ? '/app/overview' : '/signin'} className="block">
                <Button variant="primary" className="w-full">
                  {signedIn ? t('nav.dashboard') : t('nav.signIn')} <ArrowRight size={15} />
                </Button>
              </Link>
              <div className="flex items-center justify-between gap-3">
                <LanguageSelector align="left" />
                <ModeToggle mode={mode} onChange={setMode} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
