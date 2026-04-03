import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      )
    }

    // Find admin
    const admin = await db.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, admin.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Return admin data (without password)
    return NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    })
  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    )
  }
}
