'use client';

import Link from 'next/link';
import {
  BookOpen, Activity, ShieldCheck, Users, Target, Sparkles, ArrowRight, Stethoscope,
  Receipt, CalendarDays, FileHeart,
} from 'lucide-react';
import { useStore } from '@/core/data/store';
import { listTransactions, myParticipation, walletFor } from '@/core/data/repository';
import { activeThreshold, nextThreshold, renderAlertMessage } from '@/core/domain/benefit';
import { statusLabels, statusTone } from '@/core/workflow/engine';
import { UtilisationRing } from '@/components/ui/utilisation-ring';
import { AlertBanner } from '@/components/ui/alert-banner';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Progress, Table, Td, Th } from '@/components/ui/primitives';
import { PrivacyIndicator } from '@/components/ui/privacy';
import { SectionTitle } from '@/components/shell/page-header';
import { formatDate, formatMoney } from '@/lib/utils';

const journeyIcons = { know: BookOpen, check: Activity, prevent: ShieldCheck, participate: Users, improve: Target, thrive: Sparkles };

export function EmployeeDashboard() {
  const { db, config, session } = useStore();
  if (!session?.employeeId) return null;

  const t = config.terminology;
  const employee = db.employees.find((e) => e.id === session.employeeId);
  const wallet = walletFor(db, session.employeeId);
  const policy = db.policies.find((p) => p.id === employee?.policyId) ?? db.policies[0];
  const transactions = listTransactions(db, session).slice(0, 5);
  const reached = activeThreshold(wallet, policy.thresholds);
  const upcoming = nextThreshold(wallet, policy.thresholds);
  const participation = myParticipation(db, session);
  const nextProgramme = db.programmes
    .filter((p) => participation.some((x) => x.programmeId === p.id) && p.status !== 'completed')
    .sort((a, b) => (a.startDate < b.startDate ? -1 : 1))[0];
  const lastVisit = transactions[0];
  const mcDays = db.transactions.filter((x) => x.employeeId === session.employeeId && x.periodYear === db.periodYear).reduce((a, b) => a + b.mcDays, 0);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[13px] text-ink-muted">Welcome back</p>
        <h1 className="font-display text-[24px] leading-tight text-navy sm:text-[28px]">{session.name}</h1>
      </div>

      {reached ? (
        <AlertBanner
          level={reached.level}
          title={`${reached.label} — you have passed the ${reached.at}% mark`}
          message={renderAlertMessage(reached.employeeMessage, {
            name: session.name,
            used: formatMoney(wallet.approved, t.currency),
            available: formatMoney(Math.max(0, wallet.available), t.currency),
            pct: `${wallet.utilisationPct.toFixed(0)}%`,
            benefit: t.benefit.toLowerCase(),
          })}
          action={<Link href="/app/benefit"><Button size="sm" variant="secondary">View wallet</Button></Link>}
        />
      ) : null}

      {/* Wallet */}
      <Card>
        <CardHeader
          title={`My ${t.benefit}`}
          subtitle={`${policy.name} · benefit period ${db.periodYear}`}
          action={<PrivacyIndicator zone="zone1" note="Visible to you and authorised administrators" />}
        />
        <CardBody className="pt-2">
          <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
            <UtilisationRing
              pct={wallet.utilisationPct}
              committedPct={wallet.committedPct}
              centreLabel="Utilised"
              caption={wallet.committed > 0 ? `plus ${formatMoney(wallet.committed, t.currency)} pending` : undefined}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Figure label="Annual entitlement" value={formatMoney(wallet.entitlement, t.currency)} />
              <Figure label="Used (approved)" value={formatMoney(wallet.approved, t.currency)} />
              <Figure
                label="Available"
                value={formatMoney(Math.max(0, wallet.available), t.currency)}
                tone={wallet.available <= 0 ? 'risk' : wallet.utilisationPct >= 90 ? 'warn' : 'ok'}
              />
              <Figure label="Pending approval" value={formatMoney(wallet.committed, t.currency)} hint="Reserved until a decision is made" />
              {upcoming ? (
                <div className="sm:col-span-2">
                  <div className="mb-1.5 flex items-center justify-between text-[12.5px] text-ink-muted">
                    <span>Next threshold at {upcoming.at}%</span>
                    <span>{formatMoney(Math.max(0, (upcoming.at / 100) * wallet.entitlement - wallet.approved), t.currency)} away</span>
                  </div>
                  <Progress value={(wallet.utilisationPct / upcoming.at) * 100} tone={wallet.utilisationPct >= 75 ? 'warn' : 'brand'} />
                </div>
              ) : null}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Shortcuts */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Shortcut
          href="/app/claims"
          icon={<Receipt size={17} />}
          label="Latest clinic visit"
          value={lastVisit ? formatDate(lastVisit.date) : 'No visits yet'}
          hint={lastVisit ? `${lastVisit.serviceCategory} · ${formatMoney(lastVisit.amount, t.currency)}` : 'Your visits appear here'}
        />
        <Shortcut
          href="/app/claims"
          icon={<FileHeart size={17} />}
          label="Claim history"
          value={`${wallet.transactionCount} this period`}
          hint="View every transaction and its status"
        />
        <Shortcut
          href="/app/clinics"
          icon={<Stethoscope size={17} />}
          label={t.clinics}
          value={`${db.clinics.filter((c) => c.panelStatus === 'active').length} nearby`}
          hint="Find a panel clinic and its services"
        />
        <Shortcut
          href="/app/programmes"
          icon={<CalendarDays size={17} />}
          label="Upcoming programme"
          value={nextProgramme ? nextProgramme.name : 'Nothing booked'}
          hint={nextProgramme ? `Starts ${formatDate(nextProgramme.startDate)}` : 'Browse what is open to you'}
        />
      </div>

      {/* MC + recent */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader
            title="Recent transactions"
            subtitle="Every entry recorded against your wallet this period."
            action={<Link href="/app/claims"><Button size="sm" variant="quiet">View all <ArrowRight size={14} /></Button></Link>}
          />
          <CardBody className="pt-2">
            {transactions.length === 0 ? (
              <EmptyState
                title="No transactions yet"
                description={`When you visit a ${t.clinic.toLowerCase()}, the visit appears here and your balance updates once it is approved.`}
              />
            ) : (
              <Table>
                <thead>
                  <tr><Th>Date</Th><Th>Service</Th><Th>Clinic</Th><Th align="right">Amount</Th><Th>Status</Th></tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id}>
                      <Td>{formatDate(txn.date)}</Td>
                      <Td>{txn.serviceCategory}</Td>
                      <Td className="text-ink-muted">{db.clinics.find((c) => c.id === txn.clinicId)?.name ?? '—'}</Td>
                      <Td align="right">{formatMoney(txn.amount, t.currency)}</Td>
                      <Td><Badge tone={statusTone[txn.status]}>{statusLabels[txn.status]}</Badge></Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="This period at a glance" subtitle="Your own record — nobody else sees this page." />
          <CardBody className="space-y-3 pt-2">
            <Figure label="Medical certificate days recorded" value={`${mcDays} day${mcDays === 1 ? '' : 's'}`} hint="Recorded through panel clinic visits" />
            <Figure label="Programmes joined" value={`${participation.length}`} hint="Registration is always voluntary" />
            <Figure label="Wallet last updated" value={wallet.lastTransactionDate ? formatDate(wallet.lastTransactionDate) : '—'} />
            <Link href="/app/privacy" className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand hover:underline">
              See exactly who can see what <ArrowRight size={14} />
            </Link>
          </CardBody>
        </Card>
      </div>

      {/* Journey */}
      <SectionTitle hint="A journey, not a claim form">{t.journey}</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {config.journey.map((stage, i) => {
          const Icon = journeyIcons[stage.icon];
          return (
            <Link key={stage.key} href={stage.href} className="group">
              <Card className="h-full p-5 transition-shadow hover:shadow-lift">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Icon size={17} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-soft">Step {i + 1}</p>
                    <p className="font-display text-[17px] leading-tight text-navy">{stage.title}</p>
                    <p className="mt-0.5 text-[12.5px] font-medium text-brand">{stage.subtitle}</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{stage.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Figure({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: 'ok' | 'warn' | 'risk' }) {
  return (
    <div className="rounded-xl border border-line bg-canvas/50 px-4 py-3">
      <p className="label">{label}</p>
      <p className={`mt-1 font-display text-[19px] leading-none ${tone === 'risk' ? 'text-risk' : tone === 'warn' ? 'text-warn' : tone === 'ok' ? 'text-ok' : 'text-navy'}`}>
        {value}
      </p>
      {hint ? <p className="mt-1.5 text-[12px] leading-snug text-ink-muted">{hint}</p> : null}
    </div>
  );
}

function Shortcut({ href, icon, label, value, hint }: { href: string; icon: React.ReactNode; label: string; value: string; hint: string }) {
  return (
    <Link href={href}>
      <Card className="h-full p-4 transition-shadow hover:shadow-lift">
        <div className="flex items-center gap-2 text-ink-soft">{icon}<span className="label">{label}</span></div>
        <p className="mt-2 truncate text-[14.5px] font-medium text-navy">{value}</p>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-ink-muted">{hint}</p>
      </Card>
    </Link>
  );
}
