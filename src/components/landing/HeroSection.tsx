'use client'

import { motion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import { Smartphone, Sparkles } from 'lucide-react'

export function HeroSection() {
  const floatAnimation = {
    y: [-20, 20, -20],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }

  const rotateAnimation = {
    rotate: [-5, 5, -5],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }

  return (
    <section
      id="home"
      className="relative min-h-screen pt-20 overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
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
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
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
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
          {/* Left Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <ScrollReveal>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Platform Undangan Digital Terbaik</span>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Bring Your Dream
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">Digital Invitation</span>
                <span className="block text-gray-200">to Life</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0">
                Buat undangan pernikahan digital yang elegan, modern, dan mudah dibagikan ke seluruh kerabat dan teman Anda.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transition-all"
                >
                  Buat Undangan Sekarang
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-900/80 backdrop-blur-xl border-2 border-purple-500/50 text-purple-400 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-500/10 transition-all"
                >
                  Lihat Demo
                </motion.button>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.8}>
              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">10K+</div>
                  <div className="text-sm text-gray-400">Undangan Dibuat</div>
                </div>
                <div className="w-px h-12 bg-gray-700" />
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">99%</div>
                  <div className="text-sm text-gray-400">Kepuasan Pelanggan</div>
                </div>
                <div className="w-px h-12 bg-gray-700" />
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Content - Smartphone Mockup */}
          <div className="order-1 lg:order-2">
            <ScrollReveal delay={0.3}>
              <motion.div
                animate={floatAnimation}
                className="relative flex justify-center items-center"
              >
                <motion.div
                  animate={rotateAnimation}
                  className="relative"
                >
                  {/* Phone Frame */}
                  <div className="relative w-64 sm:w-72 md:w-80 h-[500px] sm:h-[560px] md:h-[640px] bg-gray-800 rounded-[3rem] p-3 shadow-2xl shadow-purple-500/20 border border-gray-700">
                    {/* Phone Screen */}
                    <div className="relative w-full h-full bg-gray-900 rounded-[2.5rem] overflow-hidden">
                      {/* Status Bar */}
                      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 flex items-center justify-between px-6 z-10">
                        <span className="text-white text-xs">9:41</span>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-2 bg-white/80 rounded-sm" />
                          <div className="w-4 h-2 bg-white/80 rounded-sm" />
                          <div className="w-6 h-3 bg-white/80 rounded-sm" />
                        </div>
                      </div>

                      {/* Invitation Preview */}
                      <div className="h-full bg-gradient-to-b from-gray-900 to-gray-950 pt-10 pb-6 px-4">
                        {/* Couple Names */}
                        <div className="text-center mb-6 mt-8">
                          <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                            Romeo & Juliet
                          </div>
                          <div className="text-sm text-gray-400">Minggu, 25 Desember 2024</div>
                        </div>

                        {/* Decorative Element */}
                        <div className="flex justify-center mb-6">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <span className="text-2xl">💍</span>
                          </div>
                        </div>

                        {/* Wedding Details */}
                        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 mb-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                              <span>📅</span>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400">Hari & Tanggal</div>
                              <div className="text-sm font-semibold text-white">Minggu, 25 Des 2024</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                              <span>📍</span>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400">Lokasi</div>
                              <div className="text-sm font-semibold text-white">Grand Hotel Ballroom</div>
                            </div>
                          </div>
                        </div>

                        {/* RSVP Button Preview */}
                        <button className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white py-3 rounded-full font-semibold text-sm shadow-lg shadow-purple-500/30">
                          Konfirmasi Kehadiran
                        </button>
                      </div>
                    </div>

                    {/* Phone Notch */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-full z-20 border border-gray-700" />
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5
                  }}
                  className="absolute -top-4 -right-4 bg-gray-900/90 backdrop-blur-xl border border-gray-700 p-4 rounded-2xl shadow-xl"
                >
                  <Smartphone className="w-8 h-8 text-purple-400" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 15, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1
                  }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-4 rounded-2xl shadow-xl shadow-purple-500/30"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />
    </section>
  )
}
