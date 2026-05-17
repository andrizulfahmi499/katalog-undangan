import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    if (!id) {
      return NextResponse.json({ success: false, error: 'Guest ID is required' }, { status: 400 })
    }

    const body = await request.json()
    // Extract only allowed fields
    const { name, whatsapp, category, session, tableNumber, rsvpStatus, checkIn } = body

    const updatedGuest = await db.guest.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(category !== undefined && { category }),
        ...(session !== undefined && { session }),
        ...(tableNumber !== undefined && { tableNumber }),
        ...(rsvpStatus !== undefined && { rsvpStatus }),
        ...(checkIn !== undefined && { checkIn }),
      },
    })

    return NextResponse.json({ success: true, data: updatedGuest })
  } catch (error: any) {
    console.error('Error updating guest:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    if (!id) {
      return NextResponse.json({ success: false, error: 'Guest ID is required' }, { status: 400 })
    }

    await db.guest.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting guest:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
