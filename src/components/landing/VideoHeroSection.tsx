'use client'

import { motion } from 'framer-motion'
import { Play, Sparkles, ArrowRight } from 'lucide-react'

export function VideoHeroSection() {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://is3.cloudhost.id/zaavitationwp-com/2025/01/Hearder-Motion-Vertical.mp4"
        >
          <source
            src="https://is3.cloudhost.id/zaavitationwp-com/2025/01/Hearder-Motion-Vertical.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Soft Gradient Overlay - Claymorphism Style */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-[#F7F7F8]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-[140px] sm:pt-[130px]">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200 text-[#2F2F2F] px-5 py-2.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <span className="text-sm font-semibold">Platform Undangan Digital Terbaik</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#2F2F2F] mb-6 leading-tight"
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
            className="text-lg sm:text-xl text-[#4A4A4A] mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Buat undangan pernikahan digital yang elegan, modern, dan mudah dibagikan ke seluruh kerabat dan teman Anda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-[#A5B4FC]/30 hover:shadow-xl hover:shadow-[#C4B5FD]/40 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Buat Undangan Sekarang
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/90 backdrop-blur-xl border-2 border-[#A5B4FC] text-[#A5B4FC] px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-[#A5B4FC] hover:text-white hover:shadow-lg hover:shadow-[#A5B4FC]/30 transition-all flex items-center justify-center gap-2"
            >
              Lihat Demo
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-20 flex items-center justify-center gap-8 sm:gap-16 flex-wrap"
          >
            <div className="text-center px-6 py-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="text-3xl sm:text-4xl font-bold text-[#A5B4FC]">10K+</div>
              <div className="text-sm text-[#6B7280] mt-1">Undangan Dibuat</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center px-6 py-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="text-3xl sm:text-4xl font-bold text-[#C4B5FD]">99%</div>
              <div className="text-sm text-[#6B7280] mt-1">Kepuasan Pelanggan</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center px-6 py-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="text-3xl sm:text-4xl font-bold text-[#FBCFE8]">24/7</div>
              <div className="text-sm text-[#6B7280] mt-1">Support</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-7 h-11 border-2 border-[#A5B4FC]/50 rounded-2xl flex justify-center pt-2 bg-white/50 backdrop-blur-sm"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
