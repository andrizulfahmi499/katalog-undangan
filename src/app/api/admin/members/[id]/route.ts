import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// GET single member
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const member = await db.member.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        creditPoints: true,
        status: true,
        landingPageEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: member,
    })
  } catch (error: any) {
    console.error('Error fetching member:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data member' },
      { status: 500 }
    )
  }
}

// PUT update member
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { name, email, whatsapp, password, creditPoints, status, landingPageEnabled } = await request.json()

    // Check if member exists
    const existingMember = await db.member.findUnique({
      where: { id: params.id },
    })

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Member tidak ditemukan' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    if (name) updateData.name = name
    if (email) updateData.email = email
    if (whatsapp) updateData.whatsapp = whatsapp
    if (password) updateData.password = await bcrypt.hash(password, 10)
    if (creditPoints !== undefined) updateData.creditPoints = creditPoints
    if (status) updateData.status = status
    if (landingPageEnabled !== undefined) updateData.landingPageEnabled = landingPageEnabled

    // Update member
    const member = await db.member.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        whatsapp: true,
        creditPoints: true,
        status: true,
        landingPageEnabled: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: member,
    })
  } catch (error: any) {
    console.error('Error updating member:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate member' },
      { status: 500 }
    )
  }
}

// DELETE member
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    // Check if member exists
    const existingMember = await db.member.findUnique({
      where: { id: params.id },
    })

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Member tidak ditemukan' },
        { status: 404 }
      )
    }

    // Get all invitations assigned to this member
    const memberInvitations = await db.invitations.findMany({
      where: { assignedMemberId: params.id },
      select: { id: true }
    })
    const invitationIds = memberInvitations.map(inv => inv.id)

    // Delete member and all related data using transaction
    const deleteOperations: any[] = []

    // 1. Delete all credit transactions for this member
    deleteOperations.push(db.creditTransaction.deleteMany({ where: { memberId: params.id } }))
    
    // 2. Delete all invitation sends (by member or by invitation)
    if (invitationIds.length > 0) {
      deleteOperations.push(db.invitationSends.deleteMany({ where: { invitationId: { in: invitationIds } } }))
      deleteOperations.push(db.invitationMessages.deleteMany({ where: { invitationId: { in: invitationIds } } }))
      // Also cleanup any credit transactions linked to these invitations just in case
      deleteOperations.push(db.creditTransaction.deleteMany({ where: { invitationId: { in: invitationIds } } }))
    }

    deleteOperations.push(db.invitationSends.deleteMany({ where: { memberId: params.id } }))
    deleteOperations.push(db.invitationMessages.deleteMany({ where: { memberId: params.id } }))
    
    // 3. Delete the invitations
    deleteOperations.push(db.invitations.deleteMany({ where: { assignedMemberId: params.id } }))
    
    // 4. Finally delete the member
    deleteOperations.push(db.member.delete({ where: { id: params.id } }))

    await db.$transaction(deleteOperations)

    return NextResponse.json({
      success: true,
      message: 'Member berhasil dihapus',
    })
  } catch (error: any) {
    console.error('Error deleting member DETAIL:', error?.message || error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus member: ' + (error?.message?.split('\\n').pop() || 'Unknown DB error') },
      { status: 500 }
    )
  }
}
