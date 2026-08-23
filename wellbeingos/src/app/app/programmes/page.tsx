'use client';

import { useState } from 'react';
import { CalendarDays, Plus, Users } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { can } from '@/core/access/permissions';
import { myParticipation } from '@/core/data/repository';
import { participationBreakdown } from '@/core/analytics/organisation';
import type { WellbeingProgramme } from '@/core/domain/types';
import { Badge, Button, Card, CardBody, EmptyState, Field, Input, Modal, Progress, Select, Table, Td, Textarea, Th } from '@/components/ui/primitives';
import { PageHeader, SectionTitle } from '@/components/shell/page-header';
import { FilterBar } from '@/components/shell/filter-bar';
import { formatDate } from '@/lib/utils';

const emptyForm = {
  name: '', category: '', description: '', targetGroup: 'All staff',
  startDate: '', endDate: '', capacity: '60', organiser: 'Wellbeing Team',
  relatedSignalCode: '', outcomeIndicator: '',
};

export default function ProgrammesPage() {
  const { db, config, session, actions } = useStore();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<WellbeingProgramme | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);

  if (!session) return null;
  const t = config.terminology;
  const manage = can(session, 'programme.manage');
  const mine = myParticipation(db, session);
  const breakdown = participationBreakdown(db, config);

  const rows = db.programmes
    .filter((p) => (filters.category ? p.category === filters.category : true))
    .filter((p) => (filters.status ? p.status === filters.status : true))
    .filter((p) => (manage ? true : p.status !== 'draft'))
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));

  const openCreate = () => {
    setForm({ ...emptyForm, category: config.programmeCategories[0], startDate: new Date().toISOString().slice(0, 10), endDate: new Date(db.periodYear, 11, 15).toISOString().slice(0, 10) });
    setCreating(true);
  };

  const save = () => {
    if (!form.name.trim()) return;
    actions.saveProgramme({
      name: form.name.trim(),
      category: form.category,
      description: form.description,
      targetGroup: form.targetGroup,
      startDate: form.startDate,
      endDate: form.endDate,
      capacity: Number(form.capacity) || 50,
      organiser: form.organiser,
      status: 'open',
      relatedSignalCode: form.relatedSignalCode || undefined,
      outcomeIndicator: form.outcomeIndicator || undefined,
    });
    setCreating(false);
  };

  return (
    <div>
      <PageHeader
        title={t.programmes}
        description={manage
          ? 'Design programmes, link them to an organisational signal and follow participation through to outcome.'
          : 'Programmes open to you. Joining is voluntary, and your registration is not a health disclosure.'}
        zone={manage ? 'zone3' : 'zone1'}
        action={manage ? <Button variant="primary" onClick={openCreate}><Plus size={15} /> New programme</Button> : undefined}
      />

      <FilterBar
        filters={[
          { key: 'category', label: 'Category', options: config.programmeCategories.map((c) => ({ value: c, label: c })) },
          { key: 'status', label: 'Status', options: ['open', 'running', 'completed', 'draft'].map((s) => ({ value: s, label: s })) },
        ]}
        value={filters}
        onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
        onReset={() => setFilters({})}
      />

      {rows.length === 0 ? (
        <EmptyState title="No programmes match" description="Try clearing the filters, or check back when the next campaign opens." icon={<CalendarDays size={26} />} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((p) => {
            const registered = db.participation.filter((x) => x.programmeId === p.id).length;
            const joined = mine.some((x) => x.programmeId === p.id);
            const full = registered >= p.capacity;
            return (
              <Card key={p.id} className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <Badge tone="muted">{p.category}</Badge>
                  <Badge tone={p.status === 'running' ? 'ok' : p.status === 'open' ? 'info' : p.status === 'completed' ? 'muted' : 'warn'}>{p.status}</Badge>
                </div>
                <p className="mt-3 font-display text-[16.5px] leading-tight text-head">{p.name}</p>
                <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-ink-muted">{p.description}</p>

                <dl className="mt-3 space-y-1 text-[12.5px] text-ink-muted">
                  <div className="flex justify-between gap-2"><dt>Dates</dt><dd className="text-ink">{formatDate(p.startDate)} – {formatDate(p.endDate)}</dd></div>
                  <div className="flex justify-between gap-2"><dt>Open to</dt><dd className="text-ink">{p.targetGroup}</dd></div>
                  <div className="flex justify-between gap-2"><dt>Organiser</dt><dd className="text-ink">{p.organiser}</dd></div>
                </dl>

                {manage ? (
                  <div className="mt-3">
                    <div className="mb-1.5 flex justify-between text-[12px] text-ink-muted">
                      <span><Users size={12} className="mr-1 inline" />{registered} registered</span>
                      <span>capacity {p.capacity}</span>
                    </div>
                    <Progress value={(registered / p.capacity) * 100} tone={full ? 'warn' : 'brand'} />
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2 pt-1">
                  {can(session, 'programme.register') && p.status !== 'completed' ? (
                    joined ? (
                      <Button size="sm" variant="quiet" onClick={() => actions.withdrawFromProgramme(p.id)}>Withdraw</Button>
                    ) : (
                      <Button size="sm" variant="primary" onClick={() => actions.registerForProgramme(p.id)} disabled={full}>
                        {full ? 'Fully booked' : 'Join programme'}
                      </Button>
                    )
                  ) : null}
                  {joined ? <Badge tone="accent">You are registered</Badge> : null}
                  {manage ? <Button size="sm" variant="secondary" onClick={() => setEditing(p)}>Manage</Button> : null}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {manage ? (
        <>
          <SectionTitle hint={`Groups below ${config.privacy.minimumAggregationGroup} are suppressed`}>Participation and outcome</SectionTitle>
          <Card>
            <CardBody className="pt-5">
              <Table>
                <thead>
                  <tr><Th>Programme</Th><Th>Category</Th><Th>Status</Th><Th align="right">Registered</Th><Th align="right">Completed</Th><Th align="right">Fill</Th><Th>Outcome indicator</Th></tr>
                </thead>
                <tbody>
                  {breakdown.map((row, i) => (
                    <tr key={row.programme}>
                      <Td className="font-medium">{row.programme}</Td>
                      <Td className="text-ink-muted">{row.category}</Td>
                      <Td><Badge tone={row.status === 'completed' ? 'muted' : 'ok'}>{row.status}</Badge></Td>
                      {row.suppressed ? (
                        <><Td align="right" className="text-ink-soft">—</Td><Td align="right" className="text-ink-soft">—</Td><Td align="right"><Badge tone="muted">Suppressed</Badge></Td></>
                      ) : (
                        <><Td align="right">{row.registered}</Td><Td align="right">{row.completed}</Td><Td align="right">{row.fillPct}%</Td></>
                      )}
                      <Td className="text-ink-muted">{db.programmes[i]?.outcomeIndicator ?? '—'}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </>
      ) : null}

      {/* Create */}
      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New programme"
        description="Linking a programme to a signal turns an observation into a measurable response."
        wide
        footer={<><Button variant="quiet" onClick={() => setCreating(false)}>Cancel</Button><Button variant="primary" onClick={save} disabled={!form.name.trim()}>Create programme</Button></>}
      >
        <div className="space-y-4">
          <Field label="Programme name" required>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Workstation Ergonomics Assessment" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {config.programmeCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Target group">
              <Input value={form.targetGroup} onChange={(e) => setForm((f) => ({ ...f, targetGroup: e.target.value }))} />
            </Field>
            <Field label="Starts"><Input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} /></Field>
            <Field label="Ends"><Input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} /></Field>
            <Field label="Capacity"><Input type="number" min="1" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} /></Field>
            <Field label="Organiser"><Input value={form.organiser} onChange={(e) => setForm((f) => ({ ...f, organiser: e.target.value }))} /></Field>
          </div>
          <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Responds to signal" hint="Creates a tracked intervention against that signal.">
              <Select value={form.relatedSignalCode} onChange={(e) => setForm((f) => ({ ...f, relatedSignalCode: e.target.value }))}>
                <option value="">Not linked to a signal</option>
                {db.signals.map((s) => <option key={s.code} value={s.code}>{s.code} — {s.title}</option>)}
              </Select>
            </Field>
            <Field label="Outcome indicator" hint="What will tell you whether it worked.">
              <Input value={form.outcomeIndicator} onChange={(e) => setForm((f) => ({ ...f, outcomeIndicator: e.target.value }))} placeholder="e.g. Musculoskeletal-related visits" />
            </Field>
          </div>
        </div>
      </Modal>

      {/* Manage existing */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.name ?? ''}
        description="Change the status as the programme progresses."
        footer={<Button variant="secondary" onClick={() => setEditing(null)}>Close</Button>}
      >
        {editing ? (
          <div className="space-y-4">
            <Field label="Status">
              <Select
                value={editing.status}
                onChange={(e) => {
                  actions.saveProgramme({ id: editing.id, status: e.target.value as WellbeingProgramme['status'] });
                  setEditing({ ...editing, status: e.target.value as WellbeingProgramme['status'] });
                }}
              >
                {['draft', 'open', 'running', 'completed', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Capacity">
              <Input
                type="number" min="1" defaultValue={editing.capacity}
                onBlur={(e) => actions.saveProgramme({ id: editing.id, capacity: Number(e.target.value) || editing.capacity })}
              />
            </Field>
            <p className="rounded-xl bg-canvas px-4 py-3 text-[12.5px] leading-relaxed text-ink-muted">
              {db.participation.filter((p) => p.programmeId === editing.id).length} registrations recorded.
              Participation is reported in aggregate only — no attendee list is exposed to management.
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
