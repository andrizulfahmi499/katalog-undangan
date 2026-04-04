import { NextResponse } from 'next/server'

// Mock catalog data - dalam production, ini bisa diambil dari database
const catalogTemplates = [
  {
    id: 1,
    name: 'Elegant Floral',
    category: 'Floral',
    price: '349K',
    image: '🌸',
    color: 'from-pink-300 to-rose-300',
    views: 1234,
    likes: 89,
    featured: true
  },
  {
    id: 2,
    name: 'Modern Minimalist',
    category: 'Minimalist',
    price: '199K',
    image: '✨',
    color: 'from-slate-300 to-gray-300',
    views: 987,
    likes: 67,
    featured: true
  },
  {
    id: 3,
    name: 'Rustic Wedding',
    category: 'Rustic',
    price: '299K',
    image: '🍂',
    color: 'from-amber-300 to-orange-300',
    views: 756,
    likes: 54,
    featured: false
  },
  {
    id: 4,
    name: 'Gold Luxury',
    category: 'Luxury',
    price: '599K',
    image: '👑',
    color: 'from-yellow-300 to-amber-400',
    views: 2341,
    likes: 156,
    featured: true
  },
  {
    id: 5,
    name: 'Beach Paradise',
    category: 'Beach',
    price: '399K',
    image: '🏖️',
    color: 'from-cyan-300 to-blue-300',
    views: 654,
    likes: 45,
    featured: false
  },
  {
    id: 6,
    name: 'Classic Romance',
    category: 'Classic',
    price: '249K',
    image: '💕',
    color: 'from-rose-300 to-pink-400',
    views: 1876,
    likes: 123,
    featured: true
  },
  {
    id: 7,
    name: 'Bohemian Dream',
    category: 'Bohemian',
    price: '349K',
    image: '🌿',
    color: 'from-green-300 to-emerald-400',
    views: 543,
    likes: 38,
    featured: false
  },
  {
    id: 8,
    name: 'Royal Purple',
    category: 'Luxury',
    price: '499K',
    image: '💜',
    color: 'from-purple-300 to-violet-400',
    views: 876,
    likes: 72,
    featured: false
  },
  {
    id: 9,
    name: 'Sunset Garden',
    category: 'Floral',
    price: '299K',
    image: '🌺',
    color: 'from-orange-300 to-red-300',
    views: 698,
    likes: 51,
    featured: false
  },
  {
    id: 10,
    name: 'Winter Wonderland',
    category: 'Seasonal',
    price: '449K',
    image: '❄️',
    color: 'from-blue-200 to-indigo-300',
    views: 1098,
    likes: 87,
    featured: true
  },
  {
    id: 11,
    name: 'Vintage Charm',
    category: 'Vintage',
    price: '279K',
    image: '📜',
    color: 'from-stone-300 to-amber-200',
    views: 789,
    likes: 59,
    featured: false
  },
  {
    id: 12,
    name: 'Islamic Elegance',
    category: 'Islamic',
    price: '399K',
    image: '🕌',
    color: 'from-teal-300 to-cyan-400',
    views: 1567,
    likes: 112,
    featured: true
  }
]

const categories = ['Semua', 'Floral', 'Minimalist', 'Luxury', 'Rustic', 'Classic', 'Bohemian', 'Vintage', 'Islamic', 'Beach']

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let filteredTemplates = [...catalogTemplates]

    // Filter by category
    if (category && category !== 'Semua') {
      filteredTemplates = filteredTemplates.filter(t => t.category === category)
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase()
      filteredTemplates = filteredTemplates.filter(
        t =>
          t.name.toLowerCase().includes(searchLower) ||
          t.category.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        templates: filteredTemplates,
        categories,
        total: filteredTemplates.length
      }
    })
  } catch (error) {
    console.error('Error fetching catalog:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch catalog'
      },
      { status: 500 }
    )
  }
}
