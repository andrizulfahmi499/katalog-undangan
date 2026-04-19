import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEFAULT_SETTINGS = {
  landingPageTheme: 'default',
  preloaderEnabled: true,
  preloaderDuration: 3200,
  preloaderLogoText: 'AKA Invitation',
  preloaderBgColor: '#172a26',
}

export async function GET() {
  try {
    const setting = await prisma.globalSetting.findUnique({
      where: { id: 'global' },
    })

    if (!setting) {
      return NextResponse.json({ success: true, data: DEFAULT_SETTINGS })
    }

    return NextResponse.json({ success: true, data: setting })
  } catch (error: any) {
    console.error('Error fetching global settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch global settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      landingPageTheme,
      preloaderEnabled,
      preloaderDuration,
      preloaderLogoText,
      preloaderBgColor,
    } = body

    const updateData: any = {}
    if (landingPageTheme !== undefined) updateData.landingPageTheme = landingPageTheme
    if (preloaderEnabled !== undefined) updateData.preloaderEnabled = preloaderEnabled
    if (preloaderDuration !== undefined) updateData.preloaderDuration = Number(preloaderDuration)
    if (preloaderLogoText !== undefined) updateData.preloaderLogoText = preloaderLogoText
    if (preloaderBgColor !== undefined) updateData.preloaderBgColor = preloaderBgColor

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    const setting = await prisma.globalSetting.upsert({
      where: { id: 'global' },
      update: updateData,
      create: {
        id: 'global',
        ...DEFAULT_SETTINGS,
        ...updateData,
      },
    })

    return NextResponse.json({ success: true, data: setting })
  } catch (error: any) {
    console.error('Error updating global settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update global settings' },
      { status: 500 }
    )
  }
}
