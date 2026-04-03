'use client'

import { motion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import Lottie from 'lottie-react'
import { Calendar, MapPin, Image, MessageSquare, Gift } from 'lucide-react'

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
  animationData: any
}

const features: Feature[] = [
  {
    icon: <Calendar className="w-8 h-8" />,
    title: 'RSVP Online',
    description: 'Kelola konfirmasi kehadiran tamu dengan mudah dan real-time',
    color: 'from-purple-500/20 to-pink-500/20',
    animationData: createPlaceholderAnimation('rsvp')
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: 'Lokasi Map',
    description: 'Integrasi Google Maps untuk memudahkan tamu menemukan lokasi',
    color: 'from-pink-500/20 to-rose-500/20',
    animationData: createPlaceholderAnimation('map')
  },
  {
    icon: <Image className="w-8 h-8" />,
    title: 'Galeri Foto',
    description: 'Tampilkan foto prewedding dan momen spesial Anda',
    color: 'from-rose-500/20 to-fuchsia-500/20',
    animationData: createPlaceholderAnimation('gallery')
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: 'Buku Tamu Digital',
    description: 'Terima ucapan dan doa dari tamu secara digital',
    color: 'from-fuchsia-500/20 to-purple-500/20',
    animationData: createPlaceholderAnimation('guestbook')
  },
  {
    icon: <Gift className="w-8 h-8" />,
    title: 'Kirim Kado',
    description: 'Integrasi fitur angpao digital dan daftar kado',
    color: 'from-purple-500/20 to-pink-500/20',
    animationData: createPlaceholderAnimation('gift')
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: 'Countdown Timer',
    description: 'Hitung mundur menuju hari bahagia Anda',
    color: 'from-pink-500/20 to-rose-500/20',
    animationData: createPlaceholderAnimation('countdown')
  }
]

export function FeatureSection() {
  return (
    <section
      id="features"
      className="relative py-20 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 overflow-hidden"
    >
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Fitur Lengkap untuk Momen Spesial
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk undangan pernikahan digital yang sempurna
            </p>
          </div>
        </ScrollReveal>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative p-6 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-gray-800/40 to-gray-900/20 border-2 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20"
              >
                {/* Lottie Animation Container */}
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="relative"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <div className="text-purple-400">
                          {feature.icon}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-center leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Element */}
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-white text-sm">✨</span>
                </motion.div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA Section */}
        <ScrollReveal delay={0.5}>
          <div className="mt-16 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transition-all"
            >
              Jelajahi Semua Fitur
            </motion.button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
