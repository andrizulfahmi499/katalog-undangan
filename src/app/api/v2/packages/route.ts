import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Seed default packages if none exist
const DEFAULT_PACKAGES = [
  {
    slug: 'tanpa_foto',
    name: 'Tanpa Foto',
    description: 'Cocok untuk syar\'i, tersedia karakter ilustrasi sebagai pengganti foto pasangan.',
    regularPrice: 199000,
    promoPrice: 99000,
    popular: false,
    isActive: true,
    sortOrder: 1,
    features: [
      'Akses semua template',
      'Karakter ilustrasi pasangan',
      'Edit unlimited 24/7',
      'Tamu tidak terbatas',
      'Aktif selamanya',
      'RSVP & ucapan online',
      'Kado digital & QRIS',
    ],
  },
  {
    slug: 'dengan_foto',
    name: 'Dengan Foto',
    description: 'Upload foto pasangan, galeri prewedding, dan love story timeline.',
    regularPrice: 249000,
    promoPrice: 149000,
    popular: true,
    isActive: true,
    sortOrder: 2,
    features: [
      'Semua fitur Tanpa Foto, plus:',
      'Upload foto pasangan',
      'Galeri foto & video (max 12)',
      'Love story timeline',
      'Live streaming integration',
      'Google Maps lokasi',
      'Dress code dengan palet warna',
      'Protokol kesehatan',
    ],
  },
]

async function seedPackages() {
  const count = await db.v2Package.count()
  if (count === 0) {
    for (const pkg of DEFAULT_PACKAGES) {
      await db.v2Package.create({
        data: { ...pkg, features: pkg.features as any },
      })
    }
  }
}

export async function GET() {
  try {
    // Seed if empty
    await seedPackages()

    const packages = await db.v2Package.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })

    const result = packages.map(pkg => ({
      id: pkg.slug,
      slug: pkg.slug,
      name: pkg.name,
      description: pkg.description,
      regularPrice: pkg.regularPrice,
      promoPrice: pkg.promoPrice,
      popular: pkg.popular,
      features: pkg.features as string[],
    }))

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Packages GET error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
