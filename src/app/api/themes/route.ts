import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://id.akainvitation.com'
const PHONE_NUMBER = '6285299659458'

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
      throw new Error(`Failed to fetch themes: ${response.statusText}`)
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
    })
  } catch (error: any) {
    console.error('Error fetching themes:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch themes',
        data: [],
        pagination: { nextPageUrl: null, hasMore: false },
      },
      { status: 500 }
    )
  }
}
