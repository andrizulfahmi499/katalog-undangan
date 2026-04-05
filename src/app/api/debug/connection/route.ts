import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Try to connect to database
    const adminCount = await db.admin.count()

    return NextResponse.json({
      success: true,
      database: 'connected',
      adminCount,
      message: 'Database connection successful'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      database: 'disconnected',
      error: error.message,
      errorCode: error.code,
      errorType: error.constructor.name,
      prismaVersion: '6.19.2'
    }, { status: 500 })
  }
}
