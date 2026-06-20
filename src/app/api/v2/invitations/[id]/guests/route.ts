import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/v2Auth'

async function verifyOwnership(invitationId: string, userId: string) {
  return !!(await db.endUserInvitation.findFirst({ where: { id: invitationId, endUserId: userId } }))
}

// GET guests
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    if (!(await verifyOwnership(id, session.userId))) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const guests = await db.endUserGuest.findMany({
      where: { invitationId: id },
      include: { session: true },
      orderBy: { createdAt: 'desc' },
    })
    const sessions = await db.endUserSession.findMany({ where: { invitationId: id } })

    return NextResponse.json({ success: true, data: { guests, sessions } })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

// POST add guest
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    if (!(await verifyOwnership(id, session.userId))) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await request.json()

    // Support bulk add
    if (body.guests && Array.isArray(body.guests)) {
      const created = await db.endUserGuest.createMany({
        data: body.guests.map((g: any) => ({
          invitationId: id,
          name: g.name,
          whatsapp: g.whatsapp || null,
          email: g.email || null,
          category: g.category || 'Reguler',
          sessionId: g.sessionId || null,
          tableNumber: g.tableNumber || '',
        })),
      })
      return NextResponse.json({ success: true, data: { count: created.count } })
    }

    const guest = await db.endUserGuest.create({
      data: {
        invitationId: id,
        name: body.name,
        whatsapp: body.whatsapp || null,
        email: body.email || null,
        category: body.category || 'Reguler',
        sessionId: body.sessionId || null,
        tableNumber: body.tableNumber || '',
      },
    })

    return NextResponse.json({ success: true, data: guest })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

// PUT update guest
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    if (!(await verifyOwnership(id, session.userId))) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { guestId, ...body } = await request.json()
    if (!guestId) return NextResponse.json({ error: 'Guest ID required' }, { status: 400 })

    const updateData: any = {}
    for (const f of ['name', 'whatsapp', 'email', 'category', 'sessionId', 'tableNumber', 'rsvpStatus', 'checkIn']) {
      if (body[f] !== undefined) updateData[f] = body[f]
    }

    const guest = await db.endUserGuest.update({ where: { id: guestId }, data: updateData })
    return NextResponse.json({ success: true, data: guest })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

// DELETE guest
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    if (!(await verifyOwnership(id, session.userId))) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { guestId } = await request.json()
    if (!guestId) return NextResponse.json({ error: 'Guest ID required' }, { status: 400 })

    await db.endUserGuest.delete({ where: { id: guestId } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
