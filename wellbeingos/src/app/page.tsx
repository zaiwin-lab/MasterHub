'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, Building2 } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { roleDescriptions, roleLabels } from '@/core/access/permissions';
import { tenantList } from '@/tenants/registry';
import { BrandMark } from '@/components/shell/brand';
import { TenantTheme } from '@/components/shell/theme';
import { Badge, Button, Card, Field, Input, Skeleton } from '@/components/ui/primitives';
import { cn, initials } from '@/lib/utils';

const showPersonas = process.env.NEXT_PUBLIC_ENABLE_DEMO_PERSONAS !== 'false';

export default function SignInPage() {
  const { ready, config, db, session, signIn, switchTenant, tenantId } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (ready && session) router.replace('/app/overview');
  }, [ready, session, router]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-md space-y-4 p-8">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      setError('No account matches that address for this organisation.');
      return;
    }
    signIn(user.id);
    router.push('/app/overview');
  };

  return (
    <div className="min-h-screen bg-canvas">
      <TenantTheme theme={config.theme} productName={config.productName} />

      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-16">
        {/* Narrative side */}
        <section className="min-w-0">
          <BrandMark mark={config.logoMark} productName={config.productName} organisation={config.organisationName} size="lg" />

          <h1 className="mt-8 font-display text-[30px] leading-[1.15] text-navy sm:text-[40px]">
            {config.tagline}
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-muted">
            {config.welcomeText} One place to see your entitlement, what you have used and what remains — with
            wellbeing support that respects what stays private.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { title: 'Continuous visibility', body: 'Balances update as visits are approved, not at year end.' },
              { title: 'Early exception handling', body: 'Thresholds surface issues while they are still small.' },
              { title: 'Privacy by design', body: 'Three zones separate administration, personal vault and organisational insight.' },
              { title: 'Configurable, not custom', body: 'A second organisation is configuration, not a rebuild.' },
            ].map((f) => (
              <li key={f.title} className="rounded-2xl border border-line bg-surface/70 px-4 py-3.5">
                <p className="text-[13.5px] font-semibold text-navy">{f.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{f.body}</p>
              </li>
            ))}
          </ul>

          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12px] text-ink-muted">
            <ShieldCheck size={14} className="text-brand" />
            Powered by WellbeingOS · demonstration data is fictional
          </p>
        </section>

        {/* Sign-in side */}
        <section className="min-w-0">
          <Card className="p-6 sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-[19px] text-navy">Sign in</h2>
                <p className="mt-1 text-[13px] text-ink-muted">Use your organisation account.</p>
              </div>
              <Badge tone="muted">{config.organisationCode}</Badge>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <Field label="Work email" required error={error || undefined}>
                <Input
                  type="email"
                  value={email}
                  autoComplete="username"
                  placeholder={`name@${config.organisationCode.toLowerCase()}.demo`}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  required
                />
              </Field>
              <Field label="Password" hint="Single sign-on is the intended production path — see docs/INTEGRATIONS.md.">
                <Input type="password" autoComplete="current-password" placeholder="Not required in the demonstration build" disabled />
              </Field>
              <Button type="submit" variant="primary" className="w-full">
                Continue <ArrowRight size={16} />
              </Button>
            </form>

            {showPersonas ? (
              <div className="mt-7 border-t border-line pt-5">
                <p className="label mb-3">Demonstration personas</p>
                <ul className="grid gap-2">
                  {db.users.map((user) => (
                    <li key={user.id} className="min-w-0">
                      <button
                        onClick={() => { signIn(user.id); router.push('/app/overview'); }}
                        className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-left transition-colors hover:border-navy/25 hover:bg-canvas"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy/[0.06] text-[11px] font-semibold text-navy">
                          {initials(user.name)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-medium text-ink">{user.name}</span>
                          <span className="block truncate text-[12px] text-ink-muted">
                            {user.roles.map((r) => roleLabels[r]).join(' · ')} — {roleDescriptions[user.roles[0]]}
                          </span>
                        </span>
                        <ArrowRight size={15} className="shrink-0 text-ink-soft" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Card>

          {tenantList.length > 1 ? (
            <Card className="mt-4 p-4">
              <p className="label mb-2 flex items-center gap-1.5"><Building2 size={13} /> Deployed organisation</p>
              <div className="flex flex-wrap gap-2">
                {tenantList.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => switchTenant(t.id)}
                    className={cn(
                      'min-w-0 max-w-full flex-1 basis-[13rem] rounded-xl border px-3 py-2 text-left text-[12.5px] transition-colors',
                      t.id === tenantId ? 'border-navy bg-navy text-white' : 'border-line bg-surface text-ink-muted hover:border-navy/25',
                    )}
                  >
                    <span className="block font-medium">{t.productName}</span>
                    <span className={cn('block text-[11.5px]', t.id === tenantId ? 'text-white/70' : 'text-ink-soft')}>{t.organisationName}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2.5 text-[12px] leading-relaxed text-ink-soft">
                The same engine, configured differently — branding, entitlement, thresholds, structure and modules
                all come from tenant configuration.
              </p>
            </Card>
          ) : null}
        </section>
      </div>
    </div>
  );
}
