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
      entry.target.classList.add('visible');
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

// ─── Motion: 3D tilt + hero parallax ─────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

if (!prefersReducedMotion && !isTouch) {
  // Subtle 3D tilt on collection cards
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Hero parallax: orbs + photo drift with the cursor
  const hero = document.getElementById('hero');
  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');
  const heroWrap = document.querySelector('.hero-bottle-wrap');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      if (orb1) orb1.style.translate = `${x * 30}px ${y * 30}px`;
      if (orb2) orb2.style.translate = `${x * -24}px ${y * -24}px`;
      if (heroWrap) heroWrap.style.translate = `${x * -14}px ${y * -10}px`;
    });
  }
}

// ─── Language toggle (BM / EN / 中 / IB) ─────────────────
const translations = {
  en: {
    'nav.collections': 'Collections', 'nav.story': 'Our Story', 'nav.bundles': 'Bundles',
    'nav.contact': 'Contact', 'nav.shop': 'Shop Now',
    'hero.eyebrow': 'Kuching, Sarawak — Lifestyle Fragrance Brand',
    'hero.title.line1': 'A Scent for', 'hero.title.every1': 'Every ', 'hero.title.mood': 'Mood',
    'hero.title.every2': 'Every ', 'hero.title.you': 'You',
    'hero.sub': 'Clik Fragrance turns perfume into self-expression — pick your scent based on how you want to feel today. Confident. Calm. Magnetic. Affordable, travel-friendly, made for daily life.',
    'hero.cta1': 'Explore Scents', 'hero.cta2': 'Get in Touch',
    'hero.stat1': 'Travel-size, everyday carry', 'hero.stat2': 'Mood-based scent profiles',
    'hero.stat3num': 'Daily', 'hero.stat3': 'Essential, not luxury-only',
    'concept.eyebrow': 'The Concept',
    'concept.title.pre': "Fragrance isn't just a scent — it's a ", 'concept.title.em': 'feeling', 'concept.title.post': ' you choose.',
    'concept.sub': 'Instead of focusing only on notes and ingredients, every Clik Fragrance is built around an emotion: confidence, calmness, attraction, focus, and joy. Pick the mood you want to wear, and let the scent carry you through your day.',
    'concept.card1.title': 'Choose by Mood', 'concept.card1.desc': 'Each fragrance is tagged to an emotion — so shopping feels personal, not overwhelming.',
    'concept.card2.title': 'Made for Daily Life', 'concept.card2.desc': '10ml travel-size bottles slip into any bag — reapply on the go, between classes, meetings or dates.',
    'concept.card3.title': 'Content-First Brand', 'concept.card3.desc': 'Born on TikTok & Instagram — GRWM routines, "Scent of the Day" pairing, and outfit-matching stories.',
    'collections.eyebrow': 'Mood Collections', 'collections.title': 'Find the scent that matches your energy.',
    'collection.bold.tag': 'Confidence', 'collection.bold.desc': 'A warm, magnetic blend for the days you walk in and own the room.',
    'collection.serene.tag': 'Calm', 'collection.serene.desc': 'Soft, powdery and grounding — for slow mornings and quiet focus.',
    'collection.muse.tag': 'Attraction', 'collection.muse.desc': 'Sweet and alluring — designed for date nights and golden-hour energy.',
    'collection.clarity.tag': 'Focus', 'collection.clarity.desc': 'Crisp and clean — a fresh reset for study sessions and deep work.',
    'collection.sunny.tag': 'Joy', 'collection.sunny.desc': 'Bright, fruity and playful — for good days and even better ones.',
    'collection.cta.title': 'Not sure where<br />to start?', 'collection.cta.desc': "DM us your vibe and we'll match you to your first Clik scent.", 'collection.cta.link': 'Find My Scent',
    'bundles.eyebrow': 'Bundle Sets', 'bundles.title': 'Try more, save more — built for everyday rotation.',
    'bundles.badge': 'Most Popular',
    'bundle.trio.title': 'Discovery Trio', 'bundle.trio.desc': 'Pick any 3 mood scents (10ml each) — the easiest way to find your signature.', 'bundle.trio.save': 'save RM 10',
    'bundle.full.title': 'Full Mood Set', 'bundle.full.desc': 'All 5 mood collections — one for every day of the work week.', 'bundle.full.save': 'save RM 25',
    'bundle.gift.title': 'Gift Box', 'bundle.gift.desc': '2 scents + premium packaging — perfect for birthdays & appreciation gifts.', 'bundle.gift.save': 'gift-ready',
    'story.eyebrow': 'Our Story', 'story.title': 'Built in Kuching, made for everyone who wants to feel like themselves.',
    'story.p1': "Clik Fragrance started with a simple idea: perfume shouldn't be intimidating or expensive to be meaningful. We design every scent around a feeling, not just a season — so picking your fragrance becomes part of how you show up for your day.",
    'story.p2': 'From "Get Ready With Me" videos to "Scent of the Day" pairings with your outfit, Clik Fragrance lives where our community already is — on TikTok and Instagram, growing one mood at a time.',
    'story.follow': 'Follow @clikfragrance',
    'story.founded.label': 'Founded', 'story.format.label': 'Format', 'story.format.value': '10ml travel-size bottles',
    'story.position.label': 'Positioning', 'story.position.value': 'Daily essential, not luxury-only',
    'story.channels.label': 'Channels', 'story.channels.value': 'TikTok & Instagram first',
    'contact.eyebrow': 'Get In Touch', 'contact.title': 'Ready to find your scent?',
    'contact.sub': "Message us on WhatsApp or Instagram — tell us your mood, and we'll help you pick (or build a bundle just for you).",
    'contact.meta': 'Kuching, Sarawak, Malaysia',
    'footer.rights': '© 2026 Clik Fragrance. All rights reserved.',
    'footer.tagline': 'Designed with ✦ for everyday self-expression.',
    'footer.credit': 'This Digital Experience is Part of the <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a> Innovation Ecosystem',
  },
  bm: {
    'nav.collections': 'Koleksi', 'nav.story': 'Kisah Kami', 'nav.bundles': 'Set Bundle',
    'nav.contact': 'Hubungi', 'nav.shop': 'Beli Sekarang',
    'hero.eyebrow': 'Kuching, Sarawak — Jenama Fragrance Gaya Hidup',
    'hero.title.line1': 'Wangian untuk', 'hero.title.every1': 'Setiap ', 'hero.title.mood': 'Mood',
    'hero.title.every2': 'Setiap ', 'hero.title.you': 'Diri Anda',
    'hero.sub': 'Clik Fragrance mengubah minyak wangi menjadi ekspresi diri — pilih wangian mengikut perasaan anda hari ini. Yakin. Tenang. Memikat. Berbaloi, mudah dibawa, sesuai untuk kegunaan harian.',
    'hero.cta1': 'Terokai Wangian', 'hero.cta2': 'Hubungi Kami',
    'hero.stat1': 'Saiz travel, mudah dibawa harian', 'hero.stat2': 'Profil wangian ikut mood',
    'hero.stat3num': 'Harian', 'hero.stat3': 'Keperluan harian, bukan sekadar mewah',
    'concept.eyebrow': 'Konsep Kami',
    'concept.title.pre': 'Wangian bukan sekadar bau — ia adalah ', 'concept.title.em': 'perasaan', 'concept.title.post': ' yang anda pilih.',
    'concept.sub': 'Bukan hanya fokus pada nota dan bahan, setiap Clik Fragrance dibina mengikut emosi: keyakinan, ketenangan, daya tarikan, fokus, dan kegembiraan. Pilih mood yang anda mahu, dan biarkan wangian itu menemani hari anda.',
    'concept.card1.title': 'Pilih Ikut Mood', 'concept.card1.desc': 'Setiap wangian ditanda dengan emosi — jadi membeli-belah terasa lebih peribadi.',
    'concept.card2.title': 'Untuk Kegunaan Harian', 'concept.card2.desc': 'Botol travel 10ml muat dalam beg — semburkan semasa di kelas, mesyuarat atau temu janji.',
    'concept.card3.title': 'Jenama Berasaskan Kandungan', 'concept.card3.desc': 'Lahir di TikTok & Instagram — rutin GRWM, padanan "Scent of the Day" dan cerita gaya pakaian.',
    'collections.eyebrow': 'Koleksi Mood', 'collections.title': 'Cari wangian yang sepadan dengan tenaga anda.',
    'collection.bold.tag': 'Keyakinan', 'collection.bold.desc': 'Gabungan hangat dan memikat untuk hari anda mahu kuasai keadaan.',
    'collection.serene.tag': 'Tenang', 'collection.serene.desc': 'Lembut, berbedak dan menenangkan — untuk pagi yang santai dan fokus tenang.',
    'collection.muse.tag': 'Daya Tarikan', 'collection.muse.desc': 'Manis dan memikat — sesuai untuk date night dan suasana golden-hour.',
    'collection.clarity.tag': 'Fokus', 'collection.clarity.desc': 'Segar dan bersih — reset baharu untuk sesi belajar dan kerja fokus.',
    'collection.sunny.tag': 'Kegembiraan', 'collection.sunny.desc': 'Ceria, segar dan playful — untuk hari yang baik dan yang lebih baik lagi.',
    'collection.cta.title': 'Tak pasti nak<br />mula dari mana?', 'collection.cta.desc': 'DM kami vibe anda dan kami akan padankan dengan wangian Clik pertama anda.', 'collection.cta.link': 'Cari Wangian Saya',
    'bundles.eyebrow': 'Set Bundle', 'bundles.title': 'Cuba lebih, jimat lebih — sesuai untuk rutin harian.',
    'bundles.badge': 'Paling Popular',
    'bundle.trio.title': 'Discovery Trio', 'bundle.trio.desc': 'Pilih mana-mana 3 wangian mood (10ml setiap satu) — cara termudah cari signature anda.', 'bundle.trio.save': 'jimat RM 10',
    'bundle.full.title': 'Full Mood Set', 'bundle.full.desc': 'Semua 5 koleksi mood — satu untuk setiap hari bekerja.', 'bundle.full.save': 'jimat RM 25',
    'bundle.gift.title': 'Kotak Hadiah', 'bundle.gift.desc': '2 wangian + pembungkusan premium — sesuai untuk hadiah hari lahir & penghargaan.', 'bundle.gift.save': 'sedia hadiah',
    'story.eyebrow': 'Kisah Kami', 'story.title': 'Dibina di Kuching, untuk semua yang mahu rasa jadi diri sendiri.',
    'story.p1': 'Clik Fragrance bermula dengan idea mudah: minyak wangi tak perlu mahal atau menggerunkan untuk jadi bermakna. Kami reka setiap wangian mengikut perasaan, bukan sekadar musim — jadi pilihan wangian anda menjadi sebahagian cara anda memulakan hari.',
    'story.p2': 'Dari video "Get Ready With Me" hingga padanan "Scent of the Day" dengan outfit anda, Clik Fragrance hidup di mana komuniti kami berada — di TikTok dan Instagram, berkembang satu mood pada satu masa.',
    'story.follow': 'Ikuti @clikfragrance',
    'story.founded.label': 'Ditubuhkan', 'story.format.label': 'Format', 'story.format.value': 'Botol travel 10ml',
    'story.position.label': 'Kedudukan', 'story.position.value': 'Keperluan harian, bukan sekadar mewah',
    'story.channels.label': 'Saluran', 'story.channels.value': 'TikTok & Instagram dahulu',
    'contact.eyebrow': 'Hubungi Kami', 'contact.title': 'Sedia untuk cari wangian anda?',
    'contact.sub': 'Hubungi kami melalui WhatsApp atau Instagram — beritahu mood anda, dan kami bantu pilih (atau bina bundle khas untuk anda).',
    'contact.meta': 'Kuching, Sarawak, Malaysia',
    'footer.rights': '© 2026 Clik Fragrance. Hak cipta terpelihara.',
    'footer.tagline': 'Direka dengan ✦ untuk ekspresi diri harian.',
    'footer.credit': 'Pengalaman Digital Ini Adalah Sebahagian daripada Ekosistem Inovasi <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a>',
  },
  zh: {
    'nav.collections': '系列', 'nav.story': '我们的故事', 'nav.bundles': '套装',
    'nav.contact': '联系我们', 'nav.shop': '立即选购',
    'hero.eyebrow': '古晋，砂拉越 — 生活方式香水品牌',
    'hero.title.line1': '为每种心情，', 'hero.title.every1': '献上每一种 ', 'hero.title.mood': '香气',
    'hero.title.every2': '展现每一个 ', 'hero.title.you': '自己',
    'hero.sub': 'Clik Fragrance 让香水成为自我表达 —— 根据今天的心情挑选属于你的香味。自信、平静、迷人。价格亲民、便于携带，融入日常生活。',
    'hero.cta1': '探索香氛', 'hero.cta2': '联系我们',
    'hero.stat1': '10ml 旅行装，随身携带', 'hero.stat2': '以心情为主题的香气系列',
    'hero.stat3num': '每日', 'hero.stat3': '日常必需，而非奢侈品',
    'concept.eyebrow': '品牌理念',
    'concept.title.pre': '香水不只是气味 —— 它是一种你选择的', 'concept.title.em': '感觉', 'concept.title.post': '。',
    'concept.sub': '我们不只专注于香调与成分，每一款 Clik Fragrance 都围绕一种情绪打造：自信、平静、吸引力、专注与喜悦。选择你想穿上的心情，让香气陪伴你度过一天。',
    'concept.card1.title': '依心情选择', 'concept.card1.desc': '每款香水都对应一种情绪 —— 让选购变得更个人化，而不是眼花缭乱。',
    'concept.card2.title': '为日常而生', 'concept.card2.desc': '10ml 旅行装轻松放入包包 —— 上课、开会或约会时随时补香。',
    'concept.card3.title': '内容驱动品牌', 'concept.card3.desc': '诞生于 TikTok 与 Instagram —— GRWM 日常、「今日香气」搭配与穿搭故事。',
    'collections.eyebrow': '心情系列', 'collections.title': '找到与你能量相配的香气。',
    'collection.bold.tag': '自信', 'collection.bold.desc': '温暖而迷人的调香，献给你想要主宰全场的日子。',
    'collection.serene.tag': '平静', 'collection.serene.desc': '柔和、粉感且踏实 —— 适合悠闲早晨与专注时刻。',
    'collection.muse.tag': '吸引力', 'collection.muse.desc': '甜美而迷人 —— 专为约会之夜与黄金时刻打造。',
    'collection.clarity.tag': '专注', 'collection.clarity.desc': '清新干净 —— 为学习与深度工作带来全新状态。',
    'collection.sunny.tag': '喜悦', 'collection.sunny.desc': '明亮、果香且俏皮 —— 让美好的日子更加美好。',
    'collection.cta.title': '不确定<br />从哪里开始？', 'collection.cta.desc': '私讯告诉我们你的风格，我们将为你推荐第一款 Clik 香水。', 'collection.cta.link': '为我推荐香气',
    'bundles.eyebrow': '套装组合', 'bundles.title': '体验更多，省得更多 —— 专为日常轮换打造。',
    'bundles.badge': '最受欢迎',
    'bundle.trio.title': '探索三件组', 'bundle.trio.desc': '任选 3 款心情香水（各10ml）—— 找到专属香气最简单的方式。', 'bundle.trio.save': '节省 RM10',
    'bundle.full.title': '全系列套装', 'bundle.full.desc': '全部 5 款心情系列 —— 一周每天都有专属香气。', 'bundle.full.save': '节省 RM25',
    'bundle.gift.title': '礼盒装', 'bundle.gift.desc': '2 款香水 + 精美包装 —— 生日与感谢礼物的完美选择。', 'bundle.gift.save': '礼盒现成',
    'story.eyebrow': '我们的故事', 'story.title': '诞生于古晋，献给每一个想做自己的人。',
    'story.p1': 'Clik Fragrance 源于一个简单的想法：香水不必昂贵或令人却步才有意义。我们围绕「感觉」而非季节来设计每一款香气 —— 让选香成为你开启一天的方式之一。',
    'story.p2': '从「Get Ready With Me」视频到与穿搭相配的「今日香气」，Clik Fragrance 活跃于我们社群所在之处 —— TikTok 与 Instagram，一次一种心情地成长。',
    'story.follow': '关注 @clikfragrance',
    'story.founded.label': '成立于', 'story.format.label': '规格', 'story.format.value': '10ml 旅行装',
    'story.position.label': '定位', 'story.position.value': '日常必需，而非奢侈品',
    'story.channels.label': '渠道', 'story.channels.value': 'TikTok 与 Instagram 优先',
    'contact.eyebrow': '联系我们', 'contact.title': '准备好寻找你的香气了吗？',
    'contact.sub': '通过 WhatsApp 或 Instagram 联系我们 —— 告诉我们你的心情，我们将为你推荐（或为你打造专属套装）。',
    'contact.meta': '古晋，砂拉越，马来西亚',
    'footer.rights': '© 2026 Clik Fragrance. 版权所有。',
    'footer.tagline': '用 ✦ 设计，为每日自我表达而生。',
    'footer.credit': '此数字体验是 <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a> 创新生态系统的一部分',
  },
  ib: {
    'nav.collections': 'Koleksi', 'nav.story': 'Cherita Kami', 'nav.bundles': 'Bundle',
    'nav.contact': 'Berabung', 'nav.shop': 'Beli Diatu',
    'hero.eyebrow': 'Kuching, Sarawak — Jenama Wangi ke Pengidup Sehari-hari',
    'hero.title.line1': 'Wangi ke', 'hero.title.every1': 'Tiap-tiap ', 'hero.title.mood': 'Ati',
    'hero.title.every2': 'Tiap-tiap ', 'hero.title.you': 'Diri Nuan',
    'hero.sub': 'Clik Fragrance ngasuh wangi nyadi chara nuan nunjukka diri — pilih wangi nuan nitihka ati nuan diatu. Pechaya. Tenang. Narit ati orang. Murah, senang dibai, ngena ke pengidup sehari-hari.',
    'hero.cta1': 'Peda Wangi Kami', 'hero.cta2': 'Berabung Enggau Kami',
    'hero.stat1': 'Saiz travel 10ml, senang dibai', 'hero.stat2': 'Wangi nitihka ati',
    'hero.stat3num': 'Sehari-hari', 'hero.stat3': 'Penguna sehari-hari, ukai semina mewah',
    'concept.eyebrow': 'Konsep Kami',
    'concept.title.pre': 'Wangi ukai semina pasal bau — iya nya ', 'concept.title.em': 'ati', 'concept.title.post': ' ti dipilih nuan.',
    'concept.sub': 'Ukai semina ngagai bahan wangi, tiap-tiap Clik Fragrance digaga nitihka ati: pechaya, tenang, narit ati, fokus, enggau giga. Pilih ati ti dikedingka nuan, lalu wangi nya nyaup nuan sepanjai hari.',
    'concept.card1.title': 'Pilih Nitihka Ati', 'concept.card1.desc': 'Tiap-tiap wangi bisi ati ti betuah — ngasuh meli rasa pribadi, ukai mabuk pilih.',
    'concept.card2.title': 'Ke Pengidup Sehari-hari', 'concept.card2.desc': 'Botol travel 10ml tau tama dalam beg — sembur baru maya bekereja, besua, tauka date.',
    'concept.card3.title': 'Jenama Bekaul Enggau Konten', 'concept.card3.desc': 'Pansik ari TikTok & Instagram — GRWM, "Wangi Hari Tu", enggau cherita gaya outfit.',
    'collections.eyebrow': 'Koleksi Ati', 'collections.title': 'Bisi wangi ti sama enggau tenaga nuan.',
    'collection.bold.tag': 'Pechaya', 'collection.bold.desc': 'Gabungan angat ti narit ati, ke hari nuan deka mantau diri.',
    'collection.serene.tag': 'Tenang', 'collection.serene.desc': 'Lemoh enggau ngademka — ke pagi ti senang enggau fokus tenang.',
    'collection.muse.tag': 'Narit Ati', 'collection.muse.desc': 'Manis enggau narit ati — ke malam date enggau golden-hour.',
    'collection.clarity.tag': 'Fokus', 'collection.clarity.desc': 'Segar enggau lantang — ke maya belajar enggau bekereja fokus.',
    'collection.sunny.tag': 'Giga', 'collection.sunny.desc': 'Galak, segar, enggau lantang ati — ke hari ti manah lalu manah agi.',
    'collection.cta.title': 'Enda pasti<br />ari ni deka mula?', 'collection.cta.desc': 'DM kami pasal ati nuan lalu kami nulung pilih wangi Clik ti keterubah ke nuan.', 'collection.cta.link': 'Tulung Pilih Wangi Aku',
    'bundles.eyebrow': 'Bundle Set', 'bundles.title': 'Nyoba mayuh, jimat mayuh — ke pengena sehari-hari.',
    'bundles.badge': 'Paling Disuka',
    'bundle.trio.title': 'Discovery Trio', 'bundle.trio.desc': 'Pilih 3 wangi ati (10ml tiap iti) — chara paling senang ngasuh nuan tau wangi ti angat ke nuan.', 'bundle.trio.save': 'jimat RM 10',
    'bundle.full.title': 'Full Mood Set', 'bundle.full.desc': 'Semua 5 koleksi ati — siti ke tiap-tiap hari bekereja.', 'bundle.full.save': 'jimat RM 25',
    'bundle.gift.title': 'Kotak Hadiah', 'bundle.gift.desc': '2 wangi + bungkus premium — manah ke hadiah hari jadi enggau penghargaan.', 'bundle.gift.save': 'sedia digunaka',
    'story.eyebrow': 'Cherita Kami', 'story.title': 'Digaga di Kuching, ke semua orang ti deka rasa nyadi diri empu.',
    'story.p1': 'Clik Fragrance mula enggau pekara ti senang: wangi enda perlu mahal tauka nakutka ke bisi reti. Kami gaga tiap-tiap wangi nitihka ati, ukai semina musin — ngasuh wangi ti dipilih nyadi chara nuan mulai hari.',
    'story.p2': 'Ari video "Get Ready With Me" datai ngagai padan "Wangi Hari Tu" enggau outfit nuan, Clik Fragrance idup di alai komuniti kami bisi — di TikTok enggau Instagram, besai siti ati pengudah siti ati.',
    'story.follow': 'Nitihka @clikfragrance',
    'story.founded.label': 'Ditumbuh', 'story.format.label': 'Format', 'story.format.value': 'Botol travel 10ml',
    'story.position.label': 'Pengena', 'story.position.value': 'Penguna sehari-hari, ukai semina mewah',
    'story.channels.label': 'Saluran', 'story.channels.value': 'TikTok enggau Instagram keterubah',
    'contact.eyebrow': 'Berabung Enggau Kami', 'contact.title': 'Sedia deka bisi wangi nuan?',
    'contact.sub': 'Berabung enggau kami baka WhatsApp tauka Instagram — padah ke kami ati nuan, lalu kami nulung pilih (tauka gaga bundle ke nuan empu).',
    'contact.meta': 'Kuching, Sarawak, Malaysia',
    'footer.rights': '© 2026 Clik Fragrance. Semua hak diau.',
    'footer.tagline': 'Digaga enggau ✦ ke chara nuan nunjukka diri sehari-hari.',
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
    if (value.includes('<br') || value.includes('&')) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });
  langButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.lang === lang));
  document.documentElement.lang = lang;
  localStorage.setItem('clik-lang', lang);
}

langButtons.forEach((btn) => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

applyLanguage(localStorage.getItem('clik-lang') || 'en');
