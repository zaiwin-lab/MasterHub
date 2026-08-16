import type { Consents, Snapshot } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Email capture only renders when a destination is actually configured. A form
 *  that promises to send a copy and silently drops it is worse than no form. */
export const captureConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

/** Deliberately invalid by default, so a demo build can never dial a stranger. */
const WHATSAPP = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) || '60000000000';
export const whatsappConfigured = WHATSAPP !== '60000000000';

const BOOKING = (import.meta.env.VITE_BOOKING_URL as string | undefined) || '';
export const bookingConfigured = Boolean(BOOKING);
export const bookingUrl = (scanId: string) =>
  BOOKING ? `${BOOKING}${BOOKING.includes('?') ? '&' : '?'}scan=${encodeURIComponent(scanId)}` : '';

export function whatsappUrl(text: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
  business: string;
}

export async function saveScan(
  contact: Contact,
  snapshot: Snapshot,
  consents: Consents,
  answers: Record<string, unknown>,
): Promise<void> {
  if (!captureConfigured) throw new Error('capture-not-configured');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/scans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY as string,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      scan_id: snapshot.scan_id,
      instrument_version: snapshot.instrument_version,
      scoring_version: snapshot.scoring_version,
      language: snapshot.language,
      respondent_type: snapshot.respondent_type,
      mvp3_index: snapshot.mvp3_index,
      total_monthly_leak: snapshot.total_monthly_leak,
      mvp3_candidate: snapshot.mvp3_candidate.key,
      contact_name: contact.name,
      contact_email: contact.email,
      contact_phone: contact.phone,
      business_name: contact.business,
      answers,
      snapshot,
      consents,
    }),
  });
  if (!res.ok) throw new Error(`capture-failed-${res.status}`);
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
