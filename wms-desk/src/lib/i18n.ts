export type Lang = 'bm' | 'en'

type Dict = Record<string, { bm: string; en: string }>

export const T: Dict = {
  // Shell
  wordmark: { bm: 'WMS Desk', en: 'WMS Desk' },
  navHome: { bm: 'Utama', en: 'Home' },
  navPakej: { bm: 'Pakej', en: 'Packages' },
  navDewan: { bm: 'Dewan', en: 'Hall' },
  navKalendar: { bm: 'Kalendar', en: 'Calendar' },
  navBenang: { bm: 'Benang', en: 'Benang' },
  navHubungi: { bm: 'Hubungi', en: 'Contact' },
  navTempah: { bm: 'Tempah', en: 'Book' },
  menu: { bm: 'Menu', en: 'Menu' },
  close: { bm: 'Tutup', en: 'Close' },

  // Desk
  heroTitle: { bm: 'Pilih tarikh. Kami uruskan dewan.', en: 'Pick a date. We run the hall.' },
  heroLead: {
    bm: 'Dewan baharu Wisma Melayu Sarawak, Petra Jaya. 500 hingga 2,000 tetamu. Satu majlis sehari.',
    en: 'The new hall at Wisma Melayu Sarawak, Petra Jaya. 500 to 2,000 guests. One event a day.',
  },
  stepDate: { bm: 'Tarikh', en: 'Date' },
  stepPax: { bm: 'Tetamu', en: 'Guests' },
  stepPkg: { bm: 'Pakej', en: 'Package' },
  stepTotal: { bm: 'Jumlah', en: 'Total' },
  stepContact: { bm: 'Nama & telefon', en: 'Name & phone' },
  openCalendar: { bm: 'Buka kalendar', en: 'Open calendar' },
  nextSaturday: { bm: 'Sabtu seterusnya', en: 'Next Saturday' },
  pickedDate: { bm: 'Tarikh dipilih', en: 'Selected date' },
  noDateYet: { bm: 'Belum pilih tarikh', en: 'No date picked yet' },
  guests: { bm: 'tetamu', en: 'guests' },
  tablesEst: { bm: 'anggaran {n} meja', en: 'approx. {n} tables' },
  ledYes: { bm: 'LED disertakan', en: 'LED included' },
  ledNo: { bm: 'LED dari 700 tetamu', en: 'LED from 700 guests' },
  presetMesra: { bm: 'Mesra', en: 'Intimate' },
  presetLed: { bm: 'LED', en: 'LED' },
  presetPenuh: { bm: 'Penuh', en: 'Full' },

  // Pricing
  priceFrame: { bm: 'Harga pakej semasa', en: 'Current package price' },
  usualPrice: { bm: 'Harga biasa', en: 'Usual price' },
  currentBadge: { bm: 'Pakej semasa', en: 'Current packages' },
  futureSlot: {
    bm: 'Harga di atas ialah harga pakej semasa. Promosi seterusnya akan dipaparkan di sini apabila dibuka.',
    en: 'The prices above are the current package prices. The next promotion will appear here when it opens.',
  },
  perPax: { bm: 'seorang', en: 'per person' },
  totalLabel: { bm: 'Jumlah', en: 'Total' },
  subjectToChange: {
    bm: 'Semua harga tertakluk kepada perubahan semasa.',
    en: 'All prices are subject to prevailing changes.',
  },
  benangLine: { bm: 'Benang Emas', en: 'Benang Emas' },
  creditLine: { bm: 'Kredit duta', en: 'Ambassador credit' },
  useCredit: { bm: 'Guna kredit', en: 'Use credit' },
  cappedAt: { bm: 'had RM 1,500', en: 'capped at RM 1,500' },

  // Contact fields
  coupleNames: { bm: 'Nama pengantin', en: 'Couple names' },
  coupleNamesPh: { bm: 'Nama & Nama', en: 'Name & Name' },
  phone: { bm: 'Nombor telefon', en: 'Phone number' },
  phonePh: { bm: '011-2233 4455', en: '011-2233 4455' },
  notes: { bm: 'Nota untuk kakitangan', en: 'Notes for staff' },
  notesPh: {
    bm: 'Contoh: pentas di tengah, ketibaan 11 pagi',
    en: 'e.g. stage in the centre, arrival at 11am',
  },

  // Hold
  holdCta: { bm: 'Tahan tarikh 48 jam', en: 'Hold this date for 48 hours' },
  holdHelp: {
    bm: 'Tarikh dikunci 48 jam. Kakitangan sahkan di WhatsApp. Deposit urus kemudian.',
    en: 'The date is locked for 48 hours. Staff confirm on WhatsApp. Deposit is arranged after.',
  },
  holdNeedDate: { bm: 'Pilih tarikh dahulu', en: 'Pick a date first' },
  holdNeedName: { bm: 'Isi nama dan telefon', en: 'Fill in name and phone' },
  completeMenu: { bm: 'Lengkapkan menu dahulu', en: 'Choose the menu first' },
  seePackages: { bm: 'Lihat pakej', en: 'See packages' },
  openBenang: { bm: 'Buka Benang Emas', en: 'Open Benang Emas' },
  holdMade: { bm: 'Tarikh ditahan', en: 'Date held' },
  holdRef: { bm: 'Rujukan', en: 'Reference' },
  timeLeft: { bm: 'baki masa', en: 'time left' },
  expired: { bm: 'Tahanan tamat', en: 'Hold expired' },
  timeline: {
    bm: 'Ditahan → kakitangan sahkan di WhatsApp → deposit → Disahkan.',
    en: 'Held → staff confirm on WhatsApp → deposit → Confirmed.',
  },

  // WhatsApp / share
  waStaff: { bm: 'WhatsApp {name}', en: 'WhatsApp {name}' },
  copyBrief: { bm: 'Salin maklumat tempahan', en: 'Copy the booking brief' },
  copyQuote: { bm: 'Kongsi sebut harga', en: 'Share the quote' },
  shareDraft: { bm: 'Kongsi draf dengan keluarga', en: 'Share the draft with family' },
  copied: { bm: 'Disalin', en: 'Copied' },

  // States
  dateTaken: { bm: 'Tarikh ini sudah ditempah', en: 'That date is taken' },
  dateHeld: { bm: 'Ditahan', en: 'On hold' },
  dateOpen: { bm: 'Terbuka', en: 'Open' },
  dateFull: { bm: 'Penuh', en: 'Booked' },
  tooSoon: { bm: 'Perlu sekurang-kurangnya 14 hari', en: 'Needs at least 14 days notice' },
  tooFar: { bm: 'Tempahan sehingga 30 Jun 2027 sahaja', en: 'Bookings run to 30 June 2027 only' },
  nearestOpen: { bm: 'Tarikh terdekat yang terbuka', en: 'Nearest open dates' },
  resumeDraft: { bm: 'Sambung draf {d} · {p}?', en: 'Resume your draft — {d} · {p}?' },
  resumeYes: { bm: 'Sambung', en: 'Resume' },
  resumeNo: { bm: 'Mula semula', en: 'Start fresh' },
  weekendNote: { bm: 'Hujung minggu penuh lebih awal.', en: 'Weekends fill up first.' },
  loadingOccupancy: { bm: 'Menyemak tarikh…', en: 'Checking dates…' },
  emptyMonth: { bm: 'Tiada tarikh terbuka bulan ini.', en: 'No open dates this month.' },
  networkFail: { bm: 'Sambungan terputus. Draf anda selamat.', en: 'Connection dropped. Your draft is safe.' },
  cfgLoaded: { bm: 'Draf keluarga dimuatkan', en: 'Family draft loaded' },

  // Referral
  benangTitle: { bm: 'Benang Emas', en: 'Benang Emas' },
  benangTag: { bm: 'Mereka jimat. Anda kumpul kredit.', en: 'They save. You collect credit.' },
  benangFrom: { bm: 'Benang dari {name}', en: 'Benang from {name}' },
  benangInvalid: { bm: 'Kod ini tidak dikenali', en: 'That code is not recognised' },
  benangOwn: { bm: 'Kod sendiri tidak boleh digunakan', en: 'You cannot use your own code' },
  benangSamePhone: {
    bm: 'Nombor telefon sama dengan pemilik kod',
    en: 'That phone matches the code owner',
  },
  benangPlanner: {
    bm: 'Nota komisen 5% — kakitangan urus',
    en: '5% commission noted — staff will handle it',
  },
  mintCta: { bm: 'Buka benang saya', en: 'Open my benang' },
  staffSim: { bm: 'Simulasi: kakitangan sahkan', en: 'Simulate: staff confirm' },
  ledger: { bm: 'Lejar kredit', en: 'Credit ledger' },
  presence: { bm: 'sedang melihat', en: 'viewing now' },

  // Misc
  exclusive: {
    bm: 'Satu majlis sehari. Dewan penuh untuk anda sahaja.',
    en: 'One event a day. The hall is yours alone.',
  },
  facilities: { bm: 'Kemudahan dewan', en: 'Hall facilities' },
  included: { bm: 'termasuk', en: 'included' },
  notPicked: { bm: 'belum dipilih', en: 'not yet chosen' },
  back: { bm: 'Kembali', en: 'Back' },
}

export function t(key: keyof typeof T | string, lang: Lang, vars?: Record<string, string | number>) {
  const entry = T[key as string]
  let s = entry ? entry[lang] : (key as string)
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v))
  return s
}
