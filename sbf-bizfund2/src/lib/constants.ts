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

/** Eight committee scoring criteria, in display order. Text lives in the i18n dictionary. */
export const CRITERION_KEYS = [
  'relevance',
  'benefit',
  'provider',
  'budget',
  'readiness',
  'impact',
  'risk',
  'sustainability',
] as const;
