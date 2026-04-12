import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { editorConfigToJson, parseEditorConfig } from '@/lib/invitationEditorConfig'

export const dynamic = 'force-dynamic'

function resolveInvitationDomain(link: string): 'satumomen' | 'akainvitation' | 'vercel' {
  if (link.includes('satumomen.com')) {
    return 'satumomen'
  } else if (link.includes('id.akainvitation.com')) {
    return 'akainvitation'
  }
  return 'vercel'
}

// GET all invitations
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const memberId = searchParams.get('memberId')

    const invitations = await db.invitations.findMany({
      where: memberId ? { assignedMemberId: memberId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedMember: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: invitations,
    })
  } catch (error: any) {
    console.error('Error fetching invitations:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data undangan' },
      { status: 500 }
    )
  }
}

// POST create new invitation
export async function POST(request: NextRequest) {
  try {
    const {
      title,
      eventName,
      eventDate,
      location,
      invitationLink,
      templateMessage,
      templateId,
      costPoints,
      assignedMemberId,
      createdById,
      editorConfig: editorConfigBody,
    } = await request.json()

    // Validate required fields
    if (!title || !eventName || !eventDate || !location || !assignedMemberId || !createdById) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || ''

    // Check if member exists
    const member = await db.member.findUnique({
      where: { id: assignedMemberId },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member tidak ditemukan' },
        { status: 404 }
      )
    }

    const pointsCost = costPoints || 20

    // Check if admin exists
    const admin = await db.admin.findUnique({
      where: { id: createdById },
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin tidak ditemukan' },
        { status: 404 }
      )
    }

    const editorConfigJson: Prisma.InputJsonValue | typeof Prisma.JsonNull | undefined =
      editorConfigBody !== undefined && editorConfigBody !== null
        ? (editorConfigToJson(parseEditorConfig(editorConfigBody)) as Prisma.InputJsonValue)
        : undefined

    // Create invitation with temporary link if necessary
    const invitation = await db.invitations.create({
      data: {
        title,
        eventName,
        eventDate: new Date(eventDate),
        location,
        invitationLink: invitationLink?.trim() || '',
        invitationDomain: invitationLink?.trim()
          ? resolveInvitationDomain(invitationLink.trim())
          : 'vercel',
        templateId: templateId || null,
        ...(editorConfigJson !== undefined ? { editorConfig: editorConfigJson } : {}),
        templateMessage: templateMessage || `Kepada Yth. Bapak/Ibu/Saudara/i *{nama_tamu}* _di tempat_

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, untuk menghadiri acara {event_name}.

Info lebih lengkap klik link dibawah ini:
{link_undangan}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.

Terima kasih.`,
        costPoints: pointsCost,
        status: 'published',
        createdById,
        assignedMemberId,
      },
    })

    const finalLink = invitationLink?.trim()
      ? invitationLink.trim()
      : `${origin}/invitation/${invitation.id}`

    const updatedInvitation = await db.invitations.update({
      where: { id: invitation.id },
      data: {
        invitationLink: finalLink,
        invitationDomain: resolveInvitationDomain(finalLink),
      },
    })

    // Deduct credit points from member
    await db.member.update({
      where: { id: assignedMemberId },
      data: {
        creditPoints: {
          decrement: pointsCost,
        },
      },
    })

    // Create credit transaction record (Bungkus dalam try-catch agar error sinkronisasi kolom tidak membatalkan undangan)
    try {
      await db.creditTransaction.create({
        data: {
          memberId: assignedMemberId,
          adminId: createdById,
          invitationId: updatedInvitation.id,
          type: 'debit',
          amount: pointsCost,
          description: `Pembuatan undangan: ${title}`,
        },
      })
    } catch (txError) {
      console.warn('Gagal mencatat riwayat transaksi kredit, namun undangan tetap dilanjutkan:', txError)
    }

    return NextResponse.json({
      success: true,
      data: updatedInvitation,
    })
  } catch (error: any) {
    console.error('Error creating invitation:', error)
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat membuat undangan' },
      { status: 500 }
    )
  }
}
