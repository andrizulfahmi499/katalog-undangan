import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Try to connect to database
    const adminCount = await db.admin.count()
    
    // Test password verification
    const admin = await db.admin.findUnique({
      where: { email: 'admin@undanganku.com' },
    })
    
    let passwordTest = null
    if (admin) {
      const isValid = await bcrypt.compare('admin123', admin.password)
      passwordTest = {
        email: admin.email,
        passwordPrefix: admin.password.substring(0, 15),
        passwordLength: admin.password.length,
        testedPassword: 'admin123',
        passwordMatch: isValid,
        message: isValid ? '✓ Password admin123 is CORRECT!' : '✗ Password admin123 is INCORRECT!'
      }
    }

    return NextResponse.json({
      success: true,
      database: 'connected',
      adminCount,
      passwordTest,
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
