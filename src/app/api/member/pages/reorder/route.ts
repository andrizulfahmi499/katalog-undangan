import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pages } = body // Array of { id, order }

    if (!pages || !Array.isArray(pages)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    // Run in a transaction to ensure all updates succeed or fail together
    await db.$transaction(
      pages.map((page: { id: string; order: number }) =>
        db.invitationPage.update({
          where: { id: page.id },
          data: { order: page.order }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering pages:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
