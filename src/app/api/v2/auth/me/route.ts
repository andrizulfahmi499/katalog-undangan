import { NextResponse } from 'next/server'
import { getCurrentEndUser, clearSessionCookie } from '@/lib/v2Auth'

export async function GET() {
  try {
    const user = await getCurrentEndUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp,
        isVerified: user.isVerified,
        packageType: user.packageType,
        packageStatus: user.packageStatus,
        subdomain: user.subdomain,
        subdomainChangesLeft: user.subdomainChangesLeft,
        invitations: user.invitations.map(inv => ({
          id: inv.id,
          templateSlug: inv.templateSlug,
          subdomain: inv.subdomain,
          isOnline: inv.isOnline,
          ogTitle: inv.ogTitle,
          primaryColor: inv.primaryColor,
          createdAt: inv.createdAt,
        })),
        createdAt: user.createdAt,
      },
    })
  } catch (error: any) {
    console.error('Get me error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    await clearSessionCookie()
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat logout' },
      { status: 500 }
    )
  }
}
