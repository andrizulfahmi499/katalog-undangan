'use client'

import { motion } from 'framer-motion'

const P = '/templates/royal-garden'

interface CoupleInfo {
  name: string
  parents: string
  instagram?: string
}

interface Props {
  groom: CoupleInfo
  bride: CoupleInfo
}

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.8, ease: 'easeOut' },
}

export default function RoyalGardenCouple({ groom, bride }: Props) {
  return (
    <section className="relative py-20 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #faf6ef 0%, #f5efe3 100%)' }}>
      {/* Floral decorations */}
      <img src={`${P}/flw3.webp`} alt="" className="absolute top-0 right-0 w-28 opacity-50 pointer-events-none rg-float" />
      <img src={`${P}/flw7.webp`} alt="" className="absolute bottom-0 left-0 w-32 opacity-50 pointer-events-none rg-float" style={{ animationDelay: '1.5s' }} />

      {/* Section Header */}
      <motion.div {...fadeIn} className="text-center mb-16">
        <p className="font-cinzel text-[#c9a96e] text-xs tracking-[0.5em] uppercase mb-3">Together With Their Beloved Parents</p>
        <h2 className="font-great-vibes text-[#5a4a2f] text-4xl md:text-5xl mb-4">Bride & Groom</h2>
        <div className="rg-divider" />
        <p className="font-cormorant text-[#7a6b52] text-base mt-4 max-w-md mx-auto italic">
          Request the honor of your presence at the wedding of
        </p>
      </motion.div>

      {/* Groom */}
      <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.2 }} className="flex flex-col items-center mb-16">
        <div className="rg-ornate-frame mb-6">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden">
            <img
              src={`${P}/pexels-filiamariss-11435055-1.jpg`}
              alt={groom.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <h3 className="font-great-vibes text-[#5a4a2f] text-4xl md:text-5xl mb-2">{groom.name}</h3>
        <p className="font-cormorant text-[#7a6b52] text-base">
          {groom.parents}
        </p>
        {groom.instagram && (
          <a href={groom.instagram} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[#c9a96e] text-sm font-cinzel tracking-wider hover:text-[#a07d54] transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            Instagram
          </a>
        )}
      </motion.div>

      {/* Ampersand */}
      <motion.div {...fadeIn} className="flex justify-center mb-16">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#b8956a] flex items-center justify-center shadow-lg">
          <span className="font-great-vibes text-white text-3xl">&</span>
        </div>
      </motion.div>

      {/* Bride */}
      <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.4 }} className="flex flex-col items-center">
        <div className="rg-ornate-frame mb-6">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden">
            <img
              src={`${P}/pexels-filiamariss-12166157-1.jpg`}
              alt={bride.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <h3 className="font-great-vibes text-[#5a4a2f] text-4xl md:text-5xl mb-2">{bride.name}</h3>
        <p className="font-cormorant text-[#7a6b52] text-base">
          {bride.parents}
        </p>
        {bride.instagram && (
          <a href={bride.instagram} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[#c9a96e] text-sm font-cinzel tracking-wider hover:text-[#a07d54] transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            Instagram
          </a>
        )}
      </motion.div>
    </section>
  )
}
