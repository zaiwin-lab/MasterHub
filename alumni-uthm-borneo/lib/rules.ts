// Shared by the browser form and the server API. Pure functions only.

export type ContributionType = 'individual' | 'corporate';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export const AMOUNTS: Record<ContributionType, { presets: number[]; min: number }> = {
  individual: { presets: [50, 100, 300, 500], min: 10 },
  corporate: { presets: [1000, 3000, 5000, 10000], min: 1000 },
};

/** Upper bound per online transaction. FPX retail limits sit around RM30,000. */
export const MAX_AMOUNT = 30000;

export const PURPOSES = [
  'General Alumni Contribution',
  'Alumni Programme',
  'Alumni Welfare',
  'Graduate Development',
  'Endowment Initiative',
  'Corporate Contribution',
  'Programme / Event Payment',
  'Other',
] as const;

export const LIMITS = { name: 120, email: 160, mobile: 20, remark: 500 } as const;

export interface ContributionInput {
  type: ContributionType;
  name: string;
  organisationName: string;
  email: string;
  mobile: string;
  purpose: string;
  amount: number;
  remark: string;
  acknowledged: boolean;
}

export type FieldErrors = Partial<Record<keyof ContributionInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Malaysian and international numbers: digits with optional +, spaces, dashes.
const MOBILE_RE = /^\+?[0-9][0-9\s-]{7,18}$/;

export function formatRM(amount: number): string {
  return (
    'RM' +
    amount.toLocaleString('en-MY', {
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: 2,
    })
  );
}

/** Always two decimals, for receipts and records. */
export function formatRM2(amount: number): string {
  return 'RM' + amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function parseAmount(raw: unknown): number {
  if (typeof raw === 'number') return Math.round(raw * 100) / 100;
  if (typeof raw !== 'string') return NaN;
  const cleaned = raw.replace(/[,\s]/g, '').replace(/^RM/i, '');
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return NaN;
  return Math.round(Number(cleaned) * 100) / 100;
}

export function validateContribution(input: ContributionInput): FieldErrors {
  const errors: FieldErrors = {};
  const rule = AMOUNTS[input.type];

  if (input.type !== 'individual' && input.type !== 'corporate') {
    errors.type = 'Choose a contribution type.';
  }

  const name = input.name.trim();
  if (!name) errors.name = input.type === 'corporate' ? 'Enter a contact person.' : 'Enter your name.';
  else if (name.length > LIMITS.name) errors.name = 'Name is too long.';

  if (input.type === 'corporate') {
    const org = input.organisationName.trim();
    if (!org) errors.organisationName = 'Enter the organisation name.';
    else if (org.length > LIMITS.name) errors.organisationName = 'Organisation name is too long.';
  }

  const email = input.email.trim();
  if (!email) errors.email = 'Email is required. Your receipt is sent here.';
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';

  const mobile = input.mobile.trim();
  if (!mobile) errors.mobile = 'Enter a mobile number.';
  else if (!MOBILE_RE.test(mobile)) errors.mobile = 'Enter a valid mobile number, e.g. 012-345 6789.';

  if (!(PURPOSES as readonly string[]).includes(input.purpose)) errors.purpose = 'Choose a purpose.';

  if (rule) {
    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      errors.amount = 'Choose or enter an amount.';
    } else if (input.amount < rule.min) {
      errors.amount =
        input.type === 'corporate'
          ? `Corporate contributions start from ${formatRM(rule.min)}.`
          : `The minimum amount is ${formatRM(rule.min)}.`;
    } else if (input.amount > MAX_AMOUNT) {
      errors.amount = `For amounts above ${formatRM(MAX_AMOUNT)}, please contact us for a direct arrangement.`;
    }
  }

  if (input.remark.length > LIMITS.remark) errors.remark = `Keep the remark under ${LIMITS.remark} characters.`;

  if (!input.acknowledged) errors.acknowledged = 'Please acknowledge the payment arrangement to continue.';

  return errors;
}

/** Name shown on receipts and tables: the organisation for corporate, the person otherwise. */
export function displayName(row: { type: string; name: string; organisation_name: string | null }): string {
  return row.type === 'corporate' && row.organisation_name ? row.organisation_name : row.name;
}
