// ===========================================================================
// PRICING + WHATSAPP AUTOMATION  (Module C activation package & Module D)
// Single source of truth for the activation economics from the blueprint.
// ===========================================================================

export const PRICING = {
  websiteValue: 1000,
  activation: 500,          // Selected Business Launch Promotion (one-time)
  renewal: 300,             // per year
  addons: {
    chatbot: { id: 'chatbot', label: 'AI Chatbot Setup', price: 200, recurring: false,
      blurb: 'Auto-FAQ, lead capture, WhatsApp redirection & business assistant.' },
    news: { id: 'news', label: 'News & Updates Module', price: 100, recurring: false,
      blurb: 'Post promotions, events & company announcements.' },
    email: { id: 'email', label: 'Extra Business Email', price: 50, recurring: true, unit: '/year',
      blurb: 'Additional branded mailbox e.g. sales@yourbrand.com.' },
  },
  referral: { rewardPerActivation: 50, cashRedeemThreshold: 500 }, // Module H
};

export const KOBIS_WHATSAPP = '601128465813'; // KOBIS Berhad sales line

// Compute an order total from a selection.
// sel = { chatbot:bool, news:bool, emailCount:int }
export function quote(sel = {}) {
  const lines = [{ label: 'Website Activation (Launch Promo)', amount: PRICING.activation }];
  if (sel.chatbot) lines.push({ label: PRICING.addons.chatbot.label, amount: PRICING.addons.chatbot.price });
  if (sel.news) lines.push({ label: PRICING.addons.news.label, amount: PRICING.addons.news.price });
  const emails = Number(sel.emailCount) || 0;
  if (emails > 0) lines.push({ label: `Extra Business Email × ${emails}`, amount: PRICING.addons.email.price * emails });
  const total = lines.reduce((s, l) => s + l.amount, 0);
  const saved = PRICING.websiteValue - PRICING.activation;
  return { lines, total, saved };
}

// Build a pre-filled WhatsApp deep link (Module D).
export function whatsappActivation({ companyName, demoUrl, sel = {} }) {
  const q = quote(sel);
  const addonLines = q.lines.slice(1).map(l => `• ${l.label}: RM${l.amount}`).join('\n');
  const msg =
`Hi KOBIS, I would like to activate my website preview.

*Company:* ${companyName || '—'}
*Preview:* ${demoUrl || '—'}

*Package*
• Website Activation (Launch Promo): RM${PRICING.activation}${addonLines ? '\n' + addonLines : ''}

*Total: RM${q.total}*

Please assist me with activation. Thank you!`;
  return `https://wa.me/${KOBIS_WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

// Generic prospect outreach link used by the admin follow-up SOP (Rec 4).
export function whatsappOutreach(prospect, demoUrl, body) {
  const phone = (prospect.phone || '').replace(/[^0-9]/g, '');
  const text = body || `Hi ${prospect.contact_person || ''}, this is KOBIS Berhad 👋\n\nWe prepared a professional website preview for ${prospect.company_name} — no cost to view:\n${demoUrl}\n\nWould love your thoughts!`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

// WhatsApp follow-up cadence (Rec 4): Day 1 / Day 3 / Day 7.
export const FOLLOWUP_CADENCE = [
  { day: 1, label: 'Send preview + value prop', tone: 'Initial', sample: (p) => `Hi ${p.contact_person?.split(' ')[0] || ''}! We built a free website preview for ${p.company_name}. Take a look — no strings attached 👇` },
  { day: 3, label: 'First follow-up (if no reply)', tone: 'Check-in', sample: (p) => `Hi ${p.contact_person?.split(' ')[0] || ''}, did you get a chance to view your ${p.company_name} website preview? Happy to tweak anything 🙌` },
  { day: 7, label: 'Final nudge before archiving', tone: 'Last call', sample: (p) => `Hi ${p.contact_person?.split(' ')[0] || ''} — final check-in on your ${p.company_name} preview. We'll keep it live for 2 more days before it expires. Want to activate?` },
];
