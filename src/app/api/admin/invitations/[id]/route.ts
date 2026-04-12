import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { editorConfigToJson, parseEditorConfig } from '@/lib/invitationEditorConfig'

function resolveInvitationDomain(link: string): 'satumomen' | 'akainvitation' | 'vercel' {
  if (link.includes('satumomen.com')) {
    return 'satumomen'
  }
  if (link.includes('id.akainvitation.com')) {
    return 'akainvitation'
  }
  return 'vercel'
}

// GET single invitation (for admin editor hydrate)
export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const invitation = await db.invitations.findUnique({
      where: { id: params.id },
      include: {
        assignedMember: {
          select: { id: true, name: true, email: true, whatsapp: true, creditPoints: true, status: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!invitation) {
      return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: invitation })
  } catch (error: unknown) {
    console.error('Error fetching invitation:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil undangan' },
      { status: 500 }
    )
  }
}

// PATCH update invitation (no credit / member reassignment)
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const existing = await db.invitations.findUnique({ where: { id: params.id } })

    if (!existing) {
      return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 })
    }

    const body = await request.json()
    const data: Prisma.InvitationsUpdateInput = {}

    if (typeof body.title === 'string') data.title = body.title
    if (typeof body.eventName === 'string') data.eventName = body.eventName
    if (typeof body.location === 'string') data.location = body.location
    if (body.eventDate !== undefined && body.eventDate !== null && body.eventDate !== '') {
      data.eventDate = new Date(body.eventDate)
    }
    if (typeof body.templateMessage === 'string') data.templateMessage = body.templateMessage
    if (body.templateId !== undefined) {
      data.templateId = body.templateId === null || body.templateId === '' ? null : String(body.templateId)
    }
    if (typeof body.status === 'string') data.status = body.status

    if (body.invitationLink !== undefined) {
      const link = String(body.invitationLink).trim()
      data.invitationLink = link
      data.invitationDomain = link ? resolveInvitationDomain(link) : 'vercel'
    }

    if (body.editorConfig !== undefined) {
      data.editorConfig = editorConfigToJson(parseEditorConfig(body.editorConfig)) as Prisma.InputJsonValue
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada field yang diperbarui' },
        { status: 400 }
      )
    }

    const updated = await db.invitations.update({
      where: { id: params.id },
      data,
      include: {
        assignedMember: {
          select: { id: true, name: true, email: true, whatsapp: true, creditPoints: true, status: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error: unknown) {
    console.error('Error updating invitation:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui undangan' },
      { status: 500 }
    )
  }
}

// DELETE invitation
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    
    // Check if invitation exists
    const existingInvitation = await db.invitations.findUnique({
      where: { id: params.id },
      include: {
        assignedMember: true
      }
    })

    if (!existingInvitation) {
      return NextResponse.json(
        { error: 'Undangan tidak ditemukan' },
        { status: 404 }
      )
    }

    const { assignedMemberId, costPoints } = existingInvitation

    // Perform operations in a transaction
    await db.$transaction(async (prisma) => {
      // 1. Delete associated data first
      await prisma.invitationSends.deleteMany({
        where: { invitationId: params.id }
      })
      
      await prisma.invitationMessages.deleteMany({
        where: { invitationId: params.id }
      })
      
      await prisma.creditTransaction.deleteMany({
        where: { invitationId: params.id }
      })

      // 2. Delete the invitation itself
      await prisma.invitations.delete({
        where: { id: params.id }
      })

      // 3. Refund the credit points to the assigned member ONLY if 1 invitation is deleted
      // The requirement: "dan hanya mengurangi 20 credit member apabila 1 undangan dihapus"
      // Which means, we refund the credit points (mengurangi 'credit terpakai' / restore 'credit available') 
      // when the invitation is deleted.
      await prisma.member.update({
        where: { id: assignedMemberId },
        data: {
          creditPoints: {
            increment: costPoints || 20
          }
        }
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Undangan berhasil dihapus dan credit dikembalikan',
    })
  } catch (error: any) {
    console.error('Error deleting invitation:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus undangan' },
      { status: 500 }
    )
  }
}
