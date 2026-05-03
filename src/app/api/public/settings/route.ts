import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { DEFAULT_CLEANAPP_CONFIG } from '@/lib/schemas/cleanapp-theme'

// Cache global settings in memory — avoids repeated DB hits for every page load
let globalSettingsCache: { landingPageTheme: string } | null = null
let globalSettingsCacheTime = 0
const GLOBAL_CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

export const dynamic = 'force-dynamic'

/**
 * GET /api/public/settings
 * 
 * Fetches theme configuration for a member's landing page.
 * 
 * Query Parameters:
 * - slug: The member's custom slug (optional)
 * - memberId: The member's ID (optional, alternative to slug)
 * 
 * If no slug or memberId is provided, returns global settings.
 * If member has cleanapp theme, returns their landingPageConfig or default cleanapp config.
 * 
 * Requirements: 2.4, 2.5
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug')
    const memberId = searchParams.get('memberId')

    // If slug or memberId is provided, fetch member-specific settings
    if (slug || memberId) {
      const member = await db.member.findUnique({
        where: slug ? { customSlug: slug } : { id: memberId! },
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

      if (!member.landingPageEnabled) {
        return NextResponse.json(
          { success: false, error: 'Landing page is not enabled for this member' },
          { status: 403 }
        )
      }

      // Return member-specific theme configuration
      const themeConfig = member.landingPageConfig || 
        (member.landingPageTheme === 'cleanapp' ? DEFAULT_CLEANAPP_CONFIG : {})

      return NextResponse.json({
        success: true,
        data: {
          memberId: member.id,
          memberName: member.name,
          theme: member.landingPageTheme,
          config: themeConfig,
        },
      })
    }

    // Fallback to global settings — use in-memory cache to avoid DB hit every request
    const now = Date.now()
    if (!globalSettingsCache || now - globalSettingsCacheTime > GLOBAL_CACHE_TTL_MS) {
      const setting = await db.globalSetting.findUnique({
        where: { id: 'global' },
        select: { landingPageTheme: true },
      })
      globalSettingsCache = { landingPageTheme: setting?.landingPageTheme || 'default' }
      globalSettingsCacheTime = now
    }

    return NextResponse.json(
      { success: true, data: globalSettingsCache },
      {
        headers: {
          // Allow browser to cache for 5 minutes
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
        },
      }
    )
  } catch (error: any) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}
