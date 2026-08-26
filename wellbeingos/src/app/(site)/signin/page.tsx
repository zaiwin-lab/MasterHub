'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Building2, LayoutGrid, Lock, ShieldCheck } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { useT } from '@/lib/use-t';
import { tenantList } from '@/tenants/registry';
import { DemoAccessModal } from '@/components/site/demo-access';
import { Badge, Button, Card, Field, Input, Skeleton } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

const showPersonas = process.env.NEXT_PUBLIC_ENABLE_DEMO_PERSONAS !== 'false';

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInSkeleton />}>
      <SignIn />
    </Suspense>
  );
}

function SignInSkeleton() {
  return (
    <div className="shell grid gap-10 py-16 lg:grid-cols-2">
      <div className="space-y-4">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
  );
}

function SignIn() {
  const { ready, config, db, session, signIn, switchTenant, tenantId } = useStore();
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [demoOpen, setDemoOpen] = useState(false);

  // A CTA elsewhere on the site can hand the visitor straight to role selection.
  useEffect(() => {
    if (showPersonas && params.get('panel')) setDemoOpen(true);
  }, [params]);

  useEffect(() => {
    if (ready && session) router.replace('/app/overview');
  }, [ready, session, router]);

  if (!ready) return <SignInSkeleton />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      setError(t('signin.noMatch'));
      return;
    }
    signIn(user.id);
    router.push('/app/overview');
  };

  return (
    <div className="relative overflow-hidden">
      <div className="grid-field pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand/[0.18] blur-[120px]" aria-hidden />
      <div className="pointer-events-none absolute -bottom-56 -right-32 h-[520px] w-[520px] rounded-full bg-violet/[0.16] blur-[130px]" aria-hidden />

      <div className="shell relative grid items-center gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16 lg:py-20 xl:gap-24">
        {/* Narrative side — three points, not a directory of staff. */}
        <section className="min-w-0">
          <p className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_1px_rgb(var(--c-brand)/0.9)]" aria-hidden />
            {config.organisationCode} · {config.productName}
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-[32px] font-semibold leading-[1.08] text-head sm:text-[42px]">
            {t('signin.heroTitle')}
          </h1>
          <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-ink-muted">{t('signin.heroBody')}</p>

          <ul className="mt-9 grid max-w-xl gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[
              { icon: LayoutGrid, title: t('panels.emp.title'), body: t('panels.emp.body') },
              { icon: Building2, title: t('panels.mgmt.title'), body: t('panels.mgmt.body') },
              { icon: Lock, title: t('privacy.z2.title'), body: t('privacy.z2.body') },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.title} className="card flex gap-3.5 px-4 py-3.5">
                  <span className="mt-0.5 shrink-0 text-brand">
                    <Icon size={17} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-semibold text-head">{f.title}</span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-ink-muted">{f.body}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Sign-in side */}
        <section className="min-w-0">
          <Card className="p-6 sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-display text-[20px] text-head">{t('signin.title')}</h2>
                <p className="mt-1 text-[13px] text-ink-muted">{t('signin.subtitle')}</p>
              </div>
              <Badge tone="muted">{config.organisationCode}</Badge>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <Field label={t('signin.email')} required error={error || undefined}>
                <Input
                  type="email"
                  value={email}
                  autoComplete="username"
                  placeholder={`name@${config.organisationCode.toLowerCase()}.demo`}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  required
                />
              </Field>
              <Field label={t('signin.password')} hint={t('signin.passwordHint')}>
                <Input type="password" autoComplete="current-password" placeholder={t('signin.passwordPlaceholder')} disabled />
              </Field>
              <Button type="submit" variant="primary" className="h-11 w-full">
                {t('signin.continue')} <ArrowRight size={16} />
              </Button>
            </form>

            {showPersonas ? (
              <div className="mt-6 border-t border-line pt-5">
                <Button variant="secondary" className="h-11 w-full" onClick={() => setDemoOpen(true)}>
                  <LayoutGrid size={16} /> {t('signin.demoCta')}
                </Button>
                <p className="mt-2.5 text-center text-[12px] leading-relaxed text-ink-soft">{t('signin.demoBody')}</p>
              </div>
            ) : null}
          </Card>

          {tenantList.length > 1 ? (
            <Card className="mt-4 p-4">
              <p className="label mb-2.5 flex items-center gap-1.5">
                <Building2 size={13} aria-hidden /> {t('signin.tenant')}
              </p>
              <div className="grid gap-2">
                {tenantList.map((tn) => (
                  <button
                    key={tn.id}
                    onClick={() => switchTenant(tn.id)}
                    aria-pressed={tn.id === tenantId}
                    className={cn(
                      'min-w-0 rounded-xl border px-3 py-2 text-left text-[12.5px] transition-colors',
                      tn.id === tenantId
                        ? 'border-brand bg-primary text-onPrimary'
                        : 'border-line bg-surface text-ink-muted hover:border-brand/40',
                    )}
                  >
                    <span className="block truncate font-medium">{tn.productName}</span>
                    <span className={cn('block truncate text-[11.5px]', tn.id === tenantId ? 'text-white/70' : 'text-ink-soft')}>
                      {tn.organisationName}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-2.5 text-[12px] leading-relaxed text-ink-soft">{t('signin.tenantHint')}</p>
            </Card>
          ) : null}

          <p className="mt-4 flex items-center justify-center gap-2 text-[12.5px] text-ink-soft">
            <ShieldCheck size={14} className="text-brand" aria-hidden />
            {t('hero.note')}
          </p>
          <p className="mt-2 text-center text-[12.5px]">
            <Link href="/#support" className="text-brand hover:underline">
              {t('signin.trouble')}
            </Link>
          </p>
        </section>
      </div>

      {showPersonas ? <DemoAccessModal open={demoOpen} onClose={() => setDemoOpen(false)} /> : null}
    </div>
  );
}
