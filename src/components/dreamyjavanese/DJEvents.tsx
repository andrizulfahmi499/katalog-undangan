'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const ASSET = '/images/themes/dreamy-javanese'

interface EventItem {
  title: string
  day: string
  date: string
  month: string
  year: string
  time: string
  venue: string
  address: string
  mapsUrl?: string
}

interface Props {
  events: EventItem[]
  targetDate: string
}

function useCountdown(target: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now())
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
  }, [target])
  return time
}

export default function DJEvents({ events, targetDate }: Props) {
  const countdown = useCountdown(targetDate)

  return (
    <section className="relative w-full py-20 overflow-hidden" style={{ backgroundColor: '#261a10' }}>
      <img src={`${ASSET}/paperize.png`} alt="" className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none" />

      {/* Gunungan ornament */}
      <img src={`${ASSET}/gunungan.png`} alt="" className="absolute top-0 left-1/2 -translate-x-1/2 w-48 md:w-64 opacity-30 pointer-events-none" />

      {/* Top paper edge */}
      <img src={`${ASSET}/paperize_6.png`} alt="" className="absolute top-0 left-0 w-full pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto px-6">
        {/* Save the Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-dreamy-title text-[#d0ba96] tracking-[0.3em] uppercase text-xs mb-3">Save The Date</p>
          <h2 className="font-dreamy-display text-4xl md:text-5xl text-[#eedcbd] mb-10">Marriage Contract</h2>

          {/* Countdown */}
          <div className="flex justify-center gap-4 md:gap-6 mb-12">
            {[
              { val: countdown.days, label: 'Hari' },
              { val: countdown.hours, label: 'Jam' },
              { val: countdown.minutes, label: 'Menit' },
              { val: countdown.seconds, label: 'Detik' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#3a2a1a] border border-[#d0ba96]/20 flex items-center justify-center mb-2">
                  <span className="font-dreamy-title text-2xl md:text-3xl text-[#eedcbd]">{String(item.val).padStart(2, '0')}</span>
                </div>
                <span className="font-dreamy-body text-[10px] text-[#d0ba96]/70 uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Event cards */}
        {events.map((ev, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="text-center mb-12 last:mb-0"
          >
            <div className="w-12 h-px bg-[#d0ba96]/30 mx-auto mb-6" />
            <h3 className="font-dreamy-title text-[#eedcbd] tracking-[0.2em] uppercase text-sm mb-6">{ev.title}</h3>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <p className="font-dreamy-body text-[#d0ba96] text-sm">{ev.day}</p>
              </div>
              <div className="w-16 h-16 rounded-full border border-[#d0ba96]/30 flex items-center justify-center">
                <span className="font-dreamy-display text-3xl text-[#eedcbd]">{ev.date}</span>
              </div>
              <div className="text-center">
                <p className="font-dreamy-body text-[#d0ba96] text-sm">{ev.month}</p>
                <p className="font-dreamy-body text-[#d0ba96] text-xs">{ev.year}</p>
              </div>
            </div>

            <p className="font-dreamy-body text-[#d0ba96] text-sm mb-1">{ev.time}</p>
            <p className="font-dreamy-title text-[#eedcbd] text-sm mb-1">{ev.venue}</p>
            <p className="font-dreamy-body text-[#d0ba96]/70 text-xs mb-4">{ev.address}</p>

            {ev.mapsUrl && (
              <a
                href={ev.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block px-6 py-2 border border-[#d0ba96]/40 rounded-full text-[#d0ba96] text-xs font-dreamy-title tracking-widest hover:bg-[#d0ba96]/10 transition-colors"
              >
                Lihat Lokasi
              </a>
            )}
          </motion.div>
        ))}
      </div>

      {/* Joglo house */}
      <img src={`${ASSET}/joglo_house.png`} alt="" className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 md:w-56 opacity-15 pointer-events-none" />

      {/* Bottom paper edge */}
      <img src={`${ASSET}/paperize_5.png`} alt="" className="absolute bottom-0 left-0 w-full pointer-events-none" />
    </section>
  )
}
