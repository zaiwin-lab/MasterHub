import type { L, Lang } from '../types';

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'bm', label: 'BM' },
  { code: 'zh', label: '中' },
  { code: 'ib', label: 'IB' },
];

const INDEX: Record<Lang, number> = { en: 0, bm: 1, zh: 2, ib: 3 };

/** Resolve an [en, bm, zh, ib] tuple. A missing cell falls back to English
 *  rather than rendering blank — the same rule the FAME build uses. */
export function t(pair: L | undefined, lang: Lang): string {
  if (!pair) return '';
  return pair[INDEX[lang]] || pair[0];
}

export const UI = {
  brand: ['Bring AI To My Biz', 'Bawa AI Ke Perniagaan Saya', '把 AI 带进我的生意', 'Bai AI Ngagai Dagang Aku'] as L,
  brandShort: ['AI Readiness Scan', 'Imbasan Kesediaan AI', 'AI 就绪评估', 'Imbas Sedia AI'] as L,
  convenor: ['A KOBIS Berhad practice', 'Sebuah amalan KOBIS Berhad', 'KOBIS Berhad 旗下业务', 'Pengawa KOBIS Berhad'] as L,

  // ── Intro. MVP³ is deliberately not named here; it is revealed on the
  //    Snapshot, once the respondent has something to attach it to.
  heroBadge: ['Free AI readiness scan', 'Imbasan kesediaan AI percuma', '免费 AI 就绪评估', 'Imbas sedia AI percuma'] as L,
  heroKicker: ['Free · 8 minutes · Instant result', 'Percuma · 8 minit · Keputusan segera', '免费 · 8 分钟 · 即时结果', 'Percuma · 8 minit · Asil tekala nya'] as L,
  heroTitle: [
    'AI is rewriting who wins in your market.',
    'AI sedang menulis semula siapa menang dalam pasaran anda.',
    'AI 正在改写你的市场由谁胜出。',
    'AI benung nulis baru sapa menang ba pasar nuan.',
  ] as L,
  heroTitleAccent: ['Right now.', 'Sekarang juga.', '就在现在。', 'Diatu tu mega.'] as L,
  heroSub: [
    'Not in five years. This quarter. And the operators moving fastest are not the biggest — they are the ones who stopped waiting. Eight minutes tells you exactly where your business stands, what standing still costs you every month, and the first three things to do about it.',
    'Bukan lima tahun lagi. Suku tahun ini. Dan pengendali yang bergerak paling laju bukan yang terbesar — tetapi yang berhenti menunggu. Lapan minit memberitahu anda dengan tepat di mana kedudukan perniagaan anda, berapa kos berdiam diri setiap bulan, dan tiga perkara pertama yang perlu dilakukan.',
    '不是五年后，是这一季。跑得最快的不是最大的公司，而是最先不再等待的人。八分钟，你就会知道自己的生意站在哪里、原地不动每个月花掉多少钱，以及最先该做的三件事。',
    'Ukai lima taun agi. Suku taun tu. Lalu orang ti pemadu lensat bejalai ukai ti pemadu besai — tang sida ti udah badu nganti. Lapan minit deka madah ngagai nuan ba ni dagang nuan bediri, berapa rega diau enda bekereja tiap bulan, enggau tiga utai ti patut dikereja dulu.',
  ] as L,
  start: ['Show me where I stand', 'Tunjukkan kedudukan saya', '看看我的位置', 'Padah ba ni aku bediri'] as L,
  resume: ['Continue where you left off', 'Sambung dari tempat anda berhenti', '继续上次的进度', 'Neruska ari endur nuan badu'] as L,
  resumeAt: ['{n} answered', '{n} dijawab', '已回答 {n} 题', '{n} udah disaut'] as L,
  startOver: ['Start again', 'Mula semula', '重新开始', 'Belabuh baru'] as L,
  trustLine: [
    'No signup to see your result · Nothing shared with anyone · Free',
    'Tiada pendaftaran · Tiada perkongsian · Percuma',
    '无需注册即可查看结果 · 不外传 · 免费',
    'Nadai daftar kena meda asil · Nadai dibagi · Percuma',
  ] as L,

  proofBadge: ['The evidence', 'Buktinya', '实证', 'Bukti'] as L,
  proofTitle: ['The shift already happened', 'Peralihan itu sudah berlaku', '转变已经发生', 'Peruban nya udah nyadi'] as L,
  proofSub: [
    'These are not predictions. They are what has already been measured.',
    'Ini bukan ramalan. Ini yang sudah diukur.',
    '这不是预测，而是已经被测量出来的事实。',
    'Tu ukai telah. Tu utai ti udah diukur.',
  ] as L,
  proofClose: [
    'Most owners read numbers like these and do nothing, because none of them say what to do on Monday morning. This one does.',
    'Kebanyakan pemilik membaca angka begini dan tidak berbuat apa-apa, kerana tiada satu pun memberitahu apa yang perlu dibuat pagi Isnin. Yang ini memberitahunya.',
    '大多数老板看完这些数字就没有下文，因为它们都没告诉你周一早上该做什么。这一个会。',
    'Mayuh tuan dagang macha angka baka tu lalu nadai ngereja nama, laban nadai siti madahka nama ti patut dikereja pagi Senin. Tu madahka nya.',
  ] as L,
  sourceLabel: ['Source', 'Sumber', '来源', 'Pun'] as L,

  shiftBadge: ['Your market', 'Pasaran anda', '你的市场', 'Pasar nuan'] as L,
  shiftTitle: [
    'What is actually happening in your market',
    'Apa yang sebenarnya berlaku dalam pasaran anda',
    '你的市场里正在发生什么',
    'Nama ti bendar nyadi ba pasar nuan',
  ] as L,
  shiftBlocks: [
    [
      [
        'Someone younger is quoting in minutes',
        'Ada yang lebih muda memberi sebut harga dalam beberapa minit',
        '更年轻的对手几分钟就报出价',
        'Orang ti biak agi meri sebut rega dalam sekeda minit',
      ],
      [
        'They are not better than you. They have no more experience, no better suppliers and no deeper pockets. They simply reply while the customer is still deciding, and quote before the urgency cools. Speed is beating expertise, and it is beating it quietly.',
        'Mereka bukan lebih baik daripada anda. Pengalaman tidak lebih, pembekal tidak lebih baik, modal tidak lebih besar. Mereka cuma membalas semasa pelanggan masih membuat keputusan, dan memberi sebut harga sebelum desakan reda. Kelajuan sedang mengalahkan kepakaran, dan ia berlaku secara senyap.',
        '他们并不比你强：经验不比你多，供应商不比你好，资金也不比你厚。他们只是在客户还在犹豫时就回复，在急迫感消退前就报价。速度正在悄悄打败经验。',
        'Sida ukai manah agi ari nuan. Nadai mayuh agi pengalaman, nadai manah agi pembekal, nadai besai agi modal. Sida semina nyaut lebuh pelanggan agi bepikir, lalu meri rega sebedau ati sida lubah. Pengelensat benung ngalahka penemu, sereta nya nyadi enggau chelap.',
      ],
    ],
    [
      [
        'A younger buyer decides before they ever speak to you',
        'Pembeli lebih muda membuat keputusan sebelum bercakap dengan anda',
        '年轻买家在联系你之前就已决定',
        'Pembeli ti biak agi udah mutus sebedau bejaku enggau nuan',
      ],
      [
        'Millennial and Gen Z buyers now run most of the purchasing in Malaysian businesses. They search, compare and shortlist before any human is involved. If your offer is not findable and not instantly answerable, you are not losing the pitch — you are never in it.',
        'Pembeli Milenial dan Gen Z kini menguruskan sebahagian besar pembelian dalam perniagaan Malaysia. Mereka mencari, membandingkan dan menyenarai pendek sebelum sebarang manusia terlibat. Jika tawaran anda tidak dapat dijumpai dan tidak boleh dijawab segera, anda bukan kalah dalam pertandingan — anda tidak pernah masuk pun.',
        '千禧世代与 Z 世代如今掌握马来西亚企业大部分采购决策。他们在接触任何人之前，就已经搜索、比较、筛选完毕。如果你的产品搜不到、问不到即时答复，你不是输掉了机会——你根本没进入名单。',
        'Pembeli Milenial enggau Gen Z diatu ti ngatur mayuh pemeli dalam dagang Malaysia. Sida ngiga, banding lalu milih sebedau bekaul enggau mensia. Enti utai ti dijual nuan enda ulih ditemu lalu enda ulih disaut tekala nya, nuan ukai kalah — nuan nadai tama dalam senarai.',
      ],
    ],
    [
      [
        'Your experience is the asset. It is just not working hard enough',
        'Pengalaman anda ialah asetnya. Cuma ia belum bekerja cukup kuat',
        '你的经验才是资产，只是它还没够卖力',
        'Pengalaman nuan nya aset. Semina nya apin bekereja kering agi',
      ],
      [
        'Twenty years of judgement is something no newcomer can download. But right now that judgement sits in one head, answers one enquiry at a time, and stops entirely when you take a week off. Put AI underneath it and the same judgement answers every enquiry, at any hour, in your voice.',
        'Dua puluh tahun pertimbangan ialah sesuatu yang tidak boleh dimuat turun oleh pendatang baharu. Tetapi kini pertimbangan itu berada dalam satu kepala, menjawab satu pertanyaan pada satu masa, dan terhenti sepenuhnya bila anda bercuti seminggu. Letakkan AI di bawahnya dan pertimbangan yang sama menjawab setiap pertanyaan, pada bila-bila masa, dalam suara anda.',
        '二十年的判断力，是任何新手都下载不来的。但现在它只装在一个人脑袋里，一次只能回一个询问，你休假一周它就完全停摆。把 AI 垫在下面，同一份判断力就能全天候、用你的口吻回复每一个询问。',
        'Dua puluh taun penemu ti dalam ukai utai ti ulih diambi orang baru. Tang diatu penemu nya diau dalam siti pala, nyaut siti tanya sekali, lalu badu magang lebuh nuan cuti seminggu. Engkah AI ba baruh nya, lalu penemu ti sebaka nya nyaut tiap tanya, sepemanjai jam, dalam nyawa nuan empu.',
      ],
    ],
  ] as [L, L][],

  servantBadge: ['The reframe', 'Sudut pandang baharu', '换个角度', 'Chara meda ti baru'] as L,
  servantTitle: ['AI works for you. Not the other way round.', 'AI bekerja untuk anda. Bukan sebaliknya.', 'AI 为你打工，不是你为它打工。', 'AI bekereja ke nuan. Ukai nuan bekereja ke iya.'] as L,
  servantBody: [
    'You are not here to learn a tool. You are here to run a business that answers faster, quotes faster, and stops leaking. AI is the thing underneath that — the operator that never sleeps, never forgets and never gets bored of the tenth identical enquiry. Your job stays what it always was: knowing what is worth doing.',
    'Anda bukan di sini untuk belajar sesuatu alat. Anda di sini untuk mengendalikan perniagaan yang membalas lebih pantas, memberi sebut harga lebih pantas, dan berhenti bocor. AI ialah lapisan di bawahnya — pengendali yang tidak pernah tidur, tidak pernah lupa dan tidak pernah jemu dengan pertanyaan kesepuluh yang serupa. Tugas anda kekal seperti dahulu: tahu apa yang berbaloi dilakukan.',
    '你不是来学一个工具的。你是来经营一门回复更快、报价更快、不再漏钱的生意。AI 只是垫在底下的那层——不睡觉、不健忘、第十次回答同样的问题也不会不耐烦。你的工作还是老样子：判断什么值得做。',
    'Nuan ukai datai kena belajar siti alat. Nuan datai kena ngatur dagang ti nyaut lensat agi, meri rega lensat agi, lalu badu bechuchur. AI nya lapis ba baruh — pengatur ti nadai tinduk, nadai enda ingat, lalu nadai lelak nyaut tanya ti kesepuluh ti sebaka. Pengawa nuan tetap baka ke suba: nemu nama ti berega dikereja.',
  ] as L,
  servantPoints: [
    ['Answers every enquiry in under a minute, day or night', 'Menjawab setiap pertanyaan dalam seminit, siang atau malam', '全天候一分钟内回复每一个询问', 'Nyaut tiap tanya dalam seminit, siang tauka malam'],
    ['Turns a two-day quote into a two-minute one', 'Menukar sebut harga dua hari kepada dua minit', '把两天的报价变成两分钟', 'Nukar sebut rega dua hari nyadi dua minit'],
    ['Takes the repeat admin off your team entirely', 'Mengambil alih kerja pentadbiran berulang daripada pasukan anda', '把重复的行政工作完全接走', 'Ngambi semua pengawa admin ti belalauka diri ari pasukan nuan'],
    ['Makes what you know findable by people already searching', 'Menjadikan apa yang anda tahu boleh dijumpai', '让正在搜索的人找得到你的专业', 'Ngasuh penemu nuan ulih ditemu orang ti benung ngiga'],
  ] as L[],

  leaksBadge: ['The six leaks', 'Enam kebocoran', '六个漏点', 'Enam pengechuchur'] as L,
  leaksTitle: [
    'Six places money leaves a business quietly',
    'Enam tempat wang keluar dari perniagaan secara senyap',
    '钱悄悄流走的六个地方',
    'Enam endur duit pansut ari dagang enggau chelap',
  ] as L,
  leaksSub: [
    'We have never scanned a business with none of them. Most have four.',
    'Kami belum pernah mengimbas perniagaan yang tiada satu pun. Kebanyakannya ada empat.',
    '我们没扫描过一家一个都没有的公司。大多数有四个。',
    'Kami apin ngimbas dagang ti nadai siti pen. Mayuh sida bisi empat.',
  ] as L,

  getBadge: ['What you get', 'Apa yang anda dapat', '你会拿到什么', 'Nama ti diulih nuan'] as L,
  whatYouGet: ['What you get in eight minutes', 'Apa yang anda dapat dalam lapan minit', '八分钟你会拿到什么', 'Nama ti diulih nuan dalam lapan minit'] as L,
  getList: [
    ['A score for where your business actually stands', 'Skor untuk kedudukan sebenar perniagaan anda', '一个真实反映现况的分数', 'Skor ba endur dagang nuan bendar bediri'],
    ['Your top three leaks, in ringgit per month', 'Tiga kebocoran utama anda, dalam ringgit sebulan', '前三大漏点，以每月令吉计', 'Tiga pengechuchur ti pemadu besai, ringgit sebulan'],
    ['What the next 90 days cost if nothing changes', 'Kos 90 hari akan datang jika tiada perubahan', '若不改变，未来 90 天的代价', 'Rega 90 hari ti datai enti nadai peruban'],
    ['Three fixes you can do yourself this week, free', 'Tiga pembetulan yang anda boleh buat sendiri minggu ini, percuma', '本周你自己就能动手的三件事，免费', 'Tiga utai ti ulih dibaik nuan empu minggu tu, percuma'],
    ['The one AI move that moves the most money first', 'Satu langkah AI yang menggerakkan paling banyak wang dahulu', '最先能带来最多回报的那一步 AI', 'Siti langkah AI ti mai duit pemadu mayuh dulu'],
    ['One product opportunity already inside your business', 'Satu peluang produk yang sudah ada dalam perniagaan anda', '你生意里已经存在的一个产品机会', 'Siti peluang produk ti udah bisi dalam dagang nuan'],
  ] as L[],

  whoBadge: ['About', 'Tentang', '关于', 'Pasal'] as L,
  whoTitle: ['Who is behind this', 'Siapa di sebalik ini', '谁在做这件事', 'Sapa ba belakang tu'] as L,
  whoBody: [
    'Ts. Zaiwin Kassim, MBA — AI product strategist, and the lead of KAPT, the KOBIS AI Prodigy Team. We build working AI systems for Malaysian businesses: not strategy decks, not pilots, but things that run. This scan is the same diagnostic we run at the start of every engagement.',
    'Ts. Zaiwin Kassim, MBA — ahli strategi produk AI, dan ketua KAPT, KOBIS AI Prodigy Team. Kami membina sistem AI yang berfungsi untuk perniagaan Malaysia: bukan slaid strategi, bukan projek perintis, tetapi sesuatu yang benar-benar berjalan. Imbasan ini ialah diagnostik yang sama kami jalankan pada permulaan setiap penglibatan.',
    'Ts. Zaiwin Kassim, MBA — AI 产品策略师，KAPT（KOBIS AI Prodigy Team）负责人。我们为马来西亚企业打造真正跑得起来的 AI 系统：不是策略简报，不是试点，而是能运作的东西。这份评估，就是我们每次合作开始时所做的同一套诊断。',
    'Ts. Zaiwin Kassim, MBA — ahli strategi produk AI, sereta tuai KAPT, KOBIS AI Prodigy Team. Kami ngaga sistem AI ti bekereja ke dagang Malaysia: ukai slaid strategi, ukai projek nguji, tang utai ti amat bejalai. Imbas tu nya diagnostik ti sebaka ti dikereja kami ba pun tiap pengawa.',
  ] as L,
  finalTitle: ['Eight minutes. Then you will know.', 'Lapan minit. Kemudian anda akan tahu.', '八分钟，然后你就知道了。', 'Lapan minit. Udah nya nuan deka nemu.'] as L,
  finalSub: [
    'Where you stand, what it is costing you, and what to do first.',
    'Di mana kedudukan anda, berapa kosnya, dan apa yang perlu dibuat dahulu.',
    '你站在哪里、代价是多少、先做什么。',
    'Ba ni nuan bediri, berapa rega nya, enggau nama ti dikereja dulu.',
  ] as L,

  // ── Consent
  consentTitle: ['Before we start', 'Sebelum kita mula', '开始之前', 'Sebedau kitai belabuh'] as L,
  consentBody: [
    'Your answers stay in this browser until you choose to save them. We store no sensitive personal data. KOBIS Berhad is the data controller, and you can ask us to delete your response at any time.',
    'Jawapan anda kekal dalam pelayar ini sehingga anda memilih untuk menyimpannya. Kami tidak menyimpan data peribadi sensitif. KOBIS Berhad ialah pengawal data, dan anda boleh minta kami memadam maklum balas anda pada bila-bila masa.',
    '在您选择保存之前，答案只留在这个浏览器里。我们不存储敏感个人资料。KOBIS Berhad 为数据控管方，您随时可要求删除您的回复。',
    'Saut nuan diau dalam pelayar tu datai ke nuan milih nyimpan iya. Kami nadai nyimpan data diri ti sensitif. KOBIS Berhad ti ngintu data, lalu nuan ulih minta kami muai saut nuan kemaya-maya.',
  ] as L,
  consentResearch: [
    'Use my answers anonymously in aggregate research on Malaysian business readiness.',
    'Guna jawapan saya secara tanpa nama dalam penyelidikan agregat tentang kesediaan perniagaan Malaysia.',
    '可将我的答案匿名用于马来西亚企业就绪度的整体研究。',
    'Kena saut aku enggau nadai nama dalam kaji pasal pengesedia dagang Malaysia.',
  ] as L,
  consentEmail: [
    'Email me a copy of my Snapshot when it is ready.',
    'E-melkan saya salinan Snapshot saya apabila ia siap.',
    '报告完成后用电邮寄一份给我。',
    'Kirumka e-mel salin Snapshot aku lebuh nya udah tembu.',
  ] as L,
  consentComms: [
    'You may contact me about what the Snapshot finds. Optional, and genuinely optional.',
    'Anda boleh hubungi saya tentang penemuan Snapshot. Pilihan, dan ia benar-benar pilihan.',
    '可以就报告结果联系我。这是选填，而且真的是选填。',
    'Kita ulih bekaul enggau aku pasal utai ti ditemu Snapshot. Pilih, sereta amat pilih.',
  ] as L,
  consentContinue: ['I understand — continue', 'Saya faham — teruskan', '我明白 — 继续', 'Aku meretika — terus'] as L,

  // ── Respondent
  whoAreYou: ['Which of these sounds most like you?', 'Antara berikut, mana paling menyerupai anda?', '哪一个最像你？', 'Ari tu, ni ti pemadu baka nuan?'] as L,
  owner: ['I own or lead this business', 'Saya memiliki atau mengetuai perniagaan ini', '我拥有或领导这门生意', 'Aku ti bempu tauka nuai dagang tu'] as L,
  ownerNote: ['Established business, owner-operator', 'Perniagaan sedia ada, pemilik-pengendali', '已在营运的企业，业主经营', 'Dagang ti udah bejalai, tuan ti ngatur'] as L,
  executive: ['I manage a function or department', 'Saya menguruskan fungsi atau jabatan', '我负责一个部门或职能', 'Aku ngatur siti bagi tauka jabatan'] as L,
  executiveNote: ['Corporate, GLC, agency or statutory body', 'Korporat, GLC, agensi atau badan berkanun', '企业、官联公司、机构或法定机构', 'Korporat, GLC, agensi tauka badan berkanun'] as L,
  founder: ["I'm starting something new", 'Saya sedang memulakan sesuatu yang baharu', '我正在开始新的东西', 'Aku benung ngentapka utai baru'] as L,
  founderNote: ['Pre-revenue or under 12 months old', 'Belum ada hasil atau bawah 12 bulan', '尚无营收或成立不到 12 个月', 'Apin bisi pemansang tauka baruh 12 bulan'] as L,

  // ── Survey chrome
  question: ['Question', 'Soalan', '题目', 'Tanya'] as L,
  of: ['of', 'daripada', '/', 'ari'] as L,
  back: ['Back', 'Kembali', '返回', 'Pulai'] as L,
  next: ['Next', 'Seterusnya', '下一题', 'Terus'] as L,
  notSure: ['Not sure', 'Tidak pasti', '不确定', 'Enda pasti'] as L,
  decline: ['Prefer not to say', 'Tidak mahu nyatakan', '不想透露', 'Enda deka madah'] as L,
  selectUpTo: ['Choose up to {n}', 'Pilih sehingga {n}', '最多选 {n} 项', 'Pilih sampai {n}'] as L,
  slideToSet: ['Slide to set', 'Luncurkan untuk tetapkan', '滑动选择', 'Luncur kena netapka'] as L,
  autosaved: ['Saved on this device', 'Disimpan pada peranti ini', '已存在此设备', 'Udah disimpan ba alat tu'] as L,

  // ── Magic box
  mbTitle: ['Paste your links, all at once', 'Tampal pautan anda, semuanya sekali', '一次贴上所有链接', 'Tampal semua pautan nuan sekali'] as L,
  mbBody: [
    'Website, Facebook, Instagram, Google listing, Shopee — any format, any order. We will sort them out.',
    'Laman web, Facebook, Instagram, senarai Google, Shopee — apa-apa format, apa-apa susunan. Kami akan menyusunnya.',
    '网站、Facebook、Instagram、Google 商家、Shopee — 任何格式、任何顺序，我们来整理。',
    'Laman web, Facebook, Instagram, senarai Google, Shopee — sebarang chara, sebarang atur. Kami deka nyusun iya.',
  ] as L,
  mbPlaceholder: [
    'facebook.com/yourbusiness\nyourbusiness.com.my\n@yourhandle',
    'facebook.com/perniagaananda\nperniagaananda.com.my\n@handleanda',
    'facebook.com/yourbusiness\nyourbusiness.com.my\n@yourhandle',
    'facebook.com/dagangnuan\ndagangnuan.com.my\n@handlenuan',
  ] as L,
  mbDetect: ['Sort these out', 'Susun semua ini', '帮我整理', 'Susun semua tu'] as L,
  mbFound: ['Found {n}', 'Dijumpai {n}', '找到 {n} 个', 'Ditemu {n}'] as L,
  mbRemove: ['Remove', 'Buang', '移除', 'Buai'] as L,
  mbSkip: ['I do not have any', 'Saya tiada satu pun', '我一个都没有', 'Aku nadai siti pen'] as L,
  mbDeclared: [
    'Recorded as declared. We cannot open these from a browser, so nothing here is verified.',
    'Direkodkan sebagai diisytiharkan. Kami tidak boleh membukanya dari pelayar, jadi tiada apa di sini disahkan.',
    '仅记录为「你告知的内容」。浏览器无法打开这些链接，所以此处没有任何一项经过核实。',
    'Direkod baka ti dipadah. Kami enda ulih muka tu ari pelayar, nya alai nadai siti ditentuka.',
  ] as L,
  ctxDescription: ['What does the business do, in your own words?', 'Apa yang perniagaan ini buat, dalam kata-kata anda?', '用你自己的话说，这门生意在做什么？', 'Nama pengawa dagang tu, dalam jaku nuan empu?'] as L,
  ctxCustomers: ['Who are your best customers?', 'Siapa pelanggan terbaik anda?', '你最好的客户是谁？', 'Sapa pelanggan ti pemadu manah?'] as L,
  ctxProud: [
    "Anything you're proud of that most people don't know about you?",
    'Apa-apa yang anda banggakan tetapi kebanyakan orang tidak tahu?',
    '有什么你引以为傲、但大多数人不知道的？',
    'Bisi utai ti dibangga nuan tang mayuh orang enda nemu?',
  ] as L,
  optional: ['Optional', 'Pilihan', '选填', 'Pilih'] as L,

  // ── Review
  reviewTitle: ['Ready when you are', 'Sedia bila anda sedia', '你准备好我们就开始', 'Sedia lebuh nuan sedia'] as L,
  reviewBody: [
    'That is everything. We will score nine dimensions, estimate what is leaking, and pick the one opportunity we think is hiding in your business.',
    'Itu sahaja. Kami akan menilai sembilan dimensi, menganggarkan apa yang bocor, dan memilih satu peluang yang kami fikir tersembunyi dalam perniagaan anda.',
    '就这些。我们会给九个维度打分、估算漏点，并挑出我们认为藏在你生意里的那个机会。',
    'Nya aja. Kami deka meri skor ba sembilan bagi, nganggar utai ti bechuchur, lalu milih siti peluang ti dipikir kami belalai dalam dagang nuan.',
  ] as L,
  reviewAnswered: ['{a} of {b} questions answered', '{a} daripada {b} soalan dijawab', '已回答 {a} / {b} 题', '{a} ari {b} tanya udah disaut'] as L,
  generate: ['Show me my Snapshot', 'Tunjukkan Snapshot saya', '生成我的报告', 'Padah Snapshot aku'] as L,

  // ── Processing
  proc1: ['Scoring nine dimensions', 'Menilai sembilan dimensi', '正在为九个维度评分', 'Meri skor ba sembilan bagi'] as L,
  proc2: ['Estimating leak exposure', 'Menganggarkan pendedahan kebocoran', '正在估算漏损', 'Nganggar pengechuchur'] as L,
  proc3: ['Selecting your MVP³ candidate', 'Memilih calon MVP³ anda', '正在挑选你的 MVP³ 机会', 'Milih calon MVP³ nuan'] as L,

  // ── Snapshot
  yourIndex: ['Your MVP³ Index', 'Indeks MVP³ Anda', '你的 MVP³ 指数', 'Indeks MVP³ Nuan'] as L,
  scoreKicker: ['Where your business stands', 'Kedudukan perniagaan anda', '你的生意站在哪里', 'Ba ni dagang nuan bediri'] as L,
  confidence: ['Confidence', 'Keyakinan', '置信度', 'Pengarap'] as L,
  confLow: ['low', 'rendah', '低', 'baruh'] as L,
  confModerate: ['moderate', 'sederhana', '中等', 'sederhana'] as L,
  confGood: ['good', 'baik', '高', 'manah'] as L,
  confWhy: [
    'Capped at moderate because nothing you submitted could be verified from a browser.',
    'Dihadkan pada sederhana kerana tiada apa yang anda hantar boleh disahkan dari pelayar.',
    '上限为中等，因为你提交的内容无法在浏览器中核实。',
    'Dihad ba sederhana laban nadai utai ti dikirum nuan ulih ditentuka ari pelayar.',
  ] as L,
  lenses: ['The three lenses', 'Tiga lensa', '三个镜头', 'Tiga lensa'] as L,
  buildReadiness: ['Build Readiness', 'Kesediaan Membina', '建造就绪度', 'Pengesedia Ngaga'] as L,
  hiddenPotential: ['Hidden Potential', 'Potensi Tersembunyi', '潜藏价值', 'Pengelandik Belalai'] as L,
  marketPull: ['Market Pull', 'Tarikan Pasaran', '市场拉力', 'Penarit Pasar'] as L,
  insufficient: ['Not enough answered', 'Tidak cukup dijawab', '回答不足', 'Enda cukup disaut'] as L,

  ledgerTitle: ['Your Leakage Ledger', 'Lejar Kebocoran Anda', '你的漏损账', 'Lejar Pengechuchur Nuan'] as L,
  ledgerSub: [
    'Estimated from what you told us. Every figure opens its own arithmetic.',
    'Dianggarkan daripada apa yang anda beritahu kami. Setiap angka membuka pengiraannya sendiri.',
    '根据你告诉我们的内容估算。每个数字都可展开它的算式。',
    'Dianggar ari utai ti dipadah nuan. Tiap angka ulih muka pengira iya empu.',
  ] as L,
  perMonth: ['/month', '/bulan', '/月', '/bulan'] as L,
  estimate: ['estimate', 'anggaran', '估算', 'anggar'] as L,
  opportunity: ['opportunity, not loss', 'peluang, bukan kerugian', '机会，非损失', 'peluang, ukai rugi'] as L,
  showWorkings: ['Show me how these were calculated', 'Tunjukkan cara ia dikira', '看看这些怎么算出来的', 'Padah baka ni tu dikira'] as L,
  hideWorkings: ['Hide the arithmetic', 'Sembunyikan pengiraan', '收起算式', 'Lalaika pengira'] as L,
  totalLeak: ['Estimated total, hard leaks only', 'Anggaran jumlah, kebocoran keras sahaja', '估算合计，仅计实质漏损', 'Anggar jumlah, semina pengechuchur amat'] as L,
  cappedNote: [
    'Capped at 35% of estimated monthly revenue, so the figure stays defensible.',
    'Dihadkan pada 35% daripada anggaran hasil bulanan, supaya angka ini kekal munasabah.',
    '上限设为估算月营收的 35%，让数字站得住脚。',
    'Dihad ba 35% ari anggar pemansang sebulan, ngambika angka tu tau dikemataka.',
  ] as L,
  noFigure: [
    'You skipped the questions we need to put a ringgit figure on this, so we have not invented one. Here is what we can still say.',
    'Anda melangkau soalan yang kami perlukan untuk meletakkan angka ringgit, jadi kami tidak mereka-reka. Ini yang masih boleh kami nyatakan.',
    '你跳过了我们估算金额所需的题目，所以我们没有编造数字。以下是我们仍能说的。',
    'Nuan malutka tanya ti diguna kami kena ngaga angka ringgit, nya alai kami nadai ngaga-ngaga. Tu utai ti agi ulih dipadah kami.',
  ] as L,

  delayTitle: ['Cost of Delay', 'Kos Penangguhan', '拖延的代价', 'Rega Nunda'] as L,
  delayBody: [
    'If nothing changes, the next 90 days cost you approximately',
    'Jika tiada apa berubah, 90 hari akan datang menelan kos lebih kurang',
    '若什么都不变，未来 90 天大约会花掉你',
    'Enti nadai peruban, 90 hari ti datai deka makai kira-kira',
  ] as L,

  candidateTitle: ['Your MVP³ candidate', 'Calon MVP³ anda', '你的 MVP³ 机会', 'Calon MVP³ nuan'] as L,
  candidateSub: [
    'One product opportunity already sitting inside your operation.',
    'Satu peluang produk yang sudah ada dalam operasi anda.',
    '一个已经存在于你日常运作里的产品机会。',
    'Siti peluang produk ti udah bisi dalam pengawa nuan.',
  ] as L,
  buildWindow: ['Typical build window', 'Tempoh binaan biasa', '典型开发周期', 'Jangka ngaga ti biasa'] as L,

  firstSeven: ['The First 7', 'Tujuh Hari Pertama', '头七天', 'Tujuh Hari Keterubah'] as L,
  firstSevenSub: [
    'Three things you can do yourself this week. No one needs to be paid for these.',
    'Tiga perkara yang anda boleh buat sendiri minggu ini. Tiada siapa perlu dibayar untuk ini.',
    '本周你自己就能做的三件事，不必付钱给任何人。',
    'Tiga utai ti ulih dikereja nuan empu minggu tu. Nadai orang perlu dibayar.',
  ] as L,
  nextMoves: ['The Next 30 and 90', '30 dan 90 Hari Berikutnya', '接下来的 30 天与 90 天', '30 enggau 90 Hari Ti Datai'] as L,
  nextMovesSub: [
    'These need a partner. This is exactly what a Clarity Sprint covers.',
    'Ini memerlukan rakan kongsi. Inilah yang diliputi oleh Clarity Sprint.',
    '这些需要伙伴。这正是 Clarity Sprint 涵盖的范围。',
    'Tu ngguna rakan. Tu utai ti dikandung Clarity Sprint.',
  ] as L,

  // ── The MVP³ reveal. Held back until the respondent has a result to attach
  //    it to — the method means nothing before there is something to explain.
  revealKicker: ['What just happened', 'Apa yang baru berlaku', '刚刚发生了什么', 'Nama ti baru nyadi'] as L,
  revealTitle: ['You have just been through MVP³.', 'Anda baru sahaja melalui MVP³.', '你刚刚走完了一遍 MVP³。', 'Nuan baru udah nengah MVP³.'] as L,
  revealBody: [
    'MVP³ is the method behind everything above. It reads a business through three lenses at once — and it is the same method KAPT uses on paid engagements, run here on your own answers.',
    'MVP³ ialah kaedah di sebalik semua di atas. Ia membaca perniagaan melalui tiga lensa serentak — dan ia kaedah sama yang KAPT gunakan dalam penglibatan berbayar, dijalankan di sini pada jawapan anda sendiri.',
    'MVP³ 就是上面这一切背后的方法。它同时用三个镜头读一门生意 — 也正是 KAPT 在付费项目中使用的同一套方法，只是这里跑在你自己的答案上。',
    'MVP³ nya chara ba belakang semua utai ba atas. Iya macha dagang nengah tiga lensa serentak — sereta nya chara ti sebaka dikena KAPT ba pengawa bebayar, dijalai ditu ba saut nuan empu.',
  ] as L,
  revealLenses: [
    [
      ['Minimum Viable Product', 'Produk Minimum Berdaya Maju', '最小可行产品', 'Produk Mimit Ti Ulih Idup'],
      [
        'What can be built and tested now — your Build Readiness score.',
        'Apa yang boleh dibina dan diuji sekarang — skor Kesediaan Membina anda.',
        '现在就能做出来并测试的东西 — 你的建造就绪度分数。',
        'Nama ti ulih digaga sereta diuji diatu — skor Pengesedia Ngaga nuan.',
      ],
    ],
    [
      ['Most Valuable Potential', 'Potensi Paling Bernilai', '最有价值的潜力', 'Pengelandik Ti Pemadu Berega'],
      [
        'What is already here and unused — your Hidden Potential score, and every leak above.',
        'Apa yang sudah ada tetapi tidak digunakan — skor Potensi Tersembunyi anda, dan setiap kebocoran di atas.',
        '已经存在却没用起来的东西 — 你的潜藏价值分数，以及上面每一个漏点。',
        'Nama ti udah bisi tang nadai dikena — skor Pengelandik Belalai nuan, enggau tiap pengechuchur ba atas.',
      ],
    ],
    [
      ['Market Value Proposition', 'Proposisi Nilai Pasaran', '市场价值主张', 'Rega Ti Dipeda Pasar'],
      [
        'What the market will actually buy — your Market Pull score, and the candidate below.',
        'Apa yang pasaran benar-benar akan beli — skor Tarikan Pasaran anda, dan calon di bawah.',
        '市场真正会买单的东西 — 你的市场拉力分数，以及下面那个机会。',
        'Nama ti amat deka dibeli pasar — skor Penarit Pasar nuan, enggau calon ba baruh.',
      ],
    ],
  ] as [L, L][],
  revealClose: [
    'Every business has an untapped MVP. Yours has a number attached to it now.',
    'Setiap perniagaan ada MVP yang belum digali. Milik anda kini ada angkanya.',
    '每一门生意都有一个尚未挖掘的 MVP。你的，现在有了数字。',
    'Tiap dagang bisi MVP ti apin dikeruh. Ti nuan diatu udah bisi angka iya.',
  ] as L,

  honestyTitle: ['How to read this report', 'Cara membaca laporan ini', '怎么读这份报告', 'Chara macha laporan tu'] as L,
  honestyItems: [
    [
      'Every ringgit figure is an estimate built from your own answers, not a measurement we took.',
      'Setiap angka ringgit ialah anggaran daripada jawapan anda sendiri, bukan ukuran yang kami ambil.',
      '每一个令吉数字都是根据你自己的答案估算出来的，不是我们实测的结果。',
      'Tiap angka ringgit nya anggar ari saut nuan empu, ukai ukur ti diambi kami.',
    ],
    [
      'Links you gave us are recorded as declared. A browser cannot open them, so none are verified.',
      'Pautan yang anda beri direkodkan sebagai diisytiharkan. Pelayar tidak boleh membukanya, jadi tiada yang disahkan.',
      '你提供的链接仅记录为「你告知的内容」。浏览器打不开它们，所以没有一项经过核实。',
      'Pautan ti diberi nuan direkod baka ti dipadah. Pelayar enda ulih muka iya, nya alai nadai siti ditentuka.',
    ],
    [
      'Questions you skipped were left out of their dimension, never scored as zero.',
      'Soalan yang anda langkau dikeluarkan daripada dimensinya, bukan dinilai sebagai sifar.',
      '你跳过的题目会从该维度剔除，绝不当作零分。',
      'Tanya ti dilalu nuan dibuai ari bagi nya, ukai dikira sifar.',
    ],
    [
      'No traffic, follower, ranking or competitor figures appear anywhere, because we measured none.',
      'Tiada angka trafik, pengikut, kedudukan atau pesaing di mana-mana, kerana kami tidak mengukurnya.',
      '报告中没有任何流量、粉丝、排名或竞争对手数据，因为我们一项都没测。',
      'Nadai angka trafik, penitih, pangkat tauka pesaing ba sebarang endur, laban kami nadai ngukur nya.',
    ],
  ] as L[],
  limitationsTitle: ['What we could not know', 'Apa yang kami tidak dapat tahu', '我们无从得知的部分', 'Nama ti enda ulih dinemu kami'] as L,
  showJson: ['Show the structured output behind this report', 'Tunjukkan output berstruktur di sebalik laporan ini', '查看这份报告背后的结构化数据', 'Padah output berstruktur ba belakang laporan tu'] as L,
  hideJson: ['Hide the structured output', 'Sembunyikan output berstruktur', '收起结构化数据', 'Lalaika output berstruktur'] as L,

  // ── CTAs
  ctaSave: ['Send me a copy', 'Hantar salinan kepada saya', '寄一份给我', 'Kirum salin ngagai aku'] as L,
  ctaSaveSub: [
    'We will email this Snapshot so you can keep it or forward it.',
    'Kami akan e-melkan Snapshot ini supaya anda boleh simpan atau kongsikan.',
    '我们会把这份报告寄给你，方便保存或转发。',
    'Kami deka ngirum Snapshot tu ngambika nuan ulih nyimpan tauka mai iya.',
  ] as L,
  ctaReadout: ['Talk it through — RM 1,500', 'Bincangkan — RM 1,500', '一起聊聊 — RM 1,500', 'Berandau — RM 1,500'] as L,
  ctaReadoutSub: [
    'A 90-minute Potential Readout with a written one-page plan.',
    'Potential Readout 90 minit dengan pelan bertulis satu halaman.',
    '90 分钟的 Potential Readout，附一页书面方案。',
    'Potential Readout 90 minit enggau pelan setingkat ti ditulis.',
  ] as L,
  ctaWhatsapp: ['WhatsApp us', 'WhatsApp kami', 'WhatsApp 联系我们', 'WhatsApp kami'] as L,
  ctaPrint: ['Save as PDF', 'Simpan sebagai PDF', '保存为 PDF', 'Simpan baka PDF'] as L,

  name: ['Your name', 'Nama anda', '您的姓名', 'Nama nuan'] as L,
  email: ['Email', 'E-mel', '电邮', 'E-mel'] as L,
  phone: ['Phone or WhatsApp', 'Telefon atau WhatsApp', '电话或 WhatsApp', 'Telefon tauka WhatsApp'] as L,
  business: ['Business name', 'Nama perniagaan', '公司名称', 'Nama dagang'] as L,
  send: ['Send it', 'Hantar', '寄出', 'Kirum'] as L,
  sending: ['Sending…', 'Menghantar…', '寄送中…', 'Benung ngirum…'] as L,
  sent: ['Sent. Check your inbox in a minute or two.', 'Dihantar. Semak peti masuk anda sebentar lagi.', '已寄出，请稍后查收。', 'Udah dikirum. Peda peti masuk nuan sekejap agi.'] as L,
  sendFailed: [
    'That did not go through. Use the WhatsApp button below and we will send it manually.',
    'Ia tidak berjaya. Guna butang WhatsApp di bawah dan kami akan hantar secara manual.',
    '没有寄出成功。请用下方的 WhatsApp 按钮，我们手动寄给你。',
    'Nya enda lantang. Kena butang WhatsApp ba baruh, kami deka ngirum iya enggau jari.',
  ] as L,
  emailInvalid: ['That email does not look right.', 'E-mel itu kelihatan tidak betul.', '这个电邮地址看起来不对。', 'E-mel nya baka ti salah.'] as L,

  // ── Floating bubbles — the KOBIS house pattern
  assistantName: ['Digital Staff', 'Staf Digital', '数字助理', 'Pengawa Digital'] as L,
  assistantTag: ['Ask anything · 24/7', 'Tanya apa sahaja · 24/7', '随时提问 · 24/7', 'Tanya nama-nama · 24/7'] as L,
  assistantScripted: [
    'Prepared answers, not a live model. Five questions people actually ask.',
    'Jawapan yang disediakan, bukan model langsung. Lima soalan yang orang benar-benar tanya.',
    '这是预先准备的答案，不是即时模型。以下是大家真正会问的五个问题。',
    'Saut ti udah disedia, ukai model idup. Lima tanya ti amat ditanya orang.',
  ] as L,
  assistantClose: ['Close', 'Tutup', '关闭', 'Tutup'] as L,
  assistantQA: [
    [
      ['How long does this really take?', 'Berapa lama sebenarnya ini?', '这真的要花多久？', 'Berapa lama amat tu?'],
      [
        'About eight minutes. Twenty-two questions, one per screen, and it saves as you go — close the tab and you can pick it up later.',
        'Kira-kira lapan minit. Dua puluh dua soalan, satu setiap skrin, dan ia menyimpan sambil anda menjawab — tutup tab dan anda boleh sambung kemudian.',
        '大约八分钟。二十二道题，一屏一题，边答边保存 — 关掉页面之后还能接着答。',
        'Kira-kira lapan minit. Dua puluh dua tanya, siti sepeninjau, lalu iya nyimpan lebuh nuan nyaut — tutup tab lalu ulih neruska udah nya.',
      ],
    ],
    [
      ['Is it really free?', 'Adakah ia benar-benar percuma?', '真的免费吗？', 'Kati tu amat percuma?'],
      [
        'Yes. You see the full result on screen without signing up or paying. We only ask for an email if you want a copy sent to you.',
        'Ya. Anda melihat keputusan penuh di skrin tanpa mendaftar atau membayar. Kami hanya minta e-mel jika anda mahu salinan dihantar.',
        '是的。无需注册或付费即可在屏幕上看到完整结果。只有当你想收到副本时，我们才会要电邮。',
        'Wai. Nuan meda asil penuh ba peninjau enggai daftar tauka bayar. Kami semina minta e-mel enti nuan deka salin dikirum.',
      ],
    ],
    [
      ['What happens to my answers?', 'Apa yang berlaku kepada jawapan saya?', '我的答案会怎么处理？', 'Nama nyadi ngagai saut aku?'],
      [
        'They stay in your browser until you choose to save them. Nothing is transmitted before that. KOBIS Berhad is the data controller and you can ask us to delete your response at any time.',
        'Ia kekal dalam pelayar anda sehingga anda memilih untuk menyimpannya. Tiada apa dihantar sebelum itu. KOBIS Berhad ialah pengawal data dan anda boleh minta kami memadamnya bila-bila masa.',
        '在你选择保存之前，它们只留在你的浏览器里，不会被传送。KOBIS Berhad 是数据控管方，你随时可要求删除。',
        'Iya diau dalam pelayar nuan datai ke nuan milih nyimpan iya. Nadai utai dikirum sebedau nya. KOBIS Berhad ti ngintu data lalu nuan ulih minta kami muai iya kemaya-maya.',
      ],
    ],
    [
      ['Where do the ringgit figures come from?', 'Dari mana angka ringgit itu datang?', '那些令吉数字是怎么来的？', 'Ari ni angka ringgit nya datai?'],
      [
        'From your own answers, run through published formulas. Every figure is labelled an estimate and you can open the arithmetic on any of them, with your own inputs shown.',
        'Daripada jawapan anda sendiri, melalui formula yang diterbitkan. Setiap angka dilabel sebagai anggaran dan anda boleh membuka pengiraan bagi mana-mana, dengan input anda ditunjukkan.',
        '来自你自己的答案，经过公开的公式计算。每个数字都标明是估算，你可以展开任何一个的算式，并看到你自己的输入。',
        'Ari saut nuan empu, dijalaika nengah formula ti udah dipansutka. Tiap angka dilabel baka anggar lalu nuan ulih muka pengira sebarang siti, enggau input nuan dipeda.',
      ],
    ],
    [
      ['Will someone call me?', 'Adakah seseorang akan menghubungi saya?', '会有人打给我吗？', 'Kati bisi orang deka ngachar aku?'],
      [
        'Only if you ask. The result appears on screen with no contact required. If you want to talk it through there is a WhatsApp button and a booking link, both entirely optional.',
        'Hanya jika anda minta. Keputusan muncul di skrin tanpa perlu maklumat perhubungan. Jika anda mahu berbincang, ada butang WhatsApp dan pautan tempahan, kedua-duanya pilihan.',
        '只有你主动要求才会。结果直接显示在屏幕上，不需要留联系方式。如果想聊聊，有 WhatsApp 按钮和预约链接，都是完全自愿的。',
        'Semina enti nuan minta. Asil pegari ba peninjau enggai meri alamat. Enti nuan deka berandau, bisi butang WhatsApp enggau pautan tempah, dua iti nya pilih magang.',
      ],
    ],
  ] as [L, L][],

  footerCredit: [
    'This Digital Experience is Part of the Innovation Ecosystem by',
    'Pengalaman Digital Ini Sebahagian daripada Ekosistem Inovasi oleh',
    '此数字体验是创新生态系统的一部分，由',
    'Pengalaman Digital Tu Sebagi ari Ekosistem Inovasi ari',
  ] as L,
};

export function fill(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}
