import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
