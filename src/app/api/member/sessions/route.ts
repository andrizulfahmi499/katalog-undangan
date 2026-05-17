import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const invitationId = searchParams.get('invitationId')

    if (!invitationId) {
      return NextResponse.json({ success: false, error: 'invitationId is required' }, { status: 400 })
    }

    const sessions = await db.weddingSession.findMany({
      where: { invitationId },
      orderBy: { startTime: 'asc' },
    })

    return NextResponse.json({ success: true, data: sessions })
  } catch (error: any) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { invitationId, sessions } = body

    if (!invitationId || !Array.isArray(sessions)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    // We will delete existing and recreate them (or UPSERT)
    // For simplicity, we delete all and insert the new ones
    await db.weddingSession.deleteMany({
      where: { invitationId },
    })

    if (sessions.length > 0) {
      await db.weddingSession.createMany({
        data: sessions.map((s: any) => ({
          invitationId,
          sessionName: s.sessionName,
          startTime: s.startTime,
          endTime: s.endTime,
          maxCapacity: Number(s.maxCapacity) || 100
        }))
      })
    }

    const updatedSessions = await db.weddingSession.findMany({
      where: { invitationId },
      orderBy: { startTime: 'asc' },
    })

    return NextResponse.json({ success: true, data: updatedSessions })
  } catch (error: any) {
    console.error('Error saving sessions:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
