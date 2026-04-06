'use client'

import { motion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import { Play, Globe, Palette, Users, CheckCircle, QrCode } from 'lucide-react'

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
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
              >
                Semua Fitur dalam
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A5B4FC] to-[#FBCFE8]">
                  Satu Undangan
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-purple-200/70 text-lg max-w-xl mx-auto"
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
                      className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/15 transition-all cursor-default"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A5B4FC] to-[#C4B5FD] flex items-center justify-center text-white shadow-lg shadow-[#A5B4FC]/30">
                        {feature.icon}
                      </div>
                      <span className="text-white font-semibold text-sm whitespace-nowrap">{feature.label}</span>
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
                      className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/15 transition-all cursor-default"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C4B5FD] to-[#FBCFE8] flex items-center justify-center text-white shadow-lg shadow-[#C4B5FD]/30">
                        {feature.icon}
                      </div>
                      <span className="text-white font-semibold text-sm whitespace-nowrap">{feature.label}</span>
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
                {/* Purple glow behind phone */}
                <div className="absolute -inset-10 bg-gradient-to-b from-[#A5B4FC]/20 via-[#C4B5FD]/15 to-transparent rounded-full blur-[80px] pointer-events-none" />

                <motion.div
                  animate={{ rotateY: [-12, -8, -12], rotateX: [3, 5, 3] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Phone Frame */}
                  <div className="relative w-[260px] h-[520px] sm:w-[280px] sm:h-[560px] bg-gradient-to-b from-[#1a1a2e] to-[#16162a] rounded-[40px] p-[3px] shadow-[0_25px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(165,180,252,0.15)]">
                    {/* Inner bezel */}
                    <div className="relative w-full h-full bg-[#0f0f1a] rounded-[37px] overflow-hidden">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-[#0f0f1a] rounded-b-[18px] z-30" />

                      {/* Screen Content — Wedding Invitation Preview */}
                      <div className="relative w-full h-full overflow-hidden">
                        {/* Background image gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#2d5a3d] via-[#3a7a4f] to-[#2d5a3d]" />

                        {/* Decorative top pattern */}
                        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/30 to-transparent z-[5]" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
                          {/* Top ornament */}
                          <div className="absolute top-10 left-1/2 -translate-x-1/2">
                            <div className="text-yellow-200/80 text-xs tracking-[0.2em] font-light">THE WEDDING OF</div>
                          </div>

                          {/* Couple Names */}
                          <div className="mt-2">
                            <div className="text-white text-3xl font-serif italic leading-tight">
                              Abu
                            </div>
                            <div className="text-yellow-200/90 text-lg font-light my-1">&</div>
                            <div className="text-white text-3xl font-serif italic leading-tight">
                              Faizah
                            </div>
                          </div>

                          {/* Photo placeholder - couple silhouette */}
                          <div className="mt-6 w-28 h-36 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden">
                            <div className="text-center">
                              <div className="text-3xl">👰🤵</div>
                              <div className="text-white/50 text-[8px] mt-1">Foto Mempelai</div>
                            </div>
                          </div>

                          {/* Guest name section */}
                          <div className="mt-6 text-center">
                            <div className="text-white/60 text-[10px]">Kepada Yth.</div>
                            <div className="text-white/60 text-[10px]">Bapak/Ibu/Saudara/i</div>
                            <div className="text-white font-bold text-sm mt-1">Aldi & Lina</div>
                          </div>

                          {/* CTA Button */}
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mt-4 px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full"
                          >
                            <span className="text-white text-xs font-semibold">Buka Undangan</span>
                          </motion.div>
                        </div>

                        {/* Bottom gradient */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent z-[5]" />
                      </div>
                    </div>
                  </div>

                  {/* Phone reflection/shine effect */}
                  <div className="absolute top-0 left-0 w-full h-full rounded-[40px] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
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
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl"
                    >
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#A5B4FC] to-[#C4B5FD] flex items-center justify-center text-white">
                        {feature.icon}
                      </div>
                      <span className="text-white font-medium text-xs">{feature.label}</span>
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
              className="text-[60px] sm:text-[80px] lg:text-[120px] font-black text-white/[0.03] uppercase tracking-wider select-none mx-4"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {marqueeText}
            </span>
          ))}
        </div>

        {/* Edge fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0d0221] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0d0221] to-transparent z-10 pointer-events-none" />
      </div>
    </>
  )
}
