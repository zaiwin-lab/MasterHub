/* ══════════════════════════════════════════════════════════════
   BAMBOO SARAWAK — shared application layer
   i18n (BM / EN / 中文 / Iban) · navigation · reveal · widgets
   ══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

/* ─── Global config ─────────────────────────────────────────── */
var CONFIG = {
  waNumber: '601128465813',
  waDisplay: '011-2846 5813',
  langKey: 'bamboo-sarawak-lang',
  storeKey: 'bamboo-sarawak-applications',
  draftKey: 'bamboo-sarawak-draft',
  mgmtPass: '123456'
};
window.BAMBOO_CONFIG = CONFIG;

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Reference data ────────────────────────────────────────── */
var SPECIES = [
  { latin: 'Dendrocalamus asper',        local: 'Buluh Betong' },
  { latin: 'Gigantochloa levis',         local: 'Buluh Beting' },
  { latin: 'Gigantochloa hasskarliana',  local: 'Buluh Beti'   },
  { latin: 'Bambusa vulgaris',           local: 'Buluh Minyak' },
  { latin: 'Schizostachyum brachycladum',local: 'Buluh Lemang' }
];
window.BAMBOO_SPECIES = SPECIES;

var OFFICES = [
  { city: 'Kuching',  name: 'Ibu Pejabat PUSAKA, Wisma Sumber Alam', tels: ['082-473000', '014-2853037'], noteKey: 'office.exec' },
  { city: 'Mukah',    name: 'Pejabat Bahagian PUSAKA Tg. Manis / Mukah', tels: ['084-613979'] },
  { city: 'Sibu',     name: 'Pejabat Bahagian PUSAKA Sibu',     tels: ['084-335059'] },
  { city: 'Bintulu',  name: 'Pejabat Bahagian PUSAKA Bintulu',  tels: ['086-311605'] },
  { city: 'Miri',     name: 'Pejabat Bahagian PUSAKA Miri',     tels: ['085-325113'] }
];
window.BAMBOO_OFFICES = OFFICES;

/* ─── Translations ──────────────────────────────────────────── */
var T = {};

T.ms = {
  'a11y.skip': 'Langkau ke kandungan utama',
  'nav.bamboo': 'Tentang Buluh', 'nav.agenda': 'Agenda', 'nav.program': 'Program',
  'nav.process': 'Proses', 'nav.faq': 'Soalan Lazim', 'nav.contact': 'Hubungi',
  'nav.apply': 'Mula Permohonan', 'nav.home': 'Laman Utama',

  'hero.badge.tag': 'Agenda Negeri',
  'hero.badge.text': 'Perbadanan Kemajuan Perusahaan Kayu Sarawak',
  'hero.h1.a': 'Menanam hari ini,', 'hero.h1.b': 'menuai satu generasi.',
  'hero.lede': 'Buluh matang dalam tiga hingga lima tahun, menahan tanah di tebing sungai, dan menyediakan bahan mentah untuk industri hiliran Sarawak. STIDC memimpin agenda ini — dan setiap hektar bermula dengan seorang penanam.',
  'hero.cta1': 'Sertai Agenda Ini', 'hero.cta2': 'Kenali Buluh Sarawak',
  'hero.note': 'Borang rasmi PUSAKA · Simpanan draf automatik · Percuma sepenuhnya',
  'hero.panel.title': 'Agenda Buluh Sarawak',
  'hero.stat1': 'Sasaran keluasan tanaman buluh menjelang 2030',
  'hero.stat2': 'Telah ditanam oleh 17 syarikat komersial dan lebih 200 peserta komuniti',
  'hero.stat3': 'Nilai eksport produk berasaskan buluh global, berkembang ~4% setahun',
  'hero.panel.foot': 'Sumber: kenyataan awam STIDC dan laporan media Sarawak, 2023–2025. Angka adalah anggaran rujukan, bukan rekod rasmi terkini.',

  'why.eyebrow': 'Mengapa Buluh',
  'why.title': 'Satu tanaman yang menjawab tiga masalah serentak.',
  'why.sub': 'Sarawak memerlukan bahan mentah mampan untuk industri kayu, pendapatan tambahan untuk komuniti luar bandar, dan penutup tanah yang melindungi tebing sungai. Buluh menjawab ketiga-tiganya.',
  'why.c1.t': 'Matang dalam 3–5 tahun',
  'why.c1.d': 'Berbanding pokok balak yang mengambil puluhan tahun, rumpun buluh boleh dituai berulang tanpa perlu ditanam semula — pendapatan yang datang lebih awal dan berterusan.',
  'why.c2.t': 'Pendapatan untuk komuniti',
  'why.c2.d': 'Projek Buluh Komuniti membuka ruang kepada kampung, sekolah dan institusi untuk menanam di tanah sedia ada — anak pokok diperuntukkan mengikut keluasan yang dicadangkan.',
  'why.c3.t': 'Melindungi tanah dan air',
  'why.c3.d': 'Sistem rizom buluh yang padat mengikat tanah, mengurangkan hakisan di tebing sungai dan cerun, sambil menyerap karbon sepanjang kitaran hidupnya.',
  'why.c4.t': 'Bahan mentah industri hiliran',
  'why.c4.d': 'Papan lamina, perabot, arang aktif, biomas dan produk kraf — buluh memberi kilang Sarawak sumber yang boleh diperbaharui dan boleh dirancang.',
  'why.c5.t': 'Pasaran yang sedang berkembang',
  'why.c5.d': 'Permintaan global terhadap produk berasaskan buluh terus meningkat apabila industri mencari alternatif rendah karbon kepada plastik dan kayu keras.',
  'why.c6.t': 'Disokong secara rasmi',
  'why.c6.d': 'STIDC dilantik Kerajaan Sarawak untuk memimpin pembangunan industri buluh, dengan tapak semaian, khidmat nasihat teknikal dan pelan industri negeri.',

  'band.eyebrow': 'Kedudukan Semasa',
  'band.title': 'Agenda ini sudah bergerak. Ruang untuk anda masih terbuka.',
  'band.s1': 'Tahun STIDC diarah memimpin pembangunan industri buluh negeri',
  'band.s2': 'Syarikat komersial yang telah menyertai program ladang buluh',
  'band.s3': 'Peserta komuniti di seluruh Sarawak',
  'band.s4': 'Pejabat PUSAKA menerima permohonan: Kuching, Mukah, Sibu, Bintulu, Miri',

  'track.eyebrow': 'Laluan Penyertaan',
  'track.title': 'Dua laluan masuk. Satu agenda yang sama.',
  'track.sub': 'Pilih laluan yang menepati keadaan anda. Setiap laluan mempunyai borang rasmi PUSAKA yang tersendiri, tetapi kedua-duanya menyumbang kepada sasaran keluasan buluh negeri.',
  'track.a.tag': 'Projek A · Komuniti', 'track.a.title': 'Projek Buluh Komuniti',
  'track.a.desc': 'Untuk kumpulan komuniti, sekolah dan institusi yang mahu menanam buluh secara berkelompok di atas tanah kampung, tanah institusi atau tanah pinjaman.',
  'track.a.l1': 'Minimum 10 orang peserta bagi setiap kategori projek',
  'track.a.l2': 'Kategori: Komuniti, Sekolah atau Institusi',
  'track.a.l3': 'Anak pokok diperuntukkan mengikut keluasan tanah yang dicadangkan',
  'track.a.l4': 'Kebenaran guna tanah diperlukan jika tanah bukan milik sendiri',
  'track.a.cta': 'Mohon Projek Komuniti', 'track.a.meta': 'Borang STIDC.01',
  'track.b.tag': 'Projek B · Komersial', 'track.b.title': 'Ladang Buluh Komersial',
  'track.b.desc': 'Untuk syarikat dan koperasi berdaftar yang mahu membangunkan ladang buluh berskala komersial bagi membekalkan industri hiliran Sarawak.',
  'track.b.l1': 'Syarikat mesti berdaftar dengan SSM atau sebagai koperasi',
  'track.b.l2': 'Tapak ladang mesti berada dalam negeri Sarawak',
  'track.b.l3': 'Tanah milik sendiri, pajakan atau sewaan yang sah',
  'track.b.l4': 'Laporan EIA dan FMP diperlukan bagi tapak di kawasan LPF',
  'track.b.cta': 'Mohon Ladang Komersial', 'track.b.meta': 'Borang STIDC.10.SH.01.37',

  'proc.eyebrow': 'Perjalanan Permohonan',
  'proc.title': 'Empat langkah, kemudian pihak PUSAKA mengambil alih.',
  'proc.sub': 'Borang hanyalah pintu masuk. Yang penting ialah tanah, peserta dan komitmen anda terhadap rumpun yang akan tumbuh di situ.',
  'proc.s1.t': 'Isi maklumat',
  'proc.s1.d': 'Lengkapkan borang mengikut laluan yang dipilih. Draf disimpan secara automatik dalam pelayar anda — anda boleh berhenti dan sambung kemudian pada peranti yang sama.',
  'proc.s2.t': 'Muat naik dokumen',
  'proc.s2.d': 'Seret dan lepas dokumen sokongan ke dalam Kotak Dokumen. Sistem mencadangkan jenis dokumen berdasarkan nama fail — anda sentiasa boleh membetulkannya sebelum hantar.',
  'proc.s3.t': 'Semak dan tandatangan',
  'proc.s3.d': 'Semak semula ringkasan permohonan, baca perakuan pemohon, dan turunkan tandatangan elektronik anda.',
  'proc.s4.t': 'Terima nombor rujukan',
  'proc.s4.d': 'Anda menerima nombor rujukan unik dan resit boleh cetak. Pegawai PUSAKA akan menyemak, menjalankan naziran tapak jika perlu, dan menghubungi anda.',

  'portal.eyebrow': 'Portal Permohonan', 'portal.title': 'Mulakan permohonan anda.',
  'portal.sub': 'Semua maklumat kekal dalam pelayar anda sehingga anda menekan hantar. Medan bertanda <span style="color:var(--clay)">*</span> adalah wajib.',

  'faq.eyebrow': 'Soalan Lazim', 'faq.title': 'Perkara yang paling kerap ditanya.',
  'office.eyebrow': 'Pejabat PUSAKA', 'office.title': 'Bercakap dengan pegawai berhampiran anda.',
  'office.sub': 'Borang yang telah lengkap boleh dikembalikan ke Ibu Pejabat atau mana-mana Pejabat Bahagian di bawah.',
  'office.exec': 'Pegawai Eksekutif Projek Buluh',

  'footer.blurb': 'Portal permohonan untuk agenda buluh Sarawak — menghubungkan penanam komuniti dan pengusaha komersial dengan program tanaman buluh negeri.',
  'footer.h.program': 'Program', 'footer.h.help': 'Bantuan', 'footer.h.contact': 'Hubungi',
  'footer.l.a': 'Projek Buluh Komuniti', 'footer.l.b': 'Ladang Buluh Komersial',
  'footer.l.about': 'Tentang Buluh Sarawak', 'footer.l.process': 'Proses Permohonan',
  'footer.l.faq': 'Soalan Lazim', 'footer.l.offices': 'Pejabat PUSAKA',
  'footer.l.assistant': 'Pembantu Digital 24/7', 'footer.l.mgmt': 'Akses Pengurusan',
  'footer.hq': 'Wisma Sumber Alam, Kuching',
  'footer.disclaimer': 'Portal ini dibangunkan sebagai sumbangan pro bono untuk pertimbangan STIDC / PUSAKA. Ia bukan sistem rasmi kerajaan sehingga diterima pakai dan diterbitkan oleh STIDC. Angka yang dipaparkan diambil daripada kenyataan awam dan laporan media, dan perlu disahkan sebelum penerbitan rasmi.',
  'footer.rights': '© 2026 Bamboo Sarawak — Portal Agenda Buluh.',
  'footer.tagline': 'Dibina dengan hormat untuk komuniti dan industri Sarawak.',
  'footer.credit': 'Pengalaman digital ini adalah sebahagian daripada ekosistem inovasi <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a>',

  'bubble.wa': 'Bersembang di WhatsApp', 'bubble.ai': 'Pembantu Digital 24/7',
  'as.title': 'Pembantu Buluh', 'as.status': 'Dalam talian · 24/7',
  'as.placeholder': 'Taip soalan anda…', 'as.send': 'Hantar',
  'as.disclaim': 'Pembantu automatik. Untuk keputusan rasmi, sila hubungi pejabat PUSAKA.',
  'as.greet': 'Selamat datang ke <b>Portal Agenda Buluh Sarawak</b>. Saya boleh membantu anda memahami program, syarat kelayakan, dokumen yang diperlukan dan cara memohon. Apa yang ingin anda ketahui?',
  'as.fallback': 'Maaf, saya belum mempunyai jawapan tepat untuk soalan itu. Cuba tanya tentang <b>kelayakan</b>, <b>dokumen</b>, <b>proses</b>, <b>spesies buluh</b> atau <b>pejabat</b> — atau hubungi PUSAKA terus di 082-473000.',

  'faq.q1': 'Adakah penyertaan ini dikenakan bayaran?',
  'faq.a1': 'Tidak. Permohonan kepada program buluh PUSAKA adalah percuma. Portal ini juga percuma digunakan. Jika ada pihak meminta bayaran untuk memproses permohonan anda, sila laporkan kepada pejabat PUSAKA.',
  'faq.q2': 'Berapa ramai peserta diperlukan untuk Projek Buluh Komuniti?',
  'faq.a2': 'Minimum sepuluh orang peserta bagi setiap kategori projek — sama ada kategori Komuniti, Sekolah atau Institusi. Salinan kad pengenalan semua ahli projek perlu disertakan bersama borang.',
  'faq.q3': 'Bolehkah saya memohon jika tanah itu bukan milik saya?',
  'faq.a3': 'Boleh. Tanah sewaan atau pajakan diterima, tetapi anda perlu mendapatkan kebenaran guna tanah bertulis daripada pemilik tanah. Bahagian kebenaran guna tanah dalam borang perlu ditandatangani oleh pemilik.',
  'faq.q4': 'Berapa banyak anak pokok akan saya terima?',
  'faq.a4': 'Bilangan anak pokok diperuntukkan berdasarkan keluasan tanah yang dicadangkan. Spesies yang diberikan pula bergantung kepada kesesuaian industri buluh yang dibangunkan dan stok semasa tapak semaian PUSAKA.',
  'faq.q5': 'Berapa lama proses kelulusan mengambil masa?',
  'faq.a5': 'Tempoh sebenar ditentukan oleh PUSAKA dan bergantung kepada naziran tapak serta kelengkapan dokumen. Portal ini tidak boleh menjanjikan tempoh tertentu. Pegawai akan menghubungi anda selepas semakan awal.',
  'faq.q6': 'Adakah maklumat saya selamat?',
  'faq.a6': 'Dalam versi demonstrasi ini, maklumat permohonan disimpan dalam pelayar peranti anda sendiri dan tidak dihantar ke mana-mana pelayan luar. Sebelum penerbitan rasmi, STIDC perlu menetapkan notis privasi, tempoh penyimpanan rekod dan kawalan akses pegawai.',
  'faq.q7': 'Bolehkah saya berhenti dan menyambung kemudian?',
  'faq.a7': 'Boleh. Draf permohonan disimpan secara automatik dalam pelayar anda. Buka semula portal ini pada peranti dan pelayar yang sama, dan anda akan menyambung dari langkah terakhir.',
  'faq.q8': 'Apakah spesies buluh yang ditanam di Sarawak?',
  'faq.a8': 'Antara spesies utama yang dinilai dan ditanam ialah Dendrocalamus asper (buluh betong), Gigantochloa levis (buluh beting), Gigantochloa hasskarliana (buluh beti) dan Bambusa vulgaris (buluh minyak).'
};

T.en = {
  'a11y.skip': 'Skip to main content',
  'nav.bamboo': 'About Bamboo', 'nav.agenda': 'Agenda', 'nav.program': 'Programmes',
  'nav.process': 'Process', 'nav.faq': 'FAQ', 'nav.contact': 'Contact',
  'nav.apply': 'Start Application', 'nav.home': 'Home',

  'hero.badge.tag': 'State Agenda',
  'hero.badge.text': 'Sarawak Timber Industry Development Corporation',
  'hero.h1.a': 'Plant today,', 'hero.h1.b': 'harvest a generation.',
  'hero.lede': 'Bamboo matures in three to five years, holds riverbank soil in place, and feeds raw material into Sarawak’s downstream industry. STIDC leads this agenda — and every hectare begins with one planter.',
  'hero.cta1': 'Join This Agenda', 'hero.cta2': 'Understand Sarawak Bamboo',
  'hero.note': 'Official PUSAKA forms · Automatic draft saving · Entirely free',
  'hero.panel.title': 'The Sarawak Bamboo Agenda',
  'hero.stat1': 'Target bamboo plantation area by 2030',
  'hero.stat2': 'Already planted by 17 commercial companies and over 200 community participants',
  'hero.stat3': 'Global export value of bamboo-based products, growing ~4% a year',
  'hero.panel.foot': 'Sources: public STIDC statements and Sarawak media reports, 2023–2025. Figures are indicative references, not a current official record.',

  'why.eyebrow': 'Why Bamboo',
  'why.title': 'One crop that answers three problems at once.',
  'why.sub': 'Sarawak needs sustainable raw material for its timber industry, additional income for rural communities, and ground cover that protects riverbanks. Bamboo answers all three.',
  'why.c1.t': 'Mature in 3–5 years',
  'why.c1.d': 'Where timber trees take decades, a bamboo clump can be harvested again and again without replanting — income that arrives earlier and keeps arriving.',
  'why.c2.t': 'Income for communities',
  'why.c2.d': 'The Community Bamboo Project opens the door for villages, schools and institutions to plant on land they already hold — seedlings are allocated according to the proposed area.',
  'why.c3.t': 'Protects soil and water',
  'why.c3.d': 'Dense bamboo rhizomes bind soil, reduce erosion on riverbanks and slopes, and take up carbon across the whole life of the clump.',
  'why.c4.t': 'Raw material for downstream industry',
  'why.c4.d': 'Laminated board, furniture, activated charcoal, biomass and craft products — bamboo gives Sarawak mills a renewable, plannable supply.',
  'why.c5.t': 'A growing market',
  'why.c5.d': 'Global demand for bamboo-based products keeps climbing as industry looks for low-carbon alternatives to plastic and hardwood.',
  'why.c6.t': 'Officially backed',
  'why.c6.d': 'STIDC was appointed by the Sarawak Government to lead bamboo industry development, with nurseries, technical advisory services and a state industry plan.',

  'band.eyebrow': 'Where Things Stand',
  'band.title': 'The agenda is already moving. There is still room for you.',
  'band.s1': 'The year STIDC was directed to spearhead the state bamboo industry',
  'band.s2': 'Commercial companies already in the bamboo plantation programme',
  'band.s3': 'Community participants across Sarawak',
  'band.s4': 'PUSAKA offices receiving applications: Kuching, Mukah, Sibu, Bintulu, Miri',

  'track.eyebrow': 'Ways to Take Part',
  'track.title': 'Two ways in. One shared agenda.',
  'track.sub': 'Choose the route that matches your situation. Each has its own official PUSAKA form, but both count toward the state bamboo area target.',
  'track.a.tag': 'Project A · Community', 'track.a.title': 'Community Bamboo Project',
  'track.a.desc': 'For community groups, schools and institutions planting bamboo together on village land, institutional land or land lent to them.',
  'track.a.l1': 'Minimum ten participants for each project category',
  'track.a.l2': 'Categories: Community, School or Institution',
  'track.a.l3': 'Seedlings allocated according to the proposed land area',
  'track.a.l4': 'Land-owner consent required when the land is not your own',
  'track.a.cta': 'Apply — Community Project', 'track.a.meta': 'Form STIDC.01',
  'track.b.tag': 'Project B · Commercial', 'track.b.title': 'Commercial Bamboo Plantation',
  'track.b.desc': 'For registered companies and cooperatives developing commercial-scale bamboo plantations to supply Sarawak’s downstream industry.',
  'track.b.l1': 'Company must be registered with SSM or as a cooperative',
  'track.b.l2': 'The plantation site must be within Sarawak',
  'track.b.l3': 'Owned, leased or validly rented land',
  'track.b.l4': 'EIA and FMP reports required for sites inside LPF areas',
  'track.b.cta': 'Apply — Commercial Plantation', 'track.b.meta': 'Form STIDC.10.SH.01.37',

  'proc.eyebrow': 'The Application Journey',
  'proc.title': 'Four steps, then PUSAKA takes over.',
  'proc.sub': 'The form is only the doorway. What matters is the land, the participants, and your commitment to the clump that will grow there.',
  'proc.s1.t': 'Fill in your details',
  'proc.s1.d': 'Complete the form for the route you chose. Your draft saves automatically in your browser — stop and continue later on the same device.',
  'proc.s2.t': 'Upload documents',
  'proc.s2.d': 'Drag and drop supporting documents into the Document Box. The system suggests a document type from the filename — you can always correct it before sending.',
  'proc.s3.t': 'Review and sign',
  'proc.s3.d': 'Check the summary of your application, read the applicant declaration, and add your electronic signature.',
  'proc.s4.t': 'Receive your reference number',
  'proc.s4.d': 'You receive a unique reference number and a printable receipt. PUSAKA officers will review, carry out a site inspection if needed, and contact you.',

  'portal.eyebrow': 'Application Portal', 'portal.title': 'Begin your application.',
  'portal.sub': 'Everything stays in your browser until you press submit. Fields marked <span style="color:var(--clay)">*</span> are required.',

  'faq.eyebrow': 'Frequently Asked', 'faq.title': 'The questions people ask most.',
  'office.eyebrow': 'PUSAKA Offices', 'office.title': 'Speak to the office nearest you.',
  'office.sub': 'Completed forms may be returned to headquarters or to any of the divisional offices below.',
  'office.exec': 'Bamboo Project Executive Officer',

  'footer.blurb': 'The application portal for Sarawak’s bamboo agenda — connecting community planters and commercial growers with the state bamboo programme.',
  'footer.h.program': 'Programmes', 'footer.h.help': 'Help', 'footer.h.contact': 'Contact',
  'footer.l.a': 'Community Bamboo Project', 'footer.l.b': 'Commercial Bamboo Plantation',
  'footer.l.about': 'About Sarawak Bamboo', 'footer.l.process': 'Application Process',
  'footer.l.faq': 'FAQ', 'footer.l.offices': 'PUSAKA Offices',
  'footer.l.assistant': '24/7 Digital Assistant', 'footer.l.mgmt': 'Management Access',
  'footer.hq': 'Wisma Sumber Alam, Kuching',
  'footer.disclaimer': 'This portal was built as a pro bono contribution for STIDC / PUSAKA to consider. It is not an official government system unless and until STIDC adopts and publishes it. Figures shown are drawn from public statements and media reports and should be verified before any official launch.',
  'footer.rights': '© 2026 Bamboo Sarawak — Bamboo Agenda Portal.',
  'footer.tagline': 'Built with respect for Sarawak’s communities and industry.',
  'footer.credit': 'This digital experience is part of the <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a> innovation ecosystem',

  'bubble.wa': 'Chat on WhatsApp', 'bubble.ai': '24/7 Digital Assistant',
  'as.title': 'Bamboo Assistant', 'as.status': 'Online · 24/7',
  'as.placeholder': 'Type your question…', 'as.send': 'Send',
  'as.disclaim': 'Automated assistant. For official decisions, please contact a PUSAKA office.',
  'as.greet': 'Welcome to the <b>Sarawak Bamboo Agenda Portal</b>. I can help you understand the programmes, eligibility, required documents and how to apply. What would you like to know?',
  'as.fallback': 'Sorry — I don’t have a precise answer for that yet. Try asking about <b>eligibility</b>, <b>documents</b>, <b>the process</b>, <b>bamboo species</b> or <b>offices</b> — or call PUSAKA directly on 082-473000.',

  'faq.q1': 'Is there any fee to take part?',
  'faq.a1': 'No. Applying to the PUSAKA bamboo programmes is free, and this portal is free to use. If anyone asks you to pay to have your application processed, please report it to a PUSAKA office.',
  'faq.q2': 'How many participants does the Community Bamboo Project need?',
  'faq.a2': 'A minimum of ten participants for each project category — Community, School or Institution. Copies of the identity cards of all project members must be submitted with the form.',
  'faq.q3': 'Can I apply if the land is not mine?',
  'faq.a3': 'Yes. Rented or leased land is accepted, but you need written land-use consent from the owner. The land-use consent section of the form must be signed by the landowner.',
  'faq.q4': 'How many seedlings will I receive?',
  'faq.a4': 'The number of seedlings is allocated based on the proposed land area. The species provided depends on the suitability for the bamboo industry being developed and current stock at PUSAKA nurseries.',
  'faq.q5': 'How long does approval take?',
  'faq.a5': 'The actual timeline is determined by PUSAKA and depends on site inspection and how complete your documents are. This portal cannot promise a fixed period. An officer will contact you after the initial review.',
  'faq.q6': 'Is my information secure?',
  'faq.a6': 'In this demonstration version, application data is stored in your own device’s browser and is not sent to any external server. Before an official launch, STIDC would need to set the privacy notice, record retention period and officer access controls.',
  'faq.q7': 'Can I stop and continue later?',
  'faq.a7': 'Yes. Your draft is saved automatically in your browser. Reopen this portal on the same device and browser and you will resume from your last step.',
  'faq.q8': 'Which bamboo species are planted in Sarawak?',
  'faq.a8': 'The main species being evaluated and planted include Dendrocalamus asper (buluh betong), Gigantochloa levis (buluh beting), Gigantochloa hasskarliana (buluh beti) and Bambusa vulgaris (buluh minyak).'
};

T.zh = {
  'a11y.skip': '跳转至主要内容',
  'nav.bamboo': '认识竹子', 'nav.agenda': '议程', 'nav.program': '计划',
  'nav.process': '流程', 'nav.faq': '常见问题', 'nav.contact': '联络',
  'nav.apply': '开始申请', 'nav.home': '首页',

  'hero.badge.tag': '州级议程', 'hero.badge.text': '砂拉越木材工业发展局',
  'hero.h1.a': '今日种下，', 'hero.h1.b': '收获一个世代。',
  'hero.lede': '竹子三至五年即可成材，能固住河岸泥土，并为砂拉越下游工业提供原料。STIDC 主导这项议程——而每一公顷，都始于一位种植者。',
  'hero.cta1': '加入这项议程', 'hero.cta2': '认识砂拉越竹子',
  'hero.note': 'PUSAKA 官方表格 · 草稿自动保存 · 完全免费',
  'hero.panel.title': '砂拉越竹业议程',
  'hero.stat1': '2030 年前的竹林种植面积目标',
  'hero.stat2': '已由 17 家商业公司与逾 200 名社区参与者种植',
  'hero.stat3': '全球竹制品出口值，年增长约 4%',
  'hero.panel.foot': '资料来源：STIDC 公开声明与砂拉越媒体报道，2023–2025 年。数字为参考估值，非最新官方记录。',

  'why.eyebrow': '为何选择竹子',
  'why.title': '一种作物，同时回应三个难题。',
  'why.sub': '砂拉越需要可持续的木材工业原料、乡区社群的额外收入，以及保护河岸的地表植被。竹子三者兼顾。',
  'why.c1.t': '三至五年即可成材',
  'why.c1.d': '相较于需时数十年的木材树种，竹丛可反复采收而无需重新种植——收入来得更早，也更持久。',
  'why.c2.t': '为社区带来收入',
  'why.c2.d': '社区竹林计划让乡村、学校与机构在现有土地上种植——竹苗按建议面积分配。',
  'why.c3.t': '保护水土',
  'why.c3.d': '竹子茂密的地下茎能牢牢固土，减少河岸与斜坡的侵蚀，并在整个生长周期中吸收碳。',
  'why.c4.t': '下游工业原料',
  'why.c4.d': '积成材、家具、活性炭、生物质与工艺品——竹子为砂拉越工厂提供可再生、可规划的供应。',
  'why.c5.t': '持续扩大的市场',
  'why.c5.d': '当工业界寻找塑料与硬木的低碳替代品时，全球对竹制品的需求持续攀升。',
  'why.c6.t': '获官方支持',
  'why.c6.d': 'STIDC 获砂拉越政府委任主导竹业发展，设有苗圃、技术咨询服务与州级产业规划。',

  'band.eyebrow': '目前进展',
  'band.title': '议程已经启动。你的位置仍然敞开。',
  'band.s1': 'STIDC 受命主导州竹业发展的年份',
  'band.s2': '已参与竹林种植计划的商业公司',
  'band.s3': '遍布砂拉越的社区参与者',
  'band.s4': '受理申请的 PUSAKA 办事处：古晋、慕禄、诗巫、民都鲁、美里',

  'track.eyebrow': '参与途径',
  'track.title': '两条入口，同一项议程。',
  'track.sub': '选择符合你情况的途径。每条途径都有各自的 PUSAKA 官方表格，但两者同样计入州竹林面积目标。',
  'track.a.tag': '计划 A · 社区', 'track.a.title': '社区竹林计划',
  'track.a.desc': '适合社区团体、学校与机构，在村落土地、机构土地或借用土地上集体种竹。',
  'track.a.l1': '每个计划类别最少十名参与者',
  'track.a.l2': '类别：社区、学校或机构',
  'track.a.l3': '竹苗按建议土地面积分配',
  'track.a.l4': '若土地非自有，须取得土地使用同意书',
  'track.a.cta': '申请社区计划', 'track.a.meta': '表格 STIDC.01',
  'track.b.tag': '计划 B · 商业', 'track.b.title': '商业竹林种植',
  'track.b.desc': '适合已注册的公司与合作社，发展商业规模竹林以供应砂拉越下游工业。',
  'track.b.l1': '公司须在 SSM 注册或为注册合作社',
  'track.b.l2': '种植地点必须位于砂拉越境内',
  'track.b.l3': '自有、租赁或合法承租的土地',
  'track.b.l4': '位于 LPF 范围的地段须提交 EIA 与 FMP 报告',
  'track.b.cta': '申请商业种植', 'track.b.meta': '表格 STIDC.10.SH.01.37',

  'proc.eyebrow': '申请历程',
  'proc.title': '四个步骤，之后交由 PUSAKA 接手。',
  'proc.sub': '表格只是入口。真正重要的是土地、参与者，以及你对那片将要长起来的竹丛的承诺。',
  'proc.s1.t': '填写资料',
  'proc.s1.d': '按所选途径填写表格。草稿会自动保存在你的浏览器中——可随时中断，稍后在同一台设备继续。',
  'proc.s2.t': '上传文件',
  'proc.s2.d': '将佐证文件拖放进文件箱。系统会依文件名建议文件类型——提交前你随时可以更正。',
  'proc.s3.t': '核对并签名',
  'proc.s3.d': '核对申请摘要，阅读申请人声明，并签下你的电子签名。',
  'proc.s4.t': '取得参考编号',
  'proc.s4.d': '你将获得唯一参考编号与可打印收据。PUSAKA 官员将进行审核，必要时安排实地考察，并与你联系。',

  'portal.eyebrow': '申请入口', 'portal.title': '开始你的申请。',
  'portal.sub': '在你按下提交之前，所有资料都只留在你的浏览器中。标示 <span style="color:var(--clay)">*</span> 的栏位为必填。',

  'faq.eyebrow': '常见问题', 'faq.title': '大家最常问的问题。',
  'office.eyebrow': 'PUSAKA 办事处', 'office.title': '联络离你最近的办事处。',
  'office.sub': '填妥的表格可交回总部或以下任何一间分处。',
  'office.exec': '竹林计划执行官',

  'footer.blurb': '砂拉越竹业议程的申请入口——连接社区种植者、商业种植商与州竹林计划。',
  'footer.h.program': '计划', 'footer.h.help': '协助', 'footer.h.contact': '联络',
  'footer.l.a': '社区竹林计划', 'footer.l.b': '商业竹林种植',
  'footer.l.about': '认识砂拉越竹子', 'footer.l.process': '申请流程',
  'footer.l.faq': '常见问题', 'footer.l.offices': 'PUSAKA 办事处',
  'footer.l.assistant': '24/7 数码助手', 'footer.l.mgmt': '管理层登入',
  'footer.hq': 'Wisma Sumber Alam，古晋',
  'footer.disclaimer': '本入口网站为无偿贡献，供 STIDC / PUSAKA 参考。除非经 STIDC 采纳并正式发布，否则并非官方政府系统。所示数字取自公开声明与媒体报道，正式发布前须经核实。',
  'footer.rights': '© 2026 Bamboo Sarawak — 竹业议程入口。',
  'footer.tagline': '怀着敬意，为砂拉越的社群与工业而建。',
  'footer.credit': '此数码体验是 <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a> 创新生态系统的一部分',

  'bubble.wa': '透过 WhatsApp 洽谈', 'bubble.ai': '24/7 数码助手',
  'as.title': '竹业助手', 'as.status': '在线 · 24/7',
  'as.placeholder': '输入你的问题…', 'as.send': '发送',
  'as.disclaim': '自动助手。正式决定请联络 PUSAKA 办事处。',
  'as.greet': '欢迎来到<b>砂拉越竹业议程入口</b>。我可以协助你了解计划内容、申请资格、所需文件与申请方式。你想了解什么？',
  'as.fallback': '抱歉，我暂时没有确切的答案。可以试着询问<b>资格</b>、<b>文件</b>、<b>流程</b>、<b>竹种</b>或<b>办事处</b>——或直接致电 PUSAKA：082-473000。',

  'faq.q1': '参与需要缴费吗？',
  'faq.a1': '不需要。申请 PUSAKA 竹业计划是免费的，本入口网站也免费使用。若有人要求你付费处理申请，请向 PUSAKA 办事处举报。',
  'faq.q2': '社区竹林计划需要多少名参与者？',
  'faq.a2': '每个计划类别最少十名参与者——社区、学校或机构。所有计划成员的身份证副本须随表格一同提交。',
  'faq.q3': '土地不是我的，可以申请吗？',
  'faq.a3': '可以。租赁或承租土地都获接受，但你需要取得土地拥有者的书面使用同意书。表格中的土地使用同意栏位须由地主签署。',
  'faq.q4': '我会获得多少株竹苗？',
  'faq.a4': '竹苗数量按建议土地面积分配。所提供的竹种则视所发展的竹业适用性与 PUSAKA 苗圃的现有存量而定。',
  'faq.q5': '批准需要多长时间？',
  'faq.a5': '实际时程由 PUSAKA 决定，取决于实地考察与文件的完整程度。本入口网站无法承诺固定期限。初步审核后将有官员与你联系。',
  'faq.q6': '我的资料安全吗？',
  'faq.a6': '在此示范版本中，申请资料保存在你自己设备的浏览器内，不会传送到任何外部服务器。正式发布前，STIDC 须订定隐私声明、记录保存期限与官员存取权限。',
  'faq.q7': '可以中断后再继续吗？',
  'faq.a7': '可以。草稿会自动保存在你的浏览器中。在同一台设备与浏览器重新开启本入口，即可从上次的步骤继续。',
  'faq.q8': '砂拉越种植哪些竹种？',
  'faq.a8': '主要评估与种植的竹种包括 Dendrocalamus asper（buluh betong）、Gigantochloa levis（buluh beting）、Gigantochloa hasskarliana（buluh beti）与 Bambusa vulgaris（buluh minyak）。'
};

T.ib = {
  'a11y.skip': 'Terus ngagai isi utai',
  'nav.bamboo': 'Pasal Buluh', 'nav.agenda': 'Agenda', 'nav.program': 'Program',
  'nav.process': 'Chara', 'nav.faq': 'Tanya Suah', 'nav.contact': 'Betemu Kami',
  'nav.apply': 'Berengkah Minta', 'nav.home': 'Laman Utai',

  'hero.badge.tag': 'Agenda Menua',
  'hero.badge.text': 'Perbadanan Kemajuan Perusahaan Kayu Sarawak',
  'hero.h1.a': 'Nanam sehari tu,', 'hero.h1.b': 'ngetau se-turun.',
  'hero.lede': 'Buluh masak dalam tiga ngagai lima taun, negapka tanah ba tebing sungai, lalu meri bahan mentah ngagai industri hilir Sarawak. STIDC ke mimpin agenda tu — lalu tiap-tiap hektar berengkah ari siku orang ke nanam.',
  'hero.cta1': 'Enggau Agenda Tu', 'hero.cta2': 'Nemu Buluh Sarawak',
  'hero.note': 'Borang resmi PUSAKA · Draf disimpan empu · Nadai bayar',
  'hero.panel.title': 'Agenda Buluh Sarawak',
  'hero.stat1': 'Sasar luas tanam buluh sebedau taun 2030',
  'hero.stat2': 'Udah ditanam 17 iti kompeni komersial enggau lebih 200 iku peserta komuniti',
  'hero.stat3': 'Rega eksport utai digaga ari buluh di dunya, tambah kira 4% setaun',
  'hero.panel.foot': 'Pun berita: jaku resmi STIDC enggau laporan media Sarawak, 2023–2025. Angka tu anggaran aja, ukai rekod resmi ke terubah.',

  'why.eyebrow': 'Nama Kebuah Buluh',
  'why.title': 'Siti utai tanam ke nyaut tiga penanggul serempak.',
  'why.sub': 'Sarawak ibuh bahan mentah ke tan lama ngagai industri kayu, pendapat tambah ngagai komuniti ba menua pesisir, enggau utai ke nutup tanah lalu nyaga tebing sungai. Buluh nyaut semua tiga.',
  'why.c1.t': 'Masak dalam 3–5 taun',
  'why.c1.d': 'Kayu balak ibuh puluh taun, tang rumpun buluh ulih ditetak baru-baru nadai ibuh nanam baru — pendapat ke datai kelia agi lalu terus bejalai.',
  'why.c2.t': 'Pendapat ngagai komuniti',
  'why.c2.d': 'Projek Buluh Komuniti muka jalai ngagai rumah panjai, sekula enggau institusi nanam ba tanah ke udah dikemisi — anak buluh dibagi nitihka luas tanah ke dipadah.',
  'why.c3.t': 'Nyaga tanah enggau ai',
  'why.c3.d': 'Urat buluh ke tebal negapka tanah, ngurangka tanah rerak ba tebing sungai enggau ba bukit, lalu nyerap karbon sepemanjai pengidup iya.',
  'why.c4.t': 'Bahan mentah industri hilir',
  'why.c4.d': 'Papan lamina, perabung, arang aktif, biomas enggau utai kraf — buluh meri kilang Sarawak bekal ke ulih diambi baru lalu ulih dirancang.',
  'why.c5.t': 'Pasar ke besai agi',
  'why.c5.d': 'Peminta dunya ngagai utai digaga ari buluh terus tambah lebuh industri ngiga ganti plastik enggau kayu keras ke kurang karbon.',
  'why.c6.t': 'Disukung resmi',
  'why.c6.d': 'STIDC diletak Perintah Sarawak mimpin pemansang industri buluh, enggau tapak semaian, tulung teknikal enggau pelan industri menua.',

  'band.eyebrow': 'Pengelama Diatu',
  'band.title': 'Agenda tu udah bejalai. Endur ke nuan agi terbuka.',
  'band.s1': 'Taun STIDC diasuh mimpin pemansang industri buluh menua',
  'band.s2': 'Kompeni komersial ke udah enggau program ladang buluh',
  'band.s3': 'Peserta komuniti seSarawak',
  'band.s4': 'Opis PUSAKA ke nerima peminta: Kuching, Mukah, Sibu, Bintulu, Miri',

  'track.eyebrow': 'Jalai Enggau',
  'track.title': 'Dua jalai tama. Siti agenda ke sama.',
  'track.sub': 'Pilih jalai ke ngena penatai nuan. Tiap-tiap jalai bisi borang resmi PUSAKA empu, tang dua-dua nulung nyampai sasar luas buluh menua.',
  'track.a.tag': 'Projek A · Komuniti', 'track.a.title': 'Projek Buluh Komuniti',
  'track.a.desc': 'Ngagai kumpulan komuniti, sekula enggau institusi ke deka nanam buluh sama-sama ba tanah rumah panjai, tanah institusi tauka tanah ke dipinjam.',
  'track.a.l1': 'Sekurang-kurang 10 iku peserta ba tiap-tiap kategori projek',
  'track.a.l2': 'Kategori: Komuniti, Sekula tauka Institusi',
  'track.a.l3': 'Anak buluh dibagi nitihka luas tanah ke dipadah',
  'track.a.l4': 'Surat izin ngena tanah ibuh enti tanah ukai empu diri',
  'track.a.cta': 'Minta Projek Komuniti', 'track.a.meta': 'Borang STIDC.01',
  'track.b.tag': 'Projek B · Komersial', 'track.b.title': 'Ladang Buluh Komersial',
  'track.b.desc': 'Ngagai kompeni enggau koperasi ke udah bedaftar ke deka ngaga ladang buluh besai ngambi meri bekal ngagai industri hilir Sarawak.',
  'track.b.l1': 'Kompeni mesti bedaftar enggau SSM tauka nyadi koperasi',
  'track.b.l2': 'Tapak ladang mesti ba dalam menua Sarawak',
  'track.b.l3': 'Tanah empu diri, pajak tauka sewa ke betul',
  'track.b.l4': 'Laporan EIA enggau FMP ibuh enti tapak ba kawasan LPF',
  'track.b.cta': 'Minta Ladang Komersial', 'track.b.meta': 'Borang STIDC.10.SH.01.37',

  'proc.eyebrow': 'Jalai Peminta',
  'proc.title': 'Empat tikas, udah nya PUSAKA ke neruska.',
  'proc.sub': 'Borang tu semina pintu tama. Ti beguna nya tanah, peserta enggau ati nuan ngagai rumpun ke deka tumbuh dia.',
  'proc.s1.t': 'Isi berita nuan',
  'proc.s1.d': 'Isi borang nitihka jalai ke dipilih. Draf disimpan empu dalam pelayar nuan — ulih badu lalu nerus baru ba alat ke sama.',
  'proc.s2.t': 'Muat naik surat',
  'proc.s2.d': 'Tarit lalu lepas surat sukung ke dalam Peti Surat. Sistem madah jenis surat nitihka nama fail — nuan ulih mbetulka iya sebedau ngirim.',
  'proc.s3.t': 'Peda baru lalu andal',
  'proc.s3.d': 'Peda baru ringkas peminta nuan, bacha perakuan peminta, lalu turunka tanda jari elektronik nuan.',
  'proc.s4.t': 'Nerima nombor rujuk',
  'proc.s4.d': 'Nuan nerima nombor rujuk ke siti aja enggau resit ke ulih dichitak. Pegawai PUSAKA deka meda, ngambi naziran tapak enti ibuh, lalu betemu enggau nuan.',

  'portal.eyebrow': 'Portal Peminta', 'portal.title': 'Berengkah peminta nuan.',
  'portal.sub': 'Semua berita bediau dalam pelayar nuan sampai nuan nekan kirim. Ruang bertanda <span style="color:var(--clay)">*</span> nya ibuh diisi.',

  'faq.eyebrow': 'Tanya Suah', 'faq.title': 'Utai ke suah ditanya orang.',
  'office.eyebrow': 'Opis PUSAKA', 'office.title': 'Bejaku enggau pegawai ke semak nuan.',
  'office.sub': 'Borang ke udah penuh ulih dipulaika ngagai Opis Besai tauka opis bahagi di baruh tu.',
  'office.exec': 'Pegawai Eksekutif Projek Buluh',

  'footer.blurb': 'Portal peminta ngagai agenda buluh Sarawak — nyambung orang ke nanam ba komuniti enggau pengusaha komersial ngagai program tanam buluh menua.',
  'footer.h.program': 'Program', 'footer.h.help': 'Tulung', 'footer.h.contact': 'Betemu',
  'footer.l.a': 'Projek Buluh Komuniti', 'footer.l.b': 'Ladang Buluh Komersial',
  'footer.l.about': 'Pasal Buluh Sarawak', 'footer.l.process': 'Chara Minta',
  'footer.l.faq': 'Tanya Suah', 'footer.l.offices': 'Opis PUSAKA',
  'footer.l.assistant': 'Penulung Digital 24/7', 'footer.l.mgmt': 'Akses Pengurus',
  'footer.hq': 'Wisma Sumber Alam, Kuching',
  'footer.disclaimer': 'Portal tu digaga nyadi sumbang pro bono ngagai STIDC / PUSAKA dipeda. Iya ukai sistem resmi perintah sebedau STIDC nerima lalu nerbitka iya. Angka ke dipandang diambi ari jaku resmi enggau laporan media, lalu ibuh dipastika sebedau diterbit resmi.',
  'footer.rights': '© 2026 Bamboo Sarawak — Portal Agenda Buluh.',
  'footer.tagline': 'Digaga enggau basa ngagai komuniti enggau industri Sarawak.',
  'footer.credit': 'Pengalaman digital tu nyadi sebagi ari ekosistem inovasi <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a>',

  'bubble.wa': 'Bejaku ba WhatsApp', 'bubble.ai': 'Penulung Digital 24/7',
  'as.title': 'Penulung Buluh', 'as.status': 'Bisi · 24/7',
  'as.placeholder': 'Tulis tanya nuan…', 'as.send': 'Kirim',
  'as.disclaim': 'Penulung automatik. Ngagai keputusan resmi, betemu enggau opis PUSAKA.',
  'as.greet': 'Selamat datai ba <b>Portal Agenda Buluh Sarawak</b>. Aku ulih nulung nuan nemu program, sarat kelayakan, surat ke ibuh enggau chara minta. Nama ke deka ditemu nuan?',
  'as.fallback': 'Ampun, aku apin bisi saut ke betul ngagai tanya nya. Uji tanya pasal <b>kelayakan</b>, <b>surat</b>, <b>chara</b>, <b>jenis buluh</b> tauka <b>opis</b> — tauka terus telefon PUSAKA ba 082-473000.',

  'faq.q1': 'Bisi bayar enti deka enggau?',
  'faq.a1': 'Nadai. Minta ngagai program buluh PUSAKA nya percuma, lalu portal tu mega percuma dikena. Enti bisi orang minta duit ngambi ngurus peminta nuan, padah ngagai opis PUSAKA.',
  'faq.q2': 'Berapa iku peserta ibuh ngagai Projek Buluh Komuniti?',
  'faq.a2': 'Sekurang-kurang sepuluh iku peserta ba tiap-tiap kategori projek — Komuniti, Sekula tauka Institusi. Salin kad pengenal semua ahli projek ibuh dikirim sama enggau borang.',
  'faq.q3': 'Ulih ka aku minta enti tanah nya ukai empu aku?',
  'faq.a3': 'Ulih. Tanah sewa tauka pajak diterima, tang nuan ibuh bulih surat izin ngena tanah ari tuan tanah. Bagi izin ngena tanah dalam borang ibuh diandal tuan tanah.',
  'faq.q4': 'Berapa iti anak buluh deka diterima aku?',
  'faq.a4': 'Bilang anak buluh dibagi nitihka luas tanah ke dipadah. Jenis buluh ke dibagi nitihka pengelurus enggau industri buluh ke dikembang enggau stok ke bisi ba tapak semaian PUSAKA.',
  'faq.q5': 'Berapa lama chara nyetuju tu?',
  'faq.a5': 'Pengelama ti amat ditentu PUSAKA lalu bekaul enggau naziran tapak sereta pengelengkap surat. Portal tu enda ulih besemaya ngena tempuh ke tetap. Pegawai deka betemu enggau nuan udah peda pengawal.',
  'faq.q6': 'Kati berita aku aman?',
  'faq.a6': 'Ba versi peda tu, berita peminta disimpan dalam pelayar alat nuan empu lalu enda dikirim ngagai server luar. Sebedau diterbit resmi, STIDC ibuh netapka notis privasi, tempuh simpan rekod enggau kawal akses pegawai.',
  'faq.q7': 'Ulih ka aku badu dulu lalu nerus udah nya?',
  'faq.a7': 'Ulih. Draf peminta disimpan empu dalam pelayar nuan. Buka baru portal tu ba alat enggau pelayar ke sama, lalu nuan deka nerus ari tikas ti penudi.',
  'faq.q8': 'Nama jenis buluh ke ditanam ba Sarawak?',
  'faq.a8': 'Jenis ti utama ke dinilai lalu ditanam nya Dendrocalamus asper (buluh betong), Gigantochloa levis (buluh beting), Gigantochloa hasskarliana (buluh beti) enggau Bambusa vulgaris (buluh minyak).'
};

window.BAMBOO_T = T;

/* ─── i18n engine ───────────────────────────────────────────── */
var currentLang = 'ms';
var langSubscribers = [];

function t(key) {
  var dict = T[currentLang] || T.ms;
  if (dict[key] !== undefined) return dict[key];
  if (T.ms[key] !== undefined) return T.ms[key];
  return key;
}

function applyLanguage(lang) {
  if (!T[lang]) lang = 'ms';
  currentLang = lang;
  var dict = T[lang];

  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var v = dict[el.getAttribute('data-i18n')];
    if (v === undefined) v = T.ms[el.getAttribute('data-i18n')];
    if (v === undefined) return;
    if (/<[a-z][\s\S]*>/i.test(v)) el.innerHTML = v; else el.textContent = v;
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
    var v = dict[el.getAttribute('data-i18n-ph')] || T.ms[el.getAttribute('data-i18n-ph')];
    if (v !== undefined) el.setAttribute('placeholder', v);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
    var v = dict[el.getAttribute('data-i18n-aria')] || T.ms[el.getAttribute('data-i18n-aria')];
    if (v !== undefined) el.setAttribute('aria-label', v);
  });

  document.querySelectorAll('.nav-lang button').forEach(function (b) {
    b.classList.toggle('active', b.dataset.lang === lang);
    b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
  });

  document.documentElement.lang = lang === 'ib' ? 'ms' : (lang === 'zh' ? 'zh-Hans' : lang);
  try { localStorage.setItem(CONFIG.langKey, lang); } catch (e) {}

  langSubscribers.forEach(function (fn) { try { fn(lang); } catch (e) {} });
}

function onLanguageChange(fn) { langSubscribers.push(fn); }

window.BAMBOO_I18N = { t: t, apply: applyLanguage, onChange: onLanguageChange,
  get lang() { return currentLang; } };

/* ─── Small helpers ─────────────────────────────────────────── */
function el(tag, cls, html) {
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
}
function esc(s) {
  return String(s === null || s === undefined ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
window.BAMBOO_UTIL = { el: el, esc: esc };

function toast(message) {
  var zone = document.getElementById('toastZone');
  if (!zone) return;
  var node = el('div', 'toast',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg><span>' + esc(message) + '</span>');
  zone.appendChild(node);
  setTimeout(function () {
    node.classList.add('leaving');
    setTimeout(function () { node.remove(); }, 320);
  }, 2900);
}
window.BAMBOO_TOAST = toast;

/* ─── Navigation ────────────────────────────────────────────── */
function initNav() {
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  if (nav && !nav.classList.contains('solid')) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });
}

/* ─── Reveal on scroll ──────────────────────────────────────── */
function initReveal(root) {
  var nodes = (root || document).querySelectorAll('.reveal:not(.visible)');
  if (!nodes.length) return;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    nodes.forEach(function (n) { n.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  nodes.forEach(function (n) { io.observe(n); });
}
window.BAMBOO_REVEAL = initReveal;

/* ─── Species marquee ───────────────────────────────────────── */
function initSpecies() {
  var track = document.getElementById('speciesTrack');
  if (!track) return;
  var html = SPECIES.map(function (s) {
    return '<span><i>' + esc(s.latin) + '</i> ' + esc(s.local) + '</span>';
  }).join('');
  track.innerHTML = html + html; // duplicated for seamless loop
}

/* ─── FAQ ───────────────────────────────────────────────────── */
function initFaq() {
  var host = document.getElementById('faqList');
  if (!host) return;
  var html = '';
  for (var i = 1; i <= 8; i++) {
    html += '<details><summary data-i18n="faq.q' + i + '"></summary>' +
            '<p data-i18n="faq.a' + i + '"></p></details>';
  }
  host.innerHTML = html;
}

/* ─── Offices ───────────────────────────────────────────────── */
function initOffices() {
  var host = document.getElementById('officeGrid');
  if (!host) return;
  host.innerHTML = OFFICES.map(function (o) {
    var tels = o.tels.map(function (n) {
      return '<a href="tel:' + n.replace(/-/g, '') + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
        esc(n) + '</a>';
    }).join('');
    var note = o.noteKey ? '<div class="hint" style="margin-top:6px;font-size:.72rem;color:var(--ink-mute)" data-i18n="' + o.noteKey + '"></div>' : '';
    return '<article class="office"><div class="city">' + esc(o.city) + '</div>' +
           '<h4>' + esc(o.name) + '</h4>' + tels + note + '</article>';
  }).join('');
}

/* ─── Assistant knowledge base ──────────────────────────────── */
var KB = [
  { id: 'eligibility',
    kw: ['layak','kelayakan','syarat','eligib','qualify','requirement','sarat','资格','条件','符合'],
    ans: {
      ms: 'Kelayakan bergantung pada laluan:<ul><li><b>Projek Buluh Komuniti</b> — kumpulan komuniti, sekolah atau institusi, dengan minimum <b>10 orang peserta</b>.</li><li><b>Ladang Buluh Komersial</b> — syarikat berdaftar SSM atau koperasi, tapak dalam Sarawak, tanah milik sendiri / pajakan / sewa.</li></ul>',
      en: 'Eligibility depends on the route:<ul><li><b>Community Bamboo Project</b> — community groups, schools or institutions, with a minimum of <b>10 participants</b>.</li><li><b>Commercial Bamboo Plantation</b> — SSM-registered companies or cooperatives, site within Sarawak, land owned / leased / rented.</li></ul>',
      zh: '资格视途径而定：<ul><li><b>社区竹林计划</b>——社区团体、学校或机构，最少 <b>10 名参与者</b>。</li><li><b>商业竹林种植</b>——SSM 注册公司或合作社，地点在砂拉越境内，土地自有／租赁／承租。</li></ul>',
      ib: 'Kelayakan bekaul enggau jalai:<ul><li><b>Projek Buluh Komuniti</b> — kumpulan komuniti, sekula tauka institusi, sekurang-kurang <b>10 iku peserta</b>.</li><li><b>Ladang Buluh Komersial</b> — kompeni bedaftar SSM tauka koperasi, tapak ba Sarawak, tanah empu / pajak / sewa.</li></ul>'
    }},
  { id: 'documents',
    kw: ['dokumen','document','surat','borang','form','ic','kad pengenalan','geran','文件','表格','证件'],
    ans: {
      ms: 'Dokumen yang biasa diperlukan:<ul><li><b>Komuniti</b> — salinan kad pengenalan semua ahli projek, dokumen tanah, dan kebenaran guna tanah jika tanah bukan milik sendiri.</li><li><b>Komersial</b> — profil syarikat, Borang 9/24/49, M&A atau perlembagaan koperasi, dokumen status tanah, peta kawasan, serta laporan EIA dan FMP bagi tapak di kawasan LPF.</li></ul>',
      en: 'Documents usually required:<ul><li><b>Community</b> — identity card copies for all project members, land documents, and land-use consent if the land is not your own.</li><li><b>Commercial</b> — company profile, Forms 9/24/49, M&A or cooperative constitution, land status documents, area map, plus EIA and FMP reports for sites in LPF areas.</li></ul>',
      zh: '通常需要的文件：<ul><li><b>社区</b>——所有计划成员的身份证副本、土地文件，以及土地非自有时的使用同意书。</li><li><b>商业</b>——公司简介、表格 9/24/49、公司章程或合作社章程、土地状态文件、地段地图，以及 LPF 范围内地段的 EIA 与 FMP 报告。</li></ul>',
      ib: 'Surat ke suah ibuh:<ul><li><b>Komuniti</b> — salin kad pengenal semua ahli projek, surat tanah, enggau izin ngena tanah enti tanah ukai empu diri.</li><li><b>Komersial</b> — profil kompeni, Borang 9/24/49, M&A tauka perlembagaan koperasi, surat status tanah, peta kawasan, enggau laporan EIA sereta FMP ngagai tapak ba kawasan LPF.</li></ul>'
    }},
  { id: 'participants',
    kw: ['10','sepuluh','peserta','ahli','participant','member','ten','十','成员','参与者'],
    ans: {
      ms: 'Projek Buluh Komuniti memerlukan <b>minimum 10 orang peserta</b> bagi setiap kategori projek — Komuniti, Sekolah atau Institusi. Salinan kad pengenalan semua ahli perlu disertakan.',
      en: 'The Community Bamboo Project requires a <b>minimum of 10 participants</b> for each project category — Community, School or Institution. Identity card copies for all members must be included.',
      zh: '社区竹林计划每个类别都需要<b>最少 10 名参与者</b>——社区、学校或机构。须附上所有成员的身份证副本。',
      ib: 'Projek Buluh Komuniti ibuh <b>sekurang-kurang 10 iku peserta</b> ba tiap-tiap kategori projek — Komuniti, Sekula tauka Institusi. Salin kad pengenal semua ahli ibuh disertaka.'
    }},
  { id: 'species',
    kw: ['spesies','species','jenis buluh','betong','beting','beti','minyak','品种','竹种','什么竹'],
    ans: {
      ms: 'Spesies utama yang dinilai dan ditanam di Sarawak termasuk <b>Dendrocalamus asper</b> (buluh betong), <b>Gigantochloa levis</b> (buluh beting), <b>Gigantochloa hasskarliana</b> (buluh beti) dan <b>Bambusa vulgaris</b> (buluh minyak). Spesies yang diperuntukkan bergantung kepada stok semasa tapak semaian PUSAKA.',
      en: 'The main species evaluated and planted in Sarawak include <b>Dendrocalamus asper</b> (buluh betong), <b>Gigantochloa levis</b> (buluh beting), <b>Gigantochloa hasskarliana</b> (buluh beti) and <b>Bambusa vulgaris</b> (buluh minyak). What you receive depends on current PUSAKA nursery stock.',
      zh: '砂拉越主要评估与种植的竹种包括 <b>Dendrocalamus asper</b>（buluh betong）、<b>Gigantochloa levis</b>（buluh beting）、<b>Gigantochloa hasskarliana</b>（buluh beti）与 <b>Bambusa vulgaris</b>（buluh minyak）。实际分配视 PUSAKA 苗圃存量而定。',
      ib: 'Jenis ti utama ke dinilai lalu ditanam ba Sarawak nya <b>Dendrocalamus asper</b> (buluh betong), <b>Gigantochloa levis</b> (buluh beting), <b>Gigantochloa hasskarliana</b> (buluh beti) enggau <b>Bambusa vulgaris</b> (buluh minyak). Jenis ke dibagi bekaul enggau stok tapak semaian PUSAKA.'
    }},
  { id: 'cost',
    kw: ['bayar','kos','yuran','fee','cost','price','free','percuma','duit','harga','费用','收费','免费'],
    ans: {
      ms: 'Permohonan adalah <b>percuma sepenuhnya</b>. Portal ini juga percuma. Jika ada pihak meminta bayaran untuk memproses permohonan anda, sila laporkan kepada pejabat PUSAKA.',
      en: 'Applying is <b>completely free</b>, and so is this portal. If anyone asks you to pay to have your application processed, please report it to a PUSAKA office.',
      zh: '申请<b>完全免费</b>，本入口网站也免费。若有人要求付费处理你的申请，请向 PUSAKA 办事处举报。',
      ib: 'Peminta tu <b>percuma magang</b>. Portal tu mega percuma. Enti bisi orang minta duit ngambi ngurus peminta nuan, padah ngagai opis PUSAKA.'
    }},
  { id: 'process',
    kw: ['proses','process','langkah','step','cara','how to apply','chara','apply','mohon','流程','怎么申请','步骤'],
    ans: {
      ms: 'Empat langkah: <b>1)</b> isi maklumat mengikut laluan anda, <b>2)</b> muat naik dokumen ke Kotak Dokumen, <b>3)</b> semak ringkasan dan turunkan tandatangan, <b>4)</b> terima nombor rujukan dan resit boleh cetak. Selepas itu pegawai PUSAKA akan menyemak dan menghubungi anda.',
      en: 'Four steps: <b>1)</b> fill in the details for your route, <b>2)</b> upload documents into the Document Box, <b>3)</b> review the summary and sign, <b>4)</b> receive a reference number and printable receipt. PUSAKA officers then review and contact you.',
      zh: '四个步骤：<b>1)</b> 按所选途径填写资料，<b>2)</b> 将文件上传至文件箱，<b>3)</b> 核对摘要并签名，<b>4)</b> 取得参考编号与可打印收据。之后 PUSAKA 官员会审核并与你联系。',
      ib: 'Empat tikas: <b>1)</b> isi berita nitihka jalai nuan, <b>2)</b> muat naik surat ngagai Peti Surat, <b>3)</b> peda ringkas lalu andal, <b>4)</b> nerima nombor rujuk enggau resit ke ulih dichitak. Udah nya pegawai PUSAKA deka meda lalu betemu enggau nuan.'
    }},
  { id: 'timeline',
    kw: ['lama','berapa lama','tempoh','how long','duration','bila','when','approval','kelulusan','多久','时间','批准'],
    ans: {
      ms: 'Tempoh kelulusan ditentukan oleh PUSAKA dan bergantung kepada naziran tapak serta kelengkapan dokumen. Portal ini <b>tidak boleh menjanjikan tempoh tertentu</b>. Pegawai akan menghubungi anda selepas semakan awal.',
      en: 'The approval timeline is set by PUSAKA and depends on site inspection and how complete your documents are. This portal <b>cannot promise a fixed period</b>. An officer will contact you after the initial review.',
      zh: '批准时程由 PUSAKA 决定，取决于实地考察与文件完整度。本入口网站<b>无法承诺固定期限</b>。初步审核后会有官员与你联系。',
      ib: 'Pengelama nyetuju ditentu PUSAKA lalu bekaul enggau naziran tapak sereta pengelengkap surat. Portal tu <b>enda ulih besemaya tempuh ke tetap</b>. Pegawai deka betemu enggau nuan udah peda pengawal.'
    }},
  { id: 'land',
    kw: ['tanah','land','geran','lot','sewa','pajak','pemilik','owner','consent','kebenaran','土地','地契','租'],
    ans: {
      ms: 'Tanah boleh <b>milik sendiri, pajakan atau sewaan</b>. Jika tanah bukan milik anda, bahagian <b>kebenaran guna tanah</b> dalam borang perlu ditandatangani oleh pemilik tanah. Bagi laluan komersial, tapak mesti berada dalam negeri Sarawak.',
      en: 'Land may be <b>owned, leased or rented</b>. If the land is not yours, the <b>land-use consent</b> section of the form must be signed by the landowner. For the commercial route, the site must be within Sarawak.',
      zh: '土地可以是<b>自有、租赁或承租</b>。若土地非你所有，表格中的<b>土地使用同意</b>栏位须由地主签署。商业途径的地点必须位于砂拉越境内。',
      ib: 'Tanah ulih <b>empu diri, pajak tauka sewa</b>. Enti tanah ukai empu nuan, bagi <b>izin ngena tanah</b> dalam borang ibuh diandal tuan tanah. Ngagai jalai komersial, tapak mesti ba dalam menua Sarawak.'
    }},
  { id: 'office',
    kw: ['pejabat','office','hubungi','contact','telefon','phone','call','alamat','kuching','sibu','miri','bintulu','mukah','opis','办事处','联络','电话','地址'],
    ans: {
      ms: 'Pejabat PUSAKA:<ul><li><b>Ibu Pejabat, Kuching</b> — 082-473000 (dan 014-2853037, Pegawai Eksekutif Projek Buluh)</li><li><b>Tg. Manis / Mukah</b> — 084-613979</li><li><b>Sibu</b> — 084-335059</li><li><b>Bintulu</b> — 086-311605</li><li><b>Miri</b> — 085-325113</li></ul>',
      en: 'PUSAKA offices:<ul><li><b>Headquarters, Kuching</b> — 082-473000 (and 014-2853037, Bamboo Project Executive Officer)</li><li><b>Tg. Manis / Mukah</b> — 084-613979</li><li><b>Sibu</b> — 084-335059</li><li><b>Bintulu</b> — 086-311605</li><li><b>Miri</b> — 085-325113</li></ul>',
      zh: 'PUSAKA 办事处：<ul><li><b>总部，古晋</b>——082-473000（以及 014-2853037，竹林计划执行官）</li><li><b>Tg. Manis／慕禄</b>——084-613979</li><li><b>诗巫</b>——084-335059</li><li><b>民都鲁</b>——086-311605</li><li><b>美里</b>——085-325113</li></ul>',
      ib: 'Opis PUSAKA:<ul><li><b>Opis Besai, Kuching</b> — 082-473000 (enggau 014-2853037, Pegawai Eksekutif Projek Buluh)</li><li><b>Tg. Manis / Mukah</b> — 084-613979</li><li><b>Sibu</b> — 084-335059</li><li><b>Bintulu</b> — 086-311605</li><li><b>Miri</b> — 085-325113</li></ul>'
    }},
  { id: 'seedlings',
    kw: ['anak pokok','benih','seedling','baja','bantuan','berapa pokok','subsidy','竹苗','种苗','补助'],
    ans: {
      ms: 'Bilangan anak pokok diperuntukkan <b>berdasarkan keluasan tanah yang dicadangkan</b>. Spesies yang diberikan bergantung kepada kesesuaian industri buluh yang dibangunkan dan penilaian PUSAKA, serta stok semasa tapak semaian.',
      en: 'The number of seedlings is allocated <b>based on the proposed land area</b>. The species provided depends on suitability for the bamboo industry being developed, PUSAKA’s assessment, and current nursery stock.',
      zh: '竹苗数量按<b>建议土地面积</b>分配。所提供的竹种视所发展竹业的适用性、PUSAKA 的评估与苗圃现有存量而定。',
      ib: 'Bilang anak buluh dibagi <b>nitihka luas tanah ke dipadah</b>. Jenis ke dibagi bekaul enggau pengelurus industri buluh ke dikembang, penilai PUSAKA, enggau stok tapak semaian.'
    }},
  { id: 'privacy',
    kw: ['privasi','privacy','selamat','secure','data','simpan','keselamatan','隐私','安全','资料'],
    ans: {
      ms: 'Dalam versi demonstrasi ini, maklumat permohonan disimpan <b>dalam pelayar peranti anda sendiri</b> dan tidak dihantar ke pelayan luar. Sebelum penerbitan rasmi, STIDC perlu menetapkan notis privasi, tempoh penyimpanan rekod dan kawalan akses pegawai.',
      en: 'In this demonstration version, application data is stored <b>in your own device’s browser</b> and is not sent to an external server. Before an official launch, STIDC would need to set the privacy notice, retention period and officer access controls.',
      zh: '在此示范版本中，申请资料保存<b>在你自己设备的浏览器内</b>，不会传送至外部服务器。正式发布前，STIDC 须订定隐私声明、保存期限与官员存取权限。',
      ib: 'Ba versi peda tu, berita peminta disimpan <b>dalam pelayar alat nuan empu</b> lalu enda dikirim ngagai server luar. Sebedau diterbit resmi, STIDC ibuh netapka notis privasi, tempuh simpan rekod enggau kawal akses pegawai.'
    }},
  { id: 'whybamboo',
    kw: ['kenapa buluh','why bamboo','faedah','manfaat','benefit','kelebihan','为何','好处','优点','buluh'],
    ans: {
      ms: 'Buluh matang dalam <b>3–5 tahun</b>, boleh dituai berulang tanpa ditanam semula, mengikat tanah di tebing sungai, dan membekalkan bahan mentah untuk papan lamina, perabot, arang aktif dan biomas. Sarawak mensasarkan <b>30,000 hektar menjelang 2030</b>.',
      en: 'Bamboo matures in <b>3–5 years</b>, can be harvested repeatedly without replanting, binds riverbank soil, and supplies raw material for laminated board, furniture, activated charcoal and biomass. Sarawak targets <b>30,000 hectares by 2030</b>.',
      zh: '竹子 <b>3–5 年</b>即可成材，可反复采收而无需重植，能固住河岸泥土，并为积成材、家具、活性炭与生物质提供原料。砂拉越目标是 <b>2030 年前 30,000 公顷</b>。',
      ib: 'Buluh masak dalam <b>3–5 taun</b>, ulih ditetak baru-baru nadai nanam baru, negapka tanah ba tebing sungai, lalu meri bahan mentah ngagai papan lamina, perabung, arang aktif enggau biomas. Sarawak nyasar <b>30,000 hektar sebedau 2030</b>.'
    }},
  { id: 'draft',
    kw: ['draf','draft','simpan','save','sambung','resume','continue','later','草稿','保存','继续'],
    ans: {
      ms: 'Draf anda disimpan <b>secara automatik</b> dalam pelayar. Anda boleh berhenti bila-bila masa dan menyambung kemudian — buka semula portal ini pada <b>peranti dan pelayar yang sama</b>.',
      en: 'Your draft saves <b>automatically</b> in the browser. Stop any time and continue later — just reopen this portal on the <b>same device and browser</b>.',
      zh: '你的草稿会<b>自动保存</b>在浏览器中。可随时中断，稍后继续——只需在<b>同一台设备与浏览器</b>重新开启本入口。',
      ib: 'Draf nuan disimpan <b>empu</b> dalam pelayar. Ulih badu bila-bila lalu nerus udah nya — buka baru portal tu ba <b>alat enggau pelayar ke sama</b>.'
    }}
];

var CHIPS = {
  ms: [['Siapa yang layak?','eligibility'], ['Dokumen apa?','documents'], ['Berapa lama?','timeline'], ['Ada bayaran?','cost'], ['Spesies buluh','species'], ['Pejabat PUSAKA','office']],
  en: [['Who is eligible?','eligibility'], ['What documents?','documents'], ['How long?','timeline'], ['Any fees?','cost'], ['Bamboo species','species'], ['PUSAKA offices','office']],
  zh: [['谁符合资格？','eligibility'], ['需要什么文件？','documents'], ['需要多久？','timeline'], ['需要收费吗？','cost'], ['竹子品种','species'], ['PUSAKA 办事处','office']],
  ib: [['Sapa ke layak?','eligibility'], ['Nama surat?','documents'], ['Berapa lama?','timeline'], ['Bisi bayar?','cost'], ['Jenis buluh','species'], ['Opis PUSAKA','office']]
};

function answerFor(text) {
  var q = String(text).toLowerCase();
  var best = null, bestScore = 0;
  KB.forEach(function (entry) {
    var score = 0;
    entry.kw.forEach(function (k) { if (q.indexOf(k) !== -1) score += k.length; });
    if (score > bestScore) { bestScore = score; best = entry; }
  });
  if (!best) return null;
  return best.ans[currentLang] || best.ans.ms;
}

/* ─── Widgets: bubbles + assistant ──────────────────────────── */
function initWidgets() {
  var mount = document.getElementById('widgetMount');
  if (!mount) return;

  mount.innerHTML =
    '<div class="assistant" id="assistant" role="dialog" aria-modal="false" aria-labelledby="asTitle">' +
      '<div class="as-head">' +
        '<span class="as-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M9 3v18M15 3v18" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M6.8 9h4.4M12.8 15h4.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>' +
        '<div><div class="as-title" id="asTitle" data-i18n="as.title"></div>' +
        '<div class="as-status" data-i18n="as.status"></div></div>' +
        '<button class="as-close" id="asClose" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
      '</div>' +
      '<div class="as-body" id="asBody"></div>' +
      '<div class="as-chips" id="asChips"></div>' +
      '<form class="as-foot" id="asForm">' +
        '<input class="as-input" id="asInput" type="text" autocomplete="off" data-i18n-ph="as.placeholder" />' +
        '<button class="as-send" type="submit" data-i18n-aria="as.send" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg></button>' +
      '</form>' +
      '<div class="as-disclaim" data-i18n="as.disclaim"></div>' +
    '</div>' +

    '<div class="bubbles">' +
      '<a class="bubble bubble-wa" href="https://wa.me/' + CONFIG.waNumber + '" target="_blank" rel="noopener" data-i18n-aria="bubble.wa" aria-label="WhatsApp">' +
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z"/><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23z"/></svg>' +
        '<span class="bubble-tip" data-i18n="bubble.wa"></span>' +
      '</a>' +
      '<button class="bubble bubble-ai" id="asOpen" data-i18n-aria="bubble.ai" aria-label="Assistant" aria-expanded="false">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/></svg>' +
        '<span class="bubble-dot" aria-hidden="true"></span>' +
        '<span class="bubble-tip" data-i18n="bubble.ai"></span>' +
      '</button>' +
    '</div>';

  var panel  = document.getElementById('assistant');
  var opener = document.getElementById('asOpen');
  var closer = document.getElementById('asClose');
  var body   = document.getElementById('asBody');
  var chips  = document.getElementById('asChips');
  var form   = document.getElementById('asForm');
  var input  = document.getElementById('asInput');
  var greeted = false;

  function push(html, who) {
    var m = el('div', 'as-msg ' + who, html);
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m;
  }

  function botReply(html) {
    var typing = el('div', 'as-typing', '<i></i><i></i><i></i>');
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;
    setTimeout(function () {
      typing.remove();
      push(html, 'bot');
    }, reduceMotion ? 90 : 520 + Math.random() * 320);
  }

  function renderChips() {
    var list = CHIPS[currentLang] || CHIPS.ms;
    chips.innerHTML = '';
    list.forEach(function (pair) {
      var b = el('button', 'as-chip', esc(pair[0]));
      b.type = 'button';
      b.addEventListener('click', function () {
        push(esc(pair[0]), 'me');
        var entry = KB.filter(function (k) { return k.id === pair[1]; })[0];
        botReply(entry ? (entry.ans[currentLang] || entry.ans.ms) : t('as.fallback'));
      });
      chips.appendChild(b);
    });
  }

  function open() {
    panel.classList.add('open');
    opener.setAttribute('aria-expanded', 'true');
    var dot = opener.querySelector('.bubble-dot');
    if (dot) dot.style.display = 'none';
    if (!greeted) { greeted = true; renderChips(); botReply(t('as.greet')); }
    setTimeout(function () { input.focus(); }, 320);
  }
  function close() {
    panel.classList.remove('open');
    opener.setAttribute('aria-expanded', 'false');
  }

  opener.addEventListener('click', function () {
    panel.classList.contains('open') ? close() : open();
  });
  closer.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) close();
  });

  document.querySelectorAll('[data-open-assistant]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); open(); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (!v) return;
    push(esc(v), 'me');
    input.value = '';
    var a = answerFor(v);
    botReply(a || t('as.fallback'));
  });

  onLanguageChange(function () {
    if (greeted) renderChips();
  });
}

/* ─── Offline support ───────────────────────────────────────── */
/* Rural applicants frequently work with little or no mobile data.
   The whole form runs client-side, so a cached shell means the
   journey completes with no signal at all. */
function initServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') return;
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () {
      /* Offline support is an enhancement — never block the portal on it. */
    });
  });
}

/* ─── Boot ──────────────────────────────────────────────────── */
function boot() {
  initServiceWorker();
  initSpecies();
  initFaq();
  initOffices();
  initWidgets();
  initNav();

  document.querySelectorAll('.nav-lang button').forEach(function (b) {
    b.addEventListener('click', function () { applyLanguage(b.dataset.lang); });
  });

  var saved = 'ms';
  try { saved = localStorage.getItem(CONFIG.langKey) || 'ms'; } catch (e) {}
  applyLanguage(saved);

  initReveal(document);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else { boot(); }

})();
