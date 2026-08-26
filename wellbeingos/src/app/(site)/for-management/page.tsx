'use client';

import { useStore } from '@/core/data/store';
import { useT } from '@/lib/use-t';
import { AudienceCta, AudienceHero, BoundaryBlock, FeatureGrid } from '@/components/site/audience';
import { MeterList, RadialGauge } from '@/components/ui/gauge';
import { Card } from '@/components/ui/primitives';
import { formatMoney } from '@/lib/utils';

export default function ForManagementPage() {
  const { config } = useStore();
  const t = useT();
  const policy = config.policies[0];
  const currency = config.terminology.currency;

  return (
    <>
      <AudienceHero
        accent="violet"
        eyebrow={t('aud.mgmt.eyebrow')}
        title={t('aud.mgmt.title')}
        body={t('aud.mgmt.body')}
        cta={t('panels.mgmt.cta')}
        href="/signin?panel=management"
        aside={
          <Card className="card-glow p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="label">{config.organisationCode} · {t('panels.mgmt.title')}</p>
              <span className="rounded-full border border-line bg-raised px-2.5 py-0.5 text-[11px] text-ink-soft">
                {t('aud.illustration')}
              </span>
            </div>
            <div className="mt-5 grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
              <div className="mx-auto sm:mx-0">
                <RadialGauge
                  value={68}
                  size={164}
                  stroke={14}
                  tone="violet"
                  label={t('aud.used')}
                  caption="68%"
                  sublabel={`${formatMoney(policy.annualAmount, currency, { compact: true })} ${t('aud.entitlement').toLowerCase()}`}
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
              {config.managementKpis.slice(0, 3).map((kpi, i) => (
                <div key={kpi.key} className="min-w-0 rounded-xl border border-line bg-raised px-3 py-2.5">
                  <p className="truncate text-[11px] uppercase tracking-[0.08em] text-ink-soft">{kpi.label}</p>
                  <p className="mt-1 font-display text-[18px] font-semibold tabular-nums text-head">
                    {['68%', '12', '5'][i]}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        }
      />

      <FeatureGrid
        accent="violet"
        title={t('aud.mgmt.seeTitle')}
        items={[
          t('panels.mgmt.i1'), t('panels.mgmt.i2'), t('panels.mgmt.i3'),
          t('panels.mgmt.i4'), t('panels.mgmt.i5'), t('panels.mgmt.i6'),
        ]}
      />

      <BoundaryBlock
        title={t('aud.mgmt.notTitle')}
        body={t('aud.mgmt.notBody')}
        items={[t('aud.mgmt.not1'), t('aud.mgmt.not2'), t('aud.mgmt.not3')]}
      />

      <AudienceCta title={t('aud.mgmt.title')} cta={t('panels.mgmt.cta')} href="/signin?panel=management" />
    </>
  );
}
