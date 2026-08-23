'use client';

import Link from 'next/link';
import { ArrowRight, Radar, Sparkles } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { orgOverview, participationBreakdown, pulseTrend } from '@/core/analytics/organisation';
import { ChartContainer, ParticipationChart, PulseLineChart } from '@/components/charts';
import { Badge, Button, Card, CardBody, CardHeader, Stat, Table, Td, Th } from '@/components/ui/primitives';
import { PrivacyIndicator, SuppressedNotice } from '@/components/ui/privacy';
import { SectionTitle } from '@/components/shell/page-header';
import { formatDate } from '@/lib/utils';

export function WellbeingDashboard() {
  const { db, config } = useStore();
  const overview = orgOverview(db, config);
  const participation = participationBreakdown(db, config);
  const pulse = pulseTrend(db, config);
  const openSignals = db.signals.filter((s) => s.severity !== 'watch');

  return (
    <div>
      <header className="mb-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-display text-[22px] leading-tight text-head sm:text-[26px]">Wellbeing team</h1>
          <PrivacyIndicator zone="zone3" note="Aggregated and consented data only" />
        </div>
        <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-ink-muted">
          Programmes, participation and organisational signals. Individual pulse answers and screening results are
          never visible here — the platform is built to make that impossible, not merely discouraged.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Programmes running" value={`${db.programmes.filter((p) => p.status === 'running' || p.status === 'open').length}`} hint={`${db.programmes.length} in total this period`} />
        <Stat label="Programme participation" value={`${overview.programmeParticipationPct}%`} hint="Of eligible staff" />
        <Stat label="Screening participation" value={`${overview.screeningParticipationPct}%`} hint="Attendance only, never results" />
        <Stat
          label="Wellbeing index"
          value={overview.wellbeingIndex.suppressed ? 'Suppressed' : `${overview.wellbeingIndex.value}`}
          hint={overview.wellbeingIndex.suppressed ? overview.wellbeingIndex.reason : `${overview.wellbeingIndex.populationSize} consented respondents`}
        />
      </div>

      <SectionTitle hint="Signal → insight → response → measure">Signals awaiting a response</SectionTitle>
      <div className="grid gap-3 lg:grid-cols-2">
        {openSignals.map((s) => (
          <Card key={s.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Radar size={15} className="text-brand" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-soft">{s.code}</p>
                </div>
                <p className="mt-1 font-display text-[16px] leading-tight text-head">{s.title}</p>
              </div>
              <Badge tone={s.severity === 'priority' ? 'risk' : 'warn'}>{s.severity}</Badge>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">{s.observation}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink"><span className="font-medium text-head">Possible insight:</span> {s.organisationalInsight}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink"><span className="font-medium text-head">Recommended response:</span> {s.recommendedResponse}</p>
            <Link href="/app/signals" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand hover:underline">
              Open intelligence view <ArrowRight size={14} />
            </Link>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ChartContainer title="Participation by programme" subtitle="Registered and completed" height={300}>
          <ParticipationChart data={participation.filter((p) => !p.suppressed).map((p) => ({ programme: p.programme, registered: p.registered, completed: p.completed }))} />
        </ChartContainer>

        <Card>
          <CardHeader title="Aggregated wellbeing trend" subtitle="Consented responses only" action={<PrivacyIndicator zone="zone3" />} />
          <CardBody className="pt-2">
            {pulse.suppressed || !pulse.value?.length ? (
              <SuppressedNotice reason={pulse.reason} />
            ) : (
              <div style={{ height: 240 }}><PulseLineChart data={pulse.value} /></div>
            )}
          </CardBody>
        </Card>
      </div>

      <SectionTitle hint="Human decision recorded for every intervention">Interventions</SectionTitle>
      <Card>
        <CardBody className="pt-5">
          <Table>
            <thead>
              <tr><Th>Intervention</Th><Th>Signal</Th><Th>Status</Th><Th>Owner</Th><Th>Started</Th><Th align="right">Baseline → latest</Th></tr>
            </thead>
            <tbody>
              {db.interventions.map((i) => (
                <tr key={i.id}>
                  <Td className="font-medium">{i.title}</Td>
                  <Td className="text-ink-muted">{i.signalCode}</Td>
                  <Td><Badge tone={i.status === 'closed' ? 'muted' : i.status === 'measuring' ? 'info' : 'ok'}>{i.status}</Badge></Td>
                  <Td className="text-ink-muted">{i.owner}</Td>
                  <Td className="text-ink-muted">{formatDate(i.startedAt)}</Td>
                  <Td align="right">{i.baseline != null && i.latest != null ? `${i.baseline} → ${i.latest}` : '—'}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-line bg-canvas/60 px-4 py-3 text-[12.5px] leading-relaxed text-ink-muted">
            <Sparkles size={14} className="mt-0.5 shrink-0 text-brand" />
            The platform surfaces organisational patterns and suggests organisational responses. It does not diagnose
            individuals or recommend clinical treatment, and every intervention records the person who decided it.
          </p>
        </CardBody>
      </Card>

      <div className="mt-4">
        <Link href="/app/programmes"><Button variant="primary">Manage programmes <ArrowRight size={15} /></Button></Link>
      </div>
    </div>
  );
}
