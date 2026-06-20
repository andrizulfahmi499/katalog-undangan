import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all end users (customers) with stats
export async function GET() {
  try {
    const customers = await db.endUser.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { invitations: true, payments: true } },
        invitations: { take: 1, orderBy: { createdAt: 'desc' }, select: { subdomain: true, isOnline: true } },
      },
    })
    return NextResponse.json({ success: true, data: customers })
  } catch { return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 }) }
}

// PUT - Manual activate package / update customer
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.id) return NextResponse.json({ error: 'Customer ID required' }, { status: 400 })

    const updateData: any = {}
    if (body.packageType !== undefined) updateData.packageType = body.packageType
    if (body.packageStatus !== undefined) updateData.packageStatus = body.packageStatus

    const customer = await db.endUser.update({ where: { id: body.id }, data: updateData })

    // If activating, create a payment record with admin note
    if (body.packageStatus === 'paid' && body.activatedBy) {
      await db.v2Payment.create({
        data: {
          endUserId: body.id,
          packageType: body.packageType || customer.packageType || 'manual',
          amount: 0,
          finalAmount: 0,
          status: 'paid',
          activatedBy: body.activatedBy,
          activationNote: body.activationNote || 'Manual activation by admin',
          paidAt: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true, data: customer })
  } catch { return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 }) }
}
