import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// GET single member
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const member = await db.member.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        whatsapp: true,
        creditPoints: true,
        status: true,
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
  { params }: { params: { id: string } }
) {
  try {
    const { name, email, whatsapp, password, creditPoints, status } = await request.json()

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
  { params }: { params: { id: string } }
) {
  try {
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

    // Delete member and all related data using transaction
    await db.$transaction([
      db.creditTransaction.deleteMany({ where: { memberId: params.id } }),
      db.invitationMessages.deleteMany({ where: { memberId: params.id } }),
      db.invitationSends.deleteMany({ where: { memberId: params.id } }),
      db.invitations.deleteMany({ where: { assignedMemberId: params.id } }),
      db.member.delete({ where: { id: params.id } }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Member berhasil dihapus',
    })
  } catch (error: any) {
    console.error('Error deleting member:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus member' },
      { status: 500 }
    )
  }
}
