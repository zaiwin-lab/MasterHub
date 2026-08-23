/**
 * Zone 3 — organisational intelligence.
 *
 * Every figure here is an aggregate. Nothing in this module returns a named
 * individual, and any group smaller than the tenant's aggregation floor is
 * suppressed rather than displayed. See docs/PRIVACY.md.
 */
import type { TenantConfig } from '@/core/config/tenant';
import { projectPeriodEnd, round1, round2, sum } from '@/core/domain/benefit';
import { aggregate, type Aggregate } from '@/core/domain/privacy';
import type { Dataset } from '@/core/data/seed';
import { allWallets, unitPath } from '@/core/data/repository';

export interface OrgFilters {
  unitId?: string;
  location?: string;
  category?: string;
  ageBand?: string;
  month?: number;
}

export interface OrgOverview {
  totalEmployees: number;
  eligibleEmployees: number;
  totalEntitlement: number;
  approved: number;
  committed: number;
  ytdUtilisationPct: number;
  projectedYearEnd: number;
  projectedUtilisationPct: number;
  aboveThreshold: number;
  exhausted: number;
  recoveryExposure: number;
  openExceptions: number;
  avgTurnaroundDays: number;
  transactionCount: number;
  avgMcDays: number;
  programmeParticipationPct: number;
  screeningParticipationPct: number;
  wellbeingIndex: Aggregate<number>;
  monthsElapsed: number;
}

function matches(db: Dataset, employeeId: string, f: OrgFilters): boolean {
  const emp = db.employees.find((e) => e.id === employeeId);
  if (!emp) return false;
  if (f.location && emp.location !== f.location) return false;
  if (f.category && emp.category !== f.category) return false;
  if (f.ageBand && emp.ageBand !== f.ageBand) return false;
  if (f.unitId) {
    const parent = db.units.find((u) => u.id === emp.unitId)?.parentId;
    if (emp.unitId !== f.unitId && parent !== f.unitId) return false;
  }
  return true;
}

export function orgOverview(db: Dataset, config: TenantConfig, f: OrgFilters = {}): OrgOverview {
  const wallets = allWallets(db).filter((w) => matches(db, w.employee.id, f));
  const eligible = wallets.filter((w) => w.employee.eligible);
  const monthsElapsed = new Date(db.referenceDate).getMonth() + 1;

  const totalEntitlement = round2(sum(eligible.map((w) => w.wallet.entitlement)));
  const approved = round2(sum(eligible.map((w) => w.wallet.approved)));
  const committed = round2(sum(eligible.map((w) => w.wallet.committed)));
  const projected = projectPeriodEnd(approved, monthsElapsed);

  const importantBand = config.policies[0].thresholds.find((t) => t.level === 'important')?.at ?? 90;
  const aboveThreshold = eligible.filter((w) => w.wallet.utilisationPct >= importantBand).length;
  const exhausted = eligible.filter((w) => w.wallet.utilisationPct >= 100).length;
  const recoveryExposure = round2(sum(eligible.map((w) => w.wallet.excess)));

  const ids = new Set(eligible.map((w) => w.employee.id));
  const txns = db.transactions.filter((t) => ids.has(t.employeeId));
  const decided = db.approvals.filter((a) => a.action === 'approved' || a.action === 'rejected');
  const turnarounds = decided
    .map((a) => {
      const txn = db.transactions.find((t) => t.id === a.transactionId);
      if (!txn) return null;
      return (new Date(a.at).getTime() - new Date(txn.createdAt).getTime()) / 86400000;
    })
    .filter((n): n is number => n !== null);

  const population = eligible.length;
  const participants = new Set(
    db.participation.filter((p) => ids.has(p.employeeId)).map((p) => p.employeeId),
  ).size;
  const screened = new Set(
    db.screenings.filter((s) => s.attended && ids.has(s.employeeId)).map((s) => s.employeeId),
  ).size;

  const shared = db.checkIns.filter((c) => c.shareAggregate && ids.has(c.employeeId));
  const respondents = new Set(shared.map((c) => c.employeeId)).size;

  return {
    totalEmployees: wallets.length,
    eligibleEmployees: population,
    totalEntitlement,
    approved,
    committed,
    ytdUtilisationPct: totalEntitlement ? round1((approved / totalEntitlement) * 100) : 0,
    projectedYearEnd: projected,
    projectedUtilisationPct: totalEntitlement ? round1((projected / totalEntitlement) * 100) : 0,
    aboveThreshold,
    exhausted,
    recoveryExposure,
    openExceptions: db.exceptions.filter((e) => e.status === 'open' || e.status === 'in-progress').length,
    avgTurnaroundDays: turnarounds.length ? round1(sum(turnarounds) / turnarounds.length) : 0,
    transactionCount: txns.length,
    avgMcDays: population ? round1(sum(txns.map((t) => t.mcDays)) / population) : 0,
    programmeParticipationPct: population ? round1((participants / population) * 100) : 0,
    screeningParticipationPct: population ? round1((screened / population) * 100) : 0,
    wellbeingIndex: aggregate(respondents, config.privacy.minimumAggregationGroup, () =>
      wellbeingIndexOf(shared),
    ),
    monthsElapsed,
  };
}

/** 0–100 composite: energy, low stress, activity, workplace and support, evenly weighted. */
export function wellbeingIndexOf(rows: { energy: number; stress: number; activity: number; workplace: number; support: number }[]): number {
  if (!rows.length) return 0;
  const score = rows.map((r) => {
    const positive = r.energy + (6 - r.stress) + r.activity + r.workplace + r.support;
    return (positive / 25) * 100;
  });
  return round1(sum(score) / score.length);
}

export interface MonthPoint {
  month: string;
  approved: number;
  committed: number;
  /** Null for months that have not happened yet, so the line stops rather than falling to zero. */
  cumulative: number | null;
  projected: number | null;
  transactions: number;
  mcDays: number;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function monthlySeries(db: Dataset, f: OrgFilters = {}): MonthPoint[] {
  const monthsElapsed = new Date(db.referenceDate).getMonth() + 1;
  const rows = db.transactions.filter((t) => matches(db, t.employeeId, f));
  let cumulative = 0;
  const perMonth: MonthPoint[] = [];
  for (let m = 0; m < 12; m += 1) {
    const inMonth = rows.filter((t) => new Date(t.date).getMonth() === m);
    const approved = round2(sum(inMonth.filter((t) => t.status === 'approved' || t.status === 'paid').map((t) => t.amount)));
    const committed = round2(sum(inMonth.filter((t) => t.status === 'submitted' || t.status === 'verified').map((t) => t.amount)));
    if (m < monthsElapsed) cumulative = round2(cumulative + approved);
    perMonth.push({
      month: MONTH_LABELS[m],
      approved: m < monthsElapsed ? approved : 0,
      committed: m < monthsElapsed ? committed : 0,
      cumulative: m < monthsElapsed ? cumulative : null,
      projected: null,
      transactions: m < monthsElapsed ? inMonth.length : 0,
      mcDays: m < monthsElapsed ? sum(inMonth.map((t) => t.mcDays)) : 0,
    });
  }
  // Forward projection line: straight-line run rate for the remaining months.
  const runRate = monthsElapsed ? cumulative / monthsElapsed : 0;
  for (let m = 0; m < 12; m += 1) {
    perMonth[m].projected =
      m < monthsElapsed - 1 ? null : round2(runRate * (m + 1));
  }
  return perMonth;
}

export interface UnitBreakdown {
  unitId: string;
  unit: string;
  headcount: number;
  entitlement: number;
  approved: number;
  utilisationPct: number;
  aboveThreshold: number;
  suppressed: boolean;
}

export function unitBreakdown(db: Dataset, config: TenantConfig, f: OrgFilters = {}): UnitBreakdown[] {
  const divisions = db.units.filter((u) => u.type === 'division');
  const wallets = allWallets(db).filter((w) => matches(db, w.employee.id, f));
  const importantBand = config.policies[0].thresholds.find((t) => t.level === 'important')?.at ?? 90;

  return divisions
    .map((div) => {
      const members = wallets.filter(
        (w) => w.employee.unitId === div.id || db.units.find((u) => u.id === w.employee.unitId)?.parentId === div.id,
      );
      const eligible = members.filter((m) => m.employee.eligible);
      const entitlement = round2(sum(eligible.map((m) => m.wallet.entitlement)));
      const approved = round2(sum(eligible.map((m) => m.wallet.approved)));
      const suppressed = eligible.length < config.privacy.minimumAggregationGroup;
      return {
        unitId: div.id,
        unit: div.name,
        headcount: eligible.length,
        entitlement: suppressed ? 0 : entitlement,
        approved: suppressed ? 0 : approved,
        utilisationPct: suppressed || !entitlement ? 0 : round1((approved / entitlement) * 100),
        aboveThreshold: suppressed ? 0 : eligible.filter((m) => m.wallet.utilisationPct >= importantBand).length,
        suppressed,
      };
    })
    .sort((a, b) => b.utilisationPct - a.utilisationPct);
}

export function categoryBreakdown(db: Dataset, f: OrgFilters = {}): { category: string; amount: number; count: number }[] {
  const rows = db.transactions.filter(
    (t) => matches(db, t.employeeId, f) && (t.status === 'approved' || t.status === 'paid'),
  );
  const map = new Map<string, { amount: number; count: number }>();
  rows.forEach((t) => {
    const cur = map.get(t.serviceCategory) ?? { amount: 0, count: 0 };
    map.set(t.serviceCategory, { amount: cur.amount + t.amount, count: cur.count + 1 });
  });
  return [...map.entries()]
    .map(([category, v]) => ({ category, amount: round2(v.amount), count: v.count }))
    .sort((a, b) => b.amount - a.amount);
}

export function utilisationBands(db: Dataset, f: OrgFilters = {}): { band: string; employees: number }[] {
  const wallets = allWallets(db).filter((w) => w.employee.eligible && matches(db, w.employee.id, f));
  const bands = [
    { band: '0–24%', test: (p: number) => p < 25 },
    { band: '25–49%', test: (p: number) => p >= 25 && p < 50 },
    { band: '50–74%', test: (p: number) => p >= 50 && p < 75 },
    { band: '75–89%', test: (p: number) => p >= 75 && p < 90 },
    { band: '90–99%', test: (p: number) => p >= 90 && p < 100 },
    { band: '100%+', test: (p: number) => p >= 100 },
  ];
  return bands.map((b) => ({
    band: b.band,
    employees: wallets.filter((w) => b.test(w.wallet.utilisationPct)).length,
  }));
}

export interface ParticipationRow {
  programme: string;
  category: string;
  status: string;
  registered: number;
  completed: number;
  capacity: number;
  fillPct: number;
  suppressed: boolean;
}

export function participationBreakdown(db: Dataset, config: TenantConfig): ParticipationRow[] {
  return db.programmes.map((p) => {
    const rows = db.participation.filter((x) => x.programmeId === p.id);
    const suppressed = rows.length > 0 && rows.length < config.privacy.minimumAggregationGroup;
    return {
      programme: p.name,
      category: p.category,
      status: p.status,
      registered: suppressed ? 0 : rows.length,
      completed: suppressed ? 0 : rows.filter((r) => r.status === 'completed').length,
      capacity: p.capacity,
      fillPct: suppressed || !p.capacity ? 0 : round1((rows.length / p.capacity) * 100),
      suppressed,
    };
  });
}

/** Pulse trend for Zone 3 — consented responses only, suppressed below the floor. */
export function pulseTrend(db: Dataset, config: TenantConfig): Aggregate<{ month: string; index: number; responses: number }[]> {
  const shared = db.checkIns.filter((c) => c.shareAggregate);
  const respondents = new Set(shared.map((c) => c.employeeId)).size;
  return aggregate(respondents, config.privacy.minimumAggregationGroup, () => {
    const monthsElapsed = new Date(db.referenceDate).getMonth() + 1;
    const points: { month: string; index: number; responses: number }[] = [];
    for (let m = 0; m < monthsElapsed; m += 1) {
      const rows = shared.filter((c) => new Date(c.date).getMonth() === m);
      if (rows.length < config.privacy.minimumAggregationGroup) continue;
      points.push({ month: MONTH_LABELS[m], index: wellbeingIndexOf(rows), responses: rows.length });
    }
    return points;
  });
}

export { MONTH_LABELS };
