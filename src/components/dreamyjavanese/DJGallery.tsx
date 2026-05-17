'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ASSET = '/images/themes/dreamy-javanese'

interface Props {
  photos?: string[]
}

export default function DJGallery({ photos }: Props) {
  const defaultPhotos = [
    `${ASSET}/585c26d0-e603-11f0-87fb-874a516696dc.jpg`,
    `${ASSET}/e528ab20-2b03-11f1-8d42-3751074be7f4.jpg`,
    `${ASSET}/4594f7a0-c1d9-11f0-b712-11587ef54e67.png`,
  ]
  const items = photos && photos.length > 0 ? photos : defaultPhotos
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <section className="relative w-full py-20 overflow-hidden" style={{ backgroundColor: '#2f2115' }}>
      <img src={`${ASSET}/paperize.png`} alt="" className="absolute inset-0 w-full h-full object-cover opacity-8 pointer-events-none" />

      {/* Florals */}
      <img src={`${ASSET}/rose.png`} alt="" className="absolute top-4 right-0 w-28 opacity-25 pointer-events-none" />
      <img src={`${ASSET}/blue_flower.png`} alt="" className="absolute bottom-4 left-0 w-32 opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-dreamy-title text-[#d0ba96] tracking-[0.3em] uppercase text-xs mb-3">Moments</p>
          <h2 className="font-dreamy-display text-4xl md:text-5xl text-[#eedcbd]">Gallery</h2>
        </motion.div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 gap-3">
          {items.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(i)}
              className={`cursor-pointer overflow-hidden rounded-lg border border-[#d0ba96]/20 ${i === 0 ? 'col-span-2 h-52' : 'h-40'}`}
            >
              <img src={photo} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={items[selected]}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <button className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl">&times;</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
