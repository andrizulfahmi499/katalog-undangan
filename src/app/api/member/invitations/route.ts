import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'


// GET invitations assigned to member
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const memberId = searchParams.get('memberId')

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID harus disertakan' },
        { status: 400 }
      )
    }

    const invitations = await db.invitations.findMany({
      where: { assignedMemberId: memberId },
      orderBy: { createdAt: 'desc' },
      include: {
        invitationMessages: true,
        invitationSends: {
          orderBy: { sentAt: 'desc' },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: invitations,
    })
  } catch (error: any) {
    console.error('Error fetching member invitations:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data undangan' },
      { status: 500 }
    )
  }
}

// POST update custom message template
export async function POST(request: NextRequest) {
  try {
    const { memberId, invitationId, messageTemplate } = await request.json()

    if (!memberId || !invitationId || !messageTemplate) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    // Check if invitation is assigned to this member
    const invitation = await db.invitations.findFirst({
      where: {
        id: invitationId,
        assignedMemberId: memberId,
      },
    })

    if (!invitation) {
      return NextResponse.json(
        { error: 'Undangan tidak ditemukan atau tidak diassign ke member ini' },
        { status: 404 }
      )
    }

    // Upsert invitation message
    const message = await db.invitationMessages.upsert({
      where: {
        memberId_invitationId: {
          memberId,
          invitationId,
        },
      },
      update: {
        messageTemplate,
      },
      create: {
        memberId,
        invitationId,
        messageTemplate,
      },
    })

    return NextResponse.json({
      success: true,
      data: message,
    })
  } catch (error: any) {
    console.error('Error updating message template:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat update template pesan' },
      { status: 500 }
    )
  }
}
