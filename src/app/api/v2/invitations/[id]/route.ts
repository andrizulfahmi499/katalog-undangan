import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/v2Auth'

async function getInvitationForUser(id: string, userId: string) {
  const invitation = await db.endUserInvitation.findFirst({
    where: { id, endUserId: userId },
    include: {
      events: { orderBy: { createdAt: 'asc' } },
      bankAccounts: true,
      giftItems: true,
      _count: { select: { guests: true, rsvpEntries: true } },
    },
  })
  return invitation
}

// GET single invitation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession()
    const { id } = await params
    const invitation = await getInvitationForUser(id, session.userId)

    if (!invitation) {
      return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: invitation })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

// PUT update invitation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession()
    const { id } = await params
    const body = await request.json()

    // Verify ownership
    const existing = await getInvitationForUser(id, session.userId)
    if (!existing) {
      return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 })
    }

    // Build update payload - only allow specific fields
    const allowedFields = [
      'editorConfig', 'ogTitle', 'ogDescription', 'ogImageUrl',
      'primaryColor', 'headingFont', 'bodyFont', 'accentFont',
      'musicUrl', 'musicEnabled', 'dateLanguage', 'coupleOrder',
      'templateSlug', 'isOnline',
    ]

    const updateData: any = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const invitation = await db.endUserInvitation.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: invitation })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update invitation error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

// DELETE invitation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession()
    const { id } = await params

    const existing = await getInvitationForUser(id, session.userId)
    if (!existing) {
      return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 })
    }

    await db.endUserInvitation.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
