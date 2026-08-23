'use client';

import { useStore } from '@/core/data/store';
import { listTransactions, walletFor } from '@/core/data/repository';
import { activeThreshold, nextThreshold, renderAlertMessage } from '@/core/domain/benefit';
import { statusLabels, statusTone } from '@/core/workflow/engine';
import { UtilisationRing } from '@/components/ui/utilisation-ring';
import { AlertBanner } from '@/components/ui/alert-banner';
import { Badge, Card, CardBody, CardHeader, EmptyState, Progress, Table, Td, Th } from '@/components/ui/primitives';
import { PageHeader, SectionTitle } from '@/components/shell/page-header';
import { formatDate, formatMoney } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';

export default function BenefitPage() {
  const { db, config, session } = useStore();
  if (!session?.employeeId)
    return (
      <EmptyState
        title="No personal wallet on this account"
        description="This account is not linked to an employee record, so it has no entitlement of its own. Organisational utilisation is available under Insights."
      />
    );
  const t = config.terminology;

  const wallet = walletFor(db, session.employeeId);
  const employee = db.employees.find((e) => e.id === session.employeeId);
  const policy = db.policies.find((p) => p.id === employee?.policyId) ?? db.policies[0];
  const ledger = listTransactions(db, session);
  const reached = activeThreshold(wallet, policy.thresholds);
  const upcoming = nextThreshold(wallet, policy.thresholds);

  return (
    <div>
      <PageHeader
        title={t.wallet}
        description={`Your balance is calculated from the transaction ledger below — entitlement minus approved utilisation. It is never edited by hand.`}
        zone="zone1"
        zoneNote="You and authorised administrators"
      />

      {reached ? (
        <AlertBanner
          className="mb-5"
          level={reached.level}
          title={`${reached.label} — ${wallet.utilisationPct.toFixed(0)}% utilised`}
          message={renderAlertMessage(reached.employeeMessage, {
            name: session.name,
            used: formatMoney(wallet.approved, t.currency),
            available: formatMoney(Math.max(0, wallet.available), t.currency),
            pct: `${wallet.utilisationPct.toFixed(0)}%`,
            benefit: t.benefit.toLowerCase(),
          })}
        />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,340px)_1fr]">
        <Card>
          <CardBody className="flex flex-col items-center">
            <UtilisationRing
              pct={wallet.utilisationPct}
              committedPct={wallet.committedPct}
              size={200}
              centreLabel="Utilised"
              caption={`of ${formatMoney(wallet.entitlement, t.currency)}`}
            />
            <dl className="mt-5 w-full space-y-2.5">
              <Row label="Annual entitlement" value={formatMoney(wallet.entitlement, t.currency)} />
              <Row label="Approved utilisation" value={`− ${formatMoney(wallet.approved, t.currency)}`} />
              <Row label="Available balance" value={formatMoney(Math.max(0, wallet.available), t.currency)} strong />
              <Row label="Pending approval" value={formatMoney(wallet.committed, t.currency)} muted />
              <Row label="Spendable today" value={formatMoney(wallet.spendable, t.currency)} muted />
              {wallet.excess > 0 ? <Row label="Beyond entitlement" value={formatMoney(wallet.excess, t.currency)} tone="risk" /> : null}
            </dl>
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Your alert thresholds" subtitle={`Configured for ${policy.name}. Thresholds exist to remove surprises, not to police behaviour.`} />
            <CardBody className="space-y-4 pt-2">
              {policy.thresholds.map((th) => {
                const passed = wallet.utilisationPct >= th.at;
                return (
                  <div key={th.at} className="flex items-start gap-3">
                    <span className={passed ? 'mt-0.5 text-brand' : 'mt-0.5 text-ink-soft'}>
                      {passed ? <CheckCircle2 size={17} /> : <Circle size={17} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[13.5px] font-medium text-ink">{th.at}% — {th.label}</p>
                        {passed ? <Badge tone={th.level === 'policy' ? 'risk' : th.level === 'important' ? 'warn' : 'ok'}>Reached</Badge> : null}
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
                        {renderAlertMessage(th.employeeMessage, {
                          name: session.name,
                          used: formatMoney(wallet.approved, t.currency),
                          available: formatMoney(Math.max(0, wallet.entitlement - wallet.approved), t.currency),
                          pct: `${th.at}%`,
                          benefit: t.benefit.toLowerCase(),
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              {upcoming ? (
                <div className="rounded-xl border border-line bg-canvas/60 px-4 py-3">
                  <div className="mb-2 flex items-center justify-between text-[12.5px] text-ink-muted">
                    <span>Progress to the {upcoming.at}% band</span>
                    <span>{formatMoney(Math.max(0, (upcoming.at / 100) * wallet.entitlement - wallet.approved), t.currency)} away</span>
                  </div>
                  <Progress value={(wallet.utilisationPct / upcoming.at) * 100} tone={wallet.utilisationPct >= 75 ? 'warn' : 'brand'} />
                </div>
              ) : null}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="What is covered" subtitle={`${policy.name} · ${policy.period === 'calendar-year' ? 'Calendar year' : 'Financial year'} · Eligibility: ${policy.eligibility.categories.join(', ')}`} />
            <CardBody className="pt-2">
              <div className="flex flex-wrap gap-2">
                {policy.serviceCategories.map((c) => <Badge key={c} tone="muted">{c}</Badge>)}
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink-muted">
                Visits at or below {formatMoney(policy.approval.autoApproveUnder, t.currency)} are verified automatically at
                submission; anything higher is reviewed by {policy.approval.approverRoles.join(' then ')}.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      <SectionTitle hint="Balance = entitlement − approved utilisation">Transaction ledger</SectionTitle>
      <Card>
        <CardBody className="pt-5">
          {ledger.length === 0 ? (
            <EmptyState title="No transactions yet" description="Your ledger fills as panel clinic visits are submitted and approved." />
          ) : (
            <Table>
              <thead>
                <tr><Th>Date</Th><Th>Reference</Th><Th>Service</Th><Th>Clinic</Th><Th align="right">Amount</Th><Th align="right">MC days</Th><Th>Status</Th><Th align="right">Balance after</Th></tr>
              </thead>
              <tbody>
                {runningBalance(ledger, wallet.entitlement).map(({ txn, balance }) => (
                  <tr key={txn.id}>
                    <Td className="whitespace-nowrap">{formatDate(txn.date)}</Td>
                    <Td className="whitespace-nowrap text-ink-muted">{txn.reference}</Td>
                    <Td>{txn.serviceCategory}</Td>
                    <Td className="text-ink-muted">{db.clinics.find((c) => c.id === txn.clinicId)?.name ?? '—'}</Td>
                    <Td align="right">{formatMoney(txn.amount, t.currency)}</Td>
                    <Td align="right">{txn.mcDays || '—'}</Td>
                    <Td><Badge tone={statusTone[txn.status]}>{statusLabels[txn.status]}</Badge></Td>
                    <Td align="right" className={balance === null ? 'text-ink-soft' : ''}>
                      {balance === null ? '—' : formatMoney(balance, t.currency)}
                    </Td>
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

/** Balance after each consuming entry, oldest first, displayed newest first. */
function runningBalance(ledger: ReturnType<typeof listTransactions>, entitlement: number) {
  const oldestFirst = [...ledger].sort((a, b) => (a.date < b.date ? -1 : 1));
  let balance = entitlement;
  const out = oldestFirst.map((txn) => {
    if (txn.status === 'approved' || txn.status === 'paid') {
      balance = Math.round((balance - txn.amount) * 100) / 100;
      return { txn, balance };
    }
    return { txn, balance: null as number | null };
  });
  return out.reverse();
}

function Row({ label, value, strong, muted, tone }: { label: string; value: string; strong?: boolean; muted?: boolean; tone?: 'risk' }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line/70 pb-2 last:border-0">
      <dt className={`text-[13px] ${muted ? 'text-ink-soft' : 'text-ink-muted'}`}>{label}</dt>
      <dd className={`tabular-nums ${strong ? 'font-display text-[17px] text-navy' : tone === 'risk' ? 'text-[13.5px] font-medium text-risk' : 'text-[13.5px] text-ink'}`}>{value}</dd>
    </div>
  );
}
