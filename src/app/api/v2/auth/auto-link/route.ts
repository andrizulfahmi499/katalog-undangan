import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createSessionToken, setSessionCookie } from '@/lib/v2Auth'

// POST - Auto-link admin/member to EndUser for v2 access
export async function POST(request: NextRequest) {
  try {
    const { role, adminId, memberId, name, email } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 })
    }

    // Check if EndUser already exists with this email
    let endUser = await db.endUser.findUnique({ where: { email } })

    if (endUser) {
      // Update role link if not already linked
      const updateData: any = {}
      if (role === 'admin' && !endUser.linkedAdminId) updateData.linkedAdminId = adminId
      if (role === 'member' && !endUser.linkedMemberId) updateData.linkedMemberId = memberId
      if (endUser.role === 'customer' && role !== 'customer') updateData.role = role

      if (Object.keys(updateData).length > 0) {
        endUser = await db.endUser.update({ where: { id: endUser.id }, data: updateData })
      }
    } else {
      // Create new EndUser linked to admin/member
      endUser = await db.endUser.create({
        data: {
          name,
          email,
          role: role || 'admin',
          linkedAdminId: role === 'admin' ? adminId : null,
          linkedMemberId: role === 'member' ? memberId : null,
          isVerified: true, // Already verified via password login
          packageStatus: role === 'admin' ? 'paid' : 'unpaid', // Admin gets free access
        },
      })
    }

    // Create v2 session JWT
    const token = await createSessionToken({
      userId: endUser.id,
      email: endUser.email,
      name: endUser.name,
    })
    await setSessionCookie(token)

    return NextResponse.json({
      success: true,
      data: {
        id: endUser.id,
        name: endUser.name,
        email: endUser.email,
        role: endUser.role,
        packageType: endUser.packageType,
        packageStatus: endUser.packageStatus,
      },
    })
  } catch (error: any) {
    console.error('Auto-link error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
