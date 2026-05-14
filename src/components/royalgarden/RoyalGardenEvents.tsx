'use client'

import { motion } from 'framer-motion'

const P = '/templates/royal-garden'

interface EventInfo {
  title: string
  day: string
  month: string
  date: string
  year: string
  time: string
  venue: string
  address: string
  mapsUrl: string
}

interface Props {
  events: EventInfo[]
}

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.8, ease: 'easeOut' },
}

export default function RoyalGardenEvents({ events }: Props) {
  return (
    <section className="relative py-20 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #efe6d5 0%, #f5efe3 100%)' }}>
      {/* Floral decorations */}
      <img src={`${P}/flws-1.webp`} alt="" className="absolute top-0 left-1/2 -translate-x-1/2 w-40 opacity-40 pointer-events-none" />

      <motion.div {...fadeIn} className="text-center mb-12">
        <p className="font-cinzel text-[#c9a96e] text-xs tracking-[0.5em] uppercase mb-3">Wedding Ceremony</p>
        <h2 className="font-great-vibes text-[#5a4a2f] text-4xl md:text-5xl mb-4">Event Details</h2>
        <div className="rg-divider" />
      </motion.div>

      <div className="max-w-md mx-auto space-y-8">
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.2 }}
            className="relative bg-white/70 backdrop-blur-sm rounded-3xl border border-[#d4c5a9]/40 p-8 shadow-lg text-center overflow-hidden"
          >
            {/* Top floral accent */}
            <img src={`${P}/flw3.webp`} alt="" className="absolute -top-4 -right-4 w-20 opacity-30 pointer-events-none rotate-45" />

            {/* Event title */}
            <h3 className="font-cinzel text-[#5a4a2f] text-lg tracking-[0.2em] uppercase font-semibold mb-6">{event.title}</h3>

            {/* Date display */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <p className="font-cinzel text-[#c9a96e] text-sm uppercase">{event.day}</p>
              </div>
              <div className="w-px h-12 bg-[#d4c5a9]" />
              <div className="text-center">
                <p className="font-cinzel text-[#5a4a2f] text-4xl font-bold leading-none">{event.date}</p>
                <p className="font-cinzel text-[#a08b68] text-sm">{event.month} {event.year}</p>
              </div>
              <div className="w-px h-12 bg-[#d4c5a9]" />
              <div className="text-center">
                <p className="font-cinzel text-[#c9a96e] text-sm">{event.time}</p>
              </div>
            </div>

            <div className="rg-divider mb-6" />

            {/* Venue */}
            <div className="mb-6">
              <p className="font-cinzel text-[#5a4a2f] text-sm font-semibold mb-1">{event.venue}</p>
              {event.address && (
                <p className="font-cormorant text-[#7a6b52] text-sm italic">{event.address}</p>
              )}
            </div>

            {/* Google Maps */}
            {event.mapsUrl && (
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#c9a96e] to-[#b8956a] px-6 py-2.5 text-white font-cinzel text-xs tracking-[0.15em] uppercase shadow-md hover:shadow-lg transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Google Maps
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
