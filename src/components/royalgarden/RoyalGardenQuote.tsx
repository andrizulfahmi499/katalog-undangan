'use client'

import { motion } from 'framer-motion'

const P = '/templates/royal-garden'

interface Props {
  verse?: string
  source?: string
}

export default function RoyalGardenQuote({ 
  verse = '"But at the beginning of creation God \'made them male and female.\' \'For this reason a man will leave his father and mother and be united to his wife, and the two will become one flesh.\' So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate."',
  source = 'Mark 10:6-9'
}: Props) {
  return (
    <section className="relative py-20 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f5efe3 0%, #f0e8d8 50%, #f5efe3 100%)' }}>
      {/* Decorative florals */}
      <img src={`${P}/flw8.webp`} alt="" className="absolute top-4 left-4 w-24 opacity-40 pointer-events-none rg-float" />
      <img src={`${P}/flw9.webp`} alt="" className="absolute bottom-4 right-4 w-24 opacity-40 pointer-events-none rg-float" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="max-w-lg mx-auto text-center"
      >
        {/* Ornamental top */}
        <img src={`${P}/flowersg-1.webp`} alt="" className="w-16 mx-auto mb-6 opacity-70" />

        {/* Verse */}
        <p className="font-cormorant text-[#5a4a2f] text-lg md:text-xl leading-relaxed italic mb-6">
          {verse}
        </p>

        <div className="rg-divider mb-4" />

        {/* Source */}
        <p className="font-cinzel text-[#c9a96e] text-sm tracking-[0.3em] uppercase font-semibold">
          {source}
        </p>
      </motion.div>
    </section>
  )
}
