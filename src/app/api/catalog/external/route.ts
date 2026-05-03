import { NextResponse } from 'next/server'

/**
 * GET /api/catalog/external
 *
 * Fetches template themes from external catalog (akainvitation.com).
 * Returns list of themes with images and metadata for display.
 */

export const dynamic = 'force-dynamic'

// Theme data fetched from akainvitation.com/tema
const THEMES = [
  // Wedding themes
  { id: 'blue-butterfly', name: 'Blue Butterfly', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/blue-butterfly/blue-butterfly.webp' },
  { id: 'black-aysha', name: 'Black Aysha', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/black-aysha/black-aysha.webp' },
  { id: 'fairy-pink', name: 'Fairy Pink', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/fairy-pink/fairy-pink.webp' },
  { id: 'light-begins', name: 'Light Begins', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/light-begins/light-begins.webp' },
  { id: 'emerald-ampera', name: 'Emerald Ampera', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/emerald-ampera/emerald-ampera.webp' },
  { id: 'garuda', name: 'Garuda', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/garuda/garuda.webp' },
  { id: 'kua', name: 'KUA', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/kua/kua.webp' },
  { id: 'art-blue-java', name: 'Art Blue Java', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/art-blue-java/art-blue-java.webp' },
  { id: 'betawi-java', name: 'Betawi Java', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/betawi-java/betawi-java.webp' },
  { id: 'batak-merah', name: 'Batak Merah', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/batak-merah/batak-merah.webp' },
  { id: 'batak-minang', name: 'Batak Minang', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/batak-minang/batak-minang.webp' },
  { id: 'sunda-minang', name: 'Sunda Minang', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/sunda-minang/sunda-minang.webp' },
  { id: 'jawa-lampung', name: 'Jawa Lampung', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/jawa-lampung/jawa-lampung.webp' },
  { id: 'turkish-green', name: 'Turkish Green', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/turkish-green/turkish-green.webp' },
  { id: 'fuchsia-adat', name: 'Fuchsia Adat', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/fuchsia-adat/fuchsia-adat.webp' },
  { id: 'gadang', name: 'Gadang', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/gadang/gadang.webp' },
  { id: 'brown-passport', name: 'Brown Passport', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/brown-passport/brown-passport.webp' },
  { id: 'garden-party', name: 'Garden Party', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/garden-party/garden-party.webp' },
  { id: 'chestnut-art', name: 'Chestnut Art', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/chestnut-art/chestnut-art.webp' },
  { id: 'wedding-sale', name: 'Wedding Sale', category: 'Pernikahan', image: 'https://id.akainvitation.com/themes/wedding-sale/wedding-sale.webp' },

  // Birthday themes
  { id: 'karnaval', name: 'Karnaval', category: 'Ultah', image: 'https://id.akainvitation.com/themes/karnaval/karnaval.webp' },
  { id: 'bunga-bunga', name: 'Bunga Bunga', category: 'Ultah', image: 'https://id.akainvitation.com/themes/bunga-bunga/bunga-bunga.webp' },
  { id: 'tutti-fruity', name: 'Tutti Fruity', category: 'Ultah', image: 'https://id.akainvitation.com/themes/tutti-fruity/tutti-fruity.webp' },
  { id: 'turtles', name: 'Turtles', category: 'Ultah', image: 'https://id.akainvitation.com/themes/turtles/turtles.webp' },
  { id: 'bikini-bottom', name: 'Bikini Bottom', category: 'Ultah', image: 'https://id.akainvitation.com/themes/bikini-bottom/bikini-bottom.webp' },
  { id: 'blue-sd', name: 'Blue SD', category: 'Ultah', image: 'https://id.akainvitation.com/themes/blue-sd/blue-sd.webp' },
  { id: 'child-cafe', name: 'Child Cafe', category: 'Ultah', image: 'https://id.akainvitation.com/themes/child-cafe/child-cafe.webp' },
  { id: 'kpop-demond', name: 'Kpop Demond', category: 'Ultah', image: 'https://id.akainvitation.com/themes/kpop-demond/kpop-demond.webp' },
  { id: 'free-fire', name: 'Free Fire', category: 'Ultah', image: 'https://id.akainvitation.com/themes/free-fire/free-fire.webp' },
  { id: 'lion-february', name: 'Lion February', category: 'Ultah', image: 'https://id.akainvitation.com/themes/lion-february/lion-february.webp' },
  { id: 'infotainment', name: 'Infotainment', category: 'Ultah', image: 'https://id.akainvitation.com/themes/infotainment/infotainment.webp' },
  { id: 'dangdut-awards', name: 'Dangdut Awards', category: 'Ultah', image: 'https://id.akainvitation.com/themes/dangdut-awards/dangdut-awards.webp' },
  { id: 'kuda-macan', name: 'Kuda Macan', category: 'Ultah', image: 'https://id.akainvitation.com/themes/kuda-macan/kuda-macan.webp' },
  { id: 'doctorverse', name: 'Doctorverse', category: 'Ultah', image: 'https://id.akainvitation.com/themes/doctorverse/doctorverse.webp' },
  { id: 'spotilove', name: 'Spotilove', category: 'Ultah', image: 'https://id.akainvitation.com/themes/spotilove/spotilove.webp' },

  // Aqiqah themes
  { id: 'beautiful-aqsa', name: 'Beautiful Aqsa', category: 'Aqiqah', image: 'https://id.akainvitation.com/themes/beautiful-aqsa/beautiful-aqsa.webp' },
  { id: 'blue-voyage', name: 'Blue Voyage', category: 'Aqiqah', image: 'https://id.akainvitation.com/themes/blue-voyage/blue-voyage.webp' },
  { id: 'bon-voyage-merah-putih', name: 'Bon Voyage Merah Putih', category: 'Aqiqah', image: 'https://id.akainvitation.com/themes/bon-voyage-merah-putih/bon-voyage-merah-putih.webp' },
  { id: 'bonvoyage-v3', name: 'Bon Voyage V3', category: 'Aqiqah', image: 'https://id.akainvitation.com/themes/bonvoyage-v3/bonvoyage-v3.webp' },
  { id: 'bonvoyage-v4', name: 'Bon Voyage V4', category: 'Aqiqah', image: 'https://id.akainvitation.com/themes/bonvoyage-v4/bonvoyage-v4.webp' },

  // Khitan themes
  { id: 'emerald-uici', name: 'Emerald UICI', category: 'Khitan', image: 'https://id.akainvitation.com/themes/emerald-uici/emerald-uici.webp' },
  { id: 'kalibrasi-hati', name: 'Kalibrasi Hati', category: 'Khitan', image: 'https://id.akainvitation.com/themes/kalibrasi-hati/kalibrasi-hati.webp' },
  { id: 'blue-green-bon-voyage', name: 'Blue Green Bon Voyage', category: 'Khitan', image: 'https://id.akainvitation.com/themes/blue-green-bon-voyage/blue-green-bon-voyage.webp' },
  { id: 'line-art-brown', name: 'Line Art Brown', category: 'Khitan', image: 'https://id.akainvitation.com/themes/line-art-brown/line-art-brown.webp' },

  // Gathering/Corporate themes
  { id: 'adm-gathering', name: 'ADM Gathering', category: 'Gathering', image: 'https://id.akainvitation.com/themes/adm-gathering/adm-gathering.webp' },
  { id: 'annual-meeting', name: 'Annual Meeting', category: 'Gathering', image: 'https://id.akainvitation.com/themes/annual-meeting/annual-meeting.webp' },
  { id: 'company-retreat', name: 'Company Retreat', category: 'Gathering', image: 'https://id.akainvitation.com/themes/company-retreat/company-retreat.webp' },
  { id: 'buka-bersama', name: 'Buka Bersama', category: 'Gathering', image: 'https://id.akainvitation.com/themes/buka-bersama/buka-bersama.webp' },
  { id: 'fresh-halal-bihalal', name: 'Fresh Halal Bihalal', category: 'Gathering', image: 'https://id.akainvitation.com/themes/fresh-halal-bihalal/fresh-halal-bihalal.webp' },
  { id: 'bedah-buku', name: 'Bedah Buku', category: 'Gathering', image: 'https://id.akainvitation.com/themes/bedah-buku/bedah-buku.webp' },
  { id: 'stikes', name: 'STIKes', category: 'Gathering', image: 'https://id.akainvitation.com/themes/stikes/stikes.webp' },
  { id: 'bpjs', name: 'BPJS', category: 'Gathering', image: 'https://id.akainvitation.com/themes/bpjs/bpjs.webp' },
  { id: 'honda', name: 'Honda', category: 'Gathering', image: 'https://id.akainvitation.com/themes/honda/honda.webp' },
  { id: 'bugis-emerald', name: 'Bugis Emerald', category: 'Gathering', image: 'https://id.akainvitation.com/themes/bugis-emerald/bugis-emerald.webp' },
  { id: 'konser-raya-1', name: 'Konser Raya 1', category: 'Gathering', image: 'https://id.akainvitation.com/themes/konser-raya-1/konser-raya-1.webp' },
  { id: 'konser-raya-2', name: 'Konser Raya 2', category: 'Gathering', image: 'https://id.akainvitation.com/themes/konser-raya-2/konser-raya-2.webp' },
  { id: 'xabiru', name: 'Xabiru', category: 'Gathering', image: 'https://id.akainvitation.com/themes/xabiru/xabiru.webp' },
  { id: 'tuku', name: 'Tuku', category: 'Gathering', image: 'https://id.akainvitation.com/themes/tuku/tuku.webp' },

  // Graduation themes
  { id: 'wisuda-merah-putih', name: 'Wisuda Merah Putih', category: 'Wisuda', image: 'https://id.akainvitation.com/themes/wisuda-merah-putih/wisuda-merah-putih.webp' },
]

// Categories with display names
const CATEGORIES = [
  { id: 'all', name: 'Semua' },
  { id: 'Pernikahan', name: 'Pernikahan' },
  { id: 'Ultah', name: 'Ulang Tahun' },
  { id: 'Aqiqah', name: 'Aqiqah' },
  { id: 'Khitan', name: 'Khitan' },
  { id: 'Gathering', name: 'Gathering' },
  { id: 'Wisuda', name: 'Wisuda' },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'

    // Filter themes by category if not 'all'
    const filteredThemes = category === 'all'
      ? THEMES
      : THEMES.filter(theme => theme.category === category)

    return NextResponse.json({
      success: true,
      data: {
        themes: filteredThemes,
        categories: CATEGORIES,
        total: THEMES.length,
        category,
      },
    })
  } catch (error) {
    console.error('Error fetching external catalog:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch catalog' },
      { status: 500 }
    )
  }
}