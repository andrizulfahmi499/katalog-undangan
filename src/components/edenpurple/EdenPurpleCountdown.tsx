'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const P = '/templates/eden/images'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
}

interface Props {
  targetDate: string
}

function RollingDigit({ value, prevValue }: { value: string; prevValue: string }) {
  const changed = value !== prevValue
  return (
    <div className="relative h-[60px] md:h-[80px] w-[40px] md:w-[55px] overflow-hidden">
      <motion.span
        key={value}
        initial={changed ? { y: '100%', opacity: 0 } : { y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-bold"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: '#5b3a8c' }}
      >
        {value}
      </motion.span>
    </div>
  )
}

export default function EdenPurpleCountdown({ targetDate }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [prevTime, setPrevTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(targetDate).getTime() - Date.now())
      setPrevTime(time)
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const pad = (n: number) => String(n).padStart(2, '0')
  const padPrev = (n: number) => String(n).padStart(2, '0')

  const units = [
    { val: pad(time.days), prev: padPrev(prevTime.days), label: 'hari' },
    { val: pad(time.hours), prev: padPrev(prevTime.hours), label: 'jam' },
    { val: pad(time.minutes), prev: padPrev(prevTime.minutes), label: 'mnt' },
    { val: pad(time.seconds), prev: padPrev(prevTime.seconds), label: 'dtk' },
  ]

  return (
    <section
      ref={ref}
      className="relative min-h-[80vh] w-full overflow-hidden flex flex-col items-center justify-center py-20"
      style={{
        backgroundImage: `url(${P}/bg-same-date.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-purple-800/20 to-purple-900/40" />

      {/* Birds */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1 }}
        className="absolute top-[15%] left-[5%] w-[50px] md:w-[80px] pointer-events-none z-20"
      >
        <img src={`${P}/bird-left.jpg`} alt="bird" className="w-full" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1 }}
        className="absolute top-[15%] right-[5%] w-[50px] md:w-[80px] pointer-events-none z-20"
      >
        <img src={`${P}/bird-right.jpg`} alt="bird" className="w-full" />
      </motion.div>

      {/* Butterflies */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[25%] left-[10%] w-[40px] md:w-[60px] pointer-events-none z-20"
      >
        <img src={`${P}/butterfly-left.jpg`} alt="butterfly" className="w-full" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-[25%] right-[10%] w-[40px] md:w-[60px] pointer-events-none z-20"
      >
        <img src={`${P}/butterfly-right.jpg`} alt="butterfly" className="w-full" />
      </motion.div>

      {/* Garden at bottom */}
      <img src={`${P}/garden.jpg`} alt="" className="absolute bottom-0 left-0 w-[180px] md:w-[280px] pointer-events-none select-none z-10" />
      <img src={`${P}/garden.jpg`} alt="" className="absolute bottom-0 right-0 w-[180px] md:w-[280px] pointer-events-none select-none z-10" style={{ transform: 'scaleX(-1)' }} />
      <img src={`${P}/land.jpg`} alt="" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] pointer-events-none select-none z-10" />
      <img src={`${P}/garden-2.jpg`} alt="" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[400px] pointer-events-none select-none z-10" />
      <img src={`${P}/tree.jpg`} alt="" className="absolute bottom-0 right-[5%] w-[80px] md:w-[120px] pointer-events-none select-none z-10" />

      <div className="relative z-30 flex flex-col items-center gap-6 px-6">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-white text-3xl md:text-4xl font-bold text-center"
          style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
        >
          Perhitungan Hari
        </motion.h2>

        {/* Countdown display */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex items-end gap-3 md:gap-5"
        >
          {units.map((unit, i) => (
            <div key={unit.label} className="flex flex-col items-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-2 py-3 md:px-3 md:py-4 flex items-center">
                <RollingDigit value={unit.val[0]} prevValue={unit.prev[0]} />
                <RollingDigit value={unit.val[1]} prevValue={unit.prev[1]} />
              </div>
              <span
                className="text-white/80 text-xs md:text-sm tracking-wider uppercase"
                style={{ fontFamily: "'Urbanist', sans-serif" }}
              >
                {unit.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
