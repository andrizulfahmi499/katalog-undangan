import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const setting = await prisma.globalSetting.findUnique({
      where: { id: 'global' },
    })

    return NextResponse.json({
      success: true,
      data: { landingPageTheme: setting?.landingPageTheme || 'default' },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch global settings' },
      { status: 500 }
    )
  }
}
