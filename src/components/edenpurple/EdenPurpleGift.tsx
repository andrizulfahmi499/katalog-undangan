'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

const P = '/templates/eden/images'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
}

interface Props {
  bankName?: string
  accountName?: string
  accountNumber?: string
  hashtag?: string
}

export default function EdenPurpleGift({ bankName, accountName, accountNumber, hashtag }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [copied, setCopied] = useState(false)

  const displayBank = bankName || 'BANK BCA'
  const displayName = accountName || 'Michael & Jessica'
  const displayNumber = accountNumber || '123 456 7890'
  const displayHashtag = hashtag || '#MichaelJessicaWedding'

  const handleCopy = () => {
    const num = displayNumber.replace(/\s/g, '')
    navigator.clipboard?.writeText(num).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center py-20"
      style={{ background: 'linear-gradient(180deg, #f5f0ff 0%, #ede4f7 50%, #e8dff5 100%)' }}
    >
      {/* Garden decorations */}
      <img src={`${P}/garden.jpg`} alt="" className="absolute bottom-0 left-0 w-[200px] md:w-[300px] pointer-events-none select-none z-10" />
      <img src={`${P}/garden.jpg`} alt="" className="absolute bottom-0 right-0 w-[200px] md:w-[300px] pointer-events-none select-none z-10" style={{ transform: 'scaleX(-1)' }} />

      {/* Portal */}
      <img src={`${P}/portal.jpg`} alt="" className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] pointer-events-none select-none z-10" />

      {/* Bush decorations */}
      <img src={`${P}/bush-left.jpg`} alt="" className="absolute bottom-0 left-0 w-[160px] md:w-[220px] pointer-events-none select-none z-10" />
      <img src={`${P}/bush-right.jpg`} alt="" className="absolute bottom-0 right-0 w-[160px] md:w-[220px] pointer-events-none select-none z-10" />

      <div className="relative z-30 flex flex-col items-center gap-6 px-6 max-w-md w-full">
        {/* Envelope icon */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <img src={`${P}/envelope-gift.jpg`} alt="gift" className="w-[120px] md:w-[160px]" />
        </motion.div>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[#5b3a8c] text-3xl md:text-4xl font-bold text-center"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Hadiah Pernikahan
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[#6b4d8e] text-sm text-center leading-relaxed max-w-sm"
          style={{ fontFamily: "'Urbanist', sans-serif" }}
        >
          Tanpa mengurangi rasa hormat, bagi Anda yang ingin mengirimkan hadiah pernikahan, dapat melalui:
        </motion.p>

        {/* Bank card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="w-full rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-[#d4c5e8]"
        >
          <p
            className="text-[#5b3a8c] text-lg font-bold text-center"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {displayBank}
          </p>
          <p
            className="text-[#8b6db5] text-sm text-center mt-1"
            style={{ fontFamily: "'Urbanist', sans-serif" }}
          >
            a.n. {displayName}
          </p>

          <div className="py-3 my-3 border-y border-[#d4c5e8]">
            <p
              className="text-2xl font-mono tracking-wider font-bold text-[#5b3a8c] text-center"
            >
              {displayNumber}
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="w-full rounded-full py-2.5 text-sm font-semibold tracking-wider transition-all"
            style={{
              background: copied
                ? 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)'
                : 'linear-gradient(135deg, #9b6dd7 0%, #7c4dbd 100%)',
              fontFamily: "'Urbanist', sans-serif",
              color: 'white',
            }}
          >
            {copied ? '✓ Tersalin!' : '📋 SALIN NO. REKENING'}
          </button>
        </motion.div>

        {/* Hashtag */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[#9b6dd7] text-sm font-semibold"
          style={{ fontFamily: "'Urbanist', sans-serif" }}
        >
          {displayHashtag}
        </motion.p>

        {/* Kirim Hadiah button */}
        <motion.a
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          href="#"
          className="rounded-full border-2 border-[#9b6dd7] px-8 py-2.5 text-[#5b3a8c] text-sm font-semibold tracking-wider hover:bg-[#9b6dd7] hover:text-white transition-all"
          style={{ fontFamily: "'Urbanist', sans-serif" }}
        >
          Kirim Hadiah
        </motion.a>
      </div>
    </section>
  )
}
