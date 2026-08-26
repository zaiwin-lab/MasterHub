import type { TenantConfig } from '@/core/config/tenant';
import { stidc } from './stidc';

/**
 * Replication check (see docs/REPLICATION-CHECK.md).
 *
 * A second organisation with different entitlement, branding, structure,
 * thresholds and modules — expressed purely as configuration. No component,
 * service, calculation or route in the core was changed to add this tenant.
 */
export const sarawakAgencyB: TenantConfig = {
  ...stidc,
  id: 'agency-b',
  organisationName: 'Sarawak Agency B',
  organisationCode: 'SAB',
  shortName: 'Agency B',
  productName: 'StaffWell360',
  tagline: 'Healthy people, dependable service',
  logoMark: 'SW',
  welcomeText: 'One place for your benefit and your wellbeing.',
  theme: {
    ...stidc.theme,
    canvas: '#0B0F1E',
    surface: '#151A33',
    raised: '#1E2442',
    line: '#2A3154',
    primary: '#FF7A45',
    onPrimary: '#1A0A03',
    brand: '#FF7A45',
    violet: '#5B8CFF',
    gold: '#F2C14E',
    head: '#EFF1FF',
  },
  themeLight: {
    ...stidc.themeLight,
    canvas: '#F5F6FA',
    raised: '#ECEFF7',
    line: '#DBE0EC',
    head: '#161C33',
    primary: '#E2622C',
    onPrimary: '#FFFFFF',
    tint: '#1F2947',
    brand: '#E2622C',
    violet: '#3C63C9',
    gold: '#B4860F',
    ink: '#39415C',
    inkMuted: '#6B7590',
    inkSoft: '#98A1B8',
  },
  terminology: {
    ...stidc.terminology,
    benefit: 'Healthcare Benefit',
    wallet: 'Healthcare Benefit Wallet',
    employee: 'Officer',
    employees: 'Officers',
    unitSingular: 'Department',
    unitPlural: 'Departments',
    journey: 'My Wellbeing Journey',
  },
  modules: {
    ...stidc.modules,
    'wellbeing-pulse': false, // this client opted out of the pulse
    'activity-challenge': true,
    'wellness-rewards': true,
    ergonomics: false,
  },
  policies: [
    {
      ...stidc.policies[0],
      id: 'pol-standard',
      name: 'Officer Healthcare Benefit',
      annualAmount: 3000,
      thresholds: [
        { at: 60, level: 'awareness', label: 'Awareness', employeeMessage: 'You have used {pct} of your {benefit}. {available} remains.', raisesException: false, notify: ['employee'] },
        { at: 80, level: 'reminder', label: 'Reminder', employeeMessage: 'You have used {pct} of your {benefit}. {available} remains for the rest of the period.', raisesException: false, notify: ['employee'] },
        { at: 95, level: 'important', label: 'Important', employeeMessage: '{available} remains. Please speak to HR if further treatment is expected this period.', raisesException: true, notify: ['employee', 'hr'] },
        { at: 100, level: 'policy', label: 'Policy workflow', employeeMessage: 'Your {benefit} is fully utilised for this period. HR has been notified to arrange the next steps under policy.', raisesException: true, notify: ['employee', 'hr', 'finance'] },
      ],
      approval: { autoApproveUnder: 250, approverRoles: ['hr', 'finance'], allowExcess: false },
    },
  ],
  organisation: {
    divisions: [
      { name: 'Operations', departments: ['Field Services', 'Scheduling'] },
      { name: 'Corporate', departments: ['Human Resources', 'Finance'] },
      { name: 'Engineering', departments: ['Maintenance', 'Projects'] },
      { name: 'Customer Services', departments: ['Counter Services', 'Contact Centre'] },
    ],
    locations: ['Kuching', 'Samarahan', 'Serian'],
    employeeCategories: ['Permanent', 'Contract'],
    grades: ['Officer I', 'Officer II', 'Senior Officer', 'Support'],
  },
  programmeCategories: [
    'Health Screening',
    'Fitness Challenge',
    'Nutrition Awareness',
    'Preventive Campaign',
  ],
  managementKpis: [
    { key: 'totalEmployees', label: 'Total officers' },
    { key: 'eligibleEmployees', label: 'Eligible officers' },
    { key: 'ytdUtilisation', label: 'YTD utilisation' },
    { key: 'budgetUtilised', label: 'Budget utilised' },
    { key: 'projectedYearEnd', label: 'Projected year-end' },
    { key: 'aboveThreshold', label: 'Above policy threshold' },
    { key: 'pendingExceptions', label: 'Open exceptions' },
    { key: 'programmeParticipation', label: 'Programme participation' },
  ],
  privacy: {
    ...stidc.privacy,
    minimumAggregationGroup: 8, // stricter aggregation floor
  },
  support: {
    ...stidc.support,
    whatsappNumber: '60123344556',
    whatsappPrefill: 'Hello — I need help with my SEJAHTERA WORKS medical benefit.',
    helpdeskEmail: 'wellbeing@agencyb.demo',
  },
  credit: { ...stidc.credit },
  seed: { employees: 74, clinics: 6, months: 12, randomSeed: 90210 },
};
