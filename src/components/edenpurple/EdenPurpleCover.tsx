'use client'

import { motion, AnimatePresence } from 'framer-motion'

const P = '/templates/eden/images'

interface Props {
  isOpened: boolean
  onOpen: () => void
  guestName?: string
  groomName?: string
  brideName?: string
}

export default function EdenPurpleCover({ isOpened, onOpen, guestName, groomName, brideName }: Props) {
  return (
    <AnimatePresence>
      {!isOpened && (
        <motion.div
          key="eden-cover"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #e8dff5 0%, #f5f0ff 40%, #ede4f7 100%)' }}
        >
          {/* Portal floral arch */}
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            src={`${P}/portal.jpg`}
            alt="Floral Portal"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] object-contain pointer-events-none select-none z-10"
          />

          {/* Butterflies */}
          <motion.div
            animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[20%] left-[10%] w-[60px] md:w-[80px] pointer-events-none z-20"
          >
            <img src={`${P}/butterfly-left.jpg`} alt="butterfly" className="w-full" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -8, 0], x: [0, -5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute top-[25%] right-[10%] w-[60px] md:w-[80px] pointer-events-none z-20"
          >
            <img src={`${P}/butterfly-right.jpg`} alt="butterfly" className="w-full" />
          </motion.div>

          {/* Content */}
          <div className="relative z-30 flex flex-col items-center justify-center gap-3 mt-[30vh]">
            <p className="text-[#7c5cbf] text-xs tracking-[0.3em] uppercase font-light">
              Pernikahan Dari
            </p>

            <h1
              className="text-[#5b3a8c] text-3xl md:text-4xl font-bold text-center leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {groomName || 'Michael Jonathan'}
              <br />
              <span className="text-xl md:text-2xl font-light">&</span>
              <br />
              {brideName || 'Jessica Williams'}
            </h1>

            {guestName && (
              <div className="text-center mt-3">
                <p className="text-[#8b6db5] text-sm" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  Kepada Yth.
                </p>
                <p
                  className="text-[#5b3a8c] text-lg font-semibold"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {guestName}
                </p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpen}
              className="mt-6 flex items-center gap-2 rounded-full px-8 py-3 shadow-lg transition-all"
              style={{
                background: 'linear-gradient(135deg, #9b6dd7 0%, #7c4dbd 100%)',
                fontFamily: "'Urbanist', sans-serif",
              }}
            >
              <svg viewBox="0 0 24 24" className="w-4 fill-white">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 11.5L4 10V6l8 5.5L20 6v4l-8 5.5z" />
              </svg>
              <span className="text-white text-sm font-medium tracking-wider">
                BUKA UNDANGAN
              </span>
            </motion.button>
          </div>

          {/* Bottom garden */}
          <img
            src={`${P}/fountain.jpg`}
            alt="Garden"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[700px] object-contain pointer-events-none select-none z-10"
          />

          {/* Bush decorations */}
          <img
            src={`${P}/bush-left.jpg`}
            alt="bush"
            className="absolute bottom-0 left-0 w-[200px] md:w-[300px] object-contain pointer-events-none select-none z-10"
          />
          <img
            src={`${P}/bush-right.jpg`}
            alt="bush"
            className="absolute bottom-0 right-0 w-[200px] md:w-[300px] object-contain pointer-events-none select-none z-10"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
