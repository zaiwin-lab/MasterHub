// Nav background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Reveal-on-scroll animations
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el) => observer.observe(el));

// Smooth-scroll for in-page nav links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── Language toggle (BM / EN / 中 / IB) ─────────────────
const translations = {
  en: {
    'nav.about': 'Our Story', 'nav.products': 'Produce', 'nav.process': 'Process',
    'nav.team': 'Team', 'nav.contact': 'Contact', 'nav.cta': 'Partner With Us',

    'hero.eyebrow': 'Santubong, Kuching, Sarawak — Modern Agriculture',
    'hero.title1': 'Modern Agriculture,', 'hero.title.em': 'Tangible', 'hero.title2': ' Results.',
    'hero.sub': 'SJF Enterprise is a Bumiputera agricultural business growing premium Cili Geronong (Habanero) and fresh leafy vegetables under controlled greenhouse conditions — built on systematic farming, real infrastructure, and an active digital presence.',
    'hero.cta1': 'Our Produce', 'hero.cta2': 'Partner With Us',
    'hero.stat1': 'Established as a registered Bumiputera enterprise',
    'hero.stat2': 'Full acre of controlled greenhouse farmland',
    'hero.stat3': 'Large-scale rain-shelter greenhouses',
    'hero.stat4': 'Followers across our digital channels',

    'about.eyebrow': 'Our Story',
    'about.title': 'Rooted in <em>Sarawak</em>, growing for the future',
    'about.p1': 'Established in 2019, SJF Enterprise (Reg. No. 116118) is a dedicated Bumiputera enterprise operating in the modern agricultural sector, based in Santubong, Kuching, Sarawak.',
    'about.p2': 'We were founded to solve a simple, critical need: meeting market demand for consistently fresh, high-quality local produce.',
    'about.p3': 'By combining systematic farming methods with a commitment to our local economy, we have built a progressive agricultural business that creates real jobs and delivers real value to the community.',
    'vm.strong1': 'Quality First.', 'vm.text1': 'An uncompromising focus on producing premium, high-grade agricultural yields.',
    'vm.strong2': 'Systematic Operations.', 'vm.text2': 'Every farm activity is managed through highly organised, professional and modern frameworks.',
    'vm.strong3': 'Community Impact.', 'vm.text3': 'Creating employment opportunities and contributing directly to the economic development of our local community.',

    'vision.eyebrow': 'Vision &amp; Mission',
    'vision.heading': "Where we're <em>headed</em>, and how we get there",
    'vision.title': 'Our Vision',
    'vision.text': 'To be a highly competitive, progressive modern agricultural enterprise — recognised locally and nationally for our integration of systematic farming and effective market reach.',
    'mission.title': 'Our Mission',
    'mission1.title': 'Premium Output', 'mission1.desc': 'To consistently produce fresh, high-quality agricultural goods that meet exact customer demands.',
    'mission2.title': 'Modern Efficiency', 'mission2.desc': 'To utilise systematic, modern farming methods to guarantee high productivity and reliability.',
    'mission3.title': 'Community Impact', 'mission3.desc': 'To actively create employment opportunities and contribute directly to the economic development of our local community.',
    'mission4.title': 'Trusted Brand', 'mission4.desc': 'To build a lasting, trustworthy brand capable of leading the modern agricultural industry.',

    'pillars.eyebrow': 'Why Partner With Us',
    'pillars.title': '5 Pillars of <em>Reliability</em>',
    'pillars.sub': 'Everything we do is built on a foundation designed for trust, scale, and long-term partnership.',
    'pillar1.title': 'Quality First', 'pillar1.desc': 'An uncompromising focus on producing premium, high-grade agricultural yields.',
    'pillar2.title': 'Systematic Operations', 'pillar2.desc': 'Managing all farm activities through highly organised, professional, and modern frameworks.',
    'pillar3.title': 'Active Market Reach', 'pillar3.desc': 'Utilising proven digital channels to maintain a strong, consistent connection with buyers.',
    'pillar4.title': 'Scalable Growth', 'pillar4.desc': 'Positioned with the infrastructure and expertise to expand seamlessly within modern markets.',
    'pillar5.title': 'Customer Guarantee', 'pillar5.desc': 'A steadfast commitment to delivering total customer and partner satisfaction.',

    'infra.eyebrow': 'Our Infrastructure',
    'infra.title': 'Tangible assets, <em>real</em> capacity',
    'infra.sub': 'Our operations are anchored by robust physical assets. These controlled environments protect crops from unpredictable weather, ensuring a steady, reliable yield year-round.',
    'infra.label1': 'Location', 'infra.value1': 'TKPM Rampangi, Jalan Santubong, Kuching, Sarawak',
    'infra.label2': 'Land Area', 'infra.value2': '1 Full Acre',
    'infra.label3': 'Primary Facilities', 'infra.value3': '4 Large-Scale Rain Shelter Greenhouses',
    'infra.label4': 'Dimensions', 'infra.value4': '60 ft × 100 ft per structure',

    'products.eyebrow': 'Premium Harvest',
    'products.title': 'From greenhouse to <em>market</em>, every day',
    'products.sub': 'Inside our facilities, agriculture is treated as an exact science — modern fertigation and systematic farm management optimise plant health, minimise waste, and guarantee a uniform, high-quality harvest.',
    'product1.title': 'Cili Geronong (Habanero)',
    'product1.desc': 'Our flagship crop, cultivated under strict quality controls. By managing the growing environment precisely, we deliver chillies with exceptional colour, size, and heat — meeting the rigorous standards of local suppliers and commercial buyers.',
    'product2.title': 'Fresh Leafy Vegetables',
    'product2.desc': 'Alongside our robust chilli production, SJF Enterprise cultivates premium leafy greens. Our systematic approach ensures every head is crisp, vibrant, and market-ready the moment it leaves the greenhouse.',

    'process.eyebrow': 'How We Work',
    'process.title': 'From <em>Farm</em> to Market',
    'process.sub': 'A consistent, traceable process — from the moment a seed is planted to the moment produce reaches our partners.',
    'process1.title': 'Controlled Cultivation', 'process1.desc': 'Planting and nurturing crops in systematic, weather-protected environments.',
    'process2.title': 'Quality Assurance &amp; Packing', 'process2.desc': 'Harvesting at peak freshness and meticulously packing the produce in our on-site facilities.',
    'process3.title': 'Direct Supply', 'process3.desc': 'Delivering consistent volumes of fresh agricultural goods directly to local customers, small traders, and commercial partners.',

    'team.eyebrow': 'Our People',
    'team.title': 'A structured, <em>accountable</em> team',
    'team.sub': 'Technology and infrastructure are only as good as the people who manage them. Every package that leaves our facility is hand-inspected and logged.',
    'team.lead.role': 'Director &amp; Manager',
    'team.lead.desc': 'An experienced Bumiputera entrepreneur with a deep-rooted passion for sustainable, commercial agriculture. Active in the industry since 2019, including experience as a Commercial Farm Manager (Fertigasi Sarawak). Certified in Business Planning and Entrepreneur Development by MARA Sarawak, with specialised training in Commercial Fertigation, Hydroponic Systems, and Organic Fertiliser Production.',
    'team.member1.role': 'Office Management',
    'team.member2.role': 'Farm Supervisor',
    'team.member3.role': 'Farm Operations',
    'team.member4.role': 'Farm Operations',

    'contact.eyebrow': 'Get In Touch',
    'contact.title': "Let's grow <em>together</em>",
    'contact.sub': "With a clear roadmap, systematic management, and proven infrastructure, SJF Enterprise is primed for steady expansion in the modern agricultural sector. Reach out — we'd love to hear from you.",
    'contact.address.label': 'Visit Us',
    'contact.address.value': 'Room 1, Ground Floor, Lot 3542, Blok 18, Salak Land District, Jalan Bako, 93050 Kuching, Sarawak, Malaysia.',
    'contact.phone.label': 'Call / WhatsApp',
    'contact.email.label': 'Email',
    'contact.social1': 'Sj Farm – Santubong (Facebook)',
    'contact.social2': 'Cili Kamek (Facebook)',
    'contact.social3': 'TikTok',
    'contact.social4': 'WhatsApp Business',

    'footer.rights': '© 2026 SJF Enterprise (116118). All rights reserved.',
    'footer.credit': 'Web experience by <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a>',
  },

  bm: {
    'nav.about': 'Kisah Kami', 'nav.products': 'Hasil Tani', 'nav.process': 'Proses',
    'nav.team': 'Pasukan', 'nav.contact': 'Hubungi', 'nav.cta': 'Jalin Kerjasama',

    'hero.eyebrow': 'Santubong, Kuching, Sarawak — Pertanian Moden',
    'hero.title1': 'Pertanian Moden,', 'hero.title.em': 'Hasil', 'hero.title2': ' Yang Nyata.',
    'hero.sub': 'SJF Enterprise ialah perusahaan pertanian Bumiputera yang menanam Cili Geronong (Habanero) premium dan sayur-sayuran berdaun segar di bawah persekitaran rumah hijau terkawal — dibina atas asas pertanian sistematik, infrastruktur sebenar, dan kehadiran digital yang aktif.',
    'hero.cta1': 'Hasil Tani Kami', 'hero.cta2': 'Jalin Kerjasama',
    'hero.stat1': 'Ditubuhkan sebagai perusahaan Bumiputera berdaftar',
    'hero.stat2': 'Seekar tanah pertanian rumah hijau terkawal',
    'hero.stat3': 'Rumah hijau pelindung hujan berskala besar',
    'hero.stat4': 'Pengikut merentasi saluran digital kami',

    'about.eyebrow': 'Kisah Kami',
    'about.title': 'Berakar di <em>Sarawak</em>, membesar untuk masa depan',
    'about.p1': 'Ditubuhkan pada 2019, SJF Enterprise (No. Pendaftaran 116118) ialah perusahaan Bumiputera yang berdedikasi dalam sektor pertanian moden, beroperasi di Santubong, Kuching, Sarawak.',
    'about.p2': 'Kami ditubuhkan untuk menyelesaikan keperluan kritikal yang mudah: memenuhi permintaan pasaran untuk hasil tani tempatan yang segar dan berkualiti tinggi secara konsisten.',
    'about.p3': 'Dengan menggabungkan kaedah pertanian sistematik bersama komitmen terhadap ekonomi tempatan, kami telah membina sebuah perniagaan pertanian progresif yang mencipta pekerjaan sebenar dan memberikan nilai sebenar kepada komuniti.',
    'vm.strong1': 'Kualiti Terbaik.', 'vm.text1': 'Tumpuan tanpa kompromi terhadap penghasilan hasil pertanian premium bergred tinggi.',
    'vm.strong2': 'Operasi Sistematik.', 'vm.text2': 'Setiap aktiviti ladang diuruskan melalui rangka kerja yang sangat tersusun, profesional dan moden.',
    'vm.strong3': 'Impak Komuniti.', 'vm.text3': 'Mencipta peluang pekerjaan dan menyumbang secara langsung kepada pembangunan ekonomi komuniti tempatan kami.',

    'vision.eyebrow': 'Visi &amp; Misi',
    'vision.heading': 'Ke mana kami <em>menuju</em>, dan bagaimana kami sampai ke sana',
    'vision.title': 'Visi Kami',
    'vision.text': 'Untuk menjadi sebuah perusahaan pertanian moden yang progresif dan amat berdaya saing — diiktiraf di peringkat tempatan dan kebangsaan kerana penyepaduan pertanian sistematik dan capaian pasaran yang berkesan.',
    'mission.title': 'Misi Kami',
    'mission1.title': 'Hasil Premium', 'mission1.desc': 'Untuk menghasilkan secara konsisten hasil pertanian segar dan berkualiti tinggi yang memenuhi kehendak pelanggan dengan tepat.',
    'mission2.title': 'Kecekapan Moden', 'mission2.desc': 'Untuk menggunakan kaedah pertanian sistematik dan moden bagi menjamin produktiviti dan kebolehpercayaan yang tinggi.',
    'mission3.title': 'Impak Komuniti', 'mission3.desc': 'Untuk secara aktif mencipta peluang pekerjaan dan menyumbang secara langsung kepada pembangunan ekonomi komuniti tempatan kami.',
    'mission4.title': 'Jenama Dipercayai', 'mission4.desc': 'Untuk membina jenama yang berkekalan dan dipercayai, mampu mengetuai industri pertanian moden.',

    'pillars.eyebrow': 'Mengapa Bekerjasama Dengan Kami',
    'pillars.title': '5 Tonggak <em>Kebolehpercayaan</em>',
    'pillars.sub': 'Segala yang kami lakukan dibina atas asas yang direka untuk kepercayaan, skala, dan perkongsian jangka panjang.',
    'pillar1.title': 'Kualiti Terbaik', 'pillar1.desc': 'Tumpuan tanpa kompromi terhadap penghasilan hasil pertanian premium bergred tinggi.',
    'pillar2.title': 'Operasi Sistematik', 'pillar2.desc': 'Menguruskan semua aktiviti ladang melalui rangka kerja yang sangat tersusun, profesional, dan moden.',
    'pillar3.title': 'Capaian Pasaran Aktif', 'pillar3.desc': 'Menggunakan saluran digital terbukti untuk mengekalkan hubungan yang kukuh dan konsisten dengan pembeli.',
    'pillar4.title': 'Pertumbuhan Berskala', 'pillar4.desc': 'Dilengkapi dengan infrastruktur dan kepakaran untuk berkembang dengan lancar dalam pasaran moden.',
    'pillar5.title': 'Jaminan Pelanggan', 'pillar5.desc': 'Komitmen teguh untuk memberikan kepuasan sepenuhnya kepada pelanggan dan rakan kongsi.',

    'infra.eyebrow': 'Infrastruktur Kami',
    'infra.title': 'Aset nyata, kapasiti <em>sebenar</em>',
    'infra.sub': 'Operasi kami disokong oleh aset fizikal yang teguh. Persekitaran terkawal ini melindungi tanaman daripada cuaca yang tidak menentu, memastikan hasil yang stabil dan boleh dipercayai sepanjang tahun.',
    'infra.label1': 'Lokasi', 'infra.value1': 'TKPM Rampangi, Jalan Santubong, Kuching, Sarawak',
    'infra.label2': 'Keluasan Tanah', 'infra.value2': '1 Ekar Penuh',
    'infra.label3': 'Kemudahan Utama', 'infra.value3': '4 Rumah Hijau Pelindung Hujan Berskala Besar',
    'infra.label4': 'Dimensi', 'infra.value4': '60 kaki × 100 kaki setiap struktur',

    'products.eyebrow': 'Hasil Premium',
    'products.title': 'Dari rumah hijau ke <em>pasaran</em>, setiap hari',
    'products.sub': 'Di dalam kemudahan kami, pertanian dianggap sebagai sains yang tepat — fertigasi moden dan pengurusan ladang sistematik mengoptimumkan kesihatan tanaman, meminimumkan pembaziran, dan menjamin hasil tuaian yang seragam dan berkualiti tinggi.',
    'product1.title': 'Cili Geronong (Habanero)',
    'product1.desc': 'Tanaman utama kami, ditanam di bawah kawalan kualiti yang ketat. Dengan menguruskan persekitaran tanaman secara tepat, kami menghasilkan cili dengan warna, saiz dan kepedasan yang luar biasa — memenuhi piawaian ketat pembekal tempatan dan pembeli komersial.',
    'product2.title': 'Sayur-sayuran Berdaun Segar',
    'product2.desc': 'Selain pengeluaran cili yang teguh, SJF Enterprise menanam sayuran berdaun premium. Pendekatan sistematik kami memastikan setiap pucuk rangup, segar dan sedia dipasarkan sebaik sahaja meninggalkan rumah hijau.',

    'process.eyebrow': 'Cara Kami Bekerja',
    'process.title': 'Dari <em>Ladang</em> ke Pasaran',
    'process.sub': 'Proses yang konsisten dan boleh dijejak — dari saat benih ditanam sehingga hasil sampai kepada rakan kongsi kami.',
    'process1.title': 'Penanaman Terkawal', 'process1.desc': 'Menanam dan menjaga tanaman dalam persekitaran sistematik yang dilindungi daripada cuaca.',
    'process2.title': 'Jaminan Kualiti &amp; Pembungkusan', 'process2.desc': 'Menuai pada tahap kesegaran optimum dan membungkus hasil dengan teliti di kemudahan kami.',
    'process3.title': 'Bekalan Terus', 'process3.desc': 'Menghantar bekalan hasil pertanian segar secara konsisten terus kepada pelanggan tempatan, peniaga kecil, dan rakan kongsi komersial.',

    'team.eyebrow': 'Pasukan Kami',
    'team.title': 'Pasukan yang <em>tersusun</em> dan bertanggungjawab',
    'team.sub': 'Teknologi dan infrastruktur hanya sebaik mana orang yang menguruskannya. Setiap bungkusan yang keluar dari kemudahan kami diperiksa dan direkodkan secara manual.',
    'team.lead.role': 'Pengarah &amp; Pengurus',
    'team.lead.desc': 'Seorang usahawan Bumiputera berpengalaman dengan minat mendalam terhadap pertanian komersial yang lestari. Aktif dalam industri sejak 2019, termasuk pengalaman sebagai Pengurus Ladang Komersial (Fertigasi Sarawak). Bertauliah dalam Perancangan Perniagaan dan Pembangunan Usahawan oleh MARA Sarawak, dengan latihan khusus dalam Fertigasi Komersial, Sistem Hidroponik, dan Pengeluaran Baja Organik.',
    'team.member1.role': 'Pengurusan Pejabat',
    'team.member2.role': 'Penyelia Ladang',
    'team.member3.role': 'Operasi Ladang',
    'team.member4.role': 'Operasi Ladang',

    'contact.eyebrow': 'Hubungi Kami',
    'contact.title': 'Mari kita berkembang <em>bersama</em>',
    'contact.sub': 'Dengan hala tuju yang jelas, pengurusan sistematik, dan infrastruktur terbukti, SJF Enterprise bersedia untuk berkembang secara mantap dalam sektor pertanian moden. Hubungi kami — kami ingin mendengar daripada anda.',
    'contact.address.label': 'Lawati Kami',
    'contact.address.value': 'Room 1, Tingkat Bawah, Lot 3542, Blok 18, Salak Land District, Jalan Bako, 93050 Kuching, Sarawak, Malaysia.',
    'contact.phone.label': 'Telefon / WhatsApp',
    'contact.email.label': 'E-mel',
    'contact.social1': 'Sj Farm – Santubong (Facebook)',
    'contact.social2': 'Cili Kamek (Facebook)',
    'contact.social3': 'TikTok',
    'contact.social4': 'WhatsApp Business',

    'footer.rights': '© 2026 SJF Enterprise (116118). Hak cipta terpelihara.',
    'footer.credit': 'Pengalaman web digaga oleh <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a>',
  },

  zh: {
    'nav.about': '我们的故事', 'nav.products': '农产品', 'nav.process': '流程',
    'nav.team': '团队', 'nav.contact': '联系我们', 'nav.cta': '商业合作',

    'hero.eyebrow': '砂拉越古晋santubong — 现代农业',
    'hero.title1': '现代农业，', 'hero.title.em': '实在的', 'hero.title2': ' 成果。',
    'hero.sub': 'SJF Enterprise 是一家土著（Bumiputera）农业企业，在受控温室环境中种植优质的哈瓦那辣椒（Cili Geronong）和新鲜叶菜——以系统化耕作、真实的基础设施和活跃的数字化营销为基础。',
    'hero.cta1': '我们的农产品', 'hero.cta2': '商业合作',
    'hero.stat1': '于2019年注册成立的土著企业',
    'hero.stat2': '一英亩受控温室农地',
    'hero.stat3': '大型防雨温室',
    'hero.stat4': '数字渠道关注者',

    'about.eyebrow': '我们的故事',
    'about.title': '扎根<em>砂拉越</em>，迈向未来',
    'about.p1': 'SJF Enterprise（注册号 116118）成立于2019年，是一家专注于现代农业领域的土著企业，总部位于砂拉越古晋的santubong。',
    'about.p2': '我们成立的初衷很简单却至关重要：满足市场对持续新鲜、高品质本地农产品的需求。',
    'about.p3': '通过将系统化耕作方法与对本地经济的承诺相结合，我们建立了一家进取的农业企业，创造了真实的就业机会，为社区带来真正的价值。',
    'vm.strong1': '品质第一。', 'vm.text1': '坚持不懈地生产优质、高等级的农产品。',
    'vm.strong2': '系统化运营。', 'vm.text2': '所有农场活动均通过高度组织化、专业且现代化的框架进行管理。',
    'vm.strong3': '社区贡献。', 'vm.text3': '创造就业机会，直接促进本地社区的经济发展。',

    'vision.eyebrow': '愿景与使命',
    'vision.heading': '我们的<em>方向</em>，以及如何到达',
    'vision.title': '我们的愿景',
    'vision.text': '成为一家极具竞争力、进取的现代农业企业——因系统化耕作与有效市场拓展的结合，在本地及全国范围内获得认可。',
    'mission.title': '我们的使命',
    'mission1.title': '优质产出', 'mission1.desc': '持续生产新鲜、高品质的农产品，满足客户的精确需求。',
    'mission2.title': '现代化效率', 'mission2.desc': '采用系统化、现代化的耕作方法，确保高生产力与可靠性。',
    'mission3.title': '社区贡献', 'mission3.desc': '积极创造就业机会，直接促进本地社区的经济发展。',
    'mission4.title': '值得信赖的品牌', 'mission4.desc': '打造持久、值得信赖的品牌，引领现代农业行业。',

    'pillars.eyebrow': '为何选择与我们合作',
    'pillars.title': '5大<em>可靠</em>支柱',
    'pillars.sub': '我们所做的一切都建立在为信任、规模和长期合作而打造的基础之上。',
    'pillar1.title': '品质第一', 'pillar1.desc': '坚持不懈地生产优质、高等级的农产品。',
    'pillar2.title': '系统化运营', 'pillar2.desc': '通过高度组织化、专业且现代化的框架管理所有农场活动。',
    'pillar3.title': '积极的市场拓展', 'pillar3.desc': '利用成熟的数字渠道，与买家保持稳定而紧密的联系。',
    'pillar4.title': '可扩展增长', 'pillar4.desc': '具备在现代市场中顺利扩展所需的基础设施与专业能力。',
    'pillar5.title': '客户保证', 'pillar5.desc': '坚定致力于为客户和合作伙伴提供全面满意的服务。',

    'infra.eyebrow': '我们的基础设施',
    'infra.title': '实在的资产，<em>真实</em>的产能',
    'infra.sub': '我们的运营依托于稳固的实体资产。这些受控环境保护作物免受不可预测天气的影响，确保全年稳定可靠的产量。',
    'infra.label1': '地点', 'infra.value1': '砂拉越古晋 Jalan Santubong, TKPM Rampangi',
    'infra.label2': '土地面积', 'infra.value2': '一整英亩',
    'infra.label3': '主要设施', 'infra.value3': '4座大型防雨温室',
    'infra.label4': '尺寸', 'infra.value4': '每座结构 60尺 × 100尺',

    'products.eyebrow': '优质农产',
    'products.title': '从温室到<em>市场</em>，每一天',
    'products.sub': '在我们的设施内，农业被视为一门精确的科学——现代化的滴灌施肥技术与系统化的农场管理优化了植株健康、减少浪费，并保证收成的统一与高品质。',
    'product1.title': '哈瓦那辣椒（Cili Geronong）',
    'product1.desc': '我们的旗舰作物，在严格的品质控制下种植。通过精确管理生长环境，我们出产色泽、大小与辣度俱佳的辣椒——满足本地供应商与商业买家的严苛标准。',
    'product2.title': '新鲜叶菜',
    'product2.desc': '除了稳健的辣椒生产外，SJF Enterprise 还种植优质叶菜。我们的系统化方法确保每一颗蔬菜在离开温室时都新鲜爽脆、即可上市。',

    'process.eyebrow': '我们的工作方式',
    'process.title': '从<em>农场</em>到市场',
    'process.sub': '一致且可追溯的流程——从种子种下的那一刻，到农产品送达合作伙伴手中。',
    'process1.title': '受控种植', 'process1.desc': '在系统化、防天气的环境中种植与培育作物。',
    'process2.title': '品质检验与包装', 'process2.desc': '在最新鲜的状态下采收，并在我们的现场设施中精心包装。',
    'process3.title': '直接供应', 'process3.desc': '将稳定数量的新鲜农产品直接交付给本地客户、小商贩与商业合作伙伴。',

    'team.eyebrow': '我们的团队',
    'team.title': '架构清晰、<em>权责分明</em>的团队',
    'team.sub': '科技与基础设施的价值取决于管理它们的人。每一份离开我们设施的包裹都经过人工检查与记录。',
    'team.lead.role': '董事兼经理',
    'team.lead.desc': '一位经验丰富的土著企业家，对可持续商业农业怀有深厚热忱。自2019年起活跃于该行业，曾担任商业农场经理（Fertigasi Sarawak）。获砂拉越玛拉局（MARA Sarawak）认证的商业规划与企业家发展资格，并接受过商业滴灌施肥、水耕系统与有机肥料生产的专业培训。',
    'team.member1.role': '行政管理',
    'team.member2.role': '农场主管',
    'team.member3.role': '农场运营',
    'team.member4.role': '农场运营',

    'contact.eyebrow': '联系我们',
    'contact.title': '让我们<em>携手</em>成长',
    'contact.sub': '凭借清晰的发展蓝图、系统化的管理与成熟的基础设施，SJF Enterprise 已为在现代农业领域的稳健扩张做好准备。欢迎与我们联系——我们期待您的来信。',
    'contact.address.label': '到访我们',
    'contact.address.value': 'Room 1, Ground Floor, Lot 3542, Blok 18, Salak Land District, Jalan Bako, 93050 Kuching, Sarawak, Malaysia.',
    'contact.phone.label': '电话 / WhatsApp',
    'contact.email.label': '电邮',
    'contact.social1': 'Sj Farm – Santubong（Facebook）',
    'contact.social2': 'Cili Kamek（Facebook）',
    'contact.social3': 'TikTok',
    'contact.social4': 'WhatsApp Business',

    'footer.rights': '© 2026 SJF Enterprise (116118). 版权所有。',
    'footer.credit': '网站由 <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a> 打造',
  },

  ib: {
    'nav.about': 'Pekara Kami', 'nav.products': 'Asil Tanam', 'nav.process': 'Pemproses',
    'nav.team': 'Raban Kami', 'nav.contact': 'Berabung', 'nav.cta': 'Begulai Enggau Kami',

    'hero.eyebrow': 'Santubong, Kuching, Sarawak — Pertanian Moden',
    'hero.title1': 'Pertanian Moden,', 'hero.title.em': 'Asil', 'hero.title2': ' Ti Bendar.',
    'hero.sub': 'SJF Enterprise endang nyengkaum kebun Bumiputera ke nanam Cili Geronong (Habanero) ti premium enggau utai sayur daun seger ba dalam rumah hijau ti dikawal — digaga atas pemansang pertanian sistematik, infrastruktur ti bendar, enggau penemu digital ti aktif.',
    'hero.cta1': 'Asil Tanam Kami', 'hero.cta2': 'Begulai Enggau Kami',
    'hero.stat1': 'Ditubuhka nyadi kebun Bumiputera ti didaftar',
    'hero.stat2': 'Sa-ekar tanah pertanian rumah hijau dikawal',
    'hero.stat3': 'Rumah hijau pelindung ujan ti besai',
    'hero.stat4': 'Bala pengikut ba semua saluran digital kami',

    'about.eyebrow': 'Pekara Kami',
    'about.title': 'Berakar di <em>Sarawak</em>, mansang ke pemanjai diatu',
    'about.p1': 'Ditubuhka taun 2019, SJF Enterprise (No. Pendaftar 116118) endang nyengkaum kebun Bumiputera ke bekereja ba sektor pertanian moden, bediri di Santubong, Kuching, Sarawak.',
    'about.p2': 'Kami ditubuhka deka nyelesaika peneka ti penting: nyaup permintai pasar ke asil tanam endur ti seger sereta bekualiti tinggi.',
    'about.p3': 'Ngena chara pertanian sistematik enggau pengasuh ba ekonomi endur, kami udah ngaga pengawa pertanian ti mansang ti ngaga pengawa ti bendar sereta meri reti ke endur kami.',
    'vm.strong1': 'Kualiti Dulu.', 'vm.text1': 'Beratika asil pertanian ti premium sereta bekualiti tinggi.',
    'vm.strong2': 'Pengawa Sistematik.', 'vm.text2': 'Semua pengawa kebun diatur ngena chara ti tersusun, profesional sereta moden.',
    'vm.strong3': 'Pemansang Endur.', 'vm.text3': 'Ngaga peluang pengawa sereta nulung pemansang ekonomi endur kami.',

    'vision.eyebrow': 'Penemu &amp; Tetuju',
    'vision.heading': 'Ni ke <em>tuju</em> kami, sereta baka ni kami ngagai utai nya',
    'vision.title': 'Penemu Kami',
    'vision.text': 'Deka nyadi kebun pertanian moden ti pandai bersaing sereta mansang — diaku endur enggau menua ketegal pemansang pertanian sistematik enggau pasar ti efektif.',
    'mission.title': 'Tetuju Kami',
    'mission1.title': 'Asil Premium', 'mission1.desc': 'Deka ngasilka asil pertanian ti seger sereta bekualiti tinggi ti nyaup peneka pelanggan.',
    'mission2.title': 'Pengawa Moden', 'mission2.desc': 'Deka ngena chara pertanian sistematik sereta moden ke ngasilka pengawa ti tinggi sereta dipechaya.',
    'mission3.title': 'Pemansang Endur', 'mission3.desc': 'Deka aktif ngaga peluang pengawa sereta nulung pemansang ekonomi endur kami.',
    'mission4.title': 'Jenama Dipechaya', 'mission4.desc': 'Deka ngaga jenama ti tahan lama sereta dipechaya, ulih mimpin industri pertanian moden.',

    'pillars.eyebrow': 'Kenuka Begulai Enggau Kami',
    'pillars.title': '5 Tiang <em>Pemechaya</em>',
    'pillars.sub': 'Semua ti kami ngereja digaga atas pemansang ke pemechaya, skala, sereta begulai pemanjai.',
    'pillar1.title': 'Kualiti Dulu', 'pillar1.desc': 'Beratika asil pertanian ti premium sereta bekualiti tinggi.',
    'pillar2.title': 'Pengawa Sistematik', 'pillar2.desc': 'Ngatur semua pengawa kebun ngena chara ti tersusun, profesional, sereta moden.',
    'pillar3.title': 'Pasar Ti Aktif', 'pillar3.desc': 'Ngena saluran digital ke udah dibuktika ke nyaga pekarang enggau pemiau.',
    'pillar4.title': 'Pemansang Berskala', 'pillar4.desc': 'Bisi infrastruktur sereta pengelandik ke mansang ba pasar moden.',
    'pillar5.title': 'Jaminan Pelanggan', 'pillar5.desc': 'Begaga deka meri pemuas ke pelanggan enggau bala pemiau.',

    'infra.eyebrow': 'Infrastruktur Kami',
    'infra.title': 'Aset ti bendar, pengawa ti <em>bendar</em>',
    'infra.sub': 'Pengawa kami digaga atas aset fizikal ti kering. Endur ti dikawal tu nyaga utai tanam ari penyakit ari cuaca, ngasuh asil ti tetap sepanjang taun.',
    'infra.label1': 'Endur', 'infra.value1': 'TKPM Rampangi, Jalan Santubong, Kuching, Sarawak',
    'infra.label2': 'Besai Tanah', 'infra.value2': '1 Ekar Tepenuh',
    'infra.label3': 'Kemudahan Utama', 'infra.value3': '4 Rumah Hijau Pelindung Ujan Ti Besai',
    'infra.label4': 'Besai Bangunan', 'infra.value4': '60 kaki × 100 kaki sa-bangunan',

    'products.eyebrow': 'Asil Premium',
    'products.title': 'Ari rumah hijau ngagai <em>pasar</em>, sehari-hari',
    'products.sub': 'Ba dalam kemudahan kami, pertanian dianggap baka sains ti tepat — chara fertigasi moden enggau pengawa kebun sistematik ngasuh utai tanam seger, kurang sampah, sereta meri asil ti seragam sereta bekualiti tinggi.',
    'product1.title': 'Cili Geronong (Habanero)',
    'product1.desc': 'Asil utama kami, ditanam ngena kawalan kualiti ti kering. Ngena chara ngatur endur tumboh ti tepat, kami ngasilka cili ti bewarna manah, besai, sereta pedas ti nyaup piawai pembekal endur enggau pemiau komersial.',
    'product2.title': 'Sayur Daun Seger',
    'product2.desc': 'Endur asil cili, SJF Enterprise mega nanam sayur daun ti premium. Chara sistematik kami ngasuh tiap iti daun seger, manah dipandang, sereta sedia dipasarka lebuh peluai ari rumah hijau.',

    'process.eyebrow': 'Chara Kami Bekereja',
    'process.title': 'Ari <em>Kebun</em> Ngagai Pasar',
    'process.sub': 'Pemproses ti tetap sereta ulih dijejak — ari benih ditanam nyentuk ngagai asil ti diterima bala pemiau kami.',
    'process1.title': 'Penanam Dikawal', 'process1.desc': 'Nanam sereta ngintu utai tanam ba endur sistematik ti dilindung ari cuaca.',
    'process2.title': 'Jaminan Kualiti &amp; Pembungkus', 'process2.desc': 'Nuai ba maya seger sereta mungkus asil enggau ati ba kemudahan kami empu.',
    'process3.title': 'Bekal Terus', 'process3.desc': 'Ngirimka asil pertanian seger ti tetap terus ngagai pelanggan endur, peniaga mit, sereta bala pemiau komersial.',

    'team.eyebrow': 'Raban Kami',
    'team.title': 'Raban ti <em>tersusun</em> sereta betanggungjawap',
    'team.sub': 'Teknologi enggau infrastruktur semina manah enti diatur orang ti betul. Tiap bungkus ari kemudahan kami diperiksa sereta dicatat.',
    'team.lead.role': 'Pengarah &amp; Pengurus',
    'team.lead.desc': 'Usahawan Bumiputera ti bisi pengalaman dalam pertanian komersial ti tahan lama. Aktif dalam industri tu ari 2019, endang Pengurus Kebun Komersial (Fertigasi Sarawak). Bisi sijil Perancang Pengawa enggau Pemansang Usahawan ari MARA Sarawak, sereta latihan Fertigasi Komersial, Sistem Hidroponik, enggau Pengasil Baja Organik.',
    'team.member1.role': 'Pengurus Opis',
    'team.member2.role': 'Penyelia Kebun',
    'team.member3.role': 'Pengawa Kebun',
    'team.member4.role': 'Pengawa Kebun',

    'contact.eyebrow': 'Berabung Enggau Kami',
    'contact.title': 'Aram <em>begulai</em> mansang',
    'contact.sub': 'Enggau lalu ti chelap, pengurus sistematik, sereta infrastruktur ti udah dibuktika, SJF Enterprise sedia deka mansang ba sektor pertanian moden. Berabung enggau kami — kami galau deka madahka ari nuan.',
    'contact.address.label': 'Datai Ngagai Kami',
    'contact.address.value': 'Room 1, Ground Floor, Lot 3542, Blok 18, Salak Land District, Jalan Bako, 93050 Kuching, Sarawak, Malaysia.',
    'contact.phone.label': 'Telefon / WhatsApp',
    'contact.email.label': 'Emel',
    'contact.social1': 'Sj Farm – Santubong (Facebook)',
    'contact.social2': 'Cili Kamek (Facebook)',
    'contact.social3': 'TikTok',
    'contact.social4': 'WhatsApp Business',

    'footer.rights': '© 2026 SJF Enterprise (116118). Semua hak diau.',
    'footer.credit': 'Pengalaman web digaga ulih <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a>',
  },
};

const i18nEls = document.querySelectorAll('[data-i18n]');
const langButtons = document.querySelectorAll('.nav-lang button');

function applyLanguage(lang) {
  const dict = translations[lang] || translations.en;
  i18nEls.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = dict[key];
    if (value === undefined) return;
    if (value.includes('<') || value.includes('&')) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });
  langButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.lang === lang));
  document.documentElement.lang = lang;
  localStorage.setItem('sjf-lang', lang);
}

langButtons.forEach((btn) => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

applyLanguage(localStorage.getItem('sjf-lang') || 'en');
