import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'


// Helper function to detect invitation domain
function detectInvitationDomain(link: string): 'satumomen' | 'akainvitation' {
  if (link.includes('satumomen.com')) {
    return 'satumomen'
  } else if (link.includes('id.akainvitation.com')) {
    return 'akainvitation'
  }
  throw new Error('Domain undangan tidak didukung. Gunakan satumomen.com atau id.akainvitation.com')
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
      costPoints,
      assignedMemberId,
      createdById,
    } = await request.json()

    // Validate required fields
    if (!title || !eventName || !eventDate || !location || !invitationLink || !assignedMemberId || !createdById) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    // Detect and validate domain
    const invitationDomain = detectInvitationDomain(invitationLink)

    // Check if member exists and has enough credit points
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

    // Admin tidak dibatasi oleh credit point member, sehingga validasi ini dihapus.
    // Poin member akan tetap terpotong secara otomatis di bawah.

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

    // Create invitation
    const invitation = await db.invitations.create({
      data: {
        title,
        eventName,
        eventDate: new Date(eventDate),
        location,
        invitationLink,
        invitationDomain,
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

    // Deduct credit points from member
    await db.member.update({
      where: { id: assignedMemberId },
      data: {
        creditPoints: {
          decrement: pointsCost,
        },
      },
    })

    // Create credit transaction record
    await db.creditTransaction.create({
      data: {
        memberId: assignedMemberId,
        adminId: createdById,
        invitationId: invitation.id,
        type: 'debit',
        amount: pointsCost,
        description: `Pembuatan undangan: ${title}`,
      },
    })

    return NextResponse.json({
      success: true,
      data: invitation,
    })
  } catch (error: any) {
    console.error('Error creating invitation:', error)
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat membuat undangan' },
      { status: 500 }
    )
  }
}
