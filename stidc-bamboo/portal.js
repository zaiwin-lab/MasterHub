/* ══════════════════════════════════════════════════════════════
   BAMBOO SARAWAK — application portal engine
   Two official tracks · four guided steps · draft recovery
   ══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var CFG   = window.BAMBOO_CONFIG;
var I18N  = window.BAMBOO_I18N;
var esc   = window.BAMBOO_UTIL.esc;
var toast = window.BAMBOO_TOAST;
var T     = window.BAMBOO_T;

/* ─── Form vocabulary (merged into the shared i18n tables) ──── */
var FT = {
ms: {
  'p.choose.eyebrow': 'Pilih Laluan', 'p.choose.title': 'Laluan mana yang menepati keadaan anda?',
  'p.choose.sub': 'Pilih satu untuk membuka borang. Anda boleh bertukar laluan bila-bila masa — draf setiap laluan disimpan berasingan.',
  'p.switch': 'Tukar laluan permohonan', 'p.resume': 'Draf anda dipulihkan dari sesi lepas.',
  'p.draftsaved': 'Draf disimpan automatik dalam pelayar ini',
  'p.back': 'Kembali', 'p.next': 'Seterusnya', 'p.submit': 'Hantar Permohonan',
  'p.stepof': 'Langkah {n} daripada 4', 'p.progress': '{n}% lengkap',
  'p.fixerrors': 'Sila lengkapkan medan bertanda merah sebelum meneruskan.',
  'p.required': 'Medan ini wajib diisi.', 'p.email': 'Alamat emel tidak sah.',
  'p.tel': 'Nombor telefon tidak sah.', 'p.num': 'Sila masukkan nombor yang sah.',
  'p.ic': 'Nombor kad pengenalan tidak sah.',
  'p.min10': 'Sekurang-kurangnya 10 peserta diperlukan.',
  'p.needsign': 'Tandatangan elektronik diperlukan.',
  'p.needagree': 'Anda perlu menerima perakuan pemohon.',

  'st.a1': 'Kategori & Lokasi', 'st.a1d': 'Jenis projek dan kawasan',
  'st.a2': 'Tanah & Tujuan',    'st.a2d': 'Status tanah dan penanaman',
  'st.a3': 'Ketua & Ahli',      'st.a3d': 'Peserta projek',
  'st.a4': 'Dokumen & Perakuan','st.a4d': 'Semak dan hantar',
  'st.b1': 'Maklumat Pemohon',  'st.b1d': 'Syarikat atau koperasi',
  'st.b2': 'Pegawai Perhubungan','st.b2d': 'Orang untuk dihubungi',
  'st.b3': 'Maklumat Projek',   'st.b3d': 'Tapak dan tanah',
  'st.b4': 'Dokumen & Perakuan','st.b4d': 'Semak dan hantar',

  'h.a1': 'Kategori projek dan kawasan', 'h.a1d': 'Setiap kategori memerlukan minimum sepuluh peserta.',
  'h.a2': 'Tanah dan tujuan penanaman',  'h.a2d': 'Nyatakan status tanah dan apa yang anda rancang tanam.',
  'h.a3': 'Ketua projek dan ahli',       'h.a3d': 'Ketua projek menjadi orang perhubungan utama dengan PUSAKA.',
  'h.a4': 'Dokumen, semakan dan perakuan','h.a4d': 'Muat naik dokumen sokongan, semak ringkasan, kemudian tandatangan.',
  'h.b1': 'Maklumat syarikat atau koperasi', 'h.b1d': 'Seperti yang tercatat dalam pendaftaran rasmi.',
  'h.b2': 'Pegawai perhubungan',         'h.b2d': 'Orang yang akan dihubungi PUSAKA berkenaan permohonan ini.',
  'h.b3': 'Maklumat tapak projek',       'h.b3d': 'Lokasi, status tanah dan keluasan ladang yang dicadangkan.',
  'h.b4': 'Dokumen, semakan dan perakuan','h.b4d': 'Tandakan senarai semak, muat naik dokumen, kemudian tandatangan.',

  'g.category': 'Kategori projek', 'g.location': 'Lokasi', 'g.land': 'Maklumat tanah',
  'g.consent': 'Kebenaran guna tanah', 'g.leader': 'Ketua projek', 'g.members': 'Ahli projek',
  'g.company': 'Syarikat / koperasi', 'g.pic': 'Pegawai perhubungan', 'g.site': 'Tapak projek',
  'g.checklist': 'Senarai semak dokumen', 'g.upload': 'Kotak Dokumen', 'g.review': 'Ringkasan permohonan',
  'g.declare': 'Perakuan pemohon',

  'f.cat': 'Kategori projek', 'f.cat.community': 'Komuniti', 'f.cat.school': 'Sekolah', 'f.cat.institution': 'Institusi',
  'f.cat.community.d': 'Kumpulan kampung atau penduduk', 'f.cat.school.d': 'Sekolah rendah atau menengah', 'f.cat.institution.d': 'Institusi awam atau pendidikan',
  'f.state': 'Negeri', 'f.division': 'Bahagian', 'f.district': 'Daerah', 'f.subdistrict': 'Sub Daerah',
  'f.parliament': 'Parlimen', 'f.dun': 'DUN',
  'f.landtype': 'Jenis tanah', 'f.landtype.own': 'Milik sendiri', 'f.landtype.rent': 'Sewaan', 'f.landtype.lease': 'Pajakan',
  'f.lotno': 'Nombor lot / geran tanah', 'f.area': 'Keluasan tanah', 'f.areaunit': 'Unit',
  'f.unit.acre': 'Ekar', 'f.unit.ha': 'Hektar',
  'f.purpose': 'Tujuan penanaman', 'f.purpose.ph': 'Contoh: bekalan buluh untuk kraf tangan dan bahan binaan kampung',
  'f.ownername': 'Nama pemilik tanah', 'f.ownerid': 'No. kad pengenalan / cop pemilik',
  'f.leadername': 'Nama ketua projek', 'f.leaderid': 'No. kad pengenalan',
  'f.homeaddr': 'Alamat rumah', 'f.projaddr': 'Alamat projek',
  'f.phone': 'No. telefon', 'f.email': 'Alamat emel', 'f.income': 'Pendapatan isi rumah (RM/bulan)',
  'f.p.no': 'Bil', 'f.p.name': 'Nama penuh', 'f.p.ic': 'No. kad pengenalan', 'f.p.phone': 'No. telefon', 'f.p.income': 'Pendapatan (RM/bln)',
  'f.p.add': 'Tambah peserta', 'f.p.count': '{n} daripada 10 peserta minimum', 'f.p.ok': '{n} peserta — memenuhi syarat minimum',
  'f.p.note': 'Salinan kad pengenalan semua ahli projek perlu dimuat naik pada langkah seterusnya.',
  'f.coname': 'Nama syarikat / koperasi', 'f.coreg': 'No. pendaftaran syarikat / koperasi',
  'f.bumi': 'Taraf syarikat / koperasi', 'f.bumi.b': 'Bumiputera', 'f.bumi.nb': 'Bukan Bumiputera',
  'f.costatus': 'Status syarikat / koperasi', 'f.costatus.local': 'Tempatan', 'f.costatus.public': 'Awam',
  'f.coaddr': 'Alamat syarikat / koperasi', 'f.cophone': 'No. telefon syarikat', 'f.cofax': 'No. faksimili',
  'f.picname': 'Nama pegawai perhubungan', 'f.picpos': 'Jawatan', 'f.picunit': 'Bahagian / Seksyen / Unit',
  'f.picmobile': 'No. telefon bimbit', 'f.picemail': 'Alamat emel',
  'f.titletype': 'Jenis / No. geran', 'f.sitestatus': 'Status tapak projek',
  'f.site.rent': 'Sewa', 'f.site.lease': 'Pajakan', 'f.site.own': 'Milik sendiri', 'f.site.other': 'Lain-lain',
  'f.siteother': 'Nyatakan status tapak', 'f.areaha': 'Keluasan tapak projek (hektar)',
  'f.soil': 'Jenis tanah', 'f.soil.mineral': 'Mineral', 'f.soil.peat': 'Gambut',
  'f.soil.kerangas': 'Kerangas atau berpasir', 'f.soil.swamp': 'Paya', 'f.soil.other': 'Lain-lain',
  'f.soilother': 'Nyatakan jenis tanah',
  'f.optional': 'pilihan',

  'mb.title': 'Lepaskan dokumen anda di sini',
  'mb.sub': 'Seret dan lepas fail, atau klik untuk memilih dari peranti anda.',
  'mb.limits': 'PDF, JPG, PNG atau DOCX · maksimum 10 MB setiap fail',
  'mb.added': '{n} dokumen dilampirkan', 'mb.remove': 'Buang fail',
  'mb.toobig': 'Fail melebihi had 10 MB dan tidak dilampirkan: {name}',
  'mb.badtype': 'Jenis fail ini tidak disokong: {name}',
  'mb.honest': 'Cadangan jenis dokumen dibuat daripada nama fail sahaja — bukan pembacaan kandungan. Sila sahkan sebelum menghantar.',
  'mb.sug.ic': 'Kad pengenalan', 'mb.sug.land': 'Dokumen tanah', 'mb.sug.map': 'Peta kawasan',
  'mb.sug.company': 'Dokumen syarikat', 'mb.sug.eia': 'Laporan EIA', 'mb.sug.fmp': 'Laporan FMP',
  'mb.sug.proposal': 'Kertas kerja', 'mb.sug.form': 'Borang', 'mb.sug.other': 'Belum dikelaskan',
  'mb.classify': 'Jenis dokumen',

  'cl.a1': 'Salinan kad pengenalan semua ahli projek', 'cl.a1d': 'Termasuk ketua projek',
  'cl.a2': 'Dokumen tanah (geran / perjanjian)', 'cl.a2d': 'Bukti pemilikan, pajakan atau sewaan',
  'cl.a3': 'Kebenaran guna tanah bertulis', 'cl.a3d': 'Hanya jika tanah bukan milik sendiri',
  'cl.b1': 'Borang permohonan', 'cl.b2': 'Profil syarikat / koperasi',
  'cl.b3': 'Salinan Borang 9, 24 dan 49', 'cl.b3d': 'Bagi syarikat yang memohon',
  'cl.b4': 'M&A / enakmen / perlembagaan koperasi',
  'cl.b5': 'Kertas kerja cadangan projek', 'cl.b5d': 'Jika berkaitan',
  'cl.b6': 'Salinan dokumen status tanah', 'cl.b6d': 'Geran atau perjanjian pajakan',
  'cl.b7': 'Laporan Environmental Impact Assessment (EIA)', 'cl.b7d': 'Bagi tapak projek di kawasan LPF',
  'cl.b8': 'Laporan Forest Management Plan (FMP)', 'cl.b8d': 'Bagi tapak projek di kawasan LPF',
  'cl.b9': 'Peta kawasan', 'cl.b9d': 'Topografi, pelan berskala atau pelan survey',

  'dec.a': 'Saya mengaku bahawa maklumat yang diberi di atas adalah benar. Segala bantuan yang diluluskan akan saya gunakan sepenuhnya untuk menjayakan projek ini. Saya juga akan mematuhi syarat-syarat yang ditetapkan oleh PUSAKA. Sekiranya saya didapati memberikan maklumat tidak benar atau palsu, PUSAKA berhak membatalkan permohonan ini.',
  'dec.b1': 'Segala maklumat, keterangan dan butiran yang diberikan di dalam permohonan ini adalah sahih dan benar.',
  'dec.b2': 'Saya dan syarikat / koperasi ini tidak bankrap atau muflis.',
  'dec.b3': 'Akan mematuhi semua terma dan syarat bagi permohonan ini sepertimana yang ditetapkan oleh PUSAKA.',
  'dec.b4': 'PUSAKA berhak membatalkan permohonan ini sekiranya terdapat sebarang ketidakpatuhan atau maklumat tidak benar / palsu.',
  'dec.agree': 'Saya membaca dan menerima perakuan di atas.',
  'sig.label': 'Tandatangan elektronik', 'sig.hint': 'Lukis tandatangan anda menggunakan tetikus atau jari.',
  'sig.clear': 'Padam', 'sig.name': 'Nama seperti dalam kad pengenalan', 'sig.date': 'Tarikh',

  'sub.sending': 'Menghantar permohonan anda…', 'sub.wait': 'Sila jangan tutup tetingkap ini.',
  'sub.done': 'Permohonan anda telah diterima', 'sub.doned': 'Simpan nombor rujukan di bawah. Pegawai PUSAKA akan menyemak permohonan anda dan menghubungi anda.',
  'sub.ref': 'Nombor rujukan', 'sub.track': 'Laluan', 'sub.when': 'Tarikh dihantar', 'sub.applicant': 'Pemohon',
  'sub.print': 'Cetak resit', 'sub.new': 'Hantar permohonan lain',
  'sub.note': 'Ini bukan surat kelulusan. Permohonan anda akan disemak oleh PUSAKA, dan naziran tapak mungkin dijalankan sebelum sebarang keputusan dibuat.',
  'sub.err': 'Permohonan tidak dapat disimpan pada peranti ini. Cuba lagi, atau hubungi pejabat PUSAKA.',
  'sub.retry': 'Cuba lagi'
},

en: {
  'p.choose.eyebrow': 'Choose a Route', 'p.choose.title': 'Which route matches your situation?',
  'p.choose.sub': 'Pick one to open its form. You can switch at any time — each route keeps its own draft.',
  'p.switch': 'Switch application route', 'p.resume': 'Your draft from a previous session has been restored.',
  'p.draftsaved': 'Draft saved automatically in this browser',
  'p.back': 'Back', 'p.next': 'Continue', 'p.submit': 'Submit Application',
  'p.stepof': 'Step {n} of 4', 'p.progress': '{n}% complete',
  'p.fixerrors': 'Please complete the fields marked in red before continuing.',
  'p.required': 'This field is required.', 'p.email': 'That email address is not valid.',
  'p.tel': 'That phone number is not valid.', 'p.num': 'Please enter a valid number.',
  'p.ic': 'That identity card number is not valid.',
  'p.min10': 'At least 10 participants are required.',
  'p.needsign': 'An electronic signature is required.',
  'p.needagree': 'You need to accept the applicant declaration.',

  'st.a1': 'Category & Location', 'st.a1d': 'Project type and area',
  'st.a2': 'Land & Purpose',      'st.a2d': 'Land status and planting',
  'st.a3': 'Leader & Members',    'st.a3d': 'Project participants',
  'st.a4': 'Documents & Declaration', 'st.a4d': 'Review and submit',
  'st.b1': 'Applicant Details',   'st.b1d': 'Company or cooperative',
  'st.b2': 'Contact Officer',     'st.b2d': 'Person to contact',
  'st.b3': 'Project Details',     'st.b3d': 'Site and land',
  'st.b4': 'Documents & Declaration', 'st.b4d': 'Review and submit',

  'h.a1': 'Project category and area', 'h.a1d': 'Each category needs a minimum of ten participants.',
  'h.a2': 'Land and planting purpose',  'h.a2d': 'Tell us the land status and what you plan to plant.',
  'h.a3': 'Project leader and members', 'h.a3d': 'The project leader becomes the main contact with PUSAKA.',
  'h.a4': 'Documents, review and declaration', 'h.a4d': 'Upload supporting documents, check the summary, then sign.',
  'h.b1': 'Company or cooperative details', 'h.b1d': 'As recorded in your official registration.',
  'h.b2': 'Contact officer',           'h.b2d': 'The person PUSAKA will contact about this application.',
  'h.b3': 'Project site details',       'h.b3d': 'Location, land status and proposed plantation area.',
  'h.b4': 'Documents, review and declaration', 'h.b4d': 'Tick the checklist, upload documents, then sign.',

  'g.category': 'Project category', 'g.location': 'Location', 'g.land': 'Land details',
  'g.consent': 'Land-use consent', 'g.leader': 'Project leader', 'g.members': 'Project members',
  'g.company': 'Company / cooperative', 'g.pic': 'Contact officer', 'g.site': 'Project site',
  'g.checklist': 'Document checklist', 'g.upload': 'Document Box', 'g.review': 'Application summary',
  'g.declare': 'Applicant declaration',

  'f.cat': 'Project category', 'f.cat.community': 'Community', 'f.cat.school': 'School', 'f.cat.institution': 'Institution',
  'f.cat.community.d': 'Village or residents’ group', 'f.cat.school.d': 'Primary or secondary school', 'f.cat.institution.d': 'Public or educational institution',
  'f.state': 'State', 'f.division': 'Division', 'f.district': 'District', 'f.subdistrict': 'Sub-district',
  'f.parliament': 'Parliamentary seat', 'f.dun': 'State seat (DUN)',
  'f.landtype': 'Land type', 'f.landtype.own': 'Owned', 'f.landtype.rent': 'Rented', 'f.landtype.lease': 'Leased',
  'f.lotno': 'Lot number / land title', 'f.area': 'Land area', 'f.areaunit': 'Unit',
  'f.unit.acre': 'Acres', 'f.unit.ha': 'Hectares',
  'f.purpose': 'Planting purpose', 'f.purpose.ph': 'For example: bamboo supply for handicraft and village construction material',
  'f.ownername': 'Landowner’s name', 'f.ownerid': 'Owner’s IC number / stamp',
  'f.leadername': 'Project leader’s name', 'f.leaderid': 'Identity card number',
  'f.homeaddr': 'Home address', 'f.projaddr': 'Project address',
  'f.phone': 'Phone number', 'f.email': 'Email address', 'f.income': 'Household income (RM/month)',
  'f.p.no': 'No', 'f.p.name': 'Full name', 'f.p.ic': 'Identity card number', 'f.p.phone': 'Phone number', 'f.p.income': 'Income (RM/mth)',
  'f.p.add': 'Add participant', 'f.p.count': '{n} of the 10 participant minimum', 'f.p.ok': '{n} participants — minimum met',
  'f.p.note': 'Identity card copies for all project members must be uploaded in the next step.',
  'f.coname': 'Company / cooperative name', 'f.coreg': 'Company / cooperative registration number',
  'f.bumi': 'Company / cooperative standing', 'f.bumi.b': 'Bumiputera', 'f.bumi.nb': 'Non-Bumiputera',
  'f.costatus': 'Company / cooperative status', 'f.costatus.local': 'Local', 'f.costatus.public': 'Public',
  'f.coaddr': 'Company / cooperative address', 'f.cophone': 'Company phone number', 'f.cofax': 'Fax number',
  'f.picname': 'Contact officer’s name', 'f.picpos': 'Position', 'f.picunit': 'Division / Section / Unit',
  'f.picmobile': 'Mobile number', 'f.picemail': 'Email address',
  'f.titletype': 'Title type / number', 'f.sitestatus': 'Project site status',
  'f.site.rent': 'Rented', 'f.site.lease': 'Leased', 'f.site.own': 'Owned', 'f.site.other': 'Other',
  'f.siteother': 'Specify site status', 'f.areaha': 'Project site area (hectares)',
  'f.soil': 'Soil type', 'f.soil.mineral': 'Mineral', 'f.soil.peat': 'Peat',
  'f.soil.kerangas': 'Kerangas or sandy', 'f.soil.swamp': 'Swamp', 'f.soil.other': 'Other',
  'f.soilother': 'Specify soil type',
  'f.optional': 'optional',

  'mb.title': 'Drop your documents here',
  'mb.sub': 'Drag and drop files, or click to choose them from your device.',
  'mb.limits': 'PDF, JPG, PNG or DOCX · maximum 10 MB per file',
  'mb.added': '{n} documents attached', 'mb.remove': 'Remove file',
  'mb.toobig': 'This file exceeds the 10 MB limit and was not attached: {name}',
  'mb.badtype': 'This file type is not supported: {name}',
  'mb.honest': 'Document type is suggested from the filename only — the contents are not read. Please confirm each one before submitting.',
  'mb.sug.ic': 'Identity card', 'mb.sug.land': 'Land document', 'mb.sug.map': 'Area map',
  'mb.sug.company': 'Company document', 'mb.sug.eia': 'EIA report', 'mb.sug.fmp': 'FMP report',
  'mb.sug.proposal': 'Project proposal', 'mb.sug.form': 'Form', 'mb.sug.other': 'Not yet classified',
  'mb.classify': 'Document type',

  'cl.a1': 'Identity card copies for all project members', 'cl.a1d': 'Including the project leader',
  'cl.a2': 'Land documents (title / agreement)', 'cl.a2d': 'Proof of ownership, lease or rental',
  'cl.a3': 'Written land-use consent', 'cl.a3d': 'Only if the land is not your own',
  'cl.b1': 'Application form', 'cl.b2': 'Company / cooperative profile',
  'cl.b3': 'Copies of Forms 9, 24 and 49', 'cl.b3d': 'For applying companies',
  'cl.b4': 'M&A / enactment / cooperative constitution',
  'cl.b5': 'Project proposal paper', 'cl.b5d': 'Where applicable',
  'cl.b6': 'Copy of land status documents', 'cl.b6d': 'Title or lease agreement',
  'cl.b7': 'Environmental Impact Assessment (EIA) report', 'cl.b7d': 'For project sites in LPF areas',
  'cl.b8': 'Forest Management Plan (FMP) report', 'cl.b8d': 'For project sites in LPF areas',
  'cl.b9': 'Area map', 'cl.b9d': 'Topographic, scaled plan or survey plan',

  'dec.a': 'I declare that the information given above is true. Any assistance approved will be used fully to carry out this project. I will also comply with the conditions set by PUSAKA. Should I be found to have given untrue or false information, PUSAKA reserves the right to cancel this application.',
  'dec.b1': 'All information, particulars and details given in this application are valid and true.',
  'dec.b2': 'Neither I nor this company / cooperative is bankrupt or insolvent.',
  'dec.b3': 'I will comply with all terms and conditions for this application as set by PUSAKA.',
  'dec.b4': 'PUSAKA reserves the right to cancel this application should there be any non-compliance or untrue / false information.',
  'dec.agree': 'I have read and accept the declaration above.',
  'sig.label': 'Electronic signature', 'sig.hint': 'Draw your signature using a mouse or your finger.',
  'sig.clear': 'Clear', 'sig.name': 'Name as shown on identity card', 'sig.date': 'Date',

  'sub.sending': 'Submitting your application…', 'sub.wait': 'Please do not close this window.',
  'sub.done': 'Your application has been received', 'sub.doned': 'Keep the reference number below. PUSAKA officers will review your application and contact you.',
  'sub.ref': 'Reference number', 'sub.track': 'Route', 'sub.when': 'Submitted on', 'sub.applicant': 'Applicant',
  'sub.print': 'Print receipt', 'sub.new': 'Submit another application',
  'sub.note': 'This is not an approval letter. Your application will be reviewed by PUSAKA, and a site inspection may be carried out before any decision is made.',
  'sub.err': 'The application could not be saved on this device. Please try again, or contact a PUSAKA office.',
  'sub.retry': 'Try again'
},

zh: {
  'p.choose.eyebrow': '选择途径', 'p.choose.title': '哪一条途径符合你的情况？',
  'p.choose.sub': '选一项以开启表格。你可随时切换——每条途径各自保存草稿。',
  'p.switch': '切换申请途径', 'p.resume': '已恢复你上次的草稿。',
  'p.draftsaved': '草稿已自动保存在此浏览器',
  'p.back': '返回', 'p.next': '继续', 'p.submit': '提交申请',
  'p.stepof': '第 {n} 步，共 4 步', 'p.progress': '完成 {n}%',
  'p.fixerrors': '请先填妥标红的栏位再继续。',
  'p.required': '此栏位为必填。', 'p.email': '电邮地址无效。',
  'p.tel': '电话号码无效。', 'p.num': '请输入有效的数字。',
  'p.ic': '身份证号码无效。',
  'p.min10': '至少需要 10 名参与者。',
  'p.needsign': '需要电子签名。',
  'p.needagree': '你必须接受申请人声明。',

  'st.a1': '类别与地点', 'st.a1d': '计划类型与地区',
  'st.a2': '土地与用途',  'st.a2d': '土地状态与种植',
  'st.a3': '领队与成员',  'st.a3d': '计划参与者',
  'st.a4': '文件与声明',  'st.a4d': '核对并提交',
  'st.b1': '申请人资料',  'st.b1d': '公司或合作社',
  'st.b2': '联络官',      'st.b2d': '联络人',
  'st.b3': '计划资料',    'st.b3d': '地点与土地',
  'st.b4': '文件与声明',  'st.b4d': '核对并提交',

  'h.a1': '计划类别与地区', 'h.a1d': '每个类别最少需要十名参与者。',
  'h.a2': '土地与种植用途', 'h.a2d': '请说明土地状态与你打算种植的内容。',
  'h.a3': '计划领队与成员', 'h.a3d': '计划领队将成为与 PUSAKA 的主要联络人。',
  'h.a4': '文件、核对与声明', 'h.a4d': '上传佐证文件，核对摘要，然后签名。',
  'h.b1': '公司或合作社资料', 'h.b1d': '须与官方注册记录一致。',
  'h.b2': '联络官',          'h.b2d': 'PUSAKA 就此申请将联络的人。',
  'h.b3': '计划地点资料',    'h.b3d': '地点、土地状态与建议种植面积。',
  'h.b4': '文件、核对与声明', 'h.b4d': '勾选清单、上传文件，然后签名。',

  'g.category': '计划类别', 'g.location': '地点', 'g.land': '土地资料',
  'g.consent': '土地使用同意', 'g.leader': '计划领队', 'g.members': '计划成员',
  'g.company': '公司／合作社', 'g.pic': '联络官', 'g.site': '计划地点',
  'g.checklist': '文件清单', 'g.upload': '文件箱', 'g.review': '申请摘要',
  'g.declare': '申请人声明',

  'f.cat': '计划类别', 'f.cat.community': '社区', 'f.cat.school': '学校', 'f.cat.institution': '机构',
  'f.cat.community.d': '乡村或居民团体', 'f.cat.school.d': '小学或中学', 'f.cat.institution.d': '公共或教育机构',
  'f.state': '州属', 'f.division': '省', 'f.district': '县', 'f.subdistrict': '副县',
  'f.parliament': '国会选区', 'f.dun': '州选区（DUN）',
  'f.landtype': '土地类型', 'f.landtype.own': '自有', 'f.landtype.rent': '租用', 'f.landtype.lease': '租赁',
  'f.lotno': '地段号码／地契', 'f.area': '土地面积', 'f.areaunit': '单位',
  'f.unit.acre': '英亩', 'f.unit.ha': '公顷',
  'f.purpose': '种植用途', 'f.purpose.ph': '例如：为手工艺与乡村建材提供竹子来源',
  'f.ownername': '地主姓名', 'f.ownerid': '地主身份证号码／印章',
  'f.leadername': '计划领队姓名', 'f.leaderid': '身份证号码',
  'f.homeaddr': '住家地址', 'f.projaddr': '计划地址',
  'f.phone': '电话号码', 'f.email': '电邮地址', 'f.income': '家庭收入（令吉／月）',
  'f.p.no': '编号', 'f.p.name': '全名', 'f.p.ic': '身份证号码', 'f.p.phone': '电话号码', 'f.p.income': '收入（令吉／月）',
  'f.p.add': '增加参与者', 'f.p.count': '已填 {n} 名，最少 10 名', 'f.p.ok': '{n} 名参与者——已达最低要求',
  'f.p.note': '所有计划成员的身份证副本须在下一步上传。',
  'f.coname': '公司／合作社名称', 'f.coreg': '公司／合作社注册号码',
  'f.bumi': '公司／合作社身份', 'f.bumi.b': '土著', 'f.bumi.nb': '非土著',
  'f.costatus': '公司／合作社状态', 'f.costatus.local': '本地', 'f.costatus.public': '公共',
  'f.coaddr': '公司／合作社地址', 'f.cophone': '公司电话号码', 'f.cofax': '传真号码',
  'f.picname': '联络官姓名', 'f.picpos': '职位', 'f.picunit': '部门／组别／单位',
  'f.picmobile': '手机号码', 'f.picemail': '电邮地址',
  'f.titletype': '地契类型／号码', 'f.sitestatus': '计划地点状态',
  'f.site.rent': '租用', 'f.site.lease': '租赁', 'f.site.own': '自有', 'f.site.other': '其他',
  'f.siteother': '请注明地点状态', 'f.areaha': '计划地点面积（公顷）',
  'f.soil': '土壤类型', 'f.soil.mineral': '矿质土', 'f.soil.peat': '泥炭土',
  'f.soil.kerangas': 'Kerangas 或沙质土', 'f.soil.swamp': '沼泽', 'f.soil.other': '其他',
  'f.soilother': '请注明土壤类型',
  'f.optional': '选填',

  'mb.title': '把文件拖放到这里',
  'mb.sub': '拖放档案，或点击从你的设备中选择。',
  'mb.limits': 'PDF、JPG、PNG 或 DOCX · 每个档案最大 10 MB',
  'mb.added': '已附上 {n} 份文件', 'mb.remove': '移除档案',
  'mb.toobig': '此档案超过 10 MB 上限，未被附上：{name}',
  'mb.badtype': '不支持此档案类型：{name}',
  'mb.honest': '文件类型仅依档名推测——系统并未读取内容。提交前请逐一确认。',
  'mb.sug.ic': '身份证', 'mb.sug.land': '土地文件', 'mb.sug.map': '地段地图',
  'mb.sug.company': '公司文件', 'mb.sug.eia': 'EIA 报告', 'mb.sug.fmp': 'FMP 报告',
  'mb.sug.proposal': '计划书', 'mb.sug.form': '表格', 'mb.sug.other': '尚未分类',
  'mb.classify': '文件类型',

  'cl.a1': '所有计划成员的身份证副本', 'cl.a1d': '包括计划领队',
  'cl.a2': '土地文件（地契／协议）', 'cl.a2d': '拥有权、租赁或承租的证明',
  'cl.a3': '书面土地使用同意书', 'cl.a3d': '仅在土地非自有时需要',
  'cl.b1': '申请表格', 'cl.b2': '公司／合作社简介',
  'cl.b3': '表格 9、24 与 49 的副本', 'cl.b3d': '适用于申请的公司',
  'cl.b4': '公司章程／法令／合作社章程',
  'cl.b5': '计划建议书', 'cl.b5d': '如适用',
  'cl.b6': '土地状态文件副本', 'cl.b6d': '地契或租赁协议',
  'cl.b7': '环境影响评估（EIA）报告', 'cl.b7d': '适用于 LPF 范围内的地段',
  'cl.b8': '森林管理计划（FMP）报告', 'cl.b8d': '适用于 LPF 范围内的地段',
  'cl.b9': '地段地图', 'cl.b9d': '地形图、比例图或测量图',

  'dec.a': '本人声明以上所提供的资料属实。所获批准的一切援助，本人将全数用于完成此计划。本人亦将遵守 PUSAKA 所订定的条件。倘若本人被发现提供不实或虚假资料，PUSAKA 有权取消本申请。',
  'dec.b1': '本申请中所提供的一切资料、说明与细节均属有效且真实。',
  'dec.b2': '本人及本公司／合作社并未破产或资不抵债。',
  'dec.b3': '将遵守 PUSAKA 就本申请所订定的一切条款与条件。',
  'dec.b4': '倘有任何不遵守或不实／虚假资料，PUSAKA 有权取消本申请。',
  'dec.agree': '本人已阅读并接受以上声明。',
  'sig.label': '电子签名', 'sig.hint': '用鼠标或手指签下你的名字。',
  'sig.clear': '清除', 'sig.name': '身份证上的姓名', 'sig.date': '日期',

  'sub.sending': '正在提交你的申请…', 'sub.wait': '请勿关闭此视窗。',
  'sub.done': '已收到你的申请', 'sub.doned': '请保存下方的参考编号。PUSAKA 官员将审核你的申请并与你联系。',
  'sub.ref': '参考编号', 'sub.track': '途径', 'sub.when': '提交日期', 'sub.applicant': '申请人',
  'sub.print': '打印收据', 'sub.new': '提交另一份申请',
  'sub.note': '这并非批准信。你的申请将由 PUSAKA 审核，作出任何决定前或会进行实地考察。',
  'sub.err': '申请无法保存在此设备上。请再试一次，或联络 PUSAKA 办事处。',
  'sub.retry': '再试一次'
},

ib: {
  'p.choose.eyebrow': 'Pilih Jalai', 'p.choose.title': 'Jalai ni ke ngena penatai nuan?',
  'p.choose.sub': 'Pilih siti ngambi muka borang. Nuan ulih tukar bila-bila — tiap-tiap jalai bisi draf empu.',
  'p.switch': 'Tukar jalai peminta', 'p.resume': 'Draf nuan ari sesi ti lalu udah dipulaika.',
  'p.draftsaved': 'Draf disimpan empu dalam pelayar tu',
  'p.back': 'Pulai', 'p.next': 'Terus', 'p.submit': 'Kirim Peminta',
  'p.stepof': 'Tikas {n} ari 4', 'p.progress': '{n}% udah',
  'p.fixerrors': 'Tulung penuhka ruang ke bertanda mirah sebedau nerus.',
  'p.required': 'Ruang tu ibuh diisi.', 'p.email': 'Alamat emel enda betul.',
  'p.tel': 'Nombor telefon enda betul.', 'p.num': 'Tulung tulis nombor ke betul.',
  'p.ic': 'Nombor kad pengenal enda betul.',
  'p.min10': 'Sekurang-kurang 10 iku peserta ibuh.',
  'p.needsign': 'Tanda jari elektronik ibuh.',
  'p.needagree': 'Nuan ibuh nerima perakuan peminta.',

  'st.a1': 'Kategori & Endur', 'st.a1d': 'Jenis projek enggau kawasan',
  'st.a2': 'Tanah & Tuju',     'st.a2d': 'Status tanah enggau tanam',
  'st.a3': 'Tuai & Ahli',      'st.a3d': 'Peserta projek',
  'st.a4': 'Surat & Perakuan', 'st.a4d': 'Peda lalu kirim',
  'st.b1': 'Berita Peminta',   'st.b1d': 'Kompeni tauka koperasi',
  'st.b2': 'Pegawai Betemu',   'st.b2d': 'Orang ke ditemu',
  'st.b3': 'Berita Projek',    'st.b3d': 'Tapak enggau tanah',
  'st.b4': 'Surat & Perakuan', 'st.b4d': 'Peda lalu kirim',

  'h.a1': 'Kategori projek enggau kawasan', 'h.a1d': 'Tiap-tiap kategori ibuh sekurang-kurang sepuluh iku peserta.',
  'h.a2': 'Tanah enggau tuju nanam', 'h.a2d': 'Padah status tanah enggau utai ke deka ditanam nuan.',
  'h.a3': 'Tuai projek enggau ahli', 'h.a3d': 'Tuai projek nyadi orang ke betemu enggau PUSAKA.',
  'h.a4': 'Surat, peda baru enggau perakuan', 'h.a4d': 'Muat naik surat sukung, peda ringkas, udah nya andal.',
  'h.b1': 'Berita kompeni tauka koperasi', 'h.b1d': 'Baka ke ditulis dalam daftar resmi.',
  'h.b2': 'Pegawai betemu', 'h.b2d': 'Orang ke deka ditemu PUSAKA pasal peminta tu.',
  'h.b3': 'Berita tapak projek', 'h.b3d': 'Endur, status tanah enggau luas ladang ke dipadah.',
  'h.b4': 'Surat, peda baru enggau perakuan', 'h.b4d': 'Tanda senarai, muat naik surat, udah nya andal.',

  'g.category': 'Kategori projek', 'g.location': 'Endur', 'g.land': 'Berita tanah',
  'g.consent': 'Izin ngena tanah', 'g.leader': 'Tuai projek', 'g.members': 'Ahli projek',
  'g.company': 'Kompeni / koperasi', 'g.pic': 'Pegawai betemu', 'g.site': 'Tapak projek',
  'g.checklist': 'Senarai semak surat', 'g.upload': 'Peti Surat', 'g.review': 'Ringkas peminta',
  'g.declare': 'Perakuan peminta',

  'f.cat': 'Kategori projek', 'f.cat.community': 'Komuniti', 'f.cat.school': 'Sekula', 'f.cat.institution': 'Institusi',
  'f.cat.community.d': 'Kumpulan rumah panjai tauka orang menua', 'f.cat.school.d': 'Sekula rendah tauka menengah', 'f.cat.institution.d': 'Institusi perintah tauka pelajar',
  'f.state': 'Menua', 'f.division': 'Bahagi', 'f.district': 'Daerah', 'f.subdistrict': 'Sub Daerah',
  'f.parliament': 'Parlimen', 'f.dun': 'DUN',
  'f.landtype': 'Jenis tanah', 'f.landtype.own': 'Empu diri', 'f.landtype.rent': 'Sewa', 'f.landtype.lease': 'Pajak',
  'f.lotno': 'Nombor lot / geran tanah', 'f.area': 'Luas tanah', 'f.areaunit': 'Unit',
  'f.unit.acre': 'Ekar', 'f.unit.ha': 'Hektar',
  'f.purpose': 'Tuju nanam', 'f.purpose.ph': 'Chunto: bekal buluh ngagai kraf enggau bahan ngaga rumah',
  'f.ownername': 'Nama tuan tanah', 'f.ownerid': 'No. kad pengenal / cop tuan tanah',
  'f.leadername': 'Nama tuai projek', 'f.leaderid': 'No. kad pengenal',
  'f.homeaddr': 'Alamat rumah', 'f.projaddr': 'Alamat projek',
  'f.phone': 'No. telefon', 'f.email': 'Alamat emel', 'f.income': 'Pendapat isi rumah (RM/bulan)',
  'f.p.no': 'Bil', 'f.p.name': 'Nama penuh', 'f.p.ic': 'No. kad pengenal', 'f.p.phone': 'No. telefon', 'f.p.income': 'Pendapat (RM/bln)',
  'f.p.add': 'Tambah peserta', 'f.p.count': '{n} ari 10 iku peserta ti minimum', 'f.p.ok': '{n} iku peserta — udah chukup',
  'f.p.note': 'Salin kad pengenal semua ahli projek ibuh dimuat naik ba tikas ti datai.',
  'f.coname': 'Nama kompeni / koperasi', 'f.coreg': 'No. daftar kompeni / koperasi',
  'f.bumi': 'Taraf kompeni / koperasi', 'f.bumi.b': 'Bumiputera', 'f.bumi.nb': 'Ukai Bumiputera',
  'f.costatus': 'Status kompeni / koperasi', 'f.costatus.local': 'Tempatan', 'f.costatus.public': 'Awam',
  'f.coaddr': 'Alamat kompeni / koperasi', 'f.cophone': 'No. telefon kompeni', 'f.cofax': 'No. faks',
  'f.picname': 'Nama pegawai betemu', 'f.picpos': 'Pangkat', 'f.picunit': 'Bahagi / Seksyen / Unit',
  'f.picmobile': 'No. telefon bimbit', 'f.picemail': 'Alamat emel',
  'f.titletype': 'Jenis / No. geran', 'f.sitestatus': 'Status tapak projek',
  'f.site.rent': 'Sewa', 'f.site.lease': 'Pajak', 'f.site.own': 'Empu diri', 'f.site.other': 'Bukai',
  'f.siteother': 'Padah status tapak', 'f.areaha': 'Luas tapak projek (hektar)',
  'f.soil': 'Jenis tanah', 'f.soil.mineral': 'Mineral', 'f.soil.peat': 'Gambut',
  'f.soil.kerangas': 'Kerangas tauka bepasir', 'f.soil.swamp': 'Paya', 'f.soil.other': 'Bukai',
  'f.soilother': 'Padah jenis tanah',
  'f.optional': 'pilih',

  'mb.title': 'Lepas surat nuan ditu',
  'mb.sub': 'Tarit lalu lepas fail, tauka klik ngambi milih ari alat nuan.',
  'mb.limits': 'PDF, JPG, PNG tauka DOCX · sepemesai 10 MB tiap-tiap fail',
  'mb.added': '{n} surat udah dilampir', 'mb.remove': 'Buai fail',
  'mb.toobig': 'Fail tu lebih ari had 10 MB lalu enda dilampir: {name}',
  'mb.badtype': 'Jenis fail tu enda disukung: {name}',
  'mb.honest': 'Jenis surat dipadah ari nama fail aja — isi iya enda dibacha. Tulung pastika sebedau ngirim.',
  'mb.sug.ic': 'Kad pengenal', 'mb.sug.land': 'Surat tanah', 'mb.sug.map': 'Peta kawasan',
  'mb.sug.company': 'Surat kompeni', 'mb.sug.eia': 'Laporan EIA', 'mb.sug.fmp': 'Laporan FMP',
  'mb.sug.proposal': 'Kertas kerja', 'mb.sug.form': 'Borang', 'mb.sug.other': 'Apin dikelas',
  'mb.classify': 'Jenis surat',

  'cl.a1': 'Salin kad pengenal semua ahli projek', 'cl.a1d': 'Enggau tuai projek',
  'cl.a2': 'Surat tanah (geran / perjanji)', 'cl.a2d': 'Bukti empu, pajak tauka sewa',
  'cl.a3': 'Surat izin ngena tanah', 'cl.a3d': 'Semina enti tanah ukai empu diri',
  'cl.b1': 'Borang peminta', 'cl.b2': 'Profil kompeni / koperasi',
  'cl.b3': 'Salin Borang 9, 24 enggau 49', 'cl.b3d': 'Ngagai kompeni ke minta',
  'cl.b4': 'M&A / enakmen / perlembagaan koperasi',
  'cl.b5': 'Kertas kerja cadang projek', 'cl.b5d': 'Enti bekaul',
  'cl.b6': 'Salin surat status tanah', 'cl.b6d': 'Geran tauka perjanji pajak',
  'cl.b7': 'Laporan Environmental Impact Assessment (EIA)', 'cl.b7d': 'Ngagai tapak ba kawasan LPF',
  'cl.b8': 'Laporan Forest Management Plan (FMP)', 'cl.b8d': 'Ngagai tapak ba kawasan LPF',
  'cl.b9': 'Peta kawasan', 'cl.b9d': 'Topografi, pelan beskala tauka pelan survey',

  'dec.a': 'Aku ngaku berita ke diberi ba atas tu amat bendar. Semua tulung ke disetujuka deka dikena aku magang ngambi nyampaika projek tu. Aku mega deka nitihka sarat ke ditetapka PUSAKA. Enti aku didapat meri berita ke enda amat tauka pelesu, PUSAKA bisi kuasa mansutka peminta tu.',
  'dec.b1': 'Semua berita, keterangan enggau butir ke diberi dalam peminta tu amat sereta bendar.',
  'dec.b2': 'Aku enggau kompeni / koperasi tu enda bankrap tauka muflis.',
  'dec.b3': 'Deka nitihka semua terma enggau sarat peminta tu baka ke ditetapka PUSAKA.',
  'dec.b4': 'PUSAKA bisi kuasa mansutka peminta tu enti bisi utai ke enda dititihka tauka berita ke pelesu.',
  'dec.agree': 'Aku udah macha lalu nerima perakuan ba atas.',
  'sig.label': 'Tanda jari elektronik', 'sig.hint': 'Lukis tanda jari nuan ngena tetikus tauka tunjuk.',
  'sig.clear': 'Padam', 'sig.name': 'Nama baka ba kad pengenal', 'sig.date': 'Tarikh',

  'sub.sending': 'Ngirim peminta nuan…', 'sub.wait': 'Anang nutup tingkap tu.',
  'sub.done': 'Peminta nuan udah diterima', 'sub.doned': 'Simpan nombor rujuk di baruh tu. Pegawai PUSAKA deka meda peminta nuan lalu betemu enggau nuan.',
  'sub.ref': 'Nombor rujuk', 'sub.track': 'Jalai', 'sub.when': 'Tarikh dikirim', 'sub.applicant': 'Orang ke minta',
  'sub.print': 'Chitak resit', 'sub.new': 'Kirim peminta bukai',
  'sub.note': 'Tu ukai surat setuju. Peminta nuan deka dipeda PUSAKA, lalu naziran tapak engka digaga sebedau sebarang keputusan diambi.',
  'sub.err': 'Peminta enda ulih disimpan ba alat tu. Uji baru, tauka betemu enggau opis PUSAKA.',
  'sub.retry': 'Uji baru'
}
};

Object.keys(FT).forEach(function (lang) {
  if (!T[lang]) T[lang] = {};
  Object.keys(FT[lang]).forEach(function (k) { T[lang][k] = FT[lang][k]; });
});

window.BAMBOO_FT = FT;

/* ─── Reference data ────────────────────────────────────────── */
var DIVISIONS = ['Kuching','Samarahan','Serian','Sri Aman','Betong','Sarikei',
                 'Sibu','Mukah','Bintulu','Kapit','Miri','Limbang'];

var MAX_BYTES = 10 * 1024 * 1024;
var OK_EXT = ['pdf','jpg','jpeg','png','webp','doc','docx'];
var MIN_PARTICIPANTS = 10;

/* ─── Field schemas ─────────────────────────────────────────── */
function txt(name, label, opts) {
  return Object.assign({ name: name, label: label, type: 'text' }, opts || {});
}

var SCHEMA = {
  community: {
    code: 'A', form: 'STIDC.01', titleKey: 'track.a.title', tagKey: 'track.a.tag',
    steps: [
      { key: 'a1', groups: [
        { legend: 'g.category', fields: [
          { name: 'category', label: 'f.cat', type: 'radio', req: true, options: [
            { v: 'community',   l: 'f.cat.community',   d: 'f.cat.community.d' },
            { v: 'school',      l: 'f.cat.school',      d: 'f.cat.school.d' },
            { v: 'institution', l: 'f.cat.institution', d: 'f.cat.institution.d' }
          ]}
        ]},
        { legend: 'g.location', fields: [
          txt('state', 'f.state', { value: 'Sarawak', readonly: true }),
          { name: 'division', label: 'f.division', type: 'select', req: true, list: DIVISIONS },
          txt('district', 'f.district', { req: true }),
          txt('parliament', 'f.parliament'),
          txt('dun', 'f.dun')
        ]}
      ]},
      { key: 'a2', groups: [
        { legend: 'g.land', fields: [
          { name: 'landType', label: 'f.landtype', type: 'radio', req: true, options: [
            { v: 'own',   l: 'f.landtype.own' },
            { v: 'rent',  l: 'f.landtype.rent' },
            { v: 'lease', l: 'f.landtype.lease' }
          ]},
          txt('lotNo', 'f.lotno', { req: true }),
          { name: 'landArea', label: 'f.area', type: 'number', req: true, min: 0, step: '0.01' },
          { name: 'landUnit', label: 'f.areaunit', type: 'select', req: true,
            options: [{ v: 'acre', l: 'f.unit.acre' }, { v: 'ha', l: 'f.unit.ha' }] },
          { name: 'purpose', label: 'f.purpose', type: 'textarea', req: true, ph: 'f.purpose.ph', full: true }
        ]},
        { legend: 'g.consent', when: function (d) { return d.landType && d.landType !== 'own'; }, fields: [
          txt('ownerName', 'f.ownername', { req: true, when: function (d) { return d.landType && d.landType !== 'own'; } }),
          txt('ownerId', 'f.ownerid', { req: true, when: function (d) { return d.landType && d.landType !== 'own'; } })
        ]}
      ]},
      { key: 'a3', groups: [
        { legend: 'g.leader', fields: [
          txt('leaderName', 'f.leadername', { req: true }),
          txt('leaderId', 'f.leaderid', { req: true, rule: 'ic' }),
          { name: 'homeAddr', label: 'f.homeaddr', type: 'textarea', req: true },
          { name: 'projAddr', label: 'f.projaddr', type: 'textarea', req: true },
          { name: 'phone', label: 'f.phone', type: 'tel', req: true, rule: 'tel' },
          { name: 'email', label: 'f.email', type: 'email', rule: 'email' },
          { name: 'income', label: 'f.income', type: 'number', min: 0 }
        ]},
        { legend: 'g.members', participants: true }
      ]},
      { key: 'a4', checklist: ['cl.a1', 'cl.a2', 'cl.a3'], documents: true, declaration: 'a' }
    ]
  },

  commercial: {
    code: 'B', form: 'STIDC.10.SH.01.37', titleKey: 'track.b.title', tagKey: 'track.b.tag',
    steps: [
      { key: 'b1', groups: [
        { legend: 'g.company', fields: [
          txt('coName', 'f.coname', { req: true }),
          txt('coReg', 'f.coreg', { req: true }),
          { name: 'bumi', label: 'f.bumi', type: 'radio', req: true, options: [
            { v: 'bumiputera', l: 'f.bumi.b' }, { v: 'non', l: 'f.bumi.nb' }
          ]},
          { name: 'coStatus', label: 'f.costatus', type: 'radio', req: true, options: [
            { v: 'local', l: 'f.costatus.local' }, { v: 'public', l: 'f.costatus.public' }
          ]},
          { name: 'coAddr', label: 'f.coaddr', type: 'textarea', req: true, full: true },
          { name: 'coPhone', label: 'f.cophone', type: 'tel', req: true, rule: 'tel' },
          { name: 'coFax', label: 'f.cofax', type: 'tel' }
        ]}
      ]},
      { key: 'b2', groups: [
        { legend: 'g.pic', fields: [
          txt('picName', 'f.picname', { req: true }),
          txt('picPos', 'f.picpos', { req: true }),
          txt('picUnit', 'f.picunit'),
          { name: 'picMobile', label: 'f.picmobile', type: 'tel', req: true, rule: 'tel' },
          { name: 'picEmail', label: 'f.picemail', type: 'email', req: true, rule: 'email' }
        ]}
      ]},
      { key: 'b3', groups: [
        { legend: 'g.site', fields: [
          { name: 'division', label: 'f.division', type: 'select', req: true, list: DIVISIONS },
          txt('district', 'f.district', { req: true }),
          txt('subDistrict', 'f.subdistrict'),
          txt('titleType', 'f.titletype', { req: true }),
          { name: 'siteStatus', label: 'f.sitestatus', type: 'radio', req: true, options: [
            { v: 'own', l: 'f.site.own' }, { v: 'lease', l: 'f.site.lease' },
            { v: 'rent', l: 'f.site.rent' }, { v: 'other', l: 'f.site.other' }
          ]},
          txt('siteOther', 'f.siteother', { req: true, when: function (d) { return d.siteStatus === 'other'; } }),
          { name: 'areaHa', label: 'f.areaha', type: 'number', req: true, min: 0, step: '0.01' },
          { name: 'soil', label: 'f.soil', type: 'select', req: true, options: [
            { v: 'mineral', l: 'f.soil.mineral' }, { v: 'peat', l: 'f.soil.peat' },
            { v: 'kerangas', l: 'f.soil.kerangas' }, { v: 'swamp', l: 'f.soil.swamp' },
            { v: 'other', l: 'f.soil.other' }
          ]},
          txt('soilOther', 'f.soilother', { req: true, when: function (d) { return d.soil === 'other'; } })
        ]}
      ]},
      { key: 'b4', checklist: ['cl.b1','cl.b2','cl.b3','cl.b4','cl.b5','cl.b6','cl.b7','cl.b8','cl.b9'],
        documents: true, declaration: 'b' }
    ]
  }
};

/* ─── State ─────────────────────────────────────────────────── */
var S = null;
var mount = null;
var sigPad = null;

function blankState(track) {
  var participants = [];
  for (var i = 0; i < MIN_PARTICIPANTS; i++) participants.push({ name: '', ic: '', phone: '', income: '' });
  return {
    track: track, step: 0, data: { state: 'Sarawak', landUnit: 'acre' },
    participants: participants, files: [], checklist: {},
    signature: '', signName: '', signDate: todayISO(), agreed: false
  };
}

function todayISO() {
  var d = new Date();
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}
function pad2(n) { return (n < 10 ? '0' : '') + n; }

function draftKeyFor(track) { return CFG.draftKey + ':' + track; }

function saveDraft() {
  if (!S || !S.track) return;
  try {
    localStorage.setItem(draftKeyFor(S.track), JSON.stringify({
      step: S.step, data: S.data, participants: S.participants,
      files: S.files, checklist: S.checklist,
      signature: S.signature, signName: S.signName, signDate: S.signDate, agreed: S.agreed
    }));
    var flag = document.getElementById('draftFlag');
    if (flag) { flag.style.opacity = '1'; setTimeout(function () { flag.style.opacity = ''; }, 400); }
  } catch (e) { /* quota or private mode — the form still works in memory */ }
}

function loadDraft(track) {
  try {
    var raw = localStorage.getItem(draftKeyFor(track));
    if (!raw) return null;
    var d = JSON.parse(raw);
    var base = blankState(track);
    base.step = Math.min(3, Math.max(0, d.step | 0));
    base.data = Object.assign(base.data, d.data || {});
    if (Array.isArray(d.participants) && d.participants.length) base.participants = d.participants;
    base.files = Array.isArray(d.files) ? d.files : [];
    base.checklist = d.checklist || {};
    base.signature = d.signature || '';
    base.signName = d.signName || '';
    base.signDate = d.signDate || todayISO();
    base.agreed = !!d.agreed;
    return base;
  } catch (e) { return null; }
}

function clearDraft(track) {
  try { localStorage.removeItem(draftKeyFor(track)); } catch (e) {}
}

/* ─── Records store ─────────────────────────────────────────── */
function readRecords() {
  try {
    var raw = localStorage.getItem(CFG.storeKey);
    var list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (e) { return []; }
}
function writeRecords(list) {
  localStorage.setItem(CFG.storeKey, JSON.stringify(list));
}
window.BAMBOO_STORE = { read: readRecords, write: writeRecords };

function makeRef(code) {
  var d = new Date();
  var alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var tail = '';
  for (var i = 0; i < 4; i++) tail += alphabet[Math.floor(Math.random() * alphabet.length)];
  return 'BSA-' + code + '-' + String(d.getFullYear()).slice(2) + pad2(d.getMonth() + 1) + '-' + tail;
}

/* ─── Validation ────────────────────────────────────────────── */
var RULES = {
  email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
  tel:   function (v) { return /^[0-9+\-\s()]{7,20}$/.test(v) && (v.replace(/\D/g, '').length >= 7); },
  ic:    function (v) { var n = v.replace(/\D/g, ''); return n.length === 12 || n.length === 7 || n.length === 8; }
};
var RULE_MSG = { email: 'p.email', tel: 'p.tel', ic: 'p.ic' };

function fieldVisible(f) {
  return typeof f.when !== 'function' || f.when(S.data);
}

function collectFields(step) {
  var out = [];
  (step.groups || []).forEach(function (g) {
    if (g.participants) return;
    if (typeof g.when === 'function' && !g.when(S.data)) return;
    (g.fields || []).forEach(function (f) { out.push(f); });
  });
  return out;
}

function validateStep(step) {
  var bad = [];
  collectFields(step).forEach(function (f) {
    if (!fieldVisible(f)) return;
    var v = String(S.data[f.name] === undefined ? '' : S.data[f.name]).trim();
    if (f.req && !v) { bad.push({ name: f.name, msg: 'p.required' }); return; }
    if (v && f.rule && RULES[f.rule] && !RULES[f.rule](v)) {
      bad.push({ name: f.name, msg: RULE_MSG[f.rule] });
    }
    if (v && f.type === 'number' && isNaN(parseFloat(v))) {
      bad.push({ name: f.name, msg: 'p.num' });
    }
  });
  return bad;
}

function filledParticipants() {
  return S.participants.filter(function (p) { return String(p.name || '').trim() !== ''; });
}

/* ─── Render helpers ────────────────────────────────────────── */
var t = function (k) { return I18N.t(k); };
function fill(str, map) {
  return String(str).replace(/\{(\w+)\}/g, function (_, k) { return map[k] === undefined ? '' : map[k]; });
}

var ICON = {
  warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16.5v.01"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style="width:14px;height:14px;flex:none;margin-top:3px;color:var(--ochre)"><path d="M12 2l1.6 5.6L19 9l-5.4 1.4L12 16l-1.6-5.6L5 9l5.4-1.4z"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"/><path d="M2 4h20v4H2zM10 12h4"/></svg>',
  inbox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>'
};

function errBlock(name) {
  return '<div class="err" id="err-' + name + '">' + ICON.warn + '<span></span></div>';
}

function labelFor(f) {
  var req = f.req ? '<span class="req" aria-hidden="true">*</span>' : '';
  var opt = (!f.req && f.showOptional) ? ' <span class="hint">(' + esc(t('f.optional')) + ')</span>' : '';
  return '<label for="fld-' + f.name + '">' + esc(t(f.label)) + req + opt + '</label>';
}

function renderField(f) {
  var v = S.data[f.name] === undefined ? (f.value || '') : S.data[f.name];
  var hidden = fieldVisible(f) ? '' : ' style="display:none"';
  var html = '<div class="field" id="fw-' + f.name + '"' + hidden + '>';

  if (f.type === 'radio') {
    html += '<span class="field-label">' + esc(t(f.label)) + (f.req ? '<span class="req">*</span>' : '') + '</span>';
    html += '<div class="choices" role="radiogroup" aria-label="' + esc(t(f.label)) + '">';
    f.options.forEach(function (o) {
      var id = 'fld-' + f.name + '-' + o.v;
      html += '<label class="choice"><input type="radio" id="' + id + '" name="' + f.name + '" value="' + esc(o.v) + '"' +
              (v === o.v ? ' checked' : '') + ' data-field="' + f.name + '" />' +
              '<span>' + esc(t(o.l)) + (o.d ? '<small>' + esc(t(o.d)) + '</small>' : '') + '</span></label>';
    });
    html += '</div>' + errBlock(f.name) + '</div>';
    return html;
  }

  html += labelFor(f);

  if (f.type === 'select') {
    html += '<select class="input" id="fld-' + f.name + '" data-field="' + f.name + '">';
    html += '<option value="">—</option>';
    if (f.list) {
      f.list.forEach(function (o) {
        html += '<option value="' + esc(o) + '"' + (v === o ? ' selected' : '') + '>' + esc(o) + '</option>';
      });
    } else {
      f.options.forEach(function (o) {
        html += '<option value="' + esc(o.v) + '"' + (v === o.v ? ' selected' : '') + '>' + esc(t(o.l)) + '</option>';
      });
    }
    html += '</select>';
  } else if (f.type === 'textarea') {
    html += '<textarea class="input" id="fld-' + f.name + '" data-field="' + f.name + '"' +
            (f.ph ? ' placeholder="' + esc(t(f.ph)) + '"' : '') + '>' + esc(v) + '</textarea>';
  } else {
    html += '<input class="input" id="fld-' + f.name + '" data-field="' + f.name + '"' +
            ' type="' + (f.type === 'number' ? 'number' : f.type) + '"' +
            ' value="' + esc(v) + '"' +
            (f.readonly ? ' readonly' : '') +
            (f.min !== undefined ? ' min="' + f.min + '"' : '') +
            (f.step ? ' step="' + f.step + '"' : '') +
            (f.ph ? ' placeholder="' + esc(t(f.ph)) + '"' : '') +
            ' autocomplete="off" />';
  }

  html += errBlock(f.name) + '</div>';
  return html;
}

function renderGroup(g) {
  if (typeof g.when === 'function' && !g.when(S.data)) return '';
  var html = '<fieldset class="fieldset"><legend>' + esc(t(g.legend)) + '</legend>';
  if (g.participants) {
    html += renderParticipants();
  } else {
    html += '<div class="frow">' + g.fields.filter(function (f) { return !f.full; }).map(renderField).join('') + '</div>';
    var fulls = g.fields.filter(function (f) { return f.full; });
    if (fulls.length) html += '<div class="frow one">' + fulls.map(renderField).join('') + '</div>';
  }
  return html + '</fieldset>';
}

/* ─── Participants table ────────────────────────────────────── */
function renderParticipants() {
  var rows = S.participants.map(function (p, i) {
    return '<tr>' +
      '<td class="rownum">' + (i + 1) + '</td>' +
      '<td><input class="input" data-p="' + i + '" data-pk="name"   value="' + esc(p.name) + '" autocomplete="off" /></td>' +
      '<td><input class="input" data-p="' + i + '" data-pk="ic"     value="' + esc(p.ic) + '" autocomplete="off" /></td>' +
      '<td><input class="input" data-p="' + i + '" data-pk="phone"  value="' + esc(p.phone) + '" autocomplete="off" /></td>' +
      '<td><input class="input" data-p="' + i + '" data-pk="income" value="' + esc(p.income) + '" inputmode="numeric" autocomplete="off" /></td>' +
      '<td><button type="button" class="row-del" data-pdel="' + i + '" aria-label="' + esc(t('mb.remove')) + '"' +
          (S.participants.length <= MIN_PARTICIPANTS ? ' disabled' : '') + '>' + ICON.trash + '</button></td>' +
    '</tr>';
  }).join('');

  var n = filledParticipants().length;
  var ok = n >= MIN_PARTICIPANTS;

  return '<div class="ptable-wrap"><table class="ptable"><thead><tr>' +
      '<th>' + esc(t('f.p.no')) + '</th><th>' + esc(t('f.p.name')) + '</th><th>' + esc(t('f.p.ic')) + '</th>' +
      '<th>' + esc(t('f.p.phone')) + '</th><th>' + esc(t('f.p.income')) + '</th><th></th>' +
    '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<div class="ptable-foot">' +
      '<span class="count-pill' + (ok ? ' ok' : '') + '" id="pCount">' + (ok ? ICON.check : ICON.warn) +
        esc(fill(t(ok ? 'f.p.ok' : 'f.p.count'), { n: n })) + '</span>' +
      '<button type="button" class="btn btn-ghost btn-sm" id="pAdd">+ ' + esc(t('f.p.add')) + '</button>' +
    '</div>' +
    '<div class="err show" style="color:var(--ink-mute);margin-top:12px">' + ICON.warn +
      '<span>' + esc(t('f.p.note')) + '</span></div>';
}

/* ─── Magic Box ─────────────────────────────────────────────── */
var CLASSIFIERS = [
  { key: 'mb.sug.ic',       re: /\b(ic|mykad|kad[_\s-]?pengenal|identity|身份证)\b|kadpengenalan/i },
  { key: 'mb.sug.land',      re: /(geran|grant|title|tanah|land|lot|pajak|lease)/i },
  { key: 'mb.sug.map',      re: /(peta|map|pelan|survey|topo)/i },
  { key: 'mb.sug.company',  re: /(ssm|borang[_\s-]?9|borang[_\s-]?24|borang[_\s-]?49|form[_\s-]?9|m&a|memorandum|profil|profile|koperasi|syarikat|company)/i },
  { key: 'mb.sug.eia',      re: /\beia\b|environment/i },
  { key: 'mb.sug.fmp',      re: /\bfmp\b|forest[_\s-]?management/i },
  { key: 'mb.sug.proposal', re: /(kertas[_\s-]?kerja|proposal|cadangan|workplan)/i },
  { key: 'mb.sug.form',     re: /(borang|form|stidc)/i }
];

function classify(name) {
  for (var i = 0; i < CLASSIFIERS.length; i++) {
    if (CLASSIFIERS[i].re.test(name)) return CLASSIFIERS[i].key;
  }
  return 'mb.sug.other';
}

function humanSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

function renderFiles() {
  if (!S.files.length) return '';
  var opts = CLASSIFIERS.map(function (c) { return c.key; }).concat(['mb.sug.other']);
  return '<ul class="filelist">' + S.files.map(function (f, i) {
    var sel = '<select class="input" data-fcls="' + i + '" aria-label="' + esc(t('mb.classify')) +
      '" style="padding:4px 26px 4px 9px;font-size:.72rem;width:auto;border-radius:999px;background-color:rgba(198,146,59,.13);border-color:rgba(198,146,59,.3);font-weight:600">' +
      opts.map(function (k) {
        return '<option value="' + k + '"' + (f.cls === k ? ' selected' : '') + '>' + esc(t(k)) + '</option>';
      }).join('') + '</select>';
    return '<li class="fileitem">' +
      '<span class="fileitem-ico" aria-hidden="true">' + ICON.doc + '</span>' +
      '<div><div class="fileitem-name" title="' + esc(f.name) + '">' + esc(f.name) + '</div>' +
      '<div class="fileitem-meta"><span>' + esc(humanSize(f.size)) + '</span>' + sel + '</div></div>' +
      '<button type="button" class="row-del" data-fdel="' + i + '" aria-label="' + esc(t('mb.remove')) + '">' + ICON.trash + '</button>' +
    '</li>';
  }).join('') + '</ul>' +
  '<p class="hint" style="margin-top:12px;display:flex;gap:8px;align-items:flex-start">' + ICON.spark +
  '<span>' + esc(t('mb.honest')) + '</span></p>';
}

function renderMagicBox() {
  return '<fieldset class="fieldset"><legend>' + esc(t('g.upload')) +
      '<span>' + esc(fill(t('mb.added'), { n: S.files.length })) + '</span></legend>' +
    '<div class="magicbox" id="magicBox" tabindex="0" role="button" aria-label="' + esc(t('mb.title')) + '">' +
      '<div class="magicbox-ico" aria-hidden="true">' + ICON.box + '</div>' +
      '<h4>' + esc(t('mb.title')) + '</h4>' +
      '<p>' + esc(t('mb.sub')) + '</p>' +
      '<p class="mb-limits">' + esc(t('mb.limits')) + '</p>' +
      '<input type="file" id="fileInput" multiple hidden accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" />' +
    '</div>' + renderFiles() + '</fieldset>';
}

/* ─── Checklist ─────────────────────────────────────────────── */
function renderChecklist(keys) {
  return '<fieldset class="fieldset"><legend>' + esc(t('g.checklist')) + '</legend><ul class="checklist">' +
    keys.map(function (k) {
      var dk = k + 'd';
      var desc = (T[I18N.lang] && T[I18N.lang][dk]) || T.ms[dk];
      return '<li><label class="checkitem"><input type="checkbox" data-cl="' + k + '"' +
        (S.checklist[k] ? ' checked' : '') + ' />' +
        '<span class="checkitem-text"><b>' + esc(t(k)) + '</b>' +
        (desc ? '<small>' + esc(desc) + '</small>' : '') + '</span></label></li>';
    }).join('') + '</ul></fieldset>';
}

/* ─── Review summary ────────────────────────────────────────── */
function displayValue(f, raw) {
  var v = raw === undefined || raw === null ? '' : String(raw);
  if (!v) return '—';
  if (f.options) {
    for (var i = 0; i < f.options.length; i++) {
      if (f.options[i].v === v) return t(f.options[i].l);
    }
  }
  return v;
}

function renderReview() {
  var schema = SCHEMA[S.track];
  var html = '<fieldset class="fieldset"><legend>' + esc(t('g.review')) + '</legend>';

  schema.steps.slice(0, 3).forEach(function (step) {
    (step.groups || []).forEach(function (g) {
      if (typeof g.when === 'function' && !g.when(S.data)) return;

      if (g.participants) {
        var list = filledParticipants();
        html += '<div class="review-group"><h5>' + esc(t(g.legend)) + '</h5><dl class="review-list">';
        html += '<div><dt>' + esc(t('g.members')) + '</dt><dd>' + list.length + '</dd></div>';
        list.slice(0, 12).forEach(function (p, i) {
          html += '<div><dt>' + (i + 1) + '</dt><dd>' + esc(p.name) +
                  (p.ic ? ' · ' + esc(p.ic) : '') + '</dd></div>';
        });
        if (list.length > 12) html += '<div><dt>…</dt><dd>+' + (list.length - 12) + '</dd></div>';
        html += '</dl></div>';
        return;
      }

      var rows = (g.fields || []).filter(fieldVisible).map(function (f) {
        return '<div><dt>' + esc(t(f.label)) + '</dt><dd>' + esc(displayValue(f, S.data[f.name])) + '</dd></div>';
      }).join('');
      if (rows) html += '<div class="review-group"><h5>' + esc(t(g.legend)) + '</h5><dl class="review-list">' + rows + '</dl></div>';
    });
  });

  if (S.files.length) {
    html += '<div class="review-group"><h5>' + esc(t('g.upload')) + '</h5><dl class="review-list">' +
      S.files.map(function (f) {
        return '<div><dt>' + esc(t(f.cls)) + '</dt><dd>' + esc(f.name) + ' · ' + esc(humanSize(f.size)) + '</dd></div>';
      }).join('') + '</dl></div>';
  }

  return html + '</fieldset>';
}

/* ─── Declaration + signature ───────────────────────────────── */
function renderDeclaration(kind) {
  var body = kind === 'a'
    ? '<p style="font-size:.9rem;color:var(--ink-soft);line-height:1.65">' + esc(t('dec.a')) + '</p>'
    : '<ol>' + ['dec.b1','dec.b2','dec.b3','dec.b4'].map(function (k) {
        return '<li>' + esc(t(k)) + '</li>'; }).join('') + '</ol>';

  return '<fieldset class="fieldset"><legend>' + esc(t('g.declare')) + '</legend>' +
    '<div class="declare">' + body +
      '<label class="checkitem" style="margin-top:16px;background:#FFFEFB">' +
        '<input type="checkbox" id="agreeBox"' + (S.agreed ? ' checked' : '') + ' />' +
        '<span class="checkitem-text"><b>' + esc(t('dec.agree')) + '</b></span></label>' +
      '<div class="err" id="err-agree">' + ICON.warn + '<span></span></div>' +
    '</div>' +

    '<div class="frow" style="margin-top:22px">' +
      '<div class="field"><label for="signName">' + esc(t('sig.name')) + '<span class="req">*</span></label>' +
        '<input class="input" id="signName" value="' + esc(S.signName) + '" autocomplete="off" />' +
        errBlock('signName') + '</div>' +
      '<div class="field"><label for="signDate">' + esc(t('sig.date')) + '</label>' +
        '<input class="input" id="signDate" type="date" value="' + esc(S.signDate) + '" /></div>' +
    '</div>' +

    '<div class="field sign-pad-wrap"><span class="field-label">' + esc(t('sig.label')) + '<span class="req">*</span></span>' +
      '<canvas class="sign-pad" id="signPad" width="900" height="300"></canvas>' +
      '<div class="sign-tools"><span class="sign-hint">' + esc(t('sig.hint')) + '</span>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="signClear">' + esc(t('sig.clear')) + '</button></div>' +
      errBlock('signature') + '</div>' +
  '</fieldset>';
}

/* ─── Signature pad ─────────────────────────────────────────── */
function initSignaturePad() {
  var canvas = document.getElementById('signPad');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var drawing = false, last = null, dirty = false;

  function paintBackground() {
    ctx.fillStyle = '#FFFEFB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#102C22';
    ctx.lineWidth = 3.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }
  paintBackground();

  if (S.signature) {
    var img = new Image();
    img.onload = function () { ctx.drawImage(img, 0, 0, canvas.width, canvas.height); dirty = true; };
    img.src = S.signature;
  }

  function pos(e) {
    var r = canvas.getBoundingClientRect();
    var pt = e.touches ? e.touches[0] : e;
    return {
      x: (pt.clientX - r.left) * (canvas.width / r.width),
      y: (pt.clientY - r.top) * (canvas.height / r.height)
    };
  }
  function start(e) { e.preventDefault(); drawing = true; last = pos(e); }
  function move(e) {
    if (!drawing) return;
    e.preventDefault();
    var p = pos(e);
    ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    last = p; dirty = true;
  }
  function end() {
    if (!drawing) return;
    drawing = false;
    if (dirty) { S.signature = canvas.toDataURL('image/png'); saveDraft(); }
  }

  canvas.addEventListener('pointerdown', start);
  canvas.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end);
  canvas.addEventListener('pointerleave', end);

  var clear = document.getElementById('signClear');
  if (clear) clear.addEventListener('click', function () {
    paintBackground(); dirty = false; S.signature = ''; saveDraft();
  });

  sigPad = { clear: function () { paintBackground(); dirty = false; } };
}

/* ─── Track chooser ─────────────────────────────────────────── */
function renderChooser() {
  mount.innerHTML =
    '<div class="section-head center reveal" style="margin-bottom:32px">' +
      '<span class="eyebrow">' + esc(t('p.choose.eyebrow')) + '</span>' +
      '<h2 style="font-size:clamp(1.6rem,3vw,2.2rem)">' + esc(t('p.choose.title')) + '</h2>' +
      '<p>' + esc(t('p.choose.sub')) + '</p>' +
    '</div>' +
    '<div class="tracks">' +
      chooserCard('community', 'a') +
      chooserCard('commercial', 'b') +
    '</div>';

  mount.querySelectorAll('[data-pick]').forEach(function (b) {
    b.addEventListener('click', function () { startTrack(b.dataset.pick); });
  });
  window.BAMBOO_REVEAL(mount);
}

function chooserCard(track, letter) {
  var hasDraft = !!loadDraft(track);
  var icon = letter === 'a'
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M9 21v-6h6v6"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><rect x="4" y="9" width="7" height="12"/><rect x="13" y="4" width="7" height="17"/></svg>';

  return '<article class="track track-' + letter + ' reveal' + (letter === 'b' ? ' d1' : '') + '">' +
    '<div class="culm-field" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>' +
    '<div class="track-head"><span class="track-ico" aria-hidden="true">' + icon + '</span>' +
      '<div><span class="track-tag">' + esc(t('track.' + letter + '.tag')) + '</span>' +
      '<h3>' + esc(t('track.' + letter + '.title')) + '</h3></div></div>' +
    '<p class="track-desc">' + esc(t('track.' + letter + '.desc')) + '</p>' +
    '<ul class="track-list">' + [1,2,3,4].map(function (i) {
      return '<li>' + esc(t('track.' + letter + '.l' + i)) + '</li>'; }).join('') + '</ul>' +
    '<div class="track-foot">' +
      '<button type="button" class="btn ' + (letter === 'a' ? 'btn-ochre' : 'btn-teal') + '" data-pick="' + track + '">' +
        esc(t(hasDraft ? 'p.resume' : 'track.' + letter + '.cta')) + '</button>' +
      '<span class="track-meta">' + esc(t('track.' + letter + '.meta')) + '</span>' +
    '</div></article>';
}

/* ─── Sidebar ───────────────────────────────────────────────── */
function renderSidebar() {
  var schema = SCHEMA[S.track];
  var letter = schema.code.toLowerCase();
  var steps = schema.steps.map(function (st, i) {
    var cls = i === S.step ? 'is-current' : (i < S.step ? 'is-done' : '');
    var dot = i < S.step ? ICON.check : String(i + 1);
    return '<li><button type="button" class="side-step ' + cls + '" data-goto="' + i + '">' +
      '<span class="side-step-dot">' + dot + '</span>' +
      '<span><span class="side-step-label">' + esc(t('st.' + letter + (i + 1))) + '</span>' +
      '<span class="side-step-desc">' + esc(t('st.' + letter + (i + 1) + 'd')) + '</span></span>' +
    '</button></li>';
  }).join('');

  var pct = Math.round(((S.step) / 4) * 100);

  return '<aside class="portal-side">' +
    '<span class="side-track-tag">' + esc(t('track.' + letter + '.tag')) + '</span>' +
    '<div class="side-title">' + esc(t('track.' + letter + '.title')) + '</div>' +
    '<div class="side-ref">' + esc(schema.form) + '</div>' +
    '<ul class="side-steps">' + steps + '</ul>' +
    '<div class="side-progress"><div class="side-progress-bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="side-progress-text">' + esc(fill(t('p.progress'), { n: pct })) + '</div></div>' +
    '<div class="side-draft" id="draftFlag">' + ICON.save + '<span>' + esc(t('p.draftsaved')) + '</span></div>' +
    '<div class="side-switch"><button type="button" id="switchTrack">' + esc(t('p.switch')) + '</button></div>' +
  '</aside>';
}

/* ─── Step body ─────────────────────────────────────────────── */
function renderStepBody() {
  var schema = SCHEMA[S.track];
  var letter = schema.code.toLowerCase();
  var step = schema.steps[S.step];
  var html = '';

  if (step.groups) {
    html += step.groups.map(renderGroup).join('');
  }
  if (step.checklist) html += renderChecklist(step.checklist);
  if (step.documents) html += renderMagicBox();
  if (step.documents) html += renderReview();
  if (step.declaration) html += renderDeclaration(step.declaration);

  return '<div class="panel-head">' +
      '<h3>' + esc(t('h.' + letter + (S.step + 1))) + '</h3>' +
      '<p>' + esc(t('h.' + letter + (S.step + 1) + 'd')) + '</p>' +
    '</div>' +
    '<div class="panel-body step-panel">' + html + '</div>' +
    '<div class="actionbar">' +
      (S.step > 0 ? '<button type="button" class="btn btn-ghost" id="btnBack">' + esc(t('p.back')) + '</button>' : '') +
      '<span class="actionbar-step">' + esc(fill(t('p.stepof'), { n: S.step + 1 })) + '</span>' +
      '<span class="spacer"></span>' +
      (S.step < 3
        ? '<button type="button" class="btn" id="btnNext">' + esc(t('p.next')) + '</button>'
        : '<button type="button" class="btn btn-ochre" id="btnSubmit">' + esc(t('p.submit')) + '</button>') +
    '</div>';
}

/* ─── Full form render + event wiring ───────────────────────── */
function renderForm() {
  mount.innerHTML = '<div class="portal-shell">' + renderSidebar() +
    '<div class="portal-main" id="portalMain">' + renderStepBody() + '</div></div>';
  wireForm();
}

function repaintStep() {
  var main = document.getElementById('portalMain');
  if (!main) return renderForm();
  main.innerHTML = renderStepBody();
  var shell = mount.querySelector('.portal-shell');
  var old = shell.querySelector('.portal-side');
  if (old) old.outerHTML = renderSidebar();
  wireForm();
}

function showError(name, msgKey) {
  var box = document.getElementById('err-' + name);
  var input = document.getElementById('fld-' + name) || document.getElementById(name);
  if (box) { box.querySelector('span').textContent = t(msgKey); box.classList.add('show'); }
  if (input) input.classList.add('invalid');
}
function clearError(name) {
  var box = document.getElementById('err-' + name);
  var input = document.getElementById('fld-' + name) || document.getElementById(name);
  if (box) box.classList.remove('show');
  if (input) input.classList.remove('invalid');
}

function applyConditionals() {
  var step = SCHEMA[S.track].steps[S.step];
  var needsRepaint = false;
  (step.groups || []).forEach(function (g) {
    if (g.participants) return;
    if (typeof g.when === 'function') { needsRepaint = true; return; }
    (g.fields || []).forEach(function (f) {
      if (typeof f.when !== 'function') return;
      var wrap = document.getElementById('fw-' + f.name);
      if (wrap) wrap.style.display = f.when(S.data) ? '' : 'none';
    });
  });
  return needsRepaint;
}

function wireForm() {
  var main = document.getElementById('portalMain');
  if (!main) return;

  /* field inputs */
  main.querySelectorAll('[data-field]').forEach(function (input) {
    var evt = (input.tagName === 'SELECT' || input.type === 'radio') ? 'change' : 'input';
    input.addEventListener(evt, function () {
      var name = input.dataset.field;
      S.data[name] = input.type === 'radio' ? input.value : input.value;
      clearError(name);
      var conditional = SCHEMA[S.track].steps[S.step].groups &&
        SCHEMA[S.track].steps[S.step].groups.some(function (g) { return typeof g.when === 'function'; });
      if (input.type === 'radio' || input.tagName === 'SELECT') {
        if (conditional) { saveDraft(); return repaintStep(); }
        applyConditionals();
      }
      saveDraft();
    });
  });

  /* participants */
  main.querySelectorAll('[data-p]').forEach(function (input) {
    input.addEventListener('input', function () {
      var i = parseInt(input.dataset.p, 10);
      S.participants[i][input.dataset.pk] = input.value;
      updateParticipantCount();
      saveDraft();
    });
  });
  var pAdd = document.getElementById('pAdd');
  if (pAdd) pAdd.addEventListener('click', function () {
    S.participants.push({ name: '', ic: '', phone: '', income: '' });
    saveDraft(); repaintStep();
    var rows = document.querySelectorAll('[data-pk="name"]');
    if (rows.length) rows[rows.length - 1].focus();
  });
  main.querySelectorAll('[data-pdel]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (S.participants.length <= MIN_PARTICIPANTS) return;
      S.participants.splice(parseInt(b.dataset.pdel, 10), 1);
      saveDraft(); repaintStep();
    });
  });

  /* checklist */
  main.querySelectorAll('[data-cl]').forEach(function (cb) {
    cb.addEventListener('change', function () {
      S.checklist[cb.dataset.cl] = cb.checked;
      saveDraft();
    });
  });

  /* magic box */
  wireMagicBox(main);

  /* declaration + signature */
  var agree = document.getElementById('agreeBox');
  if (agree) agree.addEventListener('change', function () {
    S.agreed = agree.checked; clearError('agree'); saveDraft();
  });
  var sName = document.getElementById('signName');
  if (sName) sName.addEventListener('input', function () {
    S.signName = sName.value; clearError('signName'); saveDraft();
  });
  var sDate = document.getElementById('signDate');
  if (sDate) sDate.addEventListener('change', function () { S.signDate = sDate.value; saveDraft(); });
  initSignaturePad();

  /* navigation */
  var back = document.getElementById('btnBack');
  if (back) back.addEventListener('click', function () { goStep(S.step - 1); });
  var next = document.getElementById('btnNext');
  if (next) next.addEventListener('click', function () { if (checkStep()) goStep(S.step + 1); });
  var submit = document.getElementById('btnSubmit');
  if (submit) submit.addEventListener('click', doSubmit);

  mount.querySelectorAll('[data-goto]').forEach(function (b) {
    b.addEventListener('click', function () {
      var target = parseInt(b.dataset.goto, 10);
      if (target < S.step) return goStep(target);
      if (target > S.step && checkStep()) goStep(S.step + 1);
    });
  });
  var sw = document.getElementById('switchTrack');
  if (sw) sw.addEventListener('click', function () {
    S = null; renderChooser();
    mount.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function updateParticipantCount() {
  var pill = document.getElementById('pCount');
  if (!pill) return;
  var n = filledParticipants().length;
  var ok = n >= MIN_PARTICIPANTS;
  pill.className = 'count-pill' + (ok ? ' ok' : '');
  pill.innerHTML = (ok ? ICON.check : ICON.warn) + esc(fill(t(ok ? 'f.p.ok' : 'f.p.count'), { n: n }));
}

function wireMagicBox(main) {
  var box = main.querySelector('#magicBox');
  var input = main.querySelector('#fileInput');
  if (!box || !input) return;

  box.addEventListener('click', function () { input.click(); });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
  });
  input.addEventListener('change', function () { intake(input.files); input.value = ''; });

  ['dragenter', 'dragover'].forEach(function (ev) {
    box.addEventListener(ev, function (e) { e.preventDefault(); box.classList.add('dragover'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    box.addEventListener(ev, function (e) { e.preventDefault(); box.classList.remove('dragover'); });
  });
  box.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files) intake(e.dataTransfer.files);
  });

  main.querySelectorAll('[data-fdel]').forEach(function (b) {
    b.addEventListener('click', function () {
      S.files.splice(parseInt(b.dataset.fdel, 10), 1);
      saveDraft(); repaintStep();
    });
  });
  main.querySelectorAll('[data-fcls]').forEach(function (sel) {
    sel.addEventListener('change', function () {
      S.files[parseInt(sel.dataset.fcls, 10)].cls = sel.value;
      saveDraft();
    });
  });
}

function intake(fileList) {
  var added = 0;
  Array.prototype.forEach.call(fileList, function (file) {
    var ext = (file.name.split('.').pop() || '').toLowerCase();
    if (OK_EXT.indexOf(ext) === -1) { toast(fill(t('mb.badtype'), { name: file.name })); return; }
    if (file.size > MAX_BYTES)      { toast(fill(t('mb.toobig'), { name: file.name })); return; }
    S.files.push({ name: file.name, size: file.size, type: file.type || ext, cls: classify(file.name) });
    added++;
  });
  if (added) { saveDraft(); repaintStep(); }
}

/* ─── Step validation gate ──────────────────────────────────── */
function checkStep() {
  var schema = SCHEMA[S.track];
  var step = schema.steps[S.step];
  var bad = validateStep(step);

  collectFields(step).forEach(function (f) { clearError(f.name); });
  bad.forEach(function (b) { showError(b.name, b.msg); });

  /* participants gate on the community members step */
  var hasParticipants = (step.groups || []).some(function (g) { return g.participants; });
  if (hasParticipants && filledParticipants().length < MIN_PARTICIPANTS) {
    toast(t('p.min10'));
    var pill = document.getElementById('pCount');
    if (pill) pill.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }

  if (bad.length) {
    toast(t('p.fixerrors'));
    var first = document.getElementById('fw-' + bad[0].name);
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }
  return true;
}

function checkFinal() {
  var ok = checkStep();
  clearError('agree'); clearError('signName'); clearError('signature');

  if (!S.agreed)  { showError('agree', 'p.needagree'); ok = false; }
  if (!String(S.signName).trim()) { showError('signName', 'p.required'); ok = false; }
  if (!S.signature) { showError('signature', 'p.needsign'); ok = false; }

  if (!ok) {
    toast(t('p.fixerrors'));
    var box = document.querySelector('.err.show');
    if (box) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return ok;
}

function goStep(n) {
  S.step = Math.max(0, Math.min(3, n));
  saveDraft();
  repaintStep();
  var head = mount.querySelector('.panel-head');
  if (head) head.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function startTrack(track) {
  S = loadDraft(track) || blankState(track);
  var resumed = S.step > 0;
  renderForm();
  if (resumed) toast(t('p.resume'));
  mount.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ─── Submission ────────────────────────────────────────────── */
function doSubmit() {
  if (!checkFinal()) return;

  var main = document.getElementById('portalMain');
  main.innerHTML = '<div class="panel-body"><div class="state-box">' +
    '<div class="spinner" role="status" aria-live="polite"></div>' +
    '<h3 style="font-size:1.25rem">' + esc(t('sub.sending')) + '</h3>' +
    '<p style="margin-top:8px;color:var(--ink-soft);font-size:.9rem">' + esc(t('sub.wait')) + '</p>' +
  '</div></div>';

  setTimeout(function () {
    var schema = SCHEMA[S.track];
    var record = {
      ref: makeRef(schema.code),
      track: S.track,
      form: schema.form,
      createdAt: new Date().toISOString(),
      status: 'new',
      data: S.data,
      participants: filledParticipants(),
      files: S.files,
      checklist: S.checklist,
      signName: S.signName,
      signDate: S.signDate,
      signature: S.signature,
      notes: ''
    };

    try {
      var list = readRecords();
      list.unshift(record);
      writeRecords(list);
    } catch (e) {
      main.innerHTML = '<div class="panel-body"><div class="state-box">' +
        '<div class="card-ico" style="margin:0 auto 18px;background:rgba(166,92,72,.14);color:var(--clay)">' + ICON.warn + '</div>' +
        '<h3 style="font-size:1.25rem">' + esc(t('sub.err')) + '</h3>' +
        '<button type="button" class="btn btn-ghost" id="btnRetry" style="margin-top:20px">' + esc(t('sub.retry')) + '</button>' +
      '</div></div>';
      var retry = document.getElementById('btnRetry');
      if (retry) retry.addEventListener('click', function () { repaintStep(); });
      return;
    }

    clearDraft(S.track);
    renderSuccess(record);
  }, 950);
}

function renderSuccess(rec) {
  var schema = SCHEMA[rec.track];
  var letter = schema.code.toLowerCase();
  var when = new Date(rec.createdAt).toLocaleString(
    I18N.lang === 'zh' ? 'zh-Hans' : (I18N.lang === 'en' ? 'en-GB' : 'ms-MY'),
    { dateStyle: 'long', timeStyle: 'short' });

  var applicant = rec.track === 'community'
    ? (rec.data.leaderName || rec.signName)
    : (rec.data.coName || rec.signName);

  mount.innerHTML = '<div class="portal-main" style="max-width:840px;margin-inline:auto">' +
    '<div class="panel-body"><div class="state-box">' +
      '<div class="success-seal" aria-hidden="true">' + ICON.check + '</div>' +
      '<h3 style="font-family:var(--serif);font-size:1.7rem">' + esc(t('sub.done')) + '</h3>' +
      '<p style="margin-top:10px;color:var(--ink-soft);font-size:.95rem;max-width:52ch;margin-inline:auto">' +
        esc(t('sub.doned')) + '</p>' +

      '<div class="receipt">' +
        '<div class="receipt-head">' +
          '<div><div class="receipt-label">' + esc(t('sub.ref')) + '</div>' +
            '<div class="receipt-ref">' + esc(rec.ref) + '</div></div>' +
          '<div style="text-align:right"><div class="receipt-label">' + esc(t('sub.track')) + '</div>' +
            '<div style="font-weight:600;margin-top:6px">' + esc(t('track.' + letter + '.title')) + '</div>' +
            '<div style="font-size:.78rem;color:var(--ink-mute)">' + esc(rec.form) + '</div></div>' +
        '</div>' +
        '<dl class="review-list" style="padding:0">' +
          '<div><dt>' + esc(t('sub.applicant')) + '</dt><dd>' + esc(applicant || '—') + '</dd></div>' +
          '<div><dt>' + esc(t('sub.when')) + '</dt><dd>' + esc(when) + '</dd></div>' +
          '<div><dt>' + esc(t('g.upload')) + '</dt><dd>' + rec.files.length + '</dd></div>' +
          (rec.track === 'community'
            ? '<div><dt>' + esc(t('g.members')) + '</dt><dd>' + rec.participants.length + '</dd></div>' : '') +
        '</dl>' +
        '<p style="margin-top:20px;padding-top:18px;border-top:1px dashed var(--line);font-size:.8rem;color:var(--ink-mute);line-height:1.6">' +
          esc(t('sub.note')) + '</p>' +
      '</div>' +

      '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:26px" class="no-print">' +
        '<button type="button" class="btn" id="btnPrint">' + esc(t('sub.print')) + '</button>' +
        '<button type="button" class="btn btn-ghost" id="btnAnother">' + esc(t('sub.new')) + '</button>' +
      '</div>' +
    '</div></div></div>';

  document.getElementById('btnPrint').addEventListener('click', function () { window.print(); });
  document.getElementById('btnAnother').addEventListener('click', function () {
    S = null; renderChooser();
    mount.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  mount.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ─── Deep links + boot ─────────────────────────────────────── */
function deepLinkTrack() {
  var q = new URLSearchParams(window.location.search).get('project');
  if (q === 'community' || q === 'commercial') return q;
  return null;
}

function boot() {
  mount = document.getElementById('portalMount');
  if (!mount) return;

  renderChooser();

  document.querySelectorAll('[data-track-start]').forEach(function (a) {
    a.addEventListener('click', function () {
      setTimeout(function () { startTrack(a.dataset.trackStart); }, 260);
    });
  });

  var deep = deepLinkTrack();
  if (deep) {
    startTrack(deep);
    setTimeout(function () {
      mount.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 220);
  }

  I18N.onChange(function () {
    if (!mount) return;
    if (S && S.track) renderForm(); else renderChooser();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else { boot(); }

})();
