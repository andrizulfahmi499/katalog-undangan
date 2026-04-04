import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const admin = await db.admin.findUnique({
      where: { email: 'admin@undanganku.com' },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Test dengan password "admin123"
    const testPassword = 'admin123'
    const isValid = await bcrypt.compare(testPassword, admin.password)

    return NextResponse.json({
      email: admin.email,
      passwordHash: admin.password,
      testPassword,
      isValid,
      message: isValid ? 'Password valid!' : 'Password invalid!',
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}
