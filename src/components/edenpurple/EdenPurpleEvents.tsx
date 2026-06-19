'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const P = '/templates/eden/images'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
}

interface EventData {
  title: string
  day: string
  month: string
  date: string
  year: string
  time: string
  venue: string
  address: string
  mapsUrl?: string
}

interface Props {
  events: EventData[]
  dresscodeText?: string
  dresscodeColors?: { name: string; color: string; prohibited?: boolean }[]
}

export default function EdenPurpleEvents({ events, dresscodeText, dresscodeColors }: Props) {
  return (
    <>
      {events.map((event, i) => (
        <EventSection key={i} event={event} index={i} />
      ))}
      <DresscodeSection text={dresscodeText} colors={dresscodeColors} />
    </>
  )
}

function EventSection({ event, index }: { event: EventData; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center py-20"
      style={{
        backgroundImage: `url(${P}/bg-same-date.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-purple-800/20 to-purple-900/40" />

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1 }}
        className="absolute top-0 left-0 w-[150px] md:w-[220px] pointer-events-none select-none z-10"
      >
        <img src={`${P}/portal.jpg`} alt="portal" className="w-full" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1 }}
        className="absolute top-0 right-0 w-[150px] md:w-[220px] pointer-events-none select-none z-10"
        style={{ transform: 'scaleX(-1)' }}
      >
        <img src={`${P}/portal.jpg`} alt="portal" className="w-full" />
      </motion.div>

      {/* Butterflies */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[15%] left-[8%] w-[40px] md:w-[60px] pointer-events-none z-20"
      >
        <img src={`${P}/butterfly-left.jpg`} alt="butterfly" className="w-full" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-[18%] right-[8%] w-[40px] md:w-[60px] pointer-events-none z-20"
      >
        <img src={`${P}/butterfly-right.jpg`} alt="butterfly" className="w-full" />
      </motion.div>

      {/* Chair decoration */}
      <motion.img
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 0.6, y: 0 } : {}}
        transition={{ duration: 1.2 }}
        src={`${P}/chair.jpg`}
        alt="chair"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[500px] pointer-events-none select-none z-10 opacity-60"
      />

      {/* Bush decorations */}
      <img
        src={`${P}/bush-right.jpg`}
        alt="bush"
        className="absolute bottom-0 right-0 w-[180px] md:w-[250px] pointer-events-none select-none z-10"
      />
      <img
        src={`${P}/bush-left.jpg`}
        alt="bush"
        className="absolute bottom-0 left-0 w-[180px] md:w-[250px] pointer-events-none select-none z-10"
      />

      {/* Event Content */}
      <div className="relative z-30 flex flex-col items-center gap-6 px-6 max-w-md">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-white text-4xl md:text-5xl font-bold text-center"
          style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
        >
          {event.title}
        </motion.h2>

        {/* Date display */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex items-center gap-6"
        >
          <div className="text-center">
            <p className="text-white/80 text-sm uppercase tracking-wider" style={{ fontFamily: "'Urbanist', sans-serif" }}>
              {event.day}
            </p>
          </div>
          <div className="text-center">
            <p
              className="text-white text-7xl md:text-8xl font-bold leading-none"
              style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
            >
              {event.date}
            </p>
            <p className="text-white/80 text-sm" style={{ fontFamily: "'Urbanist', sans-serif" }}>
              {event.month} {event.year}
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/80 text-sm" style={{ fontFamily: "'Urbanist', sans-serif" }}>
              {event.time}
            </p>
          </div>
        </motion.div>

        {/* Venue */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center"
        >
          <p
            className="text-white text-xl font-semibold"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {event.venue}
          </p>
          {event.address && (
            <p className="text-white/80 text-sm mt-1 max-w-xs" style={{ fontFamily: "'Urbanist', sans-serif" }}>
              {event.address}
            </p>
          )}
        </motion.div>

        {/* Maps button */}
        {event.mapsUrl && (
          <motion.a
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/40 bg-white/20 backdrop-blur-sm px-6 py-2 text-white text-sm hover:bg-white/30 transition-colors"
            style={{ fontFamily: "'Urbanist', sans-serif" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 fill-white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Open maps
          </motion.a>
        )}
      </div>
    </section>
  )
}

function DresscodeSection({ text, colors }: { text?: string; colors?: { name: string; color: string; prohibited?: boolean }[] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const defaultColors = [
    { name: 'Navy', color: '#1a237e' },
    { name: 'Teal', color: '#00695c' },
    { name: 'Mustard', color: '#f9a825' },
  ]

  const displayColors = colors || defaultColors
  const displayText = text || 'Please wear formal attire in dark or neutral tones. Avoid bright red and white.'

  return (
    <section
      ref={ref}
      className="relative min-h-[60vh] w-full overflow-hidden flex flex-col items-center justify-center py-16"
      style={{ background: 'linear-gradient(180deg, #e8dff5 0%, #f5f0ff 100%)' }}
    >
      {/* Cloud decorations */}
      <motion.img
        initial={{ opacity: 0, x: -30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1 }}
        src={`${P}/cloud-purple.jpg`}
        alt="cloud"
        className="absolute top-0 left-0 w-[150px] md:w-[250px] pointer-events-none select-none"
      />
      <motion.img
        initial={{ opacity: 0, x: 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1 }}
        src={`${P}/cloud-purple.jpg`}
        alt="cloud"
        className="absolute top-0 right-0 w-[150px] md:w-[250px] pointer-events-none select-none"
        style={{ transform: 'scaleX(-1)' }}
      />

      <div className="relative z-30 flex flex-col items-center gap-6 px-6 max-w-md">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[#5b3a8c] text-3xl md:text-4xl font-bold text-center"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Dresscode
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[#6b4d8e] text-center text-sm leading-relaxed max-w-sm"
          style={{ fontFamily: "'Urbanist', sans-serif" }}
        >
          {displayText}
        </motion.p>

        {/* Color palette */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex items-center gap-4"
        >
          {displayColors.map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-md border-2 border-white"
                style={{ backgroundColor: c.color }}
              />
              <span className="text-[10px] text-[#8b6db5]" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                {c.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
