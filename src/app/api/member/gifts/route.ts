import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const invitationId = searchParams.get('invitationId')

    if (!invitationId) {
      return NextResponse.json({ success: false, error: 'invitationId is required' }, { status: 400 })
    }

    const gifts = await db.giftRegistry.findMany({
      where: { invitationId },
      orderBy: { createdAt: 'desc' },
      include: {
        claimedByGuest: {
          select: { name: true }
        }
      }
    })

    return NextResponse.json({ success: true, data: gifts })
  } catch (error: any) {
    console.error('Error fetching gifts:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { invitationId, itemName, itemImageBase64, buyUrl } = body

    if (!invitationId || !itemName) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const gift = await db.giftRegistry.create({
      data: {
        invitationId,
        itemName,
        itemImageBase64,
        buyUrl
      }
    })

    return NextResponse.json({ success: true, data: gift })
  } catch (error: any) {
    console.error('Error creating gift:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Gift ID is required' }, { status: 400 })
    }

    await db.giftRegistry.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting gift:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
