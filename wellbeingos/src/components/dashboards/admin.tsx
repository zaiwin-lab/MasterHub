'use client';

import Link from 'next/link';
import { ArrowRight, Boxes, KeyRound, ScrollText, SlidersHorizontal } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { orgOverview } from '@/core/analytics/organisation';
import { Button, Card, CardBody, CardHeader, Stat, Table, Td, Th, Badge } from '@/components/ui/primitives';
import { SectionTitle } from '@/components/shell/page-header';
import { formatDateTime } from '@/lib/utils';
import { roleLabels } from '@/core/access/permissions';

export function AdminDashboard() {
  const { db, config } = useStore();
  const overview = orgOverview(db, config);
  const enabledModules = Object.entries(config.modules).filter(([, on]) => on);

  return (
    <div>
      <header className="mb-5">
        <h1 className="font-display text-[22px] leading-tight text-head sm:text-[26px]">Platform administration</h1>
        <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-ink-muted">
          {config.organisationName} runs on WellbeingOS as tenant <span className="font-medium text-head">{config.id}</span>.
          Everything on this page is configuration — changing it changes the product for this organisation only.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Users" value={`${db.users.length}`} hint={`${new Set(db.users.flatMap((u) => u.roles)).size} distinct roles in use`} />
        <Stat label="Modules enabled" value={`${enabledModules.length} of ${Object.keys(config.modules).length}`} hint="Feature flags per tenant" />
        <Stat label="Panel clinics" value={`${db.clinics.length}`} hint={`${db.clinics.filter((c) => c.panelStatus === 'active').length} active`} />
        <Stat label="Audit events" value={`${db.audit.length}`} hint="Retained per the tenant policy" />
      </div>

      <SectionTitle>Configuration areas</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: '/app/admin', icon: <SlidersHorizontal size={16} />, title: 'Organisation & branding', body: 'Name, mark, colours, terminology and welcome text.' },
          { href: '/app/admin', icon: <Boxes size={16} />, title: 'Policy & thresholds', body: `Entitlement (${config.terminology.currency}${config.policies[0].annualAmount}), alert bands and approval rules.` },
          { href: '/app/admin', icon: <KeyRound size={16} />, title: 'Roles & permissions', body: 'The capability matrix that governs every read and write.' },
          { href: '/app/audit', icon: <ScrollText size={16} />, title: 'Audit & governance', body: 'Access history, consent events and retention.' },
        ].map((c) => (
          <Link key={c.title} href={c.href}>
            <Card className="h-full p-4 transition-shadow hover:shadow-lift">
              <div className="flex items-center gap-2 text-brand">{c.icon}</div>
              <p className="mt-2 text-[14px] font-medium text-head">{c.title}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">{c.body}</p>
            </Card>
          </Link>
        ))}
      </div>

      <SectionTitle hint="Most recent first">Recent platform activity</SectionTitle>
      <Card>
        <CardHeader title="Audit trail" subtitle="Every privileged action is recorded with actor, zone and time." action={<Link href="/app/audit"><Button size="sm" variant="quiet">View all <ArrowRight size={14} /></Button></Link>} />
        <CardBody className="pt-2">
          <Table>
            <thead><tr><Th>When</Th><Th>Actor</Th><Th>Action</Th><Th>Zone</Th><Th>Summary</Th></tr></thead>
            <tbody>
              {db.audit.slice(0, 8).map((a) => (
                <tr key={a.id}>
                  <Td className="whitespace-nowrap text-ink-muted">{formatDateTime(a.at)}</Td>
                  <Td>{roleLabels[a.actorRole]}</Td>
                  <Td className="font-medium">{a.action}</Td>
                  <Td><Badge tone={a.zone === 'zone2' ? 'ok' : a.zone === 'zone3' ? 'accent' : 'info'}>{a.zone}</Badge></Td>
                  <Td className="max-w-[320px] truncate text-ink-muted">{a.summary}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <div className="mt-4">
        <Link href="/app/admin"><Button variant="primary">Open configuration centre <ArrowRight size={15} /></Button></Link>
      </div>
    </div>
  );
}
