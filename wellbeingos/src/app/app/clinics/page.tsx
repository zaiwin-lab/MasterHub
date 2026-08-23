'use client';

import { useState } from 'react';
import { MapPin, Phone, Clock, Plus, Stethoscope } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { can } from '@/core/access/permissions';
import type { Clinic } from '@/core/domain/types';
import { Badge, Button, Card, CardBody, EmptyState, Field, Input, Modal, Select, Table, Td, Th } from '@/components/ui/primitives';
import { PageHeader } from '@/components/shell/page-header';
import { FilterBar } from '@/components/shell/filter-bar';
import { formatDate } from '@/lib/utils';

export default function ClinicsPage() {
  const { db, config, session, actions } = useStore();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Clinic | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', location: '', address: '', phone: '', hours: '' });

  if (!session) return null;
  const t = config.terminology;
  const manage = can(session, 'clinic.manage');

  const rows = db.clinics
    .filter((c) => (manage ? true : c.panelStatus === 'active'))
    .filter((c) => (filters.location ? c.location === filters.location : true))
    .filter((c) => (filters.service ? c.services.includes(filters.service) : true))
    .filter((c) => (filters.status ? c.panelStatus === filters.status : true))
    .filter((c) => (search ? `${c.name} ${c.location} ${c.address}`.toLowerCase().includes(search.toLowerCase()) : true));

  const save = () => {
    if (!form.name.trim()) return;
    actions.saveClinic({ ...form, panelStatus: 'pending', services: ['General consultation'], agreementExpiry: new Date(db.periodYear + 1, 11, 31).toISOString().slice(0, 10) });
    setForm({ name: '', code: '', location: '', address: '', phone: '', hours: '' });
    setCreating(false);
  };

  return (
    <div>
      <PageHeader
        title={t.clinics}
        description={manage
          ? 'The panel network, its coverage and agreement status. Adding a clinic here makes it selectable in the clinic portal.'
          : `Where you can be seen under your ${t.benefit.toLowerCase()}. Show your staff number at reception — the clinic verifies eligibility instantly.`}
        zone="zone1"
        action={manage ? <Button variant="primary" onClick={() => setCreating(true)}><Plus size={15} /> Add clinic</Button> : undefined}
      />

      <FilterBar
        filters={[
          { key: 'location', label: 'Location', options: config.organisation.locations.map((l) => ({ value: l, label: l })) },
          { key: 'service', label: 'Service', options: config.serviceCategories.map((c) => ({ value: c, label: c })) },
          ...(manage ? [{ key: 'status', label: 'Panel status', options: ['active', 'pending', 'suspended'].map((s) => ({ value: s, label: s })) }] : []),
        ]}
        value={filters}
        onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
        onReset={() => { setFilters({}); setSearch(''); }}
      >
        <label className="min-w-[180px] flex-1 sm:flex-none">
          <span className="mb-1 block text-[11.5px] font-medium text-ink-muted">Search</span>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or area" className="h-9 py-1.5 text-[13px]" />
        </label>
      </FilterBar>

      {rows.length === 0 ? (
        <EmptyState title="No clinics match" description="Try a different location or clear the filters." icon={<Stethoscope size={26} />} />
      ) : manage ? (
        <Card>
          <CardBody className="pt-5">
            <Table>
              <thead>
                <tr><Th>Code</Th><Th>Clinic</Th><Th>Location</Th><Th>Services</Th><Th>Status</Th><Th>Agreement</Th><Th align="right">Transactions</Th><Th /></tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <Td className="whitespace-nowrap text-ink-muted">{c.code}</Td>
                    <Td className="font-medium">{c.name}</Td>
                    <Td>{c.location}</Td>
                    <Td className="max-w-[220px] truncate text-ink-muted">{c.services.join(', ')}</Td>
                    <Td><Badge tone={c.panelStatus === 'active' ? 'ok' : c.panelStatus === 'pending' ? 'warn' : 'risk'}>{c.panelStatus}</Badge></Td>
                    <Td className="whitespace-nowrap text-ink-muted">{formatDate(c.agreementExpiry)}</Td>
                    <Td align="right">{db.transactions.filter((x) => x.clinicId === c.id).length}</Td>
                    <Td align="right"><Button size="sm" variant="quiet" onClick={() => setEditing(c)}>Manage</Button></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((c) => (
            <Card key={c.id} className="flex h-full flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-[16px] leading-tight text-navy">{c.name}</p>
                <Badge tone="ok">Panel</Badge>
              </div>
              <ul className="mt-3 space-y-1.5 text-[13px] text-ink-muted">
                <li className="flex gap-2"><MapPin size={14} className="mt-0.5 shrink-0" />{c.address}</li>
                <li className="flex gap-2"><Phone size={14} className="mt-0.5 shrink-0" />{c.phone}</li>
                <li className="flex gap-2"><Clock size={14} className="mt-0.5 shrink-0" />{c.hours}</li>
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.services.map((s) => <Badge key={s} tone="muted">{s}</Badge>)}
              </div>
              <a
                className="mt-4 inline-block text-[13px] font-medium text-brand hover:underline"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.name}, ${c.address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get directions
              </a>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Add a panel clinic"
        description="New clinics start as pending until the agreement is confirmed."
        footer={<><Button variant="quiet" onClick={() => setCreating(false)}>Cancel</Button><Button variant="primary" onClick={save} disabled={!form.name.trim()}>Add clinic</Button></>}
      >
        <div className="space-y-4">
          <Field label="Clinic name" required><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Panel code"><Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="PC-011" /></Field>
            <Field label="Location">
              <Select value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}>
                <option value="">Select</option>
                {config.organisation.locations.map((l) => <option key={l} value={l}>{l}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Address"><Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></Field>
            <Field label="Opening hours"><Input value={form.hours} onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))} placeholder="Mon–Fri 8am–6pm" /></Field>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.name ?? ''}
        description="Panel status controls whether the clinic can submit transactions."
        footer={<Button variant="secondary" onClick={() => setEditing(null)}>Close</Button>}
      >
        {editing ? (
          <div className="space-y-4">
            <Field label="Panel status">
              <Select
                value={editing.panelStatus}
                onChange={(e) => {
                  const panelStatus = e.target.value as Clinic['panelStatus'];
                  actions.saveClinic({ id: editing.id, panelStatus });
                  setEditing({ ...editing, panelStatus });
                }}
              >
                {['active', 'pending', 'suspended'].map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Agreement expiry">
              <Input type="date" defaultValue={editing.agreementExpiry} onBlur={(e) => actions.saveClinic({ id: editing.id, agreementExpiry: e.target.value })} />
            </Field>
            <Field label="Contact number">
              <Input defaultValue={editing.phone} onBlur={(e) => actions.saveClinic({ id: editing.id, phone: e.target.value })} />
            </Field>
            <p className="rounded-xl bg-canvas px-4 py-3 text-[12.5px] leading-relaxed text-ink-muted">
              A future clinic API adapter replaces this screen for networks that submit electronically — see
              docs/INTEGRATIONS.md. The data shape stays the same either way.
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
