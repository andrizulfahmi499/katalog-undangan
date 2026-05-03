'use client'

import { motion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import { ParallaxContainer } from './animations/ParallaxContainer'
import { Heart, Sparkles, Users } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export function IntroSection() {
  const { isLight } = useTheme()

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal threshold={0.1}>
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <ParallaxContainer speed={0.3} direction="up">
                  <Heart className={`w-8 h-8 animate-pulse ${isLight ? 'text-[#8b8fa3]' : 'text-[#A5B4FC]'}`} fill="currentColor" />
                </ParallaxContainer>
                <ParallaxContainer speed={0.5} direction="up">
                  <Heart className={`w-6 h-6 ${isLight ? 'text-[#a0a4b8]' : 'text-[#C4B5FD]'}`} fill="currentColor" />
                </ParallaxContainer>
                <ParallaxContainer speed={0.8} direction="up">
                  <Heart className={`w-4 h-4 ${isLight ? 'text-[#b8bec7]' : 'text-[#FBCFE8]'}`} fill="currentColor" />
                </ParallaxContainer>
              </div>
            </motion.div>

            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight ${
              isLight ? 'text-[#2d3748]' : 'text-white'
            }`}>
              Bukan sekadar undangan biasa...
            </h2>

            <p className={`text-lg sm:text-xl leading-relaxed mb-12 ${
              isLight ? 'text-[#6b7280]' : 'text-purple-200/80'
            }`}>
              Kami membantu Anda menciptakan undangan pernikahan digital yang tidak hanya menginformasikan,
              tetapi juga menyentuh hati setiap tamu yang menerimanya. Dengan desain elegan, fitur lengkap,
              dan kemudahan berbagi, momen spesial Anda akan lebih berkesan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <motion.div
                whileHover={{ y: -8, rotate: 1 }}
                className="group"
              >
                <div className={`text-center p-8 rounded-3xl transition-all duration-300 ${
                  isLight
                    ? 'neu-raised hover:shadow-[10px_10px_20px_#b8bec7,-10px_-10px_20px_#ffffff]'
                    : 'bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/15 hover:bg-white/15 hover:shadow-[0_16px_48px_rgba(165,180,252,0.2)]'
                }`}>
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 ${
                    isLight
                      ? 'neu-pressed text-[#8b8fa3]'
                      : 'bg-gradient-to-br from-[#A5B4FC] to-[#C4B5FD] shadow-lg shadow-[#A5B4FC]/30'
                  }`}>
                    <Sparkles className={`w-10 h-10 ${isLight ? '' : 'text-white'}`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>Desain Elegan</h3>
                  <p className={`text-base leading-relaxed ${isLight ? 'text-[#6b7280]' : 'text-purple-200/70'}`}>Pilihan template yang memukau dan dapat dikustomisasi</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -8, rotate: -1 }}
                className="group"
              >
                <div className={`text-center p-8 rounded-3xl transition-all duration-300 ${
                  isLight
                    ? 'neu-raised hover:shadow-[10px_10px_20px_#b8bec7,-10px_-10px_20px_#ffffff]'
                    : 'bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/15 hover:bg-white/15 hover:shadow-[0_16px_48px_rgba(196,181,253,0.2)]'
                }`}>
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 ${
                    isLight
                      ? 'neu-pressed text-[#8b8fa3]'
                      : 'bg-gradient-to-br from-[#C4B5FD] to-[#FBCFE8] shadow-lg shadow-[#C4B5FD]/30'
                  }`}>
                    <Users className={`w-10 h-10 ${isLight ? '' : 'text-white'}`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>Mudah Dibagikan</h3>
                  <p className={`text-base leading-relaxed ${isLight ? 'text-[#6b7280]' : 'text-purple-200/70'}`}>Kirim ke ribuan tamu hanya dengan satu klik</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -8, rotate: 1 }}
                className="group"
              >
                <div className={`text-center p-8 rounded-3xl transition-all duration-300 ${
                  isLight
                    ? 'neu-raised hover:shadow-[10px_10px_20px_#b8bec7,-10px_-10px_20px_#ffffff]'
                    : 'bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/15 hover:bg-white/15 hover:shadow-[0_16px_48px_rgba(251,207,232,0.2)]'
                }`}>
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 ${
                    isLight
                      ? 'neu-pressed text-[#8b8fa3]'
                      : 'bg-gradient-to-br from-[#FBCFE8] to-[#A5B4FC] shadow-lg shadow-[#FBCFE8]/30'
                  }`}>
                    <Heart className={`w-10 h-10 ${isLight ? '' : 'text-white'}`} fill="currentColor" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>Penuh Makna</h3>
                  <p className={`text-base leading-relaxed ${isLight ? 'text-[#6b7280]' : 'text-purple-200/70'}`}>Ceritakan kisah cinta Anda dengan cara yang unik</p>
                </div>
              </motion.div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
