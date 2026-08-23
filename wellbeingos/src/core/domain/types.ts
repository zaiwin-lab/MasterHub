/**
 * WellbeingOS — universal domain model (LAYER A).
 *
 * Nothing in this file may reference a specific client. Anything that varies
 * between organisations belongs in TenantConfig (src/core/config/tenant.ts).
 * Every record that describes organisational data carries `tenantId`; the data
 * layer refuses cross-tenant reads (see src/core/data/repository.ts).
 */

export type ID = string;
export type ISODate = string; // YYYY-MM-DD
export type ISODateTime = string;

/** Privacy zones — see docs/PRIVACY.md. Every readable entity declares one. */
export type PrivacyZone =
  | 'zone1' // administrative benefit data (HR / Finance / admin, per permission)
  | 'zone2' // personal wellbeing vault (employee-owned, consent controlled)
  | 'zone3'; // organisational intelligence (aggregated, suppressed below k)

export type RoleKey =
  | 'employee'
  | 'hr'
  | 'finance'
  | 'clinic'
  | 'wellbeing'
  | 'management'
  | 'admin';

export interface User {
  id: ID;
  tenantId: ID;
  name: string;
  email: string;
  roles: RoleKey[];
  employeeId?: ID; // present when the user is also a member of the workforce
  clinicId?: ID; // present for panel clinic personnel
  status: 'active' | 'suspended';
  lastSignInAt?: ISODateTime;
}

export interface OrganisationUnit {
  id: ID;
  tenantId: ID;
  name: string;
  type: 'division' | 'department';
  parentId?: ID;
}

export interface Employee {
  id: ID;
  tenantId: ID;
  staffNo: string;
  name: string;
  unitId: ID;
  location: string;
  category: string; // employee category, tenant-configured
  grade: string;
  joinDate: ISODate;
  status: 'active' | 'on-leave' | 'exited';
  eligible: boolean;
  policyId: ID;
  ageBand: string; // pre-banded; raw date of birth is never held in the demo dataset
}

export type BenefitPeriod = 'calendar-year' | 'financial-year';

export interface AlertThreshold {
  /** Percentage of entitlement at which this level triggers. */
  at: number;
  level: 'awareness' | 'reminder' | 'important' | 'policy';
  label: string;
  /** Supportive message template. Tokens: {name} {used} {available} {pct} {benefit} */
  employeeMessage: string;
  /** Whether crossing the threshold raises an exception for HR/Finance. */
  raisesException: boolean;
  notify: RoleKey[];
}

export interface BenefitPolicy {
  id: ID;
  tenantId: ID;
  name: string;
  annualAmount: number;
  period: BenefitPeriod;
  /** Categories of spend this policy covers. */
  serviceCategories: string[];
  eligibility: {
    categories: string[]; // employee categories entitled under this policy
    minMonthsService: number;
  };
  thresholds: AlertThreshold[];
  approval: {
    /** Transactions at or below this value are auto-approved after verification. */
    autoApproveUnder: number;
    /** Roles that may approve above the auto-approve line, in escalation order. */
    approverRoles: RoleKey[];
    /** Allow spend beyond entitlement (creates a recovery exposure case). */
    allowExcess: boolean;
  };
  carryForward: boolean;
}

export interface EmployeeBenefit {
  id: ID;
  tenantId: ID;
  employeeId: ID;
  policyId: ID;
  periodYear: number;
  entitlement: number;
  carriedForward: number;
}

export interface Clinic {
  id: ID;
  tenantId: ID;
  code: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  hours: string;
  services: string[];
  panelStatus: 'active' | 'suspended' | 'pending';
  agreementExpiry: ISODate;
}

export type TransactionStatus =
  | 'submitted'
  | 'verified'
  | 'approved'
  | 'rejected'
  | 'paid';

/** Immutable-by-convention ledger entry. Balances are always derived, never stored. */
export interface MedicalTransaction {
  id: ID;
  tenantId: ID;
  employeeId: ID;
  clinicId: ID;
  date: ISODate;
  periodYear: number;
  serviceCategory: string;
  amount: number;
  reference: string;
  mcDays: number;
  status: TransactionStatus;
  supportingRecord?: string; // reference to a document in secure storage
  notes?: string;
  createdBy: ID;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  /** True when the entry was accepted above the employee's available balance. */
  excess?: boolean;
}

export interface Approval {
  id: ID;
  tenantId: ID;
  transactionId: ID;
  actorId: ID;
  actorRole: RoleKey;
  action: 'verified' | 'approved' | 'rejected' | 'paid' | 'reopened';
  at: ISODateTime;
  remarks?: string;
}

export type ExceptionCategory =
  | 'threshold-approaching'
  | 'benefit-exhausted'
  | 'unusual-transaction'
  | 'eligibility-mismatch'
  | 'duplicate-submission'
  | 'missing-information'
  | 'pending-approval'
  | 'policy-exception'
  | 'recovery-case';

export interface ExceptionComment {
  id: ID;
  actorId: ID;
  at: ISODateTime;
  body: string;
}

export interface ExceptionCase {
  id: ID;
  tenantId: ID;
  reference: string;
  category: ExceptionCategory;
  title: string;
  detail: string;
  subjectEmployeeId?: ID;
  subjectTransactionId?: ID;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved' | 'dismissed';
  ownerRole: RoleKey;
  ownerUserId?: ID;
  openedAt: ISODateTime;
  updatedAt: ISODateTime;
  resolvedAt?: ISODateTime;
  resolution?: string;
  comments: ExceptionComment[];
}

export interface Notification {
  id: ID;
  tenantId: ID;
  audience: { roles?: RoleKey[]; employeeId?: ID };
  level: 'info' | 'reminder' | 'important';
  title: string;
  body: string;
  at: ISODateTime;
  read: boolean;
  href?: string;
}

/** Zone 2 — employee-owned. Aggregation only with consent. */
export interface WellbeingCheckIn {
  id: ID;
  tenantId: ID;
  employeeId: ID;
  date: ISODate;
  energy: number; // 1..5
  stress: number; // 1..5 (5 = highly stressed)
  activity: number; // 1..5
  workplace: number; // 1..5
  support: number; // 1..5
  note?: string; // never leaves the vault
  shareAggregate: boolean;
}

export interface WellbeingGoal {
  id: ID;
  tenantId: ID;
  employeeId: ID;
  title: string;
  metric: string;
  target: number;
  progress: number;
  dueDate: ISODate;
  status: 'active' | 'achieved' | 'paused';
}

export interface WellbeingProgramme {
  id: ID;
  tenantId: ID;
  name: string;
  category: string;
  description: string;
  targetGroup: string;
  startDate: ISODate;
  endDate: ISODate;
  capacity: number;
  registrationMode: 'open' | 'invite' | 'nominated';
  organiser: string;
  status: 'draft' | 'open' | 'running' | 'completed' | 'cancelled';
  relatedSignalCode?: string;
  outcomeIndicator?: string;
}

export interface ProgrammeParticipation {
  id: ID;
  tenantId: ID;
  programmeId: ID;
  employeeId: ID;
  registeredAt: ISODateTime;
  status: 'registered' | 'attended' | 'completed' | 'withdrawn';
  feedbackScore?: number; // 1..5
}

export type ConsentPurpose =
  | 'aggregate-wellbeing'
  | 'programme-invitations'
  | 'screening-results-to-wellbeing-team'
  | 'benefit-reminders';

export interface Consent {
  id: ID;
  tenantId: ID;
  employeeId: ID;
  purpose: ConsentPurpose;
  granted: boolean;
  version: string;
  updatedAt: ISODateTime;
}

export interface InsightSignal {
  id: ID;
  tenantId: ID;
  code: string;
  title: string;
  category: string;
  observation: string;
  organisationalInsight: string;
  recommendedResponse: string;
  severity: 'watch' | 'attention' | 'priority';
  metricLabel: string;
  current: number;
  previous: number;
  unit: '%' | 'count' | 'index' | 'RM';
  periodLabel: string;
  scope: string;
  populationSize: number;
  detectedAt: ISODateTime;
}

export interface Intervention {
  id: ID;
  tenantId: ID;
  signalCode: string;
  programmeId?: ID;
  title: string;
  status: 'proposed' | 'approved' | 'running' | 'measuring' | 'closed';
  owner: string;
  startedAt: ISODate;
  measureNote?: string;
  baseline?: number;
  latest?: number;
  decidedBy?: string; // human oversight is recorded, never implied
}

export interface AuditEvent {
  id: ID;
  tenantId: ID;
  at: ISODateTime;
  actorId: ID;
  actorRole: RoleKey;
  action: string;
  entity: string;
  entityId?: ID;
  zone: PrivacyZone;
  summary: string;
}

export interface ScreeningRecord {
  id: ID;
  tenantId: ID;
  employeeId: ID;
  programmeId: ID;
  date: ISODate;
  attended: boolean;
  /** Zone 2 — the employee sees their own summary; the organisation sees counts only. */
  personalSummary?: string;
  shareWithWellbeingTeam: boolean;
}
