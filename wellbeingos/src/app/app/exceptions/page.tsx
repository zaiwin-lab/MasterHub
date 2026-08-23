'use client';

import { useMemo, useState } from 'react';
import { Inbox } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { can, roleLabels } from '@/core/access/permissions';
import { listExceptions } from '@/core/data/repository';
import type { ExceptionCase } from '@/core/domain/types';
import { Badge, Button, Card, CardBody, EmptyState, Field, Modal, Select, Stat, Table, Td, Textarea, Th } from '@/components/ui/primitives';
import { RequireCapability } from '@/components/shell/require-capability';
import { PageHeader } from '@/components/shell/page-header';
import { FilterBar } from '@/components/shell/filter-bar';
import { formatDate, formatDateTime, relativeTime } from '@/lib/utils';

const categories: ExceptionCase['category'][] = [
  'threshold-approaching', 'benefit-exhausted', 'unusual-transaction', 'eligibility-mismatch',
  'duplicate-submission', 'missing-information', 'pending-approval', 'policy-exception', 'recovery-case',
];

const label = (s: string) => s.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());

function ExceptionsPageContent() {
  const { db, session, actions } = useStore();
  const [filters, setFilters] = useState<Record<string, string>>({ status: 'open' });
  const [open, setOpen] = useState<ExceptionCase | null>(null);
  const [comment, setComment] = useState('');
  const [resolution, setResolution] = useState('');

  // Hooks run before any early return so hook order is stable across renders.
  const rows = useMemo(
    () => (!session ? [] : listExceptions(db, session, {
      status: (filters.status || undefined) as ExceptionCase['status'],
      category: filters.category || undefined,
      priority: filters.priority || undefined,
      ownerRole: filters.ownerRole || undefined,
    })),
    [db, session, filters],
  );

  if (!session) return null;
  const manage = can(session, 'exception.manage');
  const all = listExceptions(db, session);
  const current = open ? db.exceptions.find((e) => e.id === open.id) ?? open : null;
  const subject = current?.subjectEmployeeId ? db.employees.find((e) => e.id === current.subjectEmployeeId) : undefined;

  return (
    <div>
      <PageHeader
        title="Exception centre"
        description="Issues surfaced early and handled through the year — the alternative to reconciling a year of surprises in December."
        zone="zone1"
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Open" value={`${all.filter((e) => e.status === 'open').length}`} tone={all.filter((e) => e.status === 'open').length > 15 ? 'warn' : undefined} />
        <Stat label="In progress" value={`${all.filter((e) => e.status === 'in-progress').length}`} />
        <Stat label="High priority" value={`${all.filter((e) => e.priority === 'high' && e.status !== 'resolved').length}`} tone="risk" />
        <Stat label="Resolved this period" value={`${all.filter((e) => e.status === 'resolved').length}`} tone="ok" />
      </div>

      <FilterBar
        filters={[
          { key: 'status', label: 'Status', options: ['open', 'in-progress', 'resolved', 'dismissed'].map((v) => ({ value: v, label: label(v) })) },
          { key: 'category', label: 'Category', options: categories.map((c) => ({ value: c, label: label(c) })) },
          { key: 'priority', label: 'Priority', options: ['high', 'medium', 'low'].map((v) => ({ value: v, label: label(v) })) },
          { key: 'ownerRole', label: 'Owner', options: ['hr', 'finance', 'wellbeing', 'admin'].map((v) => ({ value: v, label: roleLabels[v as 'hr'] })) },
        ]}
        value={filters}
        onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
        onReset={() => setFilters({})}
      />

      <Card>
        <CardBody className="pt-5">
          {rows.length === 0 ? (
            <EmptyState
              title="Nothing in this queue"
              description="No exception matches these filters. That is the goal — issues resolved as they appear rather than accumulating."
              icon={<Inbox size={26} />}
            />
          ) : (
            <Table>
              <thead>
                <tr><Th>Reference</Th><Th>Case</Th><Th>Category</Th><Th>Priority</Th><Th>Owner</Th><Th>Status</Th><Th>Opened</Th><Th /></tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.id} className="transition-colors hover:bg-canvas/60">
                    <Td className="whitespace-nowrap font-medium">{e.reference}</Td>
                    <Td className="max-w-[300px] truncate">{e.title}</Td>
                    <Td className="whitespace-nowrap text-ink-muted">{label(e.category)}</Td>
                    <Td><Badge tone={e.priority === 'high' ? 'risk' : e.priority === 'medium' ? 'warn' : 'muted'}>{e.priority}</Badge></Td>
                    <Td className="text-ink-muted">{roleLabels[e.ownerRole]}</Td>
                    <Td><Badge tone={e.status === 'resolved' ? 'ok' : e.status === 'in-progress' ? 'info' : e.status === 'dismissed' ? 'muted' : 'warn'}>{label(e.status)}</Badge></Td>
                    <Td className="whitespace-nowrap text-ink-muted">{relativeTime(e.openedAt)}</Td>
                    <Td align="right"><Button size="sm" variant="quiet" onClick={() => { setOpen(e); setComment(''); setResolution(e.resolution ?? ''); }}>Open</Button></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Modal
        open={!!current}
        onClose={() => setOpen(null)}
        title={current?.reference ?? ''}
        description={current?.title}
        wide
        footer={
          manage && current ? (
            <>
              <Button variant="secondary" onClick={() => actions.updateException(current.id, { status: 'in-progress' })} disabled={current.status === 'in-progress'}>Take ownership</Button>
              <Button variant="quiet" onClick={() => actions.updateException(current.id, { status: 'dismissed', resolution: resolution || 'Dismissed — no action required.' })}>Dismiss</Button>
              <Button variant="primary" onClick={() => actions.updateException(current.id, { status: 'resolved', resolution: resolution || 'Resolved.' })}>Mark resolved</Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setOpen(null)}>Close</Button>
          )
        }
      >
        {current ? (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge tone={current.priority === 'high' ? 'risk' : current.priority === 'medium' ? 'warn' : 'muted'}>{current.priority} priority</Badge>
              <Badge tone="muted">{label(current.category)}</Badge>
              <Badge tone={current.status === 'resolved' ? 'ok' : 'info'}>{label(current.status)}</Badge>
              <Badge tone="muted">Owner: {roleLabels[current.ownerRole]}</Badge>
            </div>

            <p className="text-[13.5px] leading-relaxed text-ink">{current.detail}</p>

            <div className="grid gap-3 sm:grid-cols-3">
              {subject ? <Detail label="Subject" value={`${subject.name} · ${subject.staffNo}`} /> : null}
              <Detail label="Opened" value={formatDate(current.openedAt)} />
              <Detail label="Last updated" value={formatDate(current.updatedAt)} />
            </div>

            {manage ? (
              <Field label="Resolution note" hint="Recorded on the case and in the audit trail.">
                <Textarea value={resolution} onChange={(e) => setResolution(e.target.value)} placeholder="What was done, and what happens next." />
              </Field>
            ) : null}

            <div>
              <p className="label mb-2">Case history</p>
              <ol className="space-y-3 border-l border-line pl-4">
                <li className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-brand" />
                  <p className="text-[13.5px] font-medium text-ink">Raised</p>
                  <p className="text-[12.5px] text-ink-muted">{formatDateTime(current.openedAt)}</p>
                </li>
                {current.comments.map((c) => (
                  <li key={c.id} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-tint/30" />
                    <p className="text-[13.5px] text-ink">{c.body}</p>
                    <p className="text-[12.5px] text-ink-muted">{formatDateTime(c.at)} · {db.users.find((u) => u.id === c.actorId)?.name ?? 'System'}</p>
                  </li>
                ))}
                {current.resolvedAt ? (
                  <li className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-ok" />
                    <p className="text-[13.5px] font-medium text-ink">{label(current.status)}</p>
                    <p className="text-[12.5px] text-ink-muted">{formatDateTime(current.resolvedAt)}</p>
                    {current.resolution ? <p className="mt-1 rounded-lg bg-canvas px-3 py-2 text-[12.5px] text-ink-muted">{current.resolution}</p> : null}
                  </li>
                ) : null}
              </ol>
            </div>

            {manage ? (
              <div className="flex flex-wrap items-end gap-2">
                <Field label="Add a comment" className="min-w-[220px] flex-1">
                  <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Note for the case history" className="min-h-[64px]" />
                </Field>
                <Button
                  variant="secondary"
                  className="mb-0.5"
                  disabled={!comment.trim()}
                  onClick={() => { actions.commentOnException(current.id, comment.trim()); setComment(''); }}
                >
                  Add
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function Detail({ label: l, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label">{l}</p>
      <p className="mt-1 text-[13.5px] text-ink">{value}</p>
    </div>
  );
}

export default function ExceptionsPage() {
  return (
    <RequireCapability
      capabilities={['exception.read']}
      title="Exception centre not available"
      description="The exception queue is available to roles that handle benefit administration."
    >
      <ExceptionsPageContent />
    </RequireCapability>
  );
}
