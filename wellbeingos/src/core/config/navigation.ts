/**
 * Role-aware, module-gated navigation.
 *
 * A route appears only when the session holds one of its capabilities and the
 * tenant has the owning module enabled — so navigation is derived, never
 * hand-maintained per client.
 */
import type { Capability } from '@/core/access/permissions';
import type { ModuleKey } from './tenant';

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: string;
  capabilities: Capability[];
  module?: ModuleKey;
  group: 'main' | 'manage' | 'account';
  description?: string;
}

export const navigation: NavItem[] = [
  { key: 'overview', label: 'Overview', href: '/app/overview', icon: 'home', capabilities: [], group: 'main', description: 'Your starting point' },
  { key: 'benefit', label: 'My Benefit', href: '/app/benefit', icon: 'wallet', capabilities: ['benefit.read.own'], module: 'medical-benefit', group: 'main' },
  { key: 'claims', label: 'Claims & Transactions', href: '/app/claims', icon: 'receipt', capabilities: ['transaction.read.own', 'transaction.read.any'], module: 'medical-benefit', group: 'main' },
  { key: 'clinics', label: 'Panel Clinics', href: '/app/clinics', icon: 'stethoscope', capabilities: ['clinic.read'], module: 'panel-clinic', group: 'main' },
  { key: 'wellbeing', label: 'My Wellbeing', href: '/app/wellbeing', icon: 'heart', capabilities: ['wellbeing.own'], module: 'employee-wellbeing', group: 'main' },
  { key: 'programmes', label: 'Programmes', href: '/app/programmes', icon: 'calendar', capabilities: ['programme.read'], module: 'employee-wellbeing', group: 'main' },
  { key: 'clinic-portal', label: 'Clinic Portal', href: '/app/clinic-portal', icon: 'clipboard', capabilities: ['clinic.verifyEligibility'], module: 'panel-clinic', group: 'main' },

  { key: 'insights', label: 'Insights', href: '/app/insights', icon: 'chart', capabilities: ['analytics.management', 'analytics.wellbeing', 'analytics.financial'], group: 'manage' },
  { key: 'signals', label: 'Wellbeing Intelligence', href: '/app/signals', icon: 'radar', capabilities: ['signal.read'], module: 'intelligence-signals', group: 'manage' },
  { key: 'exceptions', label: 'Exceptions', href: '/app/exceptions', icon: 'inbox', capabilities: ['exception.read'], group: 'manage' },
  { key: 'people', label: 'People', href: '/app/people', icon: 'users', capabilities: ['employee.read.directory'], group: 'manage' },
  { key: 'reports', label: 'Reports', href: '/app/reports', icon: 'file', capabilities: ['report.read'], group: 'manage' },
  { key: 'esg', label: 'ESG Value', href: '/app/esg', icon: 'leaf', capabilities: ['analytics.management'], module: 'esg-reporting', group: 'manage' },

  { key: 'privacy', label: 'Privacy & Consent', href: '/app/privacy', icon: 'lock', capabilities: ['consent.own'], group: 'account' },
  { key: 'admin', label: 'Administration', href: '/app/admin', icon: 'settings', capabilities: ['tenant.configure'], group: 'account' },
  { key: 'audit', label: 'Audit Trail', href: '/app/audit', icon: 'history', capabilities: ['audit.read'], group: 'account' },
];

export const groupLabels: Record<NavItem['group'], string> = {
  main: 'Workspace',
  manage: 'Organisation',
  account: 'Governance',
};
