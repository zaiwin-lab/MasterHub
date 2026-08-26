'use client';

import Link from 'next/link';
import { useStore } from '@/core/data/store';
import { useT } from '@/lib/use-t';
import { BrandMark } from './brand';

/**
 * The delivery credit is the one place in the platform that carries a hover
 * flourish. It is a signature, so it is allowed one — a single slow light
 * sweep, and nothing else on the page moves.
 */
export function BuildCredit({ className }: { className?: string }) {
  const { config } = useStore();
  const t = useT();
  const { builder, builderUrl } = config.credit;
  return (
    <p className={className}>
      <span className="text-ink-soft">{t('footer.builtBy')} </span>
      {builderUrl ? (
        <a
          href={builderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shine font-display text-[13.5px] font-semibold tracking-tight"
        >
          {builder}
        </a>
      ) : (
        <span className="font-display text-[13.5px] font-semibold tracking-tight text-head">{builder}</span>
      )}
    </p>
  );
}

export function SiteFooter() {
  const { config } = useStore();
  const t = useT();

  const columns: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: t('footer.platform'),
      links: [
        { label: t('nav.overview'), href: '/#overview' },
        { label: t('nav.howItWorks'), href: '/#how-it-works' },
        { label: t('nav.benefits'), href: '/#benefits' },
        { label: t('privacy.eyebrow'), href: '/#privacy' },
      ],
    },
    {
      heading: t('footer.audience'),
      links: [
        { label: t('nav.management'), href: '/for-management' },
        { label: t('nav.employees'), href: '/for-employees' },
        { label: t('nav.signIn'), href: '/signin' },
      ],
    },
    {
      heading: t('footer.help'),
      links: [
        { label: t('nav.support'), href: '/#support' },
        { label: t('support.wa.title'), href: `https://wa.me/${config.support.whatsappNumber}` },
        { label: config.support.helpdeskEmail, href: `mailto:${config.support.helpdeskEmail}` },
      ],
    },
  ];

  return (
    <footer className="relative mt-auto border-t border-line bg-surface/50 no-print">
      <div className="shell py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div className="min-w-0">
            <BrandMark mark={config.logoMark} productName={config.productName} organisation={config.organisationName} />
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-ink-muted">{t('footer.tagline')}</p>
            <p className="mt-4 max-w-sm rounded-xl border border-dashed border-line px-3.5 py-2.5 text-[12px] leading-relaxed text-ink-soft">
              {t('footer.demoNotice')}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.heading} className="min-w-0">
                <p className="label mb-3">{col.heading}</p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith('http') || link.href.startsWith('mailto:') ? (
                        <a
                          href={link.href}
                          target={link.href.startsWith('http') ? '_blank' : undefined}
                          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="break-words text-[13.5px] text-ink-muted transition-colors hover:text-brand"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className="text-[13.5px] text-ink-muted transition-colors hover:text-brand">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line pt-6">
          <p className="text-[13px] text-ink-muted">
            © {config.credit.since} {config.productName}. {t('footer.rights')}
          </p>
          <BuildCredit className="text-[13px]" />
        </div>
      </div>
    </footer>
  );
}
