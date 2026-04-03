import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://id.akainvitation.com'

export async function GET() {
  try {
    // Fetch categories from Halalku Digital API
    const response = await fetch(`${BASE_URL}/seller/api/v1/categories`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`)
    }

    const data = await response.json()

    // Extract categories
    const categories = data.data || []

    // Transform categories to our format
    const transformedCategories = [
      { id: 'all', name: 'Semua', slug: 'all' },
      ...categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
      })),
    ]

    return NextResponse.json({
      success: true,
      data: transformedCategories,
    })
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch categories',
        data: [{ id: 'all', name: 'Semua', slug: 'all' }],
      },
      { status: 500 }
    )
  }
}
