import type { L } from '../types';

/**
 * Every public statistic lives here, in one place, with its source, its year and
 * a working link. Nothing renders without all three.
 *
 * These are widely reported figures, not our own research. Confirm each against
 * its primary source and update `checked` before promoting this page anywhere
 * with real money behind it. A single prospect who checks a number and finds it
 * hollow costs more than all three of them gained.
 */
export interface Proof {
  figure: string;
  claim: L;
  source: string;
  year: string;
  url: string;
  /** Set true once someone has opened the primary source and confirmed the figure. */
  checked: boolean;
}

export const PROOF: Proof[] = [
  {
    figure: '78%',
    claim: [
      'of organisations now use AI in at least one business function — up from 55% a year earlier.',
      'organisasi kini menggunakan AI dalam sekurang-kurangnya satu fungsi perniagaan — naik daripada 55% setahun sebelumnya.',
    ],
    source: 'McKinsey, The State of AI',
    year: '2025',
    url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai',
    checked: false,
  },
  {
    figure: '~95%',
    claim: [
      'of enterprise generative-AI pilots produce no measurable return. Pilots fail. Shipped products do not.',
      'perintis AI generatif korporat tidak menghasilkan pulangan yang boleh diukur. Perintis gagal. Produk yang dilancarkan tidak.',
    ],
    source: 'MIT NANDA, The State of AI in Business',
    year: '2025',
    url: 'https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf',
    checked: false,
  },
  {
    figure: '1 in 4',
    claim: [
      'companies ever get past the proof-of-concept stage to real, booked value.',
      'syarikat berjaya melepasi peringkat bukti konsep untuk mencapai nilai sebenar.',
    ],
    source: 'BCG, Where’s the Value in AI?',
    year: '2024',
    url: 'https://www.bcg.com/publications/2024/wheres-value-in-ai',
    checked: false,
  },
];

/** Ticker lines. Argument, not statistics — nothing here claims to be measured. */
export const TICKER: L[] = [
  ['THE WAVE DOES NOT WAIT FOR THE UNDECIDED', 'GELOMBANG TIDAK MENUNGGU YANG TERAGAK-AGAK'],
  ['YOUR COMPETITOR ONLY HAS TO BE EARLIER', 'PESAING ANDA HANYA PERLU LEBIH AWAL'],
  ['LATE CAN BE BOUGHT BACK — STILL COMPOUNDS', 'LEWAT BOLEH DITEBUS — DIAM BERGANDA'],
  ['EVERY MONTH YOU WAIT, THE SAME LEAK BILLS YOU AGAIN', 'SETIAP BULAN ANDA TUNGGU, KEBOCORAN SAMA MENAGIH LAGI'],
  ['8 MINUTES TO KNOW WHERE YOU STAND', '8 MINIT UNTUK TAHU DI MANA ANDA BERDIRI'],
];
