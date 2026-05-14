'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const P = '/templates/royal-garden'

interface Props {
  targetDate: string
  eventDateFormatted: string
}

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function RoyalGardenCountdown({ targetDate, eventDateFormatted }: Props) {
  const [time, setTime] = useState(getTimeLeft(targetDate))

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ]

  return (
    <section className="relative py-20 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f5efe3 0%, #efe6d5 100%)' }}>
      {/* Floral corners */}
      <img src={`${P}/flw-11.webp`} alt="" className="absolute top-0 left-0 w-28 opacity-40 pointer-events-none" />
      <img src={`${P}/flw-12.webp`} alt="" className="absolute top-0 right-0 w-28 opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto text-center"
      >
        <h2 className="font-great-vibes text-[#5a4a2f] text-4xl md:text-5xl mb-4">Save the Date</h2>
        <p className="font-cinzel text-[#a08b68] text-sm tracking-[0.3em] uppercase mb-8">{eventDateFormatted}</p>
        <div className="rg-divider mb-10" />

        {/* Countdown boxes */}
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {units.map((u) => (
            <motion.div
              key={u.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-2xl bg-white/80 backdrop-blur-sm border border-[#d4c5a9]/50 shadow-md flex items-center justify-center mb-2">
                <span className="font-cinzel text-[#5a4a2f] text-2xl md:text-4xl font-bold">
                  {String(u.value).padStart(2, '0')}
                </span>
              </div>
              <span className="font-cinzel text-[#a08b68] text-[10px] md:text-xs tracking-[0.2em] uppercase">
                {u.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
