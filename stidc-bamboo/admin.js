/* ══════════════════════════════════════════════════════════════
   BAMBOO SARAWAK — management dashboard
   Demonstration access · front-end gate only
   ══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var CFG   = window.BAMBOO_CONFIG;
var I18N  = window.BAMBOO_I18N;
var T     = window.BAMBOO_T;
var esc   = window.BAMBOO_UTIL.esc;
var toast = window.BAMBOO_TOAST;
var t     = function (k) { return I18N.t(k); };

var SESSION_KEY = 'bamboo-sarawak-mgmt-session';

/* ─── Dashboard vocabulary ──────────────────────────────────── */
var MT = {
ms: {
  'mg.gate.title': 'Akses Pengurusan',
  'mg.gate.sub': 'Papan pemuka permohonan Projek Buluh. Untuk kegunaan pegawai STIDC / PUSAKA sahaja.',
  'mg.gate.pass': 'Kata laluan', 'mg.gate.enter': 'Masuk', 'mg.gate.wrong': 'Kata laluan tidak betul.',
  'mg.gate.note': 'Demonstrasi sahaja: kata laluan ini disimpan dalam kod hadapan dan tidak melindungi data sebenar. Sebelum kegunaan rasmi, akses perlu dipindahkan ke pengesahan sisi pelayan dengan akaun pegawai berasingan.',
  'mg.title': 'Papan Pemuka Permohonan',
  'mg.export': 'Muat turun CSV', 'mg.logout': 'Log keluar',
  'mg.table.title': 'Senarai permohonan', 'mg.search': 'Cari rujukan, nama, daerah…',
  'mg.all': 'Semua', 'mg.trackA': 'Komuniti', 'mg.trackB': 'Komersial',
  'mg.status.all': 'Semua status', 'mg.status.new': 'Baharu', 'mg.status.review': 'Dalam semakan',
  'mg.status.approved': 'Disokong', 'mg.status.rejected': 'Tidak disokong',
  'mg.c.ref': 'Rujukan', 'mg.c.applicant': 'Pemohon', 'mg.c.track': 'Laluan',
  'mg.c.location': 'Lokasi', 'mg.c.area': 'Keluasan', 'mg.c.date': 'Tarikh', 'mg.c.status': 'Status',
  'mg.k.total': 'Jumlah permohonan', 'mg.k.totald': 'Semua laluan',
  'mg.k.new': 'Menunggu semakan', 'mg.k.newd': 'Status baharu atau dalam semakan',
  'mg.k.area': 'Keluasan dipohon', 'mg.k.aread': 'Anggaran gabungan, ditukar ke hektar',
  'mg.k.people': 'Peserta komuniti', 'mg.k.peopled': 'Jumlah ahli dalam permohonan komuniti',
  'mg.empty.t': 'Belum ada permohonan',
  'mg.empty.d': 'Permohonan yang dihantar melalui portal akan muncul di sini. Anda juga boleh memuatkan data contoh untuk melihat rupa papan pemuka ini apabila digunakan.',
  'mg.empty.seed': 'Muatkan data contoh',
  'mg.empty.filtered.t': 'Tiada padanan',
  'mg.empty.filtered.d': 'Tiada permohonan yang menepati carian atau penapis anda. Cuba longgarkan penapis.',
  'mg.seeded': 'Enam permohonan contoh dimuatkan',
  'mg.d.title': 'Butiran permohonan', 'mg.d.print': 'Cetak rekod', 'mg.d.delete': 'Padam rekod',
  'mg.d.status': 'Tukar status', 'mg.d.notes': 'Catatan pegawai', 'mg.d.notesph': 'Catatan dalaman — tidak dipaparkan kepada pemohon',
  'mg.d.saved': 'Perubahan disimpan', 'mg.d.deleted': 'Rekod dipadam',
  'mg.d.confirm': 'Padam rekod ini secara kekal?',
  'mg.d.files': 'Dokumen dilampirkan', 'mg.d.nofiles': 'Tiada dokumen dilampirkan.',
  'mg.d.members': 'Ahli projek', 'mg.d.sign': 'Tandatangan pemohon',
  'mg.d.submitted': 'Dihantar pada', 'mg.d.checklist': 'Senarai semak ditanda',
  'mg.exported': 'CSV dimuat turun', 'mg.noexport': 'Tiada rekod untuk dieksport',
  'mg.demo': 'Data demonstrasi — disimpan dalam pelayar peranti ini sahaja, bukan pangkalan data pelayan.',
  'mg.sample': 'Contoh'
},
en: {
  'mg.gate.title': 'Management Access',
  'mg.gate.sub': 'Bamboo Project application dashboard. For STIDC / PUSAKA officers only.',
  'mg.gate.pass': 'Password', 'mg.gate.enter': 'Enter', 'mg.gate.wrong': 'That password is not correct.',
  'mg.gate.note': 'Demonstration only: this password sits in front-end code and does not protect real data. Before official use, access must move to server-side authentication with individual officer accounts.',
  'mg.title': 'Application Dashboard',
  'mg.export': 'Download CSV', 'mg.logout': 'Sign out',
  'mg.table.title': 'Applications', 'mg.search': 'Search reference, name, district…',
  'mg.all': 'All', 'mg.trackA': 'Community', 'mg.trackB': 'Commercial',
  'mg.status.all': 'All statuses', 'mg.status.new': 'New', 'mg.status.review': 'Under review',
  'mg.status.approved': 'Supported', 'mg.status.rejected': 'Not supported',
  'mg.c.ref': 'Reference', 'mg.c.applicant': 'Applicant', 'mg.c.track': 'Route',
  'mg.c.location': 'Location', 'mg.c.area': 'Area', 'mg.c.date': 'Date', 'mg.c.status': 'Status',
  'mg.k.total': 'Total applications', 'mg.k.totald': 'Across both routes',
  'mg.k.new': 'Awaiting review', 'mg.k.newd': 'New or under review',
  'mg.k.area': 'Area applied for', 'mg.k.aread': 'Combined estimate, converted to hectares',
  'mg.k.people': 'Community participants', 'mg.k.peopled': 'Total members across community applications',
  'mg.empty.t': 'No applications yet',
  'mg.empty.d': 'Applications submitted through the portal will appear here. You can also load sample data to see how this dashboard looks in use.',
  'mg.empty.seed': 'Load sample data',
  'mg.empty.filtered.t': 'No matches',
  'mg.empty.filtered.d': 'No applications match your search or filters. Try loosening them.',
  'mg.seeded': 'Six sample applications loaded',
  'mg.d.title': 'Application details', 'mg.d.print': 'Print record', 'mg.d.delete': 'Delete record',
  'mg.d.status': 'Change status', 'mg.d.notes': 'Officer notes', 'mg.d.notesph': 'Internal notes — not shown to the applicant',
  'mg.d.saved': 'Changes saved', 'mg.d.deleted': 'Record deleted',
  'mg.d.confirm': 'Delete this record permanently?',
  'mg.d.files': 'Attached documents', 'mg.d.nofiles': 'No documents attached.',
  'mg.d.members': 'Project members', 'mg.d.sign': 'Applicant signature',
  'mg.d.submitted': 'Submitted on', 'mg.d.checklist': 'Checklist ticked',
  'mg.exported': 'CSV downloaded', 'mg.noexport': 'No records to export',
  'mg.demo': 'Demonstration data — held in this device’s browser only, not a server database.',
  'mg.sample': 'Sample'
},
zh: {
  'mg.gate.title': '管理层登入',
  'mg.gate.sub': '竹林计划申请仪表板。仅供 STIDC／PUSAKA 官员使用。',
  'mg.gate.pass': '密码', 'mg.gate.enter': '进入', 'mg.gate.wrong': '密码不正确。',
  'mg.gate.note': '仅供示范：此密码写在前端代码中，无法保护真实资料。正式使用前，存取权须改为服务器端验证，并为每位官员设立独立账号。',
  'mg.title': '申请仪表板',
  'mg.export': '下载 CSV', 'mg.logout': '登出',
  'mg.table.title': '申请列表', 'mg.search': '搜索参考编号、姓名、县…',
  'mg.all': '全部', 'mg.trackA': '社区', 'mg.trackB': '商业',
  'mg.status.all': '所有状态', 'mg.status.new': '新提交', 'mg.status.review': '审核中',
  'mg.status.approved': '获支持', 'mg.status.rejected': '不获支持',
  'mg.c.ref': '参考编号', 'mg.c.applicant': '申请人', 'mg.c.track': '途径',
  'mg.c.location': '地点', 'mg.c.area': '面积', 'mg.c.date': '日期', 'mg.c.status': '状态',
  'mg.k.total': '申请总数', 'mg.k.totald': '两条途径合计',
  'mg.k.new': '待审核', 'mg.k.newd': '新提交或审核中',
  'mg.k.area': '申请面积', 'mg.k.aread': '合计估值，已换算为公顷',
  'mg.k.people': '社区参与者', 'mg.k.peopled': '社区申请中的成员总数',
  'mg.empty.t': '尚无申请',
  'mg.empty.d': '通过入口提交的申请将显示在此。你也可以载入示范资料，看看这个仪表板在实际使用时的样子。',
  'mg.empty.seed': '载入示范资料',
  'mg.empty.filtered.t': '没有相符结果',
  'mg.empty.filtered.d': '没有申请符合你的搜索或筛选条件。试着放宽条件。',
  'mg.seeded': '已载入六份示范申请',
  'mg.d.title': '申请详情', 'mg.d.print': '打印记录', 'mg.d.delete': '删除记录',
  'mg.d.status': '更改状态', 'mg.d.notes': '官员备注', 'mg.d.notesph': '内部备注——不会显示给申请人',
  'mg.d.saved': '更改已保存', 'mg.d.deleted': '记录已删除',
  'mg.d.confirm': '永久删除此记录？',
  'mg.d.files': '附上的文件', 'mg.d.nofiles': '没有附上任何文件。',
  'mg.d.members': '计划成员', 'mg.d.sign': '申请人签名',
  'mg.d.submitted': '提交日期', 'mg.d.checklist': '已勾选清单',
  'mg.exported': 'CSV 已下载', 'mg.noexport': '没有可导出的记录',
  'mg.demo': '示范资料——只保存在此设备的浏览器中，并非服务器数据库。',
  'mg.sample': '示范'
},
ib: {
  'mg.gate.title': 'Akses Pengurus',
  'mg.gate.sub': 'Papan peda peminta Projek Buluh. Semina ngagai pegawai STIDC / PUSAKA.',
  'mg.gate.pass': 'Kata kunci', 'mg.gate.enter': 'Tama', 'mg.gate.wrong': 'Kata kunci enda betul.',
  'mg.gate.note': 'Semina peda: kata kunci tu bisi dalam kod muka lalu enda nyaga data ti amat. Sebedau dikena resmi, akses ibuh dipindah ngagai pengesah ba server enggau akaun pegawai siku-siku.',
  'mg.title': 'Papan Peda Peminta',
  'mg.export': 'Muat turun CSV', 'mg.logout': 'Pansut',
  'mg.table.title': 'Senarai peminta', 'mg.search': 'Giga rujuk, nama, daerah…',
  'mg.all': 'Semua', 'mg.trackA': 'Komuniti', 'mg.trackB': 'Komersial',
  'mg.status.all': 'Semua status', 'mg.status.new': 'Baru', 'mg.status.review': 'Dalam peda',
  'mg.status.approved': 'Disukung', 'mg.status.rejected': 'Enda disukung',
  'mg.c.ref': 'Rujuk', 'mg.c.applicant': 'Orang minta', 'mg.c.track': 'Jalai',
  'mg.c.location': 'Endur', 'mg.c.area': 'Luas', 'mg.c.date': 'Tarikh', 'mg.c.status': 'Status',
  'mg.k.total': 'Semua peminta', 'mg.k.totald': 'Dua-dua jalai',
  'mg.k.new': 'Nganti dipeda', 'mg.k.newd': 'Baru tauka dalam peda',
  'mg.k.area': 'Luas ke diminta', 'mg.k.aread': 'Anggar begempung, ditukar ngagai hektar',
  'mg.k.people': 'Peserta komuniti', 'mg.k.peopled': 'Jumlah ahli dalam peminta komuniti',
  'mg.empty.t': 'Nadai agi peminta',
  'mg.empty.d': 'Peminta ke dikirim ngena portal deka pegari ditu. Nuan mega ulih muat data chunto ngambi meda gaya papan tu lebuh dikena.',
  'mg.empty.seed': 'Muat data chunto',
  'mg.empty.filtered.t': 'Nadai ke ngena',
  'mg.empty.filtered.d': 'Nadai peminta ke ngena giga tauka tapis nuan. Uji longgarka tapis.',
  'mg.seeded': 'Nam iti peminta chunto udah dimuat',
  'mg.d.title': 'Butir peminta', 'mg.d.print': 'Chitak rekod', 'mg.d.delete': 'Padam rekod',
  'mg.d.status': 'Tukar status', 'mg.d.notes': 'Catat pegawai', 'mg.d.notesph': 'Catat dalam — enda dipandang ngagai orang ke minta',
  'mg.d.saved': 'Ubah udah disimpan', 'mg.d.deleted': 'Rekod udah dipadam',
  'mg.d.confirm': 'Padam rekod tu belama-lama?',
  'mg.d.files': 'Surat ke dilampir', 'mg.d.nofiles': 'Nadai surat dilampir.',
  'mg.d.members': 'Ahli projek', 'mg.d.sign': 'Tanda jari orang ke minta',
  'mg.d.submitted': 'Dikirim ba', 'mg.d.checklist': 'Senarai ke ditanda',
  'mg.exported': 'CSV udah dimuat turun', 'mg.noexport': 'Nadai rekod ke ulih dieksport',
  'mg.demo': 'Data peda — disimpan dalam pelayar alat tu aja, ukai pangkalan data server.',
  'mg.sample': 'Chunto'
}
};

Object.keys(MT).forEach(function (lang) {
  if (!T[lang]) T[lang] = {};
  Object.keys(MT[lang]).forEach(function (k) { T[lang][k] = MT[lang][k]; });
});

/* ─── Store access ──────────────────────────────────────────── */
function readRecords() {
  try {
    var raw = localStorage.getItem(CFG.storeKey);
    var list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (e) { return []; }
}
function writeRecords(list) {
  try { localStorage.setItem(CFG.storeKey, JSON.stringify(list)); return true; }
  catch (e) { return false; }
}

/* ─── Derived helpers ───────────────────────────────────────── */
var STATUSES = ['new', 'review', 'approved', 'rejected'];
var STATUS_PILL = { new: 'pill-new', review: 'pill-review', approved: 'pill-approve', rejected: 'pill-reject' };

function applicantOf(r) {
  var d = r.data || {};
  return r.track === 'community'
    ? (d.leaderName || r.signName || '—')
    : (d.coName || r.signName || '—');
}
function locationOf(r) {
  var d = r.data || {};
  return [d.district, d.division].filter(Boolean).join(', ') || '—';
}
/* Area is normalised to hectares; community areas may be entered in acres. */
function areaHaOf(r) {
  var d = r.data || {};
  if (r.track === 'commercial') return parseFloat(d.areaHa) || 0;
  var n = parseFloat(d.landArea) || 0;
  return d.landUnit === 'ha' ? n : n * 0.404686;
}
function areaLabel(r) {
  var ha = areaHaOf(r);
  if (!ha) return '—';
  return ha.toFixed(ha < 10 ? 2 : 1) + ' ha';
}
function dateOf(r) {
  var d = new Date(r.createdAt);
  return isNaN(d) ? '—' : d.toLocaleDateString(
    I18N.lang === 'zh' ? 'zh-Hans' : (I18N.lang === 'en' ? 'en-GB' : 'ms-MY'),
    { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ─── Sample data ───────────────────────────────────────────── */
function seedSamples() {
  var now = Date.now(), day = 86400000;
  function members(n, prefix) {
    var out = [];
    for (var i = 1; i <= n; i++) out.push({ name: prefix + ' ' + i, ic: '', phone: '', income: '' });
    return out;
  }
  var samples = [
    { ref: 'BSA-A-2608-K7QM', track: 'community', form: 'STIDC.01', createdAt: new Date(now - 2 * day).toISOString(),
      status: 'new', sample: true, signName: 'Empaling anak Jelian', signDate: '', signature: '', notes: '',
      participants: members(14, 'Ahli Rumah Panjai'),
      files: [{ name: 'salinan-ic-ahli.pdf', size: 2411000, cls: 'mb.sug.ic' },
              { name: 'geran-tanah-lot-2214.pdf', size: 1840000, cls: 'mb.sug.land' }],
      checklist: { 'cl.a1': true, 'cl.a2': true },
      data: { category: 'community', state: 'Sarawak', division: 'Betong', district: 'Saratok',
              parliament: 'Saratok', dun: 'Kalaka', landType: 'own', lotNo: 'Lot 2214',
              landArea: '6.5', landUnit: 'acre', purpose: 'Bekalan buluh untuk kraf tangan dan bahan binaan kampung',
              leaderName: 'Empaling anak Jelian', leaderId: '', homeAddr: 'Rumah Panjai Nanga Tebat, Saratok',
              projAddr: 'Lot 2214, Saratok', phone: '013-8842190', email: '', income: '1800' } },

    { ref: 'BSA-B-2608-R4TX', track: 'commercial', form: 'STIDC.10.SH.01.37', createdAt: new Date(now - 4 * day).toISOString(),
      status: 'review', sample: true, signName: 'Lau Hui Ming', signDate: '', signature: '', notes: 'Naziran tapak dicadangkan pada minggu hadapan.',
      participants: [],
      files: [{ name: 'profil-syarikat.pdf', size: 3210000, cls: 'mb.sug.company' },
              { name: 'borang-9-24-49.pdf', size: 1120000, cls: 'mb.sug.company' },
              { name: 'peta-topografi-tapak.pdf', size: 5620000, cls: 'mb.sug.map' }],
      checklist: { 'cl.b1': true, 'cl.b2': true, 'cl.b3': true, 'cl.b6': true, 'cl.b9': true },
      data: { coName: 'Rimba Hijau Plantation Sdn Bhd', coReg: '201801023344 (1281234-K)',
              bumi: 'non', coStatus: 'local', coAddr: 'Lot 88, Jalan Tun Jugah, 93350 Kuching',
              coPhone: '082-556700', coFax: '082-556701',
              picName: 'Lau Hui Ming', picPos: 'Pengurus Projek', picUnit: 'Operasi Ladang',
              picMobile: '019-8871234', picEmail: 'huiming@rimbahijau.example',
              division: 'Sibu', district: 'Kanowit', subDistrict: 'Ngemah', titleType: 'Pajakan Negeri 0421',
              siteStatus: 'lease', areaHa: '148', soil: 'mineral' } },

    { ref: 'BSA-A-2608-P2WD', track: 'community', form: 'STIDC.01', createdAt: new Date(now - 9 * day).toISOString(),
      status: 'approved', sample: true, signName: 'Norhayati binti Ahmad', signDate: '', signature: '', notes: 'Disokong. Anak pokok diperuntukkan mengikut keluasan.',
      participants: members(11, 'Peserta Sekolah'),
      files: [{ name: 'ic-peserta-sekolah.pdf', size: 1980000, cls: 'mb.sug.ic' },
              { name: 'surat-kebenaran-guna-tanah.pdf', size: 640000, cls: 'mb.sug.land' }],
      checklist: { 'cl.a1': true, 'cl.a2': true, 'cl.a3': true },
      data: { category: 'school', state: 'Sarawak', division: 'Mukah', district: 'Dalat',
              parliament: 'Mukah', dun: 'Balingian', landType: 'rent', lotNo: 'Lot 771',
              landArea: '3', landUnit: 'acre', purpose: 'Projek pendidikan alam sekitar dan tanaman buluh sekolah',
              leaderName: 'Norhayati binti Ahmad', leaderId: '', homeAddr: 'Dalat, Mukah',
              projAddr: 'SMK Dalat, Mukah', phone: '084-864233', email: 'skdalat@example.edu.my',
              income: '', ownerName: 'Jabatan Pelajaran Bahagian Mukah', ownerId: '' } },

    { ref: 'BSA-B-2608-M8HC', track: 'commercial', form: 'STIDC.10.SH.01.37', createdAt: new Date(now - 13 * day).toISOString(),
      status: 'new', sample: true, signName: 'Awang Tarmizi bin Awang Bakar', signDate: '', signature: '', notes: '',
      participants: [],
      files: [{ name: 'kertas-kerja-cadangan.pdf', size: 4410000, cls: 'mb.sug.proposal' },
              { name: 'laporan-eia-ringkas.pdf', size: 8110000, cls: 'mb.sug.eia' }],
      checklist: { 'cl.b1': true, 'cl.b5': true, 'cl.b7': true },
      data: { coName: 'Koperasi Buluh Ulu Baram Berhad', coReg: 'KOP/SWK/2019/0442',
              bumi: 'bumiputera', coStatus: 'local', coAddr: 'Pusat Koperasi, Marudi, 98050 Baram',
              coPhone: '085-755120', coFax: '',
              picName: 'Awang Tarmizi bin Awang Bakar', picPos: 'Setiausaha', picUnit: 'Pentadbiran',
              picMobile: '013-8302299', picEmail: 'kobub@example.coop',
              division: 'Miri', district: 'Marudi', subDistrict: 'Long Lama', titleType: 'NCR — dalam proses',
              siteStatus: 'other', siteOther: 'Tanah adat, permohonan geran dalam proses',
              areaHa: '62', soil: 'kerangas' } },

    { ref: 'BSA-A-2607-T5NB', track: 'community', form: 'STIDC.01', createdAt: new Date(now - 21 * day).toISOString(),
      status: 'review', sample: true, signName: 'Lian anak Bujang', signDate: '', signature: '', notes: 'Menunggu salinan kad pengenalan tiga ahli lagi.',
      participants: members(10, 'Ahli Komuniti'),
      files: [{ name: 'senarai-ahli.docx', size: 320000, cls: 'mb.sug.other' }],
      checklist: { 'cl.a2': true },
      data: { category: 'community', state: 'Sarawak', division: 'Kapit', district: 'Song',
              parliament: 'Hulu Rajang', dun: 'Katibas', landType: 'own', lotNo: 'Lot 118',
              landArea: '4.2', landUnit: 'ha', purpose: 'Menstabilkan tebing sungai dan bekalan buluh kraf',
              leaderName: 'Lian anak Bujang', leaderId: '', homeAddr: 'Nanga Katibas, Song',
              projAddr: 'Lot 118, Nanga Katibas', phone: '084-777145', email: '', income: '1450' } },

    { ref: 'BSA-B-2607-J9VP', track: 'commercial', form: 'STIDC.10.SH.01.37', createdAt: new Date(now - 28 * day).toISOString(),
      status: 'rejected', sample: true, signName: 'Chai Wei Sheng', signDate: '', signature: '', notes: 'Tapak berada di luar negeri Sarawak. Tidak memenuhi syarat lokasi.',
      participants: [],
      files: [{ name: 'profil-syarikat-ringkas.pdf', size: 890000, cls: 'mb.sug.company' }],
      checklist: { 'cl.b1': true, 'cl.b2': true },
      data: { coName: 'Greenstalk Ventures Sdn Bhd', coReg: '202101088776',
              bumi: 'non', coStatus: 'local', coAddr: 'Jalan Sultan Ismail, Kuala Lumpur',
              coPhone: '03-27889900', coFax: '',
              picName: 'Chai Wei Sheng', picPos: 'Pengarah', picUnit: '',
              picMobile: '012-3345567', picEmail: 'ws.chai@example.com',
              division: 'Bintulu', district: 'Tatau', subDistrict: '', titleType: 'Geran 8891',
              siteStatus: 'own', areaHa: '210', soil: 'peat' } }
  ];

  var existing = readRecords();
  var have = {};
  existing.forEach(function (r) { have[r.ref] = true; });
  var merged = samples.filter(function (s) { return !have[s.ref]; }).concat(existing);
  writeRecords(merged);
}

/* ─── Filtering + sorting ───────────────────────────────────── */
var filters = { q: '', track: '', status: '' };
var sortKey = 'createdAt', sortDir = -1;

function sortValue(r, key) {
  switch (key) {
    case 'ref':       return r.ref || '';
    case 'applicant': return applicantOf(r).toLowerCase();
    case 'track':     return r.track || '';
    case 'location':  return locationOf(r).toLowerCase();
    case 'area':      return areaHaOf(r);
    case 'status':    return STATUSES.indexOf(r.status);
    default:          return new Date(r.createdAt).getTime() || 0;
  }
}

function visibleRecords() {
  var q = filters.q.trim().toLowerCase();
  var list = readRecords().filter(function (r) {
    if (filters.track && r.track !== filters.track) return false;
    if (filters.status && r.status !== filters.status) return false;
    if (!q) return true;
    var hay = [r.ref, applicantOf(r), locationOf(r), (r.data || {}).lotNo, (r.data || {}).coReg]
      .filter(Boolean).join(' ').toLowerCase();
    return hay.indexOf(q) !== -1;
  });

  list.sort(function (a, b) {
    var va = sortValue(a, sortKey), vb = sortValue(b, sortKey);
    if (va < vb) return -1 * sortDir;
    if (va > vb) return 1 * sortDir;
    return 0;
  });
  return list;
}

/* ─── Rendering ─────────────────────────────────────────────── */
function renderKpis() {
  var all = readRecords();
  var pending = all.filter(function (r) { return r.status === 'new' || r.status === 'review'; }).length;
  var ha = all.reduce(function (sum, r) { return sum + areaHaOf(r); }, 0);
  var people = all.reduce(function (sum, r) {
    return sum + (r.track === 'community' ? (r.participants || []).length : 0); }, 0);

  var host = document.getElementById('kpis');
  host.innerHTML =
    kpi('',   t('mg.k.total'),  all.length,          '', t('mg.k.totald')) +
    kpi('k2', t('mg.k.new'),    pending,             '', t('mg.k.newd')) +
    kpi('k3', t('mg.k.area'),   ha ? ha.toFixed(1) : '0', 'ha', t('mg.k.aread')) +
    kpi('k4', t('mg.k.people'), people,              '', t('mg.k.peopled'));
}
function kpi(cls, label, num, unit, sub) {
  return '<div class="kpi ' + cls + '"><div class="kpi-l">' + esc(label) + '</div>' +
    '<div class="kpi-n">' + esc(String(num)) + (unit ? '<small>' + esc(unit) + '</small>' : '') + '</div>' +
    '<div class="kpi-sub">' + esc(sub) + '</div></div>';
}

function renderRows() {
  var list = visibleRecords();
  var body = document.getElementById('rows');
  var empty = document.getElementById('emptyState');
  var total = readRecords().length;

  if (!list.length) {
    body.innerHTML = '';
    empty.innerHTML = total === 0 ? emptyBlock(true) : emptyBlock(false);
    var seed = document.getElementById('btnSeed');
    if (seed) seed.addEventListener('click', function () {
      seedSamples(); toast(t('mg.seeded')); refresh();
    });
    return;
  }

  empty.innerHTML = '';
  body.innerHTML = list.map(function (r) {
    var trackCls = r.track === 'community' ? 'pill-a' : 'pill-b';
    var trackLbl = r.track === 'community' ? t('mg.trackA') : t('mg.trackB');
    return '<tr data-ref="' + esc(r.ref) + '" tabindex="0">' +
      '<td class="ref">' + esc(r.ref) + (r.sample ? ' <span class="pill pill-review" style="font-size:.62rem;padding:2px 7px">' + esc(t('mg.sample')) + '</span>' : '') + '</td>' +
      '<td class="name">' + esc(applicantOf(r)) + '</td>' +
      '<td><span class="pill ' + trackCls + '">' + esc(trackLbl) + '</span></td>' +
      '<td class="muted">' + esc(locationOf(r)) + '</td>' +
      '<td class="muted">' + esc(areaLabel(r)) + '</td>' +
      '<td class="muted">' + esc(dateOf(r)) + '</td>' +
      '<td><span class="pill ' + STATUS_PILL[r.status] + '">' + esc(t('mg.status.' + r.status)) + '</span></td>' +
    '</tr>';
  }).join('');

  body.querySelectorAll('tr').forEach(function (tr) {
    tr.addEventListener('click', function () { openDrawer(tr.dataset.ref); });
    tr.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDrawer(tr.dataset.ref); }
    });
  });
}

function emptyBlock(none) {
  return '<div class="empty">' +
    '<div class="empty-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg></div>' +
    '<h4>' + esc(t(none ? 'mg.empty.t' : 'mg.empty.filtered.t')) + '</h4>' +
    '<p>' + esc(t(none ? 'mg.empty.d' : 'mg.empty.filtered.d')) + '</p>' +
    (none ? '<button class="btn btn-ghost btn-sm" id="btnSeed" style="margin-top:20px">' + esc(t('mg.empty.seed')) + '</button>' : '') +
  '</div>';
}

/* ─── Detail drawer ─────────────────────────────────────────── */
var openRef = null;

function fieldRows(pairs) {
  return pairs.filter(function (p) { return p[1]; })
    .map(function (p) { return '<div><dt>' + esc(p[0]) + '</dt><dd>' + esc(p[1]) + '</dd></div>'; }).join('');
}

function openDrawer(ref) {
  var rec = readRecords().filter(function (r) { return r.ref === ref; })[0];
  if (!rec) return;
  openRef = ref;

  var d = rec.data || {};
  var drawer = document.getElementById('drawer');
  var when = new Date(rec.createdAt).toLocaleString(
    I18N.lang === 'zh' ? 'zh-Hans' : (I18N.lang === 'en' ? 'en-GB' : 'ms-MY'),
    { dateStyle: 'long', timeStyle: 'short' });

  var main = rec.track === 'community'
    ? fieldRows([
        [t('f.cat'),        d.category ? t('f.cat.' + d.category) : ''],
        [t('f.leadername'), d.leaderName], [t('f.leaderid'), d.leaderId],
        [t('f.phone'),      d.phone],      [t('f.email'), d.email],
        [t('f.income'),     d.income ? 'RM ' + d.income : ''],
        [t('f.division'),   d.division],   [t('f.district'), d.district],
        [t('f.parliament'), d.parliament], [t('f.dun'), d.dun],
        [t('f.landtype'),   d.landType ? t('f.landtype.' + d.landType) : ''],
        [t('f.lotno'),      d.lotNo],
        [t('f.area'),       d.landArea ? d.landArea + ' ' + (d.landUnit === 'ha' ? t('f.unit.ha') : t('f.unit.acre')) : ''],
        [t('f.purpose'),    d.purpose],
        [t('f.homeaddr'),   d.homeAddr],   [t('f.projaddr'), d.projAddr],
        [t('f.ownername'),  d.ownerName],  [t('f.ownerid'), d.ownerId]
      ])
    : fieldRows([
        [t('f.coname'),     d.coName],     [t('f.coreg'), d.coReg],
        [t('f.bumi'),       d.bumi ? t(d.bumi === 'bumiputera' ? 'f.bumi.b' : 'f.bumi.nb') : ''],
        [t('f.costatus'),   d.coStatus ? t('f.costatus.' + d.coStatus) : ''],
        [t('f.coaddr'),     d.coAddr],
        [t('f.cophone'),    d.coPhone],    [t('f.cofax'), d.coFax],
        [t('f.picname'),    d.picName],    [t('f.picpos'), d.picPos],
        [t('f.picunit'),    d.picUnit],
        [t('f.picmobile'),  d.picMobile],  [t('f.picemail'), d.picEmail],
        [t('f.division'),   d.division],   [t('f.district'), d.district],
        [t('f.subdistrict'),d.subDistrict],[t('f.titletype'), d.titleType],
        [t('f.sitestatus'), d.siteStatus ? (d.siteStatus === 'other' ? (d.siteOther || t('f.site.other')) : t('f.site.' + d.siteStatus)) : ''],
        [t('f.areaha'),     d.areaHa ? d.areaHa + ' ha' : ''],
        [t('f.soil'),       d.soil ? (d.soil === 'other' ? (d.soilOther || t('f.soil.other')) : t('f.soil.' + d.soil)) : '']
      ]);

  var files = (rec.files || []).length
    ? '<ul class="filelist">' + rec.files.map(function (f) {
        return '<li class="fileitem"><span class="fileitem-ico" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></span>' +
          '<div><div class="fileitem-name">' + esc(f.name) + '</div>' +
          '<div class="fileitem-meta"><span class="tagsug">' + esc(t(f.cls || 'mb.sug.other')) + '</span>' +
          '<span>' + esc(humanSize(f.size)) + '</span></div></div><span></span></li>';
      }).join('') + '</ul>'
    : '<p class="kpi-sub">' + esc(t('mg.d.nofiles')) + '</p>';

  var members = (rec.participants || []).length
    ? '<div class="ptable-wrap"><table class="ptable" style="min-width:420px"><thead><tr>' +
        '<th>' + esc(t('f.p.no')) + '</th><th>' + esc(t('f.p.name')) + '</th><th>' + esc(t('f.p.ic')) + '</th></tr></thead><tbody>' +
        rec.participants.map(function (p, i) {
          return '<tr><td class="rownum">' + (i + 1) + '</td><td style="padding:10px 12px">' + esc(p.name) +
                 '</td><td style="padding:10px 12px">' + esc(p.ic || '—') + '</td></tr>';
        }).join('') + '</tbody></table></div>'
    : '';

  var ticked = Object.keys(rec.checklist || {}).filter(function (k) { return rec.checklist[k]; });
  var checklist = ticked.length
    ? '<ul class="track-list" style="margin-top:0">' + ticked.map(function (k) {
        return '<li>' + esc(t(k)) + '</li>'; }).join('') + '</ul>'
    : '';

  drawer.innerHTML =
    '<div class="drawer-head">' +
      '<div><div class="side-track-tag">' + esc(rec.track === 'community' ? t('mg.trackA') : t('mg.trackB')) + '</div>' +
        '<h3 id="drawerTitle" style="margin-top:10px">' + esc(applicantOf(rec)) + '</h3>' +
        '<div class="ref" style="margin-top:4px;color:var(--canopy);font-weight:600">' + esc(rec.ref) + ' · ' + esc(rec.form || '') + '</div></div>' +
      '<button class="drawer-close" id="drawerClose" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
    '</div>' +

    '<div class="drawer-body">' +
      '<div class="review-group"><h5>' + esc(t('mg.d.submitted')) + '</h5><dl class="review-list">' +
        '<div><dt>' + esc(t('mg.d.submitted')) + '</dt><dd>' + esc(when) + '</dd></div>' +
        '<div><dt>' + esc(t('mg.c.status')) + '</dt><dd>' + esc(t('mg.status.' + rec.status)) + '</dd></div>' +
      '</dl></div>' +

      '<div class="review-group"><h5>' + esc(t('mg.d.title')) + '</h5><dl class="review-list">' + main + '</dl></div>' +

      (members ? '<div class="review-group"><h5>' + esc(t('mg.d.members')) + ' (' + rec.participants.length + ')</h5>' +
        '<div style="padding:12px">' + members + '</div></div>' : '') +

      '<div class="review-group"><h5>' + esc(t('mg.d.files')) + '</h5><div style="padding:14px">' + files + '</div></div>' +

      (checklist ? '<div class="review-group"><h5>' + esc(t('mg.d.checklist')) + '</h5>' +
        '<div style="padding:14px 18px">' + checklist + '</div></div>' : '') +

      (rec.signature ? '<div class="review-group"><h5>' + esc(t('mg.d.sign')) + '</h5>' +
        '<div style="padding:14px"><img src="' + esc(rec.signature) + '" alt="" style="max-height:110px;border:1px solid var(--line-soft);border-radius:10px;background:#fff" />' +
        '<div class="kpi-sub" style="margin-top:8px">' + esc(rec.signName || '') + '</div></div></div>' : '') +

      '<div class="field" style="margin-top:22px"><label for="drStatus">' + esc(t('mg.d.status')) + '</label>' +
        '<select class="input" id="drStatus">' + STATUSES.map(function (s) {
          return '<option value="' + s + '"' + (rec.status === s ? ' selected' : '') + '>' + esc(t('mg.status.' + s)) + '</option>';
        }).join('') + '</select></div>' +

      '<div class="field" style="margin-top:16px"><label for="drNotes">' + esc(t('mg.d.notes')) + '</label>' +
        '<textarea class="input" id="drNotes" placeholder="' + esc(t('mg.d.notesph')) + '">' + esc(rec.notes || '') + '</textarea></div>' +

      '<p class="kpi-sub" style="margin-top:20px">' + esc(t('mg.demo')) + '</p>' +
    '</div>' +

    '<div class="drawer-foot">' +
      '<button class="btn btn-sm" id="drPrint">' + esc(t('mg.d.print')) + '</button>' +
      '<span class="spacer" style="margin-left:auto"></span>' +
      '<button class="btn btn-sm btn-ghost" id="drDelete" style="color:var(--clay);border-color:rgba(166,92,72,.4)">' + esc(t('mg.d.delete')) + '</button>' +
    '</div>';

  document.getElementById('drawerScrim').classList.add('open');
  drawer.classList.add('open');
  drawer.focus();

  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  document.getElementById('drPrint').addEventListener('click', function () { window.print(); });

  document.getElementById('drStatus').addEventListener('change', function () {
    updateRecord(ref, { status: this.value });
  });
  var notes = document.getElementById('drNotes');
  var noteTimer = null;
  notes.addEventListener('input', function () {
    clearTimeout(noteTimer);
    noteTimer = setTimeout(function () { updateRecord(ref, { notes: notes.value }, true); }, 500);
  });

  document.getElementById('drDelete').addEventListener('click', function () {
    if (!window.confirm(t('mg.d.confirm'))) return;
    writeRecords(readRecords().filter(function (r) { return r.ref !== ref; }));
    closeDrawer();
    toast(t('mg.d.deleted'));
    refresh();
  });
}

function updateRecord(ref, patch, quiet) {
  var list = readRecords();
  for (var i = 0; i < list.length; i++) {
    if (list[i].ref === ref) { Object.assign(list[i], patch); break; }
  }
  writeRecords(list);
  if (!quiet) toast(t('mg.d.saved'));
  renderKpis();
  renderRows();
}

function closeDrawer() {
  openRef = null;
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawerScrim').classList.remove('open');
}

function humanSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

/* ─── CSV export ────────────────────────────────────────────── */
function csvCell(v) {
  var s = v === null || v === undefined ? '' : String(v);
  return '"' + s.replace(/"/g, '""').replace(/\r?\n/g, ' ') + '"';
}

function exportCsv() {
  var list = visibleRecords();
  if (!list.length) { toast(t('mg.noexport')); return; }

  var head = ['Reference','Route','Form','Status','Submitted','Applicant','Registration/IC',
              'Contact','Email','Division','District','Sub-district','Lot/Title','Land status',
              'Area (ha)','Soil','Purpose','Participants','Documents','Officer notes'];

  var rows = list.map(function (r) {
    var d = r.data || {};
    var community = r.track === 'community';
    return [
      r.ref, community ? 'Community' : 'Commercial', r.form || '', r.status, r.createdAt,
      applicantOf(r),
      community ? (d.leaderId || '') : (d.coReg || ''),
      community ? (d.phone || '') : (d.picMobile || d.coPhone || ''),
      community ? (d.email || '') : (d.picEmail || ''),
      d.division || '', d.district || '', d.subDistrict || '',
      d.lotNo || d.titleType || '',
      community ? (d.landType || '') : (d.siteStatus === 'other' ? (d.siteOther || 'other') : (d.siteStatus || '')),
      areaHaOf(r).toFixed(3),
      community ? '' : (d.soil === 'other' ? (d.soilOther || 'other') : (d.soil || '')),
      d.purpose || '',
      (r.participants || []).length,
      (r.files || []).map(function (f) { return f.name; }).join(' | '),
      r.notes || ''
    ].map(csvCell).join(',');
  });

  var csv = '﻿' + head.map(csvCell).join(',') + '\r\n' + rows.join('\r\n');
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'bamboo-sarawak-permohonan-' + new Date().toISOString().slice(0, 10) + '.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  toast(t('mg.exported'));
}

/* ─── Auth gate ─────────────────────────────────────────────── */
function unlock() {
  document.getElementById('gate').style.display = 'none';
  document.getElementById('dash').classList.add('on');
  refresh();
}

function refresh() { renderKpis(); renderRows(); }

/* ─── Boot ──────────────────────────────────────────────────── */
function boot() {
  var gateForm = document.getElementById('gateForm');
  var gatePass = document.getElementById('gatePass');
  var gateErr  = document.getElementById('err-gate');

  gateForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (gatePass.value === CFG.mgmtPass) {
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (err) {}
      unlock();
    } else {
      gateErr.classList.add('show');
      gatePass.classList.add('invalid');
      gatePass.value = '';
      gatePass.focus();
    }
  });
  gatePass.addEventListener('input', function () {
    gateErr.classList.remove('show');
    gatePass.classList.remove('invalid');
  });

  var already = false;
  try { already = sessionStorage.getItem(SESSION_KEY) === '1'; } catch (e) {}
  if (already) unlock();

  document.getElementById('btnLogout').addEventListener('click', function () {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
    window.location.reload();
  });
  document.getElementById('btnExport').addEventListener('click', exportCsv);

  /* filters */
  var search = document.getElementById('qSearch');
  var searchTimer = null;
  search.addEventListener('input', function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () { filters.q = search.value; renderRows(); }, 180);
  });

  document.querySelectorAll('#segTrack button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('#segTrack button').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      filters.track = b.dataset.track;
      renderRows();
    });
  });

  document.getElementById('qStatus').addEventListener('change', function () {
    filters.status = this.value; renderRows();
  });

  /* sorting */
  document.querySelectorAll('.dtable th[data-sort]').forEach(function (th) {
    th.addEventListener('click', function () {
      var key = th.dataset.sort;
      if (sortKey === key) { sortDir = -sortDir; }
      else { sortKey = key; sortDir = (key === 'createdAt' || key === 'area') ? -1 : 1; }
      document.querySelectorAll('.dtable th[data-sort]').forEach(function (x) {
        x.classList.remove('asc', 'desc');
      });
      th.classList.add(sortDir === 1 ? 'asc' : 'desc');
      renderRows();
    });
  });

  /* drawer dismissal */
  document.getElementById('drawerScrim').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openRef) closeDrawer();
  });

  I18N.onChange(function () {
    if (document.getElementById('dash').classList.contains('on')) {
      refresh();
      if (openRef) openDrawer(openRef);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else { boot(); }

})();
