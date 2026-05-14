'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const P = '/templates/royal-garden'

const DEFAULT_PHOTOS = [
  `${P}/pexels-filiamariss-11484837.jpg`,
  `${P}/pexels-filiamariss-11484849-1.jpg`,
  `${P}/pexels-filiamariss-11484850.jpg`,
  `${P}/pexels-filiamariss-11484854.jpg`,
  `${P}/pexels-filiamariss-11548858.jpg`,
  `${P}/pexels-filiamariss-12166158.jpg`,
  `${P}/pexels-filiamariss-12166159-1.jpg`,
  `${P}/pexels-filiamariss-12166207.jpg`,
  `${P}/pexels-filiamariss-12166212.jpg`,
  `${P}/pexels-filiamariss-12166214.jpg`,
  `${P}/pexels-filiamariss-12166216.jpg`,
  `${P}/pexels-filiamariss-12166241.jpg`,
]

interface Props {
  photos?: string[]
}

export default function RoyalGardenGallery({ photos = DEFAULT_PHOTOS }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <section className="relative py-20 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #efe6d5 0%, #f5efe3 100%)' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <p className="font-cinzel text-[#c9a96e] text-xs tracking-[0.5em] uppercase mb-3">Our Precious Moments</p>
        <h2 className="font-great-vibes text-[#5a4a2f] text-4xl md:text-5xl mb-4">Gallery</h2>
        <div className="rg-divider" />
      </motion.div>

      {/* Masonry Grid */}
      <div className="max-w-lg mx-auto columns-2 gap-3 space-y-3">
        {photos.map((photo, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="break-inside-avoid cursor-pointer group"
            onClick={() => setLightbox(i)}
          >
            <div className="rounded-2xl overflow-hidden border border-[#d4c5a9]/30 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:border-[#c9a96e]/50">
              <img
                src={photo}
                alt={`Gallery ${i + 1}`}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-3xl max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[lightbox]}
                alt={`Gallery ${lightbox + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
              {/* Close */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#5a4a2f] shadow-lg hover:bg-white transition-colors"
              >
                ✕
              </button>
              {/* Navigation */}
              {lightbox > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1) }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-[#5a4a2f] shadow-lg hover:bg-white transition-colors"
                >
                  ‹
                </button>
              )}
              {lightbox < photos.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1) }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-[#5a4a2f] shadow-lg hover:bg-white transition-colors"
                >
                  ›
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
