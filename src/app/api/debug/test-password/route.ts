import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find admin
    const admin = await db.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      return NextResponse.json({
        success: false,
        error: 'Admin not found'
      })
    }

    // Test bcrypt compare
    const isValid = await bcrypt.compare(password, admin.password)

    return NextResponse.json({
      success: true,
      email: email,
      passwordProvided: password ? `${password.substring(0, 2)}***` : 'empty',
      passwordLength: password ? password.length : 0,
      adminEmail: admin.email,
      adminPasswordPrefix: admin.password.substring(0, 15),
      adminPasswordLength: admin.password.length,
      passwordMatch: isValid,
      message: isValid ? 'Password correct!' : 'Password incorrect!'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      errorType: error.constructor.name
    }, { status: 500 })
  }
}
