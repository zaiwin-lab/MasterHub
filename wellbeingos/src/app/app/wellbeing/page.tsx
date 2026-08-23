'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Plus, Sparkles } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { myCheckIns, myConsents, myGoals, myParticipation } from '@/core/data/repository';
import { wellbeingIndexOf } from '@/core/analytics/organisation';
import { PulseLineChart, ChartContainer } from '@/components/charts';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Field, Input, Modal, Progress, Stat, Textarea } from '@/components/ui/primitives';
import { PageHeader, SectionTitle } from '@/components/shell/page-header';
import { PrivacyIndicator } from '@/components/ui/privacy';
import { formatDate } from '@/lib/utils';

const scales = [
  { key: 'energy', label: 'Energy', low: 'Drained', high: 'Energised' },
  { key: 'stress', label: 'Stress', low: 'Calm', high: 'Under pressure' },
  { key: 'activity', label: 'Physical activity', low: 'Very little', high: 'Regular' },
  { key: 'workplace', label: 'Workplace wellbeing', low: 'Difficult', high: 'Good' },
  { key: 'support', label: 'Support at work', low: 'Alone', high: 'Well supported' },
] as const;

export default function WellbeingPage() {
  const { db, config, session, actions } = useStore();
  const [pulseOpen, setPulseOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [answers, setAnswers] = useState({ energy: 3, stress: 3, activity: 3, workplace: 4, support: 4 });
  const [note, setNote] = useState('');
  const [goal, setGoal] = useState({ title: '', metric: '', target: '', dueDate: '' });

  if (!session?.employeeId)
    return (
      <EmptyState
        title="The wellbeing vault belongs to employees"
        description="This account is not linked to an employee record. No role can view another person's vault — that is enforced in the data layer, not just here."
      />
    );
  const t = config.terminology;
  const checkIns = myCheckIns(db, session);
  const goals = myGoals(db, session);
  const consents = myConsents(db, session);
  const shares = consents.find((c) => c.purpose === 'aggregate-wellbeing')?.granted ?? false;
  const participation = myParticipation(db, session);
  const screenings = db.screenings.filter((s) => s.employeeId === session.employeeId);
  const pulseEnabled = config.modules['wellbeing-pulse'];

  const trend = checkIns
    .slice(0, 6)
    .reverse()
    .map((c) => ({ month: formatDate(c.date).slice(0, 6), index: wellbeingIndexOf([c]) }));
  const latestIndex = checkIns.length ? wellbeingIndexOf([checkIns[0]]) : null;

  const saveGoal = () => {
    if (!goal.title.trim() || !goal.target) return;
    actions.addGoal({
      title: goal.title.trim(),
      metric: goal.metric.trim() || 'progress',
      target: Number(goal.target),
      dueDate: goal.dueDate || new Date(db.periodYear, 11, 31).toISOString().slice(0, 10),
    });
    setGoal({ title: '', metric: '', target: '', dueDate: '' });
    setGoalOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="My wellbeing"
        description="This is your personal vault. Your answers, notes and goals stay with you — the organisation only ever sees combined, anonymous patterns, and only if you allow it."
        zone="zone2"
        zoneNote="Employee-owned"
        action={pulseEnabled ? <Button variant="primary" onClick={() => setPulseOpen(true)}>Record a check-in</Button> : undefined}
      />

      <div className="mb-5 rounded-2xl border border-brand/25 bg-brand/[0.05] px-4 py-3.5 sm:px-5">
        <div className="flex flex-wrap items-center gap-3">
          <Lock size={17} className="text-brand" />
          <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-ink">
            {shares
              ? 'You are contributing anonymously to organisational wellbeing patterns. Individual answers are never shown, and groups below the aggregation floor are suppressed entirely.'
              : 'You are not contributing to organisational patterns. Your check-ins remain visible only to you.'}
          </p>
          <Link href="/app/privacy"><Button size="sm" variant="secondary">Manage consent</Button></Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Your latest wellbeing score" value={latestIndex != null ? `${latestIndex}` : '—'} hint={checkIns.length ? `Recorded ${formatDate(checkIns[0].date)}` : 'No check-in yet'} />
        <Stat label="Check-ins recorded" value={`${checkIns.length}`} hint="Private to you" />
        <Stat label="Programmes joined" value={`${participation.length}`} hint="Always voluntary" />
        <Stat label="Screenings attended" value={`${screenings.filter((s) => s.attended).length}`} hint="Results stay with you" />
      </div>

      {pulseEnabled ? (
        <>
          <SectionTitle hint="Only you can see this chart">Your pulse over time</SectionTitle>
          {trend.length >= 2 ? (
            <ChartContainer title="Personal wellbeing trend" subtitle="A composite of energy, stress, activity, workplace and support." height={220}>
              <PulseLineChart data={trend} />
            </ChartContainer>
          ) : (
            <EmptyState
              title="Not enough check-ins yet"
              description="Record a couple of check-ins and your own trend appears here. It is lightweight by design — five sliders, under a minute."
              action={<Button variant="primary" onClick={() => setPulseOpen(true)}>Record a check-in</Button>}
            />
          )}
        </>
      ) : null}

      <SectionTitle hint="Yours to set, yours to change">Personal goals</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {goals.map((g) => (
          <Card key={g.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[14.5px] font-medium text-navy">{g.title}</p>
                <p className="mt-0.5 text-[12.5px] text-ink-muted">Target: {g.target} {g.metric} · due {formatDate(g.dueDate)}</p>
              </div>
              <Badge tone={g.status === 'achieved' ? 'ok' : 'muted'}>{g.status}</Badge>
            </div>
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-[12.5px] text-ink-muted">
                <span>{g.progress} of {g.target}</span>
                <span>{Math.round((g.progress / g.target) * 100)}%</span>
              </div>
              <Progress value={(g.progress / g.target) * 100} tone={g.status === 'achieved' ? 'accent' : 'brand'} />
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => actions.setGoalProgress(g.id, Math.min(g.target, g.progress + 1))} disabled={g.progress >= g.target}>Log progress</Button>
              {g.progress > 0 ? <Button size="sm" variant="quiet" onClick={() => actions.setGoalProgress(g.id, g.progress - 1)}>Undo</Button> : null}
            </div>
          </Card>
        ))}
        <button onClick={() => setGoalOpen(true)} className="flex min-h-[140px] items-center justify-center rounded-2xl border border-dashed border-line bg-surface/50 text-[13.5px] text-ink-muted transition-colors hover:border-brand/40 hover:text-ink">
          <Plus size={16} className="mr-1.5" /> Add a goal
        </button>
      </div>

      {config.modules['health-screening'] ? (
        <>
          <SectionTitle>Screening</SectionTitle>
          <Card>
            <CardHeader title="Your screening record" subtitle="Attendance is shared with the wellbeing team only if you allow it. Readings never are." action={<PrivacyIndicator zone="zone2" />} />
            <CardBody className="pt-2">
              {screenings.length === 0 ? (
                <EmptyState
                  title="No screening on record"
                  description="Screening programmes open to you appear under Programmes. Attendance is voluntary and results belong to you."
                  action={<Link href="/app/programmes"><Button variant="secondary">Browse programmes</Button></Link>}
                />
              ) : (
                <ul className="space-y-3">
                  {screenings.map((s) => (
                    <li key={s.id} className="rounded-xl border border-line bg-canvas/50 px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[13.5px] font-medium text-ink">{db.programmes.find((p) => p.id === s.programmeId)?.name ?? 'Screening'}</p>
                        <Badge tone={s.attended ? 'ok' : 'muted'}>{s.attended ? 'Attended' : 'Registered'}</Badge>
                      </div>
                      <p className="mt-1 text-[12.5px] text-ink-muted">{formatDate(s.date)}</p>
                      {s.attended && s.personalSummary ? (
                        <p className="mt-2 rounded-lg bg-surface px-3 py-2 text-[13px] leading-relaxed text-ink-muted">{s.personalSummary}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </>
      ) : null}

      <p className="mt-6 flex items-start gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-[12.5px] leading-relaxed text-ink-muted">
        <Sparkles size={14} className="mt-0.5 shrink-0 text-brand" />
        This platform is not a medical service. It does not diagnose, and nothing here replaces advice from your own
        doctor. If something is worrying you, please speak to a healthcare professional.
      </p>

      {/* Pulse modal */}
      <Modal
        open={pulseOpen}
        onClose={() => setPulseOpen(false)}
        title={t.pulse}
        description="Five quick sliders. Takes under a minute, and you can skip it any time."
        footer={
          <>
            <Button variant="quiet" onClick={() => setPulseOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                actions.saveCheckIn({
                  date: new Date().toISOString().slice(0, 10),
                  ...answers,
                  note: note.trim() || undefined,
                  shareAggregate: shares,
                });
                setNote('');
                setPulseOpen(false);
              }}
            >
              Save to my vault
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          {scales.map((s) => (
            <div key={s.key}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[13.5px] font-medium text-ink">{s.label}</span>
                <span className="text-[13px] tabular-nums text-ink-muted">{answers[s.key]} / 5</span>
              </div>
              <input
                type="range" min={1} max={5} step={1}
                value={answers[s.key]}
                onChange={(e) => setAnswers((a) => ({ ...a, [s.key]: Number(e.target.value) }))}
                className="w-full accent-[rgb(var(--c-brand))]"
                aria-label={s.label}
              />
              <div className="mt-1 flex justify-between text-[11.5px] text-ink-soft"><span>{s.low}</span><span>{s.high}</span></div>
            </div>
          ))}
          <Field label="Private note" hint="Never leaves your vault — not visible to HR, the wellbeing team or management.">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything you want to remember about this week" />
          </Field>
          <p className="rounded-xl bg-canvas px-4 py-3 text-[12.5px] leading-relaxed text-ink-muted">
            {shares
              ? 'Your answers will contribute anonymously to organisational patterns, combined with at least ' + config.privacy.minimumAggregationGroup + ' others.'
              : 'Aggregate contribution is currently switched off, so this check-in stays entirely private.'}
          </p>
        </div>
      </Modal>

      {/* Goal modal */}
      <Modal
        open={goalOpen}
        onClose={() => setGoalOpen(false)}
        title="Add a personal goal"
        description="Something that matters to you. Progress is private."
        footer={
          <>
            <Button variant="quiet" onClick={() => setGoalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveGoal} disabled={!goal.title.trim() || !goal.target}>Save goal</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Goal" required>
            <Input value={goal.title} onChange={(e) => setGoal((g) => ({ ...g, title: e.target.value }))} placeholder="e.g. Walk 8,000 steps on working days" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Measured in" hint="e.g. days, sessions">
              <Input value={goal.metric} onChange={(e) => setGoal((g) => ({ ...g, metric: e.target.value }))} placeholder="days" />
            </Field>
            <Field label="Target" required>
              <Input type="number" min="1" value={goal.target} onChange={(e) => setGoal((g) => ({ ...g, target: e.target.value }))} placeholder="18" />
            </Field>
          </div>
          <Field label="By when">
            <Input type="date" value={goal.dueDate} onChange={(e) => setGoal((g) => ({ ...g, dueDate: e.target.value }))} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
