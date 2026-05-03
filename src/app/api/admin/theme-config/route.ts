import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/theme-config
 *
 * Saves theme configuration for a member's landing page.
 * Simple save without validation to avoid schema issues.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { memberId, config } = body

    if (!memberId) {
      return NextResponse.json(
        { success: false, error: 'memberId is required' },
        { status: 400 }
      )
    }

    if (!config) {
      return NextResponse.json(
        { success: false, error: 'config is required' },
        { status: 400 }
      )
    }

    // Verify member exists
    const member = await db.member.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        landingPageEnabled: true,
      },
    })

    if (!member) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      )
    }

    if (!member.landingPageEnabled) {
      return NextResponse.json(
        { success: false, error: 'Landing page is not enabled' },
        { status: 403 }
      )
    }

    // Save configuration directly without validation
    const updatedMember = await db.member.update({
      where: { id: memberId },
      data: {
        landingPageConfig: config,
      },
      select: {
        id: true,
        landingPageConfig: true,
        landingPageTheme: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Theme configuration saved successfully',
      data: {
        memberId: updatedMember.id,
        theme: updatedMember.landingPageTheme,
        config: updatedMember.landingPageConfig,
      },
    })
  } catch (error: any) {
    console.error('Error saving theme configuration:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save theme configuration' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/theme-config
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const memberId = searchParams.get('memberId')

    if (!memberId) {
      return NextResponse.json(
        { success: false, error: 'memberId is required' },
        { status: 400 }
      )
    }

    const member = await db.member.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        name: true,
        landingPageTheme: true,
        landingPageConfig: true,
        landingPageEnabled: true,
      },
    })

    if (!member) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        memberId: member.id,
        memberName: member.name,
        theme: member.landingPageTheme,
        config: member.landingPageConfig,
        landingPageEnabled: member.landingPageEnabled,
      },
    })
  } catch (error: any) {
    console.error('Error fetching theme configuration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch theme configuration' },
      { status: 500 }
    )
  }
}