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
    const accounts = await db.endUserBankAccount.findMany({ where: { invitationId: id }, orderBy: { createdAt: 'asc' } })
    return NextResponse.json({ success: true, data: accounts })
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
    const account = await db.endUserBankAccount.create({
      data: {
        invitationId: id,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        accountName: body.accountName,
        logoUrl: body.logoUrl,
      },
    })
    return NextResponse.json({ success: true, data: account })
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

    const { accountId, ...body } = await request.json()
    if (!accountId) return NextResponse.json({ error: 'Account ID required' }, { status: 400 })

    const updateData: any = {}
    for (const f of ['bankName', 'accountNumber', 'accountName', 'logoUrl']) {
      if (body[f] !== undefined) updateData[f] = body[f]
    }

    const account = await db.endUserBankAccount.update({ where: { id: accountId }, data: updateData })
    return NextResponse.json({ success: true, data: account })
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

    const { accountId } = await request.json()
    if (!accountId) return NextResponse.json({ error: 'Account ID required' }, { status: 400 })

    await db.endUserBankAccount.delete({ where: { id: accountId } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
