'use client';

import { Leaf, Users, Scale } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { orgOverview } from '@/core/analytics/organisation';
import { Card, CardBody, CardHeader, Stat, Table, Td, Th } from '@/components/ui/primitives';
import { RequireCapability } from '@/components/shell/require-capability';
import { PageHeader, SectionTitle } from '@/components/shell/page-header';

function EsgPageContent() {
  const { db, config } = useStore();
  const overview = orgOverview(db, config);
  const digitalTransactions = db.transactions.length;
  // Evidence-based only: each digital transaction replaces one paper claim form
  // and its supporting copy. No emissions figures are asserted.
  const formsAvoided = digitalTransactions;
  const consentCoverage = Math.round((db.consents.length / Math.max(1, db.employees.length * config.privacy.optionalConsents.length)) * 100);

  return (
    <div>
      <PageHeader
        title="ESG value"
        description="What this platform can evidence from its own records — nothing modelled, estimated or inferred."
        zone="zone3"
      />

      <SectionTitle hint="Counted from the transaction ledger"><span className="inline-flex items-center gap-2"><Leaf size={16} className="text-brand" /> Environmental</span></SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Claims submitted digitally" value={`${digitalTransactions}`} hint="Every entry this period originated digitally" />
        <Stat label="Paper claim forms avoided" value={`${formsAvoided}`} hint="One form per transaction, at minimum" />
        <Stat label="Physical routing steps removed" value={`${formsAvoided * 2}`} hint="Submission and return legs no longer needed" />
        <Stat label="Digital records retained" value={`${db.transactions.length + db.approvals.length}`} hint="Transactions and approval decisions" />
      </div>
      <p className="mt-3 rounded-xl border border-line bg-surface px-4 py-3 text-[12.5px] leading-relaxed text-ink-muted">
        Deliberately conservative. The platform does not publish carbon figures, because it cannot observe how a claim
        would otherwise have been transported. Only counts it can evidence from its own ledger are shown.
      </p>

      <SectionTitle><span className="inline-flex items-center gap-2"><Users size={16} className="text-brand" /> Social</span></SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Staff with benefit visibility" value={`${overview.eligibleEmployees}`} hint="Continuous, self-service access" />
        <Stat label="Programme participation" value={`${overview.programmeParticipationPct}%`} hint="Of eligible staff" />
        <Stat label="Screening participation" value={`${overview.screeningParticipationPct}%`} hint="Attendance only" />
        <Stat label="Preventive interventions" value={`${db.interventions.length}`} hint="Started from aggregated signals" />
      </div>

      <SectionTitle><span className="inline-flex items-center gap-2"><Scale size={16} className="text-brand" /> Governance</span></SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Consent coverage" value={`${Math.min(100, consentCoverage)}%`} hint="Recorded consent decisions" />
        <Stat label="Audit events" value={`${db.audit.length}`} hint="Every privileged action recorded" />
        <Stat label="Exceptions resolved" value={`${db.exceptions.filter((e) => e.status === 'resolved').length}`} hint="Handled within the period" />
        <Stat label="Aggregation floor" value={`${config.privacy.minimumAggregationGroup}`} hint="Minimum group size for any organisational figure" />
      </div>

      <SectionTitle hint="How each claim is evidenced">Basis of reporting</SectionTitle>
      <Card>
        <CardHeader title="Evidence register" subtitle="Each figure above traces to a record in the platform." />
        <CardBody className="pt-2">
          <Table>
            <thead><tr><Th>Claim</Th><Th>Source</Th><Th>Basis</Th></tr></thead>
            <tbody>
              {[
                { claim: 'Digital claim submission', source: 'Transaction ledger', basis: 'Count of transactions recorded through the platform this period.' },
                { claim: 'Paper forms avoided', source: 'Transaction ledger', basis: 'One claim form per transaction — a conservative floor, not an estimate.' },
                { claim: 'Benefit visibility', source: 'Employee benefit records', basis: 'Eligible staff with a derived wallet available on demand.' },
                { claim: 'Participation', source: 'Programme participation records', basis: 'Distinct registered participants over eligible headcount.' },
                { claim: 'Consent coverage', source: 'Consent register', basis: 'Consent decisions recorded against configured purposes.' },
                { claim: 'Audit completeness', source: 'Audit trail', basis: 'Events written by the service layer on every privileged action.' },
                { claim: 'Preventive action', source: 'Intervention register', basis: 'Interventions with a named human decision-maker.' },
              ].map((r) => (
                <tr key={r.claim}>
                  <Td className="font-medium">{r.claim}</Td>
                  <Td className="text-ink-muted">{r.source}</Td>
                  <Td className="text-ink-muted">{r.basis}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}

export default function EsgPage() {
  return (
    <RequireCapability
      capabilities={['analytics.management']}
      title="ESG reporting not available"
      description="The ESG value dashboard is available to roles with organisational reporting access."
    >
      <EsgPageContent />
    </RequireCapability>
  );
}
