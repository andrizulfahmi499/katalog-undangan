import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all packages (admin - includes inactive)
export async function GET() {
  try {
    const packages = await db.v2Package.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json({ success: true, data: packages })
  } catch (error: any) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

// POST create package
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const pkg = await db.v2Package.create({
      data: {
        slug: body.slug,
        name: body.name,
        description: body.description || null,
        regularPrice: body.regularPrice || 0,
        promoPrice: body.promoPrice || 0,
        features: body.features || [],
        popular: body.popular || false,
        isActive: body.isActive !== false,
        sortOrder: body.sortOrder || 0,
      },
    })
    return NextResponse.json({ success: true, data: pkg })
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 409 })
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

// PUT update package
export async function PUT(request: NextRequest) {
  try {
    const { id, ...body } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const pkg = await db.v2Package.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.regularPrice !== undefined && { regularPrice: body.regularPrice }),
        ...(body.promoPrice !== undefined && { promoPrice: body.promoPrice }),
        ...(body.features !== undefined && { features: body.features }),
        ...(body.popular !== undefined && { popular: body.popular }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    })
    return NextResponse.json({ success: true, data: pkg })
  } catch (error: any) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

// DELETE package
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await db.v2Package.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
