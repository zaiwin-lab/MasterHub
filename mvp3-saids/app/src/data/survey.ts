import type { L, Option, Question, SectionId } from '../types';

/** Instrument version. Bump on any change to question wording, options or order —
 *  the cohort is only comparable within a version. */
export const INSTRUMENT_VERSION = '2026.2';
export const CONSENT_VERSION = '1.0';

export const SECTIONS: { id: SectionId; name: L }[] = [
  { id: 'profile', name: ['About the business', 'Tentang perniagaan'] },
  { id: 'offer', name: ['What you sell', 'Apa yang anda jual'] },
  { id: 'demand', name: ['Where customers come from', 'Dari mana pelanggan datang'] },
  { id: 'operations', name: ['How the work gets done', 'Bagaimana kerja dilaksanakan'] },
  { id: 'digital', name: ['Your digital presence', 'Kehadiran digital anda'] },
  { id: 'ai', name: ['AI today', 'AI hari ini'] },
  { id: 'potential', name: ["What's sitting unused", 'Apa yang tidak digunakan'] },
  { id: 'decision', name: ['Making it happen', 'Melaksanakannya'] },
];

const opt = (value: string, en: string, bm: string): Option => ({ value, label: [en, bm] });

export const QUESTIONS: Question[] = [
  // ── profile ────────────────────────────────────────────────────────────────
  {
    id: 'industry',
    section: 'profile',
    type: 'select',
    text: ['What line of business are you in?', 'Apakah bidang perniagaan anda?'],
    options: [
      opt('fnb', 'Food & beverage / restaurant', 'Makanan & minuman / restoran'),
      opt('retail', 'Retail / trading', 'Peruncitan / perdagangan'),
      opt('services', 'Professional services', 'Perkhidmatan profesional'),
      opt('construction', 'Construction / contracting', 'Pembinaan / kontraktor'),
      opt('automotive', 'Automotive / workshop', 'Automotif / bengkel'),
      opt('health', 'Health / clinic / wellness', 'Kesihatan / klinik / kesejahteraan'),
      opt('education', 'Education / training', 'Pendidikan / latihan'),
      opt('logistics', 'Logistics / transport', 'Logistik / pengangkutan'),
      opt('agro', 'Agriculture / agro-based', 'Pertanian / berasaskan agro'),
      opt('manufacturing', 'Manufacturing', 'Pembuatan'),
      opt('property', 'Property / real estate', 'Hartanah'),
      opt('tourism', 'Tourism / hospitality', 'Pelancongan / hospitaliti'),
      opt('tech', 'Technology / digital', 'Teknologi / digital'),
      opt('other', 'Something else', 'Lain-lain'),
    ],
  },
  {
    id: 'headcount',
    section: 'profile',
    type: 'slider',
    text: [
      'How many people work in the business, including you?',
      'Berapa ramai bekerja dalam perniagaan ini, termasuk anda?',
    ],
    options: [
      opt('solo', 'Just me', 'Saya sahaja'),
      opt('2_9', '2–9', '2–9'),
      opt('10_29', '10–29', '10–29'),
      opt('30_79', '30–79', '30–79'),
      opt('80_plus', '80+', '80+'),
    ],
  },
  {
    id: 'revenue_band',
    section: 'profile',
    type: 'slider',
    allowDecline: true,
    text: [
      'Roughly what does the business turn over in a year?',
      'Lebih kurang berapakah perolehan perniagaan setahun?',
    ],
    note: [
      'Used only to keep the estimates in a sensible range. Never shared.',
      'Digunakan hanya untuk memastikan anggaran munasabah. Tidak akan dikongsi.',
    ],
    options: [
      opt('under_500k', 'Under RM 500k', 'Bawah RM 500k'),
      opt('500k_2m', 'RM 500k–2m', 'RM 500k–2j'),
      opt('2m_10m', 'RM 2m–10m', 'RM 2j–10j'),
      opt('10m_50m', 'RM 10m–50m', 'RM 10j–50j'),
      opt('over_50m', 'Over RM 50m', 'Melebihi RM 50j'),
    ],
  },

  // ── offer ──────────────────────────────────────────────────────────────────
  {
    id: 'offer_clarity',
    section: 'offer',
    type: 'scale',
    text: [
      'If I asked five of your customers what you do, would they all give the same answer?',
      'Jika lima pelanggan anda ditanya apa yang anda buat, adakah jawapan mereka sama?',
    ],
    scale: {
      min: 1,
      max: 5,
      minLabel: ["They'd all say something different", 'Semua akan beri jawapan berbeza'],
      maxLabel: ['Word for word the same', 'Sama, perkataan demi perkataan'],
    },
  },
  {
    id: 'differentiation',
    section: 'offer',
    type: 'multi',
    maxSelect: 2,
    allowNotSure: true,
    text: [
      'Why do customers choose you over the alternative?',
      'Mengapa pelanggan memilih anda berbanding yang lain?',
    ],
    help: ['Pick the two that matter most.', 'Pilih dua yang paling penting.'],
    options: [
      opt('price', "We're cheaper", 'Kami lebih murah'),
      opt('speed', "We're faster", 'Kami lebih pantas'),
      opt('quality', 'Better quality or craft', 'Kualiti atau mutu kerja lebih baik'),
      opt('relationship', 'They know and trust us personally', 'Mereka kenal dan percaya kami'),
      opt('access', "We're the only ones nearby who do it", 'Hanya kami yang ada berdekatan'),
      opt('expertise', "Specialist knowledge others don't have", 'Kepakaran yang orang lain tiada'),
    ],
  },
  {
    id: 'offer_written',
    section: 'offer',
    type: 'segmented',
    text: [
      'Is your offer written down anywhere a stranger could read it?',
      'Adakah tawaran anda ditulis di mana-mana yang orang luar boleh baca?',
    ],
    help: ['A page, a profile, a proper brochure.', 'Laman web, profil, atau risalah yang kemas.'],
    options: [
      opt('no', 'Nowhere', 'Tiada di mana-mana'),
      opt('informal', 'Roughly, in a WhatsApp or social post', 'Secara ringkas, dalam WhatsApp atau media sosial'),
      opt('yes_basic', 'Yes, basic', 'Ya, asas sahaja'),
      opt('yes_strong', "Yes, and it's genuinely good", 'Ya, dan ia memang bagus'),
    ],
  },

  // ── demand ─────────────────────────────────────────────────────────────────
  {
    id: 'lead_sources',
    section: 'demand',
    type: 'multi',
    maxSelect: 3,
    text: ['Where do most new customers come from?', 'Dari mana kebanyakan pelanggan baharu datang?'],
    help: ['Choose up to three.', 'Pilih sehingga tiga.'],
    options: [
      opt('referral', 'Word of mouth', 'Dari mulut ke mulut'),
      opt('walk_in', 'Walk-in / passing trade', 'Pelanggan singgah'),
      opt('social', 'Social media', 'Media sosial'),
      opt('search', 'Google or maps search', 'Carian Google atau peta'),
      opt('marketplace', 'Shopee / Lazada / delivery apps', 'Shopee / Lazada / aplikasi penghantaran'),
      opt('tender', 'Tenders or contracts', 'Tender atau kontrak'),
      opt('outbound', 'We go out and find them', 'Kami mencari mereka'),
      opt('repeat', 'Existing customers buying again', 'Pelanggan sedia ada membeli semula'),
    ],
  },
  {
    id: 'leads_per_month',
    section: 'demand',
    type: 'slider',
    allowNotSure: true,
    text: [
      'How many new enquiries reach you in a typical month?',
      'Berapa banyak pertanyaan baharu anda terima dalam sebulan biasa?',
    ],
    options: [
      opt('under_10', 'Under 10', 'Bawah 10'),
      opt('10_30', '10–30', '10–30'),
      opt('31_100', '31–100', '31–100'),
      opt('101_300', '101–300', '101–300'),
      opt('over_300', 'More than 300', 'Lebih 300'),
    ],
  },
  {
    id: 'avg_deal_value',
    section: 'demand',
    type: 'slider',
    allowDecline: true,
    text: ["What's a typical sale or job worth?", 'Berapakah nilai jualan atau kerja biasa?'],
    note: [
      'Used only to keep the estimates in a sensible range. Never shared.',
      'Digunakan hanya untuk memastikan anggaran munasabah. Tidak akan dikongsi.',
    ],
    options: [
      opt('under_500', 'Under RM 500', 'Bawah RM 500'),
      opt('500_2k', 'RM 500–2,000', 'RM 500–2,000'),
      opt('2k_10k', 'RM 2,000–10,000', 'RM 2,000–10,000'),
      opt('10k_50k', 'RM 10,000–50,000', 'RM 10,000–50,000'),
      opt('over_50k', 'Over RM 50,000', 'Melebihi RM 50,000'),
    ],
  },

  // ── operations ─────────────────────────────────────────────────────────────
  {
    id: 'response_time',
    section: 'operations',
    type: 'segmented',
    text: [
      'When a new enquiry comes in, how quickly does someone actually reply?',
      'Bila pertanyaan baharu masuk, berapa cepat seseorang benar-benar membalas?',
    ],
    options: [
      opt('under_15m', 'Within 15 minutes', 'Dalam 15 minit'),
      opt('under_1hr', 'Within the hour', 'Dalam sejam'),
      opt('same_day', 'Same day', 'Hari yang sama'),
      opt('next_day', 'Next day', 'Keesokan hari'),
      opt('varies', 'Longer, or it depends', 'Lebih lama, atau bergantung'),
    ],
  },
  {
    id: 'repetitive_hours',
    section: 'operations',
    type: 'slider',
    showFor: ['owner', 'executive'],
    text: [
      'Across your team, how many hours a week go into repetitive work?',
      'Merentas pasukan anda, berapa jam seminggu dihabiskan untuk kerja berulang?',
    ],
    help: [
      'Retyping, copying between systems, chasing the same information.',
      'Menaip semula, menyalin antara sistem, mengejar maklumat yang sama.',
    ],
    options: [
      opt('under_5', 'Under 5', 'Bawah 5'),
      opt('5_15', '5–15', '5–15'),
      opt('16_40', '16–40', '16–40'),
      opt('41_100', '41–100', '41–100'),
      opt('over_100', 'More than 100', 'Lebih 100'),
    ],
  },
  {
    id: 'bottleneck',
    section: 'operations',
    type: 'multi',
    maxSelect: 2,
    text: ['When things slow down, where does it usually jam?', 'Bila kerja perlahan, di mana biasanya tersekat?'],
    help: ['Pick the two worst.', 'Pilih dua yang paling teruk.'],
    options: [
      opt('sales', 'Getting enquiries in', 'Mendapatkan pertanyaan masuk'),
      opt('response', 'Replying fast enough', 'Membalas dengan cukup cepat'),
      opt('quoting', 'Preparing quotes or proposals', 'Menyediakan sebut harga atau cadangan'),
      opt('delivery', 'Actually delivering the work', 'Menyiapkan kerja itu sendiri'),
      opt('collection', 'Getting paid', 'Mendapat bayaran'),
      opt('admin', 'Paperwork and admin', 'Kertas kerja dan pentadbiran'),
      opt('people', 'Not enough of the right people', 'Kekurangan orang yang sesuai'),
      opt('owner', 'Everything waits for me', 'Semuanya menunggu saya'),
    ],
  },
  {
    id: 'quote_days',
    section: 'operations',
    type: 'segmented',
    showFor: ['owner', 'executive'],
    text: [
      "From enquiry to a quote in the customer's hands — how long, typically?",
      'Dari pertanyaan hingga sebut harga sampai ke tangan pelanggan — berapa lama biasanya?',
    ],
    options: [
      opt('same_day', 'Same day', 'Hari yang sama'),
      opt('1_2_days', '1–2 days', '1–2 hari'),
      opt('3_5_days', '3–5 days', '3–5 hari'),
      opt('1_2_weeks', '1–2 weeks', '1–2 minggu'),
      opt('longer', 'Longer', 'Lebih lama'),
    ],
  },
  {
    id: 'owner_only_hours',
    section: 'operations',
    type: 'slider',
    showFor: ['owner'],
    text: [
      'How many hours a week go to work that only you can do?',
      'Berapa jam seminggu untuk kerja yang hanya anda boleh buat?',
    ],
    options: [
      opt('under_5', 'Under 5', 'Bawah 5'),
      opt('5_15', '5–15', '5–15'),
      opt('16_30', '16–30', '16–30'),
      opt('over_30', 'More than 30', 'Lebih 30'),
    ],
  },

  // ── digital ────────────────────────────────────────────────────────────────
  {
    id: 'digital_presence',
    section: 'digital',
    type: 'multi',
    text: [
      'Which of these does the business actually have and use?',
      'Antara berikut, mana yang perniagaan anda ada dan guna?',
    ],
    options: [
      opt('website', 'A website', 'Laman web'),
      opt('gbp', 'Google Business Profile', 'Profil Perniagaan Google'),
      opt('facebook', 'Facebook page', 'Halaman Facebook'),
      opt('instagram', 'Instagram', 'Instagram'),
      opt('tiktok', 'TikTok', 'TikTok'),
      opt('linkedin', 'LinkedIn', 'LinkedIn'),
      opt('whatsapp_biz', 'WhatsApp Business', 'WhatsApp Business'),
      opt('marketplace', 'Shopee / Lazada / delivery listing', 'Penyenaraian Shopee / Lazada / penghantaran'),
    ],
  },
  {
    id: 'findability',
    section: 'digital',
    type: 'scale',
    text: [
      'If someone nearby needed exactly what you sell and searched online, would they find you?',
      'Jika seseorang berdekatan mencari apa yang anda jual dalam talian, adakah mereka jumpa anda?',
    ],
    scale: {
      min: 1,
      max: 5,
      minLabel: ['No chance', 'Tiada peluang'],
      maxLabel: ["They'd find us first", 'Kami yang pertama dijumpai'],
    },
  },

  // ── ai ─────────────────────────────────────────────────────────────────────
  {
    id: 'ai_usage',
    section: 'ai',
    type: 'single',
    text: ['Where are you with AI right now?', 'Di mana kedudukan anda dengan AI sekarang?'],
    options: [
      opt('none', "Haven't touched it", 'Belum menyentuhnya'),
      opt('personal', 'I use it personally, not in the business', 'Saya guna secara peribadi, bukan dalam perniagaan'),
      opt('scattered', 'A few people use it, nothing organised', 'Beberapa orang guna, tiada yang tersusun'),
      opt('some_process', "It's built into one or two real processes", 'Ia sebahagian daripada satu dua proses sebenar'),
      opt('core', 'It runs core parts of what we do', 'Ia menjalankan bahagian teras kerja kami'),
    ],
  },
  {
    id: 'ai_blocker',
    section: 'ai',
    type: 'multi',
    maxSelect: 2,
    allowNotSure: true,
    text: [
      "What's actually stopping you from doing more with it?",
      'Apa sebenarnya yang menghalang anda daripada berbuat lebih?',
    ],
    help: ['Pick up to two.', 'Pilih sehingga dua.'],
    options: [
      opt('dont_know_where', "I don't know where it would even apply", 'Saya tidak tahu di mana ia boleh digunakan'),
      opt('no_time', 'No time to work it out', 'Tiada masa untuk memikirkannya'),
      opt('cost', 'Worried about the cost', 'Bimbang tentang kos'),
      opt('trust', "Don't trust the output", 'Tidak percaya hasilnya'),
      opt('skills', 'Nobody here knows how', 'Tiada sesiapa di sini tahu caranya'),
      opt('data', 'Our information is too messy', 'Maklumat kami terlalu bersepah'),
      opt('tried_failed', "We tried and it didn't stick", 'Kami pernah cuba tetapi tidak berjaya'),
      opt('nothing', "Nothing — we're moving on it", 'Tiada — kami sedang bergerak'),
    ],
  },

  // ── potential ──────────────────────────────────────────────────────────────
  {
    id: 'dormant_assets',
    section: 'potential',
    type: 'multi',
    text: [
      'Which of these do you have sitting there, not really being used?',
      'Antara berikut, mana yang anda ada tetapi tidak benar-benar digunakan?',
    ],
    options: [
      opt('customer_data', 'Years of customer records', 'Rekod pelanggan bertahun-tahun'),
      opt('expertise', "Deep know-how in someone's head", 'Kepakaran mendalam dalam kepala seseorang'),
      opt('audience', 'A following or mailing list', 'Pengikut atau senarai e-mel'),
      opt('content', 'Photos, videos, written material', 'Gambar, video, bahan bertulis'),
      opt('process', 'A way of working better than the norm', 'Cara bekerja yang lebih baik daripada biasa'),
      opt('equipment', 'Equipment or space with spare capacity', 'Peralatan atau ruang yang masih ada kapasiti'),
      opt('supplier', 'Supplier or partner relationships', 'Hubungan pembekal atau rakan kongsi'),
      opt('brand', 'A name people already trust', 'Nama yang sudah dipercayai orang'),
    ],
  },

  // ── decision ───────────────────────────────────────────────────────────────
  {
    id: 'decision_authority',
    section: 'decision',
    type: 'segmented',
    showFor: ['owner', 'founder'],
    text: [
      'If you decided today to fix the biggest thing, could you just decide?',
      'Jika anda putuskan hari ini untuk membaiki perkara terbesar, bolehkah anda terus putuskan?',
    ],
    options: [
      opt('yes_alone', "Yes, it's my call", 'Ya, ia keputusan saya'),
      opt('yes_with_partner', 'Yes, with one other person', 'Ya, bersama seorang lagi'),
      opt('board', 'Needs board or family agreement', 'Perlu persetujuan lembaga atau keluarga'),
      opt('no', 'Not my decision', 'Bukan keputusan saya'),
    ],
  },
  {
    id: 'decision_authority_exec',
    section: 'decision',
    type: 'segmented',
    showFor: ['executive'],
    text: ['How would a decision like this get made?', 'Bagaimana keputusan seperti ini dibuat?'],
    options: [
      opt('my_budget', 'I have budget for it', 'Saya ada bajet untuknya'),
      opt('recommend', "I'd recommend, someone else approves", 'Saya cadangkan, orang lain luluskan'),
      opt('committee', 'Committee or procurement process', 'Jawatankuasa atau proses perolehan'),
      opt('unclear', 'Genuinely unclear', 'Tidak jelas'),
    ],
  },
  {
    id: 'timeline',
    section: 'decision',
    type: 'segmented',
    text: [
      'If the numbers made sense, when would you want something working?',
      'Jika angkanya masuk akal, bila anda mahu sesuatu berfungsi?',
    ],
    options: [
      opt('this_month', 'This month', 'Bulan ini'),
      opt('this_quarter', 'This quarter', 'Suku tahun ini'),
      opt('this_year', 'Sometime this year', 'Dalam tahun ini'),
      opt('exploring', 'Just exploring for now', 'Sekadar meninjau buat masa ini'),
    ],
  },
];

/** The instrument for one respondent type, in order. */
export function questionsFor(type: import('../types').RespondentType): Question[] {
  return QUESTIONS.filter((q) => !q.showFor || q.showFor.includes(type));
}

/** Band midpoints. Every one of these is documented on the arithmetic panel. */
export const MIDPOINTS = {
  headcount: { solo: 1, '2_9': 5, '10_29': 19, '30_79': 54, '80_plus': 120 } as Record<string, number>,
  revenue_band: {
    under_500k: 250_000,
    '500k_2m': 1_250_000,
    '2m_10m': 6_000_000,
    '10m_50m': 30_000_000,
    over_50m: 75_000_000,
  } as Record<string, number>,
  leads_per_month: { under_10: 5, '10_30': 20, '31_100': 65, '101_300': 200, over_300: 450 } as Record<string, number>,
  avg_deal_value: { under_500: 250, '500_2k': 1_250, '2k_10k': 6_000, '10k_50k': 30_000, over_50k: 90_000 } as Record<
    string,
    number
  >,
  repetitive_hours: { under_5: 3, '5_15': 10, '16_40': 28, '41_100': 70, over_100: 140 } as Record<string, number>,
  owner_only_hours: { under_5: 3, '5_15': 10, '16_30': 23, over_30: 38 } as Record<string, number>,
};

/** Share of enquiries lost at each response speed. Drives L1. */
export const MISS_RATE: Record<string, number> = {
  under_15m: 0.05,
  under_1hr: 0.1,
  same_day: 0.22,
  next_day: 0.35,
  varies: 0.5,
};

/** Share of pipeline that decays at each quote turnaround. Drives L4. */
export const QUOTE_DECAY: Record<string, number> = {
  same_day: 0.02,
  '1_2_days': 0.06,
  '3_5_days': 0.14,
  '1_2_weeks': 0.25,
  longer: 0.35,
};
