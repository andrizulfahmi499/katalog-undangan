'use client'

import { motion } from 'framer-motion'

const P = '/templates/royal-garden'

interface Props {
  story?: string
}

export default function RoyalGardenStory({ 
  story = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
}: Props) {
  return (
    <section className="relative py-20 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f5efe3 0%, #efe6d5 50%, #f5efe3 100%)' }}>
      {/* Floral decorations */}
      <img src={`${P}/flw5.webp`} alt="" className="absolute top-0 left-0 w-32 opacity-30 pointer-events-none rg-float" />
      <img src={`${P}/flw6.webp`} alt="" className="absolute bottom-0 right-0 w-32 opacity-30 pointer-events-none rg-float" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="max-w-lg mx-auto text-center"
      >
        <p className="font-cinzel text-[#c9a96e] text-xs tracking-[0.5em] uppercase mb-3">Our Love Story</p>
        <h2 className="font-great-vibes text-[#5a4a2f] text-4xl md:text-5xl mb-4">The Journey of Two Souls in Love</h2>
        <div className="rg-divider mb-8" />

        <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-[#d4c5a9]/30 p-8 shadow-sm">
          <p className="font-cormorant text-[#5a4a2f] text-base md:text-lg leading-relaxed">
            {story}
          </p>
        </div>

        {/* Decorative garden illustration */}
        <div className="mt-10">
          <img
            src={`${P}/kuda.webp`}
            alt="Royal carriage"
            className="w-40 mx-auto opacity-60 rg-float"
          />
        </div>
      </motion.div>
    </section>
  )
}
