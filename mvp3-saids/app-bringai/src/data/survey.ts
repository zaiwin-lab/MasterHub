import type { L, Option, Question, SectionId } from '../types';

/** Instrument version. Bump on any change to question wording, options or order —
 *  the cohort is only comparable within a version.
 *  2026.2: three questions became multi-select, six ordinal bands became sliders. */
export const INSTRUMENT_VERSION = '2026.2';
export const CONSENT_VERSION = '1.0';

export const SECTIONS: { id: SectionId; name: L }[] = [
  { id: 'profile', name: ['About the business', 'Tentang perniagaan', '关于企业', 'Pasal pengawa dagang'] },
  { id: 'offer', name: ['What you sell', 'Apa yang anda jual', '你卖什么', 'Nama utai ti dijual'] },
  { id: 'demand', name: ['Where customers come from', 'Dari mana pelanggan datang', '客户从哪来', 'Ari ni pelanggan datai'] },
  { id: 'operations', name: ['How the work gets done', 'Bagaimana kerja dilaksanakan', '工作怎么完成', 'Baka ni pengawa digaga'] },
  { id: 'digital', name: ['Your digital presence', 'Kehadiran digital anda', '你的数字足迹', 'Pengawa digital nuan'] },
  { id: 'ai', name: ['AI today', 'AI hari ini', '目前的 AI 应用', 'AI sehari tu'] },
  { id: 'potential', name: ["What's sitting unused", 'Apa yang tidak digunakan', '闲置的资产', 'Utai ti nadai dikena'] },
  { id: 'decision', name: ['Making it happen', 'Melaksanakannya', '推动执行', 'Ngasuh nya nyadi'] },
];

const opt = (value: string, en: string, bm: string, zh: string, ib: string): Option => ({
  value,
  label: [en, bm, zh, ib],
});

export const QUESTIONS: Question[] = [
  // ── profile ────────────────────────────────────────────────────────────────
  {
    id: 'industry',
    section: 'profile',
    type: 'select',
    text: ['What line of business are you in?', 'Apakah bidang perniagaan anda?', '您从事哪个行业？', 'Nama macham pengawa dagang nuan?'],
    options: [
      opt('fnb', 'Food & beverage / restaurant', 'Makanan & minuman / restoran', '餐饮 / 餐厅', 'Pemakai & irup / restoran'),
      opt('retail', 'Retail / trading', 'Peruncitan / perdagangan', '零售 / 贸易', 'Kedai / bedagang'),
      opt('services', 'Professional services', 'Perkhidmatan profesional', '专业服务', 'Pengawa profesional'),
      opt('construction', 'Construction / contracting', 'Pembinaan / kontraktor', '建筑 / 承包', 'Pengawa ngaga rumah / kontraktor'),
      opt('automotive', 'Automotive / workshop', 'Automotif / bengkel', '汽车 / 维修厂', 'Kereta / bengkel'),
      opt('health', 'Health / clinic / wellness', 'Kesihatan / klinik', '健康 / 诊所', 'Pengerai / klinik'),
      opt('education', 'Education / training', 'Pendidikan / latihan', '教育 / 培训', 'Pelajar / latih'),
      opt('logistics', 'Logistics / transport', 'Logistik / pengangkutan', '物流 / 运输', 'Logistik / angkut'),
      opt('agro', 'Agriculture / agro-based', 'Pertanian / agro', '农业 / 农产', 'Pengawa umai'),
      opt('manufacturing', 'Manufacturing', 'Pembuatan', '制造业', 'Pengawa ngaga barang'),
      opt('property', 'Property / real estate', 'Hartanah', '房地产', 'Tanah enggau rumah'),
      opt('tourism', 'Tourism / hospitality', 'Pelancongan / hospitaliti', '旅游 / 酒店', 'Pelancong / hotel'),
      opt('tech', 'Technology / digital', 'Teknologi / digital', '科技 / 数字', 'Teknologi / digital'),
      opt('other', 'Something else', 'Lain-lain', '其他', 'Bukai agi'),
    ],
  },
  {
    id: 'headcount',
    section: 'profile',
    type: 'slider',
    text: [
      'How many people work in the business, including you?',
      'Berapa ramai bekerja dalam perniagaan ini, termasuk anda?',
      '公司有多少人，包括您在内？',
      'Berapa iku bekereja ditu, enggau nuan empu?',
    ],
    options: [
      opt('solo', 'Just me', 'Saya sahaja', '只有我', 'Aku aja'),
      opt('2_9', '2–9', '2–9', '2–9 人', '2–9'),
      opt('10_29', '10–29', '10–29', '10–29 人', '10–29'),
      opt('30_79', '30–79', '30–79', '30–79 人', '30–79'),
      opt('80_plus', '80+', '80+', '80 人以上', '80+'),
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
      '公司一年的营业额大约多少？',
      'Berapa mayuh pemansang dagang dalam setaun?',
    ],
    note: [
      'Used only to keep the estimates in a sensible range. Never shared.',
      'Digunakan hanya untuk memastikan anggaran munasabah. Tidak akan dikongsi.',
      '仅用于让估算保持合理范围，绝不外传。',
      'Dikena semina kena ngintu anggar nya betul. Nadai dibagi ngagai orang bukai.',
    ],
    options: [
      opt('under_500k', 'Under RM 500k', 'Bawah RM 500k', 'RM 50 万以下', 'Baruh RM 500k'),
      opt('500k_2m', 'RM 500k–2m', 'RM 500k–2j', 'RM 50 万–200 万', 'RM 500k–2j'),
      opt('2m_10m', 'RM 2m–10m', 'RM 2j–10j', 'RM 200 万–1000 万', 'RM 2j–10j'),
      opt('10m_50m', 'RM 10m–50m', 'RM 10j–50j', 'RM 1000 万–5000 万', 'RM 10j–50j'),
      opt('over_50m', 'Over RM 50m', 'Melebihi RM 50j', 'RM 5000 万以上', 'Lebih RM 50j'),
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
      '如果问五位客户您是做什么的，他们的答案会一致吗？',
      'Enti lima iku pelanggan nuan ditanya nama pengawa nuan, sebaka enda saut sida?',
    ],
    scale: {
      min: 1,
      max: 5,
      minLabel: [
        "They'd all say something different",
        'Semua akan beri jawapan berbeza',
        '每个人说法都不同',
        'Semua deka bebeda saut',
      ],
      maxLabel: ['Word for word the same', 'Sama, perkataan demi perkataan', '一字不差', 'Sebaka magang'],
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
      '客户为什么选择您而不是别家？',
      'Nama kebuah pelanggan milih nuan, ukai orang bukai?',
    ],
    help: ['Pick the two that matter most.', 'Pilih dua yang paling penting.', '选出最重要的两项。', 'Pilih dua ti pemadu beguna.'],
    options: [
      opt('price', "We're cheaper", 'Kami lebih murah', '我们更便宜', 'Kami murah agi'),
      opt('speed', "We're faster", 'Kami lebih pantas', '我们更快', 'Kami lensat agi'),
      opt('quality', 'Better quality or craft', 'Kualiti lebih baik', '品质或手艺更好', 'Pengawa kami manah agi'),
      opt('relationship', 'They know and trust us personally', 'Mereka kenal dan percaya kami', '他们信任我们这个人', 'Sida nemu sereta arapka kami'),
      opt('access', "We're the only ones nearby", 'Hanya kami yang ada berdekatan', '附近只有我们做这个', 'Semina kami aja semak nya'),
      opt('expertise', "Specialist knowledge others don't have", 'Kepakaran yang orang lain tiada', '别人没有的专业知识', 'Penemu ti nadai ba orang bukai'),
    ],
  },
  {
    id: 'offer_written',
    section: 'offer',
    type: 'segmented',
    text: [
      'Is your offer written down anywhere a stranger could read it?',
      'Adakah tawaran anda ditulis di mana-mana yang orang luar boleh baca?',
      '您的产品说明有写在陌生人能读到的地方吗？',
      'Kati utai ti dijual nuan ditulis ba endur orang bukai ulih macha?',
    ],
    help: [
      'A page, a profile, a proper brochure.',
      'Laman web, profil, atau risalah yang kemas.',
      '网页、简介或正式宣传册。',
      'Laman web, profil, tauka risalah ti kemas.',
    ],
    options: [
      opt('no', 'Nowhere', 'Tiada di mana-mana', '没有', 'Nadai ba sebarang endur'),
      opt('informal', 'Roughly, in a WhatsApp or social post', 'Secara ringkas dalam WhatsApp', '大致有，在 WhatsApp 或社媒', 'Sikit ba WhatsApp tauka media sosial'),
      opt('yes_basic', 'Yes, basic', 'Ya, asas sahaja', '有，基本的', 'Wai, mimit aja'),
      opt('yes_strong', "Yes, and it's genuinely good", 'Ya, dan ia memang bagus', '有，而且做得很好', 'Wai, sereta amat manah'),
    ],
  },

  // ── demand ─────────────────────────────────────────────────────────────────
  {
    id: 'lead_sources',
    section: 'demand',
    type: 'multi',
    maxSelect: 3,
    text: [
      'Where do most new customers come from?',
      'Dari mana kebanyakan pelanggan baharu datang?',
      '新客户主要从哪里来？',
      'Ari ni penyampau pelanggan baru datai?',
    ],
    help: ['Choose up to three.', 'Pilih sehingga tiga.', '最多选三项。', 'Pilih sampai tiga.'],
    options: [
      opt('referral', 'Word of mouth', 'Dari mulut ke mulut', '口碑介绍', 'Ari nyau bemunyi'),
      opt('walk_in', 'Walk-in / passing trade', 'Pelanggan singgah', '路过进店', 'Pelanggan singgah'),
      opt('social', 'Social media', 'Media sosial', '社交媒体', 'Media sosial'),
      opt('search', 'Google or maps search', 'Carian Google atau peta', 'Google 或地图搜索', 'Giga ba Google tauka peta'),
      opt('marketplace', 'Shopee / Lazada / delivery apps', 'Shopee / Lazada / aplikasi penghantaran', 'Shopee / Lazada / 外送平台', 'Shopee / Lazada / aplikasi hantar'),
      opt('tender', 'Tenders or contracts', 'Tender atau kontrak', '招标或合约', 'Tender tauka kontrak'),
      opt('outbound', 'We go out and find them', 'Kami mencari mereka', '我们主动开发', 'Kami ti ngiga sida'),
      opt('repeat', 'Existing customers buying again', 'Pelanggan sedia ada membeli semula', '老客户回购', 'Pelanggan lama meli baru'),
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
      '平常一个月收到多少新询问？',
      'Berapa iti tanya baru datai ngagai nuan dalam sebulan?',
    ],
    options: [
      opt('under_10', 'Under 10', 'Bawah 10', '10 个以下', 'Baruh 10'),
      opt('10_30', '10–30', '10–30', '10–30 个', '10–30'),
      opt('31_100', '31–100', '31–100', '31–100 个', '31–100'),
      opt('101_300', '101–300', '101–300', '101–300 个', '101–300'),
      opt('over_300', 'More than 300', 'Lebih 300', '超过 300 个', 'Lebih ari 300'),
    ],
  },
  {
    id: 'avg_deal_value',
    section: 'demand',
    type: 'slider',
    allowDecline: true,
    text: [
      "What's a typical sale or job worth?",
      'Berapakah nilai jualan atau kerja biasa?',
      '一笔生意大约值多少？',
      'Berapa rega siti jual tauka pengawa biasa?',
    ],
    note: [
      'Used only to keep the estimates in a sensible range. Never shared.',
      'Digunakan hanya untuk memastikan anggaran munasabah. Tidak akan dikongsi.',
      '仅用于让估算保持合理范围，绝不外传。',
      'Dikena semina kena ngintu anggar nya betul. Nadai dibagi ngagai orang bukai.',
    ],
    options: [
      opt('under_500', 'Under RM 500', 'Bawah RM 500', 'RM 500 以下', 'Baruh RM 500'),
      opt('500_2k', 'RM 500–2,000', 'RM 500–2,000', 'RM 500–2,000', 'RM 500–2,000'),
      opt('2k_10k', 'RM 2,000–10,000', 'RM 2,000–10,000', 'RM 2,000–10,000', 'RM 2,000–10,000'),
      opt('10k_50k', 'RM 10,000–50,000', 'RM 10,000–50,000', 'RM 10,000–50,000', 'RM 10,000–50,000'),
      opt('over_50k', 'Over RM 50,000', 'Melebihi RM 50,000', 'RM 50,000 以上', 'Lebih RM 50,000'),
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
      '新询问进来后，多快会有人真的回复？',
      'Lebuh tanya baru datai, berapa lensat orang amat nyaut?',
    ],
    options: [
      opt('under_15m', 'Within 15 minutes', 'Dalam 15 minit', '15 分钟内', 'Dalam 15 minit'),
      opt('under_1hr', 'Within the hour', 'Dalam sejam', '一小时内', 'Dalam sejam'),
      opt('same_day', 'Same day', 'Hari yang sama', '当天', 'Hari nya mega'),
      opt('next_day', 'Next day', 'Keesokan hari', '隔天', 'Hari siti agi'),
      opt('varies', 'Longer, or it depends', 'Lebih lama, atau bergantung', '更久，看情况', 'Lama agi, tauka bebida'),
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
      '整个团队一周花多少小时在重复性工作上？',
      'Ba semua pengawa nuan, berapa jam seminggu dibuang ba pengawa ti belalauka diri?',
    ],
    help: [
      'Retyping, copying between systems, chasing the same information.',
      'Menaip semula, menyalin antara sistem, mengejar maklumat yang sama.',
      '重复输入、系统间搬资料、追同样的信息。',
      'Nulis baru, nyalin ari sistem siti ngagai siti, ngiga penerang ti sebaka.',
    ],
    options: [
      opt('under_5', 'Under 5', 'Bawah 5', '5 小时以下', 'Baruh 5'),
      opt('5_15', '5–15', '5–15', '5–15 小时', '5–15'),
      opt('16_40', '16–40', '16–40', '16–40 小时', '16–40'),
      opt('41_100', '41–100', '41–100', '41–100 小时', '41–100'),
      opt('over_100', 'More than 100', 'Lebih 100', '超过 100 小时', 'Lebih ari 100'),
    ],
  },
  {
    id: 'bottleneck',
    section: 'operations',
    type: 'multi',
    maxSelect: 2,
    text: [
      'When things slow down, where does it usually jam?',
      'Bila kerja perlahan, di mana biasanya tersekat?',
      '流程变慢时，通常卡在哪里？',
      'Lebuh pengawa lubah, ba ni ti selalu tesekat?',
    ],
    help: ['Pick the two worst.', 'Pilih dua yang paling teruk.', '选出最严重的两项。', 'Pilih dua ti pemadu jai.'],
    options: [
      opt('sales', 'Getting enquiries in', 'Mendapatkan pertanyaan masuk', '拿不到询问', 'Ngambi tanya tama'),
      opt('response', 'Replying fast enough', 'Membalas dengan cukup cepat', '回复不够快', 'Nyaut enda lensat'),
      opt('quoting', 'Preparing quotes or proposals', 'Menyediakan sebut harga', '出报价或提案', 'Ngaga sebut rega'),
      opt('delivery', 'Actually delivering the work', 'Menyiapkan kerja itu sendiri', '实际交付工作', 'Ngemetulka pengawa nya empu'),
      opt('collection', 'Getting paid', 'Mendapat bayaran', '收款', 'Ngambi duit bayar'),
      opt('admin', 'Paperwork and admin', 'Kertas kerja dan pentadbiran', '文书与行政', 'Kertas kerja enggau admin'),
      opt('people', 'Not enough of the right people', 'Kekurangan orang yang sesuai', '缺合适的人手', 'Kurang orang ti kena'),
      opt('owner', 'Everything waits for me', 'Semuanya menunggu saya', '什么都等我', 'Semua utai nganti aku'),
    ],
  },
  {
    id: 'quote_days',
    section: 'operations',
    type: 'segmented',
    showFor: ['owner', 'executive'],
    text: [
      "From enquiry to a quote in the customer's hands — how long?",
      'Dari pertanyaan hingga sebut harga sampai ke tangan pelanggan — berapa lama?',
      '从询问到客户拿到报价，通常多久？',
      'Ari tanya datai ngagai sebut rega ba jari pelanggan — berapa lama?',
    ],
    options: [
      opt('same_day', 'Same day', 'Hari yang sama', '当天', 'Hari nya mega'),
      opt('1_2_days', '1–2 days', '1–2 hari', '1–2 天', '1–2 hari'),
      opt('3_5_days', '3–5 days', '3–5 hari', '3–5 天', '3–5 hari'),
      opt('1_2_weeks', '1–2 weeks', '1–2 minggu', '1–2 周', '1–2 minggu'),
      opt('longer', 'Longer', 'Lebih lama', '更久', 'Lama agi'),
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
      '一周有多少小时花在只有您能做的事上？',
      'Berapa jam seminggu ba pengawa ti semina nuan aja ulih ngaga?',
    ],
    options: [
      opt('under_5', 'Under 5', 'Bawah 5', '5 小时以下', 'Baruh 5'),
      opt('5_15', '5–15', '5–15', '5–15 小时', '5–15'),
      opt('16_30', '16–30', '16–30', '16–30 小时', '16–30'),
      opt('over_30', 'More than 30', 'Lebih 30', '超过 30 小时', 'Lebih ari 30'),
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
      '以下哪些是公司真的有在用的？',
      'Ari utai tu, ni ti bendar dikena dagang nuan?',
    ],
    options: [
      opt('website', 'A website', 'Laman web', '网站', 'Laman web'),
      opt('gbp', 'Google Business Profile', 'Profil Perniagaan Google', 'Google 商家档案', 'Profil Dagang Google'),
      opt('facebook', 'Facebook page', 'Halaman Facebook', 'Facebook 专页', 'Laman Facebook'),
      opt('instagram', 'Instagram', 'Instagram', 'Instagram', 'Instagram'),
      opt('tiktok', 'TikTok', 'TikTok', 'TikTok', 'TikTok'),
      opt('linkedin', 'LinkedIn', 'LinkedIn', 'LinkedIn', 'LinkedIn'),
      opt('whatsapp_biz', 'WhatsApp Business', 'WhatsApp Business', 'WhatsApp Business', 'WhatsApp Business'),
      opt('marketplace', 'Shopee / Lazada / delivery listing', 'Penyenaraian Shopee / Lazada', 'Shopee / Lazada / 外送上架', 'Senarai Shopee / Lazada'),
    ],
  },
  {
    id: 'findability',
    section: 'digital',
    type: 'scale',
    text: [
      'If someone nearby searched online for what you sell, would they find you?',
      'Jika seseorang berdekatan mencari apa yang anda jual dalam talian, adakah mereka jumpa anda?',
      '附近的人上网搜您卖的东西，找得到您吗？',
      'Enti orang semak ngiga utai ti dijual nuan ba internet, ulih sida nemu nuan?',
    ],
    scale: {
      min: 1,
      max: 5,
      minLabel: ['No chance', 'Tiada peluang', '完全找不到', 'Nadai peluang'],
      maxLabel: ["They'd find us first", 'Kami yang pertama dijumpai', '我们排最前面', 'Kami ti keterubah ditemu'],
    },
  },

  // ── ai ─────────────────────────────────────────────────────────────────────
  {
    id: 'ai_usage',
    section: 'ai',
    type: 'single',
    text: [
      'Where are you with AI right now?',
      'Di mana kedudukan anda dengan AI sekarang?',
      '目前您在 AI 上走到哪一步？',
      'Ba ni pengawa nuan enggau AI diatu?',
    ],
    options: [
      opt('none', "Haven't touched it", 'Belum menyentuhnya', '完全没碰过', 'Apin ninggang nya'),
      opt('personal', 'I use it personally, not in the business', 'Saya guna secara peribadi sahaja', '只是个人在用，公司没用', 'Aku ngena nya kediri, ukai ba dagang'),
      opt('scattered', 'A few people use it, nothing organised', 'Beberapa orang guna, tiada yang tersusun', '少数人在用，没有章法', 'Sekeda orang ngena, nadai diatur'),
      opt('some_process', "It's built into one or two real processes", 'Ia sebahagian daripada satu dua proses sebenar', '已嵌入一两个实际流程', 'Udah tama ba siti dua pengawa amat'),
      opt('core', 'It runs core parts of what we do', 'Ia menjalankan bahagian teras kerja kami', '核心业务靠它运作', 'Nya ti ngatur pengawa besai kami'),
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
      '真正阻碍您做更多的是什么？',
      'Nama ti bendar nagang nuan ari ngereja mayuh agi?',
    ],
    help: ['Pick up to two.', 'Pilih sehingga dua.', '最多选两项。', 'Pilih sampai dua.'],
    options: [
      opt('dont_know_where', "I don't know where it would even apply", 'Saya tidak tahu di mana ia boleh digunakan', '不知道能用在哪', 'Aku enda nemu ba ni nya ulih dikena'),
      opt('no_time', 'No time to work it out', 'Tiada masa untuk memikirkannya', '没时间研究', 'Nadai jam ngachar nya'),
      opt('cost', 'Worried about the cost', 'Bimbang tentang kos', '担心成本', 'Kelalu ingatka rega'),
      opt('trust', "Don't trust the output", 'Tidak percaya hasilnya', '不信任它的输出', 'Enda arapka pengawa nya'),
      opt('skills', 'Nobody here knows how', 'Tiada sesiapa di sini tahu caranya', '没人会用', 'Nadai orang ditu nemu chara'),
      opt('data', 'Our information is too messy', 'Maklumat kami terlalu bersepah', '资料太乱', 'Penerang kami kelalu kachau'),
      opt('tried_failed', "We tried and it didn't stick", 'Kami pernah cuba tetapi tidak berjaya', '试过但没坚持下来', 'Kami udah nguji tang nadai lantang'),
      opt('nothing', "Nothing — we're moving on it", 'Tiada — kami sedang bergerak', '没有阻碍，我们正在推进', 'Nadai — kami benung bejalai'),
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
      '以下哪些您手上有，却几乎没用起来？',
      'Ari utai tu, ni ti bisi ba nuan tang nadai bendar dikena?',
    ],
    options: [
      opt('customer_data', 'Years of customer records', 'Rekod pelanggan bertahun-tahun', '多年的客户记录', 'Rekod pelanggan mayuh taun'),
      opt('expertise', "Deep know-how in someone's head", 'Kepakaran dalam kepala seseorang', '藏在某人脑里的专业', 'Penemu dalam pala siku orang'),
      opt('audience', 'A following or mailing list', 'Pengikut atau senarai e-mel', '粉丝或邮件名单', 'Orang ti nitihka tauka senarai e-mel'),
      opt('content', 'Photos, videos, written material', 'Gambar, video, bahan bertulis', '照片、影片、文字素材', 'Gambar, video, utai ti ditulis'),
      opt('process', 'A way of working better than the norm', 'Cara bekerja yang lebih baik daripada biasa', '比同行更好的做法', 'Chara bekereja ti manah agi ari ti biasa'),
      opt('equipment', 'Equipment or space with spare capacity', 'Peralatan atau ruang yang masih lapang', '仍有余裕的设备或场地', 'Peralatan tauka endur ti agi lapang'),
      opt('supplier', 'Supplier or partner relationships', 'Hubungan pembekal atau rakan kongsi', '供应商或伙伴关系', 'Kaul enggau pembekal tauka rakan'),
      opt('brand', 'A name people already trust', 'Nama yang sudah dipercayai orang', '已经被信任的品牌', 'Nama ti udah diarapka orang'),
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
      '如果今天要动手解决最大的问题，您能直接拍板吗？',
      'Enti nuan mutus sehari tu deka mbaik utai ti pemadu besai, ulih nuan terus mutus?',
    ],
    options: [
      opt('yes_alone', "Yes, it's my call", 'Ya, ia keputusan saya', '可以，我说了算', 'Wai, nya keputusan aku'),
      opt('yes_with_partner', 'Yes, with one other person', 'Ya, bersama seorang lagi', '可以，需和一人商量', 'Wai, enggau siku agi'),
      opt('board', 'Needs board or family agreement', 'Perlu persetujuan lembaga atau keluarga', '需董事会或家族同意', 'Perlu setuju ari lembaga tauka ruma bilik'),
      opt('no', 'Not my decision', 'Bukan keputusan saya', '不是我能决定的', 'Ukai keputusan aku'),
    ],
  },
  {
    id: 'decision_authority_exec',
    section: 'decision',
    type: 'segmented',
    showFor: ['executive'],
    text: [
      'How would a decision like this get made?',
      'Bagaimana keputusan seperti ini dibuat?',
      '这类决定通常怎么产生？',
      'Baka ni keputusan macham tu digaga?',
    ],
    options: [
      opt('my_budget', 'I have budget for it', 'Saya ada bajet untuknya', '我有预算', 'Aku bisi bajet kena nya'),
      opt('recommend', "I'd recommend, someone else approves", 'Saya cadangkan, orang lain luluskan', '我建议，别人批准', 'Aku bejaku, orang bukai nerima'),
      opt('committee', 'Committee or procurement process', 'Jawatankuasa atau proses perolehan', '委员会或采购流程', 'Jawatankuasa tauka proses meli'),
      opt('unclear', 'Genuinely unclear', 'Tidak jelas', '说不清楚', 'Amat enda terang'),
    ],
  },
  {
    id: 'timeline',
    section: 'decision',
    type: 'segmented',
    text: [
      'If the numbers made sense, when would you want something working?',
      'Jika angkanya masuk akal, bila anda mahu sesuatu berfungsi?',
      '如果数字说得通，您希望什么时候有东西跑起来？',
      'Enti nembiak angka nya kena, kemaya nuan deka utai nya bejalai?',
    ],
    options: [
      opt('this_month', 'This month', 'Bulan ini', '这个月', 'Bulan tu'),
      opt('this_quarter', 'This quarter', 'Suku tahun ini', '这一季', 'Suku taun tu'),
      opt('this_year', 'Sometime this year', 'Dalam tahun ini', '今年内', 'Dalam taun tu'),
      opt('exploring', 'Just exploring for now', 'Sekadar meninjau buat masa ini', '目前只是了解', 'Baru ngintai aja diatu'),
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
