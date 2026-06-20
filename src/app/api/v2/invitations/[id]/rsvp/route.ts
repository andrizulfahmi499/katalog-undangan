import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/v2Auth'

async function verifyOwnership(invitationId: string, userId: string) {
  return !!(await db.endUserInvitation.findFirst({ where: { id: invitationId, endUserId: userId } }))
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    if (!(await verifyOwnership(id, session.userId))) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const entries = await db.endUserRsvp.findMany({ where: { invitationId: id }, orderBy: { createdAt: 'desc' } })
    const stats = {
      total: entries.length,
      hadir: entries.filter(e => e.attendance === 'Hadir').length,
      tidakHadir: entries.filter(e => e.attendance === 'Tidak Hadir').length,
      mungkin: entries.filter(e => e.attendance === 'Mungkin').length,
      totalGuests: entries.reduce((sum, e) => sum + (e.attendance === 'Hadir' ? e.guestCount : 0), 0),
    }
    return NextResponse.json({ success: true, data: { entries, stats } })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

// POST RSVP (public endpoint - no auth required for guests to fill)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const inv = await db.endUserInvitation.findUnique({ where: { id } })
    if (!inv) return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 })

    const body = await request.json()
    const rsvp = await db.endUserRsvp.create({
      data: {
        invitationId: id,
        guestName: body.guestName || 'Anonim',
        guestWhatsapp: body.guestWhatsapp || null,
        attendance: body.attendance || 'Mungkin',
        guestCount: body.guestCount || 1,
        message: body.message || null,
        groupName: body.groupName || null,
      },
    })
    return NextResponse.json({ success: true, data: rsvp })
  } catch (error: any) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
