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

    // Find member
    const member = await db.member.findUnique({
      where: { email },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Check if member is active
    if (member.status !== 'active') {
      return NextResponse.json(
        { error: 'Akun member tidak aktif. Hubungi admin.' },
        { status: 403 }
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, member.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Return member data (without password)
    return NextResponse.json({
      success: true,
      data: {
        id: member.id,
        name: member.name,
        email: member.email,
        whatsapp: member.whatsapp,
        creditPoints: member.creditPoints,
        status: member.status,
      },
    })
  } catch (error: any) {
    console.error('Member login error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    )
  }
}
