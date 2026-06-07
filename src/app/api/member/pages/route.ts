import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const invitationId = searchParams.get('invitationId')

    if (!invitationId) {
      return NextResponse.json({ success: false, error: 'Invitation ID is required' }, { status: 400 })
    }

    const pages = await db.invitationPage.findMany({
      where: { invitationId },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ success: true, data: pages })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { invitationId, category, layoutId, order, content } = body

    if (!invitationId || !category || !layoutId || order === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const page = await db.invitationPage.create({
      data: {
        invitationId,
        category,
        layoutId,
        order,
        content: content || {}
      }
    })

    return NextResponse.json({ success: true, data: page })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, isEnabled, content } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Page ID is required' }, { status: 400 })
    }

    const updateData: any = {}
    if (isEnabled !== undefined) updateData.isEnabled = isEnabled
    if (content !== undefined) updateData.content = content

    const page = await db.invitationPage.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, data: page })
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Page ID is required' }, { status: 400 })
    }

    await db.invitationPage.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
