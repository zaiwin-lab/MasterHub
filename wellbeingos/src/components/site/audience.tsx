'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldOff } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { useT } from '@/lib/use-t';
import { Button, Card } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

/**
 * Shared chrome for the two audience pages. They differ in copy, accent and
 * the panel preview they carry — everything structural is the same, so the
 * pages stay in step as the site evolves.
 */
export function AudienceHero({
  eyebrow, title, body, cta, href, accent, aside,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  accent: 'brand' | 'violet';
  aside: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-field pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div
        className={cn(
          'pointer-events-none absolute -left-44 -top-52 h-[520px] w-[520px] rounded-full blur-[130px]',
          accent === 'violet' ? 'bg-violet/[0.20]' : 'bg-brand/[0.20]',
        )}
        aria-hidden
      />
      <div className="shell relative grid items-center gap-12 pb-14 pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:pb-20 lg:pt-20">
        <div className="min-w-0">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-5 font-display text-[34px] font-semibold leading-[1.08] text-head sm:text-[46px]">{title}</h1>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-muted">{body}</p>
          <div className="mt-8">
            <Link href={href}>
              <Button variant="primary" className="h-12 px-6 text-[14.5px]">
                {cta} <ArrowRight size={17} />
              </Button>
            </Link>
          </div>
        </div>
        <div className="min-w-0">{aside}</div>
      </div>
    </section>
  );
}

export function FeatureGrid({ title, items, accent }: { title: string; items: string[]; accent: 'brand' | 'violet' }) {
  return (
    <section className="band border-y border-line bg-surface/40">
      <div className="shell">
        <h2 className="max-w-2xl font-display text-[28px] font-semibold leading-tight text-head sm:text-[34px]">{title}</h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <li key={item} className="card flex gap-3.5 p-5">
              <CheckCircle2 size={18} className={cn('mt-0.5 shrink-0', accent === 'violet' ? 'text-violet' : 'text-brand')} aria-hidden />
              <span className="min-w-0 text-[14px] leading-relaxed text-ink">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function BoundaryBlock({ title, body, items }: { title: string; body: string; items: string[] }) {
  return (
    <section className="band">
      <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div className="min-w-0">
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-raised text-ink-muted">
            <ShieldOff size={20} aria-hidden />
          </span>
          <h2 className="mt-5 font-display text-[28px] font-semibold leading-tight text-head sm:text-[32px]">{title}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{body}</p>
        </div>
        <ul className="grid min-w-0 content-start gap-3">
          {items.map((item) => (
            <li key={item} className="rounded-2xl border border-dashed border-line bg-surface/50 px-5 py-4 text-[14px] leading-relaxed text-ink">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AudienceCta({ title, cta, href }: { title: string; cta: string; href: string }) {
  const { config } = useStore();
  const t = useT();
  return (
    <section className="pb-20 lg:pb-28">
      <div className="shell">
        <Card className="card-glow relative overflow-hidden px-6 py-12 text-center sm:px-12">
          <div className="grid-field pointer-events-none absolute inset-0 opacity-50" aria-hidden />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-[26px] font-semibold leading-tight text-head sm:text-[32px]">{title}</h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-ink-muted">{config.welcomeText} {t('hero.note')}</p>
            <div className="mt-8">
              <Link href={href}>
                <Button variant="primary" className="h-12 px-6 text-[14.5px]">
                  {cta} <ArrowRight size={17} />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
