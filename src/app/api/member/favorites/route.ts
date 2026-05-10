import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function getMemberId(req: NextRequest): string | null {
  return req.headers.get('x-member-id') || null
}

export async function GET(req: NextRequest) {
  const memberId = getMemberId(req)
  if (!memberId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const favorites = await db.favoriteTheme.findMany({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, data: favorites })
  } catch (error) {
    console.error('GET favorites error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const memberId = getMemberId(req)
  if (!memberId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const { themeSlug, themeName } = await req.json()
    if (!themeSlug || !themeName) {
      return NextResponse.json({ success: false, error: 'themeSlug and themeName required' }, { status: 400 })
    }

    const favorite = await db.favoriteTheme.upsert({
      where: { memberId_themeSlug: { memberId, themeSlug } },
      update: {},
      create: { memberId, themeSlug, themeName },
    })
    return NextResponse.json({ success: true, data: favorite })
  } catch (error) {
    console.error('POST favorites error:', error)
    return NextResponse.json({ success: false, error: 'Failed to add favorite' }, { status: 500 })
  }
}
