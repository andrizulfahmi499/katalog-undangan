import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Check if admin already exists
    const existingAdmin = await db.admin.findFirst()

    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Admin already exists',
      })
    }

    // Create default admin
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const admin = await db.admin.create({
      data: {
        name: 'Super Admin',
        email: 'admin@undanganku.com',
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        password: 'admin123', // Show for first-time setup
      },
    })
  } catch (error: any) {
    console.error('Error initializing admin:', error)
    return NextResponse.json(
      { error: 'Failed to initialize admin' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const adminCount = await db.admin.count()

    return NextResponse.json({
      success: true,
      adminExists: adminCount > 0,
      adminCount,
    })
  } catch (error: any) {
    console.error('Error checking admin:', error)
    return NextResponse.json(
      { error: 'Failed to check admin' },
      { status: 500 }
    )
  }
}
