'use client'

import { motion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import { Play, Globe, Palette, Users, CheckCircle, QrCode } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

const features = [
  { icon: <Play className="w-4 h-4" />, label: 'Video Undangan', position: 'left-top' },
  { icon: <Globe className="w-4 h-4" />, label: 'Custom Domain', position: 'left-mid' },
  { icon: <Palette className="w-4 h-4" />, label: '100+ Tema', position: 'left-bot' },
  { icon: <Users className="w-4 h-4" />, label: 'Unlimited Tamu', position: 'right-top' },
  { icon: <CheckCircle className="w-4 h-4" />, label: 'RSVP Online', position: 'right-mid' },
  { icon: <QrCode className="w-4 h-4" />, label: 'QR Code', position: 'right-bot' },
]

const marqueeText = 'Wedding • Birthday • Aqiqah • Khitan • Graduation • Party & Dinner • '

export function PhoneShowcase() {
  const { isLight } = useTheme()

  return (
    <>
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            {/* Section Title */}
            <div className="text-center mb-16 sm:mb-20">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${isLight ? 'text-[#2d3748]' : 'text-white'}`}
              >
                Semua Fitur dalam
                <br />
                <span className={isLight ? 'text-[#8b8fa3]' : 'text-transparent bg-clip-text bg-gradient-to-r from-[#A5B4FC] to-[#FBCFE8]'}>
                  Satu Undangan
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`text-lg max-w-xl mx-auto ${isLight ? 'text-[#6b7280]' : 'text-purple-200/70'}`}
              >
                Undangan digital lengkap dengan fitur premium untuk momen spesial Anda
              </motion.p>
            </div>

            {/* Phone + Floating Badges Container */}
            <div className="relative flex items-center justify-center min-h-[500px] sm:min-h-[600px]">

              {/* Left Badges */}
              <div className="hidden sm:flex flex-col gap-6 absolute left-[5%] lg:left-[12%] top-1/2 -translate-y-1/2 z-20">
                {features.slice(0, 3).map((feature, i) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                    className="relative"
                  >
                    <motion.div
                      animate={{ y: [0, -8 + i * 2, 0] }}
                      transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                      className={`flex items-center gap-3 px-5 py-3 rounded-2xl cursor-default transition-all ${
                        isLight
                          ? 'neu-raised-sm hover:shadow-[8px_8px_16px_#b8bec7,-8px_-8px_16px_#ffffff]'
                          : 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/15'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isLight
                          ? 'neu-pressed-sm text-[#8b8fa3]'
                          : 'bg-gradient-to-br from-[#A5B4FC] to-[#C4B5FD] text-white shadow-lg shadow-[#A5B4FC]/30'
                      }`}>
                        {feature.icon}
                      </div>
                      <span className={`font-semibold text-sm whitespace-nowrap ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>{feature.label}</span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Right Badges */}
              <div className="hidden sm:flex flex-col gap-6 absolute right-[5%] lg:right-[12%] top-1/2 -translate-y-1/2 z-20">
                {features.slice(3, 6).map((feature, i) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                    className="relative"
                  >
                    <motion.div
                      animate={{ y: [0, -6 + i * 3, 0] }}
                      transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                      className={`flex items-center gap-3 px-5 py-3 rounded-2xl cursor-default transition-all ${
                        isLight
                          ? 'neu-raised-sm hover:shadow-[8px_8px_16px_#b8bec7,-8px_-8px_16px_#ffffff]'
                          : 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/15'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isLight
                          ? 'neu-pressed-sm text-[#8b8fa3]'
                          : 'bg-gradient-to-br from-[#C4B5FD] to-[#FBCFE8] text-white shadow-lg shadow-[#C4B5FD]/30'
                      }`}>
                        {feature.icon}
                      </div>
                      <span className={`font-semibold text-sm whitespace-nowrap ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>{feature.label}</span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* === 3D PHONE MOCKUP === */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
                className="relative z-10"
                style={{
                  perspective: '1200px',
                }}
              >
                <motion.div
                  animate={{ rotateY: [-12, -8, -12], rotateX: [3, 5, 3] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Phone Frame */}
                  <div className={`relative w-[260px] h-[520px] sm:w-[280px] sm:h-[560px] rounded-[40px] ${
                    isLight ? 'drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)]' : ''
                  }`}>
                    <img
                      src="/phone-mockup.png"
                      alt="Phone mockup"
                      className="relative inset-0 w-full h-full object-contain"
                    />
                  </div>

                </motion.div>
              </motion.div>

              {/* Mobile Badges (visible on small screens only) */}
              <div className="sm:hidden absolute bottom-0 left-0 right-0 z-20">
                <div className="flex flex-wrap gap-2 justify-center px-4 mt-8">
                  {features.map((feature, i) => (
                    <motion.div
                      key={feature.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                        isLight
                          ? 'neu-flat text-[#2d3748]'
                          : 'bg-white/10 backdrop-blur-xl border border-white/20'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        isLight
                          ? 'text-[#8b8fa3]'
                          : 'bg-gradient-to-br from-[#A5B4FC] to-[#C4B5FD] text-white'
                      }`}>
                        {feature.icon}
                      </div>
                      <span className={`font-medium text-xs ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>{feature.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* === MARQUEE TEXT === */}
      <div className="relative py-8 sm:py-12 overflow-hidden">
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: 'marquee 25s linear infinite',
          }}
        >
          {/* Repeat text 4x for seamless scroll */}
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className={`text-[60px] sm:text-[80px] lg:text-[120px] font-black uppercase tracking-wider select-none mx-4 ${
                isLight ? 'text-[#d1d9e6]' : 'text-white/[0.03]'
              }`}
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {marqueeText}
            </span>
          ))}
        </div>

        {/* Edge fade */}
        <div className={`absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none ${
          isLight
            ? 'bg-gradient-to-r from-[#e0e5ec] to-transparent'
            : 'bg-gradient-to-r from-[#0d0221] to-transparent'
        }`} />
        <div className={`absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none ${
          isLight
            ? 'bg-gradient-to-l from-[#e0e5ec] to-transparent'
            : 'bg-gradient-to-l from-[#0d0221] to-transparent'
        }`} />
      </div>
    </>
  )
}
