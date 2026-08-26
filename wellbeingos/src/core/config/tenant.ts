/**
 * LAYER B — Tenant configuration.
 *
 * Onboarding another organisation should mean writing one of these objects,
 * not editing application code. Everything the UI, workflow engine, alerting,
 * analytics and reporting layers vary on is declared here.
 */
import type { AlertThreshold, BenefitPolicy, RoleKey } from '@/core/domain/types';

/**
 * Semantic, not literal. `head` is the strongest foreground, `primary` the
 * action fill, `tint` a neutral wash for hovers and overlays — which is what
 * lets one component set render correctly on a dark or a light canvas.
 */
export interface ThemeConfig {
  canvas: string;
  surface: string;
  raised: string;
  line: string;
  head: string;
  primary: string;
  onPrimary: string;
  tint: string;
  brand: string;
  violet: string;
  gold: string;
  ink: string;
  inkMuted: string;
  inkSoft: string;
  ok: string;
  warn: string;
  risk: string;
  info: string;
}

/** Every user-visible noun that differs between organisations. */
export interface Terminology {
  benefit: string;
  benefitShort: string;
  wallet: string;
  employee: string;
  employees: string;
  unitSingular: string;
  unitPlural: string;
  clinic: string;
  clinics: string;
  programme: string;
  programmes: string;
  journey: string;
  pulse: string;
  currency: string;
  currencyCode: string;
}

export type ModuleKey =
  | 'medical-benefit'
  | 'panel-clinic'
  | 'employee-wellbeing'
  | 'health-screening'
  | 'activity-challenge'
  | 'mental-wellbeing'
  | 'ergonomics'
  | 'preventive-campaigns'
  | 'absenteeism-insights'
  | 'wellness-rewards'
  | 'esg-reporting'
  | 'annual-wellbeing-report'
  | 'wellbeing-pulse'
  | 'intelligence-signals';

export interface JourneyStageConfig {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: 'know' | 'check' | 'prevent' | 'participate' | 'improve' | 'thrive';
}

export interface PrivacyConfig {
  /** Minimum group size before any Zone 3 aggregate is displayed. */
  minimumAggregationGroup: number;
  /** Purposes an employee may switch off. */
  optionalConsents: {
    purpose: string;
    title: string;
    description: string;
    defaultGranted: boolean;
  }[];
  retentionMonths: { transactions: number; wellbeing: number; audit: number };
  /** Plain-language disclosure rendered on the consent centre. */
  disclosure: { audience: string; canSee: string[]; cannotSee: string[] }[];
}

export interface KpiConfig {
  key: string;
  label: string;
  hint?: string;
}

export interface ReportConfig {
  key: string;
  name: string;
  description: string;
  audience: RoleKey[];
  zone: 'zone1' | 'zone3';
}

/**
 * Assistance channels rendered as the platform's two persistent floating
 * controls. They are configuration because every organisation routes support
 * to a different desk and a different number.
 */
export interface SupportConfig {
  /** E.164 without the plus, as wa.me expects it. */
  whatsappNumber: string;
  whatsappLabel: string;
  whatsappPrefill: string;
  assistantName: string;
  assistantTagline: string;
  /** Canned prompts offered when the assistant opens. */
  assistantPrompts: { question: string; answer: string }[];
  helpdeskEmail: string;
  helpdeskHours: string;
}

/** Delivery credit shown in the footer. */
export interface CreditConfig {
  builder: string;
  builderUrl: string;
  since: number;
}

export interface TenantConfig {
  id: string;
  organisationName: string;
  organisationCode: string;
  shortName: string;
  productName: string;
  tagline: string;
  logoMark: string; // short mark rendered in the brand block
  welcomeText: string;
  locale: string;
  /** Dark palette — the default presentation. */
  theme: ThemeConfig;
  /** Light palette. Same semantic keys, so no component knows which is active. */
  themeLight: ThemeConfig;
  terminology: Terminology;
  modules: Record<ModuleKey, boolean>;
  policies: Omit<BenefitPolicy, 'tenantId'>[];
  defaultPolicyId: string;
  organisation: {
    divisions: { name: string; departments: string[] }[];
    locations: string[];
    employeeCategories: string[];
    grades: string[];
  };
  journey: JourneyStageConfig[];
  programmeCategories: string[];
  serviceCategories: string[];
  privacy: PrivacyConfig;
  support: SupportConfig;
  credit: CreditConfig;
  managementKpis: KpiConfig[];
  reports: ReportConfig[];
  /** Seed shaping — demo dataset only; ignored once a real backend is attached. */
  seed: { employees: number; clinics: number; months: number; randomSeed: number };
}

export const defaultThresholds: AlertThreshold[] = [
  {
    at: 50,
    level: 'awareness',
    label: 'Awareness',
    employeeMessage:
      'You have used half of your {benefit} for this period. {available} remains — nothing to action, just so you know.',
    raisesException: false,
    notify: ['employee'],
  },
  {
    at: 75,
    level: 'reminder',
    label: 'Reminder',
    employeeMessage:
      'You have used {pct} of your {benefit}. {available} remains for the rest of the period — plan any non-urgent visits with that in mind.',
    raisesException: false,
    notify: ['employee'],
  },
  {
    at: 90,
    level: 'important',
    label: 'Important',
    employeeMessage:
      '{available} of your {benefit} remains. If you expect further treatment this period, speak to HR early so options can be arranged calmly.',
    raisesException: true,
    notify: ['employee', 'hr'],
  },
  {
    at: 100,
    level: 'policy',
    label: 'Policy workflow',
    employeeMessage:
      'Your {benefit} for this period is fully utilised. HR has been notified so that the next steps can be handled under policy — you do not need to do anything today.',
    raisesException: true,
    notify: ['employee', 'hr', 'finance'],
  },
];
