// ─── Nav scroll effect ────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── Reveal on scroll ─────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── Smooth anchor scroll ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── Animated counter on stat numbers ────────────────
function animateValue(el, from, to, duration, suffix) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    statsObserver.unobserve(entry.target);
    const nums = entry.target.querySelectorAll('.stat-num');
    nums.forEach(n => {
      const text = n.textContent;
      if (text.includes('Day')) animateValue(n, 0, 3, 1000, ' Days');
      else if (text.includes('RM')) animateValue(n, 0, 750, 1200, ' Days').toString();
    });
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ─── Parallax on hero orbs ────────────────────────────
const orb1 = document.querySelector('.hero-orb-1');
const orb2 = document.querySelector('.hero-orb-2');

window.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  if (orb1) orb1.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
  if (orb2) orb2.style.transform = `translate(${-x * 0.3}px, ${-y * 0.3}px)`;
}, { passive: true });

// ─── Animate revenue bars on enter ───────────────────
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    barObserver.unobserve(entry.target);
    entry.target.querySelectorAll('.scenario-bar').forEach((bar, i) => {
      const target = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = target; }, 200 + i * 150);
    });
  });
}, { threshold: 0.3 });

const revenueGrid = document.querySelector('.revenue-grid');
if (revenueGrid) barObserver.observe(revenueGrid);

// ─── Language switcher ────────────────────────────────
const translations = {
  nav_cta: { bm: "Tetapkan Janji Temu", zh: "预约会面", iban: "Atur Pertemuan" },

  hero_eyebrow: { bm: "Disediakan Khas untuk Sarawak Entrepreneur Association", zh: "专为砂拉越企业家协会（SEA）精心准备", iban: "Disediaka Tuju Bagi Sarawak Entrepreneur Association" },
  hero_title: {
    bm: "Ahli Anda Layak Mendapat<br />Kehadiran Digital<br /><em>Yang Benar-Benar Berkesan.</em>",
    zh: "您的会员值得拥有<br />真正发挥作用的<br /><em>数字形象。</em>",
    iban: "Ahli Kita Patut Bisi<br />Penampilan Digital<br /><em>Ti Bebenar Beguna.</em>"
  },
  hero_sub: {
    bm: "Cadangan strategik untuk menjadi rakan kongsi web rasmi SEA — memberikan hasil digital yang nyata kepada usahawan Sarawak, pada skala yang tidak mungkin dicapai oleh seorang ahli sahaja.",
    zh: "这是一项战略提案，旨在成为SEA官方网页合作伙伴——为砂拉越创业者带来真实的数字成果，达到个别会员单独无法实现的规模。",
    iban: "Cadangan strategik kena nyadi rakan kongsi web resmi SEA — meri pengasil digital ti bebenar ke ahli ahli SEA, ngagai skala ti enda ulih dipantap sigi sigi orang aja."
  },
  hero_btn1: { bm: "Baca Cadangan", zh: "阅读提案", iban: "Bacha Cadangan" },
  hero_btn2: { bm: "Tempah Pertemuan", zh: "预约会面", iban: "Atur Pertemuan" },
  hero_stat1: { bm: "Purata masa siap", zh: "平均交付时间", iban: "Rata-rata maya nyiapka" },
  hero_stat2: { bm: "Harga khas ahli", zh: "会员入门价格", iban: "Ajar pemulai ahli" },
  hero_stat3: { bm: "Sedia untuk mudah alih", zh: "完全适配手机", iban: "Sedia ke mobile" },
  hero_scroll: { bm: "Skrol untuk teroka", zh: "向下滚动探索", iban: "Scroll deka mantik" },

  opp_label: { bm: "Peluang", zh: "机遇所在", iban: "Peluang" },
  opp_title: {
    bm: "Ahli SEA sedia untuk berkembang.<br /><em>Kehadiran digital mereka tidak.</em>",
    zh: "SEA会员已准备好成长。<br /><em>但他们的数字形象还没准备好。</em>",
    iban: "Ahli SEA sedia deka mansang.<br /><em>Tang penampilan digital sida nadai.</em>"
  },
  opp_card1_h: { bm: "Realiti PKS", zh: "中小企业的现实", iban: "Realiti PKS" },
  opp_card1_p: {
    bm: "Kebanyakan usahawan Sarawak tiada laman web, mempunyai laman web yang rosak, atau dibina bertahun lalu yang tidak lagi mencerminkan perniagaan semasa — menjejaskan kredibiliti dan kehilangan pelanggan setiap hari.",
    zh: "大多数砂拉越企业主没有网站，或网站早已损坏，或是多年前建立、早已无法反映现今业务的旧网站——这每天都在损害他们的信誉并流失客户。",
    iban: "Mayuh ari usahawan Sarawak nadai website, bisi website ti rusak, tauka dipansik taun ti udah enda nyamin pengawa diatu — ngerusak kepercayaan sereta ngilang pelanggan tiap hari."
  },
  opp_card2_h: { bm: "Jangkaan Pasaran", zh: "市场期望", iban: "Pengarap Pasar" },
  opp_card2_p: {
    bm: "Pelanggan pada 2026 mencari Google sebelum membeli. Mereka WhatsApp sebelum menelefon. Perniagaan tanpa laman web yang bersih, pantas dan mesra mudah alih akan kelihatan tidak wujud kepada bakal pelanggan.",
    zh: "2026年的顾客在购买前都会先用Google搜索，在打电话前会先发WhatsApp。没有简洁、快速、适配手机网站的商家，对潜在顾客来说就如同不存在。",
    iban: "Pelanggan ba 2026 ngiga Google dulu sebedau meli. Sida WhatsApp dulu sebedau nelefon. Pengawa ti nadai website ti bersih, pantas, sereta sesuai ke mobile deka mpayah dipeda calon pelanggan."
  },
  opp_conclusion: {
    bm: "SEA sudah menyedari hal ini. <strong>Inisiatif Pemerkasaan Digital 2026</strong> adalah jawapannya. Kami mencadangkan untuk menjadi studio yang merealisasikannya.",
    zh: "SEA其实早已察觉这一点。<strong>2026数字赋能计划</strong>正是答案，我们提议成为实现这项计划的工作室。",
    iban: "SEA udah nemu pasal tu. <strong>Inisiatif Pemerkasa Digital 2026</strong> nya jaku. Kami ngasaika diri nyadi studio ti ngamatka utai tu."
  },

  about_label: { bm: "Siapa Kami", zh: "关于我们", iban: "Sapa Kami" },
  about_title: {
    bm: "Studio web berpangkalan Sarawak<br />dibina untuk <em>usahawan seperti anda.</em>",
    zh: "一家立足砂拉越的网页工作室<br />专为<em>像您这样的企业家</em>而生。",
    iban: "Studio web ari Sarawak<br />dipansik ke <em>usahawan baka kita.</em>"
  },
  about_p1: {
    bm: "Kami membina laman web yang pantas, kemas dan fokus kepada penukaran untuk perniagaan kecil — bukan projek agensi besar yang mengambil masa 3 bulan dan berharga RM30,000. Kami percaya setiap usahawan Sarawak layak mempunyai kehadiran digital bertaraf dunia yang memberi hasil.",
    zh: "我们为中小企业打造快速、简洁、以转化为导向的网站——而不是耗时三个月、收费三万令吉的庞大代理项目。我们相信每一位砂拉越企业家都值得拥有世界级且能带来成果的数字形象。",
    iban: "Kami mansang website ti pantas, beresik, sereta fokus ngagai pemenang pengawa ke pengawa mit — ukai project agensi besai ti makai 3 bulan ngambika RM30,000. Kami arap semua usahawan Sarawak patut bisi penampilan digital ti nyamai sereta meri pengasil."
  },
  about_p2: {
    bm: "Pendekatan kami mudah: fahami perniagaan, asingkan kepada bentuk yang paling tajam, dan hasilkan laman web yang membina kepercayaan sebaik sahaja seseorang melawatnya.",
    zh: "我们的方法很简单：深入了解业务、提炼出最精准的呈现方式，并打造一个能在访客抵达瞬间就建立信任的网站。",
    iban: "Chara kami mudah: pelajar pengawa, asai ngagai bentuk ti paling tajam, lalu pansik website ti ngamatka pengarap sigi orang nyentuh iya."
  },
  about_v1: { bm: "<strong>Penghantaran pantas.</strong> Kebanyakan laman siap dalam 3–7 hari.", zh: "<strong>快速交付。</strong>大多数网站在3至7天内即可上线。", iban: "<strong>Pengiring pantas.</strong> Mayuh website siap dalam 3–7 hari." },
  about_v2: { bm: "<strong>Dibina untuk hasil.</strong> Setiap halaman direka untuk menukar pelawat menjadi pertanyaan.", zh: "<strong>以效果为导向。</strong>每个页面都旨在将访客转化为询盘。", iban: "<strong>Dipansik ke pengasil.</strong> Tiap halaman direka ngambika ngubah pengiring nyadi tanya." },
  about_v3: { bm: "<strong>Berakar di Sarawak.</strong> Kami memahami pasaran tempatan, bahasa tempatan, dan pelanggan tempatan.", zh: "<strong>扎根砂拉越。</strong>我们了解本地市场、本地语言以及本地顾客。", iban: "<strong>Bepangkal ba Sarawak.</strong> Kami nemu pasar menua, jaku menua, sereta pelanggan menua." },
  about_v4: {
    bm: "<strong>Aliran kerja dipercepat AI.</strong> Kami menggunakan alat reka bentuk dan pembangunan dibantu AI moden untuk memberikan kualiti premium pada harga perniagaan kecil — tanpa menjejaskan mutu.",
    zh: "<strong>AI加速工作流程。</strong>我们运用现代AI辅助设计与开发工具，以中小企业能负担的价格提供顶级品质——绝不偷工减料。",
    iban: "<strong>Pengawa dipantaska AI.</strong> Kami ngena alat design sereta pembangunan dibantu AI moden ngambika meri kualiti premium ngena ajar pengawa mit — enda ngurangka mutu."
  },

  pkg_label: { bm: "Apa Yang Kami Tawarkan", zh: "我们提供的服务", iban: "Utai Ti Kami Bri" },
  pkg_title: {
    bm: "Tiga pakej.<br /><em>Satu hasil yang jelas: lebih ramai pelanggan.</em>",
    zh: "三种套餐。<br /><em>一个明确目标：带来更多顾客。</em>",
    iban: "Tiga pakej.<br /><em>Siti pengasil ti terang: pelanggan ti mayuh agi.</em>"
  },
  pkg_intro: {
    bm: "Direka khas untuk ahli SEA — setiap peringkat menyelesaikan keperluan perniagaan tertentu, dengan struktur subsidi yang menjadikan keahlian SEA terasa amat bernilai.",
    zh: "专为SEA会员设计——每个等级都针对特定的业务发展阶段，并配有补贴方案，让SEA会员资格变得不可或缺。",
    iban: "Direka tuju ke ahli SEA — tiap tingkat nyaut keperluan pengawa tertentu, sereta struktur subsidi ti ngamatka ahli SEA terasa beguna bendar."
  },
  pkg_a_tag: { bm: "Modul A", zh: "模块 A", iban: "Modul A" },
  pkg_a_name: { bm: "Laman Web Kad Perniagaan", zh: "名片式网站", iban: "Website Kad Pengawa" },
  pkg_a_normal: { bm: "Biasa: RM1,500", zh: "原价：RM1,500", iban: "Biasa: RM1,500" },
  pkg_badge_50: { bm: "Kadar Ahli SEA · Diskaun 50%", zh: "SEA会员价 · 五折优惠", iban: "Reti Ahli SEA · Murah 50%" },
  pkg_a_f1: { bm: "Laman web satu halaman profesional", zh: "专业单页网站", iban: "Website satu halaman ti professional" },
  pkg_a_f2: { bm: "Dioptimumkan untuk mudah alih & WhatsApp", zh: "手机和WhatsApp优化", iban: "Dioptimumka ke mobile & WhatsApp" },
  pkg_a_f3: { bm: "Sedia untuk Google (asas SEO)", zh: "Google就绪（基础SEO）", iban: "Sedia ke Google (asal SEO)" },
  pkg_a_f4: { bm: "Borang hubungi + peta", zh: "联系表单+地图嵌入", iban: "Borang nanya + peta" },
  pkg_a_f5: { bm: "Siap dalam 3 hari", zh: "3天内交付", iban: "Siap dalam 3 hari" },
  pkg_outcome_label: { bm: "Hasil", zh: "成果", iban: "Pengasil" },
  pkg_a_outcome: { bm: "Lebih mudah dijumpai, dihubungi, dan dipercayai dalam talian.", zh: "让顾客更容易找到您、联系您并建立信任。", iban: "Mudah agi diatu ditemu, dihubung, sereta dipercaya online." },

  pkg_featured: { bm: "Paling Popular", zh: "最受欢迎", iban: "Paling Disuka" },
  pkg_b_tag: { bm: "Modul B", zh: "模块 B", iban: "Modul B" },
  pkg_b_name: { bm: "Halaman Pendorong Jualan", zh: "销售推广页面", iban: "Halaman Penatai Jual" },
  pkg_b_normal: { bm: "Biasa: RM2,000", zh: "原价：RM2,000", iban: "Biasa: RM2,000" },
  pkg_b_f1: { bm: "Halaman pendaratan fokus penukaran", zh: "高转化导向落地页", iban: "Halaman ti fokus ngubah pengiring" },
  pkg_b_f2: { bm: "Pengumpulan prospek & CTA WhatsApp", zh: "潜客捕获与WhatsApp行动按钮", iban: "Ngumpul prospek & CTA WhatsApp" },
  pkg_b_f3: { bm: "Testimoni & bahagian kepercayaan", zh: "客户评价与信任区块", iban: "Cerita pelanggan & bagi kepercayaan" },
  pkg_b_f4: { bm: "Penjelasan tawaran & penulisan iklan", zh: "优惠说明与文案撰写", iban: "Terang tawar & nulis copywriting" },
  pkg_b_f5: { bm: "Siap dalam 5 hari", zh: "5天内交付", iban: "Siap dalam 5 hari" },
  pkg_b_outcome: { bm: "Lebih banyak pertanyaan dan penukaran jualan yang lebih kukuh.", zh: "带来更多询盘，提升销售转化率。", iban: "Tanya ti mayuh agi sereta jual ti manah agi." },

  pkg_c_tag: { bm: "Modul C", zh: "模块 C", iban: "Modul C" },
  pkg_c_name: { bm: "Laman Web Perniagaan Penuh", zh: "完整企业网站", iban: "Website Pengawa Pengelandik" },
  pkg_c_normal: { bm: "Biasa: RM3,500", zh: "原价：RM3,500", iban: "Biasa: RM3,500" },
  pkg_badge_57: { bm: "Kadar Ahli SEA · Diskaun 57%", zh: "SEA会员价 · 优惠57%", iban: "Reti Ahli SEA · Murah 57%" },
  pkg_c_f1: { bm: "Laman web profesional 5 halaman", zh: "5页专业网站", iban: "Website professional 5 halaman" },
  pkg_c_f2: { bm: "Tentang Kami, Perkhidmatan, Portfolio, Hubungi", zh: "关于我们、服务、作品集、联系方式", iban: "Pasal Kami, Pengawa, Portfolio, Hubung" },
  pkg_c_f3: { bm: "Struktur sedia untuk blog", zh: "支持博客功能", iban: "Struktur sedia ke blog" },
  pkg_c_f4: { bm: "Google Analytics + Search Console", zh: "Google分析+搜索控制台", iban: "Google Analytics + Search Console" },
  pkg_c_f5: { bm: "Siap dalam 7 hari", zh: "7天内交付", iban: "Siap dalam 7 hari" },
  pkg_c_outcome: { bm: "Ibu pejabat digital yang lengkap untuk perniagaan.", zh: "为企业打造完整的数字总部。", iban: "Pusat digital ti pengelandik ke pengawa." },

  pilot_label: { bm: "Tawaran Perintis", zh: "试点计划", iban: "Tawar Pengawa Mula" },
  pilot_title: {
    bm: "Biar kami bina<br /><em>5 laman web ahli pertama secara percuma.</em>",
    zh: "让我们免费为<br /><em>首5位会员打造网站。</em>",
    iban: "Awakka kami pansik<br /><em>5 website ahli keterubah secara free.</em>"
  },
  pilot_p1: {
    bm: "Tiada komitmen diperlukan daripada SEA. Kami buktikan kualiti, kepantasan dan impak kami dengan ahli sebenar terlebih dahulu. Jika mereka berpuas hati — dan pasti mereka akan berpuas hati — kami formalkan rakan kongsi secara rasmi.",
    zh: "SEA无需作出任何承诺。我们会先用真实会员证明我们的品质、速度和影响力。一旦他们满意了——而他们一定会满意——我们便正式确立这项合作关系。",
    iban: "Nadai komitmen ari SEA diatu. Kami amatka kualiti, pantas, sereta pengaruh kami enggau ahli bendar dulu. Enti sida puas ati — sereta sida deka puas ati — kami nyaup bekereja resmi."
  },
  pilot_p2: {
    bm: "SEA boleh mengumumkan manfaat digital yang nyata dan kelihatan kepada ahli. Kami pula memperoleh hak untuk menjadi studio rasmi anda. Semua pihak menang.",
    zh: "SEA能够向会员宣布一项实实在在、看得见的数字福利。而我们则赢得成为贵会官方工作室的资格。各方共赢。",
    iban: "SEA ulih madahka pengasil digital ti nyata sereta ulih dipeda ke ahli. Kami bulih hak nyadi studio resmi kita. Semua pihak nemu untung."
  },
  pilot_btn: { bm: "Aktifkan Rancangan Perintis", zh: "启动试点计划", iban: "Pansik Pengawa Mula" },

  why_label: { bm: "Mengapa Kerjasama Ini Berkesan", zh: "为何这项合作行得通", iban: "Kenapa Kerjasama Tu Beguna" },
  why_title: {
    bm: "Baik untuk SEA.<br /><em>Mengubah hidup ahli.</em>",
    zh: "对SEA有利。<br /><em>对会员则是变革性的。</em>",
    iban: "Manah ke SEA.<br /><em>Ngubah pengidup ahli.</em>"
  },
  why1_h: { bm: "Keahlian SEA menjadi tidak boleh dinafikan", zh: "SEA会员资格变得无可争议", iban: "Ahli SEA nyadi enda ulih ditulak" },
  why1_p: {
    bm: "Apabila menyertai SEA bermakna mendapat laman web profesional pada harga yang jauh lebih rendah daripada pasaran, perekrutan dan pengekalan ahli menjadi mudah. Ahli kekal kerana nilai itu nyata dan kelihatan.",
    zh: "当加入SEA就意味着能以远低于市场价获得专业网站时，招募和留存会员将变得轻而易举。会员留下，是因为价值真实可见。",
    iban: "Lebuh nyadi ahli SEA reti bulih website professional ngena ajar ti mit agi ari pasar, ngalu sereta nyimpan ahli nyadi mudah. Ahli tinggal laban pengasil nya nyata sereta ulih dipeda."
  },
  why2_h: { bm: "Selari dengan Agenda Ekonomi Digital Sarawak", zh: "契合砂拉越数字经济议程", iban: "Sejajar enggau Agenda Ekonomi Digital Sarawak" },
  why2_p: {
    bm: "Setiap laman web yang kami bina untuk ahli SEA adalah sumbangan langsung kepada matlamat transformasi digital negeri — meletakkan SEA sebagai persatuan yang memimpin, bukan mengikut.",
    zh: "我们为每一位SEA会员打造的网站，都是对州属数字转型目标的直接贡献——使SEA成为引领潮流而非追随者的协会。",
    iban: "Tiap website ti kami pansik ke ahli SEA nyadi sumbangan langsung ngagai matlamat transformasi digital nengeri — ngasuh SEA nyadi persatuan ti mimpin, ukai nitihka."
  },
  why3_h: { bm: "Sifar risiko pelaksanaan untuk SEA", zh: "SEA零执行风险", iban: "Nadai resiko ke SEA" },
  why3_p: {
    bm: "Kami uruskan segalanya — reka bentuk, pembangunan, penghantaran dan sokongan berterusan. Peranan SEA mudah: hubungkan kami dengan ahli yang bersedia. Kami uruskan selebihnya.",
    zh: "一切由我们负责——设计、开发、交付以及后续支持。SEA的角色很简单：将我们与准备好的会员联系起来，其余的交给我们。",
    iban: "Kami ngatur semua — design, pembangunan, pengiring, sereta sokongan terus. Peran SEA mudah aja: hubungka kami enggau ahli ti sedia. Kami ngatur sebaka utai."
  },
  why4_h: { bm: "Impak ahli yang boleh diukur", zh: "可衡量的会员影响力", iban: "Pengaruh ahli ti ulih diukur" },
  why4_p: {
    bm: "Setiap laman web disertakan dengan kisah sebelum/selepas. Kami dokumenkan hasil — pertanyaan baharu, kedudukan Google, maklum balas pelanggan — yang boleh dipamerkan SEA dalam laporan, acara dan kempen.",
    zh: "每个网站都附带前后对比故事。我们会记录成果——新增询盘、Google排名、客户反馈——供SEA在报告、活动和宣传中展示。",
    iban: "Tiap website datai enggau cerita sebedau/udah. Kami rekod pengasil — tanya baru, ranking Google, respon pelanggan — ti ulih dipamerka SEA dalam laporan, acara, sereta kempen."
  },

  rev_label: { bm: "Angka-Angka", zh: "数据展示", iban: "Nombor Nombor" },
  rev_title: {
    bm: "Kerjasama yang membayar<br /><em>kembali berkali-kali ganda.</em>",
    zh: "这项合作的回报<br /><em>将远超投入数倍。</em>",
    iban: "Kerjasama ti mulang<br /><em>diri bisi mayuh kali.</em>"
  },
  rev1_label: { bm: "Konservatif", zh: "保守估计", iban: "Konservatif" },
  rev1_members: { bm: "20 ahli / suku tahun", zh: "每季20名会员", iban: "20 ahli / suku taun" },
  rev1_value: { bm: "Nilai disampaikan RM15,000+", zh: "创造价值 RM15,000+", iban: "Nilai diberi RM15,000+" },
  rev2_label: { bm: "Pertumbuhan", zh: "增长情景", iban: "Pemansang" },
  rev2_members: { bm: "50 ahli / suku tahun", zh: "每季50名会员", iban: "50 ahli / suku taun" },
  rev2_value: { bm: "Nilai disampaikan RM50,000+", zh: "创造价值 RM50,000+", iban: "Nilai diberi RM50,000+" },
  rev3_label: { bm: "Program Penuh", zh: "全面计划", iban: "Pengawa Pengelandik" },
  rev3_members: { bm: "100+ ahli / tahun", zh: "每年100+名会员", iban: "100+ ahli / taun" },
  rev3_value: { bm: "Nilai disampaikan RM150,000+", zh: "创造价值 RM150,000+", iban: "Nilai diberi RM150,000+" },
  rev_note: {
    bm: "Setiap laman web yang kami bina untuk ahli SEA adalah nilai yang boleh ditunjukkan oleh SEA. Nyata. Boleh digambar. Boleh dikongsi.",
    zh: "我们为SEA会员打造的每一个网站，都是SEA可以展示的价值——真实、可拍照、可分享。",
    iban: "Tiap website ti kami pansik ke ahli SEA nyadi nilai ti ulih ditunjuk SEA. Nyata. Ulih digambar. Ulih dikongsika."
  },

  proof_label: { bm: "Kualiti Kami", zh: "我们的品质", iban: "Kualiti Kami" },
  proof_title: { bm: "Hasil kerja bercakap<br /><em>dengan sendirinya.</em>", zh: "作品本身<br /><em>就是最好的证明。</em>", iban: "Pengawa kami bejaku<br /><em>diri empu.</em>" },
  proof1_name: { bm: "Portal Diagnostik Perniagaan", zh: "商业诊断平台", iban: "Portal Diagnostik Pengawa" },
  proof1_desc: { bm: "Alat audit klien 10 langkah dengan penjanaan laporan yang diperibadikan. Dibina dalam 1 hari.", zh: "10步骤客户诊断工具，自动生成个性化报告。仅用1天完成开发。", iban: "Alat audit pelanggan 10 langkah enggau laporan ti dipersonalisa. Dipansik dalam 1 hari." },
  proof_view: { bm: "Lihat laman langsung →", zh: "查看在线网站 →", iban: "Peda website langsung →" },
  proof2_empty: { bm: "Perniagaan anda<br />boleh berada di sini.", zh: "您的企业<br />可以出现在这里。", iban: "Pengawa kita<br />ulih ditunjuk dia." },
  proof2_name: { bm: "Laman Web Ahli SEA #1", zh: "SEA会员网站 #1", iban: "Website Ahli SEA #1" },
  proof2_desc: { bm: "Laman web pertama dari 5 perintis percuma — dibina untuk ahli SEA yang bersedia berkembang.", zh: "5个免费试点网站中的第一个——为准备好成长的SEA会员而建。", iban: "Website keterubah ari 5 pengawa mula free — dipansik ke ahli SEA ti sedia deka mansang." },
  proof2_link: { bm: "Menanti ahli yang sesuai →", zh: "等待合适的会员加入 →", iban: "Nganti ahli ti sesuai →" },

  contact_label: { bm: "Sedia Untuk Bergerak Maju", zh: "准备好开始合作了吗", iban: "Sedia Deka Maju" },
  contact_title: { bm: "Mari bina sesuatu<br /><em>yang dibanggakan Sarawak.</em>", zh: "让我们一起打造<br /><em>砂拉越引以为傲的成果。</em>", iban: "Aram kitai pansik utai<br /><em>ti dikenang Sarawak.</em>" },
  contact_p: {
    bm: "Hanya 30 minit pertemuan diperlukan. Kami akan terangkan cadangan perintis, jawab semua soalan, dan beri gambaran jelas tentang apa yang SEA × kami boleh capai.",
    zh: "只需30分钟会议。我们将带您了解试点提案，解答所有问题，并清晰呈现SEA与我们携手能创造的成果。",
    iban: "Semina 30 minit pertemuan beguna. Kami deka nerangka cadangan pengawa mula, nyaut semua tanya, sereta meri gambar ti terang pasal utai ti SEA × kami ulih bayi."
  },
  contact_wa: { bm: "WhatsApp Kami Sekarang", zh: "立即WhatsApp联系我们", iban: "WhatsApp Kami Diatu" },
  contact_email: { bm: "Hantar E-mel →", zh: "发送邮件 →", iban: "Kirim Email →" },
  contact_note: {
    bm: "Disediakan dengan teliti untuk kepimpinan Sarawak Entrepreneur Association.<br /><span>Cadangan ini khusus untuk SEA. Tidak diedarkan secara umum.</span>",
    zh: "特别为砂拉越企业家协会领导层精心准备。<br /><span>本提案仅供SEA内部使用，不对外公开发布。</span>",
    iban: "Disediaka enggau berati ke pemimpin Sarawak Entrepreneur Association.<br /><span>Cadangan tu semina ke SEA. Enda diagi ngagai mensia mayuh.</span>"
  },

  footer_copy: { bm: "Memperkasa Usahawan. Memartabatkan Sarawak.", zh: "赋能企业家，提升砂拉越。", iban: "Ngeperkasa Usahawan. Ngangkat Sarawak." }
};

let currentLang = 'en';
const originalText = new Map();
const originalHtml = new Map();

document.querySelectorAll('[data-i18n]').forEach(el => originalText.set(el, el.innerHTML));
document.querySelectorAll('[data-i18n-html]').forEach(el => originalHtml.set(el, el.innerHTML));

function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : (lang === 'en' ? 'en' : 'ms');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const dict = translations[key];
    el.innerHTML = (lang === 'en' || !dict || !dict[lang]) ? originalText.get(el) : dict[lang];
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const dict = translations[key];
    el.innerHTML = (lang === 'en' || !dict || !dict[lang]) ? originalHtml.get(el) : dict[lang];
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
});
