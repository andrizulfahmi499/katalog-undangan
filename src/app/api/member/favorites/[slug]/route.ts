import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const memberId = req.headers.get('x-member-id')
  if (!memberId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { slug: themeSlug } = await params

  try {
    const existing = await db.favoriteTheme.findUnique({
      where: { memberId_themeSlug: { memberId, themeSlug } },
    })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Favorite not found' }, { status: 404 })
    }

    await db.favoriteTheme.delete({
      where: { memberId_themeSlug: { memberId, themeSlug } },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE favorite error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete favorite' }, { status: 500 })
  }
}
