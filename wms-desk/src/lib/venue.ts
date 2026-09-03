// Immutable business facts. Do not invent prices, numbers, or contacts.

export const VENUE = {
  org: 'Yayasan Budaya Melayu Sarawak (YBMS)',
  orgShort: 'YBMS',
  hall: 'Dewan Wisma Melayu Sarawak',
  building: 'Wisma Melayu Sarawak',
  address:
    'Wisma Melayu Sarawak, Jalan Diplomatik, Off Jalan Bako, Petra Jaya, 93050 Kuching, Sarawak',
  maps:
    'https://www.google.com/maps/search/?api=1&query=Wisma+Melayu+Sarawak+Jalan+Diplomatik+Petra+Jaya+Kuching',
  site: 'https://melayusarawak.org.my',
  bookingEmail: 'samarindoksdnbhd.akybms@gmail.com',
  officePhone: '082-239 460',
  officeMobile: '+60 11-1141 9460',
  officeEmail: 'akybms@gmail.com',
  minPax: 500,
  maxPax: 2000,
  ledFromPax: 700,
  minLeadDays: 14,
  lastEventDate: '2027-06-30',
  holdHours: 48,
  tz: '+08:00',
} as const

export type Coordinator = { name: string; phone: string; wa: string }

export const COORDINATORS: Coordinator[] = [
  { name: 'Mohd Amirul Rashid', phone: '+60 10-559 2804', wa: '60105592804' },
  { name: 'Wan Mohd Irfan', phone: '+60 16-579 5789', wa: '60165795789' },
]

export const FACILITIES_BM = [
  'Kerusi & meja bankuet',
  'Paparan LED (700 tetamu ke atas)',
  'Sistem PA asas',
  '4 mikrofon',
  'Lampu dewan + pentas',
  'Rostrum',
  '2 walkie-talkie',
  'Surau',
  'Bilik persalinan jika perlu',
  'Pentas',
  '2 petak parkir khas pengantin',
]

export const FACILITIES_EN = [
  'Banquet chairs & tables',
  'LED wall (700 guests and above)',
  'Basic PA system',
  '4 microphones',
  'Hall + stage lighting',
  'Rostrum',
  '2 walkie-talkies',
  'Surau',
  'Changing room if required',
  'Stage',
  '2 dedicated parking bays for the couple',
]

// Confirmed bookings — one event per day, exclusive hire.
export const OCCUPIED_SEED = [
  '2026-10-17',
  '2026-10-24',
  '2026-10-31',
  '2026-11-07',
  '2026-11-14',
  '2026-11-28',
  '2026-12-05',
  '2026-12-12',
  '2026-12-19',
  '2027-01-23',
  '2027-02-06',
  '2027-02-20',
]
