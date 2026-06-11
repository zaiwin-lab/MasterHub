// Mobile menu toggle
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// ============ Translations ============
const translations = {
  en: {
    'nav.about': 'About', 'nav.capabilities': 'Capabilities', 'nav.why': 'Why KAM', 'nav.contact': 'Visit Us', 'nav.cta': 'Get In Touch',
    'hero.eyebrow': 'KOTA SAMARAHAN · SARAWAK',
    'hero.line1': 'PREMIUM PARTS.', 'hero.line2': 'EXPERT SERVICE.', 'hero.line3': 'BUILT TO RIDE.',
    'hero.sub': "From genuine spare parts to full custom builds — KAM Motorworld is Kota Samarahan's trusted destination for riders who expect more from their machine.",
    'hero.cta1': 'Visit the Workshop <span>→</span>', 'hero.cta2': 'Our Capabilities',
    'hero.stat1': 'Founded', 'hero.stat2': 'Rebrand &amp; Reborn', 'hero.stat3num': 'Genuine', 'hero.stat3': 'Parts Only',
    'about.kicker': 'OUR JOURNEY',
    'about.title': 'From a small workshop<br>to a <span class="accent-text">trusted name.</span>',
    'about.t1title': 'The Beginning',
    'about.t1body': 'KAM Motorworld opens its doors in Kota Samarahan — a small shop with a big promise: honest service, fair prices, and parts that last.',
    'about.t2title': 'Rebrand &amp; Reborn',
    'about.t2body': 'A renewed identity, a sharper focus — built around lasting trust, premium quality, and expert solutions for every rider who walks through the door.',
    'about.t3year': 'TODAY',
    'about.t3title': 'Engineered for Riders',
    'about.t3body': 'A full-service destination for genuine parts, maintenance, repairs, upgrades and customization — built for growth, engineered for riders.',
    'core.kicker': 'OUR STRATEGIC CORE',
    'core.title': 'To equip every rider with the parts, service, and expertise they need to ride further, safer, and with confidence.',
    'core.c1title': 'Lasting Trust',
    'core.c1body': 'Built on honesty and consistency — the kind of relationships that keep riders coming back for years.',
    'core.c2title': 'Premium Quality',
    'core.c2body': 'Genuine parts, proper tools, and craftsmanship that respects your machine and your investment.',
    'core.c3title': 'Expert Solutions',
    'core.c3body': 'Skilled technicians who diagnose right the first time and solve problems, not just symptoms.',
    'cap.kicker': 'END-TO-END RIDER CAPABILITIES',
    'cap.title': 'Everything your bike needs.<br>Under one roof.',
    'cap.c1title': 'Genuine Spare Parts',
    'cap.c1body': 'Authentic, quality-checked parts sourced for reliability — no shortcuts, no compromises.',
    'cap.c2title': 'Comprehensive Maintenance',
    'cap.c2body': 'Routine servicing, oil changes, tune-ups and inspections to keep your ride running at its best.',
    'cap.c3title': 'Expert Repairs &amp; Upgrades',
    'cap.c3body': 'From engine work to performance upgrades, our technicians bring precision and experience to every job.',
    'cap.c4title': 'Accessories &amp; Customization',
    'cap.c4body': 'Personalize your ride with accessories and custom builds that reflect your style and needs.',
    'why.kicker': 'BUILT FOR GROWTH. ENGINEERED FOR RIDERS.',
    'why.title': 'Why riders <span class="accent-text">choose KAM.</span>',
    'why.c1title': 'Deep Expertise',
    'why.c1body': 'Years of hands-on experience across makes and models — diagnosing right, every time.',
    'why.c2title': 'Uncompromised Quality',
    'why.c2body': 'Genuine parts and proper procedures — built to last, not just to leave the shop running.',
    'why.c3title': 'Rider-First Approach',
    'why.c3body': 'Honest advice, transparent pricing, and service that puts your safety and satisfaction first.',
    'why.c4title': 'Outstanding Value',
    'why.c4body': "Premium work at prices that respect your wallet — quality service shouldn't break the bank.",
    'contact.kicker': 'READY TO UPGRADE YOUR RIDE?',
    'contact.title': 'Bring your bike in.<br>Leave it better than ever.',
    'contact.addrlabel': 'Address',
    'contact.addr': 'Grd Flr, Sublot 5, Lot 2281, Block 26, Jalan Dato Mohd. Musa, 94300 Kota Samarahan, Sarawak',
    'contact.phonelabel': 'Phone',
    'contact.emaillabel': 'Email',
    'contact.cta': 'Get Directions <span>→</span>',
    'footer.tagline': 'Premium Parts. Expert Service. Built to Ride. — Kota Samarahan, Sarawak.',
    'footer.copy': '&copy; 2026 KAM Motorworld. All rights reserved.',
    'footer.credit': 'This Digital Experience is Part of the <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a> Innovation Ecosystem',
  },
  bm: {
    'nav.about': 'Tentang', 'nav.capabilities': 'Kepakaran', 'nav.why': 'Kenapa KAM', 'nav.contact': 'Lawati Kami', 'nav.cta': 'Hubungi Kami',
    'hero.eyebrow': 'KOTA SAMARAHAN · SARAWAK',
    'hero.line1': 'ALAT GANTI PREMIUM.', 'hero.line2': 'PERKHIDMATAN PAKAR.', 'hero.line3': 'DIBINA UNTUK BERLUMBA.',
    'hero.sub': 'Dari alat ganti tulen hinggalah pembinaan custom sepenuhnya — KAM Motorworld ialah destinasi dipercayai di Kota Samarahan untuk penunggang yang mahukan lebih daripada motosikal mereka.',
    'hero.cta1': 'Lawati Bengkel <span>→</span>', 'hero.cta2': 'Kepakaran Kami',
    'hero.stat1': 'Ditubuhkan', 'hero.stat2': 'Penjenamaan Semula', 'hero.stat3num': 'Tulen', 'hero.stat3': 'Alat Ganti Sahaja',
    'about.kicker': 'PERJALANAN KAMI',
    'about.title': 'Dari sebuah bengkel kecil<br>kepada <span class="accent-text">nama yang dipercayai.</span>',
    'about.t1title': 'Permulaan',
    'about.t1body': 'KAM Motorworld membuka pintunya di Kota Samarahan — sebuah kedai kecil dengan janji besar: perkhidmatan jujur, harga berpatutan, dan alat ganti yang tahan lama.',
    'about.t2title': 'Penjenamaan Semula',
    'about.t2body': 'Identiti baharu, fokus yang lebih tajam — dibina atas kepercayaan berkekalan, kualiti premium, dan penyelesaian pakar untuk setiap penunggang yang masuk ke kedai kami.',
    'about.t3year': 'KINI',
    'about.t3title': 'Direka Untuk Penunggang',
    'about.t3body': 'Destinasi sehenti untuk alat ganti tulen, penyelenggaraan, pembaikan, naik taraf dan customization — dibina untuk berkembang, direka untuk penunggang.',
    'core.kicker': 'TERAS STRATEGIK KAMI',
    'core.title': 'Melengkapkan setiap penunggang dengan alat ganti, perkhidmatan dan kepakaran untuk menunggang lebih jauh, lebih selamat, dan dengan penuh keyakinan.',
    'core.c1title': 'Kepercayaan Berkekalan',
    'core.c1body': 'Dibina atas kejujuran dan konsistensi — hubungan yang membuatkan penunggang kembali bertahun-tahun lamanya.',
    'core.c2title': 'Kualiti Premium',
    'core.c2body': 'Alat ganti tulen, peralatan yang sesuai, dan kemahiran yang menghormati motosikal serta pelaburan anda.',
    'core.c3title': 'Penyelesaian Pakar',
    'core.c3body': 'Juruteknik mahir yang mendiagnosis dengan tepat pada kali pertama dan menyelesaikan punca masalah, bukan sekadar gejala.',
    'cap.kicker': 'KEPAKARAN MENYELURUH UNTUK PENUNGGANG',
    'cap.title': 'Semua keperluan motosikal anda.<br>Di bawah satu bumbung.',
    'cap.c1title': 'Alat Ganti Tulen',
    'cap.c1body': 'Alat ganti tulen yang diperiksa kualitinya untuk kebolehpercayaan — tiada jalan pintas, tiada kompromi.',
    'cap.c2title': 'Penyelenggaraan Menyeluruh',
    'cap.c2body': 'Servis rutin, tukar minyak, tune-up dan pemeriksaan untuk memastikan motosikal anda sentiasa dalam keadaan terbaik.',
    'cap.c3title': 'Pembaikan &amp; Naik Taraf Pakar',
    'cap.c3body': 'Dari kerja enjin hingga naik taraf prestasi, juruteknik kami membawa ketelitian dan pengalaman kepada setiap kerja.',
    'cap.c4title': 'Aksesori &amp; Customization',
    'cap.c4body': 'Personalisasikan motosikal anda dengan aksesori dan pembinaan custom yang mencerminkan gaya dan keperluan anda.',
    'why.kicker': 'DIBINA UNTUK BERKEMBANG. DIREKA UNTUK PENUNGGANG.',
    'why.title': 'Kenapa penunggang <span class="accent-text">memilih KAM.</span>',
    'why.c1title': 'Kepakaran Mendalam',
    'why.c1body': 'Bertahun-tahun pengalaman praktikal merentasi pelbagai jenama dan model — mendiagnosis dengan tepat, setiap kali.',
    'why.c2title': 'Kualiti Tanpa Kompromi',
    'why.c2body': 'Alat ganti tulen dan prosedur yang betul — dibina untuk tahan lama, bukan sekadar untuk keluar dari kedai.',
    'why.c3title': 'Pendekatan Mengutamakan Penunggang',
    'why.c3body': 'Nasihat jujur, harga telus, dan perkhidmatan yang mengutamakan keselamatan dan kepuasan anda.',
    'why.c4title': 'Nilai Yang Hebat',
    'why.c4body': 'Kerja premium pada harga yang berpatutan — perkhidmatan berkualiti tidak sepatutnya membebankan poket anda.',
    'contact.kicker': 'BERSEDIA UNTUK NAIK TARAF MOTOSIKAL ANDA?',
    'contact.title': 'Bawa motosikal anda ke sini.<br>Tinggalkan ia lebih baik dari sebelumnya.',
    'contact.addrlabel': 'Alamat',
    'contact.addr': 'Grd Flr, Sublot 5, Lot 2281, Block 26, Jalan Dato Mohd. Musa, 94300 Kota Samarahan, Sarawak',
    'contact.phonelabel': 'Telefon',
    'contact.emaillabel': 'Emel',
    'contact.cta': 'Dapatkan Arah <span>→</span>',
    'footer.tagline': 'Alat Ganti Premium. Perkhidmatan Pakar. Dibina Untuk Berlumba. — Kota Samarahan, Sarawak.',
    'footer.copy': '&copy; 2026 KAM Motorworld. Hak cipta terpelihara.',
    'footer.credit': 'Pengalaman Digital Ini Adalah Sebahagian Daripada Ekosistem Inovasi <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a>',
  },
  zh: {
    'nav.about': '关于我们', 'nav.capabilities': '服务范围', 'nav.why': '为何选择KAM', 'nav.contact': '联系我们', 'nav.cta': '联络我们',
    'hero.eyebrow': '沙捞越 · 哥打三马拉汉',
    'hero.line1': '优质零件。', 'hero.line2': '专业服务。', 'hero.line3': '为骑行而生。',
    'hero.sub': '从正品零件到全面定制改装 — KAM Motorworld 是哥打三马拉汉车主信赖的首选，为追求卓越的骑士提供更多。',
    'hero.cta1': '参观工作坊 <span>→</span>', 'hero.cta2': '我们的服务',
    'hero.stat1': '成立于', 'hero.stat2': '品牌重塑', 'hero.stat3num': '正品', 'hero.stat3': '零件保证',
    'about.kicker': '我们的历程',
    'about.title': '从一间小型车行<br>到<span class="accent-text">值得信赖的品牌。</span>',
    'about.t1title': '起点',
    'about.t1body': 'KAM Motorworld 在哥打三马拉汉开业 — 一间承诺远大的小店：诚信服务、价格公道、耐用零件。',
    'about.t2title': '品牌重塑',
    'about.t2body': '全新形象、更明确的定位 — 建立在持久信任、优质品质和专业方案之上，服务每一位走进店里的车主。',
    'about.t3year': '现在',
    'about.t3title': '为骑士而打造',
    'about.t3body': '一站式提供正品零件、保养、维修、升级与定制服务 — 为成长而建，为骑士而设。',
    'core.kicker': '我们的核心战略',
    'core.title': '为每位骑士提供所需的零件、服务与专业知识，让他们骑得更远、更安全、更自信。',
    'core.c1title': '持久信任',
    'core.c1body': '建立在诚实与稳定之上 — 这种关系让车主多年来一再光顾。',
    'core.c2title': '优质保证',
    'core.c2body': '正品零件、合适工具，以及尊重您爱车与投资的精湛工艺。',
    'core.c3title': '专业方案',
    'core.c3body': '技术娴熟的技师一次诊断到位，解决根本问题，而非仅治标。',
    'cap.kicker': '一站式骑士服务',
    'cap.title': '爱车所需的一切。<br>一应俱全。',
    'cap.c1title': '正品零件',
    'cap.c1body': '经品质检验的正品零件，确保可靠性 — 绝不偷工减料，绝不妥协。',
    'cap.c2title': '全面保养',
    'cap.c2body': '定期保养、机油更换、调校与检查，让您的爱车保持最佳状态。',
    'cap.c3title': '专业维修与升级',
    'cap.c3body': '从引擎维修到性能升级，我们的技师为每项工作带来精准与经验。',
    'cap.c4title': '配件与定制',
    'cap.c4body': '通过配件与定制改装，打造展现您个人风格与需求的座驾。',
    'why.kicker': '为成长而建，为骑士而设',
    'why.title': '骑士选择KAM的<span class="accent-text">理由。</span>',
    'why.c1title': '深厚专业',
    'why.c1body': '多年实战经验，涵盖各品牌车型 — 每次都精准诊断。',
    'why.c2title': '品质无妥协',
    'why.c2body': '正品零件与正确工序 — 经久耐用，而非只求出店即可。',
    'why.c3title': '以骑士为本',
    'why.c3body': '诚实建议、透明定价，将您的安全与满意放在首位。',
    'why.c4title': '超值体验',
    'why.c4body': '以亲民价格享受优质服务 — 优质服务不应让您荷包吃紧。',
    'contact.kicker': '准备好升级您的爱车了吗？',
    'contact.title': '把爱车带来。<br>让它焕然一新。',
    'contact.addrlabel': '地址',
    'contact.addr': 'Grd Flr, Sublot 5, Lot 2281, Block 26, Jalan Dato Mohd. Musa, 94300 Kota Samarahan, Sarawak',
    'contact.phonelabel': '电话',
    'contact.emaillabel': '电邮',
    'contact.cta': '获取路线 <span>→</span>',
    'footer.tagline': '优质零件。专业服务。为骑行而生。— 沙捞越哥打三马拉汉。',
    'footer.copy': '&copy; 2026 KAM Motorworld. 版权所有。',
    'footer.credit': '此数位体验为 <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a> 创新生态系统的一部分',
  },
  ib: {
    'nav.about': 'Pasal Kami', 'nav.capabilities': 'Pengawa', 'nav.why': 'Kenapa KAM', 'nav.contact': 'Datai Kami', 'nav.cta': 'Berandau',
    'hero.eyebrow': 'KOTA SAMARAHAN · SARAWAK',
    'hero.line1': 'BARANG ALAT TI BERMUTU.', 'hero.line2': 'PENGAWA TI MAHIR.', 'hero.line3': 'DIKEREJA KE PERJALAI.',
    'hero.sub': 'Ari barang alat motosikal ti tulen nyentuk ngagai pengubah custom — KAM Motorworld endur ti dipechaya di Kota Samarahan ke semua ti deka motosikal sida manah agi.',
    'hero.cta1': 'Datai Bengkel Kami <span>→</span>', 'hero.cta2': 'Pengawa Kami',
    'hero.stat1': 'Dipungka', 'hero.stat2': 'Diubah Baru', 'hero.stat3num': 'Tulen', 'hero.stat3': 'Barang Alat Aja',
    'about.kicker': 'PERJALAI KAMI',
    'about.title': 'Ari kedai ti mit<br>nyadi <span class="accent-text">nama ti dipechaya.</span>',
    'about.t1title': 'Pemungkanya',
    'about.t1body': 'KAM Motorworld muka kedai di Kota Samarahan — kedai mit enggau semaya ti besai: pengawa ti bujur, reti ti adil, enggau barang alat ti tahan lama.',
    'about.t2title': 'Diubah Baru',
    'about.t2body': 'Penampak baru, fokus ti manah agi — dibengkah atas pechaya ti tahan lama, mutu ti manah, enggau jalan penyelesai ke semua orang ke datai ngagai kami.',
    'about.t3year': 'DIATU',
    'about.t3title': 'Dikereja Ke Orang Bemotor',
    'about.t3body': 'Endur dikemendar ke barang alat tulen, pengintu, pengubah, naik taraf enggau customization — dikereja ngambika mansang, dikereja ke orang bemotor.',
    'core.kicker': 'TIANG UTAMA KAMI',
    'core.title': 'Meri semua orang bemotor barang alat, pengawa, enggau pengelandik ti dikedeka sida ngambika sida ulih bejalai jauh agi, lebih selamat, enggau pechaya diri.',
    'core.c1title': 'Pechaya Ti Tahan Lama',
    'core.c1body': 'Dibengkah atas pengelandik enggau pengawa ti sama — nyadi raban ti ngasuh orang pulai baru taun ke taun.',
    'core.c2title': 'Mutu Ti Manah',
    'core.c2body': 'Barang alat tulen, peralatan ti betul, enggau pengawa ti ngormat motosikal enggau duit nuan.',
    'core.c3title': 'Jalan Penyelesai Mahir',
    'core.c3body': 'Tukang ti landik nemu pekara ti enda manah enggau bujur sekali pandang, lalu ngubah punca, ukai semina tanda.',
    'cap.kicker': 'PENGAWA KAMI KE ORANG BEMOTOR',
    'cap.title': 'Semua keperluan motosikal nuan.<br>Dalam siti endur aja.',
    'cap.c1title': 'Barang Alat Tulen',
    'cap.c1body': 'Barang alat tulen ti diperiksa mutu ngambika dipechaya — nadai jalan pintas, nadai kompromi.',
    'cap.c2title': 'Pengintu Ti Chukup',
    'cap.c2body': 'Servis biasa, tukar minyak, tune-up enggau pemeriksaan ngambika motosikal nuan tetap manah.',
    'cap.c3title': 'Pengubah &amp; Naik Taraf Mahir',
    'cap.c3body': 'Ari pengawa enjin nyentuk ngagai naik taraf prestasi, tukang kami bisi pengelandik enggau pengalaman ke semua pengawa.',
    'cap.c4title': 'Aksesori &amp; Customization',
    'cap.c4body': 'Ngubah motosikal nuan enggau aksesori enggau pembinaan custom ti nunjukka gaya enggau keperluan nuan.',
    'why.kicker': 'DIKEREJA NGAMBIKA MANSANG. DIKEREJA KE ORANG BEMOTOR.',
    'why.title': 'Kenapa orang bemotor <span class="accent-text">milih KAM.</span>',
    'why.c1title': 'Pengelandik Ti Dalam',
    'why.c1body': 'Taun ke taun pengalaman enggau semua jenis motosikal — selalu nemu pekara ti enda manah enggau bujur.',
    'why.c2title': 'Mutu Nadai Kompromi',
    'why.c2body': 'Barang alat tulen enggau cara ti betul — dikereja ngambika tahan lama, ukai semina ke pulai ari kedai.',
    'why.c3title': 'Mengutamaka Orang Bemotor',
    'why.c3body': 'Saran ti bujur, reti ti jelas, enggau pengawa ti mengutamaka pengamanan enggau pengerinduan nuan.',
    'why.c4title': 'Reti Ti Manah Amat',
    'why.c4body': 'Pengawa bermutu enggau reti ti adil — pengawa ti manah enda patut ngasuh poket nuan kosong.',
    'contact.kicker': 'BESEDIA NAIK TARAF MOTOSIKAL NUAN?',
    'contact.title': 'Bai motosikal nuan ngagai sitok.<br>Pulaika ngagai endur ti manah agi.',
    'contact.addrlabel': 'Endur',
    'contact.addr': 'Grd Flr, Sublot 5, Lot 2281, Block 26, Jalan Dato Mohd. Musa, 94300 Kota Samarahan, Sarawak',
    'contact.phonelabel': 'Telefon',
    'contact.emaillabel': 'Emel',
    'contact.cta': 'Mai Jalai <span>→</span>',
    'footer.tagline': 'Barang Alat Bermutu. Pengawa Mahir. Dikereja Ke Perjalai. — Kota Samarahan, Sarawak.',
    'footer.copy': '&copy; 2026 KAM Motorworld. Semua Hak Tedaun.',
    'footer.credit': 'Pengalaman Digital Tu Sebagi ari Ekosistem Inovasi <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a>',
  }
};

function applyLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = dict[key];
    if (value === undefined) return;
    if (value.includes('<') || value.includes('&')) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  localStorage.setItem('kam-lang', lang);
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

const savedLang = localStorage.getItem('kam-lang') || 'en';
applyLanguage(savedLang);
