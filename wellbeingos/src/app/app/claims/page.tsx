'use client';

import { useMemo, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { can } from '@/core/access/permissions';
import { listTransactions, walletFor, type TransactionFilters } from '@/core/data/repository';
import { availableTransitions, statusLabels, statusTone, type Transition } from '@/core/workflow/engine';
import type { MedicalTransaction } from '@/core/domain/types';
import { Badge, Button, Card, CardBody, EmptyState, Field, Input, Modal, Table, Td, Textarea, Th } from '@/components/ui/primitives';
import { PageHeader } from '@/components/shell/page-header';
import { FilterBar } from '@/components/shell/filter-bar';
import { downloadCsv, formatDate, formatDateTime, formatMoney } from '@/lib/utils';

export default function ClaimsPage() {
  const { db, config, session, actions } = useStore();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [openTxn, setOpenTxn] = useState<MedicalTransaction | null>(null);
  const [remarks, setRemarks] = useState('');
  const [pendingAction, setPendingAction] = useState<Transition | null>(null);

  // Hooks run before any early return so hook order is stable across renders.
  const query: TransactionFilters = useMemo(
    () => ({
      status: (filters.status || undefined) as TransactionFilters['status'],
      category: filters.category || undefined,
      clinicId: filters.clinicId || undefined,
      unitId: filters.unitId || undefined,
      location: filters.location || undefined,
      search: search || undefined,
    }),
    [filters, search],
  );

  if (!session) return null;
  const t = config.terminology;
  const admin = can(session, 'transaction.read.any');
  const rows = listTransactions(db, session, query);
  const employeeName = (id: string) => db.employees.find((e) => e.id === id)?.name ?? '—';
  const clinicName = (id: string) => db.clinics.find((c) => c.id === id)?.name ?? '—';

  const filterDefs = [
    { key: 'status', label: 'Status', options: Object.entries(statusLabels).map(([value, label]) => ({ value, label })) },
    { key: 'category', label: 'Service', options: config.serviceCategories.map((c) => ({ value: c, label: c })) },
    ...(admin
      ? [
          { key: 'clinicId', label: t.clinic, options: db.clinics.map((c) => ({ value: c.id, label: c.name })) },
          { key: 'unitId', label: t.unitSingular, options: db.units.filter((u) => u.type === 'division').map((u) => ({ value: u.id, label: u.name })) },
          { key: 'location', label: 'Location', options: config.organisation.locations.map((l) => ({ value: l, label: l })) },
        ]
      : []),
  ];

  const exportRows = () =>
    downloadCsv(
      `transactions-${config.organisationCode}-${db.periodYear}.csv`,
      rows.map((r) => ({
        reference: r.reference,
        date: r.date,
        ...(admin ? { staff_no: db.employees.find((e) => e.id === r.employeeId)?.staffNo ?? '', name: employeeName(r.employeeId) } : {}),
        clinic: clinicName(r.clinicId),
        service: r.serviceCategory,
        amount: r.amount,
        mc_days: r.mcDays,
        status: r.status,
      })),
    );

  const approvals = openTxn ? db.approvals.filter((a) => a.transactionId === openTxn.id).sort((a, b) => (a.at < b.at ? -1 : 1)) : [];
  const transitions =
    openTxn && session
      ? availableTransitions(openTxn, {
          policy: db.policies[0],
          actorRoles: session.roles,
          spendableBefore: walletFor(db, openTxn.employeeId).spendable,
        })
      : [];

  const runAction = () => {
    if (!openTxn || !pendingAction) return;
    if (pendingAction.requiresRemark && !remarks.trim()) return;
    actions.advanceTransaction(openTxn.id, pendingAction.to, pendingAction.action, remarks.trim() || undefined);
    setPendingAction(null);
    setRemarks('');
    setOpenTxn(null);
  };

  return (
    <div>
      <PageHeader
        title={admin ? 'Claims & transactions' : 'My claims & transactions'}
        description={admin
          ? 'Every entry in the ledger, with the decisions that moved it. Approving here updates the employee wallet immediately.'
          : 'Every visit recorded against your wallet, and where each one stands.'}
        zone="zone1"
        action={<Button variant="secondary" onClick={exportRows} disabled={!rows.length}><Download size={15} /> Export CSV</Button>}
      />

      <FilterBar filters={filterDefs} value={filters} onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))} onReset={() => { setFilters({}); setSearch(''); }}>
        <label className="min-w-[190px] flex-1 sm:flex-none">
          <span className="mb-1 block text-[11.5px] font-medium text-ink-muted">Search</span>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={admin ? 'Reference, name or staff no.' : 'Reference or service'} className="h-9 py-1.5 text-[13px]" />
        </label>
      </FilterBar>

      <Card>
        <CardBody className="pt-5">
          {rows.length === 0 ? (
            <EmptyState
              title="Nothing matches those filters"
              description="Try clearing a filter, or widen the search. Transactions appear here as soon as a panel clinic submits them."
              icon={<FileText size={26} />}
            />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Date</Th><Th>Reference</Th>{admin ? <Th>{t.employee}</Th> : null}<Th>Service</Th>
                  <Th>{t.clinic}</Th><Th align="right">Amount</Th><Th>Status</Th><Th />
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 100).map((txn) => (
                  <tr key={txn.id} className="transition-colors hover:bg-canvas/60">
                    <Td className="whitespace-nowrap">{formatDate(txn.date)}</Td>
                    <Td className="whitespace-nowrap text-ink-muted">{txn.reference}</Td>
                    {admin ? <Td className="whitespace-nowrap">{employeeName(txn.employeeId)}</Td> : null}
                    <Td>{txn.serviceCategory}</Td>
                    <Td className="text-ink-muted">{clinicName(txn.clinicId)}</Td>
                    <Td align="right">{formatMoney(txn.amount, t.currency)}</Td>
                    <Td>
                      <Badge tone={statusTone[txn.status]}>{statusLabels[txn.status]}</Badge>
                      {txn.excess ? <Badge tone="risk" className="ml-1.5">Excess</Badge> : null}
                    </Td>
                    <Td align="right">
                      <Button size="sm" variant="quiet" onClick={() => { setOpenTxn(txn); setRemarks(''); setPendingAction(null); }}>Open</Button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {rows.length > 100 ? (
            <p className="mt-3 text-[12.5px] text-ink-soft">Showing the 100 most recent of {rows.length} matching transactions — narrow the filters to see more.</p>
          ) : null}
        </CardBody>
      </Card>

      <Modal
        open={!!openTxn}
        onClose={() => setOpenTxn(null)}
        title={openTxn ? openTxn.reference : ''}
        description={openTxn ? `${openTxn.serviceCategory} · ${formatDate(openTxn.date)}` : undefined}
        wide
        footer={
          transitions.length ? (
            <>
              <span className="mr-auto self-center text-[12.5px] text-ink-muted">
                {pendingAction?.requiresRemark ? 'A remark is required for this decision.' : 'Decisions are recorded in the audit trail.'}
              </span>
              {transitions.map((tr) => (
                <Button
                  key={tr.action}
                  variant={pendingAction?.action === tr.action ? 'primary' : tr.tone === 'danger' ? 'danger' : 'secondary'}
                  onClick={() => (pendingAction?.action === tr.action ? runAction() : setPendingAction(tr))}
                  disabled={pendingAction?.action === tr.action && tr.requiresRemark && !remarks.trim()}
                >
                  {pendingAction?.action === tr.action ? `Confirm — ${tr.label}` : tr.label}
                </Button>
              ))}
            </>
          ) : (
            <Button variant="secondary" onClick={() => setOpenTxn(null)}>Close</Button>
          )
        }
      >
        {openTxn ? (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Detail label="Amount" value={formatMoney(openTxn.amount, t.currency)} />
              <Detail label="Status" value={statusLabels[openTxn.status]} />
              <Detail label={t.clinic} value={clinicName(openTxn.clinicId)} />
              <Detail label="MC days" value={openTxn.mcDays ? `${openTxn.mcDays}` : 'None recorded'} />
              {admin ? <Detail label={t.employee} value={employeeName(openTxn.employeeId)} /> : null}
              <Detail label="Submitted" value={formatDateTime(openTxn.createdAt)} />
              {openTxn.notes ? <Detail label="Notes" value={openTxn.notes} className="sm:col-span-2" /> : null}
            </div>

            {admin ? (
              <div className="rounded-xl border border-line bg-canvas/50 px-4 py-3">
                <p className="label mb-2">Employee position after this entry</p>
                <WalletSummary employeeId={openTxn.employeeId} />
              </div>
            ) : null}

            <div>
              <p className="label mb-2">Approval timeline</p>
              <ol className="space-y-3 border-l border-line pl-4">
                <li className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-brand" />
                  <p className="text-[13.5px] font-medium text-ink">Submitted</p>
                  <p className="text-[12.5px] text-ink-muted">{formatDateTime(openTxn.createdAt)}</p>
                </li>
                {approvals.map((a) => (
                  <li key={a.id} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-navy/30" />
                    <p className="text-[13.5px] font-medium capitalize text-ink">{a.action}</p>
                    <p className="text-[12.5px] text-ink-muted">
                      {formatDateTime(a.at)} · {db.users.find((u) => u.id === a.actorId)?.name ?? a.actorRole.toUpperCase()}
                    </p>
                    {a.remarks ? <p className="mt-1 rounded-lg bg-canvas px-3 py-2 text-[12.5px] text-ink-muted">{a.remarks}</p> : null}
                  </li>
                ))}
              </ol>
            </div>

            {pendingAction ? (
              <Field label="Remarks" required={pendingAction.requiresRemark} hint="Recorded against the transaction and visible to the employee.">
                <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Reason for the decision" />
              </Field>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function WalletSummary({ employeeId }: { employeeId: string }) {
  const { db, config } = useStore();
  const wallet = walletFor(db, employeeId);
  const t = config.terminology;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Detail label="Entitlement" value={formatMoney(wallet.entitlement, t.currency)} />
      <Detail label="Approved" value={formatMoney(wallet.approved, t.currency)} />
      <Detail label="Available" value={formatMoney(Math.max(0, wallet.available), t.currency)} />
      <Detail label="Utilisation" value={`${wallet.utilisationPct}%`} />
    </div>
  );
}

function Detail({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="label">{label}</p>
      <p className="mt-1 text-[13.5px] text-ink">{value}</p>
    </div>
  );
}
