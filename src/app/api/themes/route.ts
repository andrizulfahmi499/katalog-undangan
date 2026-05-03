import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://id.akainvitation.com'
const PHONE_NUMBER = '6285299659458'

// Fallback static themes — digunakan jika API external gagal
const FALLBACK_THEMES = [
  { id: 1, name: 'Dreamy Love', slug: 'dreamy-love', featured_image: '/templates/dreamylove/thumb.jpg', category: 'Floral', price: '70.000', previewUrl: '#catalog', orderUrl: `https://wa.me/${PHONE_NUMBER}?text=Halo, saya mau pesan tema Dreamy Love` },
  { id: 2, name: 'Elegant Gold', slug: 'elegant-gold', featured_image: '/templates/gold/thumb.jpg', category: 'Luxury', price: '100.000', previewUrl: '#catalog', orderUrl: `https://wa.me/${PHONE_NUMBER}?text=Halo, saya mau pesan tema Elegant Gold` },
  { id: 3, name: 'Minimalist', slug: 'minimalist', featured_image: '/templates/minimalist/thumb.jpg', category: 'Minimalist', price: '70.000', previewUrl: '#catalog', orderUrl: `https://wa.me/${PHONE_NUMBER}?text=Halo, saya mau pesan tema Minimalist` },
  { id: 4, name: 'Rose Garden', slug: 'rose-garden', featured_image: '/templates/rose/thumb.jpg', category: 'Floral', price: '100.000', previewUrl: '#catalog', orderUrl: `https://wa.me/${PHONE_NUMBER}?text=Halo, saya mau pesan tema Rose Garden` },
  { id: 5, name: 'Beach Paradise', slug: 'beach-paradise', featured_image: '/templates/beach/thumb.jpg', category: 'Beach', price: '70.000', previewUrl: '#catalog', orderUrl: `https://wa.me/${PHONE_NUMBER}?text=Halo, saya mau pesan tema Beach Paradise` },
  { id: 6, name: 'Royal Purple', slug: 'royal-purple', featured_image: '/templates/royal/thumb.jpg', category: 'Luxury', price: '150.000', previewUrl: '#catalog', orderUrl: `https://wa.me/${PHONE_NUMBER}?text=Halo, saya mau pesan tema Royal Purple` },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '12'
    const categoryId = searchParams.get('categoryId')

    // Build URL
    let apiUrl = `${BASE_URL}/seller/api/v1/products/websites?page=${page}&limit=${limit}`

    if (categoryId) {
      apiUrl += `&categoryId=${categoryId}`
    }

    // Fetch from Halalku Digital API
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }

    const data = await response.json()

    // Extract themes and pagination info
    const themes = data.data?.data || data.data || []
    const nextPageUrl = data.data?.next_page_url || null

    // Transform themes to our format
    const transformedThemes = themes.map((theme: any) => ({
      id: theme.id,
      name: theme.name,
      slug: theme.slug,
      featured_image: theme.featured_image,
      category: theme.category?.name || 'Tema',
      price: theme.price || '0',
      originalPrice: theme.original_price || null,
      discount: theme.discount || null,
      description: theme.description || '',
      previewUrl: `${BASE_URL}/preview/${theme.slug}`,
      orderUrl: `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(`Halo, saya mau pesan tema ${theme.name}`)}`,
    }))

    return NextResponse.json({
      success: true,
      data: transformedThemes,
      pagination: {
        nextPageUrl: nextPageUrl ? nextPageUrl.replace('http:', 'https:') : null,
        hasMore: !!nextPageUrl,
      },
      total: data.data?.total || data.total || transformedThemes.length,
    })
  } catch (error: any) {
    // Fallback: gunakan static data jika API gagal
    console.warn('API external unavailable, using fallback themes:', error.message)

    const page = parseInt(request.nextUrl.searchParams.get('page') || '1')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '12')
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedThemes = FALLBACK_THEMES.slice(start, end)

    return NextResponse.json({
      success: true,
      data: paginatedThemes,
      pagination: {
        nextPageUrl: null,
        hasMore: end < FALLBACK_THEMES.length,
      },
      total: FALLBACK_THEMES.length,
      isFallback: true,
    })
  }
}
