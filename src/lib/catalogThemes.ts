export type CatalogTheme = {
  slug: string
  name: string
  category: string
  tags: string[]
  imageUrl: string
  previewUrl: string
}

const BASE = 'https://id.akainvitation.com'

function makeTheme(slug: string, name: string, category: string, tags: string[]): CatalogTheme {
  return {
    slug,
    name,
    category,
    tags,
    imageUrl: `${BASE}/themes/${slug}/${slug}.webp`,
    previewUrl: `${BASE}/preview/${slug}`,
  }
}

export const CATALOG_THEMES: CatalogTheme[] = [
  makeTheme('sage-watercolor', 'Sage Watercolor', 'Pernikahan', ['watercolor', 'sage', 'elegan']),
  makeTheme('fairy-pink', 'Fairy Pink', 'Pernikahan', ['pink', 'fairy', 'romantis']),
  makeTheme('minimalist-cream', 'Minimalist Cream', 'Pernikahan', ['minimalis', 'cream', 'modern']),
  makeTheme('dream-land', 'Dream Land', 'Pernikahan', ['floral', 'elegan', 'premium']),
  makeTheme('corelia', 'Corelia', 'Pernikahan', ['cream', 'mewah', 'tipografi']),
  makeTheme('elgaze', 'Elgaze Luxury', 'Pernikahan', ['dark', 'luxury', 'cinematic']),
  makeTheme('verdant', 'Verdant Elegance', 'Pernikahan', ['hijau', 'elegan', 'segar']),
  makeTheme('red-beige', 'Red Beige', 'Pernikahan', ['merah', 'beige', 'klasik']),
  makeTheme('spotilove', 'SpotiLove', 'Pernikahan', ['spotify', 'modern', 'unik']),
  makeTheme('maroon-vintage', 'Maroon Vintage', 'Pernikahan', ['maroon', 'vintage', 'klasik']),
  makeTheme('line-art-brown', 'Line Art Brown', 'Pernikahan', ['line-art', 'coklat', 'minimalis']),
  makeTheme('fuchsia-adat', 'Fuchsia Adat', 'Pernikahan', ['fuchsia', 'adat', 'tradisional']),
  makeTheme('brown-passport', 'Brown Passport', 'Pernikahan', ['coklat', 'passport', 'unik']),
  makeTheme('retro-pink', 'Retro Pink', 'Pernikahan', ['retro', 'pink', 'vintage']),
  makeTheme('batak-merah', 'Batak Merah', 'Pernikahan', ['batak', 'merah', 'adat']),
  makeTheme('batak-minang', 'Batak Minang', 'Pernikahan', ['batak', 'minang', 'adat']),
  makeTheme('betawi-java', 'Betawi Java', 'Pernikahan', ['betawi', 'jawa', 'adat']),
  makeTheme('betawi-jawa', 'Betawi Jawa', 'Pernikahan', ['betawi', 'jawa', 'tradisional']),
  makeTheme('melayu-padang', 'Melayu Padang', 'Pernikahan', ['melayu', 'padang', 'adat']),
  makeTheme('melayu-pastel', 'Melayu Pastel', 'Pernikahan', ['melayu', 'pastel', 'lembut']),
  makeTheme('melayu', 'Melayu', 'Pernikahan', ['melayu', 'tradisional', 'adat']),
  makeTheme('maroon-aceh', 'Maroon Aceh', 'Pernikahan', ['maroon', 'aceh', 'adat']),
  makeTheme('palembang-aceh', 'Palembang Aceh', 'Pernikahan', ['palembang', 'aceh', 'adat']),
  makeTheme('jawa-lampung', 'Jawa Lampung', 'Pernikahan', ['jawa', 'lampung', 'adat']),
  makeTheme('sunda-minang', 'Sunda Minang', 'Pernikahan', ['sunda', 'minang', 'adat']),
  makeTheme('padang', 'Padang', 'Pernikahan', ['padang', 'minang', 'tradisional']),
  makeTheme('mandarin', 'Mandarin', 'Pernikahan', ['mandarin', 'chinese', 'merah']),
  makeTheme('soft-chinese', 'Soft Chinese', 'Pernikahan', ['chinese', 'lembut', 'pastel']),
  makeTheme('kua', 'KUA', 'Pernikahan', ['kua', 'islami', 'sederhana']),
  makeTheme('xabiru', 'Xabiru', 'Pernikahan', ['biru', 'modern', 'elegan']),
  makeTheme('blue-voyage', 'Blue Voyage', 'Pernikahan', ['biru', 'voyage', 'modern']),
  makeTheme('turkish-green', 'Turkish Green', 'Pernikahan', ['hijau', 'turkish', 'elegan']),
  makeTheme('novianty', 'Novianty', 'Pernikahan', ['floral', 'elegan', 'romantis']),
  makeTheme('shalvynne', 'Shalvynne', 'Pernikahan', ['elegan', 'modern', 'premium']),
  makeTheme('black-aysha', 'Black Aysha', 'Pernikahan', ['hitam', 'elegan', 'mewah']),
  makeTheme('chestnut-art', 'Chestnut Art', 'Pernikahan', ['coklat', 'art', 'artistik']),
  makeTheme('kalibrasi-hati', 'Kalibrasi Hati', 'Pernikahan', ['modern', 'romantis', 'elegan']),
  makeTheme('emerald-uici', 'Emerald UICI', 'Pernikahan', ['emerald', 'hijau', 'elegan']),
  makeTheme('emerald-ampera', 'Emerald Ampera', 'Pernikahan', ['emerald', 'ampera', 'merah-putih']),
  makeTheme('phinisi-maroon', 'Phinisi Maroon', 'Pernikahan', ['phinisi', 'maroon', 'sulawesi']),
  makeTheme('gadang', 'Gadang', 'Pernikahan', ['gadang', 'minang', 'tradisional']),
  makeTheme('sanno', 'Sanno', 'Pernikahan', ['modern', 'minimalis', 'elegan']),
  makeTheme('lotte-gold', 'Lotte Gold', 'Pernikahan', ['gold', 'mewah', 'premium']),
  makeTheme('bonvoyage-v3', 'Bonvoyage V3', 'Pernikahan', ['voyage', 'modern', 'elegan']),
  makeTheme('bonvoyage-v4', 'Bonvoyage V4', 'Pernikahan', ['voyage', 'premium', 'elegan']),
  makeTheme('blue-green-bon-voyage', 'Blue Green Bon Voyage', 'Pernikahan', ['biru', 'hijau', 'voyage']),
  makeTheme('art-blue-java', 'Art Blue Java', 'Pernikahan', ['biru', 'jawa', 'artistik']),
  makeTheme('garden-party', 'Garden Party', 'Pernikahan', ['garden', 'floral', 'segar']),
  makeTheme('company-retreat', 'Company Retreat', 'Acara Perusahaan', ['perusahaan', 'retreat', 'profesional']),
  makeTheme('annual-meeting', 'Annual Meeting', 'Acara Perusahaan', ['meeting', 'tahunan', 'profesional']),
  makeTheme('nusantara-gas', 'Nusantara Gas', 'Acara Perusahaan', ['perusahaan', 'gas', 'formal']),
  makeTheme('semen-bima', 'Semen Bima', 'Acara Perusahaan', ['perusahaan', 'formal', 'profesional']),
  makeTheme('honda', 'Honda', 'Acara Perusahaan', ['honda', 'otomotif', 'merah']),
  makeTheme('smf', 'SMF', 'Acara Perusahaan', ['perusahaan', 'formal', 'biru']),
  makeTheme('bpjs', 'BPJS', 'Acara Perusahaan', ['bpjs', 'kesehatan', 'formal']),
  makeTheme('doctorverse', 'DoctorVerse', 'Acara Perusahaan', ['dokter', 'medis', 'profesional']),
  makeTheme('nagara-institute', 'Nagar Institute', 'Acara Perusahaan', ['institusi', 'formal', 'profesional']),
  makeTheme('stikes', 'Stikes', 'Acara Perusahaan', ['stikes', 'kesehatan', 'formal']),
  makeTheme('nurul-fikri', 'Nurul Fikri', 'Acara Perusahaan', ['islami', 'pendidikan', 'formal']),
  makeTheme('sctv-awards-25', 'SCTV Awards', 'Acara Perusahaan', ['sctv', 'awards', 'hiburan']),
  makeTheme('sctv-35', 'SCTV 35', 'Acara Perusahaan', ['sctv', 'anniversary', 'hiburan']),
  makeTheme('sctv-award', 'SCTV Award', 'Acara Perusahaan', ['sctv', 'award', 'hiburan']),
  makeTheme('dangdut-awards', 'Dangdut Awards', 'Acara Perusahaan', ['dangdut', 'awards', 'musik']),
  makeTheme('infotainment', 'INFOTAINMENT', 'Acara Perusahaan', ['infotainment', 'hiburan', 'media']),
  makeTheme('adm-gathering', 'Adm Gathering', 'Gathering', ['gathering', 'perusahaan', 'formal']),
  makeTheme('karnaval', 'Karnaval', 'Gathering', ['karnaval', 'meriah', 'warna-warni']),
  makeTheme('silaturahmi-akbar', 'Silaturahmi Akbar', 'Gathering', ['silaturahmi', 'islami', 'akbar']),
  makeTheme('bedah-buku', 'Bedah Buku', 'Seminar', ['buku', 'seminar', 'pendidikan']),
  makeTheme('pentas-akhir', 'Pentas Akhir', 'Seminar', ['pentas', 'seni', 'pertunjukan']),
  makeTheme('pelulusan', 'Pelulusan', 'Wisuda', ['wisuda', 'kelulusan', 'pendidikan']),
  makeTheme('wisuda-merah-putih', 'Wisuda Merah Putih', 'Wisuda', ['wisuda', 'merah-putih', 'nasional']),
  makeTheme('school-blue', 'School Blue', 'Wisuda', ['sekolah', 'biru', 'pendidikan']),
  makeTheme('blue-sd', 'Blue SD', 'Wisuda', ['sd', 'biru', 'anak']),
  makeTheme('pink-party', 'Pink Party', 'Ulang Tahun', ['pink', 'party', 'meriah']),
  makeTheme('birthday-sky', 'Birthday Sky', 'Ulang Tahun', ['biru', 'langit', 'ulang-tahun']),
  makeTheme('birthday-orange', 'Birthday Orange', 'Ulang Tahun', ['orange', 'meriah', 'ulang-tahun']),
  makeTheme('tutti-fruity', 'Tutti Fruity', 'Ulang Tahun', ['buah', 'warna-warni', 'ceria']),
  makeTheme('child-cafe', 'Child Cafe', 'Ulang Tahun', ['anak', 'cafe', 'lucu']),
  makeTheme('pikachu', 'Pikachu', 'Ulang Tahun', ['pikachu', 'pokemon', 'anak']),
  makeTheme('mickey-red', 'Mickey Red', 'Ulang Tahun', ['mickey', 'merah', 'anak']),
  makeTheme('sanrio', 'Sanrio', 'Ulang Tahun', ['sanrio', 'hello-kitty', 'anak']),
  makeTheme('turtles', 'Turtles', 'Ulang Tahun', ['kura-kura', 'anak', 'lucu']),
  makeTheme('bikini-bottom', 'Bikini Bottom', 'Ulang Tahun', ['spongebob', 'anak', 'lucu']),
  makeTheme('free-fire', 'Free Fire', 'Ulang Tahun', ['game', 'free-fire', 'remaja']),
  makeTheme('kpop-demond', 'KPOP Demond', 'Ulang Tahun', ['kpop', 'korea', 'remaja']),
  makeTheme('baby-shark-new', 'Baby Shark New', 'Ulang Tahun', ['baby-shark', 'anak', 'lucu']),
  makeTheme('buka-bersama', 'Buka Bersama', 'Ramadan', ['ramadan', 'buka-puasa', 'islami']),
  makeTheme('fresh-halal-bihalal', 'Fresh Halal Bihalal', 'Ramadan', ['halal-bihalal', 'lebaran', 'islami']),
  makeTheme('mentari-istimewa', 'Mentari Istimewa', 'Ramadan', ['ramadan', 'islami', 'hangat']),
  makeTheme('beautiful-aqsa', 'Beautiful Aqsa', 'Islami', ['aqsa', 'islami', 'masjid']),
  makeTheme('lion-february', 'Lion February', 'Khusus', ['imlek', 'singa', 'merah']),
  makeTheme('konser-raya-2', 'Konser Raya Maroon', 'Konser', ['konser', 'maroon', 'musik']),
  makeTheme('konser-raya-1', 'Konser Raya Biru', 'Konser', ['konser', 'biru', 'musik']),
  makeTheme('wedding-sale', 'Wedding Sale', 'Pernikahan', ['sale', 'promo', 'wedding']),
  makeTheme('light-begins', 'Light Begins', 'Pernikahan', ['cahaya', 'modern', 'minimalis']),
  makeTheme('shining', 'Shining', 'Pernikahan', ['bersinar', 'elegan', 'premium']),
  makeTheme('blue-butterfly', 'Blue Butterfly', 'Pernikahan', ['biru', 'kupu-kupu', 'elegan']),
  makeTheme('tuku', 'Tuku', 'Pernikahan', ['modern', 'minimalis', 'unik']),
  makeTheme('kuda-macan', 'Kuda Macan', 'Pernikahan', ['kuda', 'macan', 'tradisional']),
  makeTheme('bon-voyage-merah-putih', 'Bon Voyage Merah Putih', 'Pernikahan', ['merah-putih', 'nasional', 'voyage']),
  makeTheme('garuda', 'Garuda', 'Pernikahan', ['garuda', 'nasional', 'merah-putih']),
  makeTheme('bunga-bunga', 'Bunga Bunga', 'Pernikahan', ['bunga', 'floral', 'ceria']),
]

export function getCatalogThemeBySlug(slug: string): CatalogTheme | undefined {
  return CATALOG_THEMES.find((t) => t.slug === slug)
}

export function getCatalogThemesByCategory(category: string): CatalogTheme[] {
  if (category === 'Semua') return CATALOG_THEMES
  return CATALOG_THEMES.filter((t) => t.category === category)
}

export const CATALOG_CATEGORIES = [
  'Semua',
  'Pernikahan',
  'Ulang Tahun',
  'Wisuda',
  'Gathering',
  'Acara Perusahaan',
  'Konser',
  'Ramadan',
  'Islami',
  'Seminar',
  'Khusus',
]
