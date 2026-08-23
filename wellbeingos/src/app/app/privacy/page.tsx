'use client';

import { Eye, EyeOff, History, ShieldCheck } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { myConsents } from '@/core/data/repository';
import { zoneDescriptions, zoneLabels } from '@/core/domain/privacy';
import { Badge, Card, CardBody, CardHeader, EmptyState, Table, Td, Th, Toggle } from '@/components/ui/primitives';
import { PageHeader, SectionTitle } from '@/components/shell/page-header';
import { PrivacyIndicator } from '@/components/ui/privacy';
import { formatDateTime } from '@/lib/utils';

export default function PrivacyPage() {
  const { db, config, session, actions } = useStore();
  if (!session?.employeeId)
    return (
      <EmptyState
        title="Consent settings belong to employees"
        description="This account is not linked to an employee record. Organisation-wide consent posture is reported under Reports → Governance & Consent."
      />
    );

  const consents = myConsents(db, session);
  const granted = (purpose: string) => consents.find((c) => c.purpose === purpose)?.granted ?? false;
  const myConsentEvents = db.audit.filter((a) => a.zone === 'zone2' && a.actorId === session.userId);

  return (
    <div>
      <PageHeader
        title="Privacy & consent"
        description="Plain language, not policy language: here is exactly who can see what, and what you control."
        zone="zone2"
        zoneNote="Your choices"
      />

      <SectionTitle hint="Three zones, separated by design">How your information is separated</SectionTitle>
      <div className="grid gap-3 lg:grid-cols-3">
        {(['zone1', 'zone2', 'zone3'] as const).map((zone) => (
          <Card key={zone} className="p-5">
            <PrivacyIndicator zone={zone} />
            <p className="mt-3 font-display text-[16px] leading-tight text-head">{zoneLabels[zone]}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">{zoneDescriptions[zone]}</p>
          </Card>
        ))}
      </div>

      <SectionTitle hint="Nothing hidden">Who sees what</SectionTitle>
      <Card>
        <CardBody className="pt-5">
          <Table className="min-w-[720px]">
            <thead>
              <tr><Th>Audience</Th><Th>Can see</Th><Th>Cannot see</Th></tr>
            </thead>
            <tbody>
              {config.privacy.disclosure.map((d) => (
                <tr key={d.audience}>
                  <Td className="align-top font-medium">{d.audience}</Td>
                  <Td className="align-top">
                    <ul className="space-y-1">
                      {d.canSee.map((s) => (
                        <li key={s} className="flex gap-2 text-[13px] text-ink"><Eye size={14} className="mt-0.5 shrink-0 text-ok" />{s}</li>
                      ))}
                    </ul>
                  </Td>
                  <Td className="align-top">
                    <ul className="space-y-1">
                      {d.cannotSee.map((s) => (
                        <li key={s} className="flex gap-2 text-[13px] text-ink-muted"><EyeOff size={14} className="mt-0.5 shrink-0 text-ink-soft" />{s}</li>
                      ))}
                    </ul>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <SectionTitle hint="Change these any time">Your choices</SectionTitle>
      <Card>
        <CardHeader
          title="Consent settings"
          subtitle={`Every change is recorded in the audit trail with a timestamp. Withdrawing aggregate consent removes your past contributions from organisational analysis immediately.`}
        />
        <CardBody className="divide-y divide-line pt-2">
          {config.privacy.optionalConsents.map((c) => (
            <Toggle
              key={c.purpose}
              checked={granted(c.purpose)}
              onChange={(next) => actions.setConsent(c.purpose, next)}
              label={c.title}
              description={c.description}
            />
          ))}
        </CardBody>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Aggregation floor" subtitle="How small groups are protected." />
          <CardBody className="pt-2">
            <p className="text-[13.5px] leading-relaxed text-ink-muted">
              No organisational figure is displayed for a group smaller than{' '}
              <span className="font-medium text-head">{config.privacy.minimumAggregationGroup} people</span>. Where a
              division, location or programme falls below that, the platform shows{' '}
              <Badge tone="muted">Suppressed</Badge> rather than a rounded number — because a rounded number can still
              identify a person in a small team.
            </p>
            <p className="mt-3 flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-soft">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-brand" />
              Management dashboards are built on this rule, not merely filtered by it.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Retention" subtitle="How long information is kept, per the organisation's policy." />
          <CardBody className="space-y-2 pt-2">
            {[
              { label: 'Transaction and claim records', months: config.privacy.retentionMonths.transactions },
              { label: 'Wellbeing vault entries', months: config.privacy.retentionMonths.wellbeing },
              { label: 'Audit events', months: config.privacy.retentionMonths.audit },
            ].map((r) => (
              <div key={r.label} className="flex items-baseline justify-between gap-3 border-b border-line/70 pb-2 last:border-0">
                <span className="text-[13px] text-ink-muted">{r.label}</span>
                <span className="text-[13.5px] text-ink">{Math.round(r.months / 12)} years</span>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <SectionTitle hint="Your own record of consent changes">Consent history</SectionTitle>
      <Card>
        <CardBody className="pt-5">
          {myConsentEvents.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-[13px] text-ink-muted">
              No changes recorded yet. Any consent change you make appears here immediately.
            </p>
          ) : (
            <ul className="space-y-2">
              {myConsentEvents.slice(0, 10).map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line px-4 py-3">
                  <span className="flex items-center gap-2 text-[13px] text-ink"><History size={14} className="text-ink-soft" />{a.summary}</span>
                  <span className="text-[12px] text-ink-soft">{formatDateTime(a.at)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
