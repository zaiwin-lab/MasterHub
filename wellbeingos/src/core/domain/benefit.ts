/**
 * Benefit wallet arithmetic.
 *
 * The available balance is always DERIVED from the transaction ledger; it is
 * never stored as an editable number. Every consumer of a balance — employee
 * dashboard, clinic eligibility check, finance exposure, management forecast —
 * calls into this module so a single definition governs the whole platform.
 */
import type {
  AlertThreshold,
  BenefitPolicy,
  MedicalTransaction,
  TransactionStatus,
} from './types';

/** Statuses that consume entitlement outright. */
export const CONSUMING: TransactionStatus[] = ['approved', 'paid'];
/** Statuses that reserve entitlement pending a decision. */
export const COMMITTING: TransactionStatus[] = ['submitted', 'verified'];

export interface Wallet {
  entitlement: number;
  approved: number;
  committed: number;
  available: number;
  /** Balance a clinic may rely on today: entitlement − approved − committed. */
  spendable: number;
  utilisationPct: number;
  committedPct: number;
  excess: number;
  transactionCount: number;
  lastTransactionDate?: string;
}

export function periodYearOf(date: string, period: BenefitPolicy['period']): number {
  const d = new Date(date);
  if (period === 'financial-year') {
    // Financial year assumed to start 1 April; configurable per tenant policy.
    return d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  }
  return d.getFullYear();
}

export function computeWallet(
  transactions: MedicalTransaction[],
  entitlement: number,
  periodYear: number,
): Wallet {
  const rows = transactions.filter((t) => t.periodYear === periodYear);
  const approved = round2(sum(rows.filter((t) => CONSUMING.includes(t.status)).map((t) => t.amount)));
  const committed = round2(sum(rows.filter((t) => COMMITTING.includes(t.status)).map((t) => t.amount)));
  const available = round2(entitlement - approved);
  const spendable = round2(Math.max(0, entitlement - approved - committed));
  const dates = rows.map((t) => t.date).sort();
  return {
    entitlement,
    approved,
    committed,
    available,
    spendable,
    utilisationPct: entitlement > 0 ? round1((approved / entitlement) * 100) : 0,
    committedPct: entitlement > 0 ? round1((committed / entitlement) * 100) : 0,
    excess: available < 0 ? round2(Math.abs(available)) : 0,
    transactionCount: rows.length,
    lastTransactionDate: dates.length ? dates[dates.length - 1] : undefined,
  };
}

/** The highest threshold the wallet has reached, or null below the first band. */
export function activeThreshold(
  wallet: Wallet,
  thresholds: AlertThreshold[],
): AlertThreshold | null {
  const reached = [...thresholds]
    .sort((a, b) => a.at - b.at)
    .filter((t) => wallet.utilisationPct >= t.at);
  return reached.length ? reached[reached.length - 1] : null;
}

/** The next band the employee is heading towards, for a forward-looking hint. */
export function nextThreshold(wallet: Wallet, thresholds: AlertThreshold[]): AlertThreshold | null {
  return [...thresholds].sort((a, b) => a.at - b.at).find((t) => wallet.utilisationPct < t.at) ?? null;
}

export function renderAlertMessage(
  template: string,
  ctx: { name: string; used: string; available: string; pct: string; benefit: string },
): string {
  return template
    .replace(/\{name\}/g, ctx.name)
    .replace(/\{used\}/g, ctx.used)
    .replace(/\{available\}/g, ctx.available)
    .replace(/\{pct\}/g, ctx.pct)
    .replace(/\{benefit\}/g, ctx.benefit);
}

/**
 * Straight-line projection of period-end utilisation from elapsed period share.
 * Deliberately simple and explainable — Finance must be able to defend it.
 */
export function projectPeriodEnd(
  approvedToDate: number,
  monthsElapsed: number,
  monthsInPeriod = 12,
): number {
  if (monthsElapsed <= 0) return 0;
  return round2((approvedToDate / monthsElapsed) * monthsInPeriod);
}

export const sum = (n: number[]) => n.reduce((a, b) => a + b, 0);
export const round2 = (n: number) => Math.round(n * 100) / 100;
export const round1 = (n: number) => Math.round(n * 10) / 10;
