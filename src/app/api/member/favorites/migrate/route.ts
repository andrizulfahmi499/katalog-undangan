import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCatalogThemeBySlug } from '@/lib/catalogThemes'

export async function POST(req: NextRequest) {
  const memberId = req.headers.get('x-member-id')
  if (!memberId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const { slugs } = await req.json()
    if (!Array.isArray(slugs)) {
      return NextResponse.json({ success: false, error: 'slugs must be an array' }, { status: 400 })
    }

    let migrated = 0
    let skipped = 0

    for (const slug of slugs) {
      const theme = getCatalogThemeBySlug(slug)
      const themeName = theme?.name || slug
      try {
        await db.favoriteTheme.upsert({
          where: { memberId_themeSlug: { memberId, themeSlug: slug } },
          update: {},
          create: { memberId, themeSlug: slug, themeName },
        })
        migrated++
      } catch {
        skipped++
      }
    }

    return NextResponse.json({ success: true, migrated, skipped })
  } catch (error) {
    console.error('Migrate favorites error:', error)
    return NextResponse.json({ success: false, error: 'Migration failed' }, { status: 500 })
  }
}
