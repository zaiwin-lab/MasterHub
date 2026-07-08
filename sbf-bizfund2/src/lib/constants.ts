/** Domain constants for the BizFund2 assessment flow. */

export const NGOS = [
  'Sarawak Chamber of Commerce and Industry (SCCI)',
  'Dewan Usahawan Bumiputera Sarawak (DUBS)',
  'The Associated Chinese Chambers of Commerce and Industry of Sarawak (ACCCIS)',
  'Dayak Chamber of Commerce & Industry (DCCI)',
  "Sarawak Housing and Real Estate Developers' Association (SHEDA)",
  'Sarawak Oil Palm Plantation Owners Association (SOPPOA)',
  'Sarawak Electrical Association (SEA)',
  'Sarawak Entrepreneur Association (SEA)',
  'Sarawak ICT Association (SICTA)',
  'Sarawak e-Commerce Association (SECA)',
  'Sarawak Association of Marine Industries (SAMIN)',
  'Sarawak Digital Media E-Platform Association',
  "Sarawak Manufacturers' Association (SMA)",
  'SME Association of Sarawak (SME Sarawak)',
  'Startup Entrepreneur Association Sarawak',
  'Orang Ulu Chamber of Commerce & Industry',
  'Sarawak Business Events Association',
  'Sarawak Tourism Federation (STF)',
  'Sarawak Forwarding Agencies Association (SFAA)',
  'Malaysian Plastics Manufacturers Association (MPMA)',
  'Malaysian Employers Federation (MEF)',
  'Persatuan Kontraktor Melayu Malaysia (PKMM)',
  'BIMP-EAGA Sarawak Association (BESA)',
  'Sarawak Dayak Oil Palm Planters Association (DOPPA)',
];

export const TRAINING_CATEGORIES = [
  'Entrepreneurship & Business Development',
  'Digital & Technology',
  'Finance, Accounting & Grants',
  'Marketing & Branding',
  'Export, Trade & Logistics',
  'Leadership & Management',
  'Technical & Vocational Skills',
  'ESG & Sustainability',
  'Tourism & Hospitality',
  'Other',
];

export interface Criterion {
  key: string;
  label: string;
  hint: string;
  strength: string;
  clarify: string;
}

/** Seven committee scoring criteria, each rated 1–5. */
export const CRITERIA: Criterion[] = [
  {
    key: 'relevance',
    label: 'Relevance to BizFund2 objectives',
    hint: 'How directly the programme supports BizFund2 goals.',
    strength: 'Programme aligns strongly with BizFund2 objectives.',
    clarify: 'Clarify how the programme supports BizFund2 objectives.',
  },
  {
    key: 'benefit',
    label: 'Benefit to Sarawak business / NGO members',
    hint: 'Practical value delivered to member businesses.',
    strength: 'Clear, practical benefit to Sarawak business and NGO members.',
    clarify: 'Strengthen the case for direct member benefit.',
  },
  {
    key: 'provider',
    label: 'Training provider credibility',
    hint: 'Track record, trainer profile and delivery capability.',
    strength: 'Training provider demonstrates credible track record and capability.',
    clarify: 'Request further evidence of provider track record and trainer credentials.',
  },
  {
    key: 'budget',
    label: 'Budget reasonableness',
    hint: 'Value for money against scope and participant numbers.',
    strength: 'Budget is reasonable and well-matched to programme scope.',
    clarify: 'Review budget items against scope and participant numbers.',
  },
  {
    key: 'readiness',
    label: 'Implementation readiness',
    hint: 'Dates, venue, logistics and delivery plan in place.',
    strength: 'Implementation plan is well-prepared with clear logistics.',
    clarify: 'Confirm dates, venue and delivery logistics before proceeding.',
  },
  {
    key: 'impact',
    label: 'Expected impact',
    hint: 'Measurable outcomes for participants and the sector.',
    strength: 'Expected outcomes are meaningful and measurable.',
    clarify: 'Define clearer, measurable outcomes for participants.',
  },
  {
    key: 'risk',
    label: 'Risk & governance',
    hint: 'Higher score = lower concern and sound governance.',
    strength: 'Low risk profile with sound governance arrangements.',
    clarify: 'Address outstanding risk or governance concerns.',
  },
];

export const SCORE_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Weak',
  3: 'Fair',
  4: 'Good',
  5: 'Excellent',
};

/** Simulated upload slots for Step 3. */
export const UPLOAD_SLOTS = [
  { key: 'proposal', label: 'Proposal document' },
  { key: 'budget', label: 'Budget / quotation' },
  { key: 'trainer', label: 'Trainer profile' },
  { key: 'poster', label: 'Poster / supporting document' },
];

export const FRAMEWORK_CARDS = [
  { title: 'Strategic Relevance', body: 'Alignment with BizFund2 objectives and SBF strategic priorities.' },
  { title: 'Member Benefit', body: 'Tangible value for Sarawak businesses and participating NGO members.' },
  { title: 'Provider Capability', body: 'Trainer credentials, delivery track record and organisational capacity.' },
  { title: 'Budget Reasonableness', body: 'Cost structure that is fair, justified and proportionate to scope.' },
  { title: 'Implementation Readiness', body: 'Confirmed schedule, venue, logistics and a realistic delivery plan.' },
  { title: 'Measurable Impact', body: 'Clear outcomes that can be tracked for participants and the sector.' },
  { title: 'Governance & Risk', body: 'Sound controls, accountability and manageable delivery risk.' },
];
