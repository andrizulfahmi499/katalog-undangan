import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Find admin
    const admin = await db.admin.findUnique({
      where: { email: 'admin@undanganku.com' },
    })

    if (!admin) {
      return NextResponse.json({
        success: false,
        error: 'Admin not found'
      })
    }

    // Test with correct password
    const correctPassword = 'admin123'
    const isValid = await bcrypt.compare(correctPassword, admin.password)

    return NextResponse.json({
      success: true,
      adminEmail: admin.email,
      adminPasswordPrefix: admin.password.substring(0, 15),
      adminPasswordLength: admin.password.length,
      testedPassword: 'admin123',
      passwordMatch: isValid,
      message: isValid ? '✓ Password admin123 is CORRECT!' : '✗ Password admin123 is INCORRECT!'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      errorType: error.constructor.name
    }, { status: 500 })
  }
}
