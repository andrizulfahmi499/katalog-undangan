import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/v2Auth'

async function verifyOwnership(invitationId: string, userId: string) {
  const inv = await db.endUserInvitation.findFirst({ where: { id: invitationId, endUserId: userId } })
  return !!inv
}

// GET events
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    if (!(await verifyOwnership(id, session.userId))) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const events = await db.endUserEvent.findMany({ where: { invitationId: id }, orderBy: { createdAt: 'asc' } })
    return NextResponse.json({ success: true, data: events })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

// POST create event
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    if (!(await verifyOwnership(id, session.userId))) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Max 2 events
    const count = await db.endUserEvent.count({ where: { invitationId: id } })
    if (count >= 2) return NextResponse.json({ error: 'Maksimal 2 sesi acara' }, { status: 400 })

    const body = await request.json()
    const event = await db.endUserEvent.create({
      data: {
        invitationId: id,
        eventName: body.eventName || 'Sesi Baru',
        date: new Date(body.date || Date.now()),
        startTime: body.startTime || '08:00',
        endTime: body.endTime || '10:00',
        timezone: body.timezone || 'WIB',
        venue: body.venue || '',
        address: body.address || '',
        mapsUrl: body.mapsUrl,
        mapsEmbedUrl: body.mapsEmbedUrl,
        wazeUrl: body.wazeUrl,
        isMainEvent: body.isMainEvent || false,
        rsvpEnabled: body.rsvpEnabled !== false,
        visibility: body.visibility || 'public',
        maxGuests: body.maxGuests || 0,
      },
    })

    return NextResponse.json({ success: true, data: event })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

// PUT update event
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    if (!(await verifyOwnership(id, session.userId))) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { eventId, ...body } = await request.json()
    if (!eventId) return NextResponse.json({ error: 'Event ID required' }, { status: 400 })

    const updateData: any = {}
    const fields = ['eventName', 'date', 'startTime', 'endTime', 'timezone', 'venue', 'address', 'mapsUrl', 'mapsEmbedUrl', 'wazeUrl', 'isMainEvent', 'rsvpEnabled', 'visibility', 'maxGuests']
    for (const f of fields) {
      if (body[f] !== undefined) updateData[f] = f === 'date' ? new Date(body[f]) : body[f]
    }

    const event = await db.endUserEvent.update({ where: { id: eventId }, data: updateData })
    return NextResponse.json({ success: true, data: event })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

// DELETE event
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    if (!(await verifyOwnership(id, session.userId))) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { eventId } = await request.json()
    if (!eventId) return NextResponse.json({ error: 'Event ID required' }, { status: 400 })

    await db.endUserEvent.delete({ where: { id: eventId } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
