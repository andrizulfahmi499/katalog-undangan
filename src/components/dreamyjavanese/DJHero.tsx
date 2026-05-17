'use client'
import { motion } from 'framer-motion'

const ASSET = '/images/themes/dreamy-javanese'

interface Props {
  groomName: string
  brideName: string
  formattedDate: string
  coverImage?: string
}

export default function DJHero({ groomName, brideName, formattedDate, coverImage }: Props) {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={coverImage || `${ASSET}/585c26d0-e603-11f0-87fb-874a516696dc.jpg`} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#2f2115]" />
      </div>

      {/* Top ornament */}
      <img src={`${ASSET}/paperize_2.png`} alt="" className="absolute top-0 left-0 w-full opacity-40 pointer-events-none" />

      {/* Florals */}
      <img src={`${ASSET}/leaves_large.png`} alt="" className="absolute top-0 left-0 w-32 md:w-48 opacity-50 pointer-events-none" />
      <img src={`${ASSET}/flower_red.png`} alt="" className="absolute top-4 right-0 w-28 md:w-40 opacity-40 scale-x-[-1] pointer-events-none" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-6"
      >
        <img src={`${ASSET}/quotes_decor_13.png`} alt="" className="w-32 mx-auto mb-6 opacity-60" />
        <p className="font-dreamy-title text-[#d0ba96] tracking-[0.3em] uppercase text-xs md:text-sm mb-6">The Wedding Of</p>

        <h1 className="font-dreamy-display text-6xl md:text-8xl text-[#eedcbd] leading-none">{groomName}</h1>
        <span className="font-dreamy-display text-4xl text-[#d0ba96]/50 block my-3">&amp;</span>
        <h1 className="font-dreamy-display text-6xl md:text-8xl text-[#eedcbd] leading-none">{brideName}</h1>

        <div className="w-20 h-px bg-[#d0ba96]/40 mx-auto my-8" />
        <p className="font-dreamy-title text-[#d0ba96] tracking-[0.2em] uppercase text-xs">{formattedDate}</p>
      </motion.div>

      {/* Bottom torn paper edge */}
      <img src={`${ASSET}/paperize_5.png`} alt="" className="absolute bottom-0 left-0 w-full pointer-events-none" />
    </section>
  )
}
