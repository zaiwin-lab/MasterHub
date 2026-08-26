'use client';

import Link from 'next/link';
import {
  ArrowRight, BarChart3, Building2, CalendarCheck, CheckCircle2, ClipboardCheck,
  FileBarChart, Lock, MessageCircle, Radar, ShieldCheck, Sparkles, Stethoscope,
  TrendingUp, Users, Wallet,
} from 'lucide-react';
import { useStore } from '@/core/data/store';
import { useT } from '@/lib/use-t';
import { Button, Card } from '@/components/ui/primitives';
import { RadialGauge, MeterList } from '@/components/ui/gauge';
import { formatMoney } from '@/lib/utils';
import type { TranslationKey } from '@/core/i18n';

export default function LandingPage() {
  const { config, session } = useStore();
  const t = useT();
  const policy = config.policies[0];
  const currency = config.terminology.currency;

  const howSteps: { icon: typeof Stethoscope; title: TranslationKey; body: TranslationKey }[] = [
    { icon: Stethoscope, title: 'how.s1.title', body: 'how.s1.body' },
    { icon: ClipboardCheck, title: 'how.s2.title', body: 'how.s2.body' },
    { icon: Wallet, title: 'how.s3.title', body: 'how.s3.body' },
    { icon: TrendingUp, title: 'how.s4.title', body: 'how.s4.body' },
    { icon: MessageCircle, title: 'how.s5.title', body: 'how.s5.body' },
    { icon: ShieldCheck, title: 'how.s6.title', body: 'how.s6.body' },
    { icon: Radar, title: 'how.s7.title', body: 'how.s7.body' },
  ];

  const capabilities: { icon: typeof Wallet; title: TranslationKey; body: TranslationKey }[] = [
    { icon: Wallet, title: 'benefits.b1.title', body: 'benefits.b1.body' },
    { icon: CalendarCheck, title: 'benefits.b2.title', body: 'benefits.b2.body' },
    { icon: Stethoscope, title: 'benefits.b3.title', body: 'benefits.b3.body' },
    { icon: ClipboardCheck, title: 'benefits.b4.title', body: 'benefits.b4.body' },
    { icon: Radar, title: 'benefits.b5.title', body: 'benefits.b5.body' },
    { icon: FileBarChart, title: 'benefits.b6.title', body: 'benefits.b6.body' },
  ];

  const zones: { icon: typeof Lock; title: TranslationKey; body: TranslationKey; tone: string }[] = [
    { icon: Building2, title: 'privacy.z1.title', body: 'privacy.z1.body', tone: 'text-info' },
    { icon: Lock, title: 'privacy.z2.title', body: 'privacy.z2.body', tone: 'text-brand' },
    { icon: BarChart3, title: 'privacy.z3.title', body: 'privacy.z3.body', tone: 'text-violet' },
  ];

  return (
    <>
      {/* ================================================================ Hero */}
      <section id="overview" className="relative overflow-hidden">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="pointer-events-none absolute -left-48 -top-56 h-[560px] w-[560px] rounded-full bg-brand/20 blur-[130px]" aria-hidden />
        <div className="pointer-events-none absolute -right-40 top-10 h-[600px] w-[600px] rounded-full bg-violet/[0.18] blur-[140px]" aria-hidden />

        <div className="shell relative grid items-center gap-12 pb-16 pt-14 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-16 lg:pb-20 lg:pt-20 xl:gap-20">
          <div className="min-w-0">
            <p className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_1px_rgb(var(--c-brand)/0.9)]" aria-hidden />
              {t('hero.badge')}
            </p>

            <h1 className="mt-5 font-display text-[38px] font-semibold leading-[1.06] text-head sm:text-[52px] lg:text-[58px]">
              {t('hero.titleLead')}{' '}
              <span className="bg-gradient-to-r from-brand via-brand to-violet bg-clip-text text-transparent">
                {t('hero.titleAccent')}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink-muted sm:text-[17px]">{t('hero.body')}</p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href={session ? '/app/overview' : '/signin?panel=employee'}>
                <Button variant="primary" className="h-12 px-6 text-[14.5px]">
                  {t('hero.employeeCta')} <ArrowRight size={17} />
                </Button>
              </Link>
              <Link href="/for-management">
                <Button variant="secondary" className="h-12 px-6 text-[14.5px]">
                  {t('hero.managementCta')}
                </Button>
              </Link>
            </div>

            <p className="mt-7 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 text-[12.5px] text-ink-muted">
              <ShieldCheck size={14} className="text-brand" aria-hidden />
              {t('hero.note')}
            </p>
          </div>

          {/* Illustrative command deck — the product's own visual language,
              built from tenant configuration rather than live records, because
              this page is public. */}
          <div className="min-w-0">
            <Card className="card-glow overflow-hidden p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="label">{config.organisationCode} · {t('nav.management')}</p>
                  <p className="mt-1 truncate font-display text-[16px] text-head">{t('hero.panelCaption')}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand/25 bg-brand/[0.08] px-2.5 py-1 text-[11px] font-medium text-brand">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" aria-hidden />
                  {t('app.live')}
                </span>
              </div>

              <div className="mt-6 grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
                <div className="mx-auto sm:mx-0">
                  <RadialGauge
                    value={68}
                    size={172}
                    stroke={15}
                    label="Utilised"
                    caption="68%"
                    sublabel={`of ${formatMoney(policy.annualAmount, currency, { compact: true })} entitlement`}
                    segments={[{ value: 68, tone: 'brand' }, { value: 9, tone: 'violet' }]}
                  />
                </div>
                <MeterList
                  items={[
                    { label: 'Forestry Operations', value: 74 },
                    { label: 'Corporate Services', value: 61 },
                    { label: 'Licensing & Enforcement', value: 55 },
                    { label: 'Research & Development', value: 43 },
                  ]}
                  formatValue={(v) => `${v}%`}
                />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2.5 border-t border-line pt-5">
                {[
                  { k: 'Alerts open', v: '12' },
                  { k: 'Exceptions', v: '5' },
                  { k: 'Participation', v: '60%' },
                ].map((s) => (
                  <div key={s.k} className="min-w-0 rounded-xl border border-line bg-raised px-3 py-2.5">
                    <p className="truncate text-[11px] uppercase tracking-[0.1em] text-ink-soft">{s.k}</p>
                    <p className="mt-1 font-display text-[19px] font-semibold tabular-nums text-head">{s.v}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================= Proof band */}
      <section className="border-y border-line bg-surface/45">
        <div className="shell grid gap-px py-0 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t('proof.balance'), value: t('proof.balanceValue'), hint: t('proof.balanceHint') },
            { label: t('proof.thresholds'), value: policy.thresholds.map((th) => th.at).join(' · '), hint: t('proof.thresholdsHint') },
            { label: t('proof.zones'), value: t('proof.zonesValue'), hint: t('proof.zonesHint') },
            { label: t('proof.languages'), value: t('proof.languagesValue'), hint: t('proof.languagesHint') },
          ].map((s) => (
            <div key={s.label} className="min-w-0 border-line px-1 py-7 sm:px-6 lg:border-l lg:first:border-l-0 lg:first:pl-0">
              <p className="label">{s.label}</p>
              <p className="mt-2 font-display text-[26px] font-semibold leading-none tabular-nums text-head">{s.value}</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">{s.hint}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================= How it works */}
      <section id="how-it-works" className="band">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">{t('how.eyebrow')}</p>
            <h2 className="mt-4 font-display text-[30px] font-semibold leading-tight text-head sm:text-[38px]">{t('how.title')}</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-muted">{t('how.body')}</p>
          </div>

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="card group relative overflow-hidden p-5 transition-shadow hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-brand/20 bg-brand/[0.08] text-brand">
                      <Icon size={18} aria-hidden />
                    </span>
                    <span className="font-display text-[26px] font-semibold leading-none text-ink-soft/45 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-4 font-display text-[16px] font-semibold text-head">{t(step.title)}</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{t(step.body)}</p>
                </li>
              );
            })}
            {/* The seventh step leaves a gap in a four-column grid; a route
                onward is a better use of that cell than white space. */}
            <li className="card flex flex-col justify-between bg-gradient-to-br from-brand/[0.10] to-violet/[0.08] p-5">
              <div>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet text-white">
                  <ArrowRight size={18} aria-hidden />
                </span>
                <p className="mt-4 font-display text-[16px] font-semibold text-head">{t('panels.emp.title')}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{t('panels.emp.i1')}</p>
              </div>
              <Link href="/for-employees" className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand hover:underline">
                {t('panels.emp.more')} <ArrowRight size={14} aria-hidden />
              </Link>
            </li>
          </ol>
        </div>
      </section>

      {/* ============================================================ Benefits */}
      <section id="benefits" className="band border-y border-line bg-surface/40">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow">{t('benefits.eyebrow')}</p>
              <h2 className="mt-4 font-display text-[30px] font-semibold leading-tight text-head sm:text-[38px]">{t('benefits.title')}</h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-ink-muted">{t('benefits.body')}</p>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {capabilities.map((c) => {
              const Icon = c.icon;
              return (
                <Card key={c.title} className="p-6 transition-shadow hover:shadow-lift">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand/[0.16] to-violet/[0.14] text-brand">
                    <Icon size={20} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-[17px] font-semibold text-head">{t(c.title)}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">{t(c.body)}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================== Panels */}
      <section id="panels" className="band">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">{t('panels.eyebrow')}</p>
            <h2 className="mt-4 font-display text-[30px] font-semibold leading-tight text-head sm:text-[38px]">{t('panels.title')}</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-muted">{t('panels.body')}</p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <PanelCard
              tone="violet"
              icon={<BarChart3 size={20} aria-hidden />}
              title={t('panels.mgmt.title')}
              body={t('panels.mgmt.body')}
              items={[t('panels.mgmt.i1'), t('panels.mgmt.i2'), t('panels.mgmt.i3'), t('panels.mgmt.i4'), t('panels.mgmt.i5'), t('panels.mgmt.i6')]}
              href="/for-management"
              cta={t('panels.mgmt.more')}
            />
            <PanelCard
              tone="brand"
              icon={<Users size={20} aria-hidden />}
              title={t('panels.emp.title')}
              body={t('panels.emp.body')}
              items={[t('panels.emp.i1'), t('panels.emp.i2'), t('panels.emp.i3'), t('panels.emp.i4'), t('panels.emp.i5'), t('panels.emp.i6')]}
              href="/for-employees"
              cta={t('panels.emp.more')}
            />
          </div>
        </div>
      </section>

      {/* ============================================================= Privacy */}
      <section id="privacy" className="band border-y border-line bg-surface/40">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="min-w-0">
            <p className="eyebrow">{t('privacy.eyebrow')}</p>
            <h2 className="mt-4 font-display text-[30px] font-semibold leading-tight text-head sm:text-[38px]">{t('privacy.title')}</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-muted">{t('privacy.body')}</p>
          </div>
          <ul className="grid min-w-0 gap-4">
            {zones.map((z) => {
              const Icon = z.icon;
              return (
                <li key={z.title} className="card flex gap-4 p-5">
                  <span className={`mt-0.5 shrink-0 ${z.tone}`}>
                    <Icon size={20} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-[15.5px] font-semibold text-head">{t(z.title)}</p>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{t(z.body)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ============================================================= Support */}
      <section id="support" className="band">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">{t('support.eyebrow')}</p>
            <h2 className="mt-4 font-display text-[30px] font-semibold leading-tight text-head sm:text-[38px]">{t('support.title')}</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-muted">{t('support.body')}</p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <Card className="p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet text-white">
                <Sparkles size={19} aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-[17px] font-semibold text-head">{t('support.ai.title')}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">{t('support.ai.body')}</p>
            </Card>

            <Card className="p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ backgroundColor: '#25D366' }}>
                <MessageCircle size={19} aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-[17px] font-semibold text-head">{t('support.wa.title')}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">{t('support.wa.body')}</p>
              <a
                href={`https://wa.me/${config.support.whatsappNumber}?text=${encodeURIComponent(config.support.whatsappPrefill)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand hover:underline"
              >
                {t('support.wa.cta')} <ArrowRight size={14} />
              </a>
            </Card>

            <Card className="p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-raised text-ink-muted">
                <Building2 size={19} aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-[17px] font-semibold text-head">{t('support.desk.title')}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">{t('support.desk.body')}</p>
              <a href={`mailto:${config.support.helpdeskEmail}`} className="mt-4 block break-words text-[13px] font-medium text-brand hover:underline">
                {config.support.helpdeskEmail}
              </a>
              <p className="mt-1.5 text-[12.5px] text-ink-soft">{config.support.helpdeskHours}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* ================================================================= CTA */}
      <section className="pb-20 lg:pb-28">
        <div className="shell">
          <Card className="card-glow relative overflow-hidden px-6 py-12 text-center sm:px-12 lg:py-16">
            <div className="grid-field pointer-events-none absolute inset-0 opacity-50" aria-hidden />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-[28px] font-semibold leading-tight text-head sm:text-[34px]">
                {t('signin.heroTitle')}
              </h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-ink-muted">{t('signin.heroBody')}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href={session ? '/app/overview' : '/signin'}>
                  <Button variant="primary" className="h-12 px-6 text-[14.5px]">
                    {session ? t('nav.dashboard') : t('nav.signIn')} <ArrowRight size={17} />
                  </Button>
                </Link>
                <Link href="/for-employees">
                  <Button variant="secondary" className="h-12 px-6 text-[14.5px]">{t('panels.emp.more')}</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}

function PanelCard({
  tone, icon, title, body, items, href, cta,
}: {
  tone: 'brand' | 'violet';
  icon: React.ReactNode;
  title: string;
  body: string;
  items: string[];
  href: string;
  cta: string;
}) {
  return (
    <Card className="flex flex-col overflow-hidden p-0">
      <div className={`flex items-start gap-4 border-b border-line px-6 py-6 ${tone === 'violet' ? 'bg-violet/[0.06]' : 'bg-brand/[0.06]'}`}>
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white ${tone === 'violet' ? 'bg-gradient-to-br from-violet to-brand' : 'bg-gradient-to-br from-brand to-violet'}`}>
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-[20px] font-semibold text-head">{title}</h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{body}</p>
        </div>
      </div>
      <ul className="flex-1 space-y-2.5 px-6 py-6">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink">
            <CheckCircle2 size={16} className={`mt-0.5 shrink-0 ${tone === 'violet' ? 'text-violet' : 'text-brand'}`} aria-hidden />
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ul>
      <div className="border-t border-line px-6 py-5">
        <Link href={href}>
          <Button variant="secondary" className="w-full sm:w-auto">
            {cta} <ArrowRight size={15} />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
