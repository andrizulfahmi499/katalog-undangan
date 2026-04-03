import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get first admin (or any active admin)
    const admin = await db.admin.findFirst({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: admin,
    })
  } catch (error: any) {
    console.error('Error fetching current admin:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data admin' },
      { status: 500 }
    )
  }
}
