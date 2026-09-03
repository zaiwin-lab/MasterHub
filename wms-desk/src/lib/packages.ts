export type PackageId = 'darul-hana' | 'seri-santubong' | 'seri-keringkam'

export type Course = {
  id: string
  labelBm: string
  labelEn: string
  pick: 'one'
  options: { id: string; bm: string; en: string }[]
}

export type Pkg = {
  id: PackageId
  nameBm: string
  nameEn: string
  /** Harga biasa — struck through. */
  usual: number
  /** Harga pakej semasa — the selling unit price. */
  current: number
  roleBm: string
  roleEn: string
  blurbBm: string
  blurbEn: string
  courses: Course[]
  includedBm: string[]
  includedEn: string[]
}

const RICE: Course = {
  id: 'nasi',
  labelBm: 'Nasi',
  labelEn: 'Rice',
  pick: 'one',
  options: [
    { id: 'nasi-putih', bm: 'Nasi Putih', en: 'Steamed Rice' },
    { id: 'nasi-minyak', bm: 'Nasi Minyak', en: 'Nasi Minyak' },
    { id: 'nasi-tomato', bm: 'Nasi Tomato', en: 'Tomato Rice' },
  ],
}

const AYAM_DH: Course = {
  id: 'ayam',
  labelBm: 'Ayam',
  labelEn: 'Chicken',
  pick: 'one',
  options: [
    { id: 'ayam-kari', bm: 'Ayam Kari', en: 'Chicken Curry' },
    { id: 'ayam-masak-merah', bm: 'Ayam Masak Merah', en: 'Ayam Masak Merah' },
    { id: 'ayam-kurma', bm: 'Ayam Kurma', en: 'Chicken Kurma' },
    { id: 'ayam-rendang', bm: 'Ayam Rendang', en: 'Chicken Rendang' },
  ],
}

const AYAM_SS: Course = {
  id: 'ayam',
  labelBm: 'Ayam',
  labelEn: 'Chicken',
  pick: 'one',
  options: [
    { id: 'ayam-kari', bm: 'Ayam Kari', en: 'Chicken Curry' },
    { id: 'ayam-masak-merah', bm: 'Ayam Masak Merah', en: 'Ayam Masak Merah' },
    { id: 'ayam-kurma', bm: 'Ayam Kurma', en: 'Chicken Kurma' },
    { id: 'ayam-masak-hitam', bm: 'Ayam Masak Hitam', en: 'Ayam Masak Hitam' },
    { id: 'ayam-goreng', bm: 'Ayam Goreng', en: 'Fried Chicken' },
  ],
}

const DAGING_DH: Course = {
  id: 'daging',
  labelBm: 'Daging',
  labelEn: 'Beef',
  pick: 'one',
  options: [
    { id: 'daging-kari', bm: 'Daging Kari', en: 'Beef Curry' },
    { id: 'daging-masak-hitam', bm: 'Daging Masak Hitam', en: 'Daging Masak Hitam' },
    { id: 'daging-kurma', bm: 'Daging Kurma', en: 'Beef Kurma' },
  ],
}

const DAGING_SS: Course = {
  id: 'daging',
  labelBm: 'Daging',
  labelEn: 'Beef',
  pick: 'one',
  options: [
    { id: 'daging-kari', bm: 'Daging Kari', en: 'Beef Curry' },
    { id: 'daging-masak-hitam', bm: 'Daging Masak Hitam', en: 'Daging Masak Hitam' },
    { id: 'daging-dalca', bm: 'Daging Dalca', en: 'Beef Dalca' },
  ],
}

const SAMPINGAN_DH: Course = {
  id: 'sampingan',
  labelBm: 'Sampingan',
  labelEn: 'Side',
  pick: 'one',
  options: [
    { id: 'sambal-ikan-masin', bm: 'Sambal Goreng Ikan Masin', en: 'Sambal Goreng Salted Fish' },
    { id: 'keceni-nanas', bm: 'Keceni Nanas', en: 'Pineapple Keceni' },
  ],
}

const SAMPINGAN_SS: Course = {
  id: 'sampingan',
  labelBm: 'Sampingan',
  labelEn: 'Side',
  pick: 'one',
  options: [
    { id: 'keceni-nanas', bm: 'Keceni Nanas', en: 'Pineapple Keceni' },
    { id: 'sayur-campur', bm: 'Sayur Campur', en: 'Mixed Vegetables' },
    { id: 'acar-buah', bm: 'Acar Buah', en: 'Acar Buah' },
  ],
}

const SAMBAL_SS: Course = {
  id: 'sambal',
  labelBm: 'Sambal Goreng',
  labelEn: 'Sambal Goreng',
  pick: 'one',
  options: [
    { id: 'sambal-ikan-masin', bm: 'Sambal Goreng Ikan Masin', en: 'Sambal Goreng Salted Fish' },
    { id: 'sambal-hati', bm: 'Sambal Goreng Hati', en: 'Sambal Goreng Liver' },
    { id: 'sambal-perut', bm: 'Sambal Goreng Perut', en: 'Sambal Goreng Tripe' },
  ],
}

const BUAH_SS: Course = {
  id: 'buah',
  labelBm: 'Buah',
  labelEn: 'Fruit',
  pick: 'one',
  options: [
    { id: 'tembikai', bm: 'Tembikai', en: 'Watermelon' },
    { id: 'tembikai-susu', bm: 'Tembikai Susu', en: 'Honeydew' },
    { id: 'oren', bm: 'Oren', en: 'Orange' },
  ],
}

const IKAN_SK: Course = {
  id: 'ikan',
  labelBm: 'Ikan',
  labelEn: 'Fish',
  pick: 'one',
  options: [
    {
      id: 'fillet-masam-manis',
      bm: 'Fillet Ikan Masak Masam Manis',
      en: 'Sweet & Sour Fish Fillet',
    },
    { id: 'tongkol-masak-hitam', bm: 'Tongkol Masak Hitam', en: 'Tongkol Masak Hitam' },
  ],
}

export const PACKAGES: Pkg[] = [
  {
    id: 'darul-hana',
    nameBm: 'Pakej Darul Hana',
    nameEn: 'Darul Hana Package',
    usual: 57,
    current: 45,
    roleBm: 'Permulaan',
    roleEn: 'Introductory',
    blurbBm: 'Hidangan asas yang kemas. Sesuai untuk majlis 500 hingga 800 tetamu.',
    blurbEn: 'A clean, straightforward spread. Suited to 500–800 guests.',
    courses: [RICE, AYAM_DH, DAGING_DH, SAMPINGAN_DH],
    includedBm: ['Satu buah bermusim', 'Kordial sejuk'],
    includedEn: ['One seasonal fruit', 'Chilled cordial'],
  },
  {
    id: 'seri-santubong',
    nameBm: 'Pakej Seri Santubong',
    nameEn: 'Seri Santubong Package',
    usual: 70,
    current: 58,
    roleBm: 'Paling berbaloi',
    roleEn: 'Best value',
    blurbBm: 'Pilihan paling kerap. Lima hidangan pilihan, air di setiap meja.',
    blurbEn: 'The most-picked option. Five choices, water on every table.',
    courses: [RICE, AYAM_SS, DAGING_SS, SAMPINGAN_SS, SAMBAL_SS, BUAH_SS],
    includedBm: ['Kordial', 'Air meja (1.5 L atau 1 cawan setiap meja)'],
    includedEn: ['Cordial', 'Table water (1.5 L or 1 cup per table)'],
  },
  {
    id: 'seri-keringkam',
    nameBm: 'Pakej Seri Keringkam',
    nameEn: 'Seri Keringkam Package',
    usual: 85,
    current: 73,
    roleBm: 'Utama',
    roleEn: 'Flagship',
    blurbBm: 'Seri Santubong dengan tambahan hidangan ikan.',
    blurbEn: 'Seri Santubong plus a fish course.',
    courses: [RICE, AYAM_SS, DAGING_SS, SAMPINGAN_SS, SAMBAL_SS, BUAH_SS, IKAN_SK],
    includedBm: ['Kordial', 'Air meja (1.5 L atau 1 cawan setiap meja)'],
    includedEn: ['Cordial', 'Table water (1.5 L or 1 cup per table)'],
  },
]

export const DEFAULT_PACKAGE: PackageId = 'seri-santubong'

export function getPackage(id: PackageId): Pkg {
  return PACKAGES.find((p) => p.id === id) ?? PACKAGES[1]
}

export function isPackageId(v: string | null | undefined): v is PackageId {
  return !!v && PACKAGES.some((p) => p.id === v)
}
