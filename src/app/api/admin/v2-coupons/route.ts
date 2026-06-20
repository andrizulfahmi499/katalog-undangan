import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all coupons
export async function GET() {
  try {
    const coupons = await db.v2Coupon.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ success: true, data: coupons })
  } catch { return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 }) }
}

// POST create coupon
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const coupon = await db.v2Coupon.create({
      data: {
        code: body.code.toUpperCase(),
        description: body.description || null,
        discountPercent: body.discountPercent || null,
        discountAmount: body.discountAmount || null,
        minPurchase: body.minPurchase || 0,
        maxUses: body.maxUses || 100,
        isActive: body.isActive !== false,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
    })
    return NextResponse.json({ success: true, data: coupon })
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Kode kupon sudah digunakan' }, { status: 409 })
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

// PUT update coupon
export async function PUT(request: NextRequest) {
  try {
    const { id, ...body } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    const coupon = await db.v2Coupon.update({
      where: { id },
      data: {
        ...(body.code !== undefined && { code: body.code.toUpperCase() }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.discountPercent !== undefined && { discountPercent: body.discountPercent }),
        ...(body.discountAmount !== undefined && { discountAmount: body.discountAmount }),
        ...(body.minPurchase !== undefined && { minPurchase: body.minPurchase }),
        ...(body.maxUses !== undefined && { maxUses: body.maxUses }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.expiresAt !== undefined && { expiresAt: body.expiresAt ? new Date(body.expiresAt) : null }),
      },
    })
    return NextResponse.json({ success: true, data: coupon })
  } catch { return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 }) }
}

// DELETE coupon
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await db.v2Coupon.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 }) }
}
