'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const P = '/templates/eden/images'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
}

interface CoupleData {
  name: string
  parents: string
  instagram?: string
}

interface Props {
  groom: CoupleData
  bride: CoupleData
}

export default function EdenPurpleCouple({ groom, bride }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center py-20"
      style={{ background: 'linear-gradient(180deg, #f5f0ff 0%, #ede4f7 50%, #e8dff5 100%)' }}
    >
      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1 }}
        className="absolute top-[10%] left-0 w-[120px] md:w-[180px] pointer-events-none select-none"
      >
        <img src={`${P}/leaf-1.jpg`} alt="leaf" className="w-full" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1 }}
        className="absolute top-[10%] right-0 w-[120px] md:w-[180px] pointer-events-none select-none"
        style={{ transform: 'scaleX(-1)' }}
      >
        <img src={`${P}/leaf-1.jpg`} alt="leaf" className="w-full" />
      </motion.div>

      {/* Butterflies */}
      <motion.div
        animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[15%] right-[15%] w-[50px] md:w-[70px] pointer-events-none z-20"
      >
        <img src={`${P}/butterfly-left.jpg`} alt="butterfly" className="w-full" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0], x: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[20%] left-[15%] w-[50px] md:w-[70px] pointer-events-none z-20"
      >
        <img src={`${P}/butterfly-right.jpg`} alt="butterfly" className="w-full" />
      </motion.div>

      {/* Flower top decoration */}
      <motion.img
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        src={`${P}/flower-top.jpg`}
        alt="flower"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] md:w-[300px] pointer-events-none select-none z-10"
      />

      {/* Content */}
      <div className="relative z-30 flex flex-col items-center gap-8 px-6 max-w-lg">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[#8b6db5] text-sm tracking-widest uppercase"
          style={{ fontFamily: "'Urbanist', sans-serif" }}
        >
          Dengan segala cinta dan harapan
        </motion.p>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center text-[#6b4d8e] text-base leading-relaxed max-w-sm"
          style={{ fontFamily: "'Urbanist', sans-serif" }}
        >
          Kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri pernikahan kami
        </motion.p>

        {/* Groom */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center"
        >
          <h2
            className="text-[#5b3a8c] text-4xl md:text-5xl font-bold"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {groom.name}
          </h2>
          <p
            className="text-[#8b6db5] text-base mt-2"
            style={{ fontFamily: "'Urbanist', sans-serif" }}
          >
            {groom.parents}
          </p>
          {groom.instagram && (
            <a
              href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9b6dd7] text-sm mt-1 inline-block hover:underline"
              style={{ fontFamily: "'Urbanist', sans-serif" }}
            >
              @{groom.instagram.replace('@', '')}
            </a>
          )}
        </motion.div>

        {/* Ampersand */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[#9b6dd7] text-5xl font-light"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          &
        </motion.div>

        {/* Bride */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center"
        >
          <h2
            className="text-[#5b3a8c] text-4xl md:text-5xl font-bold"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {bride.name}
          </h2>
          <p
            className="text-[#8b6db5] text-base mt-2"
            style={{ fontFamily: "'Urbanist', sans-serif" }}
          >
            {bride.parents}
          </p>
          {bride.instagram && (
            <a
              href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9b6dd7] text-sm mt-1 inline-block hover:underline"
              style={{ fontFamily: "'Urbanist', sans-serif" }}
            >
              @{bride.instagram.replace('@', '')}
            </a>
          )}
        </motion.div>
      </div>

      {/* Bottom garden decorations */}
      <img
        src={`${P}/garden.jpg`}
        alt="garden"
        className="absolute bottom-0 left-0 w-[200px] md:w-[280px] pointer-events-none select-none z-10"
      />
      <img
        src={`${P}/garden.jpg`}
        alt="garden"
        className="absolute bottom-0 right-0 w-[200px] md:w-[280px] pointer-events-none select-none z-10"
        style={{ transform: 'scaleX(-1)' }}
      />
    </section>
  )
}
