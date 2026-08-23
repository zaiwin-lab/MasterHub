'use client';

import { useState } from 'react';
import { ArrowRight, Radar, Target, TrendingDown, TrendingUp } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { can } from '@/core/access/permissions';
import type { InsightSignal } from '@/core/domain/types';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Modal, Table, Td, Th } from '@/components/ui/primitives';
import { RequireCapability } from '@/components/shell/require-capability';
import { PageHeader, SectionTitle } from '@/components/shell/page-header';
import { PrivacyIndicator, SuppressedNotice } from '@/components/ui/privacy';
import { formatDate } from '@/lib/utils';

const steps = ['Signal', 'Insight', 'Response', 'Measure'];

function SignalsPageContent() {
  const { db, config, session, actions } = useStore();
  const [open, setOpen] = useState<InsightSignal | null>(null);

  if (!session) return null;
  const canRespond = can(session, 'intervention.manage');
  const floor = config.privacy.minimumAggregationGroup;

  const linkedIntervention = (code: string) => db.interventions.find((i) => i.signalCode === code);

  return (
    <div>
      <PageHeader
        title="Wellbeing intelligence"
        description="Organisational patterns that may justify support or a preventive programme. This is not a diagnostic tool: it describes groups, never individuals, and every response is decided by a person."
        zone="zone3"
        zoneNote="Aggregated patterns"
      />

      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3">
        {steps.map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[12px] font-medium text-brand">{s}</span>
            {i < steps.length - 1 ? <ArrowRight size={14} className="text-ink-soft" /> : null}
          </span>
        ))}
        <span className="ml-auto text-[12.5px] text-ink-muted">Every signal must lead to a measurable organisational action.</span>
      </div>

      {db.signals.length === 0 ? (
        <EmptyState title="Intelligence signals are switched off" description="This module is disabled for this organisation. Enable it under Administration → Modules." icon={<Radar size={26} />} />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {db.signals.map((s) => {
            const delta = s.current - s.previous;
            const suppressed = s.populationSize < floor;
            const intervention = linkedIntervention(s.code);
            return (
              <Card key={s.id} className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-soft">{s.code} · {s.category}</p>
                    <p className="mt-1 font-display text-[16.5px] leading-tight text-navy">{s.title}</p>
                  </div>
                  <Badge tone={s.severity === 'priority' ? 'risk' : s.severity === 'attention' ? 'warn' : 'muted'}>{s.severity}</Badge>
                </div>

                {suppressed ? (
                  <div className="mt-3"><SuppressedNotice reason={`Only ${s.populationSize} people contributed to this signal — below the floor of ${floor}.`} /></div>
                ) : (
                  <>
                    <div className="mt-4 flex items-end gap-4">
                      <div>
                        <p className="label">{s.metricLabel}</p>
                        <p className="mt-1 font-display text-[24px] leading-none text-navy">{s.current}{s.unit === '%' ? '%' : ''}</p>
                      </div>
                      <span className={`mb-1 inline-flex items-center gap-1 text-[13px] font-medium ${delta > 0 ? 'text-warn' : delta < 0 ? 'text-ok' : 'text-ink-muted'}`}>
                        {delta > 0 ? <TrendingUp size={14} /> : delta < 0 ? <TrendingDown size={14} /> : null}
                        {delta > 0 ? '+' : ''}{Math.round(delta * 10) / 10} vs {s.previous}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] text-ink-soft">{s.periodLabel} · {s.scope} · {s.populationSize} people in scope</p>
                  </>
                )}

                <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">{s.observation}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {intervention ? (
                    <Badge tone="ok"><Target size={12} /> Response: {intervention.status}</Badge>
                  ) : (
                    <Badge tone="warn">No response yet</Badge>
                  )}
                  <Button size="sm" variant="quiet" className="ml-auto" onClick={() => setOpen(s)}>Open</Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <SectionTitle hint="What was done, and whether it moved">Interventions and outcomes</SectionTitle>
      <Card>
        <CardHeader title="Intervention register" subtitle="Human oversight is mandatory — each entry records who decided it." action={<PrivacyIndicator zone="zone3" />} />
        <CardBody className="pt-2">
          <Table>
            <thead>
              <tr><Th>Intervention</Th><Th>Signal</Th><Th>Status</Th><Th>Owner</Th><Th>Decided by</Th><Th>Started</Th><Th align="right">Movement</Th></tr>
            </thead>
            <tbody>
              {db.interventions.map((i) => {
                const moved = i.baseline != null && i.latest != null ? i.latest - i.baseline : null;
                return (
                  <tr key={i.id}>
                    <Td className="font-medium">{i.title}</Td>
                    <Td className="text-ink-muted">{i.signalCode}</Td>
                    <Td><Badge tone={i.status === 'closed' ? 'muted' : i.status === 'measuring' ? 'info' : 'ok'}>{i.status}</Badge></Td>
                    <Td className="text-ink-muted">{i.owner}</Td>
                    <Td className="text-ink-muted">{i.decidedBy ?? '—'}</Td>
                    <Td className="whitespace-nowrap text-ink-muted">{formatDate(i.startedAt)}</Td>
                    <Td align="right">{moved == null ? '—' : `${moved > 0 ? '+' : ''}${Math.round(moved * 10) / 10}`}</Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal
        open={!!open}
        onClose={() => setOpen(null)}
        title={open?.title ?? ''}
        description={open ? `${open.code} · detected ${formatDate(open.detectedAt)}` : undefined}
        wide
        footer={
          canRespond && open ? (
            <>
              <Button variant="quiet" onClick={() => setOpen(null)}>Close</Button>
              <Button
                variant="primary"
                onClick={() => {
                  actions.saveProgramme({
                    name: open.recommendedResponse,
                    category: config.programmeCategories[0],
                    description: `${open.organisationalInsight} Created in response to ${open.code}.`,
                    startDate: new Date().toISOString().slice(0, 10),
                    endDate: new Date(db.periodYear, 11, 15).toISOString().slice(0, 10),
                    relatedSignalCode: open.code,
                    outcomeIndicator: open.metricLabel,
                    status: 'open',
                  });
                  setOpen(null);
                }}
              >
                Launch a programme in response
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setOpen(null)}>Close</Button>
          )
        }
      >
        {open ? (
          <ol className="space-y-4">
            {[
              { step: 'Signal', body: open.observation },
              { step: 'Possible organisational insight', body: open.organisationalInsight },
              { step: 'Recommended response', body: open.recommendedResponse },
              { step: 'How it would be measured', body: `${open.metricLabel}, tracked against the current value of ${open.current}${open.unit === '%' ? '%' : ''} for ${open.scope.toLowerCase()}.` },
            ].map((s, i) => (
              <li key={s.step} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand/10 text-[12px] font-semibold text-brand">{i + 1}</span>
                <div>
                  <p className="text-[13.5px] font-medium text-navy">{s.step}</p>
                  <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-muted">{s.body}</p>
                </div>
              </li>
            ))}
            <li className="rounded-xl bg-canvas px-4 py-3 text-[12.5px] leading-relaxed text-ink-muted">
              This signal describes a group of {open.populationSize} people. It does not identify anyone, does not
              constitute a diagnosis, and must not be used to make decisions about an individual&apos;s employment.
            </li>
          </ol>
        ) : null}
      </Modal>
    </div>
  );
}

export default function SignalsPage() {
  return (
    <RequireCapability
      capabilities={['signal.read']}
      title="Wellbeing intelligence is not available for your role"
      description="Organisational signals are visible to the wellbeing team and authorised leadership. They describe groups, never individuals."
    >
      <SignalsPageContent />
    </RequireCapability>
  );
}
