'use client'

import { motion } from 'framer-motion'

interface Product3DModelProps {
  src?: string
  alt?: string
  poster?: string
  className?: string
  style?: React.CSSProperties
}

export default function Product3DModel({
  className = '',
  style,
}: Product3DModelProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a2f2a] to-[#0f1a17] ${className}`}
      style={style}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Rotating 3D card stack */}
        <motion.div
          animate={{
            rotateY: [0, 360],
            rotateX: [15, -15, 15],
          }}
          transition={{
            rotateY: { duration: 12, repeat: Infinity, ease: 'linear' },
            rotateX: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{ perspective: '800px' }}
          className="relative w-40 h-52"
        >
          {/* Front card - Wedding invitation preview */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#a8d5c4]/20 to-[#a8d5c4]/5 border border-[#a8d5c4]/30 backdrop-blur-sm flex flex-col items-center justify-center p-4 shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Mini invitation content */}
            <div className="w-full h-full rounded-xl bg-[#172a26]/80 border border-white/10 flex flex-col items-center justify-center gap-2 p-3">
              <div className="w-8 h-8 rounded-full bg-[#a8d5c4]/20 border border-[#a8d5c4]/30 flex items-center justify-center">
                <span className="text-[#a8d5c4]/60 text-xs">♥</span>
              </div>
              <span className="text-white/60 text-[9px] uppercase tracking-widest font-bold" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                Wedding
              </span>
              <span className="text-white/40 text-[8px] italic" style={{ fontFamily: "'Arapey', serif" }}>
                & invitation
              </span>
              <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-[#a8d5c4]/30 to-transparent mt-1" />
              <span className="text-white/30 text-[7px] uppercase tracking-widest" style={{ fontFamily: "'Lato', sans-serif" }}>
                Save the date
              </span>
            </div>
          </motion.div>

          {/* Floating decorative elements */}
          <motion.div
            animate={{ y: [-8, 8, -8], rotate: [0, 180, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 -right-4 w-8 h-8 opacity-40"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#a8d5c4]">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
            </svg>
          </motion.div>

          <motion.div
            animate={{ y: [8, -8, 8], rotate: [360, 180, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-3 -left-3 w-6 h-6 opacity-30"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#a8d5c4]">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Second card in stack (behind) */}
        <motion.div
          animate={{
            rotateY: [180, 540],
            rotateX: [-15, 15, -15],
          }}
          transition={{
            rotateY: { duration: 12, repeat: Infinity, ease: 'linear', delay: 0.5 },
            rotateX: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          }}
          style={{ perspective: '800px' }}
          className="absolute w-40 h-52"
        >
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#a8d5c4]/10 to-transparent border border-[#a8d5c4]/20 backdrop-blur-sm flex items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[#a8d5c4]/10 border border-[#a8d5c4]/20 flex items-center justify-center">
                <span className="text-[#a8d5c4]/50 text-lg">✦</span>
              </div>
              <span className="text-white/30 text-[10px] uppercase tracking-widest" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                Premium
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#a8d5c4]/40"
          style={{
            left: `${15 + (i * 10) % 70}%`,
            top: `${20 + (i * 15) % 60}%`,
          }}
          animate={{
            y: [-15, 15, -15],
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Bottom label */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#a8d5c4]">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </motion.div>
          <span className="text-white/60 text-xs">3D Wedding Preview</span>
        </div>
      </div>
    </div>
  )
}