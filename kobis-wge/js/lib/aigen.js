// ===========================================================================
// AI WEBSITE GENERATION  (Phase 3 automation, demonstrated in Phase 1)
// Deterministic, on-device copy synthesis that turns raw business info into a
// complete website spec: hero, about, services/menu, gallery plan, contact.
// In production this is a Claude call; here it runs instantly & offline so the
// MVP demos the automation without external dependencies. Same output shape.
// ===========================================================================
import { CATEGORY_LABEL, CATEGORY_TIER } from './scoring.js';

const TONE = {
  A: { mood: 'warm, appetising, local-favourite', cta: 'Order on WhatsApp', sectionName: 'Menu' },
  B: { mood: 'bold, personal, aspirational', cta: 'Work With Me', sectionName: 'Services' },
  C: { mood: 'trustworthy, fast, professional', cta: 'Get a Free Quote', sectionName: 'Services' },
};

// Curated service/menu seeds per category for realistic output.
const SEEDS = {
  cafe: ['Signature Flat White', 'House Cold Brew', 'Butter Croissant', 'Avocado Sourdough', 'Matcha Latte', 'Basque Cheesecake'],
  restaurant: ['Chef’s Set Lunch', 'Nasi Lemak Special', 'Grilled Seafood Platter', 'Signature Curry', 'Weekend Brunch', 'Private Dining'],
  catering: ['Corporate Lunch Boxes', 'Wedding Buffet', 'Hi-Tea Packages', 'Mini Buffet (20–50 pax)', 'Live Stations', 'Custom Menus'],
  'food-brand': ['Sambal Range', 'Frozen Ready-Meals', 'Artisan Sauces', 'Gift Bundles', 'Wholesale Supply', 'Subscription Box'],
  'home-food': ['Daily Home Set', 'Frozen Pack Delivery', 'Kuih Platters', 'Pre-Order Specials', 'Bulk Orders', 'Raya / Festive Packs'],
  influencer: ['Brand Collaborations', 'Sponsored Content', 'UGC Packages', 'Event Appearances', 'Affiliate Partnerships', 'Media Kit'],
  creator: ['Sponsored Videos', 'Channel Management', 'Content Licensing', 'Workshops', 'Consulting Calls', 'Merch Drops'],
  'personal-brand': ['Keynote Speaking', '1:1 Mentoring', 'Online Course', 'Brand Partnerships', 'Newsletter', 'Community'],
  trainer: ['Personal Training', 'Group Classes', 'Online Coaching', 'Nutrition Plans', 'Transformation Program', 'Corporate Wellness'],
  coach: ['1:1 Coaching', 'Group Programs', 'Strategy Intensives', 'Workshops', 'Accountability Plans', 'Resources'],
  consultant: ['Strategy Audit', 'Implementation', 'Retainer Advisory', 'Workshops', 'Done-With-You', 'Speaking'],
  contractor: ['Renovation', 'Project Management', 'Custom Build', 'Maintenance', 'Free Site Survey', 'Warranty'],
  aircond: ['Service & Cleaning', 'Installation', 'Gas Top-Up', 'Chemical Wash', 'Repair', 'Maintenance Contract'],
  electrical: ['Wiring & Rewiring', 'Installation', 'Fault Diagnosis', 'Lighting', 'Safety Inspection', 'Emergency Call-Out'],
  plumbing: ['Leak Repair', 'Installation', 'Water Heater', 'Drainage', 'Bathroom Fit-Out', 'Emergency Service'],
  landscaping: ['Garden Design', 'Maintenance', 'Turfing', 'Hardscaping', 'Plant Supply', 'Irrigation'],
};

const GALLERY_PLAN = {
  A: ['Signature dishes', 'Interior & ambience', 'Behind the counter', 'Happy customers', 'Plating close-ups', 'The team'],
  B: ['Headshots & portraits', 'On stage / at work', 'Client results', 'Behind the scenes', 'Featured in', 'Highlights'],
  C: ['Completed projects', 'Before & after', 'Team on site', 'Equipment', 'Certifications', 'Happy clients'],
};

function pick(arr, n) { return arr.slice(0, n); }
function brandHandleFrom(name) { return (name || 'brand').toLowerCase().replace(/[^a-z0-9]+/g, ''); }

// Main generator — returns a full website spec object.
export function generateWebsite(p) {
  const tier = CATEGORY_TIER[p.business_category] || 'C';
  const t = TONE[tier];
  const catLabel = CATEGORY_LABEL[p.business_category] || 'Business';
  const name = p.company_name || 'Your Business';
  const city = p.city || 'Malaysia';
  const desc = (p.business_description || '').trim();
  const isFood = tier === 'A';

  const headlines = [
    isFood ? `${name} — ${city}’s New Favourite` : `${name}`,
    isFood ? `Freshly made. Locally loved.` : tier === 'B' ? `${catLabel} who gets results` : `${city}’s trusted ${catLabel.toLowerCase()}`,
  ];

  const services = (SEEDS[p.business_category] || SEEDS.consultant).map((title, i) => ({
    title,
    blurb: isFood
      ? ['House favourite', 'Made fresh daily', 'Customer pick', 'Best seller', 'Seasonal', 'Signature'][i % 6]
      : ['Tailored to you', 'Fast turnaround', 'Fixed pricing', 'Fully guaranteed', 'No surprises', 'Expert-led'][i % 6],
    price: isFood ? `RM${[12, 9, 15, 18, 14, 22][i % 6]}` : null,
  }));

  return {
    meta: { name, category: p.business_category, catLabel, tier, city, handle: brandHandleFrom(name), generatedAt: new Date().toISOString() },
    theme: themeFor(tier, p.business_category),
    hero: {
      eyebrow: catLabel.toUpperCase(),
      headline: headlines[0],
      sub: headlines[1],
      primaryCta: t.cta,
      secondaryCta: 'View ' + t.sectionName,
    },
    about: {
      title: `About ${name}`,
      body: desc
        ? polish(desc, name, catLabel, city)
        : `${name} is a ${city}-based ${catLabel.toLowerCase()} built on a simple promise: ${t.mood.split(',')[0]} quality, every single time. What started as a passion has grown into a name locals trust — and we’re just getting started.`,
      stats: statsFor(tier, p),
    },
    servicesSection: { name: t.sectionName, items: services },
    gallery: { plan: GALLERY_PLAN[tier], note: 'Upload 6–12 of your best photos in the dashboard after activation.' },
    contact: {
      whatsappCta: t.cta,
      lines: [
        p.phone ? { icon: 'phone', label: p.phone } : null,
        p.email ? { icon: 'mail', label: p.email } : null,
        { icon: 'building', label: city + ', Malaysia' },
      ].filter(Boolean),
      socials: [
        p.instagram_url ? { k: 'Instagram', v: p.instagram_url } : null,
        p.facebook_url ? { k: 'Facebook', v: p.facebook_url } : null,
        p.tiktok_url ? { k: 'TikTok', v: p.tiktok_url } : null,
      ].filter(Boolean),
    },
  };
}

function polish(desc, name, cat, city) {
  let d = desc.trim();
  if (d.length < 140) {
    d += ` Based in ${city}, ${name} is fast becoming a name locals recommend — combining genuine ${cat.toLowerCase()} craft with the kind of service that keeps people coming back.`;
  }
  return d.charAt(0).toUpperCase() + d.slice(1);
}

function statsFor(tier, p) {
  const f = p.followers || 0;
  const reach = f >= 1000 ? (f / 1000).toFixed(f % 1000 ? 1 : 0) + 'k' : (f || '—');
  if (tier === 'A') return [{ k: '4.9★', v: 'Avg. rating' }, { k: reach, v: 'Followers' }, { k: 'Daily', v: 'Fresh' }];
  if (tier === 'B') return [{ k: reach, v: 'Community' }, { k: '100%', v: 'Hands-on' }, { k: '5★', v: 'Rated' }];
  return [{ k: '10+ yrs', v: 'Experience' }, { k: 'Same-day', v: 'Response' }, { k: '100%', v: 'Guaranteed' }];
}

// Per-industry preview theme (drives the live preview site styling).
function themeFor(tier, cat) {
  const map = {
    cafe: { bg: '#1a1410', accent: '#e0a868', tint: '#f3e9dc', font: 'serif', label: 'Warm Editorial' },
    restaurant: { bg: '#16100e', accent: '#d4664a', tint: '#f4e6df', font: 'serif', label: 'Appetite' },
    catering: { bg: '#141611', accent: '#9bbf6a', tint: '#eef3e6', font: 'serif', label: 'Fresh' },
    influencer: { bg: '#0f0d18', accent: '#b87cff', tint: '#ece7f7', font: 'sans', label: 'Bold Personal' },
    'personal-brand': { bg: '#0f0d18', accent: '#7c9bff', tint: '#e7ecf7', font: 'sans', label: 'Aspirational' },
    contractor: { bg: '#0d1116', accent: '#4cc9ff', tint: '#dceef7', font: 'sans', label: 'Trust & Speed' },
    aircond: { bg: '#0d1116', accent: '#4cc9ff', tint: '#dceef7', font: 'sans', label: 'Cool Pro' },
  };
  return map[cat] || (tier === 'A'
    ? { bg: '#1a1410', accent: '#e0a868', tint: '#f3e9dc', font: 'serif', label: 'Warm Editorial' }
    : tier === 'B'
      ? { bg: '#0f0d18', accent: '#b87cff', tint: '#ece7f7', font: 'sans', label: 'Bold Personal' }
      : { bg: '#0d1116', accent: '#4cc9ff', tint: '#dceef7', font: 'sans', label: 'Trust & Speed' });
}

// Simulated streaming steps for the generation UI (perceived automation).
export const GEN_STEPS = [
  'Reading business profile & socials…',
  'Analysing category & tone of voice…',
  'Writing hero & value proposition…',
  'Drafting About story…',
  `Structuring services & pricing…`,
  'Planning gallery layout…',
  'Assembling contact & WhatsApp CTA…',
  'Applying industry theme…',
];
