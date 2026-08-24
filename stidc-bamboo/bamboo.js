/* ══════════════════════════════════════════════════════════════
   BAMBOO SARAWAK — "About Bamboo" knowledge page
   ══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var T    = window.BAMBOO_T;
var I18N = window.BAMBOO_I18N;
var esc  = window.BAMBOO_UTIL.esc;

var BT = {
ms: {
  'bam.badge.tag': 'Pengetahuan', 'bam.badge.text': 'Agenda Buluh Sarawak di bawah STIDC / PUSAKA',
  'bam.h1.a': 'Rumput yang', 'bam.h1.b': 'membina negeri.',
  'bam.lede': 'Buluh bukan pokok — ia rumput berkayu yang tumbuh paling pantas di dunia. Di Sarawak, ia menjadi jawapan kepada satu soalan yang lebih besar: bagaimana industri kayu negeri terus hidup tanpa menghabiskan hutan yang menyokongnya.',
  'bam.cta1': 'Mula Permohonan', 'bam.cta2': 'Lihat Spesies',
  'bam.basic.eyebrow': 'Asas', 'bam.basic.title': 'Apa yang menjadikan buluh berbeza.',
  'bam.basic.sub': 'Empat sifat asas yang menjelaskan mengapa kerajaan negeri memilih buluh sebagai tanaman industri, bukan sekadar tanaman kampung.',
  'bam.b1.t': 'Tumbesaran pantas',
  'bam.b1.d': 'Batang baharu naik dari rizom setiap musim dan mencapai ketinggian penuh dalam beberapa bulan. Rumpun boleh dituai secara berkala dari tahun ketiga hingga kelima.',
  'bam.b2.t': 'Tidak perlu ditanam semula',
  'bam.b2.d': 'Menuai batang tidak membunuh rumpun. Sistem rizom terus hidup dan menghasilkan batang baharu, jadi satu penanaman boleh menyara berpuluh tahun penuaian.',
  'bam.b3.t': 'Kekuatan berbanding berat',
  'bam.b3.d': 'Struktur berongga dengan buku yang rapat memberikan buluh nisbah kekuatan-kepada-berat yang tinggi — sebab ia digunakan untuk perancah, papan lamina dan struktur ringan.',
  'bam.b4.t': 'Sesuai dengan tanah Sarawak',
  'bam.b4.d': 'Kajian tapak percubaan negeri menilai spesies mengikut kadar hidup dan tumbesaran pada tanah mineral, gambut, kerangas dan paya — supaya cadangan spesies sepadan dengan tapak.',
  'bam.sp.eyebrow': 'Spesies Utama', 'bam.sp.title': 'Buluh yang dinilai untuk Sarawak.',
  'bam.sp.sub': 'Spesies yang diperuntukkan kepada pemohon bergantung kepada kesesuaian tapak, industri hiliran yang disasarkan dan stok semasa tapak semaian PUSAKA — bukan pilihan pemohon.',
  'bam.sp.note': 'Nota: bar menunjukkan kegunaan lazim setiap spesies secara umum, bukan gred rasmi PUSAKA. Rujuk pegawai projek untuk padanan spesies dengan tapak anda.',
  'bam.use.eyebrow': 'Dari Ladang ke Kilang', 'bam.use.title': 'Ke mana buluh pergi selepas dituai.',
  'bam.use.sub': 'Nilai sebenar agenda ini terletak pada hiliran. Batang mentah bernilai rendah; batang yang diproses menjadi produk bernilai tinggi dan pekerjaan tempatan.',
  'bam.tl.eyebrow': 'Perjalanan Agenda', 'bam.tl.title': 'Bagaimana agenda buluh Sarawak terbentuk.',
  'bam.tl.sub': 'Ringkasan berdasarkan kenyataan awam STIDC dan laporan media Sarawak. Tarikh dan angka perlu disahkan dengan STIDC sebelum sebarang penerbitan rasmi.',
  'bam.cta.eyebrow': 'Langkah Seterusnya', 'bam.cta.title': 'Ada tanah? Agenda ini bermula di situ.',
  'bam.cta.sub': 'Sama ada sebidang tanah kampung atau ratusan hektar tapak ladang — kedua-dua laluan bermula dengan borang yang sama panjangnya.',

  'sp.betong': 'Buluh berdiameter besar dan berdinding tebal — pilihan utama untuk papan lamina, perabot dan struktur binaan.',
  'sp.beting': 'Batang lurus dan panjang dengan buku yang rapi, sesuai untuk kraf, anyaman dan produk buluh belah.',
  'sp.beti': 'Spesies tempatan yang dinilai dalam kajian tapak percubaan negeri untuk kadar hidup dan tumbesaran awal.',
  'sp.minyak': 'Spesies yang mudah hidup dan cepat menutup tanah — berguna untuk menstabilkan tebing dan cerun.',
  'sp.lemang': 'Buluh nipis berdinding halus, lama digunakan komuniti Sarawak untuk memasak dan kraf tangan.',
  'sp.use': 'Kegunaan lazim',

  'use.1t': 'Papan lamina & perabot', 'use.1d': 'Batang dibelah, dikeringkan dan dilekat menjadi papan — pengganti kayu keras untuk lantai, meja dan panel.',
  'use.2t': 'Kraf & anyaman', 'use.2d': 'Kemahiran komuniti yang sedia ada bertukar menjadi pendapatan apabila bekalan batang menjadi tetap.',
  'use.3t': 'Arang & biomas', 'use.3d': 'Sisa dan batang gred rendah menjadi arang aktif serta bahan api biomas untuk kilang.',
  'use.4t': 'Bahan binaan ringan', 'use.4d': 'Perancah, kekuda dan struktur sementara yang memerlukan kekuatan tinggi pada berat rendah.',
  'use.5t': 'Rebung & makanan', 'use.5d': 'Sebahagian spesies memberi rebung yang boleh dimakan — hasil sampingan sebelum rumpun matang penuh.',
  'use.6t': 'Perlindungan tanah', 'use.6d': 'Penanaman di tebing sungai dan cerun mengurangkan hakisan sambil menunggu batang matang.',

  'tl.1y': '2016', 'tl.1t': 'STIDC diberi mandat',
  'tl.1d': 'Kerajaan Sarawak mengarahkan STIDC memimpin pembangunan industri buluh negeri, memperkenalkan buluh sebagai sumber bahan mentah alternatif kepada kayu balak.',
  'tl.2y': 'Tapak percubaan', 'tl.2t': 'Sabal dan bambusetum',
  'tl.2d': 'Tapak percubaan buluh Sabal di Simunjan dan bambusetum di UPM Kampus Bintulu digunakan untuk menilai spesies, kadar hidup dan prestasi tumbesaran awal.',
  'tl.3y': '2023', 'tl.3t': 'Sasaran negeri diumumkan',
  'tl.3d': 'Sasaran keluasan tanaman buluh diumumkan sebagai sebahagian daripada strategi pembangunan negeri, untuk memastikan kelestarian bekalan sumber.',
  'tl.4y': '2025', 'tl.4t': 'Keluasan dan penyertaan berkembang',
  'tl.4d': 'Laporan awam menyebut kira-kira 4,900 hektar telah ditanam oleh 17 syarikat komersial dan lebih 200 peserta komuniti, dengan sasaran dinaikkan ke arah 30,000 hektar menjelang 2030.',
  'tl.5y': 'Seterusnya', 'tl.5t': 'Hiliran dan kerjasama',
  'tl.5d': 'Tumpuan beralih kepada pemprosesan hiliran, kerjasama antara negeri dan perkongsian dengan pengusaha ladang untuk membina rantaian bekalan yang lengkap.'
},

en: {
  'bam.badge.tag': 'Knowledge', 'bam.badge.text': 'The Sarawak bamboo agenda under STIDC / PUSAKA',
  'bam.h1.a': 'The grass that', 'bam.h1.b': 'builds a state.',
  'bam.lede': 'Bamboo is not a tree — it is the fastest-growing woody grass in the world. In Sarawak it answers a larger question: how the state’s timber industry keeps going without exhausting the forest that carries it.',
  'bam.cta1': 'Start an Application', 'bam.cta2': 'See the Species',
  'bam.basic.eyebrow': 'Fundamentals', 'bam.basic.title': 'What makes bamboo different.',
  'bam.basic.sub': 'Four basic properties that explain why the state chose bamboo as an industrial crop rather than merely a village plant.',
  'bam.b1.t': 'Fast growth',
  'bam.b1.d': 'New culms rise from the rhizome each season and reach full height within months. A clump can be harvested on a cycle from the third to fifth year.',
  'bam.b2.t': 'No replanting needed',
  'bam.b2.d': 'Harvesting culms does not kill the clump. The rhizome system lives on and pushes up new culms, so one planting can support decades of harvests.',
  'bam.b3.t': 'Strength for its weight',
  'bam.b3.d': 'A hollow structure with closely spaced nodes gives bamboo a high strength-to-weight ratio — which is why it is used for scaffolding, laminated board and light structures.',
  'bam.b4.t': 'Suited to Sarawak soils',
  'bam.b4.d': 'State trial-plot studies assess species by survival and growth on mineral, peat, kerangas and swamp soils — so species recommendations match the site.',
  'bam.sp.eyebrow': 'Principal Species', 'bam.sp.title': 'The bamboos being assessed for Sarawak.',
  'bam.sp.sub': 'The species allocated to an applicant depends on site suitability, the downstream industry being targeted and current PUSAKA nursery stock — it is not the applicant’s choice.',
  'bam.sp.note': 'Note: the bars indicate each species’ common uses in general terms, not an official PUSAKA grading. Speak to a project officer about matching species to your site.',
  'bam.use.eyebrow': 'From Plantation to Mill', 'bam.use.title': 'Where bamboo goes after harvest.',
  'bam.use.sub': 'The real value of this agenda sits downstream. A raw culm is worth little; a processed culm becomes a high-value product and local employment.',
  'bam.tl.eyebrow': 'How the Agenda Grew', 'bam.tl.title': 'How Sarawak’s bamboo agenda took shape.',
  'bam.tl.sub': 'A summary drawn from public STIDC statements and Sarawak media reports. Dates and figures should be confirmed with STIDC before any official publication.',
  'bam.cta.eyebrow': 'Next Step', 'bam.cta.title': 'Have land? That is where this agenda starts.',
  'bam.cta.sub': 'Whether it is one village plot or hundreds of hectares of plantation site — both routes start with a form of the same length.',

  'sp.betong': 'A large-diameter, thick-walled bamboo — the leading choice for laminated board, furniture and construction elements.',
  'sp.beting': 'Straight, long culms with tidy nodes; well suited to crafts, weaving and split-bamboo products.',
  'sp.beti': 'A local species assessed in the state trial-plot studies for survival rate and early growth.',
  'sp.minyak': 'A hardy, quick-establishing species that covers ground fast — useful for stabilising banks and slopes.',
  'sp.lemang': 'A thin-walled bamboo long used by Sarawak communities for cooking and handicraft.',
  'sp.use': 'Common uses',

  'use.1t': 'Laminated board & furniture', 'use.1d': 'Culms are split, dried and glued into board — a hardwood substitute for flooring, tables and panels.',
  'use.2t': 'Crafts & weaving', 'use.2d': 'Skills communities already hold turn into income once culm supply becomes steady.',
  'use.3t': 'Charcoal & biomass', 'use.3d': 'Offcuts and lower-grade culms become activated charcoal and biomass fuel for mills.',
  'use.4t': 'Light construction', 'use.4d': 'Scaffolding, trusses and temporary structures that need high strength at low weight.',
  'use.5t': 'Shoots & food', 'use.5d': 'Some species yield edible shoots — a side harvest before the clump reaches full maturity.',
  'use.6t': 'Soil protection', 'use.6d': 'Planting on riverbanks and slopes reduces erosion while the culms mature.',

  'tl.1y': '2016', 'tl.1t': 'STIDC given the mandate',
  'tl.1d': 'The Sarawak Government directed STIDC to spearhead the state’s bamboo industry development, introducing bamboo as an alternative raw material source to timber.',
  'tl.2y': 'Trial plots', 'tl.2t': 'Sabal and the bambusetum',
  'tl.2d': 'The Sabal bamboo trial plot in Simunjan and a bambusetum at UPM Bintulu Campus are used to assess species, survival rates and early growth performance.',
  'tl.3y': '2023', 'tl.3t': 'State target announced',
  'tl.3d': 'A bamboo plantation area target was announced as part of the state development strategy, aimed at securing sustainability of resource supply.',
  'tl.4y': '2025', 'tl.4t': 'Area and participation grow',
  'tl.4d': 'Public reports cite roughly 4,900 hectares planted by 17 commercial companies and over 200 community participants, with the target raised toward 30,000 hectares by 2030.',
  'tl.5y': 'Next', 'tl.5t': 'Downstream and collaboration',
  'tl.5d': 'Attention shifts to downstream processing, inter-state collaboration and partnerships with plantation operators to build a complete supply chain.'
},

zh: {
  'bam.badge.tag': '知识', 'bam.badge.text': 'STIDC／PUSAKA 之下的砂拉越竹业议程',
  'bam.h1.a': '撑起一个州的', 'bam.h1.b': '一株草。',
  'bam.lede': '竹子并非树木——它是世界上生长最快的木质草本。在砂拉越，它回答了一个更大的问题：州木材工业如何延续下去，而不耗尽支撑它的森林。',
  'bam.cta1': '开始申请', 'bam.cta2': '查看竹种',
  'bam.basic.eyebrow': '基础', 'bam.basic.title': '竹子的与众不同之处。',
  'bam.basic.sub': '四项基本特性，解释了州政府为何将竹子视为产业作物，而不只是乡村植物。',
  'bam.b1.t': '生长迅速',
  'bam.b1.d': '新竹每季从地下茎长出，数月内即达全高。竹丛自第三至第五年起可循环采收。',
  'bam.b2.t': '无需重新种植',
  'bam.b2.d': '采收竹竿不会杀死竹丛。地下茎系统持续存活并长出新竹，因此一次种植可支撑数十年的采收。',
  'bam.b3.t': '轻而强韧',
  'bam.b3.d': '中空结构加上紧密的竹节，使竹子具备高强度重量比——这正是它被用于棚架、积成材与轻型结构的原因。',
  'bam.b4.t': '适应砂拉越土壤',
  'bam.b4.d': '州试验地研究以存活率与生长表现评估各竹种在矿质土、泥炭土、kerangas 与沼泽地的适应性——使竹种建议与地段相符。',
  'bam.sp.eyebrow': '主要竹种', 'bam.sp.title': '为砂拉越评估的竹种。',
  'bam.sp.sub': '分配给申请人的竹种取决于地段适应性、所针对的下游产业与 PUSAKA 苗圃的现有存量——并非由申请人选择。',
  'bam.sp.note': '注：图示条形概略显示各竹种的常见用途，并非 PUSAKA 的官方分级。请向计划官员咨询你的地段适合哪些竹种。',
  'bam.use.eyebrow': '从竹林到工厂', 'bam.use.title': '采收之后，竹子去了哪里。',
  'bam.use.sub': '这项议程的真正价值在下游。原竹价值有限；经加工的竹子则成为高价值产品与本地就业机会。',
  'bam.tl.eyebrow': '议程历程', 'bam.tl.title': '砂拉越竹业议程如何成形。',
  'bam.tl.sub': '摘要取自 STIDC 公开声明与砂拉越媒体报道。日期与数字应在正式发布前向 STIDC 求证。',
  'bam.cta.eyebrow': '下一步', 'bam.cta.title': '有土地吗？议程就从那里开始。',
  'bam.cta.sub': '不论是一片乡村土地，还是数百公顷的种植地段——两条途径的表格一样长。',

  'sp.betong': '大径厚壁竹种——积成材、家具与建筑构件的首选。',
  'sp.beting': '竹竿笔直修长、竹节整齐，适合工艺、编织与剖竹制品。',
  'sp.beti': '在州试验地研究中就存活率与早期生长受评估的本地竹种。',
  'sp.minyak': '强健、易成活、覆盖迅速的竹种——适合稳固河岸与斜坡。',
  'sp.lemang': '薄壁竹种，长期为砂拉越社群用于烹煮与手工艺。',
  'sp.use': '常见用途',

  'use.1t': '积成材与家具', 'use.1d': '竹竿经剖开、烘干与胶合成板——可替代硬木用于地板、桌面与墙板。',
  'use.2t': '工艺与编织', 'use.2d': '一旦竹材供应稳定，社群既有的手艺便能转化为收入。',
  'use.3t': '木炭与生物质', 'use.3d': '边角料与低级竹材可制成活性炭与工厂用生物质燃料。',
  'use.4t': '轻型建筑', 'use.4d': '棚架、桁架与临时结构，需要在低重量下具备高强度。',
  'use.5t': '竹笋与食品', 'use.5d': '部分竹种可产可食用竹笋——在竹丛完全成熟前的副产收成。',
  'use.6t': '水土保护', 'use.6d': '在河岸与斜坡种植可在竹材成熟期间减少侵蚀。',

  'tl.1y': '2016 年', 'tl.1t': 'STIDC 获授权',
  'tl.1d': '砂拉越政府指示 STIDC 主导州竹业发展，引入竹子作为木材以外的替代原料来源。',
  'tl.2y': '试验地', 'tl.2t': 'Sabal 与竹类园',
  'tl.2d': '位于 Simunjan 的 Sabal 竹试验地与 UPM 民都鲁校区的竹类园，用于评估竹种、存活率与早期生长表现。',
  'tl.3y': '2023 年', 'tl.3t': '州目标公布',
  'tl.3d': '竹林面积目标作为州发展策略的一部分公布，旨在确保资源供应的可持续性。',
  'tl.4y': '2025 年', 'tl.4t': '面积与参与度增长',
  'tl.4d': '公开报道提及约 4,900 公顷已由 17 家商业公司与逾 200 名社区参与者种植，目标上调至 2030 年前 30,000 公顷。',
  'tl.5y': '接下来', 'tl.5t': '下游与合作',
  'tl.5d': '重心转向下游加工、跨州合作，以及与种植业者建立伙伴关系，以打造完整的供应链。'
},

ib: {
  'bam.badge.tag': 'Penemu', 'bam.badge.text': 'Agenda Buluh Sarawak ba baruh STIDC / PUSAKA',
  'bam.h1.a': 'Rumput ke', 'bam.h1.b': 'ngaga menua.',
  'bam.lede': 'Buluh ukai kayu — iya rumput bekayu ke pemadu jampat tumbuh di dunya. Ba Sarawak, iya nyaut siti tanya ti besai agi: baka ni industri kayu menua terus idup nadai ngabis kampung kayu ke nyukung iya.',
  'bam.cta1': 'Berengkah Minta', 'bam.cta2': 'Peda Jenis Buluh',
  'bam.basic.eyebrow': 'Pun', 'bam.basic.title': 'Nama ke ngaga buluh belain.',
  'bam.basic.sub': 'Empat perengka pun ke nerangka kebuah perintah menua milih buluh nyadi utai tanam industri, ukai semina utai tanam ba rumah panjai.',
  'bam.b1.t': 'Jampat tumbuh',
  'bam.b1.d': 'Batang baru pansut ari urat tiap-tiap musim lalu nyampai tinggi penuh dalam berapa bulan. Rumpun ulih ditetak ari taun ketiga ngagai kelima.',
  'bam.b2.t': 'Nadai ibuh nanam baru',
  'bam.b2.d': 'Netak batang enda munuh rumpun. Urat terus idup lalu ngeluarka batang baru, nya alai siti penanam ulih nyukung puluh taun penuai.',
  'bam.b3.t': 'Kering tang mimit berat',
  'bam.b3.d': 'Batang ke berongga enggau buku ke rapat meri buluh kering ke besai tang mimit berat — nya kebuah iya dikena ngaga perancah, papan lamina enggau bangunan ke ringan.',
  'bam.b4.t': 'Ngena tanah Sarawak',
  'bam.b4.d': 'Kaji tapak uji menua nilai jenis buluh nitihka pengidup enggau tumbuh ba tanah mineral, gambut, kerangas enggau paya — ngambi cadang jenis ngena tapak.',
  'bam.sp.eyebrow': 'Jenis Utama', 'bam.sp.title': 'Buluh ke dinilai ngagai Sarawak.',
  'bam.sp.sub': 'Jenis ke dibagi ngagai orang ke minta bekaul enggau pengelurus tapak, industri hilir ke disasar enggau stok tapak semaian PUSAKA — ukai pilih orang ke minta.',
  'bam.sp.note': 'Nota: bar tu madahka guna ti suah ngagai tiap-tiap jenis aja, ukai gred resmi PUSAKA. Tanya pegawai projek ngambi ngena jenis enggau tapak nuan.',
  'bam.use.eyebrow': 'Ari Ladang Ngagai Kilang', 'bam.use.title': 'Ngagai ni buluh udah ditetak.',
  'bam.use.sub': 'Rega ti amat ba agenda tu bisi ba hilir. Batang ke apin digaga mimit rega; batang ke udah digaga nyadi utai ke mahal enggau pengawa orang menua.',
  'bam.tl.eyebrow': 'Jalai Agenda', 'bam.tl.title': 'Baka ni agenda buluh Sarawak digaga.',
  'bam.tl.sub': 'Ringkas ari jaku resmi STIDC enggau laporan media Sarawak. Tarikh enggau angka ibuh dipastika enggau STIDC sebedau diterbit resmi.',
  'bam.cta.eyebrow': 'Tikas Datai', 'bam.cta.title': 'Bisi tanah? Agenda tu berengkah dia.',
  'bam.cta.sub': 'Nemuka sepiak tanah rumah panjai tauka ratus hektar tapak ladang — dua-dua jalai berengkah enggau borang ke sama panjai.',

  'sp.betong': 'Buluh besai enggau dinding tebal — pilih ti utama ngagai papan lamina, perabung enggau ngaga rumah.',
  'sp.beting': 'Batang lurus lalu panjai enggau buku ti rapi, ngena ngagai kraf, anyam enggau utai digaga ari buluh belah.',
  'sp.beti': 'Jenis menua ke dinilai dalam kaji tapak uji negeri ngagai pengidup enggau tumbuh awal.',
  'sp.minyak': 'Jenis ke selalu idup lalu jampat nutup tanah — ngena ngagai negapka tebing enggau bukit.',
  'sp.lemang': 'Buluh nipis dinding, lama dikena orang Sarawak ngagai masak enggau kraf.',
  'sp.use': 'Guna ti suah',

  'use.1t': 'Papan lamina & perabung', 'use.1d': 'Batang dibelah, dikeringka lalu dilekat nyadi papan — ganti kayu keras ngagai lantai, mija enggau panel.',
  'use.2t': 'Kraf & anyam', 'use.2d': 'Pengelandik ke udah bisi ba komuniti nyadi pendapat lebuh bekal batang tetap.',
  'use.3t': 'Arang & biomas', 'use.3d': 'Sisa enggau batang gred baruh nyadi arang aktif enggau bahan api biomas ngagai kilang.',
  'use.4t': 'Bahan ngaga ke ringan', 'use.4d': 'Perancah, kekuda enggau bangunan sementara ke ibuh kering tang mimit berat.',
  'use.5t': 'Rebung & pemakai', 'use.5d': 'Sekeda jenis meri rebung ke ulih diempa — hasil sampingan sebedau rumpun masak penuh.',
  'use.6t': 'Nyaga tanah', 'use.6d': 'Nanam ba tebing sungai enggau bukit ngurangka tanah rerak lebuh batang agi tumbuh.',

  'tl.1y': '2016', 'tl.1t': 'STIDC diberi kuasa',
  'tl.1d': 'Perintah Sarawak ngasuh STIDC mimpin pemansang industri buluh menua, mai buluh nyadi pun bahan mentah ganti kayu balak.',
  'tl.2y': 'Tapak uji', 'tl.2t': 'Sabal enggau bambusetum',
  'tl.2d': 'Tapak uji buluh Sabal ba Simunjan enggau bambusetum ba UPM Kampus Bintulu dikena nilai jenis, pengidup enggau tumbuh awal.',
  'tl.3y': '2023', 'tl.3t': 'Sasar menua dipadah',
  'tl.3d': 'Sasar luas tanam buluh dipadah nyadi sebagi ari strategi pemansang menua, ngambi mastika bekal sumber tan lama.',
  'tl.4y': '2025', 'tl.4t': 'Luas enggau peserta nambah',
  'tl.4d': 'Laporan awam madah kira 4,900 hektar udah ditanam 17 iti kompeni komersial enggau lebih 200 iku peserta komuniti, enggau sasar dinaikka ngagai 30,000 hektar sebedau 2030.',
  'tl.5y': 'Datai', 'tl.5t': 'Hilir enggau begulai',
  'tl.5d': 'Runding beralih ngagai pengawa hilir, begulai enggau menua bukai sereta bekunsi enggau pengusaha ladang ngambi ngaga rantai bekal ti lengkap.'
}
};

Object.keys(BT).forEach(function (lang) {
  if (!T[lang]) T[lang] = {};
  Object.keys(BT[lang]).forEach(function (k) { T[lang][k] = BT[lang][k]; });
});

/* ─── Content models ────────────────────────────────────────── */
var SPECIES_DETAIL = [
  { latin: 'Dendrocalamus asper',         local: 'Buluh Betong', key: 'sp.betong', bar: 96 },
  { latin: 'Gigantochloa levis',          local: 'Buluh Beting', key: 'sp.beting', bar: 82 },
  { latin: 'Gigantochloa hasskarliana',   local: 'Buluh Beti',   key: 'sp.beti',   bar: 68 },
  { latin: 'Bambusa vulgaris',            local: 'Buluh Minyak', key: 'sp.minyak', bar: 74 },
  { latin: 'Schizostachyum brachycladum', local: 'Buluh Lemang', key: 'sp.lemang', bar: 58 }
];

function renderSpecies() {
  var host = document.getElementById('speciesCards');
  if (!host) return;
  host.innerHTML = SPECIES_DETAIL.map(function (s) {
    return '<article class="species-card">' +
      '<div class="latin">' + esc(s.latin) + '</div>' +
      '<div class="local">' + esc(s.local) + '</div>' +
      '<p data-i18n="' + s.key + '"></p>' +
      '<div class="species-bar"><i style="width:' + s.bar + '%"></i></div>' +
    '</article>';
  }).join('');
}

function renderUses() {
  var host = document.getElementById('usesGrid');
  if (!host) return;
  var html = '';
  for (var i = 1; i <= 6; i++) {
    html += '<div><div class="n" style="font-size:1.15rem;font-family:var(--sans);font-weight:600;color:#FBF8F0"' +
            ' data-i18n="use.' + i + 't"></div>' +
            '<div class="l" data-i18n="use.' + i + 'd"></div></div>';
  }
  host.innerHTML = html;
}

function renderTimeline() {
  var host = document.getElementById('timeline');
  if (!host) return;
  var html = '';
  for (var i = 1; i <= 5; i++) {
    html += '<div class="tl-item">' +
      '<div class="tl-year" data-i18n="tl.' + i + 'y"></div>' +
      '<h3 data-i18n="tl.' + i + 't"></h3>' +
      '<p data-i18n="tl.' + i + 'd"></p>' +
    '</div>';
  }
  host.innerHTML = html;
}

function boot() {
  renderSpecies();
  renderUses();
  renderTimeline();
  I18N.apply(I18N.lang);
  window.BAMBOO_REVEAL(document);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else { boot(); }

})();
