import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET member profile
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const memberId = searchParams.get('memberId')

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }

    const member = await db.member.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        name: true,
        email: true,
        whatsapp: true,
        landingPageEnabled: true,
        customSlug: true,
        landingPageConfig: true,
      },
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: member })
  } catch (error: any) {
    console.error('Error fetching member profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT to update member landing page settings
export async function PUT(request: NextRequest) {
  try {
    const { memberId, customSlug, landingPageConfig } = await request.json()

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }

    // Check slug uniqueness if customSlug is provided
    if (customSlug) {
      const existingSlug = await db.member.findFirst({
        where: {
          customSlug,
          id: { not: memberId }
        }
      })

      if (existingSlug) {
        return NextResponse.json({ error: 'Slug/URL ini sudah digunakan orang lain, silakan pilih yang lain' }, { status: 400 })
      }
    }

    const updateData: any = {}
    if (customSlug !== undefined) updateData.customSlug = customSlug
    if (landingPageConfig !== undefined) updateData.landingPageConfig = landingPageConfig

    const member = await db.member.update({
      where: { id: memberId, landingPageEnabled: true }, // Extra safety: must be enabled
      data: updateData,
      select: {
        id: true,
        customSlug: true,
        landingPageConfig: true,
      }
    })

    return NextResponse.json({ success: true, data: member })
  } catch (error: any) {
    console.error('Error updating member landing page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
