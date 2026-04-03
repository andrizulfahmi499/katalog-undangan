'use client'

import { motion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import { Check, Star, Crown, Sparkles } from 'lucide-react'

interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  icon: React.ReactNode
  color: string
  gradient: string
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Hemat',
    price: '99K',
    period: 'undangan',
    description: 'Cocok untuk pernikahan sederhana',
    features: [
      '1 Template Pilihan',
      'RSVP Online',
      'Masa Aktif 3 Bulan',
      'Maksimal 100 Tamu',
      'Support Email'
    ],
    icon: <Sparkles className="w-6 h-6" />,
    color: 'bg-white',
    gradient: 'from-[#A5B4FC] to-[#C4B5FD]'
  },
  {
    name: 'Basic',
    price: '199K',
    period: 'undangan',
    description: 'Fitur lebih lengkap',
    features: [
      '5 Template Pilihan',
      'RSVP Online',
      'Lokasi Map',
      'Galeri Foto (10 foto)',
      'Masa Aktif 6 Bulan',
      'Maksimal 300 Tamu',
      'Buku Tamu Digital',
      'Support Email & WhatsApp'
    ],
    icon: <Star className="w-6 h-6" />,
    color: 'bg-white',
    gradient: 'from-[#C4B5FD] to-[#FBCFE8]'
  },
  {
    name: 'Premium',
    price: '349K',
    period: 'undangan',
    description: 'Paling populer - Pilihan terbaik',
    features: [
      '20 Template Premium',
      'RSVP Online',
      'Lokasi Map',
      'Galeri Foto (50 foto)',
      'Video Prewedding',
      'Masa Aktif 12 Bulan',
      'Maksimal 1000 Tamu',
      'Buku Tamu Digital',
      'Fitur Kirim Kado',
      'Custom Domain',
      'No Watermark',
      'Support Priority 24/7'
    ],
    highlighted: true,
    icon: <Crown className="w-6 h-6" />,
    color: 'bg-gradient-to-br from-[#A5B4FC] to-[#C4B5FD]',
    gradient: 'from-[#A5B4FC] to-[#C4B5FD]'
  },
  {
    name: 'Exclusive',
    price: '599K',
    period: 'undangan',
    description: 'Untuk pernikahan impian',
    features: [
      'Unlimited Template',
      'RSVP Online',
      'Lokasi Map',
      'Galeri Foto Unlimited',
      'Video Prewedding',
      'Live Streaming',
      'Masa Aktif Selamanya',
      'Unlimited Tamu',
      'Buku Tamu Digital',
      'Fitur Kirim Kado',
      'Custom Domain',
      'No Watermark',
      'Fitur Custom Request',
      'Dedicated Account Manager',
      'Support VIP 24/7'
    ],
    icon: <Crown className="w-6 h-6" />,
    color: 'bg-white',
    gradient: 'from-[#FBCFE8] to-[#A5B4FC]'
  }
]

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative py-24 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2F2F2F] mb-6">
              Pilih Paket yang Sesuai
            </h2>
            <p className="text-xl text-[#4A4A4A] max-w-2xl mx-auto leading-relaxed">
              Harga terjangkau dengan fitur lengkap untuk pernikahan impian Anda
            </p>
          </div>
        </ScrollReveal>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {pricingPlans.map((plan, index) => (
            <ScrollReveal key={plan.name} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -12, scale: plan.highlighted ? 1.03 : 1.02, rotate: index % 2 === 0 ? 1 : -1 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/80 ${
                  plan.highlighted
                    ? `${plan.color} shadow-[0_20px_60px_rgba(165,180,252,0.25)] border-[#A5B4FC]/50`
                    : `${plan.color} hover:shadow-[0_16px_48px_rgba(165,180,252,0.15)]`
                } transition-all duration-500`}
              >
                {/* Popular Badge */}
                {plan.highlighted && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white px-5 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#A5B4FC]/30"
                  >
                    <Star className="w-4 h-4 fill-current" />
                    POPULER
                  </motion.div>
                )}

                {/* Plan Icon & Name */}
                <div className="text-center mb-8">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-5 ${
                      plan.highlighted
                        ? 'bg-white/30 backdrop-blur-sm'
                        : `bg-gradient-to-br ${plan.gradient} shadow-lg shadow-[#A5B4FC]/20`
                    }`}
                  >
                    <div className={plan.highlighted ? 'text-white' : 'text-white'}>
                      {plan.icon}
                    </div>
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${plan.highlighted ? 'text-white' : 'text-[#2F2F2F]'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-base ${plan.highlighted ? 'text-white/90' : 'text-[#6B7280]'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div
                    className={`text-5xl lg:text-6xl font-bold ${plan.highlighted ? 'text-white' : 'text-[#2F2F2F]'}`}
                  >
                    {plan.price}
                  </div>
                  <div
                    className={`text-base ${plan.highlighted ? 'text-white/80' : 'text-[#9CA3AF]'}`}
                  >
                    per {plan.period}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? 'text-[#FBCFE8]' : 'text-[#A5B4FC]'
                        }`}
                      />
                      <span
                        className={`text-base ${plan.highlighted ? 'text-white/90' : 'text-[#6B7280]'}`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-white text-[#A5B4FC] hover:bg-gray-50 shadow-lg'
                      : 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white hover:shadow-lg hover:shadow-[#A5B4FC]/30'
                  }`}
                >
                  {plan.highlighted ? 'Pilih Paket Ini' : 'Mulai Sekarang'}
                </motion.button>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Additional Info */}
        <ScrollReveal delay={0.5}>
          <div className="mt-20 text-center">
            <p className="text-[#6B7280] mb-6 text-lg">
              Butuh paket kustom untuk pernikahan besar?
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#A5B4FC] border-2 border-[#A5B4FC] px-10 py-4 rounded-2xl font-semibold hover:bg-[#A5B4FC] hover:text-white transition-all shadow-[0_8px_32px_rgba(165,180,252,0.15)]"
            >
              Hubungi Kami untuk Penawaran Khusus
            </motion.button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
