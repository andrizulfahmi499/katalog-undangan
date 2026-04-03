'use client'

import { motion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import { Heart, Sparkles, Users } from 'lucide-react'

export function IntroSection() {
  return (
    <section className="relative py-20 bg-[#FFF9E6] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <Heart className="w-8 h-8 text-[#C2185B] animate-pulse" fill="#C2185B" />
                <Heart className="w-6 h-6 text-[#C2185B]/60" fill="#C2185B" />
                <Heart className="w-4 h-4 text-[#C2185B]/40" fill="#C2185B" />
              </div>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Bukan sekadar undangan biasa...
            </h2>

            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8">
              Kami membantu Anda menciptakan undangan pernikahan digital yang tidak hanya menginformasikan,
              tetapi juga menyentuh hati setiap tamu yang menerimanya. Dengan desain elegan, fitur lengkap,
              dan kemudahan berbagi, momen spesial Anda akan lebih berkesan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C2185B]/10 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-[#C2185B]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Desain Elegan</h3>
                <p className="text-gray-600 text-sm">Pilihan template yang memukau dan dapat dikustomisasi</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C2185B]/10 rounded-full mb-4">
                  <Users className="w-8 h-8 text-[#C2185B]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mudah Dibagikan</h3>
                <p className="text-gray-600 text-sm">Kirim ke ribuan tamu hanya dengan satu klik</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C2185B]/10 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-[#C2185B]" fill="#C2185B" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Penuh Makna</h3>
                <p className="text-gray-600 text-sm">Ceritakan kisah cinta Anda dengan cara yang unik</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
