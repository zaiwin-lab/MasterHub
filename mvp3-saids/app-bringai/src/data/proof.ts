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
      '的机构已在至少一项业务职能中使用 AI — 一年前这个数字是 55%。',
      'organisasi diatu ngena AI ba sekurang-kurang siti bagi pengawa — naik ari 55% setaun ti udah.',
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
      '的企业生成式 AI 试点没有产生可衡量的回报。试点会失败，真正上线的产品不会。',
      'projek nguji AI generatif korporat nadai mai pulai ti ulih diukur. Projek nguji rebah. Produk ti dipansutka enda.',
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
      '的公司才真正跨过概念验证阶段，拿到可入账的价值。',
      'kompeni ulih ngelui tingkat bukti konsep lalu bulih rega ti amat.',
    ],
    source: 'BCG, Where’s the Value in AI?',
    year: '2024',
    url: 'https://www.bcg.com/publications/2024/wheres-value-in-ai',
    checked: false,
  },
];

/** Ticker lines. Argument, not statistics — nothing here claims to be measured. */
export const TICKER: L[] = [
  [
    'THE WAVE DOES NOT WAIT FOR THE UNDECIDED',
    'GELOMBANG TIDAK MENUNGGU YANG TERAGAK-AGAK',
    '浪潮不会等待犹豫的人',
    'GELOMBANG ENDA NGANTI ORANG TI AGI BEPIKIR',
  ],
  [
    'YOUR COMPETITOR ONLY HAS TO BE EARLIER',
    'PESAING ANDA HANYA PERLU LEBIH AWAL',
    '对手不必更强，只需更早',
    'PESAING NUAN SEMINA PERLU DULU AGI',
  ],
  [
    'LATE CAN BE BOUGHT BACK — STILL COMPOUNDS',
    'LEWAT BOLEH DITEBUS — DIAM BERGANDA',
    '迟到还能追回，停滞只会复利',
    'LEWA ULIH DITEBUS — DIAU BEGANDA',
  ],
  [
    'EVERY MONTH YOU WAIT, THE SAME LEAK BILLS YOU AGAIN',
    'SETIAP BULAN ANDA TUNGGU, KEBOCORAN SAMA MENAGIH LAGI',
    '你每等一个月，同一个漏点再收你一次费',
    'TIAP BULAN NUAN NGANTI, PENGECHUCHUR TI SEBAKA NAGIH BARU',
  ],
  [
    '8 MINUTES TO KNOW WHERE YOU STAND',
    '8 MINIT UNTUK TAHU DI MANA ANDA BERDIRI',
    '8 分钟就知道自己站在哪里',
    '8 MINIT KENA NEMU BA NI NUAN BEDIRI',
  ],
];
