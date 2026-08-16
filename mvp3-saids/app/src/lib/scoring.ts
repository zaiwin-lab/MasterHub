import type {
  Answers,
  BusinessContext,
  DetectedAsset,
  DimensionScore,
  L,
  Lang,
  Leak,
  LensKey,
  RespondentType,
  Snapshot,
} from '../types';
import { DECLINED, NOT_SURE } from '../types';
import { INSTRUMENT_VERSION, MIDPOINTS, MISS_RATE, QUOTE_DECAY, questionsFor } from '../data/survey';

export const SCORING_VERSION = '1.0.0';

/**
 * Deterministic scoring. The same answers always produce the same Snapshot.
 * No randomness, no network, no model call.
 *
 * Two rules govern everything below:
 *   - a skipped or declined answer is excluded from its dimension, never scored zero;
 *   - nothing is presented as measured that was not measured.
 */

// ── Constants. Every one of these is shown to the respondent on request. ──────
export const CONST = {
  /** ~RM 4,300/month loaded ÷ ~173 hours. SME Malaysia baseline. */
  LOADED_HOURLY_COST: 25,
  /** Owner opportunity cost per hour. */
  OWNER_HOURLY_VALUE: 60,
  /** Used when the respondent declines the revenue and value questions. */
  DEFAULT_CLOSE_RATE: 0.25,
  /** Share of declared repetitive hours realistically automatable. */
  AUTOMATABLE_SHARE: 0.6,
  /** Total monthly leak may never exceed this share of estimated monthly revenue. */
  LEAK_CAP_VS_REVENUE: 0.35,
};

const clamp = (n: number) => Math.max(0, Math.min(100, n));
const round = (n: number) => Math.round(n);

function pick(answers: Answers, id: string): string | null {
  const v = answers[id];
  if (typeof v !== 'string') return null;
  if (v === NOT_SURE || v === DECLINED) return null;
  return v;
}
function picks(answers: Answers, id: string): string[] {
  const v = answers[id];
  return Array.isArray(v) ? v : [];
}
function scale(answers: Answers, id: string): number | null {
  const v = answers[id];
  return typeof v === 'number' ? ((v - 1) / 4) * 100 : null;
}
function mapScore(v: string | null, table: Record<string, number>): number | null {
  if (v === null) return null;
  return v in table ? table[v] : null;
}
/** Mean of the signals that exist. Returns null when none do. */
function mean(parts: (number | null)[]): number | null {
  const got = parts.filter((p): p is number => p !== null);
  if (!got.length) return null;
  return got.reduce((a, b) => a + b, 0) / got.length;
}

function midpoint(answers: Answers, id: keyof typeof MIDPOINTS): number | null {
  const v = pick(answers, id);
  if (v === null) return null;
  const table = MIDPOINTS[id];
  return v in table ? table[v] : null;
}

// ── Dimensions ───────────────────────────────────────────────────────────────

const DIMENSIONS: { key: string; label: L; lens: LensKey; weight: number }[] = [
  { key: 'offer_clarity', label: ['Offer clarity', 'Kejelasan tawaran'], lens: 'market_pull', weight: 0.12 },
  { key: 'demand_signal', label: ['Demand signal', 'Isyarat permintaan'], lens: 'market_pull', weight: 0.12 },
  { key: 'discoverability', label: ['Discoverability', 'Kebolehjumpaan'], lens: 'market_pull', weight: 0.09 },
  { key: 'delivery_capacity', label: ['Delivery capacity', 'Kapasiti penyampaian'], lens: 'build_readiness', weight: 0.12 },
  { key: 'process_readiness', label: ['Process readiness', 'Kesediaan proses'], lens: 'build_readiness', weight: 0.12 },
  { key: 'decision_velocity', label: ['Decision velocity', 'Kelajuan keputusan'], lens: 'build_readiness', weight: 0.09 },
  { key: 'leakage_control', label: ['Leakage control', 'Kawalan kebocoran'], lens: 'hidden_potential', weight: 0.14 },
  { key: 'ai_leverage', label: ['AI leverage', 'Pengungkitan AI'], lens: 'hidden_potential', weight: 0.11 },
  { key: 'asset_depth', label: ['Asset depth', 'Kedalaman aset'], lens: 'hidden_potential', weight: 0.09 },
];

const DIFFERENTIATION_SCORE: Record<string, number> = {
  price: 45,
  speed: 78,
  quality: 82,
  relationship: 70,
  access: 75,
  expertise: 90,
};
const OFFER_WRITTEN_SCORE: Record<string, number> = { no: 10, informal: 40, yes_basic: 70, yes_strong: 95 };
const LEADS_SCORE: Record<string, number> = { under_10: 25, '10_30': 50, '31_100': 72, '101_300': 88, over_300: 95 };
const PRESENCE_WEIGHT: Record<string, number> = {
  website: 25,
  gbp: 25,
  facebook: 10,
  instagram: 10,
  tiktok: 6,
  linkedin: 6,
  whatsapp_biz: 8,
  marketplace: 10,
};
const BOTTLENECK_SCORE: Record<string, number> = {
  sales: 70,
  response: 55,
  quoting: 60,
  delivery: 35,
  collection: 55,
  admin: 50,
  people: 35,
  owner: 25,
};
const RESPONSE_SCORE: Record<string, number> = {
  under_15m: 95,
  under_1hr: 82,
  same_day: 62,
  next_day: 38,
  varies: 20,
};
const REPETITION_SCORE: Record<string, number> = {
  under_5: 90,
  '5_15': 72,
  '16_40': 50,
  '41_100': 30,
  over_100: 15,
};
const QUOTE_SCORE: Record<string, number> = {
  same_day: 95,
  '1_2_days': 80,
  '3_5_days': 58,
  '1_2_weeks': 32,
  longer: 15,
};
const AUTHORITY_SCORE: Record<string, number> = {
  yes_alone: 95,
  yes_with_partner: 80,
  board: 45,
  no: 20,
  my_budget: 90,
  recommend: 60,
  committee: 35,
  unclear: 25,
};
const TIMELINE_SCORE: Record<string, number> = { this_month: 95, this_quarter: 75, this_year: 45, exploring: 20 };
const AI_USAGE_SCORE: Record<string, number> = {
  none: 8,
  personal: 28,
  scattered: 45,
  some_process: 72,
  core: 92,
};
const AI_BLOCKER_SCORE: Record<string, number> = {
  nothing: 90,
  no_time: 40,
  cost: 45,
  trust: 40,
  skills: 35,
  data: 28,
  tried_failed: 35,
  dont_know_where: 30,
};

interface Inputs {
  answers: Answers;
  assets: DetectedAsset[];
  context: BusinessContext;
}

function discoverabilityScore({ answers, assets }: Inputs): number | null {
  const presence = picks(answers, 'digital_presence');
  const presenceScore = presence.length
    ? clamp(presence.reduce((a, p) => a + (PRESENCE_WEIGHT[p] ?? 0), 0))
    : answers['digital_presence'] !== undefined
      ? 5
      : null;
  const find = scale(answers, 'findability');
  const assetScore = assets.length ? clamp(assets.length * 20) : null;
  return mean([presenceScore, find, assetScore]);
}

function buildDimensions(inp: Inputs, leakRatio: number | null): DimensionScore[] {
  const { answers, assets, context } = inp;

  const sourceCount = picks(answers, 'lead_sources').length;
  const sourceDiversity = sourceCount === 0 ? null : sourceCount === 1 ? 35 : sourceCount === 2 ? 60 : 80;

  const contextWords = [context.description, context.customers, context.proud]
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const dormant = picks(answers, 'dormant_assets');
  const assetDepth =
    answers['dormant_assets'] === undefined
      ? null
      : clamp((dormant.length === 0 ? 15 : 30 + dormant.length * 12) + Math.min(contextWords / 4, 12));

  const raw: Record<string, number | null> = {
    offer_clarity: mean([
      scale(answers, 'offer_clarity'),
      mapScore(pick(answers, 'differentiation'), DIFFERENTIATION_SCORE),
      mapScore(pick(answers, 'offer_written'), OFFER_WRITTEN_SCORE),
    ]),
    demand_signal: mean([sourceDiversity, mapScore(pick(answers, 'leads_per_month'), LEADS_SCORE)]),
    discoverability: discoverabilityScore(inp),
    delivery_capacity: mean([
      mapScore(pick(answers, 'bottleneck'), BOTTLENECK_SCORE),
      mapScore(pick(answers, 'response_time'), RESPONSE_SCORE),
    ]),
    process_readiness: mean([
      mapScore(pick(answers, 'repetitive_hours'), REPETITION_SCORE),
      mapScore(pick(answers, 'quote_days'), QUOTE_SCORE),
      pick(answers, 'ai_blocker') === 'data' ? 30 : null,
    ]),
    decision_velocity: mean([
      mapScore(pick(answers, 'decision_authority') ?? pick(answers, 'decision_authority_exec'), AUTHORITY_SCORE),
      mapScore(pick(answers, 'timeline'), TIMELINE_SCORE),
    ]),
    leakage_control:
      leakRatio === null
        ? mean([
            mapScore(pick(answers, 'response_time'), RESPONSE_SCORE),
            mapScore(pick(answers, 'repetitive_hours'), REPETITION_SCORE),
          ])
        : clamp(100 - leakRatio * 250),
    ai_leverage: mean([
      mapScore(pick(answers, 'ai_usage'), AI_USAGE_SCORE),
      mapScore(pick(answers, 'ai_blocker'), AI_BLOCKER_SCORE),
    ]),
    asset_depth: assetDepth,
  };

  return DIMENSIONS.map((d) => {
    const s = raw[d.key];
    return {
      ...d,
      score: s === null ? null : round(clamp(s)),
      evidence: evidenceFor(d.key, inp, assets),
    };
  });
}

function evidenceFor(key: string, { answers }: Inputs, assets: DetectedAsset[]): L[] {
  const out: L[] = [];
  switch (key) {
    case 'discoverability': {
      const n = picks(answers, 'digital_presence').length;
      out.push([`${n} channel${n === 1 ? '' : 's'} in use, ${assets.length} link${assets.length === 1 ? '' : 's'} declared`, `${n} saluran digunakan, ${assets.length} pautan diisytiharkan`]);
      break;
    }
    case 'delivery_capacity': {
      const b = pick(answers, 'bottleneck');
      if (b) out.push([`Self-reported bottleneck: ${b.replace(/_/g, ' ')}`, `Halangan dilaporkan sendiri: ${b.replace(/_/g, ' ')}`]);
      break;
    }
    case 'ai_leverage': {
      const u = pick(answers, 'ai_usage');
      if (u) out.push([`AI usage: ${u.replace(/_/g, ' ')}`, `Penggunaan AI: ${u.replace(/_/g, ' ')}`]);
      break;
    }
  }
  return out;
}

// ── Leak engine ──────────────────────────────────────────────────────────────

function money(n: number): string {
  return 'RM ' + Math.round(n).toLocaleString('en-MY');
}

interface LeakResult {
  leaks: Leak[];
  total: number | null;
  capped: boolean;
  ratio: number | null;
}

function computeLeaks(answers: Answers, discoverability: number | null): LeakResult {
  const leads = midpoint(answers, 'leads_per_month');
  const deal = midpoint(answers, 'avg_deal_value');
  const repHours = midpoint(answers, 'repetitive_hours');
  const ownerHours = midpoint(answers, 'owner_only_hours');
  const revenueYear = midpoint(answers, 'revenue_band');
  const cr = CONST.DEFAULT_CLOSE_RATE;

  const missRate = MISS_RATE[pick(answers, 'response_time') ?? ''] ?? null;
  const decay = QUOTE_DECAY[pick(answers, 'quote_days') ?? ''] ?? null;

  /**
   * Band midpoints multiplied together routinely imply a pipeline larger than the
   * revenue the respondent just declared. The 35% cap would still hold the headline
   * down, but the arithmetic panel would show a monthly pipeline several times the
   * business the owner described — and they would spot it immediately. Reconciling
   * the two here keeps the workings internally consistent with their own answers.
   */
  const revenueMonthlyDeclared = revenueYear !== null ? revenueYear / 12 : null;
  const rawPipeline = leads !== null && deal !== null ? leads * deal * cr : null;
  const pipeline =
    rawPipeline === null
      ? null
      : revenueMonthlyDeclared !== null
        ? Math.min(rawPipeline, revenueMonthlyDeclared)
        : rawPipeline;

  const l1 = pipeline !== null && missRate !== null ? pipeline * missRate : null;
  const l2 = repHours !== null ? repHours * 4.33 * CONST.LOADED_HOURLY_COST * CONST.AUTOMATABLE_SHARE : null;
  const l3 =
    pipeline !== null && discoverability !== null ? pipeline * (1 - discoverability / 100) * 0.25 : null;
  const l4 = pipeline !== null && decay !== null ? pipeline * 0.5 * decay : null;
  const l5 = ownerHours !== null ? ownerHours * 4.33 * CONST.OWNER_HOURLY_VALUE : null;

  const leaks: Leak[] = [
    {
      code: 'L1',
      name: ['Response Lag', 'Kelewatan Membalas'],
      amount: l1,
      kind: 'loss',
      why: [
        'Enquiries that wait get answered by somebody else first.',
        'Pertanyaan yang menunggu akan dijawab oleh orang lain dahulu.',
      ],
      fix: ['An AI first-responder on WhatsApp', 'Pembalas pertama AI di WhatsApp'],
      workings:
        l1 !== null && leads !== null && deal !== null && missRate !== null && pipeline !== null
          ? [
              `${leads} enquiries × ${money(deal)} × ${cr * 100}% close rate` +
                (rawPipeline !== null && pipeline < rawPipeline
                  ? `, held to ${money(pipeline)}/month to match the revenue you declared` +
                    `\n${money(pipeline)} × ${Math.round(missRate * 100)}% lost to delay = ${money(l1)}`
                  : ` = ${money(pipeline)}/month\n${money(pipeline)} × ${Math.round(missRate * 100)}% lost to delay = ${money(l1)}`),
              `${leads} pertanyaan × ${money(deal)} × kadar tutup ${cr * 100}%` +
                (rawPipeline !== null && pipeline < rawPipeline
                  ? `, dihadkan pada ${money(pipeline)}/bulan supaya sepadan dengan hasil yang anda nyatakan` +
                    `\n${money(pipeline)} × ${Math.round(missRate * 100)}% hilang akibat lewat = ${money(l1)}`
                  : ` = ${money(pipeline)}/bulan\n${money(pipeline)} × ${Math.round(missRate * 100)}% hilang akibat lewat = ${money(l1)}`),
            ]
          : null,
    },
    {
      code: 'L2',
      name: ['Manual Repetition', 'Kerja Berulang Manual'],
      amount: l2,
      kind: 'loss',
      why: [
        'Hours a week spent moving information a machine should move.',
        'Berjam-jam seminggu memindahkan maklumat yang sepatutnya dipindahkan mesin.',
      ],
      fix: ['Workflow automation across the repeat steps', 'Automasi aliran kerja merentas langkah berulang'],
      workings:
        l2 !== null && repHours !== null
          ? [
              `${repHours} hrs/week × 4.33 weeks × ${money(CONST.LOADED_HOURLY_COST)}/hr × ${CONST.AUTOMATABLE_SHARE * 100}% automatable = ${money(l2)}`,
              `${repHours} jam/minggu × 4.33 minggu × ${money(CONST.LOADED_HOURLY_COST)}/jam × ${CONST.AUTOMATABLE_SHARE * 100}% boleh diautomasi = ${money(l2)}`,
            ]
          : null,
    },
    {
      code: 'L3',
      name: ['Invisible Offer', 'Tawaran Tidak Kelihatan'],
      amount: l3,
      kind: 'opportunity',
      why: [
        'Demand that is already searching, and cannot find you.',
        'Permintaan yang sudah mencari, tetapi tidak menjumpai anda.',
      ],
      fix: ['A discoverable digital presence', 'Kehadiran digital yang boleh dijumpai'],
      workings:
        l3 !== null && pipeline !== null && discoverability !== null
          ? [
              `${money(pipeline)} monthly pipeline × ${Math.round(100 - discoverability)}% discoverability gap × 25% reachable = ${money(l3)}`,
              `${money(pipeline)} saluran bulanan × jurang kebolehjumpaan ${Math.round(100 - discoverability)}% × 25% boleh dicapai = ${money(l3)}`,
            ]
          : null,
    },
    {
      code: 'L4',
      name: ['Quote Drag', 'Kelewatan Sebut Harga'],
      amount: l4,
      kind: 'loss',
      why: [
        "Urgency cools while the proposal is being written.",
        'Rasa mendesak reda semasa cadangan sedang disiapkan.',
      ],
      fix: ['An instant quote and proposal engine', 'Enjin sebut harga dan cadangan segera'],
      workings:
        l4 !== null && pipeline !== null && decay !== null
          ? [
              `${money(pipeline * 0.5)} quoted pipeline × ${Math.round(decay * 100)}% decay at your turnaround = ${money(l4)}`,
              `${money(pipeline * 0.5)} saluran disebut harga × ${Math.round(decay * 100)}% susut pada tempoh anda = ${money(l4)}`,
            ]
          : null,
    },
    {
      code: 'L5',
      name: ['One-Head Dependency', 'Kebergantungan Satu Kepala'],
      amount: l5,
      kind: 'loss',
      why: [
        'Work only you can do is work the business cannot scale.',
        'Kerja yang hanya anda boleh buat ialah kerja yang perniagaan tidak boleh kembangkan.',
      ],
      fix: ['A knowledge base and assisted SOPs', 'Pangkalan pengetahuan dan SOP berbantu'],
      workings:
        l5 !== null && ownerHours !== null
          ? [
              `${ownerHours} hrs/week × 4.33 weeks × ${money(CONST.OWNER_HOURLY_VALUE)}/hr owner value = ${money(l5)}`,
              `${ownerHours} jam/minggu × 4.33 minggu × nilai pemilik ${money(CONST.OWNER_HOURLY_VALUE)}/jam = ${money(l5)}`,
            ]
          : null,
    },
    {
      code: 'L6',
      name: ['Untapped Asset', 'Aset Belum Digunakan'],
      amount: null,
      kind: 'qualitative',
      why: [
        'Data, know-how or an audience you already own and do not sell.',
        'Data, kepakaran atau khalayak yang anda sudah miliki tetapi tidak dijual.',
      ],
      fix: ['Your MVP³ candidate, below', 'Calon MVP³ anda, di bawah'],
      workings: null,
    },
  ];

  const hard = [l1, l2, l4, l5].filter((x): x is number => x !== null);
  if (!hard.length) return { leaks, total: null, capped: false, ratio: null };

  let total = hard.reduce((a, b) => a + b, 0);
  const revenueMonthly = revenueMonthlyDeclared ?? pipeline;
  let capped = false;
  if (revenueMonthly !== null && revenueMonthly > 0) {
    const cap = revenueMonthly * CONST.LEAK_CAP_VS_REVENUE;
    if (total > cap) {
      total = cap;
      capped = true;
    }
  }
  const ratio = revenueMonthly && revenueMonthly > 0 ? total / revenueMonthly : null;
  return { leaks, total, capped, ratio };
}

// ── Bands ────────────────────────────────────────────────────────────────────

const BANDS = [
  {
    min: 80,
    key: 'market_ready',
    label: ['Market-Ready', 'Sedia Pasaran'] as L,
    note: [
      "You're close. The gap is execution speed, not capability.",
      'Anda hampir sampai. Jurangnya ialah kelajuan pelaksanaan, bukan keupayaan.',
    ] as L,
  },
  {
    min: 65,
    key: 'compounding',
    label: ['Compounding', 'Berkembang'] as L,
    note: ['The engine works. It is running below what it could.', 'Enjin berfungsi. Ia berjalan di bawah keupayaannya.'] as L,
  },
  {
    min: 50,
    key: 'building',
    label: ['Building', 'Sedang Membina'] as L,
    note: [
      'Real foundations, real leaks. This is the best moment to move.',
      'Asas sebenar, kebocoran sebenar. Inilah masa terbaik untuk bergerak.',
    ] as L,
  },
  {
    min: 32,
    key: 'stirring',
    label: ['Stirring', 'Mula Bergerak'] as L,
    note: [
      'The potential is clear and mostly untouched.',
      'Potensinya jelas dan sebahagian besarnya belum disentuh.',
    ] as L,
  },
  {
    min: 0,
    key: 'dormant',
    label: ['Dormant', 'Tidur'] as L,
    note: ['Almost everything here is still upside.', 'Hampir semua di sini masih ruang untuk naik.'] as L,
  },
];

// ── MVP³ candidate — a lookup table, never generated ─────────────────────────

const CANDIDATES: Record<string, { name: L; what: L; window: L }> = {
  packaged_knowledge: {
    name: ['Packaged knowledge', 'Pengetahuan berpakej'],
    what: [
      'The expertise sitting in one person’s head is your most sellable asset and the one you currently give away free. Turned into a paid product — an assisted diagnostic, a short training programme, a subscription advisory — it earns without consuming more of your time.',
      'Kepakaran dalam kepala seseorang ialah aset paling boleh dijual dan yang kini anda berikan percuma. Dijadikan produk berbayar — diagnostik berbantu, program latihan pendek, khidmat nasihat langganan — ia menjana pendapatan tanpa menggunakan lebih banyak masa anda.',
    ],
    window: ['21–30 days', '21–30 hari'],
  },
  reactivation_engine: {
    name: ['Reactivation engine', 'Enjin pengaktifan semula'],
    what: [
      'You already hold years of customer records. A repeatable offer sent to people who have bought before converts several times better than chasing strangers, and costs a fraction as much.',
      'Anda sudah memiliki rekod pelanggan bertahun-tahun. Tawaran berulang kepada mereka yang pernah membeli menukar beberapa kali lebih baik daripada mengejar orang baharu, dengan kos yang jauh lebih rendah.',
    ],
    window: ['14–21 days', '14–21 hari'],
  },
  productised_service: {
    name: ['Productised service', 'Perkhidmatan berpakej'],
    what: [
      'You work in a way that is genuinely better than the norm. Sold as a named, fixed-scope, fixed-price package rather than as custom work, it prices on outcome instead of hours and stops every job starting from zero.',
      'Cara anda bekerja lebih baik daripada kebiasaan. Dijual sebagai pakej bernama dengan skop dan harga tetap dan bukan kerja tempahan, ia dinilai berdasarkan hasil dan bukan jam, dan setiap kerja tidak lagi bermula dari kosong.',
    ],
    window: ['21–30 days', '21–30 hari'],
  },
  audience_to_offer: {
    name: ['Audience-to-offer', 'Khalayak kepada tawaran'],
    what: [
      'You already own attention — a following, a list, a library of material. What is missing is a clear path from that attention to something someone can buy today.',
      'Anda sudah memiliki perhatian — pengikut, senarai, atau bahan sedia ada. Yang tiada ialah laluan jelas daripada perhatian itu kepada sesuatu yang boleh dibeli hari ini.',
    ],
    window: ['14–21 days', '14–21 hari'],
  },
  capacity_as_a_service: {
    name: ['Capacity-as-a-service', 'Kapasiti sebagai perkhidmatan'],
    what: [
      'Equipment or space with spare hours is a fixed cost you are already paying. Sold as bookable capacity, those idle hours become a second revenue line with no new investment.',
      'Peralatan atau ruang yang masih ada kapasiti ialah kos tetap yang sudah anda bayar. Dijual sebagai kapasiti boleh ditempah, jam terbiar itu menjadi sumber pendapatan kedua tanpa pelaburan baharu.',
    ],
    window: ['21–30 days', '21–30 hari'],
  },
  second_you: {
    name: ['The second you', 'Diri anda yang kedua'],
    what: [
      'Everything waits for you, and that ceiling is the business. An assisted layer that answers, quotes and briefs in your voice takes the routine half of your week back without handing over judgement.',
      'Semuanya menunggu anda, dan siling itulah perniagaan ini. Lapisan berbantu yang menjawab, memberi sebut harga dan menyediakan taklimat dalam suara anda mengembalikan separuh rutin minggu anda tanpa menyerahkan pertimbangan.',
    ],
    window: ['30 days', '30 hari'],
  },
  findable_storefront: {
    name: ['Findable storefront', 'Etalase yang boleh dijumpai'],
    what: [
      'People nearby are already searching for exactly what you sell, and the search does not return you. A properly claimed listing and a page that answers the buying question is the cheapest revenue in this report.',
      'Orang berdekatan sudah mencari apa yang anda jual, dan carian itu tidak memaparkan anda. Penyenaraian yang dituntut dengan betul dan halaman yang menjawab soalan pembelian ialah hasil termurah dalam laporan ini.',
    ],
    window: ['7–14 days', '7–14 hari'],
  },
  first_responder: {
    name: ['First responder', 'Pembalas pertama'],
    what: [
      'An always-on front door that answers every enquiry in under a minute, qualifies it, and hands you only the ones worth your time. It is the single change that moves the most money in the shortest time.',
      'Pintu depan sentiasa terbuka yang menjawab setiap pertanyaan dalam masa seminit, menapisnya, dan menyerahkan kepada anda hanya yang berbaloi. Ia perubahan tunggal yang menggerakkan paling banyak wang dalam masa terpendek.',
    ],
    window: ['14 days', '14 hari'],
  },
};

function chooseCandidate(answers: Answers): string {
  const dormant = picks(answers, 'dormant_assets');
  const aiUsage = pick(answers, 'ai_usage');
  const leads = pick(answers, 'leads_per_month');
  const bottleneck = pick(answers, 'bottleneck');
  const ownerHours = pick(answers, 'owner_only_hours');
  const industry = pick(answers, 'industry');
  const presence = picks(answers, 'digital_presence');

  const lowAi = aiUsage === 'none' || aiUsage === 'personal' || aiUsage === 'scattered';
  const bigLeads = leads === '31_100' || leads === '101_300' || leads === 'over_300';
  const heavyOwner = ownerHours === '16_30' || ownerHours === 'over_30';

  if (dormant.includes('expertise') && lowAi) return 'packaged_knowledge';
  if (dormant.includes('customer_data') && bigLeads) return 'reactivation_engine';
  if (dormant.includes('process')) return 'productised_service';
  if (dormant.includes('audience') || dormant.includes('content')) return 'audience_to_offer';
  if (dormant.includes('equipment')) return 'capacity_as_a_service';
  if (bottleneck === 'owner' && heavyOwner) return 'second_you';
  if ((industry === 'fnb' || industry === 'retail') && !presence.includes('gbp')) return 'findable_storefront';
  return 'first_responder';
}

// ── Free fixes and next moves ────────────────────────────────────────────────

function firstSeven(answers: Answers, topLeak: Leak | undefined): { action: L; why: L }[] {
  const out: { action: L; why: L }[] = [];
  const presence = picks(answers, 'digital_presence');
  const response = pick(answers, 'response_time');

  if (!presence.includes('gbp')) {
    out.push({
      action: ['Claim and complete your Google Business Profile', 'Tuntut dan lengkapkan Profil Perniagaan Google anda'],
      why: [
        'It is free, it takes about twenty minutes, and it is the first thing a nearby buyer sees.',
        'Ia percuma, mengambil masa kira-kira dua puluh minit, dan ia perkara pertama dilihat pembeli berdekatan.',
      ],
    });
  }
  if (response && response !== 'under_15m') {
    out.push({
      action: [
        'Set a WhatsApp Business greeting and away message today',
        'Tetapkan mesej sapaan dan mesej tiada di WhatsApp Business hari ini',
      ],
      why: [
        'It will not answer the question, but it stops the silence that loses the enquiry.',
        'Ia tidak menjawab soalan, tetapi ia menghentikan kesunyian yang menghilangkan pertanyaan.',
      ],
    });
  }
  if (pick(answers, 'offer_written') === 'no' || pick(answers, 'offer_written') === 'informal') {
    out.push({
      action: [
        'Write one paragraph that says exactly what you sell and to whom',
        'Tulis satu perenggan yang menyatakan dengan tepat apa yang anda jual dan kepada siapa',
      ],
      why: [
        'Everything else — a page, an ad, a pitch — is downstream of that paragraph existing.',
        'Semua yang lain — halaman, iklan, pembentangan — bergantung pada perenggan itu wujud.',
      ],
    });
  }
  out.push({
    action: [
      'Write down the five questions customers ask before they buy',
      'Tuliskan lima soalan yang pelanggan tanya sebelum membeli',
    ],
    why: [
      'That list is the raw material for every page, script and automation that follows.',
      'Senarai itu ialah bahan mentah bagi setiap halaman, skrip dan automasi selepas ini.',
    ],
  });
  out.push({
    action: [
      'Time one full cycle of your most repeated task, once, with a stopwatch',
      'Ukur satu kitaran penuh tugas paling berulang anda, sekali, dengan jam randik',
    ],
    why: [
      topLeak
        ? 'You cannot price a fix until you know the true cost of the thing being fixed.'
        : 'You cannot price a fix until you know the true cost of the thing being fixed.',
      'Anda tidak boleh menilai pembaikan sebelum tahu kos sebenar perkara yang dibaiki.',
    ],
  });
  return out.slice(0, 3);
}

function nextMoves(candidateName: L, topLeak: Leak | undefined): { horizon: L; action: L }[] {
  return [
    {
      horizon: ['Next 30 days', '30 hari akan datang'],
      action: topLeak
        ? [
            `Stop the ${topLeak.name[0]} leak first — it is the largest single number in this report, and the fix is the fastest to build.`,
            `Hentikan kebocoran ${topLeak.name[1]} dahulu — ia angka tunggal terbesar dalam laporan ini, dan pembaikannya paling cepat dibina.`,
          ]
        : [
            'Establish the baseline numbers this report had to estimate, so the next decision rests on measurement.',
            'Tetapkan angka asas yang terpaksa dianggarkan laporan ini, supaya keputusan seterusnya berasaskan ukuran.',
          ],
    },
    {
      horizon: ['Next 90 days', '90 hari akan datang'],
      action: [
        `Take "${candidateName[0]}" to market as a real, priced offer — not a plan for one.`,
        `Bawa "${candidateName[1]}" ke pasaran sebagai tawaran sebenar berharga — bukan sekadar rancangan.`,
      ],
    },
  ];
}

// ── Entry point ──────────────────────────────────────────────────────────────

export function buildSnapshot(
  answers: Answers,
  assets: DetectedAsset[],
  context: BusinessContext,
  respondentType: RespondentType,
  lang: Lang,
): Snapshot {
  const inp: Inputs = { answers, assets, context };

  const discoverability = discoverabilityScore(inp);
  const { leaks, total, capped, ratio } = computeLeaks(answers, discoverability);
  const dimensions = buildDimensions(inp, ratio);

  const scored = dimensions.filter((d) => d.score !== null);
  const weightSum = scored.reduce((a, d) => a + d.weight, 0);
  const index = weightSum > 0 ? round(scored.reduce((a, d) => a + (d.score as number) * d.weight, 0) / weightSum) : 0;

  const lensScores = {} as Record<LensKey, number | null>;
  for (const lens of ['build_readiness', 'hidden_potential', 'market_pull'] as LensKey[]) {
    const inLens = scored.filter((d) => d.lens === lens);
    const w = inLens.reduce((a, d) => a + d.weight, 0);
    lensScores[lens] = w > 0 ? round(inLens.reduce((a, d) => a + (d.score as number) * d.weight, 0) / w) : null;
  }

  const band = BANDS.find((b) => index >= b.min)!;

  const answerable = questionsFor(respondentType).length;
  const answered = questionsFor(respondentType).filter((q) => {
    const v = answers[q.id];
    if (v === undefined) return false;
    if (v === NOT_SURE || v === DECLINED) return false;
    return true;
  }).length;
  const coverage = answerable ? answered / answerable : 0;

  const confidence: Snapshot['confidence'] = coverage < 0.5 ? 'low' : 'moderate';

  const limitations: L[] = [];
  if (assets.length) {
    limitations.push([
      `${assets.length} link${assets.length === 1 ? '' : 's'} recorded as declared. None were opened or verified.`,
      `${assets.length} pautan direkodkan sebagai diisytiharkan. Tiada satu pun dibuka atau disahkan.`,
    ]);
  }
  const skipped = answerable - answered;
  if (skipped > 0) {
    limitations.push([
      `${skipped} question${skipped === 1 ? '' : 's'} skipped or declined. Those were left out of scoring rather than counted against you.`,
      `${skipped} soalan dilangkau atau tidak dijawab. Ia dikeluarkan daripada penilaian dan bukan dikira merugikan anda.`,
    ]);
  }
  if (total === null) {
    limitations.push([
      'No ringgit figure could be estimated, because the volume, value and hours questions were not answered.',
      'Tiada angka ringgit dapat dianggarkan, kerana soalan jumlah, nilai dan jam tidak dijawab.',
    ]);
  }
  if (capped) {
    limitations.push([
      'The total was capped at 35% of estimated monthly revenue. The uncapped sum was higher.',
      'Jumlah dihadkan pada 35% daripada anggaran hasil bulanan. Jumlah tanpa had adalah lebih tinggi.',
    ]);
  }
  const insufficient = dimensions.filter((d) => d.score === null);
  if (insufficient.length) {
    limitations.push([
      `${insufficient.length} dimension${insufficient.length === 1 ? '' : 's'} had no usable input and are reported as insufficient data, not as a low score.`,
      `${insufficient.length} dimensi tiada input berguna dan dilaporkan sebagai data tidak mencukupi, bukan skor rendah.`,
    ]);
  }

  const ranked = leaks
    .filter((l) => l.kind === 'loss' && l.amount !== null)
    .sort((a, b) => (b.amount as number) - (a.amount as number));

  const candidateKey = chooseCandidate(answers);
  const candidate = CANDIDATES[candidateKey];

  return {
    scan_id: `scan_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    instrument_version: INSTRUMENT_VERSION,
    scoring_version: SCORING_VERSION,
    generated_at: new Date().toISOString(),
    language: lang,
    respondent_type: respondentType,
    mvp3_index: index,
    band_key: band.key,
    band_label: band.label,
    band_note: band.note,
    lens_scores: lensScores,
    dimension_scores: dimensions,
    leaks,
    total_monthly_leak: total,
    leak_capped: capped,
    cost_of_delay_90: total === null ? null : total * 3,
    mvp3_candidate: { key: candidateKey, ...candidate },
    first_seven: firstSeven(answers, ranked[0]),
    next_moves: nextMoves(candidate.name, ranked[0]),
    confidence,
    evidence_coverage: Math.round(coverage * 100) / 100,
    assets_submitted: assets.length,
    assets_reviewed: 0,
    limitations,
    classifications: {
      mvp3_index: 'inference',
      leaks: 'inference',
      first_seven: 'recommendation',
      next_moves: 'recommendation',
      assets: 'limitation',
    },
  };
}

export { money };
