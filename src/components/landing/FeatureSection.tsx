'use client'

import { motion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import Lottie from 'lottie-react'
import { Calendar, MapPin, Image, MessageSquare, Gift } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

// Placeholder animation data (in production, replace with actual Lottie JSON files)
const createPlaceholderAnimation = (iconName: string) => ({
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: iconName,
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Icon Shape',
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 1, k: [
          { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0 },
          { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 30 },
          { t: 60 }
        ], ix: 10 },
        p: { a: 0, k: [50, 50, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 }
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              d: 1,
              ty: 'el',
              s: { a: 0, k: [60, 60], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              nm: 'Ellipse Path 1',
              mn: 'ADBE Vector Shape - Ellipse',
              hd: false
            }
          ],
          nm: 'Ellipse 1',
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: 'ADBE Vector Group',
          hd: false
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    }
  ]
})

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  gradient: string
  animationData: any
}

const features: Feature[] = [
  {
    icon: <Calendar className="w-10 h-10" />,
    title: 'RSVP Online',
    description: 'Kelola konfirmasi kehadiran tamu dengan mudah dan real-time',
    color: 'bg-[#A5B4FC]',
    gradient: 'from-[#A5B4FC] to-[#C4B5FD]',
    animationData: createPlaceholderAnimation('rsvp')
  },
  {
    icon: <MapPin className="w-10 h-10" />,
    title: 'Lokasi Map',
    description: 'Integrasi Google Maps untuk memudahkan tamu menemukan lokasi',
    color: 'bg-[#C4B5FD]',
    gradient: 'from-[#C4B5FD] to-[#FBCFE8]',
    animationData: createPlaceholderAnimation('map')
  },
  {
    icon: <Image className="w-10 h-10" />,
    title: 'Galeri Foto',
    description: 'Tampilkan foto prewedding dan momen spesial Anda',
    color: 'bg-[#FBCFE8]',
    gradient: 'from-[#FBCFE8] to-[#A5B4FC]',
    animationData: createPlaceholderAnimation('gallery')
  },
  {
    icon: <MessageSquare className="w-10 h-10" />,
    title: 'Buku Tamu Digital',
    description: 'Terima ucapan dan doa dari tamu secara digital',
    color: 'bg-[#A5B4FC]',
    gradient: 'from-[#A5B4FC] to-[#C4B5FD]',
    animationData: createPlaceholderAnimation('guestbook')
  },
  {
    icon: <Gift className="w-10 h-10" />,
    title: 'Kirim Kado',
    description: 'Integrasi fitur angpao digital dan daftar kado',
    color: 'bg-[#C4B5FD]',
    gradient: 'from-[#C4B5FD] to-[#FBCFE8]',
    animationData: createPlaceholderAnimation('gift')
  },
  {
    icon: <Calendar className="w-10 h-10" />,
    title: 'Countdown Timer',
    description: 'Hitung mundur menuju hari bahagia Anda',
    color: 'bg-[#FBCFE8]',
    gradient: 'from-[#FBCFE8] to-[#A5B4FC]',
    animationData: createPlaceholderAnimation('countdown')
  }
]

export function FeatureSection() {
  const { isLight } = useTheme()

  return (
    <section
      id="fitur"
      className="relative py-24 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${
              isLight ? 'text-[#2d3748]' : 'text-white'
            }`}>
              Fitur Lengkap untuk Momen Spesial
            </h2>
            <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${
              isLight ? 'text-[#6b7280]' : 'text-purple-200/80'
            }`}>
              Semua yang Anda butuhkan untuk undangan pernikahan digital yang sempurna
            </p>
          </div>
        </ScrollReveal>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -12, rotate: index % 2 === 0 ? 2 : -2 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative p-8 rounded-3xl transition-all duration-500 ${
                  isLight
                    ? 'neu-raised hover:shadow-[10px_10px_20px_#b8bec7,-10px_-10px_20px_#ffffff]'
                    : 'bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/15 hover:bg-white/15 hover:shadow-[0_20px_60px_rgba(165,180,252,0.2)]'
                }`}
              >
                {/* Icon Container */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative"
                  >
                    <div className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-shadow duration-300 ${
                      isLight
                        ? 'neu-pressed text-[#8b8fa3]'
                        : `bg-gradient-to-br ${feature.gradient} shadow-lg ${feature.color.replace('bg-', 'shadow-')}/30 hover:shadow-xl`
                    }`}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <div className={isLight ? '' : 'text-white'}>
                          {feature.icon}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                <h3 className={`text-2xl font-bold mb-4 text-center ${
                  isLight ? 'text-[#2d3748]' : 'text-white'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-center leading-relaxed text-base ${
                  isLight ? 'text-[#6b7280]' : 'text-purple-200/70'
                }`}>
                  {feature.description}
                </p>

                {/* Decorative Element */}
                <motion.div
                  className={`absolute -top-3 -right-3 w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isLight
                      ? 'neu-raised-sm text-[#8b8fa3]'
                      : `${feature.color} shadow-lg`
                  }`}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className={`text-lg ${isLight ? '' : 'text-white'}`}>✨</span>
                </motion.div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA Section */}
        <ScrollReveal delay={0.5}>
          <div className="mt-20 text-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`px-12 py-5 rounded-3xl font-semibold text-xl transition-all duration-300 ${
                isLight
                  ? 'neu-btn text-[#2d3748] hover:shadow-[inset_2px_2px_4px_#b8bec7,inset_-2px_-2px_4px_#ffffff]'
                  : 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white shadow-lg shadow-[#A5B4FC]/30 hover:shadow-xl hover:shadow-[#C4B5FD]/40'
              }`}
            >
              Jelajahi Semua Fitur
            </motion.button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
