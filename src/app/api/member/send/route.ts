import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Helper function to get guest query parameter
function getGuestQueryParam(domain: string): string {
  switch (domain) {
    case 'satumomen':
      return 'guest'
    case 'akainvitation':
      return 'to'
    default:
      throw new Error('Domain tidak valid')
  }
}

// Helper function to generate guest link
function generateGuestLink(invitationLink: string, guestName: string, domain: string): string {
  const paramKey = getGuestQueryParam(domain)
  const encodedName = encodeURIComponent(guestName)
  const separator = invitationLink.includes('?') ? '&' : '?'
  return `${invitationLink}${separator}${paramKey}=${encodedName}`
}

// Helper function to replace placeholders in message
function replacePlaceholders(
  template: string,
  guestName: string,
  generatedLink: string,
  invitation: any
): string {
  let message = template
    .replace(/{nama_tamu}/g, guestName)
    .replace(/{link_undangan}/g, generatedLink)
    .replace(/{event_name}/g, invitation.eventName)
    .replace(/{event_date}/g, new Date(invitation.eventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    .replace(/{location}/g, invitation.location)

  // Optional placeholders (might be empty)
  message = message.replace(/{event_time}/g, '')
  message = message.replace(/{mempelai_pria}/g, '')
  message = message.replace(/{mempelai_wanita}/g, '')

  return message
}

// POST send invitations to guests
export async function POST(request: NextRequest) {
  try {
    const { memberId, invitationId, guests } = await request.json()

    if (!memberId || !invitationId || !guests || !Array.isArray(guests)) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    // Get invitation details
    const invitation = await db.invitations.findFirst({
      where: {
        id: invitationId,
        assignedMemberId: memberId,
      },
      include: {
        invitationMessages: true,
      },
    })

    if (!invitation) {
      return NextResponse.json(
        { error: 'Undangan tidak ditemukan' },
        { status: 404 }
      )
    }

    // Get custom message template or use default
    const templateMessage = invitation.invitationMessages[0]?.messageTemplate || invitation.templateMessage

    // Generate and send for each guest
    const results = []
    for (const guest of guests) {
      try {
        const guestName = guest.name
        const guestWhatsapp = guest.whatsapp
        const guestEmail = guest.email

        // Generate guest link
        const generatedLink = generateGuestLink(
          invitation.invitationLink,
          guestName,
          invitation.invitationDomain
        )

        // Generate message with placeholders replaced
        const generatedMessage = replacePlaceholders(
          templateMessage,
          guestName,
          generatedLink,
          invitation
        )

        // Save to database
        const invitationSend = await db.invitationSends.create({
          data: {
            memberId,
            invitationId,
            guestName,
            guestWhatsapp,
            guestEmail,
            generatedMessage,
            generatedLink,
            status: 'sent',
          },
        })

        results.push({
          success: true,
          guestName,
          generatedLink,
          status: 'sent',
        })
      } catch (error: any) {
        console.error(`Error sending to ${guest.name}:`, error)
        results.push({
          success: false,
          guestName: guest.name,
          error: error.message,
        })
      }
    }

    // Count successful and failed sends
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      data: {
        total: results.length,
        successful,
        failed,
        results,
      },
    })
  } catch (error: any) {
    console.error('Error sending invitations:', error)
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat mengirim undangan' },
      { status: 500 }
    )
  }
}
