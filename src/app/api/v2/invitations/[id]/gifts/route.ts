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
    const items = await db.endUserGiftItem.findMany({ where: { invitationId: id }, orderBy: { createdAt: 'asc' } })
    return NextResponse.json({ success: true, data: items })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    if (!(await verifyOwnership(id, session.userId))) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await request.json()
    const item = await db.endUserGiftItem.create({
      data: {
        invitationId: id,
        itemName: body.itemName,
        itemImageUrl: body.itemImageUrl,
        buyUrl: body.buyUrl,
      },
    })
    return NextResponse.json({ success: true, data: item })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    if (!(await verifyOwnership(id, session.userId))) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { itemId, ...body } = await request.json()
    if (!itemId) return NextResponse.json({ error: 'Item ID required' }, { status: 400 })

    const updateData: any = {}
    for (const f of ['itemName', 'itemImageUrl', 'buyUrl', 'isClaimed', 'claimedByName']) {
      if (body[f] !== undefined) updateData[f] = body[f]
    }

    const item = await db.endUserGiftItem.update({ where: { id: itemId }, data: updateData })
    return NextResponse.json({ success: true, data: item })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    if (!(await verifyOwnership(id, session.userId))) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { itemId } = await request.json()
    if (!itemId) return NextResponse.json({ error: 'Item ID required' }, { status: 400 })

    await db.endUserGiftItem.delete({ where: { id: itemId } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
