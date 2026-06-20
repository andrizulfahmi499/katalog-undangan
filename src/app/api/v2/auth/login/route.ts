import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createOTPSession } from '@/lib/otp'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email harus diisi' },
        { status: 400 }
      )
    }

    // Find existing user
    const user = await db.endUser.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json(
        { error: 'Email tidak ditemukan. Silakan daftar terlebih dahulu.' },
        { status: 404 }
      )
    }

    // Generate and send OTP
    const { expiresAt } = await createOTPSession(user.id, 'login')

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        expiresAt,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    )
  }
}
