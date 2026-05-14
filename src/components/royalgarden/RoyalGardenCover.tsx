'use client'

import { motion, AnimatePresence } from 'framer-motion'

const P = '/templates/royal-garden'

interface Props {
  isOpened: boolean
  onOpen: () => void
  guestName?: string
  groomName: string
  brideName: string
  eventDate: string
}

export default function RoyalGardenCover({ isOpened, onOpen, guestName, groomName, brideName, eventDate }: Props) {
  return (
    <AnimatePresence>
      {!isOpened && (
        <motion.div
          key="rg-cover"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        >
          {/* Background garden illustration */}
          <img
            src={`${P}/penutup3.webp`}
            alt="Royal Garden"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf6ef]/30 via-transparent to-[#faf6ef]/60" />

          {/* Floating florals */}
          <img src={`${P}/flw1.webp`} alt="" className="absolute top-0 left-0 w-32 md:w-48 opacity-80 rg-float pointer-events-none" />
          <img src={`${P}/flw2.webp`} alt="" className="absolute top-0 right-0 w-32 md:w-48 opacity-80 rg-float pointer-events-none" style={{ animationDelay: '1s' }} />
          <img src={`${P}/flw5.webp`} alt="" className="absolute bottom-0 left-0 w-40 md:w-56 opacity-70 rg-float pointer-events-none" style={{ animationDelay: '2s' }} />
          <img src={`${P}/flw6.webp`} alt="" className="absolute bottom-0 right-0 w-40 md:w-56 opacity-70 rg-float pointer-events-none" style={{ animationDelay: '0.5s' }} />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative z-10 flex flex-col items-center justify-center text-center px-6"
          >
            {/* Ornamental top */}
            <img src={`${P}/flowersg.webp`} alt="" className="w-20 md:w-28 mb-4 rg-float opacity-90" />

            {/* Family & Friend label */}
            <p className="font-cinzel text-[#8a7656] text-xs md:text-sm tracking-[0.4em] uppercase mb-2">
              Family & Friends
            </p>

            {/* Date */}
            <p className="font-cinzel text-[#a08b68] text-sm md:text-base tracking-wider mb-6">
              {eventDate}
            </p>

            {/* Couple names */}
            <h1 className="font-great-vibes text-[#5a4a2f] text-5xl md:text-7xl leading-tight mb-2">
              {groomName}
            </h1>
            <p className="font-cinzel text-[#c9a96e] text-2xl md:text-3xl mb-2">&</p>
            <h1 className="font-great-vibes text-[#5a4a2f] text-5xl md:text-7xl leading-tight mb-6">
              {brideName}
            </h1>

            {/* Guest name */}
            {guestName && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6 text-center"
              >
                <p className="font-cormorant text-[#7a6b52] text-sm">Kepada Yth.</p>
                <p className="font-cinzel text-[#5a4a2f] text-lg font-semibold">{guestName}</p>
              </motion.div>
            )}

            {/* Open button */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(201, 169, 110, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpen}
              className="flex items-center gap-3 rounded-full bg-gradient-to-r from-[#c9a96e] to-[#b8956a] px-8 py-3.5 shadow-lg text-white font-cinzel text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:from-[#b8956a] hover:to-[#a07d54]"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1h2a2 2 0 012 2v9a2 2 0 01-2 2zM5 6v12h14V9h-4V6H5z" />
              </svg>
              OPEN
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
