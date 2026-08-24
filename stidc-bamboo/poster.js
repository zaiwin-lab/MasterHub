/* ══════════════════════════════════════════════════════════════
   BAMBOO SARAWAK — printable campaign posters
   A4, one per programme track, with deep-link QR codes
   ══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var T    = window.BAMBOO_T;
var I18N = window.BAMBOO_I18N;
var esc  = window.BAMBOO_UTIL.esc;
var CFG  = window.BAMBOO_CONFIG;

var BASE = 'https://bamboo-sarawak-stidc.netlify.app';

/* QR codes generated at build time (error correction level H, ~30%
   recoverable) so a scuffed or rain-marked poster still scans. */
var QR = {
  community: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 45 45\" class=\"segno\"><path class=\"qrline\" stroke=\"#102c22\" d=\"M0 0.5h7m2 0h2m3 0h1m1 0h3m1 0h4m1 0h1m1 0h1m2 0h1m1 0h2m2 0h1m1 0h7m-45 1h1m5 0h1m3 0h1m3 0h1m3 0h2m1 0h2m2 0h1m2 0h1m6 0h1m2 0h1m5 0h1m-45 1h1m1 0h3m1 0h1m1 0h1m4 0h3m3 0h1m7 0h1m2 0h1m2 0h1m1 0h1m2 0h1m1 0h3m1 0h1m-45 1h1m1 0h3m1 0h1m1 0h1m1 0h2m2 0h1m1 0h2m1 0h1m1 0h1m1 0h3m3 0h1m2 0h2m1 0h2m1 0h1m1 0h3m1 0h1m-45 1h1m1 0h3m1 0h1m3 0h1m1 0h6m1 0h8m3 0h3m1 0h3m1 0h1m1 0h3m1 0h1m-45 1h1m5 0h1m2 0h1m2 0h1m1 0h3m1 0h1m1 0h1m3 0h2m7 0h1m4 0h1m5 0h1m-45 1h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7m-36 1h3m1 0h1m6 0h1m3 0h2m1 0h3m3 0h4m-34 1h2m1 0h2m2 0h1m1 0h1m1 0h1m1 0h2m1 0h6m2 0h1m3 0h1m9 0h2m-41 1h2m3 0h1m1 0h6m1 0h1m6 0h1m1 0h1m2 0h3m1 0h1m1 0h8m1 0h1m-42 1h1m3 0h2m1 0h1m4 0h3m2 0h2m1 0h1m2 0h3m1 0h1m1 0h4m8 0h2m-44 1h1m2 0h2m2 0h2m2 0h1m1 0h2m2 0h3m6 0h2m3 0h3m4 0h1m2 0h1m-40 1h1m2 0h1m2 0h1m2 0h4m5 0h1m1 0h3m1 0h1m2 0h3m2 0h1m1 0h2m1 0h2m1 0h2m-40 1h1m1 0h2m3 0h1m1 0h3m1 0h1m1 0h1m1 0h1m4 0h4m1 0h2m1 0h2m1 0h3m2 0h1m-42 1h5m4 0h2m1 0h2m1 0h1m1 0h2m2 0h2m1 0h1m4 0h3m2 0h1m1 0h1m3 0h1m-43 1h1m1 0h2m3 0h2m1 0h4m1 0h4m1 0h2m7 0h1m1 0h1m1 0h1m1 0h2m1 0h1m2 0h4m-45 1h2m1 0h4m3 0h2m2 0h1m3 0h1m2 0h1m1 0h1m2 0h1m1 0h2m1 0h3m3 0h2m-37 1h1m1 0h2m1 0h1m3 0h1m2 0h2m1 0h1m1 0h1m1 0h1m2 0h2m2 0h1m2 0h1m1 0h2m1 0h2m6 0h1m-45 1h4m1 0h5m1 0h2m1 0h2m1 0h1m4 0h1m2 0h2m1 0h3m2 0h1m2 0h1m7 0h1m-45 1h2m1 0h2m5 0h2m3 0h1m2 0h1m3 0h2m2 0h1m1 0h1m1 0h2m2 0h1m1 0h1m3 0h1m1 0h1m-39 1h5m6 0h2m1 0h1m1 0h5m1 0h1m2 0h2m2 0h1m2 0h5m3 0h1m-45 1h1m3 0h1m3 0h1m3 0h1m1 0h3m2 0h2m3 0h4m2 0h7m3 0h3m-43 1h3m1 0h1m1 0h1m1 0h1m1 0h2m1 0h4m2 0h2m1 0h1m1 0h1m1 0h1m3 0h1m1 0h5m1 0h1m1 0h5m-41 1h1m3 0h3m1 0h1m1 0h2m1 0h1m1 0h2m3 0h3m3 0h1m4 0h2m3 0h1m1 0h3m-41 1h9m1 0h3m2 0h6m4 0h1m4 0h8m1 0h1m-42 1h2m1 0h1m2 0h2m2 0h2m3 0h1m1 0h2m2 0h3m2 0h1m2 0h1m3 0h3m1 0h1m2 0h2m-44 1h4m1 0h3m2 0h1m3 0h2m1 0h1m4 0h1m1 0h1m1 0h1m1 0h2m2 0h4m6 0h1m-43 1h1m1 0h1m4 0h1m1 0h1m1 0h1m4 0h1m1 0h1m2 0h2m1 0h2m2 0h4m1 0h1m1 0h1m4 0h1m1 0h2m-44 1h1m1 0h1m3 0h9m2 0h2m1 0h1m2 0h4m1 0h1m1 0h3m1 0h2m2 0h1m1 0h2m2 0h1m-41 1h1m2 0h1m2 0h1m2 0h2m3 0h5m1 0h1m1 0h1m4 0h6m2 0h2m2 0h2m-45 1h1m4 0h3m1 0h1m3 0h1m1 0h1m1 0h2m3 0h3m2 0h3m1 0h3m2 0h1m1 0h3m1 0h1m1 0h1m-44 1h1m1 0h1m1 0h1m4 0h5m2 0h1m2 0h1m4 0h5m5 0h1m3 0h1m1 0h2m1 0h1m-44 1h1m1 0h1m2 0h2m1 0h1m1 0h2m3 0h2m2 0h4m1 0h1m1 0h1m2 0h1m3 0h1m1 0h1m1 0h1m4 0h1m-41 1h1m1 0h1m2 0h3m1 0h1m1 0h1m1 0h1m1 0h1m2 0h2m2 0h2m1 0h1m4 0h4m2 0h4m-39 1h1m1 0h1m2 0h5m1 0h3m1 0h1m2 0h1m2 0h1m1 0h1m2 0h6m1 0h2m2 0h4m-44 1h4m6 0h1m4 0h3m2 0h1m1 0h1m3 0h1m2 0h1m1 0h1m5 0h2m2 0h1m-43 1h1m2 0h2m1 0h1m1 0h3m1 0h1m1 0h1m1 0h2m2 0h5m1 0h1m4 0h2m1 0h7m3 0h1m-37 1h1m1 0h2m2 0h1m3 0h3m3 0h1m1 0h2m1 0h2m2 0h1m1 0h2m3 0h2m1 0h1m-44 1h7m1 0h1m1 0h1m1 0h1m1 0h3m1 0h3m1 0h1m1 0h2m4 0h4m2 0h1m1 0h1m1 0h3m-43 1h1m5 0h1m2 0h1m1 0h5m1 0h4m3 0h1m3 0h3m2 0h4m3 0h3m-43 1h1m1 0h3m1 0h1m1 0h1m3 0h1m2 0h1m2 0h1m1 0h5m3 0h1m2 0h2m2 0h6m3 0h1m-45 1h1m1 0h3m1 0h1m1 0h2m1 0h1m1 0h4m1 0h2m2 0h2m3 0h1m1 0h2m1 0h4m3 0h1m1 0h4m-45 1h1m1 0h3m1 0h1m2 0h1m1 0h1m2 0h1m1 0h2m2 0h1m1 0h2m1 0h2m1 0h2m1 0h3m2 0h1m2 0h2m2 0h2m-45 1h1m5 0h1m2 0h1m1 0h1m2 0h3m1 0h8m4 0h3m4 0h4m1 0h3m-45 1h7m2 0h2m1 0h1m1 0h1m5 0h1m3 0h2m1 0h2m2 0h1m1 0h2m1 0h1m1 0h1\"/></svg>",
  commercial: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 45 45\" class=\"segno\"><path class=\"qrline\" stroke=\"#102c22\" d=\"M0 0.5h7m4 0h2m1 0h1m1 0h3m1 0h3m2 0h1m1 0h1m2 0h1m1 0h2m2 0h1m1 0h7m-45 1h1m5 0h1m3 0h5m3 0h2m2 0h1m2 0h1m2 0h1m4 0h1m1 0h1m2 0h1m5 0h1m-45 1h1m1 0h3m1 0h1m1 0h1m2 0h1m1 0h3m3 0h1m1 0h2m4 0h2m1 0h2m1 0h1m1 0h1m2 0h1m1 0h3m1 0h1m-45 1h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h3m1 0h2m4 0h1m2 0h1m2 0h2m1 0h1m1 0h1m1 0h2m1 0h1m1 0h3m1 0h1m-45 1h1m1 0h3m1 0h1m3 0h2m1 0h5m2 0h9m1 0h1m3 0h3m1 0h1m1 0h3m1 0h1m-45 1h1m5 0h1m2 0h1m1 0h1m2 0h3m1 0h3m3 0h2m2 0h1m2 0h2m5 0h1m5 0h1m-45 1h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7m-36 1h3m1 0h1m5 0h2m3 0h2m1 0h3m3 0h2m-32 1h2m1 0h2m2 0h1m1 0h3m1 0h2m2 0h5m3 0h1m2 0h1m9 0h2m-41 1h2m3 0h1m1 0h4m1 0h1m1 0h1m3 0h1m2 0h1m1 0h1m1 0h1m1 0h2m1 0h1m1 0h8m1 0h1m-43 1h2m3 0h2m1 0h1m4 0h5m1 0h1m1 0h1m2 0h2m1 0h2m1 0h4m2 0h1m5 0h2m-44 1h1m2 0h2m2 0h2m2 0h1m1 0h2m1 0h4m4 0h1m1 0h2m3 0h3m4 0h1m2 0h1m-43 1h2m1 0h1m2 0h1m2 0h1m2 0h6m2 0h2m1 0h5m2 0h3m2 0h1m1 0h2m1 0h2m1 0h2m-45 1h2m3 0h1m1 0h2m3 0h1m1 0h1m1 0h1m2 0h2m1 0h1m4 0h4m1 0h2m1 0h2m1 0h3m2 0h1m-42 1h5m2 0h1m1 0h2m1 0h1m4 0h2m2 0h2m6 0h3m2 0h1m1 0h1m3 0h1m-42 1h3m3 0h7m1 0h2m3 0h2m3 0h1m4 0h2m1 0h1m1 0h2m1 0h1m2 0h4m-42 1h1m2 0h1m1 0h1m2 0h1m2 0h2m2 0h1m2 0h1m1 0h1m4 0h1m1 0h4m3 0h2m-37 1h1m1 0h2m2 0h4m2 0h2m1 0h1m1 0h1m1 0h1m2 0h3m1 0h4m1 0h2m1 0h2m6 0h1m-45 1h5m1 0h3m1 0h3m1 0h2m1 0h1m4 0h1m5 0h1m1 0h1m2 0h1m2 0h1m7 0h1m-45 1h2m1 0h2m2 0h1m3 0h1m3 0h2m1 0h1m3 0h2m2 0h1m1 0h2m1 0h1m2 0h1m1 0h1m3 0h1m1 0h1m-41 1h7m1 0h1m4 0h2m1 0h1m1 0h5m1 0h1m6 0h1m2 0h5m3 0h1m-45 1h1m2 0h2m3 0h1m2 0h1m2 0h3m2 0h2m3 0h4m1 0h1m1 0h6m3 0h3m-43 1h3m1 0h1m1 0h1m1 0h1m1 0h2m1 0h4m2 0h2m1 0h1m1 0h1m1 0h1m2 0h2m1 0h5m1 0h1m1 0h5m-42 1h2m3 0h3m1 0h4m1 0h1m1 0h2m3 0h4m1 0h1m4 0h3m3 0h1m1 0h1m-41 1h12m1 0h2m2 0h6m2 0h2m2 0h2m1 0h8m-40 1h4m1 0h3m2 0h1m1 0h1m2 0h1m1 0h2m2 0h3m2 0h1m2 0h3m1 0h3m1 0h1m2 0h2m-44 1h2m3 0h2m1 0h1m1 0h4m1 0h1m1 0h1m3 0h3m2 0h6m1 0h1m1 0h2m5 0h1m-43 1h1m2 0h2m4 0h1m3 0h1m2 0h1m1 0h1m2 0h2m1 0h2m3 0h3m1 0h1m1 0h1m4 0h1m1 0h2m-44 1h1m1 0h1m3 0h9m2 0h2m1 0h2m3 0h3m2 0h3m1 0h2m2 0h1m1 0h2m2 0h1m-41 1h1m2 0h1m2 0h1m2 0h2m3 0h2m1 0h1m1 0h1m2 0h1m1 0h1m2 0h4m1 0h1m2 0h2m2 0h2m-45 1h2m3 0h3m1 0h1m3 0h1m1 0h1m1 0h4m2 0h2m3 0h2m1 0h3m1 0h2m1 0h3m1 0h1m1 0h1m-42 1h1m1 0h1m4 0h5m2 0h1m2 0h4m3 0h3m5 0h1m3 0h1m1 0h2m1 0h1m-45 1h2m1 0h1m2 0h2m1 0h1m1 0h2m5 0h1m1 0h4m1 0h1m1 0h1m2 0h1m3 0h1m1 0h2m1 0h1m3 0h1m-44 1h1m2 0h1m1 0h1m2 0h3m1 0h1m1 0h1m3 0h2m1 0h1m4 0h1m1 0h1m4 0h4m2 0h4m-39 1h1m1 0h1m3 0h4m5 0h1m2 0h1m2 0h3m2 0h6m1 0h2m2 0h4m-44 1h4m4 0h1m1 0h1m4 0h6m1 0h1m2 0h2m2 0h1m1 0h1m5 0h2m2 0h1m-43 1h1m2 0h2m1 0h1m1 0h2m2 0h1m1 0h3m3 0h7m4 0h2m1 0h7m3 0h1m-37 1h2m1 0h1m2 0h1m2 0h1m1 0h2m3 0h4m1 0h2m2 0h1m1 0h2m3 0h2m1 0h1m-44 1h7m1 0h1m3 0h1m1 0h3m1 0h3m1 0h1m1 0h2m4 0h4m2 0h1m1 0h1m1 0h3m-43 1h1m5 0h1m4 0h4m2 0h4m3 0h1m3 0h3m2 0h4m3 0h3m-43 1h1m1 0h3m1 0h1m1 0h2m1 0h1m3 0h1m2 0h1m1 0h5m3 0h1m2 0h2m2 0h6m3 0h1m-45 1h1m1 0h3m1 0h1m1 0h3m2 0h4m1 0h2m2 0h2m3 0h1m1 0h1m2 0h4m3 0h1m1 0h4m-45 1h1m1 0h3m1 0h1m2 0h1m3 0h1m2 0h2m2 0h1m1 0h2m1 0h2m1 0h1m2 0h3m2 0h1m2 0h2m2 0h2m-45 1h1m5 0h1m2 0h1m4 0h3m1 0h8m1 0h8m2 0h4m1 0h3m-45 1h7m2 0h4m7 0h1m3 0h2m3 0h1m1 0h1m1 0h2m1 0h1m1 0h1\"/></svg>"
};

var LINKS = {
  community:  BASE + '/?project=community',
  commercial: BASE + '/?project=commercial'
};

/* ─── Poster vocabulary ─────────────────────────────────────── */
var PT = {
ms: {
  'po.title': 'Poster Kempen', 'po.print': 'Cetak poster',
  'po.both': 'Kedua-dua', 'po.onlyA': 'Komuniti', 'po.onlyB': 'Komersial',
  'po.hint': '<b>Untuk pegawai:</b> pilih bahasa dan poster, kemudian cetak pada kertas A4. Setiap poster mengandungi kod QR yang membuka borang permohonan yang betul secara terus. Cetak berwarna memberikan kesan terbaik, tetapi poster kekal jelas dalam hitam putih.',
  'po.org': 'Perbadanan Kemajuan Perusahaan Kayu Sarawak',
  'po.scan': 'Imbas untuk memohon',
  'po.free': 'Permohonan adalah percuma sepenuhnya',
  'po.sig': 'Dibina oleh KOBIS Berhad · www.kobisberhad.com',
  'po.helpline': 'Talian bantuan', 'po.whatsapp': 'WhatsApp', 'po.web': 'Laman web',

  'po.a.kicker': 'Projek Buluh Komuniti',
  'po.a.title': 'Tanah kampung anda<br /><em>boleh menumbuhkan lebih.</em>',
  'po.a.sub': 'Kumpulan komuniti, sekolah dan institusi di seluruh Sarawak boleh memohon anak pokok buluh untuk ditanam di tanah sedia ada.',
  'po.a.who': 'Siapa yang boleh memohon',
  'po.a.w1': 'Kumpulan komuniti, sekolah atau institusi',
  'po.a.w2': 'Sekurang-kurangnya 10 orang peserta',
  'po.a.w3': 'Tanah milik sendiri, sewaan atau pajakan di Sarawak',
  'po.a.w4': 'Kebenaran pemilik tanah jika tanah bukan milik anda',

  'po.b.kicker': 'Ladang Buluh Komersial',
  'po.b.title': 'Bekalkan industri buluh<br /><em>yang sedang dibina Sarawak.</em>',
  'po.b.sub': 'Syarikat dan koperasi berdaftar boleh memohon untuk membangunkan ladang buluh berskala komersial bagi membekalkan industri hiliran negeri.',
  'po.b.who': 'Siapa yang boleh memohon',
  'po.b.w1': 'Syarikat berdaftar SSM atau koperasi',
  'po.b.w2': 'Tapak ladang dalam negeri Sarawak',
  'po.b.w3': 'Tanah milik sendiri, pajakan atau sewaan yang sah',
  'po.b.w4': 'Laporan EIA dan FMP bagi tapak di kawasan LPF',

  'po.s1t': 'Imbas kod QR', 'po.s1d': 'Gunakan kamera telefon anda. Borang yang betul akan terbuka terus.',
  'po.s2t': 'Isi borang', 'po.s2d': 'Empat langkah sahaja. Draf disimpan automatik jika anda perlu berhenti.',
  'po.s3t': 'Muat naik dokumen', 'po.s3d': 'Ambil gambar dokumen anda dan lampirkan terus dari telefon.',
  'po.s4t': 'Terima nombor rujukan', 'po.s4d': 'Simpan nombor tersebut. Pegawai PUSAKA akan menghubungi anda.'
},

en: {
  'po.title': 'Campaign Posters', 'po.print': 'Print posters',
  'po.both': 'Both', 'po.onlyA': 'Community', 'po.onlyB': 'Commercial',
  'po.hint': '<b>For officers:</b> choose a language and which poster, then print on A4. Each poster carries a QR code that opens the correct application form directly. Colour printing looks best, but the poster stays clear in black and white.',
  'po.org': 'Sarawak Timber Industry Development Corporation',
  'po.scan': 'Scan to apply',
  'po.free': 'Applying is completely free',
  'po.sig': 'Built by KOBIS Berhad · www.kobisberhad.com',
  'po.helpline': 'Helpline', 'po.whatsapp': 'WhatsApp', 'po.web': 'Website',

  'po.a.kicker': 'Community Bamboo Project',
  'po.a.title': 'Your village land<br /><em>can grow more.</em>',
  'po.a.sub': 'Community groups, schools and institutions across Sarawak can apply for bamboo seedlings to plant on land they already hold.',
  'po.a.who': 'Who can apply',
  'po.a.w1': 'A community group, school or institution',
  'po.a.w2': 'At least 10 participants',
  'po.a.w3': 'Owned, rented or leased land in Sarawak',
  'po.a.w4': 'Landowner consent if the land is not yours',

  'po.b.kicker': 'Commercial Bamboo Plantation',
  'po.b.title': 'Supply the bamboo industry<br /><em>Sarawak is building.</em>',
  'po.b.sub': 'Registered companies and cooperatives can apply to develop commercial-scale bamboo plantations supplying the state’s downstream industry.',
  'po.b.who': 'Who can apply',
  'po.b.w1': 'SSM-registered company or a cooperative',
  'po.b.w2': 'Plantation site within Sarawak',
  'po.b.w3': 'Owned, leased or validly rented land',
  'po.b.w4': 'EIA and FMP reports for sites in LPF areas',

  'po.s1t': 'Scan the QR code', 'po.s1d': 'Use your phone camera. The right form opens straight away.',
  'po.s2t': 'Fill in the form', 'po.s2d': 'Four steps only. Your draft saves automatically if you need to stop.',
  'po.s3t': 'Upload documents', 'po.s3d': 'Photograph your documents and attach them straight from your phone.',
  'po.s4t': 'Get your reference number', 'po.s4d': 'Keep that number. A PUSAKA officer will contact you.'
},

zh: {
  'po.title': '宣传海报', 'po.print': '打印海报',
  'po.both': '两款', 'po.onlyA': '社区', 'po.onlyB': '商业',
  'po.hint': '<b>官员须知：</b>选择语言与海报，然后以 A4 纸打印。每张海报都附有二维码，可直接开启对应的申请表格。彩色打印效果最佳，但黑白打印同样清晰可读。',
  'po.org': '砂拉越木材工业发展局',
  'po.scan': '扫码申请',
  'po.free': '申请完全免费',
  'po.sig': '由 KOBIS Berhad 打造 · www.kobisberhad.com',
  'po.helpline': '服务热线', 'po.whatsapp': 'WhatsApp', 'po.web': '网站',

  'po.a.kicker': '社区竹林计划',
  'po.a.title': '你的乡村土地<br /><em>能长出更多。</em>',
  'po.a.sub': '砂拉越各地的社区团体、学校与机构，均可申请竹苗，种在自己现有的土地上。',
  'po.a.who': '谁可以申请',
  'po.a.w1': '社区团体、学校或机构',
  'po.a.w2': '最少 10 名参与者',
  'po.a.w3': '位于砂拉越的自有、租用或租赁土地',
  'po.a.w4': '若土地非自有，须取得地主同意',

  'po.b.kicker': '商业竹林种植',
  'po.b.title': '为砂拉越正在建立的<br /><em>竹业提供原料。</em>',
  'po.b.sub': '已注册的公司与合作社可申请发展商业规模竹林，为本州下游产业供应原料。',
  'po.b.who': '谁可以申请',
  'po.b.w1': 'SSM 注册公司或合作社',
  'po.b.w2': '种植地点位于砂拉越境内',
  'po.b.w3': '自有、租赁或合法承租的土地',
  'po.b.w4': 'LPF 范围内地段须备 EIA 与 FMP 报告',

  'po.s1t': '扫描二维码', 'po.s1d': '用手机相机扫描，正确的表格会立即开启。',
  'po.s2t': '填写表格', 'po.s2d': '只需四个步骤。中途暂停时草稿会自动保存。',
  'po.s3t': '上传文件', 'po.s3d': '为文件拍照，直接用手机附上。',
  'po.s4t': '取得参考编号', 'po.s4d': '请保存该编号。PUSAKA 官员将与你联系。'
},

ib: {
  'po.title': 'Poster Kempen', 'po.print': 'Chitak poster',
  'po.both': 'Dua-dua', 'po.onlyA': 'Komuniti', 'po.onlyB': 'Komersial',
  'po.hint': '<b>Ngagai pegawai:</b> pilih jaku enggau poster, udah nya chitak ba kertas A4. Tiap-tiap poster bisi kod QR ke muka borang peminta ti betul terus. Chitak bewarna pemadu manah, tang poster agi terang ba item-burak.',
  'po.org': 'Perbadanan Kemajuan Perusahaan Kayu Sarawak',
  'po.scan': 'Imbas ngambi minta',
  'po.free': 'Peminta tu percuma magang',
  'po.sig': 'Digaga KOBIS Berhad · www.kobisberhad.com',
  'po.helpline': 'Talian tulung', 'po.whatsapp': 'WhatsApp', 'po.web': 'Laman web',

  'po.a.kicker': 'Projek Buluh Komuniti',
  'po.a.title': 'Tanah menua nuan<br /><em>ulih ngasuh mayuh agi.</em>',
  'po.a.sub': 'Kumpulan komuniti, sekula enggau institusi seSarawak ulih minta anak buluh ditanam ba tanah ke udah dikemisi sida.',
  'po.a.who': 'Sapa ulih minta',
  'po.a.w1': 'Kumpulan komuniti, sekula tauka institusi',
  'po.a.w2': 'Sekurang-kurang 10 iku peserta',
  'po.a.w3': 'Tanah empu, sewa tauka pajak ba Sarawak',
  'po.a.w4': 'Izin tuan tanah enti tanah ukai empu nuan',

  'po.b.kicker': 'Ladang Buluh Komersial',
  'po.b.title': 'Meri bekal ngagai industri buluh<br /><em>ke digaga Sarawak.</em>',
  'po.b.sub': 'Kompeni enggau koperasi ke udah bedaftar ulih minta ngaga ladang buluh besai ngambi meri bekal ngagai industri hilir menua.',
  'po.b.who': 'Sapa ulih minta',
  'po.b.w1': 'Kompeni bedaftar SSM tauka koperasi',
  'po.b.w2': 'Tapak ladang ba dalam menua Sarawak',
  'po.b.w3': 'Tanah empu, pajak tauka sewa ke betul',
  'po.b.w4': 'Laporan EIA enggau FMP ngagai tapak ba kawasan LPF',

  'po.s1t': 'Imbas kod QR', 'po.s1d': 'Kena kamera telefon nuan. Borang ti betul terus muka.',
  'po.s2t': 'Isi borang', 'po.s2d': 'Semina empat tikas. Draf disimpan empu enti nuan ibuh badu.',
  'po.s3t': 'Muat naik surat', 'po.s3d': 'Amat gambar surat nuan lalu lampir terus ari telefon.',
  'po.s4t': 'Nerima nombor rujuk', 'po.s4d': 'Simpan nombor nya. Pegawai PUSAKA deka betemu enggau nuan.'
}
};

Object.keys(PT).forEach(function (lang) {
  if (!T[lang]) T[lang] = {};
  Object.keys(PT[lang]).forEach(function (k) { T[lang][k] = PT[lang][k]; });
});

/* ─── Poster rendering ──────────────────────────────────────── */
var MARK = '<svg viewBox="0 0 24 24" fill="none"><path d="M9 2v20M15 2v20" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M6.6 8h4.8M12.6 14h4.8M6.6 16h4.8M12.6 6h4.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity=".75"/></svg>';

function steps() {
  var out = '';
  for (var i = 1; i <= 4; i++) {
    out += '<li><span class="n">' + i + '</span><span>' +
      '<span class="t" data-i18n="po.s' + i + 't"></span>' +
      '<span class="d" data-i18n="po.s' + i + 'd"></span>' +
    '</span></li>';
  }
  return out;
}

function poster(letter, track) {
  var p = 'po.' + letter;
  return '<section class="poster poster-' + letter + '" data-poster="' + letter + '">' +
    '<header class="poster-head">' +
      '<div class="culm-field" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>' +
      '<div class="poster-org">' +
        '<span class="brand-mark" aria-hidden="true">' + MARK + '</span>' +
        '<span><span class="poster-org-name">Bamboo Sarawak</span>' +
        '<span class="poster-org-sub" data-i18n="po.org"></span></span>' +
      '</div>' +
      '<span class="poster-kicker" data-i18n="' + p + '.kicker"></span>' +
      '<h1 class="poster-title" data-i18n="' + p + '.title"></h1>' +
      '<p class="poster-sub" data-i18n="' + p + '.sub"></p>' +
    '</header>' +

    '<div class="poster-body">' +
      '<div class="poster-left">' +
        '<ol class="poster-steps">' + steps() + '</ol>' +
        '<div class="poster-who">' +
          '<h4 data-i18n="' + p + '.who"></h4>' +
          '<ul>' + [1,2,3,4].map(function (i) {
            return '<li data-i18n="' + p + '.w' + i + '"></li>'; }).join('') + '</ul>' +
        '</div>' +
      '</div>' +

      '<div class="poster-right">' +
        '<div class="poster-qr">' + QR[track] + '</div>' +
        '<div class="poster-scan" data-i18n="po.scan"></div>' +
        '<div class="poster-url">' + esc(BASE.replace(/^https:\/\//, '')) +
          '<br />' + esc('/?project=' + track) + '</div>' +
      '</div>' +
    '</div>' +

    '<footer class="poster-foot">' +
      '<div class="poster-contact">' +
        '<div><div class="lbl" data-i18n="po.helpline"></div><div class="val">082-473000</div></div>' +
        '<div><div class="lbl" data-i18n="po.whatsapp"></div><div class="val">' + esc(CFG.waDisplay) + '</div></div>' +
        '<div><div class="lbl" data-i18n="po.web"></div><div class="val">bamboo-sarawak-stidc.netlify.app</div></div>' +
      '</div>' +
      '<div class="poster-free">' +
        '<span class="note" data-i18n="po.free"></span>' +
        '<span class="sig" data-i18n="po.sig"></span>' +
      '</div>' +
    '</footer>' +
  '</section>';
}

function boot() {
  var mount = document.getElementById('posterMount');
  if (!mount) return;
  mount.innerHTML = poster('a', 'community') + poster('b', 'commercial');

  document.querySelectorAll('.nav-lang button').forEach(function (b) {
    b.addEventListener('click', function () { I18N.apply(b.dataset.lang); });
  });

  document.querySelectorAll('#segPoster button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('#segPoster button').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var show = b.dataset.show;
      document.querySelectorAll('.poster').forEach(function (p) {
        p.classList.toggle('is-hidden', !!show && p.dataset.poster !== show);
        p.style.display = (!!show && p.dataset.poster !== show) ? 'none' : '';
      });
    });
  });

  document.getElementById('btnPrintPoster').addEventListener('click', function () { window.print(); });

  I18N.apply(I18N.lang);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else { boot(); }

})();
