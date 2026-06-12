// ===========================================================================
// LEAD SCORING ENGINE  (Strategic Recommendation 1)
// Compact, transparent matrix that prioritises high-conversion prospects
// BEFORE any production time is spent. Output 0–100; >=70 => auto-qualify.
// ===========================================================================

// Tiered business priority from the blueprint (A highest → C).
export const CATEGORY_TIER = {
  // Priority A — Food & Beverage
  cafe: 'A', restaurant: 'A', catering: 'A', 'food-brand': 'A', 'home-food': 'A',
  // Priority B — Personal brands
  influencer: 'B', creator: 'B', 'personal-brand': 'B', trainer: 'B', coach: 'B', consultant: 'B',
  // Priority C — Services
  contractor: 'C', aircond: 'C', electrical: 'C', plumbing: 'C', landscaping: 'C',
};

export const CATEGORY_LABEL = {
  cafe: 'Cafe', restaurant: 'Restaurant', catering: 'Catering', 'food-brand': 'Food Brand',
  'home-food': 'Home-Based Food', influencer: 'Influencer', creator: 'Content Creator',
  'personal-brand': 'Personal Brand', trainer: 'Trainer', coach: 'Coach', consultant: 'Consultant',
  contractor: 'Contractor', aircond: 'Aircond Service', electrical: 'Electrical', plumbing: 'Plumbing',
  landscaping: 'Landscaping',
};

const TIER_POINTS = { A: 30, B: 22, C: 15 };

// Returns { total, band, factors:[{label, points, max, note}] }
export function scoreProspect(p) {
  const factors = [];

  // 1) Category tier (max 30)
  const tier = CATEGORY_TIER[p.business_category] || 'C';
  factors.push({ label: 'Business category', points: TIER_POINTS[tier], max: 30, note: `Priority ${tier}` });

  // 2) Social reach (max 25) — followers across channels
  const followers = p.followers || 0;
  let social = 0;
  if (followers >= 20000) social = 25;
  else if (followers >= 8000) social = 20;
  else if (followers >= 3000) social = 14;
  else if (followers >= 800) social = 8;
  else social = 3;
  factors.push({ label: 'Social reach', points: social, max: 25, note: fmtFollowers(followers) });

  // 3) Web presence gap (max 20) — no/poor website = higher priority
  const presenceMap = { none: 20, poor: 16, social_only: 14, decent: 6 };
  const pres = presenceMap[p.web_presence] ?? 10;
  factors.push({ label: 'Web presence gap', points: pres, max: 20, note: PRESENCE_LABEL[p.web_presence] || '—' });

  // 4) Engagement / activity (max 15) — posting cadence + responsiveness
  const engMap = { high: 15, medium: 10, low: 4 };
  const eng = engMap[p.engagement] ?? 8;
  factors.push({ label: 'Engagement & activity', points: eng, max: 15, note: cap(p.engagement) });

  // 5) Affordability signal (max 10) — can they comfortably afford RM500?
  const affMap = { strong: 10, likely: 7, unsure: 3 };
  const aff = affMap[p.affordability] ?? 5;
  factors.push({ label: 'Affordability signal', points: aff, max: 10, note: cap(p.affordability) });

  const total = factors.reduce((s, f) => s + f.points, 0);
  return { total, band: band(total), factors };
}

export function band(total) {
  if (total >= 80) return { key: 'hot', label: 'Hot', color: 'grow' };
  if (total >= 70) return { key: 'qualified', label: 'Qualified', color: 'sky' };
  if (total >= 50) return { key: 'nurture', label: 'Nurture', color: 'amber' };
  return { key: 'low', label: 'Low intent', color: 'rose' };
}

export const QUALIFY_THRESHOLD = 70; // >=70 auto-greenlights site generation

const PRESENCE_LABEL = { none: 'No website', poor: 'Poor website', social_only: 'Social only', decent: 'Has decent site' };
export { PRESENCE_LABEL };
function fmtFollowers(n) { return n >= 1000 ? (n / 1000).toFixed(n % 1000 ? 1 : 0) + 'k followers' : n + ' followers'; }
function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : '—'; }
