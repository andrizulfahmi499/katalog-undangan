import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyOTP } from '@/lib/otp'
import { createSessionToken, setSessionCookie } from '@/lib/v2Auth'

export async function POST(request: NextRequest) {
  try {
    const { userId, code } = await request.json()

    if (!userId || !code) {
      return NextResponse.json(
        { error: 'User ID dan kode OTP harus diisi' },
        { status: 400 }
      )
    }

    // Clean the code (remove spaces, trim)
    const cleanCode = code.replace(/\s/g, '').trim()

    // Verify OTP
    const result = await verifyOTP(userId, cleanCode)
    if (!result.valid) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Mark user as verified
    const user = await db.endUser.update({
      where: { id: userId },
      data: { isVerified: true },
    })

    // Create session
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    })
    await setSessionCookie(token)

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: true,
        packageType: user.packageType,
        packageStatus: user.packageStatus,
      },
    })
  } catch (error: any) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat verifikasi' },
      { status: 500 }
    )
  }
}
