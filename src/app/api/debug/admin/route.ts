import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Test 1: Cek koneksi database
    const adminCount = await db.admin.count()

    // Test 2: Cek admin data
    const admins = await db.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    })

    // Test 3: Cek admin dengan email spesifik
    const targetAdmin = await db.admin.findUnique({
      where: { email: 'admin@undanganku.com' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      database: 'connected',
      adminCount,
      admins,
      targetAdmin,
    })
  } catch (error: any) {
    console.error('Debug error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}
