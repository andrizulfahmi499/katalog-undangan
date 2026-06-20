import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/v2Auth'

const DEFAULT_EDITOR_CONFIG = {
  cover: { labelAtas: 'The Wedding Of', namaPasangan: '', tanggal: '', teksKepada: 'Kepada Yth.', labelTombol: 'Buka Undangan', enabled: true },
  groom: { namaLengkap: '', namaPanggilan: '', orangTua: '', instagram: '', fotoUrl: '', enabled: true },
  bride: { namaLengkap: '', namaPanggilan: '', orangTua: '', instagram: '', fotoUrl: '', enabled: true },
  quotes: { teksArab: '', kutipan: '', sumber: '', enabled: true },
  countdown: { enabled: true },
  loveStory: { stories: [], enabled: false },
  dresscode: { instruction: '', colors: [], avoidColors: '', note: '', enabled: false },
  liveStreaming: { url: '', tanggal: '', waktu: '', description: '', enabled: false },
  amplopDigital: { enabled: true },
  alamatKado: { address: '', enabled: false },
  penutup: { message: '', enabled: true },
}

// GET - List invitations
export async function GET() {
  try {
    const session = await requireSession()

    const invitations = await db.endUserInvitation.findMany({
      where: { endUserId: session.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        events: true,
        _count: { select: { guests: true, rsvpEntries: true } },
      },
    })

    return NextResponse.json({
      success: true,
      data: invitations,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get invitations error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

// POST - Create invitation
export async function POST(request: NextRequest) {
  try {
    const session = await requireSession()
    const { templateSlug, subdomain } = await request.json()

    if (!subdomain) {
      return NextResponse.json({ error: 'Subdomain harus diisi' }, { status: 400 })
    }

    // Validate subdomain
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(subdomain)) {
      return NextResponse.json({ error: 'Subdomain hanya boleh huruf kecil, angka, dan strip (-)' }, { status: 400 })
    }

    // Check uniqueness
    const existing = await db.endUserInvitation.findUnique({ where: { subdomain } })
    if (existing) {
      return NextResponse.json({ error: 'Subdomain sudah digunakan' }, { status: 409 })
    }

    const user = await db.endUser.findUnique({ where: { id: session.userId } })
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    const invitation = await db.endUserInvitation.create({
      data: {
        endUserId: session.userId,
        templateSlug: templateSlug || 'starry-sea',
        subdomain,
        editorConfig: DEFAULT_EDITOR_CONFIG,
        ogTitle: `The Wedding of ${subdomain}`,
        primaryColor: '#D0A77B',
      },
    })

    // Create default events
    const defaultDate = new Date()
    defaultDate.setFullYear(defaultDate.getFullYear() + 1)

    await db.endUserEvent.createMany({
      data: [
        {
          invitationId: invitation.id,
          eventName: 'Akad Nikah',
          date: defaultDate,
          startTime: '08:00',
          endTime: '10:00',
          isMainEvent: true,
        },
        {
          invitationId: invitation.id,
          eventName: 'Resepsi',
          date: defaultDate,
          startTime: '11:00',
          endTime: '14:00',
          isMainEvent: false,
        },
      ],
    })

    // Update user subdomain if first invitation
    if (!user.subdomain) {
      await db.endUser.update({
        where: { id: session.userId },
        data: { subdomain },
      })
    }

    return NextResponse.json({
      success: true,
      data: invitation,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Create invitation error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
