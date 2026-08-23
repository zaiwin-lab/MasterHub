/**
 * LAYER D — Integration adapters.
 *
 * Integration logic never leaks into the core. Each external system is reached
 * through one of these interfaces; the MVP ships mock implementations so the
 * platform runs end to end, and a deployment swaps in a real adapter by
 * changing the registry below (driven by environment configuration).
 *
 * See docs/INTEGRATIONS.md.
 */
import type { Employee, MedicalTransaction, OrganisationUnit } from '@/core/domain/types';

export interface HrisAdapter {
  /** Pull the workforce and structure. The core treats this as the source of record. */
  listEmployees(tenantId: string): Promise<Employee[]>;
  listUnits(tenantId: string): Promise<OrganisationUnit[]>;
  /** Called when eligibility must be confirmed against the HR system of record. */
  confirmEligibility(tenantId: string, staffNo: string): Promise<{ eligible: boolean; reason?: string }>;
}

export interface ClinicAdapter {
  /** A panel clinic system pushing a visit electronically instead of using the portal. */
  submitVisit(tenantId: string, visit: Omit<MedicalTransaction, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'reference'>): Promise<{ reference: string }>;
  /** Status write-back so the clinic can see settlement without a phone call. */
  publishStatus(tenantId: string, reference: string, status: MedicalTransaction['status']): Promise<void>;
}

export interface FinanceAdapter {
  /** Post approved utilisation to the finance system for settlement. */
  postSettlement(tenantId: string, batch: { reference: string; amount: number; clinicCode: string; date: string }[]): Promise<{ batchId: string }>;
}

export interface NotificationAdapter {
  send(message: {
    tenantId: string;
    channel: 'email' | 'sms' | 'whatsapp' | 'in-app';
    to: string;
    subject: string;
    body: string;
  }): Promise<{ delivered: boolean; id: string }>;
}

export interface IdentityAdapter {
  /** Single sign-on. The demo build uses a local persona picker instead. */
  authorizeUrl(tenantId: string, redirectUri: string): string;
  exchange(code: string): Promise<{ subject: string; email: string; name: string }>;
}

export interface DocumentAdapter {
  /** Supporting records live in secure storage; the platform holds a reference only. */
  putReference(tenantId: string, key: string, contentType: string): Promise<{ uploadUrl: string; reference: string }>;
  getReadUrl(tenantId: string, reference: string): Promise<string>;
}

export interface WearableAdapter {
  /** Zone 2 by definition: only ever aggregated, only ever with explicit consent. */
  dailyActivity(tenantId: string, employeeId: string, from: string, to: string): Promise<{ date: string; steps: number }[]>;
}

export interface AdapterRegistry {
  hris: HrisAdapter | null;
  clinic: ClinicAdapter | null;
  finance: FinanceAdapter | null;
  notify: NotificationAdapter;
  identity: IdentityAdapter | null;
  documents: DocumentAdapter | null;
  wearables: WearableAdapter | null;
}

/**
 * Mock notification adapter — writes to the in-app notification feed only.
 * Replacing this with an email or WhatsApp provider requires no core changes.
 */
export const inAppNotifier: NotificationAdapter = {
  async send(message) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info('[notify:mock]', message.channel, message.subject);
    }
    return { delivered: true, id: `mock-${Date.now()}` };
  },
};

/**
 * Adapters are resolved once, from environment configuration, so that swapping
 * a mock for a real integration is a deployment decision rather than a code change.
 */
export function resolveAdapters(): AdapterRegistry {
  return {
    hris: null,
    clinic: null,
    finance: null,
    notify: inAppNotifier,
    identity: null,
    documents: null,
    wearables: null,
  };
}
