import { describe, expect, it } from 'vitest';
import { parseAmount, validateContribution, type ContributionInput } from '@/lib/rules';

const base: ContributionInput = {
  type: 'individual',
  name: 'Aminah Binti Ali',
  organisationName: '',
  email: 'aminah@example.com',
  mobile: '012-345 6789',
  purpose: 'General Alumni Contribution',
  amount: 100,
  remark: '',
  acknowledged: true,
};

describe('validateContribution', () => {
  it('accepts a valid individual contribution', () => {
    expect(validateContribution(base)).toEqual({});
  });

  it('requires email', () => {
    expect(validateContribution({ ...base, email: '' }).email).toMatch(/required/);
    expect(validateContribution({ ...base, email: 'not-an-email' }).email).toBeDefined();
  });

  it('requires the payment arrangement acknowledgement', () => {
    expect(validateContribution({ ...base, acknowledged: false }).acknowledged).toBeDefined();
  });

  it('enforces the corporate minimum and organisation name', () => {
    const errs = validateContribution({ ...base, type: 'corporate', amount: 500 });
    expect(errs.amount).toMatch(/RM1,000/);
    expect(errs.organisationName).toBeDefined();
    expect(validateContribution({ ...base, type: 'corporate', amount: 1000, organisationName: 'ABC Sdn Bhd' })).toEqual({});
  });

  it('rejects unknown purposes and missing amounts', () => {
    expect(validateContribution({ ...base, purpose: 'Bribe' }).purpose).toBeDefined();
    expect(validateContribution({ ...base, amount: NaN }).amount).toBeDefined();
  });

  it('caps remark length', () => {
    expect(validateContribution({ ...base, remark: 'x'.repeat(501) }).remark).toBeDefined();
  });
});

describe('parseAmount', () => {
  it('parses custom amounts', () => {
    expect(parseAmount('1,250')).toBe(1250);
    expect(parseAmount('75.5')).toBe(75.5);
    expect(parseAmount('RM 20')).toBe(20);
    expect(parseAmount('12.345')).toBeNaN();
    expect(parseAmount('-5')).toBeNaN();
    expect(parseAmount('')).toBeNaN();
  });
});

describe('sniffProofType', () => {
  it('recognises allowed proof files by their bytes', async () => {
    const { sniffProofType } = await import('@/lib/rules');
    expect(sniffProofType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe('image/jpeg');
    expect(sniffProofType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0]))).toBe('image/png');
    expect(sniffProofType(new TextEncoder().encode('RIFF\0\0\0\0WEBPVP8 '))).toBe('image/webp');
    expect(sniffProofType(new TextEncoder().encode('%PDF-1.4'))).toBe('application/pdf');
    expect(sniffProofType(new TextEncoder().encode('<svg onload=alert(1)>'))).toBeNull();
    expect(sniffProofType(new Uint8Array([]))).toBeNull();
  });
});
