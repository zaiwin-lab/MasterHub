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
    'nav.about': 'About', 'nav.menu': 'Menu', 'nav.why': 'Why Us',
    'nav.locations': 'Find Us', 'nav.contact': 'Contact', 'nav.cta': 'Order Now',

    'hero.eyebrow': 'Sarawak — Modern Buko & Dessert Brand',
    'hero.title1': 'Premium Taste,', 'hero.title.em': 'Tak Cukup', 'hero.title2': ' Satu.',
    'hero.sub': 'Snow Buko & Desserts is a modern dessert brand built around creamy buko, biscuits and cakes — combining fresh fruit with a rich, exclusive cream recipe. Sweet, fresh, premium, and made for everyone.',
    'hero.cta1': 'Explore Our Menu', 'hero.cta2': 'Find Us',
    'hero.stat1': 'Signature creamy buko flavours',
    'hero.stat2': 'Outlets, bazaars & events across Sarawak',
    'hero.stat3': 'Fresh fruit & premium cream',
    'hero.stat4': 'Suitable for every age, everyone',

    'about.eyebrow': 'Pengenalan Syarikat',
    'about.title': 'A modern dessert brand, made with <em>heart</em>',
    'about.p1': 'Snow Buko & Desserts is a modern dessert brand focused on buko, biscuits, cakes and more. Our flagship product is a creamy buko dessert combined with fresh fruit.',
    'about.p2': 'Founded by Puan Sharifah Norliyana Binti Wan Seh, 30, with a background in Diploma Business Management — Snow Buko was built to bring an affordable, premium dessert experience to everyone.',
    'about.p3': 'Our concept is simple: easy to find, sweet, fresh and premium — suitable for every age group, men, women, and children alike.',
    'vm.strong1': 'Easy to Find.', 'vm.text1': 'Available across bazaars, events and partner outlets throughout Sarawak.',
    'vm.strong2': 'Sweet, Fresh & Premium.', 'vm.text2': 'A balanced, creamy taste made with quality fresh fruit — never overly sweet.',
    'vm.strong3': 'For Everyone.', 'vm.text3': 'A treat suitable for all ages — men, women and children alike.',

    'vision.eyebrow': 'Vision &amp; Mission',
    'vision.heading': "Where we're <em>headed</em>, and how we get there",
    'vision.title': 'Our Vision',
    'vision.text': 'To become the dessert brand of choice for all ages — premium buko and biscuit desserts favoured across Malaysia.',
    'mission.title': 'Our Mission',
    'mission1.title': 'Empowering Women', 'mission1.desc': 'To create job opportunities especially for women, building a sustainable financial ecosystem.',
    'mission2.title': 'Quality Desserts', 'mission2.desc': 'To provide high-quality desserts made with care and consistency.',
    'mission3.title': 'Fresh & Premium', 'mission3.desc': 'To use fresh, premium ingredients in every product we serve.',
    'mission4.title': 'Memorable Experience', 'mission4.desc': 'To give every customer a satisfying, memorable taste experience.',

    'menu.eyebrow': 'Menu Utama',
    'menu.title': 'Six signature <em>flavours</em>, one premium experience',
    'menu.sub': "Creamy buko + fresh fruit = premium experience. Every cup is made with our exclusive recipe and quality fresh fruit.",
    'flavour1': 'Strawberry', 'flavour2': 'Mango', 'flavour3': 'Coconut Pandan',
    'flavour4': 'Dragon Fruit', 'flavour5': 'Grape', 'flavour6': 'Chocolate',

    'why.eyebrow': 'Keunikan Produk',
    'why.title': '5 Pillars of <em>Premium</em> Quality',
    'why.sub': 'Every cup of Snow Buko is built around five qualities our customers love and keep coming back for.',
    'pillar1.title': 'Exclusive Recipe', 'pillar1.desc': 'A creamy, exclusive recipe developed for a rich and consistent taste in every cup.',
    'pillar2.title': 'Quality Fresh Fruit', 'pillar2.desc': 'Only quality, fresh fruit goes into our desserts — never compromised.',
    'pillar3.title': 'Balanced Sweetness', 'pillar3.desc': "A balanced taste that's never overly sweet — refreshing in every bite.",
    'pillar4.title': 'Refreshingly Cold', 'pillar4.desc': 'Best enjoyed chilled — refreshing on a hot Sarawak day.',
    'pillar5.title': 'Modern, Aesthetic Packaging', 'pillar5.desc': "Modern, Instagram-worthy packaging designed for today's customers.",

    'locations.eyebrow': 'Operasi & Servis',
    'locations.title': 'Find us across <em>Sarawak</em>',
    'locations.sub': "From petrol station kiosks to hospital marts and Sarawak's biggest bazaars — Snow Buko is always nearby.",
    'loc1': 'Petronas Telaga Tiga', 'loc2': 'Petronas Family Park',
    'loc3': 'Takeaway Outlet 1', 'loc4': 'Takeaway Outlet 2',
    'loc5': 'Mama Family Mart (24-Hour, Hospital)', 'loc6': 'Bring Me Dessert (BBS Semariang)',
    'loc7': 'Bazaar Meditel', 'loc8': 'Bazaar FAMA', 'loc9': 'Bazaar Mydin Opening',

    'contact.eyebrow': 'Get In Touch',
    'contact.title': "Let's make it <em>sweeter</em>, together",
    'contact.sub': "Want to order, host us at your event, or stock Snow Buko at your outlet? Reach out — we'd love to hear from you.",
    'contact.founder.label': 'Founder', 'contact.founder.value': 'Puan Sharifah Norliyana Binti Wan Seh',
    'contact.area.label': 'Service Area', 'contact.area.value': 'Bazaars, events & outlets across Sarawak, Malaysia.',
    'contact.email.label': 'Email',
    'contact.social1': 'WhatsApp Order', 'contact.social2': 'Facebook',
    'contact.social3': 'Instagram', 'contact.social4': 'TikTok',

    'footer.rights': '© 2026 Snow Buko & Desserts. All rights reserved.',
    'footer.tagline': 'Creamy Buko, Premium Taste — across Sarawak.',
    'footer.credit': 'This Digital Experience is Part of the <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a> Innovation Ecosystem',
  },

  bm: {
    'nav.about': 'Tentang Kami', 'nav.menu': 'Menu', 'nav.why': 'Kelebihan',
    'nav.locations': 'Lokasi Kami', 'nav.contact': 'Hubungi', 'nav.cta': 'Tempah Sekarang',

    'hero.eyebrow': 'Sarawak — Jenama Buko & Dessert Moden',
    'hero.title1': 'Premium Taste,', 'hero.title.em': 'Tak Cukup', 'hero.title2': ' Satu.',
    'hero.sub': 'Snow Buko & Desserts ialah jenama dessert moden yang memfokuskan kepada buko, biskut dan cake yang creamy — menggabungkan buah-buahan segar dengan resipi krim eksklusif. Sweet, fresh, premium, dan sesuai untuk semua.',
    'hero.cta1': 'Lihat Menu Kami', 'hero.cta2': 'Cari Kami',
    'hero.stat1': 'Perisa buko creamy istimewa',
    'hero.stat2': 'Outlet, bazar & event seluruh Sarawak',
    'hero.stat3': 'Buah segar & krim premium',
    'hero.stat4': 'Sesuai untuk semua peringkat umur',

    'about.eyebrow': 'Pengenalan Syarikat',
    'about.title': 'Jenama dessert moden, dibuat dengan <em>hati</em>',
    'about.p1': 'Snow Buko & Desserts merupakan jenama pencuci mulut moden yang memfokuskan kepada buko, biskut, cake dan lain-lain. Produk utama kami ialah buko dessert creamy dengan gabungan buah-buahan segar.',
    'about.p2': 'Ditubuhkan oleh Puan Sharifah Norliyana Binti Wan Seh, 30 tahun, berlatar belakang Diploma Business Management — Snow Buko dibina untuk membawa pengalaman dessert premium yang berpatutan kepada semua orang.',
    'about.p3': 'Konsep kami mudah: mudah didapati, sweet, fresh & premium — sesuai untuk semua peringkat umur, lelaki, perempuan dan kanak-kanak.',
    'vm.strong1': 'Mudah Didapati.', 'vm.text1': 'Boleh didapati di bazar, event dan outlet rakan kongsi di seluruh Sarawak.',
    'vm.strong2': 'Sweet, Fresh & Premium.', 'vm.text2': 'Rasa creamy yang seimbang dengan buah segar berkualiti — tidak terlalu manis.',
    'vm.strong3': 'Untuk Semua.', 'vm.text3': 'Sesuai untuk semua peringkat umur — lelaki, perempuan dan kanak-kanak.',

    'vision.eyebrow': 'Visi &amp; Misi',
    'vision.heading': 'Ke mana kami <em>menuju</em>, dan bagaimana kami sampai ke sana',
    'vision.title': 'Visi Kami',
    'vision.text': 'Menjadi jenama pilihan semua peringkat umur untuk dessert buko dan biskut premium pilihan ramai di Malaysia.',
    'mission.title': 'Misi Kami',
    'mission1.title': 'Memperkasa Wanita', 'mission1.desc': 'Memberi peluang pekerjaan kepada perempuan, sekali gus menjana eko sistem kewangan yang lestari.',
    'mission2.title': 'Dessert Berkualiti', 'mission2.desc': 'Menyediakan dessert berkualiti tinggi yang dibuat dengan teliti dan konsisten.',
    'mission3.title': 'Segar & Premium', 'mission3.desc': 'Menggunakan bahan-bahan segar & premium dalam setiap produk kami.',
    'mission4.title': 'Pengalaman Berkesan', 'mission4.desc': 'Memberi setiap pelanggan pengalaman rasa yang memuaskan dan tidak dilupakan.',

    'menu.eyebrow': 'Menu Utama',
    'menu.title': 'Enam perisa <em>istimewa</em>, satu pengalaman premium',
    'menu.sub': 'Creamy buko + buah segar = pengalaman premium. Setiap cawan dibuat dengan resipi eksklusif dan buah segar berkualiti.',
    'flavour1': 'Strawberry', 'flavour2': 'Mango', 'flavour3': 'Coconut Pandan',
    'flavour4': 'Dragon Fruit', 'flavour5': 'Grape', 'flavour6': 'Chocolate',

    'why.eyebrow': 'Keunikan Produk',
    'why.title': '5 Tonggak Kualiti <em>Premium</em>',
    'why.sub': 'Setiap cawan Snow Buko dibina atas lima keistimewaan yang disukai pelanggan kami dan membuatkan mereka kembali lagi.',
    'pillar1.title': 'Resipi Eksklusif', 'pillar1.desc': 'Resipi creamy eksklusif yang dibangunkan untuk rasa yang kaya dan konsisten dalam setiap cawan.',
    'pillar2.title': 'Buah Segar Berkualiti', 'pillar2.desc': 'Hanya buah-buahan segar berkualiti digunakan dalam dessert kami — tiada kompromi.',
    'pillar3.title': 'Rasa Seimbang', 'pillar3.desc': 'Rasa yang seimbang dan tidak terlalu manis — refreshing pada setiap suapan.',
    'pillar4.title': 'Refreshing Bila Sejuk', 'pillar4.desc': 'Paling sedap dinikmati sejuk — refreshing pada hari panas di Sarawak.',
    'pillar5.title': 'Packaging Moden & Aesthetic', 'pillar5.desc': 'Pembungkusan moden dan aesthetic direka untuk pelanggan hari ini.',

    'locations.eyebrow': 'Operasi & Servis',
    'locations.title': 'Cari kami di seluruh <em>Sarawak</em>',
    'locations.sub': 'Dari kiosk stesen minyak hingga mart hospital dan bazar terbesar Sarawak — Snow Buko sentiasa berdekatan.',
    'loc1': 'Petronas Telaga Tiga', 'loc2': 'Petronas Family Park',
    'loc3': 'Takeaway 1', 'loc4': 'Takeaway 2',
    'loc5': 'Mama Family Mart (24 Jam, Hospital)', 'loc6': 'Bring Me Dessert (BBS Semariang)',
    'loc7': 'Bazaar Meditel', 'loc8': 'Bazaar FAMA', 'loc9': 'Bazaar Mydin Opening',

    'contact.eyebrow': 'Hubungi Kami',
    'contact.title': 'Mari kita jadikan lebih <em>manis</em>, bersama',
    'contact.sub': 'Nak tempah, jemput kami ke event anda, atau letakkan Snow Buko di outlet anda? Hubungi kami — kami ingin mendengar daripada anda.',
    'contact.founder.label': 'Pengasas', 'contact.founder.value': 'Puan Sharifah Norliyana Binti Wan Seh',
    'contact.area.label': 'Kawasan Operasi', 'contact.area.value': 'Bazar, event & outlet di seluruh Sarawak, Malaysia.',
    'contact.email.label': 'E-mel',
    'contact.social1': 'Tempah via WhatsApp', 'contact.social2': 'Facebook',
    'contact.social3': 'Instagram', 'contact.social4': 'TikTok',

    'footer.rights': '© 2026 Snow Buko & Desserts. Hak cipta terpelihara.',
    'footer.tagline': 'Buko Berkrim, Rasa Premium — di seluruh Sarawak.',
    'footer.credit': 'Pengalaman Digital Ini Adalah Sebahagian daripada Ekosistem Inovasi <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a>',
  },

  zh: {
    'nav.about': '关于我们', 'nav.menu': '菜单', 'nav.why': '我们的优势',
    'nav.locations': '门店地点', 'nav.contact': '联系我们', 'nav.cta': '立即订购',

    'hero.eyebrow': '砂拉越 — 现代椰果甜品品牌',
    'hero.title1': 'Premium Taste，', 'hero.title.em': 'Tak Cukup', 'hero.title2': ' Satu。',
    'hero.sub': 'Snow Buko & Desserts 是一家现代甜品品牌，专注于香滑椰果甜品、饼干和蛋糕——将新鲜水果与浓郁的独家奶油配方相结合。香甜、新鲜、优质，老少皆宜。',
    'hero.cta1': '查看菜单', 'hero.cta2': '寻找我们',
    'hero.stat1': '招牌香滑椰果口味',
    'hero.stat2': '遍布砂拉越的门店、市集与活动',
    'hero.stat3': '新鲜水果与优质奶油',
    'hero.stat4': '老少皆宜，人人喜爱',

    'about.eyebrow': '公司简介',
    'about.title': '用心制作的现代甜品品牌',
    'about.p1': 'Snow Buko & Desserts 是一家专注于椰果、饼干、蛋糕等产品的现代甜品品牌。我们的招牌产品是搭配新鲜水果的香滑椰果甜品。',
    'about.p2': '由 Sharifah Norliyana Binti Wan Seh 女士（30岁，商业管理文凭背景）创立——Snow Buko 致力于为所有人带来实惠优质的甜品体验。',
    'about.p3': '我们的理念很简单：随手可得、香甜、新鲜与优质——适合所有年龄层，男女老少皆宜。',
    'vm.strong1': '随处可得。', 'vm.text1': '在砂拉越各地的市集、活动与合作门店均可购买。',
    'vm.strong2': '香甜、新鲜与优质。', 'vm.text2': '搭配优质新鲜水果，口感均衡香滑——绝不过甜。',
    'vm.strong3': '老少皆宜。', 'vm.text3': '适合所有年龄层——男女老少皆可享用。',

    'vision.eyebrow': '愿景与使命',
    'vision.heading': '我们的<em>方向</em>，以及如何到达',
    'vision.title': '我们的愿景',
    'vision.text': '成为各年龄层首选的甜品品牌——在马来西亚广受欢迎的优质椰果与饼干甜品。',
    'mission.title': '我们的使命',
    'mission1.title': '赋能女性', 'mission1.desc': '创造就业机会，尤其是为女性，建立可持续的financial生态系统。',
    'mission2.title': '优质甜品', 'mission2.desc': '提供用心制作、品质如一的高品质甜品。',
    'mission3.title': '新鲜与优质', 'mission3.desc': '每件产品均使用新鲜优质的原材料。',
    'mission4.title': '难忘体验', 'mission4.desc': '为每位顾客带来满意、难忘的味觉体验。',

    'menu.eyebrow': '主要菜单',
    'menu.title': '六款招牌<em>口味</em>，一种优质体验',
    'menu.sub': '香滑椰果 + 新鲜水果 = 优质体验。每一杯都采用我们的独家配方与优质新鲜水果制作。',
    'flavour1': '草莓', 'flavour2': '芒果', 'flavour3': '椰香班兰',
    'flavour4': '火龙果', 'flavour5': '葡萄', 'flavour6': '巧克力',

    'why.eyebrow': '产品特色',
    'why.title': '5大<em>优质</em>支柱',
    'why.sub': '每一杯 Snow Buko 都建立在五大特色之上，这正是顾客喜爱并不断回购的原因。',
    'pillar1.title': '独家配方', 'pillar1.desc': '专为每杯提供浓郁一致口感而研发的独家香滑配方。',
    'pillar2.title': '优质新鲜水果', 'pillar2.desc': '甜品中只使用优质新鲜水果——绝不妥协。',
    'pillar3.title': '口感均衡', 'pillar3.desc': '口感均衡，绝不过甜——每一口都清爽宜人。',
    'pillar4.title': '冰凉清爽', 'pillar4.desc': '冰镇享用最佳——在炎热的砂拉越格外清爽。',
    'pillar5.title': '现代美观包装', 'pillar5.desc': '为现代顾客打造的时尚高颜值包装。',

    'locations.eyebrow': '运营与服务',
    'locations.title': '遍布<em>砂拉越</em>的门店',
    'locations.sub': '从加油站小铺到医院便利店，再到砂拉越最大的市集——Snow Buko 总在您身边。',
    'loc1': 'Petronas Telaga Tiga', 'loc2': 'Petronas Family Park',
    'loc3': '外卖店 1', 'loc4': '外卖店 2',
    'loc5': 'Mama Family Mart（24小时，医院）', 'loc6': 'Bring Me Dessert（BBS Semariang）',
    'loc7': 'Bazaar Meditel', 'loc8': 'Bazaar FAMA', 'loc9': 'Bazaar Mydin 开幕',

    'contact.eyebrow': '联系我们',
    'contact.title': '让我们一起把生活变得更<em>甜蜜</em>',
    'contact.sub': '想要订购、邀请我们参加您的活动，或在您的门店上架 Snow Buko？欢迎联系我们——我们期待您的来信。',
    'contact.founder.label': '创办人', 'contact.founder.value': 'Sharifah Norliyana Binti Wan Seh 女士',
    'contact.area.label': '服务范围', 'contact.area.value': '遍布砂拉越的市集、活动与门店。',
    'contact.email.label': '电邮',
    'contact.social1': 'WhatsApp 订购', 'contact.social2': 'Facebook',
    'contact.social3': 'Instagram', 'contact.social4': 'TikTok',

    'footer.rights': '© 2026 Snow Buko & Desserts. 版权所有。',
    'footer.tagline': '香浓椰奶冻，尊享美味 — 遍布砂拉越。',
    'footer.credit': '此数字体验是 <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a> 创新生态系统的一部分',
  },

  ib: {
    'nav.about': 'Pekara Kami', 'nav.menu': 'Menu', 'nav.why': 'Kenuka Kami',
    'nav.locations': 'Endur Kami', 'nav.contact': 'Berabung', 'nav.cta': 'Tempah Diatu',

    'hero.eyebrow': 'Sarawak — Jenama Buko &amp; Dessert Moden',
    'hero.title1': 'Premium Taste,', 'hero.title.em': 'Tak Cukup', 'hero.title2': ' Satu.',
    'hero.sub': 'Snow Buko &amp; Desserts endang nyengkaum jenama dessert moden ti bekenak ari buko, biskut enggau cake ti creamy — nyampur buah seger enggau resipi krim ti istimewa. Manis, seger, premium, sereta sesuai ke semua orang.',
    'hero.cta1': 'Peda Menu Kami', 'hero.cta2': 'Iring Kami',
    'hero.stat1': 'Perisa buko creamy ti istimewa',
    'hero.stat2': 'Outlet, bazar enggau acara di serata Sarawak',
    'hero.stat3': 'Buah seger enggau krim premium',
    'hero.stat4': 'Sesuai ke semua umur, semua orang',

    'about.eyebrow': 'Pekara Kami',
    'about.title': 'Jenama dessert moden, digaga enggau <em>ati</em>',
    'about.p1': 'Snow Buko &amp; Desserts endang nyengkaum jenama dessert moden ti bekenak ari buko, biskut, cake enggau bukai. Asil utama kami nyengkaum buko dessert creamy ti dichampur enggau buah seger.',
    'about.p2': 'Ditubuhka ulih Puan Sharifah Norliyana Binti Wan Seh, umur 30 taun, ti bisi latar belakang Diploma Business Management — Snow Buko digaga deka mai pengalaman dessert premium ti murah ke semua orang.',
    'about.p3': 'Konsep kami mudah: senang dipeda, manis, seger sereta premium — sesuai ke semua umur, lelaki, indu sereta anak mit.',
    'vm.strong1': 'Senang Dipeda.', 'vm.text1': 'Bisi ba bazar, acara enggau outlet pemiau di serata Sarawak.',
    'vm.strong2': 'Manis, Seger sereta Premium.', 'vm.text2': 'Rasa creamy ti seimbang enggau buah seger ti bekualiti — enda manis lalu.',
    'vm.strong3': 'Ke Semua Orang.', 'vm.text3': 'Sesuai ke semua umur — lelaki, indu sereta anak mit.',

    'vision.eyebrow': 'Penemu &amp; Tetuju',
    'vision.heading': 'Ni ke <em>tuju</em> kami, sereta baka ni kami ngagai utai nya',
    'vision.title': 'Penemu Kami',
    'vision.text': 'Deka nyadi jenama pilihan semua umur ke dessert buko enggau biskut premium ti dipuji di serata Malaysia.',
    'mission.title': 'Tetuju Kami',
    'mission1.title': 'Nguatka Indu', 'mission1.desc': 'Ngaga peluang pengawa kelebih ke indu, ngaga ekosistem pemansang ti tahan lama.',
    'mission2.title': 'Dessert Bekualiti', 'mission2.desc': 'Meri dessert bekualiti tinggi ti digaga enggau ati sereta tetap.',
    'mission3.title': 'Seger sereta Premium', 'mission3.desc': 'Ngena utai seger sereta premium ba tiap asil kami.',
    'mission4.title': 'Pengalaman Ti Dikenang', 'mission4.desc': 'Meri pelanggan pengalaman rasa ti puas sereta dikenang.',

    'menu.eyebrow': 'Menu Utama',
    'menu.title': 'Enam perisa <em>istimewa</em>, sa-pengalaman premium',
    'menu.sub': 'Buko creamy + buah seger = pengalaman premium. Tiap cawan digaga enggau resipi istimewa enggau buah seger ti bekualiti.',
    'flavour1': 'Strawberry', 'flavour2': 'Mango', 'flavour3': 'Coconut Pandan',
    'flavour4': 'Dragon Fruit', 'flavour5': 'Grape', 'flavour6': 'Chocolate',

    'why.eyebrow': 'Kenuka Asil',
    'why.title': '5 Tiang Kualiti <em>Premium</em>',
    'why.sub': 'Tiap cawan Snow Buko digaga atas lima kenuka ti dikedu pelanggan kami sereta ngasuh sida pulai baru.',
    'pillar1.title': 'Resipi Istimewa', 'pillar1.desc': 'Resipi creamy istimewa ke rasa ti kaya sereta tetap ba tiap cawan.',
    'pillar2.title': 'Buah Seger Bekualiti', 'pillar2.desc': 'Semina buah seger bekualiti dipakai dalam dessert kami — enda dikurangka.',
    'pillar3.title': 'Rasa Seimbang', 'pillar3.desc': 'Rasa ti seimbang sereta enda manis lalu — refreshing tiap kali makai.',
    'pillar4.title': 'Refreshing Lebuh Chelap', 'pillar4.desc': 'Manah dimakai chelap — refreshing ba hari ti angat di Sarawak.',
    'pillar5.title': 'Pembungkus Moden sereta Manah', 'pillar5.desc': 'Pembungkus moden ti manah dipeda digaga ke pelanggan diatu.',

    'locations.eyebrow': 'Pengawa &amp; Servis',
    'locations.title': 'Iring kami ba serata <em>Sarawak</em>',
    'locations.sub': 'Ari kiosk stesen minyak nyentuk ngagai mart hospital sereta bazar ti pemadu besai di Sarawak — Snow Buko seruran semak.',
    'loc1': 'Petronas Telaga Tiga', 'loc2': 'Petronas Family Park',
    'loc3': 'Takeaway 1', 'loc4': 'Takeaway 2',
    'loc5': 'Mama Family Mart (24 Jam, Hospital)', 'loc6': 'Bring Me Dessert (BBS Semariang)',
    'loc7': 'Bazaar Meditel', 'loc8': 'Bazaar FAMA', 'loc9': 'Bazaar Mydin Opening',

    'contact.eyebrow': 'Berabung Enggau Kami',
    'contact.title': 'Aram ngaga pemanjai <em>manis</em>, begulai',
    'contact.sub': 'Deka tempah, ngangau kami ngagai acara nuan, tauka deka nyimpan Snow Buko ba outlet nuan? Berabung enggau kami — kami galau deka madahka ari nuan.',
    'contact.founder.label': 'Pengasas', 'contact.founder.value': 'Puan Sharifah Norliyana Binti Wan Seh',
    'contact.area.label': 'Endur Servis', 'contact.area.value': 'Bazar, acara enggau outlet di serata Sarawak, Malaysia.',
    'contact.email.label': 'Emel',
    'contact.social1': 'Tempah Liwat WhatsApp', 'contact.social2': 'Facebook',
    'contact.social3': 'Instagram', 'contact.social4': 'TikTok',

    'footer.rights': '© 2026 Snow Buko & Desserts. Semua hak diau.',
    'footer.tagline': 'Buko Berkrim, Rasa Premium — perengkah Sarawak.',
    'footer.credit': 'Pengalaman Digital Tu Sebagi ari Ekosistem Inovasi <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a>',
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
  localStorage.setItem('snowbuko-lang', lang);
}

langButtons.forEach((btn) => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

applyLanguage(localStorage.getItem('snowbuko-lang') || 'en');
