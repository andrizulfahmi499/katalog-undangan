import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const invitationId = searchParams.get('invitationId')

    if (!invitationId) {
      return NextResponse.json({ success: false, error: 'invitationId is required' }, { status: 400 })
    }

    const angpao = await db.digitalAngpao.findUnique({
      where: { invitationId },
    })

    return NextResponse.json({ success: true, data: angpao })
  } catch (error: any) {
    console.error('Error fetching angpao:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { invitationId, bankName, accountNumber, accountName, qrisImageBase64, deliveryAddress } = body

    if (!invitationId || !bankName || !accountNumber || !accountName) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const angpao = await db.digitalAngpao.upsert({
      where: { invitationId },
      update: {
        bankName,
        accountNumber,
        accountName,
        qrisImageBase64,
        deliveryAddress
      },
      create: {
        invitationId,
        bankName,
        accountNumber,
        accountName,
        qrisImageBase64,
        deliveryAddress
      }
    })

    return NextResponse.json({ success: true, data: angpao })
  } catch (error: any) {
    console.error('Error saving angpao:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
