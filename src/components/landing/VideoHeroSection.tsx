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

        {/* Light Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-gray-200 text-gray-700 px-4 py-2 rounded-full mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-gray-800" />
              <span className="text-sm font-semibold">Platform Undangan Digital Terbaik</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Bring Your Dream
            <br />
            <span className="text-gray-800">
              Digital Invitation
            </span>
            <br />
            to Life
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-md shadow-gray-200 hover:shadow-lg hover:shadow-gray-300 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Buat Undangan Sekarang
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/80 backdrop-blur-xl border-2 border-gray-200 text-gray-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:shadow-md transition-all flex items-center justify-center gap-2"
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
            className="mt-16 flex items-center justify-center gap-8 sm:gap-16 flex-wrap"
          >
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-600">Undangan Dibuat</div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">99%</div>
              <div className="text-sm text-gray-600">Kepuasan Pelanggan</div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-gray-600 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
