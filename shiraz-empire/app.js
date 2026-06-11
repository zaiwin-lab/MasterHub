// ============ Motion: tilt + hero parallax ============
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches;

if (!prefersReducedMotion && !isTouch) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  const hero = document.getElementById('top');
  const heroPhotoWrap = document.querySelector('.hero-photo-wrap');
  hero?.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    if (heroPhotoWrap) {
      heroPhotoWrap.style.transform = `translate(${(x * 16).toFixed(2)}px, ${(y * 16).toFixed(2)}px)`;
    }
  });
  hero?.addEventListener('mouseleave', () => {
    if (heroPhotoWrap) heroPhotoWrap.style.transform = '';
  });
}

// ============ Nav scroll state ============
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
});

// ============ Mobile nav toggle ============
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// ============ Reveal on scroll ============
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

// ============ Smooth scroll for internal links ============
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navLinks?.classList.remove('open');
      }
    }
  });
});

// ============ Translations ============
const translations = {
  en: {
    'nav.about': 'About', 'nav.services': 'Services', 'nav.why': 'Why Us',
    'nav.area': 'Service Area', 'nav.contact': 'Contact', 'nav.cta': 'Book a Service',
    'hero.eyebrow': 'Kota Samarahan — Air-Conditioning Specialists',
    'hero.title': 'Cool Comfort, <em>Done Right</em>.',
    'hero.sub': "Shiraz Empire supplies, installs, maintains and repairs air-conditioning units across Kota Samarahan and greater Kuching — straightforward pricing and technicians who take care of the details.",
    'hero.cta1': 'Get a Free Quote', 'hero.cta2': 'Our Services',
    'hero.stat1': 'Core Services', 'hero.stat2': 'Service Call-Outs',
    'hero.stat3': 'Transparent Pricing', 'hero.stat4': 'Locally Registered',
    'about.eyebrow': 'About Us', 'about.title': 'Built on Trust, Run with Pride.',
    'about.p1': 'Shiraz Empire is a registered air-conditioning service provider based at the MARA Business Incubator, Kota Samarahan, Sarawak — officially certified under the Sarawak Business Names Ordinance (Reg. No. SAM/PAR/044/2025).',
    'about.p2': 'Founded by Mohamad Shahrul Fikrie bin Baduwi from Kampung Nakong, Kota Samarahan, Shiraz Empire was built on a simple idea: every home and business deserves cool, clean air — delivered with honesty, punctuality and care.',
    'about.regtitle': 'Officially Registered',
    'about.reg1': 'Reg. No. SAM/PAR/044/2025',
    'about.reg2': 'Registered January 2025, Kota Samarahan',
    'about.reg3': 'Pusat Inkubator MARA, Kota Samarahan, Sarawak',
    'about.reg4': 'Owner: Mohamad Shahrul Fikrie bin Baduwi',
    'vm.visiontitle': 'Our Vision',
    'vm.visionbody': "To grow into a name that homes and businesses in Kota Samarahan can rely on for honest, quality air-conditioning service.",
    'vm.missiontitle': 'Our Mission',
    'vm.m1': '<strong>Honest Service</strong> — transparent pricing, no hidden charges.',
    'vm.m2': '<strong>Fast Response</strong> — same-day and emergency call-outs.',
    'vm.m3': '<strong>Quality Workmanship</strong> — every unit serviced to last.',
    'vm.m4': '<strong>Community First</strong> — proudly local, proudly Sarawakian.',
    'services.eyebrow': 'Our Services', 'services.title': 'Four Pillars of Cool.',
    'services.sub': "From a brand-new unit to a unit on its last breath — Shiraz Empire covers the full lifecycle of your air-conditioning.",
    'service1.title': 'Aircon Supply',
    'service1.body': 'Quality air-conditioning units sourced and supplied for homes, offices, shoplots and event spaces — matched to your space and budget.',
    'service2.title': 'Installation',
    'service2.body': 'Professional, neat installation with proper piping, drainage and wiring — done right the first time, every time.',
    'service3.title': 'Maintenance',
    'service3.body': 'Regular chemical wash, gas top-up and filter cleaning to keep your unit running cold, efficient and odour-free.',
    'service4.title': 'Repair & Servicing',
    'service4.body': "Diagnostics and repair for units that aren't cooling, leaking or making noise — with honest advice on repair vs. replace.",
    'why.eyebrow': 'Our Edge', 'why.title': 'Why Choose The Empire.',
    'pillar1.title': 'Local & Trusted',
    'pillar1.body': 'Born and based in Kota Samarahan — we know the area, the homes, and the climate.',
    'pillar2.title': 'Transparent Pricing',
    'pillar2.body': 'Clear quotations before any work begins — no surprise charges, ever.',
    'pillar3.title': 'Fast & Reliable',
    'pillar3.body': 'Punctual appointments and quick turnaround, including emergency call-outs.',
    'pillar4.title': 'All Brands Welcome',
    'pillar4.body': 'We supply, install and service all major air-conditioning brands and types.',
    'pillar5.title': 'Friendly, Careful Service',
    'pillar5.body': 'Clean work, polite service, and results we stand behind.',
    'area.eyebrow': 'Service Area', 'area.title': 'Where We Serve.',
    'area.sub': 'Based at Pusat Inkubator MARA, Kota Samarahan — serving residential, commercial and event clients across the region.',
    'area.tag1': 'Headquarters', 'area.tag2': 'Service Area', 'area.tag3': 'On Request',
    'area.a1title': 'Kota Samarahan',
    'area.a1body': 'Pusat Inkubator MARA, Lot 1F/F, Rumah Kedai, 94300 Kota Samarahan, Sarawak.',
    'area.a2title': 'Greater Kuching',
    'area.a2body': 'Covering homes, offices and shoplots across the Kuching–Samarahan corridor.',
    'area.a3title': 'Events & Bazaars',
    'area.a3body': 'Temporary cooling solutions for events, bazaars and pop-up venues.',
    'contact.eyebrow': 'Contact Us', 'contact.title': "Let's Cool Things Down.",
    'contact.ownertitle': 'Founder', 'contact.areatitle': 'Service Area',
    'contact.areabody': 'Kota Samarahan & Greater Kuching, Sarawak',
    'contact.regtitle': 'Registration',
    'contact.gettitle': 'Get In Touch',
    'contact.getbody': 'Reach out for a free quote, an emergency repair, or to schedule routine maintenance.',
    'footer.tagline': 'Cool Comfort, Honest Service — Kota Samarahan, Sarawak.',
    'footer.copy': '© 2026 Shiraz Empire. All rights reserved.',
    'footer.credit': 'Website crafted by <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a>',
  },
  bm: {
    'nav.about': 'Tentang', 'nav.services': 'Perkhidmatan', 'nav.why': 'Kelebihan',
    'nav.area': 'Kawasan', 'nav.contact': 'Hubungi', 'nav.cta': 'Tempah Servis',
    'hero.eyebrow': 'Kota Samarahan — Pakar Penyaman Udara',
    'hero.title': 'Keselesaan Sejuk, <em>Dilakukan Dengan Betul</em>.',
    'hero.sub': 'Shiraz Empire membekal, memasang, menyelenggara dan membaik pulih unit penyaman udara di Kota Samarahan dan Kuching — harga jelas dan juruteknik yang teliti dengan kerja mereka.',
    'hero.cta1': 'Dapatkan Sebut Harga Percuma', 'hero.cta2': 'Perkhidmatan Kami',
    'hero.stat1': 'Perkhidmatan Teras', 'hero.stat2': 'Panggilan Servis',
    'hero.stat3': 'Harga Telus', 'hero.stat4': 'Berdaftar Tempatan',
    'about.eyebrow': 'Tentang Kami', 'about.title': 'Dibina Atas Kepercayaan, Dijalankan Dengan Bangga.',
    'about.p1': 'Shiraz Empire ialah penyedia perkhidmatan penyaman udara berdaftar yang beroperasi di Pusat Inkubator MARA, Kota Samarahan, Sarawak — disahkan secara rasmi di bawah Ordinan Nama-Nama Perniagaan Sarawak (No. Daftar SAM/PAR/044/2025).',
    'about.p2': 'Diasaskan oleh Mohamad Shahrul Fikrie bin Baduwi dari Kampung Nakong, Kota Samarahan, Shiraz Empire dibina atas idea yang ringkas: setiap rumah dan perniagaan layak mendapat udara sejuk dan bersih — disampaikan dengan jujur, tepat masa dan penuh perhatian.',
    'about.regtitle': 'Berdaftar Secara Rasmi',
    'about.reg1': 'No. Daftar SAM/PAR/044/2025',
    'about.reg2': 'Didaftarkan Januari 2025, Kota Samarahan',
    'about.reg3': 'Pusat Inkubator MARA, Kota Samarahan, Sarawak',
    'about.reg4': 'Pemilik: Mohamad Shahrul Fikrie bin Baduwi',
    'vm.visiontitle': 'Visi Kami',
    'vm.visionbody': 'Untuk membesar menjadi nama yang boleh dipercayai oleh rumah dan perniagaan di Kota Samarahan untuk perkhidmatan penyaman udara yang jujur dan berkualiti.',
    'vm.missiontitle': 'Misi Kami',
    'vm.m1': '<strong>Servis Jujur</strong> — harga telus, tiada caj tersembunyi.',
    'vm.m2': '<strong>Respons Pantas</strong> — panggilan hari sama dan kecemasan.',
    'vm.m3': '<strong>Kerja Berkualiti</strong> — setiap unit diservis untuk tahan lama.',
    'vm.m4': '<strong>Komuniti Diutamakan</strong> — bangga tempatan, bangga Sarawak.',
    'services.eyebrow': 'Perkhidmatan Kami', 'services.title': 'Empat Tunjang Kesejukan.',
    'services.sub': 'Daripada unit baharu hingga unit yang hampir rosak — Shiraz Empire menguruskan keseluruhan kitaran hayat penyaman udara anda.',
    'service1.title': 'Bekalan Penyaman Udara',
    'service1.body': 'Unit penyaman udara berkualiti dibekalkan untuk rumah, pejabat, kedai dan ruang acara — sepadan dengan ruang dan bajet anda.',
    'service2.title': 'Pemasangan',
    'service2.body': 'Pemasangan profesional dan kemas dengan paip, salur air dan pendawaian yang betul — dilakukan dengan tepat setiap kali.',
    'service3.title': 'Penyelenggaraan',
    'service3.body': 'Cucian kimia, isi semula gas dan pembersihan penapis secara berkala untuk memastikan unit anda sejuk, cekap dan bebas bau.',
    'service4.title': 'Pembaikan & Servis',
    'service4.body': 'Diagnosis dan pembaikan untuk unit yang tidak sejuk, bocor atau berbunyi — dengan nasihat jujur sama ada baiki atau ganti.',
    'why.eyebrow': 'Kelebihan Kami', 'why.title': 'Kenapa Pilih Shiraz Empire.',
    'pillar1.title': 'Tempatan & Dipercayai',
    'pillar1.body': 'Lahir dan beroperasi di Kota Samarahan — kami kenal kawasan, rumah dan iklimnya.',
    'pillar2.title': 'Harga Telus',
    'pillar2.body': 'Sebut harga jelas sebelum kerja bermula — tiada caj mengejut.',
    'pillar3.title': 'Pantas & Boleh Dipercayai',
    'pillar3.body': 'Janji temu tepat masa dan kerja siap dengan cepat, termasuk panggilan servis.',
    'pillar4.title': 'Semua Jenama Dilayan',
    'pillar4.body': 'Kami membekal, memasang dan menservis semua jenama dan jenis penyaman udara utama.',
    'pillar5.title': 'Servis Mesra & Teliti',
    'pillar5.body': 'Kerja bersih, servis sopan, dan hasil yang kami berdiri di belakangnya.',
    'area.eyebrow': 'Kawasan Perkhidmatan', 'area.title': 'Di Mana Kami Beroperasi.',
    'area.sub': 'Berpangkalan di Pusat Inkubator MARA, Kota Samarahan — melayani pelanggan kediaman, komersial dan acara di seluruh kawasan.',
    'area.tag1': 'Ibu Pejabat', 'area.tag2': 'Kawasan Servis', 'area.tag3': 'Atas Permintaan',
    'area.a1title': 'Kota Samarahan',
    'area.a1body': 'Pusat Inkubator MARA, Lot 1F/F, Rumah Kedai, 94300 Kota Samarahan, Sarawak.',
    'area.a2title': 'Kuching & Sekitar',
    'area.a2body': 'Meliputi rumah, pejabat dan kedai di sepanjang koridor Kuching–Samarahan.',
    'area.a3title': 'Acara & Bazar',
    'area.a3body': 'Penyelesaian penyejukan sementara untuk acara, bazar dan gerai pop-up.',
    'contact.eyebrow': 'Hubungi Kami', 'contact.title': 'Mari Sejukkan Suasana.',
    'contact.ownertitle': 'Pengasas', 'contact.areatitle': 'Kawasan Perkhidmatan',
    'contact.areabody': 'Kota Samarahan & Kuching, Sarawak',
    'contact.regtitle': 'Pendaftaran',
    'contact.gettitle': 'Hubungi Kami',
    'contact.getbody': 'Hubungi kami untuk sebut harga percuma, pembaikan kecemasan, atau jadual penyelenggaraan rutin.',
    'footer.tagline': 'Keselesaan Sejuk, Servis Jujur — Kota Samarahan, Sarawak.',
    'footer.copy': '© 2026 Shiraz Empire. Hak cipta terpelihara.',
    'footer.credit': 'Laman web direka oleh <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a>',
  },
  zh: {
    'nav.about': '关于我们', 'nav.services': '服务项目', 'nav.why': '我们的优势',
    'nav.area': '服务区域', 'nav.contact': '联系我们', 'nav.cta': '预约服务',
    'hero.eyebrow': 'Kota Samarahan — 冷气专家',
    'hero.title': '尊享清凉，<em>用心做好</em>。',
    'hero.sub': 'Shiraz Empire 为 Kota Samarahan 及古晋一带提供冷气供应、安装、保养与维修服务 — 价格清楚明白，技师做事细心。',
    'hero.cta1': '获取免费报价', 'hero.cta2': '查看服务',
    'hero.stat1': '核心服务', 'hero.stat2': '上门服务',
    'hero.stat3': '价格透明', 'hero.stat4': '本地合法注册',
    'about.eyebrow': '关于我们', 'about.title': '信任为本，用心经营。',
    'about.p1': 'Shiraz Empire 是一家注册冷气服务公司，总部设于砂拉越 Kota Samarahan 的 MARA 商业孵化中心 — 已根据砂拉越商号条例正式注册（注册号 SAM/PAR/044/2025）。',
    'about.p2': '由 Kota Samarahan Kampung Nakong 的 Mohamad Shahrul Fikrie bin Baduwi 创立，Shiraz Empire 秉持一个简单的想法：每个家庭和企业都应享有清凉洁净的空气 — 以诚实、准时与用心提供服务。',
    'about.regtitle': '正式注册',
    'about.reg1': '注册号 SAM/PAR/044/2025',
    'about.reg2': '于2025年1月在Kota Samarahan注册',
    'about.reg3': 'Pusat Inkubator MARA, Kota Samarahan, Sarawak',
    'about.reg4': '业主：Mohamad Shahrul Fikrie bin Baduwi',
    'vm.visiontitle': '我们的愿景',
    'vm.visionbody': '成为 Kota Samarahan 的家庭与企业可以信赖的冷气服务品牌，提供诚实、优质的服务。',
    'vm.missiontitle': '我们的使命',
    'vm.m1': '<strong>诚实服务</strong> — 价格透明，绝无隐藏收费。',
    'vm.m2': '<strong>快速响应</strong> — 当日服务及紧急上门。',
    'vm.m3': '<strong>优质工艺</strong> — 每台机器都用心维护，延长使用寿命。',
    'vm.m4': '<strong>社区优先</strong> — 立足本地，砂拉越骄傲。',
    'services.eyebrow': '我们的服务', 'services.title': '四大清凉支柱。',
    'services.sub': '从全新设备到濒临报废的机器 — Shiraz Empire 为您的冷气提供全程服务。',
    'service1.title': '冷气供应',
    'service1.body': '为住宅、办公室、店铺及活动场所提供优质冷气设备 — 根据空间与预算量身配置。',
    'service2.title': '安装服务',
    'service2.body': '专业整洁的安装，包括正确的管道、排水与电线配置 — 一次到位，绝不将就。',
    'service3.title': '保养维护',
    'service3.body': '定期化学清洗、加气与滤网清洁，让您的冷气持续保持冷却、节能且无异味。',
    'service4.title': '维修服务',
    'service4.body': '为不制冷、漏水或异响的机器提供诊断与维修 — 并诚实建议是维修还是更换。',
    'why.eyebrow': '我们的优势', 'why.title': '为何选择 Shiraz Empire。',
    'pillar1.title': '本地且值得信赖',
    'pillar1.body': '在 Kota Samarahan 土生土长 — 我们了解当地环境、住宅与气候。',
    'pillar2.title': '价格透明',
    'pillar2.body': '动工前提供明确报价 — 绝无意外收费。',
    'pillar3.title': '快速可靠',
    'pillar3.body': '准时赴约、迅速完工，包括上门服务。',
    'pillar4.title': '各品牌皆可服务',
    'pillar4.body': '我们供应、安装并维修各大主流冷气品牌与机型。',
    'pillar5.title': '亲切细心的服务',
    'pillar5.body': '整洁的工作、礼貌的服务，以及我们用心保证的效果。',
    'area.eyebrow': '服务区域', 'area.title': '我们的服务范围。',
    'area.sub': '总部设于 Pusat Inkubator MARA, Kota Samarahan — 为该地区的住宅、商业及活动客户提供服务。',
    'area.tag1': '总部', 'area.tag2': '服务范围', 'area.tag3': '按需服务',
    'area.a1title': 'Kota Samarahan',
    'area.a1body': 'Pusat Inkubator MARA, Lot 1F/F, Rumah Kedai, 94300 Kota Samarahan, Sarawak。',
    'area.a2title': '大古晋地区',
    'area.a2body': '覆盖古晋至 Samarahan 走廊一带的住宅、办公室与店铺。',
    'area.a3title': '活动与市集',
    'area.a3body': '为活动、市集及临时摊位提供短期制冷解决方案。',
    'contact.eyebrow': '联系我们', 'contact.title': '让我们为您带来清凉。',
    'contact.ownertitle': '创办人', 'contact.areatitle': '服务区域',
    'contact.areabody': 'Kota Samarahan 及大古晋地区, Sarawak',
    'contact.regtitle': '注册资料',
    'contact.gettitle': '联系方式',
    'contact.getbody': '欢迎联系我们获取免费报价、紧急维修，或安排定期保养。',
    'footer.tagline': '尊享清凉，诚心服务 — Kota Samarahan, Sarawak。',
    'footer.copy': '© 2026 Shiraz Empire。版权所有。',
    'footer.credit': '网站由 <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a> 制作',
  },
  ib: {
    'nav.about': 'Pasal Kami', 'nav.services': 'Pengawa', 'nav.why': 'Kenapa Kami',
    'nav.area': 'Kawasan Pengawa', 'nav.contact': 'Berandau', 'nav.cta': 'Pesan Pengawa',
    'hero.eyebrow': 'Kota Samarahan — Pakar Penyaman Udara',
    'hero.title': 'Chelap Ti Nyamai, <em>Dikereja Enggau Bujur</em>.',
    'hero.sub': 'Shiraz Empire nyadi, masang, ngintu enggau ngubah unit penyaman udara di Kota Samarahan enggau Kuching — reti ti chelap enggau jejantan ti bera ka pengawa sida.',
    'hero.cta1': 'Minta Sebut Reti Percuma', 'hero.cta2': 'Pengawa Kami',
    'hero.stat1': 'Pengawa Pemegai', 'hero.stat2': 'Pengawa Datai',
    'hero.stat3': 'Reti Chelap', 'hero.stat4': 'Bedaftar di Endur',
    'about.eyebrow': 'Pasal Kami', 'about.title': 'Dibengkah Atas Pechaya, Diau Enggau Mas.',
    'about.p1': 'Shiraz Empire nyadi pengawa penyaman udara ti bedaftar, bekediri di Pusat Inkubator MARA, Kota Samarahan, Sarawak — bedaftar resmi baroh Ordinan Nama Pengawa Sarawak (No. Daftar SAM/PAR/044/2025).',
    'about.p2': 'Dipungka Mohamad Shahrul Fikrie bin Baduwi, ari Kampung Nakong, Kota Samarahan, Shiraz Empire dibengkah atas pekara ti mudah: semua rumah enggau pengawa patut bulih udara chelap ti tuchi — diberi enggau bujur, tepat maya, enggau perhatian.',
    'about.regtitle': 'Bedaftar Resmi',
    'about.reg1': 'No. Daftar SAM/PAR/044/2025',
    'about.reg2': 'Bedaftar Januari 2025, Kota Samarahan',
    'about.reg3': 'Pusat Inkubator MARA, Kota Samarahan, Sarawak',
    'about.reg4': 'Tuan: Mohamad Shahrul Fikrie bin Baduwi',
    'vm.visiontitle': 'Visi Kami',
    'vm.visionbody': 'Deka mansang nyadi nama ti dipechaya rumah enggau pengawa di Kota Samarahan ke pengawa penyaman udara ti bujur enggau manah.',
    'vm.missiontitle': 'Misi Kami',
    'vm.m1': '<strong>Pengawa Bujur</strong> — reti chelap, nadai bayar tersembunyi.',
    'vm.m2': '<strong>Chepat Bebalas</strong> — pengawa hari nya enggau kecemasan.',
    'vm.m3': '<strong>Pengawa Manah</strong> — semua unit diintu ngambika tahan lama.',
    'vm.m4': '<strong>Komuniti Dulu</strong> — sigi anak Sarawak, sigi bangga.',
    'services.eyebrow': 'Pengawa Kami', 'services.title': 'Empat Tiang Chelap.',
    'services.sub': 'Ari unit baru nyentuk ngagai unit ti agi rusak — Shiraz Empire ngintu semua keperluan penyaman udara nuan.',
    'service1.title': 'Bekal Penyaman Udara',
    'service1.body': 'Unit penyaman udara ti manah dibekal ke rumah, opis, kedai enggau endur acara — sesuai enggau endur enggau duit nuan.',
    'service2.title': 'Pemasangan',
    'service2.body': 'Pemasangan ti manah enggau paip, salur ai enggau wayar ti betul — dikereja enggau bujur tiap kali.',
    'service3.title': 'Pengintu',
    'service3.body': 'Basu kimia, isi gas enggau bersihka filter sebaka ngambika unit nuan tetap chelap, lansik enggau nadai bau.',
    'service4.title': 'Pengubah & Pengawa',
    'service4.body': 'Diagnosis enggau pengubah ke unit ti enda chelap, bochor tauka inggar — enggau saran bujur sama ubah tauka ganti.',
    'why.eyebrow': 'Kenapa Kami', 'why.title': 'Kenapa Pilih Shiraz Empire.',
    'pillar1.title': 'Anak Endur & Dipechaya',
    'pillar1.body': 'Asal enggau bekediri di Kota Samarahan — kami nemu kawasan, rumah enggau iklim sia.',
    'pillar2.title': 'Reti Chelap',
    'pillar2.body': 'Sebut reti jelas sebedau pengawa pun — nadai bayar mengejut.',
    'pillar3.title': 'Chepat & Dipechaya',
    'pillar3.body': 'Janji temu tepat maya enggau pengawa chepat siap, ngambik pengawa datai.',
    'pillar4.title': 'Semua Jenis Dilayan',
    'pillar4.body': 'Kami bekal, masang enggau ngintu semua jenis enggau brand penyaman udara.',
    'pillar5.title': 'Pengawa Mesra & Teliti',
    'pillar5.body': 'Pengawa tuchi, ramah, enggau asil ti kami sokong.',
    'area.eyebrow': 'Kawasan Pengawa', 'area.title': 'Endur Kami Bekereja.',
    'area.sub': 'Bekediri di Pusat Inkubator MARA, Kota Samarahan — ngawa pelanggan rumah, pengawa enggau acara di semua kawasan.',
    'area.tag1': 'Pusat', 'area.tag2': 'Kawasan Pengawa', 'area.tag3': 'Nitihka Pinta',
    'area.a1title': 'Kota Samarahan',
    'area.a1body': 'Pusat Inkubator MARA, Lot 1F/F, Rumah Kedai, 94300 Kota Samarahan, Sarawak.',
    'area.a2title': 'Kuching & Sekuliling',
    'area.a2body': 'Ngawa rumah, opis enggau kedai di kawasan Kuching–Samarahan.',
    'area.a3title': 'Acara & Bazar',
    'area.a3body': 'Pengawa chelap chukup ke acara, bazar enggau endur pop-up.',
    'contact.eyebrow': 'Berandau', 'contact.title': 'Datai Diatu Kitai Ngaga Chelap.',
    'contact.ownertitle': 'Tuan Pun', 'contact.areatitle': 'Kawasan Pengawa',
    'contact.areabody': 'Kota Samarahan & Kuching, Sarawak',
    'contact.regtitle': 'Pendaftaran',
    'contact.gettitle': 'Berandau Enggau Kami',
    'contact.getbody': 'Berandau enggau kami ke sebut reti percuma, pengubah kecemasan, tauka pengintu sebaka.',
    'footer.tagline': 'Chelap Ti Nyamai, Pengawa Ti Bujur — Kota Samarahan, Sarawak.',
    'footer.copy': '© 2026 Shiraz Empire. Semua Hak Tedaun.',
    'footer.credit': 'Website digaga ulih <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a>',
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
  localStorage.setItem('shiraz-lang', lang);
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

const savedLang = localStorage.getItem('shiraz-lang') || 'bm';
applyLanguage(savedLang);
