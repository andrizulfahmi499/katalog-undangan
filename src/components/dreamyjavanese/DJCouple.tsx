'use client'
import { motion } from 'framer-motion'

const ASSET = '/images/themes/dreamy-javanese'

interface PersonProps {
  name: string
  parents: string
  instagram?: string
  photo?: string
}

interface Props {
  groom: PersonProps
  bride: PersonProps
}

function PersonCard({ person, side }: { person: PersonProps; side: 'left' | 'right' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: side === 'left' ? 0.2 : 0.4 }}
      className="flex flex-col items-center text-center max-w-xs"
    >
      {/* Photo frame with ornamental border */}
      <div className="relative w-44 h-56 md:w-52 md:h-64 mb-6">
        <img src={`${ASSET}/couple_decor_13.png`} className="absolute inset-0 w-full h-full object-contain z-20 scale-[1.15]" alt="" />
        <img
          src={person.photo || `${ASSET}/4594f7a0-c1d9-11f0-b712-11587ef54e67.png`}
          className="absolute inset-[6%] w-[88%] h-[88%] object-cover rounded-t-[50%] z-10"
          alt={person.name}
        />
      </div>

      <h2 className="font-dreamy-display text-3xl md:text-4xl text-[#eedcbd] mb-3">{person.name}</h2>
      <p className="font-dreamy-body text-sm text-[#d0ba96] leading-relaxed">{person.parents}</p>
      
      {person.instagram && (
        <a href={person.instagram} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[#d0ba96]/70 hover:text-[#eedcbd] text-xs transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          Instagram
        </a>
      )}
    </motion.div>
  )
}

export default function DJCouple({ groom, bride }: Props) {
  return (
    <section className="relative w-full py-20 overflow-hidden" style={{ backgroundColor: '#261a10' }}>
      {/* Background texture */}
      <img src={`${ASSET}/paperize.png`} alt="" className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none" />
      
      {/* Wayang decorations */}
      <img src={`${ASSET}/wayang_female.png`} alt="" className="absolute left-0 bottom-0 w-24 md:w-36 opacity-20 pointer-events-none" />
      <img src={`${ASSET}/wayang_male.png`} alt="" className="absolute right-0 bottom-0 w-24 md:w-36 opacity-20 pointer-events-none scale-x-[-1]" />

      {/* Top torn paper */}
      <img src={`${ASSET}/paperize_3.png`} alt="" className="absolute top-0 left-0 w-full pointer-events-none opacity-80" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-dreamy-title text-[#d0ba96] tracking-[0.3em] uppercase text-xs">Bride & Groom</p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          <PersonCard person={groom} side="left" />
          
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-dreamy-display text-5xl text-[#d0ba96]/40"
          >
            &amp;
          </motion.span>
          
          <PersonCard person={bride} side="right" />
        </div>
      </div>

      {/* Bottom torn paper */}
      <img src={`${ASSET}/paperize_5.png`} alt="" className="absolute bottom-0 left-0 w-full pointer-events-none opacity-80" />
    </section>
  )
}
