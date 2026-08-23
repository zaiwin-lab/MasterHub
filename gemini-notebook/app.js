// ─── Nav: background on scroll + mobile menu ─────────────
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ─── Reveal-on-scroll animations ─────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el) => observer.observe(el));

// ─── Smooth-scroll for in-page nav links ─────────────────
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── Motion: subtle 3D tilt on feature cards ─────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

if (!prefersReducedMotion && !isTouch) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ─── Contact form (placeholder handler) ──────────────────
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = contactForm.querySelector('.form-note');
    note.textContent = translations[currentLang]['form.sent'];
    note.style.color = 'var(--green)';
    contactForm.reset();
  });
}

// ─── i18n: BI (Bahasa Inggeris / English) + BM (Bahasa Melayu) ───
const translations = {
  en: {
    'meta.title': 'Gemini Notebook — Turn Your Sources Into Understanding',

    'nav.features': 'Features', 'nav.how': 'How It Works', 'nav.usecases': 'Use Cases',
    'nav.faq': 'FAQ', 'nav.contact': 'Contact', 'nav.cta': 'Try It Free',

    'hero.eyebrow': 'AI research notebook — Bahasa Inggeris &amp; Bahasa Melayu',
    'hero.title1': 'Every source you have,',
    'hero.title2': 'one notebook that understands them.',
    'hero.sub': 'Drop in your PDFs, notes, slides, links and recordings. Gemini Notebook reads all of them, connects the dots, and answers your questions with citations pointing back to the exact source line.',
    'hero.cta1': 'Start a Notebook', 'hero.cta2': 'See How It Works',
    'hero.stat1': 'Sources per notebook',
    'hero.stat2': 'Languages, one click apart',
    'hero.stat3': 'Answers grounded in your files',
    'hero.chip1': '12 PDFs added', 'hero.chip2': 'Audio overview ready', 'hero.chip3': 'Cited to page 14',

    'features.eyebrow': 'What It Does',
    'features.title': 'A notebook that has actually read everything inside it.',
    'features.sub': 'Six things Gemini Notebook does the moment your sources land — no prompt engineering, no copy-pasting between tabs.',
    'feature.1.title': 'Bring Everything In',
    'feature.1.desc': 'PDFs, Docs, slides, web links, YouTube transcripts, pasted text and voice notes — up to 50 sources in a single notebook.',
    'feature.2.title': 'Grounded Answers',
    'feature.2.desc': 'Every reply is built only from your sources and carries an inline citation — click it and jump straight to the paragraph it came from.',
    'feature.3.title': 'Instant Briefing Docs',
    'feature.3.desc': 'One tap turns forty pages into a briefing note, a timeline, an FAQ or a study guide you can hand to somebody else.',
    'feature.4.title': 'Audio Overviews',
    'feature.4.desc': 'Turn a notebook into a two-host conversation you can listen to on the drive home — in English or Bahasa Melayu.',
    'feature.5.title': 'Mind Maps &amp; Links',
    'feature.5.desc': 'See how ideas across separate documents connect — contradictions, repeated themes and gaps become visible at a glance.',
    'feature.6.title': 'Share The Notebook',
    'feature.6.desc': 'Invite your team or class. Everyone asks their own questions against the same trusted set of sources.',

    'how.eyebrow': 'How It Works',
    'how.title': 'Three steps, about four minutes.',
    'how.1.title': 'Add your sources',
    'how.1.desc': 'Drag in the files you already have. Nothing needs renaming, tagging or tidying up first.',
    'how.2.title': 'Ask in your own words',
    'how.2.desc': 'Type in English or Bahasa Melayu. "Apa risiko utama dalam laporan ini?" works exactly as well as the English version.',
    'how.3.title': 'Turn it into something usable',
    'how.3.desc': 'Save the answer as a note, generate a briefing doc, or render an audio overview — then share the whole notebook.',
    'mock.sources': 'Sources',
    'mock.q': 'What are the three biggest risks across these sources?',
    'mock.a': 'Three risks recur across all four sources: supplier concentration, a widening cash-conversion cycle, and staff turnover in operations.',

    'use.eyebrow': 'Use Cases',
    'use.title': 'Built for anyone drowning in documents.',
    'use.1.title': 'Students &amp; Lecturers',
    'use.1.desc': 'Turn a semester of readings into study guides and practice questions — and revise in the language you think in.',
    'use.1.tag': 'Education',
    'use.2.title': 'Researchers &amp; Analysts',
    'use.2.desc': 'Compare twenty papers or reports side by side and get answers that cite the exact table you need.',
    'use.2.tag': 'Research',
    'use.3.title': 'Teams &amp; Agencies',
    'use.3.desc': 'Give a new hire one shared notebook instead of a folder of 300 files and a two-week handover.',
    'use.3.tag': 'Business',
    'use.4.title': 'Writers &amp; Creators',
    'use.4.desc': 'Keep interviews, transcripts and clippings in one place, then draft with every quote a click away.',
    'use.4.tag': 'Content',

    'faq.eyebrow': 'FAQ',
    'faq.title': 'Questions people ask first.',
    'faq.1.q': 'Does it work fully in Bahasa Melayu?',
    'faq.1.a': 'Yes. The whole interface switches with the BI / BM toggle in the menu, and you can ask questions and receive answers in Bahasa Melayu even when your sources are in English.',
    'faq.2.q': 'Can it invent facts that are not in my files?',
    'faq.2.a': 'Answers are generated from your uploaded sources and every claim carries a citation you can open. If something is not in your sources, the notebook says so instead of guessing.',
    'faq.3.q': 'What file types can I upload?',
    'faq.3.a': 'PDF, Word, Google Docs and Slides, plain text and Markdown, web pages, YouTube links, and audio recordings such as interviews or meeting notes.',
    'faq.4.q': 'Who can see my notebook?',
    'faq.4.a': 'Only you, until you share it. Sharing is per notebook, and you choose whether collaborators can just read or also add sources.',
    'faq.5.q': 'Is there a free tier?',
    'faq.5.a': 'Yes — you can create notebooks and ask questions at no cost, with higher source limits and longer audio overviews on the paid plan.',

    'contact.eyebrow': 'Get Started',
    'contact.title': 'Bring us your messiest folder.',
    'contact.sub': 'Tell us what you are trying to make sense of and we will set up your first notebook with you — walkthrough available in English or Bahasa Melayu.',
    'form.name': 'Your name', 'form.name.ph': 'e.g. Aisyah Rahman',
    'form.contact': 'Email or WhatsApp', 'form.contact.ph': 'you@example.com',
    'form.message': 'What are you working on?', 'form.message.ph': 'e.g. 40 research papers for my thesis',
    'form.submit': 'Request a Walkthrough',
    'form.note': 'We reply within one working day.',
    'form.sent': 'Thank you — we will be in touch within one working day.',
    'contact.wa.label': 'WhatsApp', 'contact.email.label': 'Email',
    'contact.hours.label': 'Hours', 'contact.hours.value': 'Mon–Fri, 9am – 6pm (MYT)',
    'contact.office.label': 'Office', 'contact.office.value': 'Kuching, Sarawak, Malaysia',

    'footer.tagline': 'Your sources, understood — in Bahasa Inggeris and Bahasa Melayu.',
    'footer.rights': '© 2026 Gemini Notebook. All rights reserved.',
    'footer.disclaimer': 'Concept site produced for demonstration purposes. Not affiliated with or endorsed by Google LLC.',
    'footer.credit': 'This Digital Experience is Part of the <a class="kobis-link" href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a> Innovation Ecosystem',
  },

  bm: {
    'meta.title': 'Gemini Notebook — Ubah Sumber Anda Menjadi Kefahaman',

    'nav.features': 'Ciri-ciri', 'nav.how': 'Cara Ia Berfungsi', 'nav.usecases': 'Kegunaan',
    'nav.faq': 'Soal Jawab', 'nav.contact': 'Hubungi', 'nav.cta': 'Cuba Percuma',

    'hero.eyebrow': 'Buku nota penyelidikan AI — Bahasa Inggeris &amp; Bahasa Melayu',
    'hero.title1': 'Setiap sumber yang anda ada,',
    'hero.title2': 'satu buku nota yang memahaminya.',
    'hero.sub': 'Masukkan PDF, nota, slaid, pautan dan rakaman anda. Gemini Notebook membaca kesemuanya, menghubungkan titik-titik penting, dan menjawab soalan anda dengan petikan yang merujuk terus kepada baris sumber yang tepat.',
    'hero.cta1': 'Mula Buku Nota', 'hero.cta2': 'Lihat Cara Ia Berfungsi',
    'hero.stat1': 'Sumber bagi setiap buku nota',
    'hero.stat2': 'Bahasa, hanya satu klik',
    'hero.stat3': 'Jawapan berdasarkan fail anda',
    'hero.chip1': '12 PDF ditambah', 'hero.chip2': 'Ringkasan audio sedia', 'hero.chip3': 'Dipetik dari muka surat 14',

    'features.eyebrow': 'Apa Yang Ia Buat',
    'features.title': 'Buku nota yang benar-benar sudah membaca segala isinya.',
    'features.sub': 'Enam perkara yang dilakukan Gemini Notebook sebaik sahaja sumber anda dimuat naik — tiada kejuruteraan prompt, tiada salin-tampal antara tab.',
    'feature.1.title': 'Masukkan Semuanya',
    'feature.1.desc': 'PDF, dokumen, slaid, pautan web, transkrip YouTube, teks yang ditampal dan nota suara — sehingga 50 sumber dalam satu buku nota.',
    'feature.2.title': 'Jawapan Berasaskan Sumber',
    'feature.2.desc': 'Setiap jawapan dibina daripada sumber anda sahaja dan disertakan petikan — klik sahaja untuk terus ke perenggan asalnya.',
    'feature.3.title': 'Dokumen Taklimat Serta-merta',
    'feature.3.desc': 'Satu ketikan menukar empat puluh muka surat menjadi nota taklimat, garis masa, soal jawab atau panduan ulang kaji yang boleh diserahkan kepada orang lain.',
    'feature.4.title': 'Ringkasan Audio',
    'feature.4.desc': 'Tukar buku nota menjadi perbualan dua hos yang boleh didengar semasa memandu pulang — dalam Bahasa Inggeris atau Bahasa Melayu.',
    'feature.5.title': 'Peta Minda &amp; Hubungan',
    'feature.5.desc': 'Lihat bagaimana idea daripada dokumen berbeza saling berkait — percanggahan, tema berulang dan jurang menjadi jelas dengan sekali pandang.',
    'feature.6.title': 'Kongsi Buku Nota',
    'feature.6.desc': 'Jemput pasukan atau kelas anda. Setiap orang boleh bertanya soalan mereka sendiri berdasarkan set sumber yang sama.',

    'how.eyebrow': 'Cara Ia Berfungsi',
    'how.title': 'Tiga langkah, lebih kurang empat minit.',
    'how.1.title': 'Tambah sumber anda',
    'how.1.desc': 'Seret masuk fail yang sedia ada. Tiada apa yang perlu dinamakan semula, ditandakan atau dikemas terlebih dahulu.',
    'how.2.title': 'Tanya dalam bahasa anda sendiri',
    'how.2.desc': 'Taip dalam Bahasa Melayu atau Bahasa Inggeris. "Apa risiko utama dalam laporan ini?" berfungsi sama baiknya seperti versi Inggeris.',
    'how.3.title': 'Jadikan ia sesuatu yang berguna',
    'how.3.desc': 'Simpan jawapan sebagai nota, hasilkan dokumen taklimat, atau jana ringkasan audio — kemudian kongsikan seluruh buku nota.',
    'mock.sources': 'Sumber',
    'mock.q': 'Apakah tiga risiko terbesar merentasi sumber-sumber ini?',
    'mock.a': 'Tiga risiko berulang dalam keempat-empat sumber: pergantungan kepada pembekal tunggal, kitaran tunai yang semakin panjang, dan pusing ganti kakitangan operasi.',

    'use.eyebrow': 'Kegunaan',
    'use.title': 'Dibina untuk sesiapa yang tenggelam dalam dokumen.',
    'use.1.title': 'Pelajar &amp; Pensyarah',
    'use.1.desc': 'Tukar bahan bacaan satu semester menjadi panduan ulang kaji dan soalan latihan — dan ulang kaji dalam bahasa yang anda fikirkan.',
    'use.1.tag': 'Pendidikan',
    'use.2.title': 'Penyelidik &amp; Penganalisis',
    'use.2.desc': 'Bandingkan dua puluh kertas atau laporan serentak dan dapatkan jawapan yang memetik jadual tepat yang anda perlukan.',
    'use.2.tag': 'Penyelidikan',
    'use.3.title': 'Pasukan &amp; Agensi',
    'use.3.desc': 'Beri pekerja baharu satu buku nota kongsi, bukannya folder dengan 300 fail dan serah tugas dua minggu.',
    'use.3.tag': 'Perniagaan',
    'use.4.title': 'Penulis &amp; Kreator',
    'use.4.desc': 'Simpan temu bual, transkrip dan keratan di satu tempat, kemudian menulis dengan setiap petikan hanya satu klik jauhnya.',
    'use.4.tag': 'Kandungan',

    'faq.eyebrow': 'Soal Jawab',
    'faq.title': 'Soalan yang paling kerap ditanya.',
    'faq.1.q': 'Adakah ia berfungsi sepenuhnya dalam Bahasa Melayu?',
    'faq.1.a': 'Ya. Seluruh antara muka bertukar dengan penukar BI / BM di menu, dan anda boleh bertanya serta menerima jawapan dalam Bahasa Melayu walaupun sumber anda dalam Bahasa Inggeris.',
    'faq.2.q': 'Bolehkah ia mereka-reka fakta yang tiada dalam fail saya?',
    'faq.2.a': 'Jawapan dijana daripada sumber yang anda muat naik dan setiap dakwaan disertakan petikan yang boleh dibuka. Jika sesuatu tiada dalam sumber anda, buku nota akan menyatakannya dan bukan meneka.',
    'faq.3.q': 'Jenis fail apa yang boleh dimuat naik?',
    'faq.3.a': 'PDF, Word, Google Docs dan Slides, teks biasa dan Markdown, halaman web, pautan YouTube, serta rakaman audio seperti temu bual atau nota mesyuarat.',
    'faq.4.q': 'Siapa yang boleh melihat buku nota saya?',
    'faq.4.a': 'Anda sahaja, sehingga anda berkongsinya. Perkongsian adalah bagi setiap buku nota, dan anda memilih sama ada rakan hanya boleh membaca atau turut menambah sumber.',
    'faq.5.q': 'Adakah pelan percuma disediakan?',
    'faq.5.a': 'Ya — anda boleh mencipta buku nota dan bertanya soalan tanpa kos, dengan had sumber lebih tinggi dan ringkasan audio lebih panjang pada pelan berbayar.',

    'contact.eyebrow': 'Mula Sekarang',
    'contact.title': 'Bawa folder anda yang paling bersepah.',
    'contact.sub': 'Beritahu kami apa yang anda cuba fahami dan kami akan sediakan buku nota pertama anda bersama-sama — sesi panduan tersedia dalam Bahasa Melayu atau Bahasa Inggeris.',
    'form.name': 'Nama anda', 'form.name.ph': 'cth. Aisyah Rahman',
    'form.contact': 'E-mel atau WhatsApp', 'form.contact.ph': 'anda@contoh.com',
    'form.message': 'Apa yang anda sedang kerjakan?', 'form.message.ph': 'cth. 40 kertas penyelidikan untuk tesis saya',
    'form.submit': 'Mohon Sesi Panduan',
    'form.note': 'Kami membalas dalam satu hari bekerja.',
    'form.sent': 'Terima kasih — kami akan menghubungi anda dalam satu hari bekerja.',
    'contact.wa.label': 'WhatsApp', 'contact.email.label': 'E-mel',
    'contact.hours.label': 'Waktu', 'contact.hours.value': 'Isnin–Jumaat, 9 pagi – 6 petang (MYT)',
    'contact.office.label': 'Pejabat', 'contact.office.value': 'Kuching, Sarawak, Malaysia',

    'footer.tagline': 'Sumber anda, difahami — dalam Bahasa Inggeris dan Bahasa Melayu.',
    'footer.rights': '© 2026 Gemini Notebook. Hak cipta terpelihara.',
    'footer.disclaimer': 'Laman konsep yang dihasilkan untuk tujuan demonstrasi. Tiada kaitan dengan atau disokong oleh Google LLC.',
    'footer.credit': 'Pengalaman Digital Ini Adalah Sebahagian daripada Ekosistem Inovasi <a class="kobis-link" href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a>',
  },
};

const i18nEls = document.querySelectorAll('[data-i18n]');
const i18nPhEls = document.querySelectorAll('[data-i18n-ph]');
const langButtons = document.querySelectorAll('.nav-lang button');

const LANG_KEY = 'gemini-notebook-lang';
let currentLang = 'en';

function applyLanguage(lang) {
  const code = translations[lang] ? lang : 'en';
  const dict = translations[code];
  currentLang = code;

  i18nEls.forEach((el) => {
    const value = dict[el.getAttribute('data-i18n')];
    if (value === undefined) return;
    if (/<[a-z/]|&[a-z]+;/i.test(value)) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });

  i18nPhEls.forEach((el) => {
    const value = dict[el.getAttribute('data-i18n-ph')];
    if (value !== undefined) el.setAttribute('placeholder', value);
  });

  if (dict['meta.title']) document.title = dict['meta.title'];

  langButtons.forEach((btn) => {
    const isActive = btn.dataset.lang === code;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });

  document.documentElement.lang = code === 'bm' ? 'ms' : 'en';
  try { localStorage.setItem(LANG_KEY, code); } catch (e) { /* storage blocked */ }
}

langButtons.forEach((btn) => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

function initialLanguage() {
  let saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* storage blocked */ }
  if (saved && translations[saved]) return saved;
  const browser = (navigator.language || 'en').toLowerCase();
  return browser.startsWith('ms') || browser.startsWith('id') ? 'bm' : 'en';
}

applyLanguage(initialLanguage());
