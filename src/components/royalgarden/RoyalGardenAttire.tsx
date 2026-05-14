'use client'

import { motion } from 'framer-motion'

interface Props {
  colors?: { name: string; hex: string }[]
}

const DEFAULT_COLORS = [
  { name: 'Sage', hex: '#8b9a7b' },
  { name: 'Beige', hex: '#d5c2a1' },
  { name: 'Blush', hex: '#e8b4b8' },
  { name: 'Ivory', hex: '#fffff0' },
  { name: 'Gold', hex: '#c9a96e' },
]

export default function RoyalGardenAttire({ colors = DEFAULT_COLORS }: Props) {
  return (
    <section className="relative py-20 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f5efe3 0%, #efe6d5 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto text-center"
      >
        <p className="font-cinzel text-[#c9a96e] text-xs tracking-[0.5em] uppercase mb-3">Dress Code</p>
        <h2 className="font-great-vibes text-[#5a4a2f] text-4xl md:text-5xl mb-4">Attire</h2>
        <div className="rg-divider mb-6" />
        <p className="font-cormorant text-[#7a6b52] text-base italic mb-10">
          We kindly encourage our guests to wear these colors for our special day
        </p>

        {/* Color swatches */}
        <div className="flex flex-wrap justify-center gap-6">
          {colors.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#d4c5a9] shadow-lg transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: c.hex }}
              />
              <span className="font-cinzel text-[#7a6b52] text-[10px] tracking-[0.2em] uppercase">{c.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
