'use client'

import { motion } from 'framer-motion'
import { Play, Sparkles, ArrowRight } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export function VideoHeroSection() {
  const { isLight } = useTheme()

  return (
    <section id="home" className="relative min-h-screen w-full overflow-visible pb-24">
      {/* Subtle Gradient Overlay (starry bg shows through) */}
      {!isLight && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0221]/40 via-[#2a0845]/20 to-transparent" />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-[140px] sm:pt-[120px] md:pt-[110px]">
        <div className="text-center max-w-4xl mx-auto mt-8 sm:mt-12 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl ${
              isLight
                ? 'neu-raised-sm text-[#6b7280]'
                : 'bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
            }`}>
              <span className="text-sm font-semibold">Platform Undangan Digital Terbaik</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight ${
              isLight ? 'text-[#2d3748]' : 'text-white'
            }`}
          >
            Bring Your Dream
            <br />
            <span className={isLight ? 'text-[#8b8fa3]' : 'text-[#A5B4FC]'}>
              Digital Invitation
            </span>
            <br />
            to Life
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${
              isLight ? 'text-[#6b7280]' : 'text-purple-200/90'
            }`}
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
              className={`px-10 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 ${
                isLight
                  ? 'neu-btn text-[#2d3748] hover:shadow-[inset_2px_2px_4px_#b8bec7,inset_-2px_-2px_4px_#ffffff]'
                  : 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white shadow-lg shadow-[#A5B4FC]/30 hover:shadow-xl hover:shadow-[#C4B5FD]/40'
              } transition-all`}
            >
              <Play className="w-5 h-5" />
              Buat Undangan Sekarang
            </motion.a>
            <motion.a
              href="#catalog"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`px-10 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                isLight
                  ? 'neu-flat text-[#6b7280] hover:text-[#2d3748]'
                  : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:shadow-lg'
              }`}
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
              className={`w-full text-center px-6 py-4 rounded-2xl ${
                isLight
                  ? 'neu-raised'
                  : 'bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
              }`}
            >
              <div className={`text-3xl sm:text-4xl font-bold ${isLight ? 'text-[#2d3748]' : 'text-[#A5B4FC]'}`}>10K+</div>
              <div className={`text-sm mt-1 ${isLight ? 'text-[#9ca3af]' : 'text-purple-200/80'}`}>Undangan Dibuat</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              className={`w-full text-center px-6 py-4 rounded-2xl ${
                isLight
                  ? 'neu-raised'
                  : 'bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
              }`}
            >
              <div className={`text-3xl sm:text-4xl font-bold ${isLight ? 'text-[#2d3748]' : 'text-[#C4B5FD]'}`}>99%</div>
              <div className={`text-sm mt-1 ${isLight ? 'text-[#9ca3af]' : 'text-purple-200/80'}`}>Kepuasan Pelanggan</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              className={`w-full text-center px-6 py-4 rounded-2xl ${
                isLight
                  ? 'neu-raised'
                  : 'bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
              }`}
            >
              <div className={`text-3xl sm:text-4xl font-bold ${isLight ? 'text-[#2d3748]' : 'text-[#FBCFE8]'}`}>24/7</div>
              <div className={`text-sm mt-1 ${isLight ? 'text-[#9ca3af]' : 'text-purple-200/80'}`}>Support</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
