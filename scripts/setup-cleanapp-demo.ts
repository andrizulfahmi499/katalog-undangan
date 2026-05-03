/**
 * Script untuk setup CleanApp Theme Demo
 * 
 * Usage:
 *   npx tsx scripts/setup-cleanapp-demo.ts
 * 
 * Script ini akan:
 * 1. Cek atau buat member demo
 * 2. Aktifkan CleanApp theme
 * 3. Set default configuration
 */

import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up CleanApp Theme Demo...\n')

  // 1. Cek apakah sudah ada member demo
  let demoMember = await prisma.member.findFirst({
    where: {
      OR: [
        { customSlug: 'demo-cleanapp' },
        { email: 'demo-cleanapp@example.com' }
      ]
    }
  })

  if (!demoMember) {
    console.log('📝 Creating demo member...')
    
    // Hash password
    const hashedPassword = await bcrypt.hash('demo123', 10)
    
    // Buat member baru
    demoMember = await prisma.member.create({
      data: {
        name: 'CleanApp Demo',
        email: 'demo-cleanapp@example.com',
        whatsapp: '+6281234567890',
        password: hashedPassword,
        creditPoints: 1000,
        status: 'active',
        landingPageEnabled: true,
        landingPageTheme: 'cleanapp',
        customSlug: 'demo-cleanapp',
        landingPageConfig: {
          hero: {
            title: 'Undangan Digital Terbaik',
            subtitle: 'Buat undangan pernikahan dan ulang tahun yang memorable dengan desain modern',
            ctaText: 'Mulai Sekarang',
            image: '/images/hero-cleanapp.jpg'
          },
          features: {
            title: 'Fitur Unggulan',
            items: [
              {
                icon: 'Sparkles',
                title: 'Desain Modern',
                description: 'Template dengan desain terkini dan elegan'
              },
              {
                icon: 'Zap',
                title: 'Cepat & Responsif',
                description: 'Loading cepat di semua device'
              },
              {
                icon: 'Heart',
                title: 'Mudah Dikustomisasi',
                description: 'Sesuaikan dengan tema acara Anda'
              },
              {
                icon: 'Users',
                title: 'Unlimited Tamu',
                description: 'Kirim ke sebanyak mungkin tamu'
              }
            ]
          },
          templates: {
            title: 'Pilih Template Favorit',
            subtitle: 'Berbagai pilihan template untuk berbagai acara'
          },
          pricing: {
            title: 'Paket Harga Terjangkau',
            tiers: [
              {
                name: 'Basic',
                price: 'Rp 150.000',
                features: [
                  '1 Template Pilihan',
                  'Unlimited Tamu',
                  'RSVP Online',
                  'Gallery Foto'
                ],
                ctaText: 'Pilih Paket',
                recommended: false
              },
              {
                name: 'Premium',
                price: 'Rp 250.000',
                features: [
                  '5 Template Pilihan',
                  'Unlimited Tamu',
                  'RSVP Online',
                  'Gallery Foto & Video',
                  'Custom Domain',
                  'Musik Background'
                ],
                ctaText: 'Pilih Paket',
                recommended: true
              },
              {
                name: 'Ultimate',
                price: 'Rp 350.000',
                features: [
                  'Semua Template',
                  'Unlimited Tamu',
                  'RSVP Online',
                  'Gallery Foto & Video',
                  'Custom Domain',
                  'Musik Background',
                  'Live Streaming',
                  'Priority Support'
                ],
                ctaText: 'Pilih Paket',
                recommended: false
              }
            ]
          },
          faq: {
            title: 'Pertanyaan Umum',
            items: [
              {
                question: 'Bagaimana cara memesan undangan digital?',
                answer: 'Anda bisa memesan melalui form di bawah atau hubungi kami via WhatsApp. Proses pemesanan sangat mudah dan cepat.'
              },
              {
                question: 'Berapa lama proses pembuatan undangan?',
                answer: 'Proses pembuatan undangan memakan waktu 1-2 hari kerja setelah pembayaran dikonfirmasi dan semua data diterima.'
              },
              {
                question: 'Apakah bisa revisi desain?',
                answer: 'Ya, kami menyediakan 2x revisi gratis untuk memastikan undangan sesuai dengan keinginan Anda.'
              },
              {
                question: 'Bagaimana cara mengirim undangan ke tamu?',
                answer: 'Undangan dapat dikirim via WhatsApp, email, atau dibagikan melalui link. Kami juga menyediakan fitur kirim otomatis.'
              },
              {
                question: 'Apakah ada biaya tambahan?',
                answer: 'Tidak ada biaya tersembunyi. Harga yang tertera sudah termasuk semua fitur sesuai paket yang dipilih.'
              },
              {
                question: 'Bagaimana sistem pembayaran?',
                answer: 'Pembayaran dapat dilakukan via transfer bank, e-wallet, atau QRIS. Konfirmasi pembayaran akan diproses maksimal 1x24 jam.'
              }
            ]
          },
          footer: {
            text: 'Undangan Digital Terbaik untuk Momen Spesial Anda',
            contactEmail: 'hello@cleanapp-demo.com',
            contactPhone: '+62 812-3456-7890',
            socialMedia: {
              instagram: 'https://instagram.com/cleanapp',
              facebook: 'https://facebook.com/cleanapp',
              whatsapp: 'https://wa.me/6281234567890'
            }
          },
          colors: {
            primary: '#EC4899',
            secondary: '#8B5CF6',
            accent: '#F59E0B',
            background: '#FFFFFF',
            backgroundSecondary: '#F9FAFB',
            textPrimary: '#111827',
            textSecondary: '#6B7280'
          }
        }
      }
    })
    
    console.log('✅ Demo member created successfully!')
  } else {
    console.log('📝 Updating existing demo member...')
    
    // Update member yang sudah ada
    demoMember = await prisma.member.update({
      where: { id: demoMember.id },
      data: {
        landingPageTheme: 'cleanapp',
        landingPageEnabled: true,
        customSlug: 'demo-cleanapp'
      }
    })
    
    console.log('✅ Demo member updated successfully!')
  }

  console.log('\n📊 Demo Member Info:')
  console.log('   ID:', demoMember.id)
  console.log('   Name:', demoMember.name)
  console.log('   Email:', demoMember.email)
  console.log('   Slug:', demoMember.customSlug)
  console.log('   Theme:', demoMember.landingPageTheme)
  console.log('   Landing Page Enabled:', demoMember.landingPageEnabled)

  console.log('\n🌐 Access URLs:')
  console.log('   Landing Page: http://localhost:3000/demo-cleanapp')
  console.log('   Member Login: http://localhost:3000/login')
  console.log('   Credentials: demo-cleanapp@example.com / demo123')

  console.log('\n✨ CleanApp Theme Demo is ready!')
  console.log('   Open http://localhost:3000/demo-cleanapp in your browser')
  console.log('   Test on mobile: Use Chrome DevTools (F12 → Toggle device toolbar)')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
