import { NextRequest, NextResponse } from 'next/server'
import { createOTPSession } from '@/lib/otp'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID harus diisi' },
        { status: 400 }
      )
    }

    const { expiresAt } = await createOTPSession(userId, 'login')

    return NextResponse.json({
      success: true,
      data: { expiresAt },
    })
  } catch (error: any) {
    console.error('Resend OTP error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengirim ulang OTP' },
      { status: 500 }
    )
  }
}
