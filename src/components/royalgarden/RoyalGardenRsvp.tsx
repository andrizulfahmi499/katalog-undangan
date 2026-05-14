'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const P = '/templates/royal-garden'

interface Props {
  eventNames?: string[]
  rsvpMessage?: string
}

interface Wish {
  name: string
  message: string
  attendance: string
  timestamp: number
}

export default function RoyalGardenRsvp({ 
  eventNames = ['Wedding'],
  rsvpMessage = 'We kindly request your prompt response to confirm your attendance at our upcoming event.'
}: Props) {
  const [name, setName] = useState('')
  const [attendance, setAttendance] = useState('Hadir')
  const [message, setMessage] = useState('')
  const [wishes, setWishes] = useState<Wish[]>([
    { name: 'Sarah & Family', message: 'Congratulations! Wishing you a lifetime of love and happiness 💐', attendance: 'Hadir', timestamp: Date.now() - 86400000 },
    { name: 'David Chen', message: 'May your love grow stronger each day. Best wishes!', attendance: 'Hadir', timestamp: Date.now() - 172800000 },
  ])
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setWishes(prev => [{ name, message, attendance, timestamp: Date.now() }, ...prev])
    setSubmitted(true)
    setName('')
    setMessage('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className="relative py-20 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #efe6d5 0%, #f5efe3 100%)' }}>
      {/* Floral decoration */}
      <img src={`${P}/flw1.webp`} alt="" className="absolute top-0 right-0 w-24 opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-cinzel text-[#c9a96e] text-xs tracking-[0.5em] uppercase mb-3">RSVP</p>
          <h2 className="font-great-vibes text-[#5a4a2f] text-3xl md:text-4xl mb-4">Kindly Confirm Your Presence</h2>
          <div className="rg-divider mb-4" />
          <p className="font-cormorant text-[#7a6b52] text-sm italic">{rsvpMessage}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-sm rounded-3xl border border-[#d4c5a9]/40 p-6 shadow-lg mb-8">
          <div className="space-y-4">
            <div>
              <label className="block font-cinzel text-[#5a4a2f] text-xs tracking-wider uppercase mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-[#d4c5a9]/50 bg-white/80 font-cormorant text-[#5a4a2f] text-base placeholder:text-[#c9a96e]/50 focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e]/30 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block font-cinzel text-[#5a4a2f] text-xs tracking-wider uppercase mb-1">Attendance</label>
              <select
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#d4c5a9]/50 bg-white/80 font-cormorant text-[#5a4a2f] text-base focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e]/30 transition-colors"
              >
                <option value="Hadir">Hadir / Will Attend</option>
                <option value="Tidak Hadir">Tidak Hadir / Unable to Attend</option>
                <option value="Masih Ragu">Masih Ragu / Not Sure</option>
              </select>
            </div>

            <div>
              <label className="block font-cinzel text-[#5a4a2f] text-xs tracking-wider uppercase mb-1">Wishes</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your blessings..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[#d4c5a9]/50 bg-white/80 font-cormorant text-[#5a4a2f] text-base placeholder:text-[#c9a96e]/50 focus:outline-none focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e]/30 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#c9a96e] to-[#b8956a] text-white font-cinzel text-sm tracking-[0.15em] uppercase shadow-md hover:shadow-lg transition-all duration-300"
            >
              {submitted ? '✓ Terkirim!' : 'Send Wishes'}
            </button>
          </div>
        </form>

        {/* Wishes list */}
        <div className="space-y-3 max-h-80 overflow-y-auto hide-scrollbar">
          {wishes.map((wish, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl border border-[#d4c5a9]/30 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-cinzel text-[#5a4a2f] text-sm font-semibold">{wish.name}</span>
                <span className={`text-[10px] font-cinzel tracking-wider px-2 py-0.5 rounded-full ${
                  wish.attendance === 'Hadir' ? 'bg-green-100 text-green-700' : 
                  wish.attendance === 'Tidak Hadir' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {wish.attendance}
                </span>
              </div>
              {wish.message && (
                <p className="font-cormorant text-[#7a6b52] text-sm">{wish.message}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
