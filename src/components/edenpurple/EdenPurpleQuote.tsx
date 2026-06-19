'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const P = '/templates/eden/images'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
}

interface Props {
  quote?: string
  source?: string
}

export default function EdenPurpleQuote({ quote, source }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const displayQuote = quote || 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.'
  const displaySource = source || '1 Corinthians 13:4'

  return (
    <section
      ref={ref}
      className="relative min-h-[70vh] w-full overflow-hidden flex flex-col items-center justify-center py-20"
      style={{ background: 'linear-gradient(180deg, #f5f0ff 0%, #ede4f7 50%, #e8dff5 100%)' }}
    >
      {/* Garden decorations */}
      <img
        src={`${P}/garden.jpg`}
        alt="garden"
        className="absolute bottom-0 left-0 w-[200px] md:w-[300px] pointer-events-none select-none z-10"
      />
      <img
        src={`${P}/garden.jpg`}
        alt="garden"
        className="absolute bottom-0 right-0 w-[200px] md:w-[300px] pointer-events-none select-none z-10"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Cloud decorations */}
      <motion.img
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        src={`${P}/cloud-purple.jpg`}
        alt="cloud"
        className="absolute top-0 left-0 w-[120px] md:w-[200px] pointer-events-none select-none"
      />
      <motion.img
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
        src={`${P}/cloud-purple.jpg`}
        alt="cloud"
        className="absolute top-0 right-0 w-[120px] md:w-[200px] pointer-events-none select-none"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Birds */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1 }}
        className="absolute top-[20%] left-[5%] w-[60px] md:w-[90px] pointer-events-none z-20"
      >
        <img src={`${P}/bird-left.jpg`} alt="bird" className="w-full" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1 }}
        className="absolute top-[20%] right-[5%] w-[60px] md:w-[90px] pointer-events-none z-20"
      >
        <img src={`${P}/bird-right.jpg`} alt="bird" className="w-full" />
      </motion.div>

      <div className="relative z-30 flex flex-col items-center gap-4 px-8 max-w-lg">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[#5b3a8c] text-xl md:text-2xl text-center italic leading-relaxed"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          &ldquo;{displayQuote}&rdquo;
        </motion.p>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[#8b6db5] text-sm tracking-wider"
          style={{ fontFamily: "'Urbanist', sans-serif" }}
        >
          - {displaySource} -
        </motion.p>
      </div>
    </section>
  )
}
