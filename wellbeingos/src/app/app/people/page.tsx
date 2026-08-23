'use client';

import { useMemo, useState } from 'react';
import { Download, Users } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { can } from '@/core/access/permissions';
import { allWallets, listExceptions, unitPath } from '@/core/data/repository';
import { Badge, Button, Card, CardBody, EmptyState, Input, Modal, Progress, Stat, Table, Td, Th } from '@/components/ui/primitives';
import { PageHeader } from '@/components/shell/page-header';
import { FilterBar } from '@/components/shell/filter-bar';
import { PrivacyIndicator } from '@/components/ui/privacy';
import { downloadCsv, formatDate, formatMoney } from '@/lib/utils';

export default function PeoplePage() {
  const { db, config, session } = useStore();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  // Hooks run before any early return so hook order is stable across renders.
  const wallets = useMemo(() => allWallets(db), [db]);

  if (!session || !can(session, 'employee.read.directory')) {
    return <EmptyState title="Directory not available" description="This view is limited to roles with an administrative directory capability." />;
  }
  const t = config.terminology;
  const financeOnly = session.roles.includes('finance') && !can(session, 'employee.read.record');
  const rows = wallets
    .filter((w) => (filters.unitId ? w.employee.unitId === filters.unitId || db.units.find((u) => u.id === w.employee.unitId)?.parentId === filters.unitId : true))
    .filter((w) => (filters.location ? w.employee.location === filters.location : true))
    .filter((w) => (filters.category ? w.employee.category === filters.category : true))
    .filter((w) => (filters.band ? bandOf(w.wallet.utilisationPct) === filters.band : true))
    .filter((w) => (search ? `${w.employee.name} ${w.employee.staffNo}`.toLowerCase().includes(search.toLowerCase()) : true))
    .sort((a, b) => b.wallet.utilisationPct - a.wallet.utilisationPct);

  const open = openId ? wallets.find((w) => w.employee.id === openId) : null;
  const openExceptions = open ? listExceptions(db, session).filter((e) => e.subjectEmployeeId === open.employee.id) : [];

  return (
    <div>
      <PageHeader
        title={t.employees}
        description={`Eligibility, entitlement and utilisation. This directory carries administrative data only — no wellbeing information appears here for any role.`}
        zone="zone1"
        action={
          <Button
            variant="secondary"
            onClick={() =>
              downloadCsv(`people-${config.organisationCode}-${db.periodYear}.csv`, rows.map((w) => ({
                staff_no: w.employee.staffNo,
                name: w.employee.name,
                unit: unitPath(db, w.employee.unitId),
                location: w.employee.location,
                category: w.employee.category,
                eligible: w.employee.eligible ? 'yes' : 'no',
                entitlement: w.wallet.entitlement,
                approved: w.wallet.approved,
                available: w.wallet.available,
                utilisation_pct: w.wallet.utilisationPct,
              })))
            }
          >
            <Download size={15} /> Export CSV
          </Button>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={`Total ${t.employees.toLowerCase()}`} value={`${wallets.length}`} />
        <Stat label="Eligible" value={`${wallets.filter((w) => w.employee.eligible).length}`} />
        <Stat label="Above 90%" value={`${wallets.filter((w) => w.wallet.utilisationPct >= 90).length}`} tone="warn" />
        <Stat label="Fully utilised" value={`${wallets.filter((w) => w.wallet.utilisationPct >= 100).length}`} tone="risk" />
      </div>

      <FilterBar
        filters={[
          { key: 'unitId', label: t.unitSingular, options: db.units.filter((u) => u.type === 'division').map((u) => ({ value: u.id, label: u.name })) },
          { key: 'location', label: 'Location', options: config.organisation.locations.map((l) => ({ value: l, label: l })) },
          { key: 'category', label: 'Category', options: config.organisation.employeeCategories.map((c) => ({ value: c, label: c })) },
          { key: 'band', label: 'Utilisation', options: ['0–49%', '50–74%', '75–89%', '90–99%', '100%+'].map((b) => ({ value: b, label: b })) },
        ]}
        value={filters}
        onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
        onReset={() => { setFilters({}); setSearch(''); }}
      >
        <label className="min-w-[180px] flex-1 sm:flex-none">
          <span className="mb-1 block text-[11.5px] font-medium text-ink-muted">Search</span>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or staff number" className="h-9 py-1.5 text-[13px]" />
        </label>
      </FilterBar>

      <Card>
        <CardBody className="pt-5">
          {rows.length === 0 ? (
            <EmptyState title="Nobody matches those filters" description="Clear a filter or search a different name." icon={<Users size={26} />} />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Staff no.</Th><Th>Name</Th><Th>{t.unitSingular}</Th><Th>Location</Th>
                  <Th>Eligibility</Th><Th align="right">Approved</Th><Th align="right">Available</Th><Th>Utilisation</Th><Th />
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 100).map(({ employee, wallet }) => (
                  <tr key={employee.id} className="transition-colors hover:bg-canvas/60">
                    <Td className="whitespace-nowrap text-ink-muted">{employee.staffNo}</Td>
                    <Td className="font-medium">{employee.name}</Td>
                    <Td className="whitespace-nowrap text-ink-muted">{unitPath(db, employee.unitId)}</Td>
                    <Td>{employee.location}</Td>
                    <Td><Badge tone={employee.eligible ? 'ok' : 'muted'}>{employee.eligible ? 'Eligible' : 'Not covered'}</Badge></Td>
                    <Td align="right">{formatMoney(wallet.approved, t.currency)}</Td>
                    <Td align="right" className={wallet.available < 0 ? 'text-risk' : ''}>{formatMoney(wallet.available, t.currency)}</Td>
                    <Td>
                      <div className="flex min-w-[120px] items-center gap-2">
                        <Progress value={wallet.utilisationPct} tone={wallet.utilisationPct >= 100 ? 'risk' : wallet.utilisationPct >= 90 ? 'warn' : 'brand'} className="flex-1" />
                        <span className="w-10 text-right text-[12.5px] tabular-nums text-ink-muted">{Math.round(wallet.utilisationPct)}%</span>
                      </div>
                    </Td>
                    <Td align="right">{!financeOnly ? <Button size="sm" variant="quiet" onClick={() => setOpenId(employee.id)}>Open</Button> : null}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {rows.length > 100 ? <p className="mt-3 text-[12.5px] text-ink-soft">Showing 100 of {rows.length} — narrow the filters to see more.</p> : null}
        </CardBody>
      </Card>

      <Modal
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open?.employee.name ?? ''}
        description={open ? `${open.employee.staffNo} · ${unitPath(db, open.employee.unitId)}` : undefined}
        wide
        footer={<Button variant="secondary" onClick={() => setOpenId(null)}>Close</Button>}
      >
        {open ? (
          <div className="space-y-5">
            <PrivacyIndicator zone="zone1" note="Administrative record — no wellbeing data" />
            <div className="grid gap-3 sm:grid-cols-3">
              <Detail label="Category" value={open.employee.category} />
              <Detail label="Grade" value={open.employee.grade} />
              <Detail label="Location" value={open.employee.location} />
              <Detail label="Joined" value={formatDate(open.employee.joinDate)} />
              <Detail label="Status" value={open.employee.status} />
              <Detail label="Eligibility" value={open.employee.eligible ? 'Covered' : 'Not covered by the active policy'} />
            </div>
            <div className="rounded-xl border border-line bg-canvas/50 px-4 py-3">
              <p className="label mb-2">Wallet position</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Detail label="Entitlement" value={formatMoney(open.wallet.entitlement, t.currency)} />
                <Detail label="Approved" value={formatMoney(open.wallet.approved, t.currency)} />
                <Detail label="Committed" value={formatMoney(open.wallet.committed, t.currency)} />
                <Detail label="Utilisation" value={`${open.wallet.utilisationPct}%`} />
              </div>
            </div>
            {openExceptions.length ? (
              <div>
                <p className="label mb-2">Open cases</p>
                <ul className="space-y-2">
                  {openExceptions.map((e) => (
                    <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line px-4 py-2.5">
                      <span className="text-[13px] text-ink">{e.reference} — {e.title}</span>
                      <Badge tone={e.status === 'resolved' ? 'ok' : 'warn'}>{e.status}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function bandOf(pct: number) {
  if (pct >= 100) return '100%+';
  if (pct >= 90) return '90–99%';
  if (pct >= 75) return '75–89%';
  if (pct >= 50) return '50–74%';
  return '0–49%';
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label">{label}</p>
      <p className="mt-1 text-[13.5px] capitalize text-ink">{value}</p>
    </div>
  );
}
