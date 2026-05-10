import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const setting = await db.globalSetting.findUnique({
      where: { id: 'global' },
    })

    if (!setting) {
      // Return default if not exists
      return NextResponse.json({ success: true, data: { landingPageTheme: 'default' } })
    }

    return NextResponse.json({ success: true, data: setting })
  } catch (error: any) {
    console.error('Error fetching global settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch global settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { landingPageTheme, landingPageFavicon, catalogLayout } = body

    if (!landingPageTheme) {
      return NextResponse.json(
        { success: false, error: 'landingPageTheme is required' },
        { status: 400 }
      )
    }

    // Validate catalogLayout
    const validLayouts = ['grid', 'thumbnail']
    const resolvedLayout = validLayouts.includes(catalogLayout) ? catalogLayout : undefined

    const setting = await db.globalSetting.upsert({
      where: { id: 'global' },
      update: {
        landingPageTheme,
        landingPageFavicon,
        ...(resolvedLayout !== undefined && { catalogLayout: resolvedLayout }),
      },
      create: {
        id: 'global',
        landingPageTheme,
        landingPageFavicon,
        catalogLayout: resolvedLayout || 'grid',
      },
    })

    return NextResponse.json({ success: true, data: setting })
  } catch (error: any) {
    console.error('Error updating global settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update global settings' },
      { status: 500 }
    )
  }
}
