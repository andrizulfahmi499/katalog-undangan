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
    color: 'bg-white'
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
    color: 'bg-white'
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
    color: 'bg-gray-900'
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
    color: 'bg-white'
  }
]

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative py-20 bg-gray-50 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Pilih Paket yang Sesuai
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Harga terjangkau dengan fitur lengkap untuk pernikahan impian Anda
            </p>
          </div>
        </ScrollReveal>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {pricingPlans.map((plan, index) => (
            <ScrollReveal key={plan.name} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: plan.highlighted ? 1.02 : 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`relative ${plan.color} rounded-3xl p-6 lg:p-8 border-2 ${
                  plan.highlighted
                    ? 'border-gray-900 shadow-2xl'
                    : 'border-gray-200 shadow-sm hover:shadow-md'
                } hover:shadow-lg transition-all duration-300`}
              >
                {/* Popular Badge */}
                {plan.highlighted && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-amber-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-md"
                  >
                    <Star className="w-4 h-4 fill-current" />
                    POPULER
                  </motion.div>
                )}

                {/* Plan Icon & Name */}
                <div className="text-center mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
                      plan.highlighted ? 'bg-white/20' : 'bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className={plan.highlighted ? 'text-white' : 'text-gray-800'}>
                      {plan.icon}
                    </div>
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.highlighted ? 'text-white/80' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div
                    className={`text-4xl lg:text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}
                  >
                    {plan.price}
                  </div>
                  <div
                    className={`text-sm ${plan.highlighted ? 'text-white/80' : 'text-gray-500'}`}
                  >
                    per {plan.period}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? 'text-amber-400' : 'text-gray-800'
                        }`}
                      />
                      <span
                        className={`text-sm ${plan.highlighted ? 'text-white/90' : 'text-gray-700'}`}
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
                  className={`w-full py-3 px-6 rounded-full font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'
                      : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'
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
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">
              Butuh paket kustom untuk pernikahan besar?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent text-gray-900 border-2 border-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Hubungi Kami untuk Penawaran Khusus
            </motion.button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
