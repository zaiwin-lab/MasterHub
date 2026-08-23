/**
 * Role → capability matrix and the session guard.
 *
 * Permission is checked in the data layer, not only in navigation: a role that
 * cannot read a capability gets an empty result from the repository even if a
 * route is reached directly. See docs/ROLES.md.
 */
import type { PrivacyZone, RoleKey } from '@/core/domain/types';

export type Capability =
  // Zone 1 — administrative
  | 'benefit.read.own'
  | 'benefit.read.any'
  | 'transaction.read.own'
  | 'transaction.read.any'
  | 'transaction.create'
  | 'transaction.verify'
  | 'transaction.approve'
  | 'transaction.pay'
  | 'employee.read.directory'
  | 'employee.read.record'
  | 'exception.read'
  | 'exception.manage'
  | 'clinic.read'
  | 'clinic.manage'
  | 'clinic.verifyEligibility'
  // Zone 2 — personal vault
  | 'wellbeing.own'
  | 'consent.own'
  // Zone 3 — organisational intelligence
  | 'analytics.utilisation'
  | 'analytics.financial'
  | 'analytics.wellbeing'
  | 'analytics.management'
  | 'signal.read'
  | 'intervention.manage'
  | 'programme.read'
  | 'programme.register'
  | 'programme.manage'
  // Governance & platform
  | 'report.read'
  | 'audit.read'
  | 'tenant.configure'
  | 'user.manage';

export const roleLabels: Record<RoleKey, string> = {
  employee: 'Employee',
  hr: 'Human Resources',
  finance: 'Finance',
  clinic: 'Panel Clinic',
  wellbeing: 'Wellbeing Team',
  management: 'Management',
  admin: 'Administrator',
};

export const roleDescriptions: Record<RoleKey, string> = {
  employee: 'Own benefit, own wellbeing, own consent. No visibility of other people.',
  hr: 'Administrative benefit data and exception handling. No wellbeing vault access.',
  finance: 'Utilisation, exposure, forecasting and recovery. No wellbeing data.',
  clinic: 'Eligibility verification and visit submission for the attending person only.',
  wellbeing: 'Programmes, interventions and aggregated signals. Never individual answers.',
  management: 'Organisational patterns, forecasts and participation. No personal records.',
  admin: 'Configuration, users, permissions and audit. No clinical detail.',
};

const matrix: Record<RoleKey, Capability[]> = {
  employee: [
    'benefit.read.own',
    'transaction.read.own',
    'wellbeing.own',
    'consent.own',
    'clinic.read',
    'programme.read',
    'programme.register',
  ],
  hr: [
    'benefit.read.any',
    'transaction.read.any',
    'transaction.verify',
    'transaction.approve',
    'employee.read.directory',
    'employee.read.record',
    'exception.read',
    'exception.manage',
    'clinic.read',
    'analytics.utilisation',
    'analytics.management',
    'programme.read',
    'programme.manage',
    'report.read',
  ],
  finance: [
    'benefit.read.any',
    'transaction.read.any',
    'transaction.approve',
    'transaction.pay',
    'employee.read.directory',
    'exception.read',
    'exception.manage',
    'analytics.utilisation',
    'analytics.financial',
    'analytics.management',
    'report.read',
  ],
  clinic: ['clinic.verifyEligibility', 'transaction.create', 'clinic.read'],
  wellbeing: [
    'analytics.wellbeing',
    'signal.read',
    'intervention.manage',
    'programme.read',
    'programme.manage',
    'report.read',
    'employee.read.directory',
  ],
  management: [
    'analytics.utilisation',
    'analytics.financial',
    'analytics.wellbeing',
    'analytics.management',
    'signal.read',
    'programme.read',
    'exception.read',
    'report.read',
  ],
  admin: [
    'tenant.configure',
    'user.manage',
    'clinic.manage',
    'clinic.read',
    'audit.read',
    'report.read',
    'exception.read',
    'employee.read.directory',
    'analytics.management',
    'programme.read',
  ],
};

/** Capabilities that reach into the personal wellbeing vault. Zone 2 is employee-only. */
export const zoneOfCapability: Partial<Record<Capability, PrivacyZone>> = {
  'wellbeing.own': 'zone2',
  'consent.own': 'zone2',
  'analytics.wellbeing': 'zone3',
  'analytics.management': 'zone3',
  'signal.read': 'zone3',
};

export interface Session {
  userId: string;
  tenantId: string;
  name: string;
  roles: RoleKey[];
  employeeId?: string;
  clinicId?: string;
}

export function capabilitiesFor(roles: RoleKey[]): Capability[] {
  const set = new Set<Capability>();
  roles.forEach((r) => matrix[r]?.forEach((c) => set.add(c)));
  return [...set];
}

export function can(session: Session | null, capability: Capability): boolean {
  if (!session) return false;
  return capabilitiesFor(session.roles).includes(capability);
}

export function canAny(session: Session | null, capabilities: Capability[]): boolean {
  return capabilities.some((c) => can(session, c));
}

export function roleMatrix(): { capability: Capability; roles: Record<RoleKey, boolean> }[] {
  const all = new Set<Capability>();
  (Object.keys(matrix) as RoleKey[]).forEach((r) => matrix[r].forEach((c) => all.add(c)));
  return [...all].sort().map((capability) => ({
    capability,
    roles: (Object.keys(matrix) as RoleKey[]).reduce(
      (acc, r) => ({ ...acc, [r]: matrix[r].includes(capability) }),
      {} as Record<RoleKey, boolean>,
    ),
  }));
}
