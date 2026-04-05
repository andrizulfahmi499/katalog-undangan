import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

import bcrypt from 'bcryptjs'

// GET all members
export async function GET() {
  try {
    const members = await db.member.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        whatsapp: true,
        creditPoints: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: members,
    })
  } catch (error: any) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data member' },
      { status: 500 }
    )
  }
}

// POST create new member
export async function POST(request: NextRequest) {
  try {
    const { name, email, whatsapp, password, creditPoints } = await request.json()

    if (!name || !email || !whatsapp || !password) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingMember = await db.member.findUnique({
      where: { email },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create member
    const member = await db.member.create({
      data: {
        name,
        email,
        whatsapp,
        password: hashedPassword,
        creditPoints: creditPoints || 0,
        status: 'active',
      },
    })

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
    console.error('Error creating member:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat member' },
      { status: 500 }
    )
  }
}
