import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createOTPSession } from '@/lib/otp'

export async function POST(request: NextRequest) {
  try {
    const { name, email, whatsapp } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nama dan email harus diisi' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existing = await db.endUser.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar. Silakan login.', userId: existing.id },
        { status: 409 }
      )
    }

    // Create new end user
    const user = await db.endUser.create({
      data: {
        name,
        email,
        whatsapp: whatsapp || null,
        isVerified: false,
      },
    })

    // Generate and send OTP
    const { expiresAt } = await createOTPSession(user.id, 'register')

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        expiresAt,
      },
    })
  } catch (error: any) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mendaftar' },
      { status: 500 }
    )
  }
}
