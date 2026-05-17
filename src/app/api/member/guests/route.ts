import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const invitationId = searchParams.get('invitationId')

    if (!invitationId) {
      return NextResponse.json({ success: false, error: 'invitationId is required' }, { status: 400 })
    }

    const guests = await db.guest.findMany({
      where: { invitationId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: guests })
  } catch (error: any) {
    console.error('Error fetching guests:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { invitationId, name, whatsapp, category, session, tableNumber, rsvpStatus, checkIn } = body

    if (!invitationId || !name) {
      return NextResponse.json({ success: false, error: 'invitationId and name are required' }, { status: 400 })
    }

    const guest = await db.guest.create({
      data: {
        invitationId,
        name,
        whatsapp,
        category: category || 'Reguler',
        session: session || 'Sesi 1',
        tableNumber: tableNumber || '',
        rsvpStatus: rsvpStatus || 'Pending',
        checkIn: checkIn || false,
      },
    })

    return NextResponse.json({ success: true, data: guest })
  } catch (error: any) {
    console.error('Error creating guest:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
