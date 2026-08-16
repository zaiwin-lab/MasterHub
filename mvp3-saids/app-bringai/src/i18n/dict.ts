import type { L, Lang } from '../types';

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'bm', label: 'BM' },
];

/** Resolve a [en, bm] tuple. A missing cell falls back to English rather than
 *  rendering blank — the same rule the FAME build uses. */
export function t(pair: L | undefined, lang: Lang): string {
  if (!pair) return '';
  const i = lang === 'bm' ? 1 : 0;
  return pair[i] || pair[0];
}

export const UI = {
  brand: ['Bring AI To My Biz', 'Bawa AI Ke Perniagaan Saya'] as L,
  brandShort: ['AI Readiness Scan', 'Imbasan Kesediaan AI'] as L,
  convenor: ['A KOBIS Berhad practice', 'Sebuah amalan KOBIS Berhad'] as L,

  // Intro — urgency first. MVP³ is deliberately not named here; it is revealed
  // on the Snapshot, once the respondent has something to attach it to.
  heroKicker: ['Free · 8 minutes · Instant result', 'Percuma · 8 minit · Keputusan segera'] as L,
  heroTitle: [
    'AI is rewriting who wins in your market. Right now.',
    'AI sedang menulis semula siapa menang dalam pasaran anda. Sekarang.',
  ] as L,
  heroSub: [
    'Not in five years. This quarter. And the operators moving fastest are not the biggest — they are the ones who stopped waiting. Eight minutes tells you exactly where your business stands, what standing still costs you every month, and the first three things to do about it.',
    'Bukan lima tahun lagi. Suku tahun ini. Dan pengendali yang bergerak paling laju bukan yang terbesar — tetapi yang berhenti menunggu. Lapan minit memberitahu anda dengan tepat di mana kedudukan perniagaan anda, berapa kos berdiam diri setiap bulan, dan tiga perkara pertama yang perlu dilakukan.',
  ] as L,
  start: ['Show me where I stand', 'Tunjukkan kedudukan saya'] as L,
  resume: ['Continue where you left off', 'Sambung dari tempat anda berhenti'] as L,
  resumeAt: ['{n} answered', '{n} dijawab'] as L,
  startOver: ['Start again', 'Mula semula'] as L,
  trustLine: [
    'No signup to see your result · Nothing shared with anyone · Free',
    'Tiada pendaftaran untuk melihat keputusan · Tiada perkongsian · Percuma',
  ] as L,

  proofTitle: ['The shift already happened', 'Peralihan itu sudah berlaku'] as L,
  proofSub: [
    'These are not predictions. They are what has already been measured.',
    'Ini bukan ramalan. Ini yang sudah diukur.',
  ] as L,
  proofClose: [
    'Most owners read numbers like these and do nothing, because none of them say what to do on Monday morning. This one does.',
    'Kebanyakan pemilik membaca angka begini dan tidak berbuat apa-apa, kerana tiada satu pun memberitahu apa yang perlu dibuat pagi Isnin. Yang ini memberitahunya.',
  ] as L,
  sourceLabel: ['Source', 'Sumber'] as L,

  shiftTitle: ['What is actually happening in your market', 'Apa yang sebenarnya berlaku dalam pasaran anda'] as L,
  shiftBlocks: [
    [
      [
        'Someone younger is quoting in minutes',
        'Ada yang lebih muda memberi sebut harga dalam beberapa minit',
      ],
      [
        'They are not better than you. They have no more experience, no better suppliers and no deeper pockets. They simply reply while the customer is still deciding, and quote before the urgency cools. Speed is beating expertise, and it is beating it quietly.',
        'Mereka bukan lebih baik daripada anda. Pengalaman tidak lebih, pembekal tidak lebih baik, modal tidak lebih besar. Mereka cuma membalas semasa pelanggan masih membuat keputusan, dan memberi sebut harga sebelum desakan reda. Kelajuan sedang mengalahkan kepakaran, dan ia berlaku secara senyap.',
      ],
    ],
    [
      [
        'A younger buyer decides before they ever speak to you',
        'Pembeli lebih muda membuat keputusan sebelum bercakap dengan anda',
      ],
      [
        'Millennial and Gen Z buyers now run most of the purchasing in Malaysian businesses. They search, compare and shortlist before any human is involved. If your offer is not findable and not instantly answerable, you are not losing the pitch — you are never in it.',
        'Pembeli Milenial dan Gen Z kini menguruskan sebahagian besar pembelian dalam perniagaan Malaysia. Mereka mencari, membandingkan dan menyenarai pendek sebelum sebarang manusia terlibat. Jika tawaran anda tidak dapat dijumpai dan tidak boleh dijawab segera, anda bukan kalah dalam pertandingan — anda tidak pernah masuk pun.',
      ],
    ],
    [
      [
        'Your experience is the asset. It is just not working hard enough',
        'Pengalaman anda ialah asetnya. Cuma ia belum bekerja cukup kuat',
      ],
      [
        'Twenty years of judgement is something no newcomer can download. But right now that judgement sits in one head, answers one enquiry at a time, and stops entirely when you take a week off. Put AI underneath it and the same judgement answers every enquiry, at any hour, in your voice.',
        'Dua puluh tahun pertimbangan ialah sesuatu yang tidak boleh dimuat turun oleh pendatang baharu. Tetapi kini pertimbangan itu berada dalam satu kepala, menjawab satu pertanyaan pada satu masa, dan terhenti sepenuhnya bila anda bercuti seminggu. Letakkan AI di bawahnya dan pertimbangan yang sama menjawab setiap pertanyaan, pada bila-bila masa, dalam suara anda.',
      ],
    ],
  ] as [L, L][],

  servantTitle: ['AI works for you. Not the other way round.', 'AI bekerja untuk anda. Bukan sebaliknya.'] as L,
  servantBody: [
    'You are not here to learn a tool. You are here to run a business that answers faster, quotes faster, and stops leaking. AI is the thing underneath that — the operator that never sleeps, never forgets and never gets bored of the tenth identical enquiry. Your job stays what it always was: knowing what is worth doing.',
    'Anda bukan di sini untuk belajar sesuatu alat. Anda di sini untuk mengendalikan perniagaan yang membalas lebih pantas, memberi sebut harga lebih pantas, dan berhenti bocor. AI ialah lapisan di bawahnya — pengendali yang tidak pernah tidur, tidak pernah lupa dan tidak pernah jemu dengan pertanyaan kesepuluh yang serupa. Tugas anda kekal seperti dahulu: tahu apa yang berbaloi dilakukan.',
  ] as L,
  servantPoints: [
    ['Answers every enquiry in under a minute, day or night', 'Menjawab setiap pertanyaan dalam seminit, siang atau malam'],
    ['Turns a two-day quote into a two-minute one', 'Menukar sebut harga dua hari kepada dua minit'],
    ['Takes the repeat admin off your team entirely', 'Mengambil alih kerja pentadbiran berulang daripada pasukan anda'],
    ['Makes what you know findable by people already searching', 'Menjadikan apa yang anda tahu boleh dijumpai oleh mereka yang sudah mencari'],
  ] as L[],

  whatYouGet: ['What you get in eight minutes', 'Apa yang anda dapat dalam lapan minit'] as L,
  getList: [
    ['A score for where your business actually stands', 'Skor untuk kedudukan sebenar perniagaan anda'],
    ['Your top three leaks, in ringgit per month', 'Tiga kebocoran utama anda, dalam ringgit sebulan'],
    ['What the next 90 days cost if nothing changes', 'Kos 90 hari akan datang jika tiada perubahan'],
    ['Three fixes you can do yourself this week, free', 'Tiga pembetulan yang anda boleh buat sendiri minggu ini, percuma'],
    ['The one AI move that moves the most money first', 'Satu langkah AI yang menggerakkan paling banyak wang dahulu'],
    ['One product opportunity already inside your business', 'Satu peluang produk yang sudah ada dalam perniagaan anda'],
  ] as L[],

  leaksTitle: ['Six places money leaves a business quietly', 'Enam tempat wang keluar dari perniagaan secara senyap'] as L,
  leaksSub: [
    'We have never scanned a business with none of them. Most have four.',
    'Kami belum pernah mengimbas perniagaan yang tiada satu pun. Kebanyakannya ada empat.',
  ] as L,

  whoTitle: ['Who is behind this', 'Siapa di sebalik ini'] as L,
  whoBody: [
    'Ts. Zaiwin Kassim, MBA — AI product strategist, and the lead of KAPT, the KOBIS AI Prodigy Team. We build working AI systems for Malaysian businesses: not strategy decks, not pilots, but things that run. This scan is the same diagnostic we run at the start of every engagement.',
    'Ts. Zaiwin Kassim, MBA — ahli strategi produk AI, dan ketua KAPT, KOBIS AI Prodigy Team. Kami membina sistem AI yang berfungsi untuk perniagaan Malaysia: bukan slaid strategi, bukan projek perintis, tetapi sesuatu yang benar-benar berjalan. Imbasan ini ialah diagnostik yang sama kami jalankan pada permulaan setiap penglibatan.',
  ] as L,
  finalTitle: ['Eight minutes. Then you will know.', 'Lapan minit. Kemudian anda akan tahu.'] as L,
  finalSub: [
    'Where you stand, what it is costing you, and what to do first.',
    'Di mana kedudukan anda, berapa kosnya, dan apa yang perlu dibuat dahulu.',
  ] as L,

  // Consent
  consentTitle: ['Before we start', 'Sebelum kita mula'] as L,
  consentBody: [
    'Your answers stay in this browser until you choose to save them. We store no sensitive personal data. KOBIS Berhad is the data controller, and you can ask us to delete your response at any time.',
    'Jawapan anda kekal dalam pelayar ini sehingga anda memilih untuk menyimpannya. Kami tidak menyimpan data peribadi sensitif. KOBIS Berhad ialah pengawal data, dan anda boleh minta kami memadam maklum balas anda pada bila-bila masa.',
  ] as L,
  consentResearch: [
    'Use my answers anonymously in aggregate research on Malaysian business readiness.',
    'Guna jawapan saya secara tanpa nama dalam penyelidikan agregat tentang kesediaan perniagaan Malaysia.',
  ] as L,
  consentEmail: [
    'Email me a copy of my Snapshot when it is ready.',
    'E-melkan saya salinan Snapshot saya apabila ia siap.',
  ] as L,
  consentComms: [
    'You may contact me about what the Snapshot finds. Optional, and genuinely optional.',
    'Anda boleh hubungi saya tentang penemuan Snapshot. Pilihan, dan ia benar-benar pilihan.',
  ] as L,
  consentContinue: ['I understand — continue', 'Saya faham — teruskan'] as L,

  // Respondent
  whoAreYou: ['Which of these sounds most like you?', 'Antara berikut, mana paling menyerupai anda?'] as L,
  owner: ['I own or lead this business', 'Saya memiliki atau mengetuai perniagaan ini'] as L,
  ownerNote: ['Established business, owner-operator', 'Perniagaan sedia ada, pemilik-pengendali'] as L,
  executive: ['I manage a function or department', 'Saya menguruskan fungsi atau jabatan'] as L,
  executiveNote: ['Corporate, GLC, agency or statutory body', 'Korporat, GLC, agensi atau badan berkanun'] as L,
  founder: ["I'm starting something new", 'Saya sedang memulakan sesuatu yang baharu'] as L,
  founderNote: ['Pre-revenue or under 12 months old', 'Belum ada hasil atau bawah 12 bulan'] as L,

  // Survey chrome
  question: ['Question', 'Soalan'] as L,
  of: ['of', 'daripada'] as L,
  back: ['Back', 'Kembali'] as L,
  next: ['Next', 'Seterusnya'] as L,
  notSure: ['Not sure', 'Tidak pasti'] as L,
  decline: ['Prefer not to say', 'Tidak mahu nyatakan'] as L,
  selectUpTo: ['Choose up to {n}', 'Pilih sehingga {n}'] as L,
  autosaved: ['Saved on this device', 'Disimpan pada peranti ini'] as L,

  // Magic box
  mbTitle: ['Paste your links, all at once', 'Tampal pautan anda, semuanya sekali'] as L,
  mbBody: [
    'Website, Facebook, Instagram, Google listing, Shopee — any format, any order. We will sort them out.',
    'Laman web, Facebook, Instagram, senarai Google, Shopee — apa-apa format, apa-apa susunan. Kami akan menyusunnya.',
  ] as L,
  mbPlaceholder: [
    'facebook.com/yourbusiness\nyourbusiness.com.my\n@yourhandle',
    'facebook.com/perniagaananda\nperniagaananda.com.my\n@handleanda',
  ] as L,
  mbDetect: ['Sort these out', 'Susun semua ini'] as L,
  mbFound: ['Found {n}', 'Dijumpai {n}'] as L,
  mbRemove: ['Remove', 'Buang'] as L,
  mbSkip: ['I do not have any', 'Saya tiada satu pun'] as L,
  mbDeclared: [
    'Recorded as declared. We cannot open these from a browser, so nothing here is verified.',
    'Direkodkan sebagai diisytiharkan. Kami tidak boleh membukanya dari pelayar, jadi tiada apa di sini disahkan.',
  ] as L,
  ctxDescription: ['What does the business do, in your own words?', 'Apa yang perniagaan ini buat, dalam kata-kata anda?'] as L,
  ctxCustomers: ['Who are your best customers?', 'Siapa pelanggan terbaik anda?'] as L,
  ctxProud: [
    "Anything you're proud of that most people don't know about you?",
    'Apa-apa yang anda banggakan tetapi kebanyakan orang tidak tahu?',
  ] as L,
  optional: ['Optional', 'Pilihan'] as L,

  // Review
  reviewTitle: ['Ready when you are', 'Sedia bila anda sedia'] as L,
  reviewBody: [
    'That is everything. We will score nine dimensions, estimate what is leaking, and pick the one opportunity we think is hiding in your business.',
    'Itu sahaja. Kami akan menilai sembilan dimensi, menganggarkan apa yang bocor, dan memilih satu peluang yang kami fikir tersembunyi dalam perniagaan anda.',
  ] as L,
  reviewAnswered: ['{a} of {b} questions answered', '{a} daripada {b} soalan dijawab'] as L,
  generate: ['Show me my Snapshot', 'Tunjukkan Snapshot saya'] as L,

  // Processing
  proc1: ['Scoring nine dimensions', 'Menilai sembilan dimensi'] as L,
  proc2: ['Estimating leak exposure', 'Menganggarkan pendedahan kebocoran'] as L,
  proc3: ['Selecting your MVP³ candidate', 'Memilih calon MVP³ anda'] as L,

  // Snapshot
  yourIndex: ['Your MVP³ Index', 'Indeks MVP³ Anda'] as L,
  // Before the reveal the score is unbranded — naming the method here would
  // explain it to someone who has nothing yet to attach it to.
  scoreKicker: ['Where your business stands', 'Kedudukan perniagaan anda'] as L,
  confidence: ['Confidence', 'Keyakinan'] as L,
  confLow: ['low', 'rendah'] as L,
  confModerate: ['moderate', 'sederhana'] as L,
  confGood: ['good', 'baik'] as L,
  confWhy: [
    'Capped at moderate because nothing you submitted could be verified from a browser.',
    'Dihadkan pada sederhana kerana tiada apa yang anda hantar boleh disahkan dari pelayar.',
  ] as L,
  lenses: ['The three lenses', 'Tiga lensa'] as L,
  buildReadiness: ['Build Readiness', 'Kesediaan Membina'] as L,
  hiddenPotential: ['Hidden Potential', 'Potensi Tersembunyi'] as L,
  marketPull: ['Market Pull', 'Tarikan Pasaran'] as L,
  insufficient: ['Not enough answered', 'Tidak cukup dijawab'] as L,

  ledgerTitle: ['Your Leakage Ledger', 'Lejar Kebocoran Anda'] as L,
  ledgerSub: [
    'Estimated from what you told us. Every figure opens its own arithmetic.',
    'Dianggarkan daripada apa yang anda beritahu kami. Setiap angka membuka pengiraannya sendiri.',
  ] as L,
  perMonth: ['/month', '/bulan'] as L,
  estimate: ['estimate', 'anggaran'] as L,
  opportunity: ['opportunity, not loss', 'peluang, bukan kerugian'] as L,
  showWorkings: ['Show me how these were calculated', 'Tunjukkan cara ia dikira'] as L,
  hideWorkings: ['Hide the arithmetic', 'Sembunyikan pengiraan'] as L,
  totalLeak: ['Estimated total, hard leaks only', 'Anggaran jumlah, kebocoran keras sahaja'] as L,
  cappedNote: [
    'Capped at 35% of estimated monthly revenue, so the figure stays defensible.',
    'Dihadkan pada 35% daripada anggaran hasil bulanan, supaya angka ini kekal munasabah.',
  ] as L,
  noFigure: [
    'You skipped the questions we need to put a ringgit figure on this, so we have not invented one. Here is what we can still say.',
    'Anda melangkau soalan yang kami perlukan untuk meletakkan angka ringgit, jadi kami tidak mereka-reka. Ini yang masih boleh kami nyatakan.',
  ] as L,

  delayTitle: ['Cost of Delay', 'Kos Penangguhan'] as L,
  delayBody: [
    'If nothing changes, the next 90 days cost you approximately',
    'Jika tiada apa berubah, 90 hari akan datang menelan kos lebih kurang',
  ] as L,

  candidateTitle: ['Your MVP³ candidate', 'Calon MVP³ anda'] as L,
  candidateSub: [
    'One product opportunity already sitting inside your operation.',
    'Satu peluang produk yang sudah ada dalam operasi anda.',
  ] as L,
  buildWindow: ['Typical build window', 'Tempoh binaan biasa'] as L,

  firstSeven: ['The First 7', 'Tujuh Hari Pertama'] as L,
  firstSevenSub: [
    'Three things you can do yourself this week. No one needs to be paid for these.',
    'Tiga perkara yang anda boleh buat sendiri minggu ini. Tiada siapa perlu dibayar untuk ini.',
  ] as L,
  nextMoves: ['The Next 30 and 90', '30 dan 90 Hari Berikutnya'] as L,
  nextMovesSub: [
    'These need a partner. This is exactly what a Clarity Sprint covers.',
    'Ini memerlukan rakan kongsi. Inilah yang diliputi oleh Clarity Sprint.',
  ] as L,

  honestyTitle: ['How to read this report', 'Cara membaca laporan ini'] as L,
  honestyItems: [
    [
      'Every ringgit figure is an estimate built from your own answers, not a measurement we took.',
      'Setiap angka ringgit ialah anggaran daripada jawapan anda sendiri, bukan ukuran yang kami ambil.',
    ],
    [
      'Links you gave us are recorded as declared. A browser cannot open them, so none are verified.',
      'Pautan yang anda beri direkodkan sebagai diisytiharkan. Pelayar tidak boleh membukanya, jadi tiada yang disahkan.',
    ],
    [
      'Questions you skipped were left out of their dimension, never scored as zero.',
      'Soalan yang anda langkau dikeluarkan daripada dimensinya, bukan dinilai sebagai sifar.',
    ],
    [
      'No traffic, follower, ranking or competitor figures appear anywhere, because we measured none.',
      'Tiada angka trafik, pengikut, kedudukan atau pesaing di mana-mana, kerana kami tidak mengukurnya.',
    ],
  ] as L[],
  limitationsTitle: ['What we could not know', 'Apa yang kami tidak dapat tahu'] as L,
  showJson: ['Show the structured output behind this report', 'Tunjukkan output berstruktur di sebalik laporan ini'] as L,
  hideJson: ['Hide the structured output', 'Sembunyikan output berstruktur'] as L,

  // The MVP³ reveal. Held back until the respondent has a result to attach it to —
  // the method means nothing before there is something for it to explain.
  revealKicker: ['What just happened', 'Apa yang baru berlaku'] as L,
  revealTitle: ['You have just been through MVP³.', 'Anda baru sahaja melalui MVP³.'] as L,
  revealBody: [
    'MVP³ is the method behind everything above. It reads a business through three lenses at once — and it is the same method KAPT uses on paid engagements, run here on your own answers.',
    'MVP³ ialah kaedah di sebalik semua di atas. Ia membaca perniagaan melalui tiga lensa serentak — dan ia kaedah sama yang KAPT gunakan dalam penglibatan berbayar, dijalankan di sini pada jawapan anda sendiri.',
  ] as L,
  revealLenses: [
    [
      ['Minimum Viable Product', 'Produk Minimum Berdaya Maju'],
      ['What can be built and tested now — your Build Readiness score.', 'Apa yang boleh dibina dan diuji sekarang — skor Kesediaan Membina anda.'],
    ],
    [
      ['Most Valuable Potential', 'Potensi Paling Bernilai'],
      ['What is already here and unused — your Hidden Potential score, and every leak above.', 'Apa yang sudah ada tetapi tidak digunakan — skor Potensi Tersembunyi anda, dan setiap kebocoran di atas.'],
    ],
    [
      ['Market Value Proposition', 'Proposisi Nilai Pasaran'],
      ['What the market will actually buy — your Market Pull score, and the candidate below.', 'Apa yang pasaran benar-benar akan beli — skor Tarikan Pasaran anda, dan calon di bawah.'],
    ],
  ] as [L, L][],
  revealClose: [
    'Every business has an untapped MVP. Yours has a number attached to it now.',
    'Setiap perniagaan ada MVP yang belum digali. Milik anda kini ada angkanya.',
  ] as L,

  // CTAs
  ctaSave: ['Send me a copy', 'Hantar salinan kepada saya'] as L,
  ctaSaveSub: [
    'We will email this Snapshot so you can keep it or forward it.',
    'Kami akan e-melkan Snapshot ini supaya anda boleh simpan atau kongsikan.',
  ] as L,
  ctaReadout: ['Talk it through — RM 1,500', 'Bincangkan — RM 1,500'] as L,
  ctaReadoutSub: [
    'A 90-minute Potential Readout with a written one-page plan.',
    'Potential Readout 90 minit dengan pelan bertulis satu halaman.',
  ] as L,
  ctaWhatsapp: ['WhatsApp us', 'WhatsApp kami'] as L,
  ctaPrint: ['Save as PDF', 'Simpan sebagai PDF'] as L,

  name: ['Your name', 'Nama anda'] as L,
  email: ['Email', 'E-mel'] as L,
  phone: ['Phone or WhatsApp', 'Telefon atau WhatsApp'] as L,
  business: ['Business name', 'Nama perniagaan'] as L,
  send: ['Send it', 'Hantar'] as L,
  sending: ['Sending…', 'Menghantar…'] as L,
  sent: ['Sent. Check your inbox in a minute or two.', 'Dihantar. Semak peti masuk anda sebentar lagi.'] as L,
  sendFailed: [
    'That did not go through. Use the WhatsApp button below and we will send it manually.',
    'Ia tidak berjaya. Guna butang WhatsApp di bawah dan kami akan hantar secara manual.',
  ] as L,
  emailInvalid: ['That email does not look right.', 'E-mel itu kelihatan tidak betul.'] as L,

  footerCredit: [
    'This Digital Experience is Part of the KOBIS Berhad Innovation Ecosystem',
    'Pengalaman Digital Ini Sebahagian daripada Ekosistem Inovasi KOBIS Berhad',
  ] as L,
};

export function fill(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}
