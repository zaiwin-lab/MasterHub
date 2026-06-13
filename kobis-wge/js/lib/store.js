// ===========================================================================
// STORE — Supabase-shaped data layer (offline-first, localStorage-backed).
// Schema mirrors the blueprint tables 1:1 so a real Supabase client can be
// dropped in later with zero shape changes:
//   prospects, clients, orders, referrals, credit_wallets, link_events,
//   followups, waitlist, team_members.
// Emits change events so views re-render reactively.
// ===========================================================================
import { scoreProspect } from './scoring.js';
import { PRICING } from './pricing.js';
import { generateWebsite } from './aigen.js';
import * as remote from './db.js';

const KEY = 'kobis_wge_v1';
const listeners = new Set();
let db = null;

// ---- pipeline status definitions (Module A) ------------------------------
export const STATUSES = [
  { id: 'identified', label: 'Prospect Identified', color: '#5e6884' },
  { id: 'generated', label: 'Website Generated', color: '#7c5cff' },
  { id: 'sent', label: 'Preview Sent', color: '#4cc9ff' },
  { id: 'interested', label: 'Interested', color: '#ffb547' },
  { id: 'quoted', label: 'Quotation Sent', color: '#ff9d4c' },
  { id: 'activated', label: 'Activated', color: '#00e5a0' },
  { id: 'renewal', label: 'Renewal Due', color: '#ff5d73' },
];
export const statusLabel = (id) => STATUSES.find(s => s.id === id)?.label || id;
export const statusColor = (id) => STATUSES.find(s => s.id === id)?.color || '#5e6884';

// ---- helpers -------------------------------------------------------------
const uid = (pfx) => pfx + '_' + Math.random().toString(36).slice(2, 9);
const now = () => new Date().toISOString();
const daysFromNow = (d) => new Date(Date.now() + d * 864e5).toISOString();
const daysAgo = (d) => new Date(Date.now() - d * 864e5).toISOString();
const slug = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ===========================================================================
// SEED — a realistic pre-launch pipeline (Rec 10: 10–20 previews on Day 1)
// ===========================================================================
function seed() {
  const raw = [
    ['Kopi Tujuh', 'Aiman Rahim', 'cafe', 'Bangsar', 12400, 'none', 'high', 'likely', 'sent',
      'Specialty coffee bar in Bangsar known for single-origin pour-overs and house-baked pastries.', 'aimankopi'],
    ['Rendang Royale', 'Siti Nordin', 'restaurant', 'Shah Alam', 28700, 'poor', 'high', 'strong', 'interested',
      'Family restaurant serving heritage Negeri Sembilan rendang recipes for three generations.', 'rendangroyale'],
    ['The Glow Studio', 'Mei Ling', 'personal-brand', 'Mont Kiara', 41200, 'social_only', 'high', 'strong', 'quoted',
      'Skincare educator and aesthetician building a personal coaching brand around confident, healthy skin.', 'glowmei'],
    ['CoolBreeze Aircond', 'Ravi Kumar', 'aircond', 'Klang', 1900, 'none', 'medium', 'likely', 'generated',
      'Aircond servicing and installation across Klang Valley, 12 years in operation, 5-star rated.', 'coolbreeze'],
    ['Nasi Lemak Mak Cik', 'Faridah Yusof', 'home-food', 'Cheras', 6800, 'none', 'high', 'likely', 'identified',
      'Home-based nasi lemak and kuih business with a loyal Cheras following and daily pre-orders.', 'maknasilemak'],
    ['FitWith Danish', 'Danish Aziz', 'trainer', 'Petaling Jaya', 33500, 'social_only', 'high', 'strong', 'activated',
      'Personal trainer and online coach specialising in busy-professional transformations.', 'fitdanish'],
    ['Sambal Sister', 'Lina Tan', 'food-brand', 'Subang', 18900, 'poor', 'medium', 'likely', 'sent',
      'Artisan sambal and chilli paste brand sold at markets, scaling into e-commerce.', 'sambalsister'],
    ['Verde Landscapes', 'Hafiz Omar', 'landscaping', 'Putrajaya', 2400, 'none', 'low', 'likely', 'identified',
      'Landscape design and garden maintenance for homes and offices around Putrajaya.', 'verdeland'],
    ['Brew & Bloom', 'Jasmine Lee', 'cafe', 'Damansara', 9300, 'social_only', 'medium', 'likely', 'interested',
      'Cosy cafe and florist hybrid — coffee, brunch and fresh bouquets under one roof.', 'brewbloom'],
    ['Spark Electrical', 'Tan Wei Jie', 'electrical', 'Puchong', 1200, 'none', 'medium', 'unsure', 'generated',
      'Licensed electrician handling residential wiring, lighting and emergency call-outs.', 'sparkelec'],
    ['Coach Aisyah', 'Aisyah Karim', 'coach', 'KL Sentral', 52000, 'social_only', 'high', 'strong', 'quoted',
      'Career and confidence coach for Malaysian women, runs sold-out group programs.', 'coachaisyah'],
    ['Tok Wan Catering', 'Zulkifli Hamid', 'catering', 'Ampang', 7600, 'poor', 'medium', 'likely', 'sent',
      'Full-service event catering — weddings, corporate and hi-tea — across Klang Valley.', 'tokwancater'],
    ['Studio Lumen', 'Nadia Iskandar', 'creator', 'Bangsar South', 67000, 'social_only', 'high', 'strong', 'activated',
      'Content creator and videographer producing brand films and short-form social content.', 'studiolumen'],
    ['PipeFix Pro', 'Gerald Lim', 'plumbing', 'Cheras', 800, 'none', 'low', 'likely', 'identified',
      '24-hour plumbing service — leaks, water heaters and bathroom fit-outs.', 'pipefixpro'],
    ['Helah Bakes', 'Nurul Huda', 'home-food', 'Gombak', 15400, 'social_only', 'high', 'likely', 'interested',
      'Home baker famous for Basque cheesecake and festive cookie boxes, pre-order only.', 'helahbakes'],
  ];

  const prospects = raw.map((r, i) => {
    const [company, person, category, city, followers, web_presence, engagement, affordability, status, business_description, handle] = r;
    const sc = scoreProspect({ business_category: category, followers, web_presence, engagement, affordability });
    const hasPreview = ['generated', 'sent', 'interested', 'quoted', 'activated', 'renewal'].includes(status);
    const sent = ['sent', 'interested', 'quoted', 'activated', 'renewal'].includes(status);
    const p = {
      id: uid('prs'), company_name: company, contact_person: person, phone: '+60' + (12000000 + i * 137911),
      email: `${handle}@gmail.com`, business_category: category, city, followers,
      web_presence, engagement, affordability,
      facebook_url: `facebook.com/${handle}`, instagram_url: `instagram.com/${handle}`,
      tiktok_url: i % 2 ? `tiktok.com/@${handle}` : '',
      existing_website: web_presence === 'decent' ? `${handle}.com` : '',
      demo_slug: hasPreview ? handle : '',
      demo_website_url: hasPreview ? `${location.origin}${location.pathname}#/preview/${handle}` : '',
      website_spec: null,
      status, score: sc.total, notes: '', referred_by: i === 5 ? 'fitdanish-seed' : '',
      preview_expires_at: sent ? daysFromNow(14 - i % 10) : null,
      created_at: daysAgo(30 - i),
      // link analytics (Rec 3)
      analytics: sent ? { opens: [2, 5, 0, 8, 1, 11, 3, 0, 6, 4, 9, 2, 14, 0, 7][i] || 0, unique: [1,3,0,4,1,6,2,0,3,2,5,1,7,0,4][i]||0, lastOpenedAt: i%3? daysAgo(i%5):null } : { opens: 0, unique: 0, lastOpenedAt: null },
    };
    if (hasPreview) {
      try { p.website_spec = generateWebsite(p); } catch { p.website_spec = null; }
    }
    return p;
  });

  // Clients (activated) derived from activated/renewal prospects
  const clients = [];
  const orders = [];
  const referrals = [];
  const wallets = [];

  prospects.filter(p => ['activated', 'renewal'].includes(p.status)).forEach((p, i) => {
    const refCode = p.demo_slug || slug(p.company_name);
    const c = {
      id: uid('cli'), prospect_id: p.id, company_name: p.company_name, contact_person: p.contact_person,
      phone: p.phone, email: p.email, activated_website_url: p.demo_website_url,
      package_price: 500 + (i === 0 ? 300 : 100), activation_date: daysAgo(20 - i * 4),
      renewal_due_date: daysFromNow(345 - i * 30), referral_code: refCode,
      gallery: [], announcement: '', created_at: daysAgo(20 - i * 4),
    };
    clients.push(c);
    orders.push({
      id: uid('ord'), client_id: c.id, activation_fee: 500,
      ai_chatbot: i === 0, news_module: true, extra_email_count: i === 0 ? 1 : 0,
      total_amount: c.package_price, payment_status: 'confirmed', created_at: c.activation_date,
    });
    wallets.push({ id: uid('wal'), client_id: c.id, credit_balance: i === 0 ? 150 : 50, total_credit_earned: i === 0 ? 150 : 50, cash_redeemed: 0, updated_at: now() });
  });

  // A couple of referral records feeding the first client's wallet
  if (clients[0]) {
    referrals.push(
      { id: uid('ref'), referrer_client_id: clients[0].id, referred_company_name: 'Sambal Sister', referred_client_id: null, activation_status: 'pending', reward_amount: 50, reward_type: 'renewal_credit', created_at: daysAgo(6) },
      { id: uid('ref'), referrer_client_id: clients[0].id, referred_company_name: 'Brew & Bloom', referred_client_id: null, activation_status: 'confirmed', reward_amount: 50, reward_type: 'renewal_credit', created_at: daysAgo(12) },
      { id: uid('ref'), referrer_client_id: clients[0].id, referred_company_name: 'Kopi Tujuh', referred_client_id: null, activation_status: 'confirmed', reward_amount: 50, reward_type: 'renewal_credit', created_at: daysAgo(18) },
    );
  }

  const team = [
    { id: 'tm_1', name: 'You', initials: 'YO', role: 'admin', email: 'admin@kobis.my' },
    { id: 'tm_2', name: 'Imran Sales', initials: 'IS', role: 'sales', email: 'imran@kobis.my' },
  ];

  const waitlist = [
    { id: uid('wl'), company_name: 'Teh Tarik Lab', contact_person: 'Khairul', email: 'hello@tehtariklab.my', business_category: 'cafe', referral_code: 'fitdanish', position: 1, created_at: daysAgo(2) },
    { id: uid('wl'), company_name: 'Glow Aesthetics', contact_person: 'Wendy', email: 'wendy@glowaes.my', business_category: 'personal-brand', referral_code: '', position: 2, created_at: daysAgo(1) },
  ];

  return { prospects, clients, orders, referrals, credit_wallets: wallets, link_events: [], followups: [], waitlist, team_members: team, role: 'admin', seededAt: now() };
}

// ===========================================================================
// Persistence + reactivity
// ===========================================================================
function load() {
  try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch {}
  return null;
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); }
  catch (e) { console.warn('[KOBIS] local cache full — Supabase remains source of truth'); }
  emit();
}
// Row-level write-through: sync only what changed (no whole-table re-uploads).
function sync(table, ...rows) { if (remote.isConfigured()) remote.upsertRows(table, rows.filter(Boolean)); }
function syncDel(table, id) { if (remote.isConfigured()) remote.deleteRow(table, id); }
function emit() { listeners.forEach(fn => fn(db)); }

export function init() { db = load() || seed(); return db; }

// Async boot: hydrate from Supabase when configured, else local/seed.
// Views stay fully synchronous — only the initial boot awaits.
const TABLES = ['prospects', 'clients', 'orders', 'referrals', 'credit_wallets', 'waitlist', 'team_members'];
export async function boot() {
  const local = load();
  if (!remote.isConfigured()) { db = local || seed(); return db; }

  const snap = await remote.hydrateAll();
  if (!snap) { db = local || seed(); return db; } // offline: use local, don't push (avoid dupes)

  const fresh = seed();
  const dbHasData = TABLES.some(t => snap[t]?.length);
  if (!dbHasData) {
    // brand-new database: seed it once and push up
    db = local || fresh;
    db.role = (local && local.role) || 'admin';
    remote.pushAll(db);
    return db;
  }

  // DB already has data: prefer it, but self-heal any table that's empty in the
  // DB — backfill from this device's local copy (matching ids), or from a fresh
  // seed for fixed-id config tables (team_members) — then push the repairs up.
  db = { role: (local && local.role) || 'admin' };
  let heal = false;
  for (const t of TABLES) {
    if (snap[t]?.length) db[t] = snap[t];
    else if (local?.[t]?.length) { db[t] = local[t]; heal = true; }
    else if (t === 'team_members') { db[t] = fresh.team_members; heal = true; }
    else db[t] = [];
  }
  if (heal) remote.pushAll(db);
  return db;
}
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function reset() { db = seed(); persist(); }
export function get() { return db; }

// ---- selectors -----------------------------------------------------------
export const prospects = () => db.prospects;
export const clients = () => db.clients;
export const orders = () => db.orders;
export const referrals = () => db.referrals;
export const wallets = () => db.credit_wallets;
export const waitlist = () => db.waitlist;
export const team = () => db.team_members;
export const role = () => db.role;
export const prospectBySlug = (s) => db.prospects.find(p => p.demo_slug === s);
export const prospectById = (id) => db.prospects.find(p => p.id === id);
export const clientById = (id) => db.clients.find(c => c.id === id);
export const walletForClient = (id) => db.credit_wallets.find(w => w.client_id === id);
export const referralsForClient = (id) => db.referrals.filter(r => r.referrer_client_id === id);

// ===========================================================================
// Mutations (each persists + emits)
// ===========================================================================
export function setRole(r) { db.role = r; persist(); }

export function addProspect(data) {
  // basic input hygiene (A5)
  if (data.followers != null) data.followers = Math.max(0, Math.min(100000000, Number(data.followers) || 0));
  ['company_name', 'contact_person', 'city'].forEach(k => { if (typeof data[k] === 'string') data[k] = data[k].trim().slice(0, 120); });
  if (typeof data.business_description === 'string') data.business_description = data.business_description.slice(0, 2000);
  const sc = scoreProspect(data);
  const p = {
    id: uid('prs'), status: 'identified', score: sc.total, created_at: now(),
    demo_slug: '', demo_website_url: '', website_spec: null, preview_expires_at: null,
    analytics: { opens: 0, unique: 0, lastOpenedAt: null }, notes: '', referred_by: data.referred_by || '',
    ...data,
  };
  db.prospects.unshift(p);
  persist();
  sync('prospects', p);
  return p;
}

export function updateProspect(id, patch) {
  const p = prospectById(id); if (!p) return;
  Object.assign(p, patch);
  if (['business_category', 'followers', 'web_presence', 'engagement', 'affordability'].some(k => k in patch)) {
    p.score = scoreProspect(p).total;
  }
  persist();
  sync('prospects', p);
  return p;
}

export function setStatus(id, status) { return updateProspect(id, { status }); }

// AI generation → attaches spec, sets demo url, advances status (automation)
export function generateForProspect(id) {
  const p = prospectById(id); if (!p) return;
  const handle = (p.demo_slug || slug(p.company_name));
  const spec = generateWebsite(p);
  Object.assign(p, {
    demo_slug: handle,
    demo_website_url: `${location.origin}${location.pathname}#/preview/${handle}`,
    website_spec: spec,
    status: p.status === 'identified' ? 'generated' : p.status,
    preview_expires_at: p.preview_expires_at || daysFromNow(14),
  });
  persist();
  sync('prospects', p);
  return p;
}

// Record a preview open (link analytics — Rec 3)
export function recordOpen(slugStr) {
  const p = prospectBySlug(slugStr); if (!p) return;
  p.analytics = p.analytics || { opens: 0, unique: 0, lastOpenedAt: null };
  p.analytics.opens += 1;
  p.analytics.lastOpenedAt = now();
  if (['generated', 'sent'].includes(p.status) && p.status !== 'sent') p.status = 'sent';
  db.link_events.push({ id: uid('evt'), prospect_id: p.id, type: 'open', created_at: now() });
  persist();
  sync('prospects', p);
}

// Activation: create client + order + wallet, award referral (Rec 5 timing)
export function activateProspect(id, sel) {
  const p = prospectById(id); if (!p) return;
  const total = 500 + (sel.chatbot ? 200 : 0) + (sel.news ? 100 : 0) + (Number(sel.emailCount) || 0) * 50;
  const c = {
    id: uid('cli'), prospect_id: p.id, company_name: p.company_name, contact_person: p.contact_person,
    phone: p.phone, email: p.email, activated_website_url: p.demo_website_url, package_price: total,
    activation_date: now(), renewal_due_date: daysFromNow(365),
    referral_code: p.demo_slug || slug(p.company_name), gallery: [], announcement: '', created_at: now(),
  };
  db.clients.unshift(c);
  const order = {
    id: uid('ord'), client_id: c.id, activation_fee: 500, ai_chatbot: !!sel.chatbot,
    news_module: !!sel.news, extra_email_count: Number(sel.emailCount) || 0,
    total_amount: total, payment_status: 'confirmed', created_at: now(),
  };
  db.orders.unshift(order);
  const wallet = { id: uid('wal'), client_id: c.id, credit_balance: 0, total_credit_earned: 0, cash_redeemed: 0, updated_at: now() };
  db.credit_wallets.push(wallet);
  p.status = 'activated';

  // Referral attribution (Rec 5 + Rec 8): credit referrer on payment confirmed
  let refRow = null, refWallet = null;
  if (p.referred_by) {
    const refClient = db.clients.find(cl => cl.referral_code === p.referred_by);
    if (refClient) {
      refRow = { id: uid('ref'), referrer_client_id: refClient.id, referred_company_name: p.company_name, referred_client_id: c.id, activation_status: 'confirmed', reward_amount: PRICING.referral.rewardPerActivation, reward_type: 'renewal_credit', created_at: now() };
      db.referrals.push(refRow);
      refWallet = walletForClient(refClient.id);
      if (refWallet) { refWallet.credit_balance += PRICING.referral.rewardPerActivation; refWallet.total_credit_earned += PRICING.referral.rewardPerActivation; refWallet.updated_at = now(); }
    }
  }
  persist();
  sync('clients', c); sync('orders', order); sync('credit_wallets', wallet, refWallet); sync('prospects', p); sync('referrals', refRow);
  return c;
}

export function updateClient(id, patch) { const c = clientById(id); if (c) { Object.assign(c, patch); persist(); sync('clients', c); } return c; }

export function redeemCash(clientId) {
  const w = walletForClient(clientId); if (!w || w.credit_balance < PRICING.referral.cashRedeemThreshold) return false;
  w.credit_balance -= PRICING.referral.cashRedeemThreshold;
  w.cash_redeemed += PRICING.referral.cashRedeemThreshold;
  w.updated_at = now();
  persist();
  sync('credit_wallets', w);
  return true;
}

export function joinWaitlist(data) {
  const w = { id: uid('wl'), position: db.waitlist.length + 1, created_at: now(), ...data };
  ['company_name', 'contact_person', 'email', 'referral_code'].forEach(k => { if (typeof w[k] === 'string') w[k] = w[k].trim().slice(0, 160); });
  db.waitlist.push(w); persist(); sync('waitlist', w); return w;
}

// Remove a waitlist entry locally AND remotely (no resurrection).
export function removeWaitlist(id) {
  const i = db.waitlist.findIndex(x => x.id === id);
  if (i > -1) db.waitlist.splice(i, 1);
  persist(); syncDel('waitlist', id);
}

// Load a single prospect by preview slug if it isn't already in memory (scale).
export async function fetchProspectBySlug(slugStr) {
  if (prospectBySlug(slugStr)) return prospectBySlug(slugStr);
  const data = await remote.fetchBySlug(slugStr);
  if (data) { db.prospects.push(data); return data; }
  return null;
}

export { slug, daysFromNow };
