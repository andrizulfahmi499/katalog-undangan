'use client'

import { motion } from 'framer-motion'

const P = '/templates/royal-garden'

interface Props {
  groomName: string
  brideName: string
  thankYouMessage?: string
}

export default function RoyalGardenClosing({ groomName, brideName, thankYouMessage }: Props) {
  return (
    <section className="relative py-24 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f5efe3 0%, #efe6d5 50%, #f5efe3 100%)' }}>
      {/* Garden closing illustration */}
      <img src={`${P}/penutup3.webp`} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none" />

      {/* Floral corners */}
      <img src={`${P}/flw1.webp`} alt="" className="absolute top-0 left-0 w-28 opacity-40 pointer-events-none rg-float" />
      <img src={`${P}/flw2.webp`} alt="" className="absolute top-0 right-0 w-28 opacity-40 pointer-events-none rg-float" style={{ animationDelay: '1s' }} />
      <img src={`${P}/flw5.webp`} alt="" className="absolute bottom-0 left-0 w-32 opacity-40 pointer-events-none rg-float" style={{ animationDelay: '2s' }} />
      <img src={`${P}/flw6.webp`} alt="" className="absolute bottom-0 right-0 w-32 opacity-40 pointer-events-none rg-float" style={{ animationDelay: '0.5s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-md mx-auto"
      >
        <img src={`${P}/flowersg.webp`} alt="" className="w-16 mx-auto mb-6 opacity-70" />

        <h2 className="font-great-vibes text-[#5a4a2f] text-5xl md:text-6xl mb-4">Thank You</h2>
        <div className="rg-divider mb-6" />

        <p className="font-cormorant text-[#7a6b52] text-base italic mb-8 leading-relaxed">
          {thankYouMessage || "It is a pleasure and honor for us, if you are willing to attend and give us your blessing."}
        </p>

        <h3 className="font-great-vibes text-[#5a4a2f] text-4xl md:text-5xl mb-2">{groomName}</h3>
        <p className="font-cinzel text-[#c9a96e] text-2xl mb-2">&</p>
        <h3 className="font-great-vibes text-[#5a4a2f] text-4xl md:text-5xl mb-8">{brideName}</h3>

        {/* Carriage illustration */}
        <img src={`${P}/kuda.webp`} alt="Royal carriage" className="w-48 mx-auto opacity-50 mb-8 rg-float" />

        {/* Footer */}
        <div className="border-t border-[#d4c5a9]/40 pt-6">
          <p className="font-cinzel text-[#a08b68] text-[10px] tracking-[0.3em] uppercase">
            Katalog Undangan © {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>
    </section>
  )
}
