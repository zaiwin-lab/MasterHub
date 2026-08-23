'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, AlertTriangle, Clock, Wallet, Users2 } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { can } from '@/core/access/permissions';
import { allWallets, listExceptions } from '@/core/data/repository';
import {
  categoryBreakdown, monthlySeries, monthToDate, orgOverview, participationBreakdown, pulseTrend,
  unitBreakdown, utilisationBands, type OrgFilters,
} from '@/core/analytics/organisation';
import {
  BandsChart, CategoryPie, ChartContainer, MonthlyBarChart, ParticipationChart,
  PulseLineChart, UnitBarChart, UtilisationTrendChart,
} from '@/components/charts';
import { Badge, Button, Card, CardBody, CardHeader, Sparkline, Stat, Table, Td, Th } from '@/components/ui/primitives';
import { Delta, MeterList, RadialGauge } from '@/components/ui/gauge';
import { PrivacyIndicator, SuppressedNotice } from '@/components/ui/privacy';
import { FilterBar } from '@/components/shell/filter-bar';
import { SectionTitle } from '@/components/shell/page-header';
import { formatDate, formatMoney, formatNumber } from '@/lib/utils';

/**
 * One organisational dashboard, shaped by capability.
 *
 * HR, Finance and Management see different cards from the same aggregates —
 * which is what keeps a single implementation reusable across roles and tenants.
 */
export function OrganisationDashboard({ variant }: { variant: 'hr' | 'finance' | 'management' }) {
  const { db, config, session } = useStore();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const t = config.terminology;

  const orgFilters: OrgFilters = useMemo(
    () => ({ unitId: filters.unitId || undefined, location: filters.location || undefined, category: filters.category || undefined, ageBand: filters.ageBand || undefined }),
    [filters],
  );

  const overview = useMemo(() => orgOverview(db, config, orgFilters), [db, config, orgFilters]);
  const months = useMemo(() => monthlySeries(db, orgFilters), [db, orgFilters]);
  const units = useMemo(() => unitBreakdown(db, config, orgFilters), [db, config, orgFilters]);
  const categories = useMemo(() => categoryBreakdown(db, orgFilters), [db, orgFilters]);
  const bands = useMemo(() => utilisationBands(db, orgFilters), [db, orgFilters]);
  const participation = useMemo(() => participationBreakdown(db, config), [db, config]);
  const pulse = useMemo(() => pulseTrend(db, config), [db, config]);
  const mtd = useMemo(() => monthToDate(db, orgFilters), [db, orgFilters]);
  const exceptions = session ? listExceptions(db, session) : [];
  const openExceptions = exceptions.filter((e) => e.status === 'open' || e.status === 'in-progress');

  const filterDefs = [
    { key: 'unitId', label: t.unitSingular, options: db.units.filter((u) => u.type === 'division').map((u) => ({ value: u.id, label: u.name })) },
    { key: 'location', label: 'Location', options: config.organisation.locations.map((l) => ({ value: l, label: l })) },
    { key: 'category', label: 'Category', options: config.organisation.employeeCategories.map((c) => ({ value: c, label: c })) },
    { key: 'ageBand', label: 'Age band', options: ['20–29', '30–39', '40–49', '50–59'].map((b) => ({ value: b, label: b })) },
  ];

  const title =
    variant === 'hr' ? 'Human Resources overview'
    : variant === 'finance' ? 'Financial governance'
    : 'Management command centre';

  const intro =
    variant === 'hr' ? 'Where the workforce stands on benefit utilisation, and what needs handling this week.'
    : variant === 'finance' ? 'Continuous financial visibility: committed, approved, forecast and exposure.'
    : 'What is happening across the organisation right now — patterns, not people.';

  return (
    <div>
      <header className="mb-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-display text-[22px] leading-tight text-head sm:text-[26px]">{title}</h1>
          <PrivacyIndicator zone={variant === 'management' ? 'zone3' : 'zone1'} note={variant === 'management' ? 'Aggregated only' : undefined} />
        </div>
        <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-ink-muted">{intro}</p>
      </header>

      <FilterBar filters={filterDefs} value={filters} onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))} onReset={() => setFilters({})} />

      {/* Command deck — the three figures a leader needs before anything else:
          where the budget stands, which way it is moving, and where it lands. */}
      <Card className="mb-4 overflow-hidden">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[auto_1fr_1fr] lg:items-center">
          <RadialGauge
            value={overview.approved}
            max={overview.totalEntitlement || 1}
            size={196}
            stroke={17}
            label="Budget utilised"
            caption={`${overview.ytdUtilisationPct}%`}
            sublabel={`${formatMoney(overview.approved, t.currency, { compact: true })} of ${formatMoney(overview.totalEntitlement, t.currency, { compact: true })}`}
            tone={overview.ytdUtilisationPct >= 90 ? 'risk' : overview.ytdUtilisationPct >= 75 ? 'warn' : 'brand'}
            className="mx-auto"
          />

          <div className="min-w-0">
            <p className="label">Month to date</p>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-[30px] font-semibold leading-none tabular-nums text-head">
                {formatMoney(mtd.current, t.currency, { compact: true })}
              </span>
              <Delta value={mtd.deltaPct} suffix="%" goodWhenDown />
            </div>
            <p className="mt-1 text-[12px] text-ink-soft">
              First {mtd.dayOfMonth} days, against the same span last month ({formatMoney(mtd.prior, t.currency, { compact: true })})
            </p>
            <Sparkline values={months.slice(0, overview.monthsElapsed).map((m) => m.approved)} accent="brand" className="h-12" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <MiniFigure label="Committed" value={formatMoney(overview.committed, t.currency, { compact: true })} tone="violet" />
              <MiniFigure label="Decision time" value={`${overview.avgTurnaroundDays} days`} />
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="label">Where it is going</p>
              <Badge tone="muted">Top categories</Badge>
            </div>
            <MeterList
              items={categories.slice(0, 5).map((c) => ({ label: c.category, value: c.amount, hint: `${c.count} transactions` }))}
              formatValue={(v) => formatMoney(v, t.currency, { compact: true })}
            />
          </div>
        </div>
      </Card>

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={`Total ${t.employees.toLowerCase()}`} value={formatNumber(overview.totalEmployees)} hint={`${formatNumber(overview.eligibleEmployees)} eligible under policy`} />
        <Stat
          label="YTD utilisation"
          value={`${overview.ytdUtilisationPct}%`}
          hint={`${formatMoney(overview.approved, t.currency, { compact: true })} of ${formatMoney(overview.totalEntitlement, t.currency, { compact: true })}`}
          tone={overview.ytdUtilisationPct > 85 ? 'warn' : undefined}
        />
        <Stat
          label="Projected year-end"
          value={`${overview.projectedUtilisationPct}%`}
          hint={`${formatMoney(overview.projectedYearEnd, t.currency, { compact: true })} at the current run rate`}
          tone={overview.projectedUtilisationPct > 100 ? 'risk' : overview.projectedUtilisationPct > 90 ? 'warn' : undefined}
        />
        <Stat
          label="Above policy threshold"
          value={formatNumber(overview.aboveThreshold)}
          hint={`${overview.exhausted} fully utilised`}
          tone={overview.aboveThreshold > 0 ? 'warn' : undefined}
        />

        {variant === 'finance' ? (
          <>
            <Stat label="Committed (pending)" value={formatMoney(overview.committed, t.currency, { compact: true })} hint="Reserved against entitlement, awaiting decision" />
            <Stat label="Recovery exposure" value={formatMoney(overview.recoveryExposure, t.currency, { compact: true })} tone={overview.recoveryExposure > 0 ? 'risk' : 'ok'} hint="Utilisation beyond entitlement" />
            <Stat label="Unspent entitlement" value={formatMoney(Math.max(0, overview.totalEntitlement - overview.approved), t.currency, { compact: true })} hint="Remaining across the eligible workforce" />
            <Stat label="Average turnaround" value={`${overview.avgTurnaroundDays} days`} hint="Submission to decision" />
          </>
        ) : null}

        {variant === 'hr' ? (
          <>
            <Stat label="Open exceptions" value={formatNumber(openExceptions.length)} tone={openExceptions.length > 12 ? 'warn' : undefined} hint="Handled during the year, not at year end" />
            <Stat label="Average turnaround" value={`${overview.avgTurnaroundDays} days`} hint="Submission to decision" />
            <Stat label="Transactions" value={formatNumber(overview.transactionCount)} hint={`This benefit period`} />
            <Stat label="Programme participation" value={`${overview.programmeParticipationPct}%`} hint="Of eligible staff" />
          </>
        ) : null}

        {variant === 'management' ? (
          <>
            <Stat label="Programme participation" value={`${overview.programmeParticipationPct}%`} hint="Of eligible staff" />
            <Stat label="Screening participation" value={`${overview.screeningParticipationPct}%`} hint="Attended, not results" />
            <Stat
              label="Wellbeing signal index"
              value={overview.wellbeingIndex.suppressed ? 'Suppressed' : `${overview.wellbeingIndex.value}`}
              hint={overview.wellbeingIndex.suppressed ? overview.wellbeingIndex.reason : `From ${overview.wellbeingIndex.populationSize} consented respondents`}
            />
            <Stat label="Open exceptions" value={formatNumber(overview.openExceptions)} hint="Across HR and Finance queues" />
          </>
        ) : null}
      </div>

      {/* Charts */}
      <SectionTitle hint="Approved spend to date against a straight-line projection">Utilisation trajectory</SectionTitle>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartContainer
          title="YTD vs projected year-end"
          subtitle={`${overview.monthsElapsed} of 12 months elapsed`}
          footnote="Projection is a straight-line run rate — deliberately simple so Finance can defend the figure."
        >
          <UtilisationTrendChart data={months} currency={t.currency} />
        </ChartContainer>
        <ChartContainer title="Monthly utilisation" subtitle="Approved versus committed by month">
          <MonthlyBarChart data={months} currency={t.currency} />
        </ChartContainer>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ChartContainer title={`Utilisation by ${t.unitSingular.toLowerCase()}`} subtitle="Where entitlement is being used" footnote={`Groups below ${config.privacy.minimumAggregationGroup} people are suppressed.`}>
          <UnitBarChart data={units.filter((u) => !u.suppressed)} />
        </ChartContainer>
        <ChartContainer title="Spend by service category" subtitle="Approved value this period">
          <CategoryPie data={categories} currency={t.currency} />
        </ChartContainer>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ChartContainer title="How utilisation is distributed" subtitle={`${t.employees} grouped by share of entitlement used`} footnote="A wide spread with a small tail is healthier than a uniform middle — it shows the benefit reaching those who need it.">
          <BandsChart data={bands} />
        </ChartContainer>

        {variant === 'management' ? (
          <Card>
            <CardHeader
              title="Organisational wellbeing signal"
              subtitle="Consented, aggregated responses only"
              action={<PrivacyIndicator zone="zone3" />}
            />
            <CardBody className="pt-2">
              {pulse.suppressed || !pulse.value?.length ? (
                <SuppressedNotice reason={pulse.reason} />
              ) : (
                <div style={{ height: 220 }}>
                  <PulseLineChart data={pulse.value} />
                </div>
              )}
              <p className="mt-3 text-[12px] leading-relaxed text-ink-soft">
                Index combines energy, stress, activity, workplace and support. Individual answers never leave the
                employee&apos;s vault.
              </p>
            </CardBody>
          </Card>
        ) : (
          <ChartContainer title="Programme participation" subtitle="Registered and completed by programme" height={280}>
            <ParticipationChart data={participation.filter((p) => !p.suppressed).map((p) => ({ programme: p.programme, registered: p.registered, completed: p.completed }))} />
          </ChartContainer>
        )}
      </div>

      {/* Division table */}
      <SectionTitle hint="Suppressed where the group is too small">{t.unitSingular} breakdown</SectionTitle>
      <Card>
        <CardBody className="pt-5">
          <Table>
            <thead>
              <tr>
                <Th>{t.unitSingular}</Th><Th align="right">Eligible</Th><Th align="right">Entitlement</Th>
                <Th align="right">Approved</Th><Th align="right">Utilisation</Th><Th align="right">Above threshold</Th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => (
                <tr key={u.unitId}>
                  <Td className="font-medium">{u.unit}</Td>
                  {u.suppressed ? (
                    <Td align="right" className="text-ink-soft" >—</Td>
                  ) : (
                    <Td align="right">{u.headcount}</Td>
                  )}
                  {u.suppressed ? (
                    <>
                      <Td align="right" className="text-ink-soft">—</Td>
                      <Td align="right" className="text-ink-soft">—</Td>
                      <Td align="right" className="text-ink-soft"><Badge tone="muted">Suppressed</Badge></Td>
                      <Td align="right" className="text-ink-soft">—</Td>
                    </>
                  ) : (
                    <>
                      <Td align="right">{formatMoney(u.entitlement, t.currency, { compact: true })}</Td>
                      <Td align="right">{formatMoney(u.approved, t.currency, { compact: true })}</Td>
                      <Td align="right">
                        <Badge tone={u.utilisationPct >= 90 ? 'risk' : u.utilisationPct >= 75 ? 'warn' : 'ok'}>{u.utilisationPct}%</Badge>
                      </Td>
                      <Td align="right">{u.aboveThreshold}</Td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Attention list */}
      {can(session, 'exception.read') ? (
        <>
          <SectionTitle hint="Resolve during the year, not at year end">Needs attention</SectionTitle>
          <Card>
            <CardHeader
              title={`${openExceptions.length} open exception${openExceptions.length === 1 ? '' : 's'}`}
              subtitle="Highest priority first."
              action={<Link href="/app/exceptions"><Button size="sm" variant="quiet">Open inbox <ArrowRight size={14} /></Button></Link>}
            />
            <CardBody className="pt-2">
              <Table>
                <thead>
                  <tr><Th>Reference</Th><Th>Case</Th><Th>Category</Th><Th>Priority</Th><Th>Owner</Th><Th>Opened</Th></tr>
                </thead>
                <tbody>
                  {openExceptions
                    .sort((a, b) => (a.priority === b.priority ? 0 : a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : a.priority === 'medium' ? -1 : 1))
                    .slice(0, 6)
                    .map((e) => (
                      <tr key={e.id}>
                        <Td className="font-medium">{e.reference}</Td>
                        <Td className="max-w-[280px] truncate">{e.title}</Td>
                        <Td className="text-ink-muted">{e.category.replace(/-/g, ' ')}</Td>
                        <Td><Badge tone={e.priority === 'high' ? 'risk' : e.priority === 'medium' ? 'warn' : 'muted'}>{e.priority}</Badge></Td>
                        <Td className="text-ink-muted">{e.ownerRole.toUpperCase()}</Td>
                        <Td className="text-ink-muted">{formatDate(e.openedAt)}</Td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </>
      ) : null}

      {/* Decision prompts — every dashboard must answer "so what?" */}
      <SectionTitle>What this means</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Insight icon={<TrendingUp size={16} />} title="Trajectory" body={`At the current run rate the organisation lands at ${overview.projectedUtilisationPct}% of entitlement by period end.`} />
        <Insight icon={<AlertTriangle size={16} />} title="Concentration" body={`${overview.aboveThreshold} people are past the policy threshold; ${overview.exhausted} have fully utilised.`} />
        <Insight icon={<Clock size={16} />} title="Responsiveness" body={`Decisions take ${overview.avgTurnaroundDays} days on average from submission.`} />
        <Insight icon={variant === 'finance' ? <Wallet size={16} /> : <Users2 size={16} />} title={variant === 'finance' ? 'Exposure' : 'Engagement'} body={variant === 'finance' ? `${formatMoney(overview.recoveryExposure, t.currency)} sits beyond entitlement and needs a policy decision.` : `${overview.programmeParticipationPct}% of eligible staff have joined a programme this period.`} />
      </div>
    </div>
  );
}

function MiniFigure({ label, value, tone }: { label: string; value: string; tone?: 'violet' }) {
  return (
    <div className="rounded-xl border border-line bg-raised/60 px-3 py-2.5">
      <p className="label">{label}</p>
      <p className={`mt-1 text-[15px] font-medium tabular-nums ${tone === 'violet' ? 'text-violet' : 'text-head'}`}>{value}</p>
    </div>
  );
}

function Insight({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-brand">{icon}<span className="label text-ink-soft">{title}</span></div>
      <p className="mt-2 text-[13px] leading-relaxed text-ink">{body}</p>
    </Card>
  );
}
