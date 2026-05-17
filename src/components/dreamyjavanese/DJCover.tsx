'use client'
import { motion, AnimatePresence } from 'framer-motion'

const ASSET = '/images/themes/dreamy-javanese'

interface Props {
  groomName: string
  brideName: string
  guestName?: string
  isOpened: boolean
  onOpen: () => void
  coverImage?: string
}

export default function DJCover({ groomName, brideName, guestName, isOpened, onOpen, coverImage }: Props) {
  return (
    <AnimatePresence>
      {!isOpened && (
        <motion.div
          key="cover"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0">
            <img src={coverImage || `${ASSET}/585c26d0-e603-11f0-87fb-874a516696dc.jpg`} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#2f2115]" />
          </div>

          {/* Floating particles */}
          <div className="dj-sparkles" />

          {/* Corner florals */}
          <img src={`${ASSET}/leaves_large.png`} alt="" className="absolute top-0 left-0 w-40 md:w-56 opacity-60 -rotate-12 pointer-events-none" />
          <img src={`${ASSET}/flower_red.png`} alt="" className="absolute top-0 right-0 w-36 md:w-48 opacity-50 rotate-12 pointer-events-none scale-x-[-1]" />
          <img src={`${ASSET}/branch_flower.png`} alt="" className="absolute bottom-0 left-0 w-44 md:w-60 opacity-40 pointer-events-none" />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="relative z-10 flex flex-col items-center text-center px-6"
          >
            <p className="font-dreamy-title text-[#d0ba96] tracking-[0.3em] uppercase text-xs md:text-sm mb-4">The Wedding Of</p>
            
            <h1 className="font-dreamy-display text-5xl md:text-7xl text-[#eedcbd] leading-tight">
              {groomName}
            </h1>
            <span className="font-dreamy-display text-3xl md:text-4xl text-[#d0ba96]/60 my-2">&amp;</span>
            <h1 className="font-dreamy-display text-5xl md:text-7xl text-[#eedcbd] leading-tight mb-8">
              {brideName}
            </h1>

            <div className="w-16 h-px bg-[#d0ba96]/40 mb-6" />

            <p className="font-dreamy-body text-[#d0ba96] text-sm mb-1">Kepada Yth.</p>
            <p className="font-dreamy-body text-[#eedcbd] text-lg mb-1">{guestName || 'Tamu Undangan'}</p>
            <p className="font-dreamy-body text-[#d0ba96] text-sm mb-8">di Tempat</p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpen}
              className="px-10 py-3.5 bg-[#4a3623]/80 backdrop-blur-sm hover:bg-[#5a432d] text-[#eedcbd] border border-[#d0ba96]/50 rounded-full transition-all font-dreamy-title tracking-[0.2em] text-xs uppercase"
            >
              Buka Undangan
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
