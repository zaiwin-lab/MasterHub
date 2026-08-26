'use client';

import { useStore } from '@/core/data/store';
import { useT } from '@/lib/use-t';
import { AudienceCta, AudienceHero, BoundaryBlock, FeatureGrid } from '@/components/site/audience';
import { RadialGauge } from '@/components/ui/gauge';
import { Card } from '@/components/ui/primitives';
import { formatMoney } from '@/lib/utils';

export default function ForEmployeesPage() {
  const { config } = useStore();
  const t = useT();
  const currency = config.terminology.currency;
  const entitlement = config.policies[0].annualAmount;
  // Illustrative only — the public site never reads a person's record.
  const approved = Math.round(entitlement * 0.62);
  const committed = Math.round(entitlement * 0.08);
  const spendable = entitlement - approved - committed;

  const rows = [
    { label: t('aud.entitlement'), value: entitlement, tone: 'text-head' },
    { label: t('aud.used'), value: approved, tone: 'text-ink' },
    { label: t('aud.committed'), value: committed, tone: 'text-warn' },
    { label: t('aud.available'), value: spendable, tone: 'text-brand' },
  ];

  return (
    <>
      <AudienceHero
        accent="brand"
        eyebrow={t('aud.emp.eyebrow')}
        title={t('aud.emp.title')}
        body={t('aud.emp.body')}
        cta={t('panels.emp.cta')}
        href="/signin?panel=employee"
        aside={
          <Card className="card-glow p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="label">{t('aud.walletTitle')}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">{t('aud.walletBody')}</p>
              </div>
              <span className="shrink-0 rounded-full border border-line bg-raised px-2.5 py-0.5 text-[11px] text-ink-soft">
                {t('aud.illustration')}
              </span>
            </div>

            <div className="mt-6 grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
              <div className="mx-auto sm:mx-0">
                <RadialGauge
                  value={Math.round((approved / entitlement) * 100)}
                  size={164}
                  stroke={14}
                  label={t('aud.used')}
                  caption={`${Math.round((approved / entitlement) * 100)}%`}
                  sublabel={formatMoney(entitlement, currency, { compact: true })}
                  segments={[
                    { value: Math.round((approved / entitlement) * 100), tone: 'brand' },
                    { value: Math.round((committed / entitlement) * 100), tone: 'gold' },
                  ]}
                />
              </div>
              <dl className="min-w-0 space-y-2.5">
                {rows.map((r) => (
                  <div key={r.label} className="flex items-baseline justify-between gap-3 border-b border-line/70 pb-2 last:border-0 last:pb-0">
                    <dt className="min-w-0 truncate text-[13px] text-ink-muted">{r.label}</dt>
                    <dd className={`shrink-0 font-display text-[15px] font-semibold tabular-nums ${r.tone}`}>
                      {formatMoney(r.value, currency)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Card>
        }
      />

      <FeatureGrid
        accent="brand"
        title={t('aud.emp.seeTitle')}
        items={[
          t('panels.emp.i1'), t('panels.emp.i2'), t('panels.emp.i3'),
          t('panels.emp.i4'), t('panels.emp.i5'), t('panels.emp.i6'),
        ]}
      />

      <BoundaryBlock
        title={t('aud.emp.assureTitle')}
        body={t('aud.emp.assureBody')}
        items={[t('aud.emp.assure1'), t('aud.emp.assure2'), t('aud.emp.assure3')]}
      />

      <AudienceCta title={t('aud.emp.title')} cta={t('panels.emp.cta')} href="/signin?panel=employee" />
    </>
  );
}
