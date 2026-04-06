'use client'

import { motion } from 'framer-motion'
import { Play, Sparkles, ArrowRight } from 'lucide-react'

export function VideoHeroSection() {
  return (
    <section id="home" className="relative min-h-screen w-full overflow-visible pb-24">
      {/* Subtle Gradient Overlay (starry bg shows through) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0221]/40 via-[#2a0845]/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-[140px] sm:pt-[120px] md:pt-[110px]">
        <div className="text-center max-w-4xl mx-auto mt-8 sm:mt-12 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <span className="text-sm font-semibold">Platform Undangan Digital Terbaik</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Bring Your Dream
            <br />
            <span className="text-[#A5B4FC]">
              Digital Invitation
            </span>
            <br />
            to Life
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl text-purple-200/90 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Buat undangan pernikahan digital yang elegan, modern, dan mudah dibagikan ke seluruh kerabat dan teman Anda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              href="#order-form"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-[#A5B4FC]/30 hover:shadow-xl hover:shadow-[#C4B5FD]/40 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Buat Undangan Sekarang
            </motion.a>
            <motion.a
              href="#catalog"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Lihat Tema
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-20 flex flex-col items-stretch justify-start gap-4 px-4 sm:px-0"
          >
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="w-full text-center px-6 py-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-[#A5B4FC]">10K+</div>
              <div className="text-sm text-purple-200/80 mt-1">Undangan Dibuat</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="w-full text-center px-6 py-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-[#C4B5FD]">99%</div>
              <div className="text-sm text-purple-200/80 mt-1">Kepuasan Pelanggan</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="w-full text-center px-6 py-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-[#FBCFE8]">24/7</div>
              <div className="text-sm text-purple-200/80 mt-1">Support</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
