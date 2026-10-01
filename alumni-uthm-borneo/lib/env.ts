import 'server-only';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export function siteUrl(): string {
  return required('NEXT_PUBLIC_SITE_URL').replace(/\/+$/, '');
}

export function toyyibpayConfig() {
  return {
    baseUrl: (process.env.TOYYIBPAY_BASE_URL || 'https://dev.toyyibpay.com').replace(/\/+$/, ''),
    secretKey: required('TOYYIBPAY_SECRET_KEY'),
    categoryCode: required('TOYYIBPAY_CATEGORY_CODE'),
    paymentChannel: process.env.TOYYIBPAY_PAYMENT_CHANNEL ?? '2',
    chargeToCustomer: process.env.TOYYIBPAY_CHARGE_TO_CUSTOMER ?? '',
  };
}

export function supabaseConfig() {
  return { url: required('SUPABASE_URL'), serviceKey: required('SUPABASE_SERVICE_ROLE_KEY') };
}

export function emailConfig() {
  const provider = (process.env.EMAIL_PROVIDER || 'resend').toLowerCase();
  if (provider !== 'resend' && provider !== 'brevo') throw new Error('EMAIL_PROVIDER must be resend or brevo');
  return {
    provider: provider as 'resend' | 'brevo',
    apiKey: required(provider === 'resend' ? 'RESEND_API_KEY' : 'BREVO_API_KEY'),
    fromName: process.env.EMAIL_FROM_NAME || 'Alumni UTHM Borneo',
    fromAddress: required('EMAIL_FROM_ADDRESS'),
    replyTo: process.env.EMAIL_REPLY_TO || '',
    bcc: process.env.EMAIL_BCC || '',
  };
}

export function adminConfig() {
  const password = required('ADMIN_PASSWORD');
  const secret = required('ADMIN_SESSION_SECRET');
  if (secret.length < 32) throw new Error('ADMIN_SESSION_SECRET must be at least 32 characters');
  return { password, secret };
}
