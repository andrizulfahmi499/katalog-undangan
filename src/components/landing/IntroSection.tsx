'use client'

import { motion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import { Heart, Sparkles, Users } from 'lucide-react'

export function IntroSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <Heart className="w-8 h-8 text-[#A5B4FC] animate-pulse" fill="currentColor" />
                <Heart className="w-6 h-6 text-[#C4B5FD]" fill="currentColor" />
                <Heart className="w-4 h-4 text-[#FBCFE8]" fill="currentColor" />
              </div>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2F2F2F] mb-8 leading-tight">
              Bukan sekadar undangan biasa...
            </h2>

            <p className="text-lg sm:text-xl text-[#4A4A4A] leading-relaxed mb-12">
              Kami membantu Anda menciptakan undangan pernikahan digital yang tidak hanya menginformasikan,
              tetapi juga menyentuh hati setiap tamu yang menerimanya. Dengan desain elegan, fitur lengkap,
              dan kemudahan berbagi, momen spesial Anda akan lebih berkesan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <motion.div
                whileHover={{ y: -8, rotate: 1 }}
                className="group"
              >
                <div className="text-center p-8 bg-white rounded-3xl shadow-[0_8px_32px_rgba(165,180,252,0.12)] border border-white/60 hover:shadow-[0_16px_48px_rgba(165,180,252,0.20)] transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#A5B4FC] to-[#C4B5FD] rounded-2xl mb-5 shadow-lg shadow-[#A5B4FC]/30">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2F2F2F] mb-3">Desain Elegan</h3>
                  <p className="text-[#6B7280] text-base leading-relaxed">Pilihan template yang memukau dan dapat dikustomisasi</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -8, rotate: -1 }}
                className="group"
              >
                <div className="text-center p-8 bg-white rounded-3xl shadow-[0_8px_32px_rgba(196,181,253,0.12)] border border-white/60 hover:shadow-[0_16px_48px_rgba(196,181,253,0.20)] transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#C4B5FD] to-[#FBCFE8] rounded-2xl mb-5 shadow-lg shadow-[#C4B5FD]/30">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2F2F2F] mb-3">Mudah Dibagikan</h3>
                  <p className="text-[#6B7280] text-base leading-relaxed">Kirim ke ribuan tamu hanya dengan satu klik</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -8, rotate: 1 }}
                className="group"
              >
                <div className="text-center p-8 bg-white rounded-3xl shadow-[0_8px_32px_rgba(251,207,232,0.12)] border border-white/60 hover:shadow-[0_16px_48px_rgba(251,207,232,0.20)] transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FBCFE8] to-[#A5B4FC] rounded-2xl mb-5 shadow-lg shadow-[#FBCFE8]/30">
                    <Heart className="w-10 h-10 text-white" fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2F2F2F] mb-3">Penuh Makna</h3>
                  <p className="text-[#6B7280] text-base leading-relaxed">Ceritakan kisah cinta Anda dengan cara yang unik</p>
                </div>
              </motion.div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
