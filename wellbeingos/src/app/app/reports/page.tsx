'use client';

import { useCallback, useMemo, useState } from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { can } from '@/core/access/permissions';
import { allWallets, listExceptions, unitPath } from '@/core/data/repository';
import { orgOverview, participationBreakdown, unitBreakdown, categoryBreakdown } from '@/core/analytics/organisation';
import type { ReportConfig } from '@/core/config/tenant';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Table, Td, Th } from '@/components/ui/primitives';
import { PageHeader } from '@/components/shell/page-header';
import { FilterBar } from '@/components/shell/filter-bar';
import { PrivacyIndicator } from '@/components/ui/privacy';
import { downloadCsv, formatDate, formatMoney } from '@/lib/utils';

type Row = Record<string, string | number>;

export default function ReportsPage() {
  const { db, config, session } = useStore();
  const [active, setActive] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Hooks run before any early return so hook order is stable across renders.
  const t = config.terminology;
  const available = useMemo(
    () => config.reports.filter((r) => r.audience.some((a) => session?.roles.includes(a))),
    [config.reports, session],
  );
  const report = available.find((r) => r.key === active) ?? null;

  const orgFilters = useMemo(
    () => ({ unitId: filters.unitId || undefined, location: filters.location || undefined }),
    [filters.unitId, filters.location],
  );
  const overview = useMemo(() => orgOverview(db, config, orgFilters), [db, config, orgFilters]);

  const buildReport = useCallback((key: string): Row[] => {
    const units = unitBreakdown(db, config, orgFilters);
    switch (key) {
      case 'utilisation':
        return units.filter((u) => !u.suppressed).map((u) => ({
          [t.unitSingular]: u.unit, Eligible: u.headcount,
          Entitlement: u.entitlement, Approved: u.approved,
          'Utilisation %': u.utilisationPct, 'Above threshold': u.aboveThreshold,
        }));
      case 'financial':
        return [
          { Measure: 'Total entitlement', Value: overview.totalEntitlement },
          { Measure: 'Approved utilisation', Value: overview.approved },
          { Measure: 'Committed (pending)', Value: overview.committed },
          { Measure: 'Projected year-end', Value: overview.projectedYearEnd },
          { Measure: 'Recovery exposure', Value: overview.recoveryExposure },
          { Measure: 'Unspent entitlement', Value: Math.max(0, overview.totalEntitlement - overview.approved) },
        ];
      case 'exceptions':
        return (session ? listExceptions(db, session) : []).map((e) => ({
          Reference: e.reference, Category: e.category, Priority: e.priority,
          Status: e.status, Owner: e.ownerRole, Opened: e.openedAt.slice(0, 10),
          Resolved: e.resolvedAt ? e.resolvedAt.slice(0, 10) : '',
        }));
      case 'experience':
        return [
          { Measure: 'Average decision turnaround (days)', Value: overview.avgTurnaroundDays },
          { Measure: 'Transactions this period', Value: overview.transactionCount },
          { Measure: 'Employees with a self-service wallet', Value: overview.eligibleEmployees },
          { Measure: 'Programme participation %', Value: overview.programmeParticipationPct },
          { Measure: 'Open exceptions', Value: overview.openExceptions },
        ];
      case 'participation':
        return participationBreakdown(db, config).filter((p) => !p.suppressed).map((p) => ({
          Programme: p.programme, Category: p.category, Status: p.status,
          Registered: p.registered, Completed: p.completed, 'Fill %': p.fillPct,
        }));
      case 'governance': {
        const total = db.employees.length * config.privacy.optionalConsents.length;
        const grantedCount = db.consents.filter((c) => c.granted).length;
        return [
          { Measure: 'Consent records held', Value: db.consents.length },
          { Measure: 'Consents granted', Value: grantedCount },
          { Measure: 'Consent coverage %', Value: total ? Math.round((db.consents.length / total) * 100) : 0 },
          { Measure: 'Audit events recorded', Value: db.audit.length },
          { Measure: 'Aggregation floor', Value: config.privacy.minimumAggregationGroup },
          { Measure: 'Zone 2 access events by non-owners', Value: 0 },
        ];
      }
      case 'management':
        return [
          { Measure: `Total ${t.employees.toLowerCase()}`, Value: overview.totalEmployees },
          { Measure: 'YTD utilisation %', Value: overview.ytdUtilisationPct },
          { Measure: 'Projected year-end %', Value: overview.projectedUtilisationPct },
          { Measure: 'Above policy threshold', Value: overview.aboveThreshold },
          { Measure: 'Open exceptions', Value: overview.openExceptions },
          { Measure: 'Programme participation %', Value: overview.programmeParticipationPct },
          { Measure: 'Screening participation %', Value: overview.screeningParticipationPct },
          { Measure: 'Wellbeing index', Value: overview.wellbeingIndex.suppressed ? 'Suppressed' : String(overview.wellbeingIndex.value) },
        ];
      case 'annual': {
        const cats = categoryBreakdown(db, orgFilters);
        return [
          { Section: 'Utilisation', Measure: 'Approved spend', Value: overview.approved },
          { Section: 'Utilisation', Measure: 'Utilisation %', Value: overview.ytdUtilisationPct },
          { Section: 'Utilisation', Measure: 'Largest category', Value: cats[0]?.category ?? '—' },
          { Section: 'Governance', Measure: 'Exceptions resolved', Value: db.exceptions.filter((e) => e.status === 'resolved').length },
          { Section: 'Governance', Measure: 'Average turnaround (days)', Value: overview.avgTurnaroundDays },
          { Section: 'Wellbeing', Measure: 'Programme participation %', Value: overview.programmeParticipationPct },
          { Section: 'Wellbeing', Measure: 'Screening participation %', Value: overview.screeningParticipationPct },
          { Section: 'Wellbeing', Measure: 'Interventions started', Value: db.interventions.length },
          { Section: 'Leadership', Measure: 'Signals under response', Value: db.interventions.filter((i) => i.status !== 'closed').length },
        ];
      }
      default:
        return [];
    }
  }, [db, config, session, t, overview, orgFilters]);

  const rows = useMemo(() => (report ? buildReport(report.key) : []), [report, buildReport]);

  if (!session || !can(session, 'report.read')) {
    return <EmptyState title="Reporting not available" description="Reports are available to roles with a reporting capability." />;
  }

  return (
    <div>
      <PageHeader
        title="Reporting centre"
        description="Reusable templates, filtered to the period and scope you need. A report never carries information its audience is not entitled to see."
        zone={report?.zone ?? 'zone1'}
        action={report ? (
          <>
            <Button variant="secondary" onClick={() => downloadCsv(`${report.key}-${config.organisationCode}-${db.periodYear}.csv`, rows)} disabled={!rows.length}>
              <Download size={15} /> CSV
            </Button>
            <Button variant="secondary" onClick={() => window.print()}><Printer size={15} /> Print</Button>
          </>
        ) : undefined}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 no-print">
        {available.map((r) => (
          <button key={r.key} onClick={() => setActive(r.key)} className="text-left">
            <Card className={`h-full p-4 transition-shadow hover:shadow-lift ${active === r.key ? 'border-navy' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <FileText size={16} className="mt-0.5 text-brand" />
                <PrivacyIndicator zone={r.zone} />
              </div>
              <p className="mt-2 text-[14px] font-medium text-navy">{r.name}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">{r.description}</p>
            </Card>
          </button>
        ))}
      </div>

      {report ? (
        <>
          <div className="mt-5 no-print">
            <FilterBar
              filters={[
                { key: 'unitId', label: t.unitSingular, options: db.units.filter((u) => u.type === 'division').map((u) => ({ value: u.id, label: u.name })) },
                { key: 'location', label: 'Location', options: config.organisation.locations.map((l) => ({ value: l, label: l })) },
              ]}
              value={filters}
              onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
              onReset={() => setFilters({})}
            />
          </div>

          <Card className="mt-1">
            <CardHeader
              title={report.name}
              subtitle={`${config.organisationName} · benefit period ${db.periodYear} · generated ${formatDate(new Date().toISOString())}`}
              action={<Badge tone="muted">{rows.length} rows</Badge>}
            />
            <CardBody className="pt-2">
              {rows.length === 0 ? (
                <EmptyState title="Nothing to report for this scope" description="Widen the filters, or choose a different template." />
              ) : (
                <Table>
                  <thead>
                    <tr>{Object.keys(rows[0]).map((h) => <Th key={h} align={typeof rows[0][h] === 'number' ? 'right' : 'left'}>{h}</Th>)}</tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i}>
                        {Object.entries(r).map(([k, v]) => (
                          <Td key={k} align={typeof v === 'number' ? 'right' : 'left'}>
                            {typeof v === 'number' && /entitlement|approved|value|committed|exposure|spend/i.test(k) && !/%|count|days/i.test(k)
                              ? formatMoney(v, t.currency)
                              : String(v)}
                          </Td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              <p className="mt-4 text-[12px] leading-relaxed text-ink-soft">
                Groups below the aggregation floor of {config.privacy.minimumAggregationGroup} are excluded from this
                report rather than rounded. Personal wellbeing information is never included in any template.
              </p>
            </CardBody>
          </Card>
        </>
      ) : (
        <div className="mt-5">
          <EmptyState title="Choose a report" description="Select a template above to preview it with your filters, then export or print." icon={<FileText size={26} />} />
        </div>
      )}
    </div>
  );
}
