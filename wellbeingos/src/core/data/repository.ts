/**
 * Repository layer.
 *
 * Every read passes through here with a Session, and scoping is applied at the
 * data boundary rather than in the UI — an employee session asking for the
 * transaction list receives only their own rows even if a route is reached
 * directly. Swapping the seeded dataset for a hosted backend means replacing
 * the body of these functions; call sites do not change. See docs/ARCHITECTURE.md.
 */
import type { Session } from '@/core/access/permissions';
import { can } from '@/core/access/permissions';
import { computeWallet, type Wallet } from '@/core/domain/benefit';
import type {
  Consent,
  Employee,
  ExceptionCase,
  MedicalTransaction,
  Notification,
  ProgrammeParticipation,
  WellbeingCheckIn,
  WellbeingGoal,
} from '@/core/domain/types';
import type { Dataset } from './seed';

export class AccessDenied extends Error {
  constructor(capability: string) {
    super(`Access denied: ${capability}`);
    this.name = 'AccessDenied';
  }
}

/** Guards every entry point: no session may ever read across tenants. */
function assertTenant(db: Dataset, session: Session) {
  if (db.tenantId !== session.tenantId) throw new AccessDenied('tenant.isolation');
}

export interface TransactionFilters {
  employeeId?: string;
  clinicId?: string;
  status?: MedicalTransaction['status'];
  category?: string;
  unitId?: string;
  location?: string;
  from?: string;
  to?: string;
  search?: string;
}

export function listTransactions(
  db: Dataset,
  session: Session,
  filters: TransactionFilters = {},
): MedicalTransaction[] {
  assertTenant(db, session);
  let rows = db.transactions;

  if (can(session, 'transaction.read.any')) {
    // full administrative view
  } else if (can(session, 'transaction.create') && session.clinicId) {
    // a panel clinic sees only what it submitted itself
    rows = rows.filter((t) => t.clinicId === session.clinicId);
  } else if (can(session, 'transaction.read.own') && session.employeeId) {
    rows = rows.filter((t) => t.employeeId === session.employeeId);
  } else {
    return [];
  }

  const employeeById = new Map(db.employees.map((e) => [e.id, e]));
  return rows
    .filter((t) => (filters.employeeId ? t.employeeId === filters.employeeId : true))
    .filter((t) => (filters.clinicId ? t.clinicId === filters.clinicId : true))
    .filter((t) => (filters.status ? t.status === filters.status : true))
    .filter((t) => (filters.category ? t.serviceCategory === filters.category : true))
    .filter((t) => (filters.from ? t.date >= filters.from : true))
    .filter((t) => (filters.to ? t.date <= filters.to : true))
    .filter((t) => {
      if (!filters.unitId && !filters.location) return true;
      const emp = employeeById.get(t.employeeId);
      if (!emp) return false;
      const unitOk = filters.unitId ? emp.unitId === filters.unitId || unitParent(db, emp.unitId) === filters.unitId : true;
      const locOk = filters.location ? emp.location === filters.location : true;
      return unitOk && locOk;
    })
    .filter((t) => {
      if (!filters.search) return true;
      const q = filters.search.toLowerCase();
      const emp = employeeById.get(t.employeeId);
      return (
        t.reference.toLowerCase().includes(q) ||
        t.serviceCategory.toLowerCase().includes(q) ||
        (emp?.name.toLowerCase().includes(q) ?? false) ||
        (emp?.staffNo.toLowerCase().includes(q) ?? false)
      );
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function unitParent(db: Dataset, unitId: string): string | undefined {
  return db.units.find((u) => u.id === unitId)?.parentId;
}

export function unitPath(db: Dataset, unitId: string): string {
  const unit = db.units.find((u) => u.id === unitId);
  if (!unit) return '—';
  const parent = unit.parentId ? db.units.find((u) => u.id === unit.parentId) : undefined;
  return parent ? `${parent.name} · ${unit.name}` : unit.name;
}

export function getEmployee(db: Dataset, session: Session, employeeId: string): Employee | null {
  assertTenant(db, session);
  const own = session.employeeId === employeeId;
  if (!own && !can(session, 'employee.read.directory') && !can(session, 'clinic.verifyEligibility')) return null;
  return db.employees.find((e) => e.id === employeeId) ?? null;
}

export function listEmployees(db: Dataset, session: Session): Employee[] {
  assertTenant(db, session);
  if (can(session, 'employee.read.directory')) return db.employees;
  if (session.employeeId) return db.employees.filter((e) => e.id === session.employeeId);
  return [];
}

export function entitlementFor(db: Dataset, employeeId: string): number {
  return db.benefits.find((b) => b.employeeId === employeeId && b.periodYear === db.periodYear)?.entitlement ?? 0;
}

export function walletFor(db: Dataset, employeeId: string): Wallet {
  return computeWallet(
    db.transactions.filter((t) => t.employeeId === employeeId),
    entitlementFor(db, employeeId),
    db.periodYear,
  );
}

/** Wallets for the whole eligible workforce — the base of every Zone 1 aggregate. */
export function allWallets(db: Dataset): { employee: Employee; wallet: Wallet }[] {
  const byEmployee = new Map<string, MedicalTransaction[]>();
  db.transactions.forEach((t) => {
    const list = byEmployee.get(t.employeeId);
    if (list) list.push(t);
    else byEmployee.set(t.employeeId, [t]);
  });
  return db.employees.map((employee) => ({
    employee,
    wallet: computeWallet(byEmployee.get(employee.id) ?? [], entitlementFor(db, employee.id), db.periodYear),
  }));
}

export function listExceptions(
  db: Dataset,
  session: Session,
  filters: { status?: ExceptionCase['status']; category?: string; priority?: string; ownerRole?: string } = {},
): ExceptionCase[] {
  assertTenant(db, session);
  if (!can(session, 'exception.read')) return [];
  return db.exceptions
    .filter((e) => (filters.status ? e.status === filters.status : true))
    .filter((e) => (filters.category ? e.category === filters.category : true))
    .filter((e) => (filters.priority ? e.priority === filters.priority : true))
    .filter((e) => (filters.ownerRole ? e.ownerRole === filters.ownerRole : true))
    .sort((a, b) => (a.openedAt < b.openedAt ? 1 : -1));
}

/** Zone 2 — the vault only ever answers to its owner. */
export function myCheckIns(db: Dataset, session: Session): WellbeingCheckIn[] {
  assertTenant(db, session);
  if (!can(session, 'wellbeing.own') || !session.employeeId) return [];
  return db.checkIns
    .filter((c) => c.employeeId === session.employeeId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function myGoals(db: Dataset, session: Session): WellbeingGoal[] {
  assertTenant(db, session);
  if (!can(session, 'wellbeing.own') || !session.employeeId) return [];
  return db.goals.filter((g) => g.employeeId === session.employeeId);
}

export function myConsents(db: Dataset, session: Session): Consent[] {
  assertTenant(db, session);
  if (!can(session, 'consent.own') || !session.employeeId) return [];
  return db.consents.filter((c) => c.employeeId === session.employeeId);
}

export function myParticipation(db: Dataset, session: Session): ProgrammeParticipation[] {
  assertTenant(db, session);
  if (!session.employeeId) return [];
  return db.participation.filter((p) => p.employeeId === session.employeeId);
}

export function notificationsFor(db: Dataset, session: Session): Notification[] {
  assertTenant(db, session);
  return db.notifications
    .filter((n) => {
      if (n.audience.employeeId) return n.audience.employeeId === session.employeeId;
      if (n.audience.roles) return n.audience.roles.some((r) => session.roles.includes(r));
      return false;
    })
    .sort((a, b) => (a.at < b.at ? 1 : -1));
}

/**
 * Clinic eligibility lookup — deliberately narrow. A clinic learns whether the
 * person in front of them is covered and what remains, and nothing else.
 */
export interface EligibilityView {
  employeeId: string;
  name: string;
  staffNo: string;
  eligible: boolean;
  status: string;
  entitlement: number;
  spendable: number;
  utilisationPct: number;
  policyName: string;
}

export function verifyEligibility(
  db: Dataset,
  session: Session,
  query: string,
): EligibilityView | null {
  assertTenant(db, session);
  if (!can(session, 'clinic.verifyEligibility')) throw new AccessDenied('clinic.verifyEligibility');
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const employee = db.employees.find(
    (e) => e.staffNo.toLowerCase() === q || e.name.toLowerCase() === q || e.id.toLowerCase() === q,
  );
  if (!employee) return null;
  const wallet = walletFor(db, employee.id);
  const policy = db.policies.find((p) => p.id === employee.policyId);
  return {
    employeeId: employee.id,
    name: employee.name,
    staffNo: employee.staffNo,
    eligible: employee.eligible && employee.status !== 'exited',
    status: employee.status,
    entitlement: wallet.entitlement,
    spendable: wallet.spendable,
    utilisationPct: wallet.utilisationPct,
    policyName: policy?.name ?? '—',
  };
}
