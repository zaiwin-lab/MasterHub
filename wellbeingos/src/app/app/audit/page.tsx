'use client';

import { useState } from 'react';
import { Download, ScrollText } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { can, roleLabels } from '@/core/access/permissions';
import { zoneLabels } from '@/core/domain/privacy';
import { Badge, Button, Card, CardBody, EmptyState, Input, Stat, Table, Td, Th } from '@/components/ui/primitives';
import { PageHeader } from '@/components/shell/page-header';
import { FilterBar } from '@/components/shell/filter-bar';
import { downloadCsv, formatDateTime } from '@/lib/utils';

export default function AuditPage() {
  const { db, config, session } = useStore();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');

  if (!session || !can(session, 'audit.read')) {
    return <EmptyState title="Audit trail restricted" description="The audit trail is available to platform administrators. Employees can see their own consent history under Privacy & Consent." />;
  }

  const rows = db.audit
    .filter((a) => (filters.zone ? a.zone === filters.zone : true))
    .filter((a) => (filters.role ? a.actorRole === filters.role : true))
    .filter((a) => (search ? `${a.action} ${a.summary}`.toLowerCase().includes(search.toLowerCase()) : true));

  return (
    <div>
      <PageHeader
        title="Audit trail"
        description="Who did what, when, and in which privacy zone. Written by the service layer on every privileged action — not something a user can switch off."
        zone="zone1"
        action={
          <Button variant="secondary" onClick={() => downloadCsv(`audit-${config.organisationCode}.csv`, rows.map((a) => ({ at: a.at, actor: a.actorId, role: a.actorRole, action: a.action, entity: a.entity, zone: a.zone, summary: a.summary })))}>
            <Download size={15} /> Export CSV
          </Button>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Events recorded" value={`${db.audit.length}`} />
        <Stat label="Zone 1 — administrative" value={`${db.audit.filter((a) => a.zone === 'zone1').length}`} />
        <Stat label="Zone 2 — personal vault" value={`${db.audit.filter((a) => a.zone === 'zone2').length}`} hint="Owner-initiated only" />
        <Stat label="Zone 3 — organisational" value={`${db.audit.filter((a) => a.zone === 'zone3').length}`} />
      </div>

      <FilterBar
        filters={[
          { key: 'zone', label: 'Privacy zone', options: Object.entries(zoneLabels).map(([value, label]) => ({ value, label })) },
          { key: 'role', label: 'Actor role', options: Object.entries(roleLabels).map(([value, label]) => ({ value, label })) },
        ]}
        value={filters}
        onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
        onReset={() => { setFilters({}); setSearch(''); }}
      >
        <label className="min-w-[190px] flex-1 sm:flex-none">
          <span className="mb-1 block text-[11.5px] font-medium text-ink-muted">Search</span>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Action or summary" className="h-9 py-1.5 text-[13px]" />
        </label>
      </FilterBar>

      <Card>
        <CardBody className="pt-5">
          {rows.length === 0 ? (
            <EmptyState title="No matching events" description="Clear the filters to see the full trail." icon={<ScrollText size={26} />} />
          ) : (
            <Table>
              <thead><tr><Th>When</Th><Th>Actor</Th><Th>Role</Th><Th>Action</Th><Th>Entity</Th><Th>Zone</Th><Th>Summary</Th></tr></thead>
              <tbody>
                {rows.slice(0, 150).map((a) => (
                  <tr key={a.id}>
                    <Td className="whitespace-nowrap text-ink-muted">{formatDateTime(a.at)}</Td>
                    <Td className="whitespace-nowrap">{db.users.find((u) => u.id === a.actorId)?.name ?? a.actorId}</Td>
                    <Td className="text-ink-muted">{roleLabels[a.actorRole]}</Td>
                    <Td className="whitespace-nowrap font-medium">{a.action}</Td>
                    <Td className="text-ink-muted">{a.entity}</Td>
                    <Td><Badge tone={a.zone === 'zone2' ? 'ok' : a.zone === 'zone3' ? 'accent' : 'info'}>{a.zone}</Badge></Td>
                    <Td className="max-w-[320px] text-ink-muted">{a.summary}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
