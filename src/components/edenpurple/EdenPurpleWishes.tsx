'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const P = '/templates/eden/images'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
}

interface WishItem {
  name: string
  date: string
  message: string
}

interface Props {
  invitationId?: string
}

const DEFAULT_WISHES: WishItem[] = [
  { name: 'Dear My Love', date: '2026-01-01', message: 'Congratulations on your beautiful union! May your journey together be filled with love, laughter, and endless joy.' },
  { name: 'Family & Friends', date: '2026-01-01', message: 'Wishing you a lifetime of happiness and love!' },
  { name: 'Best Friend', date: '2026-01-02', message: 'So happy for you both! Can\'t wait to celebrate your special day!' },
]

export default function EdenPurpleWishes({ invitationId }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [wishes, setWishes] = useState<WishItem[]>(DEFAULT_WISHES)
  const [showAll, setShowAll] = useState(false)
  const [newWish, setNewWish] = useState({ name: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!invitationId) return
    // Try to fetch wishes from API
    fetch(`/api/wishes?invitationId=${invitationId}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.wishes) && data.wishes.length > 0) {
          setWishes(data.wishes.map((w: any) => ({
            name: w.name || w.guestName || 'Guest',
            date: w.date || w.createdAt || '',
            message: w.message || w.wish || '',
          })))
        }
      })
      .catch(() => {})
  }, [invitationId])

  const handleSubmitWish = async () => {
    if (!newWish.name.trim() || !newWish.message.trim()) return
    setSubmitting(true)
    const wish: WishItem = {
      name: newWish.name.trim(),
      message: newWish.message.trim(),
      date: new Date().toISOString().split('T')[0],
    }

    try {
      if (invitationId) {
        await fetch('/api/wishes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invitationId, ...wish }),
        })
      }
    } catch {}

    setWishes(prev => [wish, ...prev])
    setNewWish({ name: '', message: '' })
    setSubmitting(false)
  }

  const displayItems = showAll ? wishes : wishes.slice(0, 6)

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center py-20"
      style={{ background: 'linear-gradient(180deg, #e8dff5 0%, #f5f0ff 50%, #ede4f7 100%)' }}
    >
      {/* Birds */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1 }}
        className="absolute top-[5%] left-[5%] w-[50px] md:w-[70px] pointer-events-none z-20"
      >
        <img src={`${P}/bird-left.jpg`} alt="bird" className="w-full" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1 }}
        className="absolute top-[5%] right-[5%] w-[50px] md:w-[70px] pointer-events-none z-20"
      >
        <img src={`${P}/bird-right.jpg`} alt="bird" className="w-full" />
      </motion.div>

      {/* Bush decorations */}
      <img src={`${P}/bush-left.jpg`} alt="" className="absolute bottom-0 left-0 w-[180px] md:w-[260px] pointer-events-none select-none z-10" />
      <img src={`${P}/bush-right.jpg`} alt="" className="absolute bottom-0 right-0 w-[180px] md:w-[260px] pointer-events-none select-none z-10" />

      <div className="relative z-30 flex flex-col items-center gap-4 px-4 w-full max-w-lg">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[#5b3a8c] text-3xl md:text-4xl font-bold text-center"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Harapan & Doa
        </motion.h2>

        {/* Submit wish form */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="w-full rounded-2xl bg-white/70 backdrop-blur-sm p-4 shadow-md border border-[#d4c5e8]"
        >
          <input
            type="text"
            value={newWish.name}
            onChange={(e) => setNewWish(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nama Anda"
            className="w-full text-sm rounded-lg border border-[#d4c5e8] px-3 py-2 mb-2 bg-white/90 focus:outline-none focus:border-[#9b6dd7]"
            style={{ fontFamily: "'Urbanist', sans-serif" }}
          />
          <textarea
            value={newWish.message}
            onChange={(e) => setNewWish(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Tulis ucapan & doa..."
            className="w-full text-sm rounded-lg border border-[#d4c5e8] px-3 py-2 mb-2 resize-none bg-white/90 focus:outline-none focus:border-[#9b6dd7]"
            style={{ fontFamily: "'Urbanist', sans-serif" }}
            rows={2}
          />
          <button
            onClick={handleSubmitWish}
            disabled={submitting || !newWish.name.trim() || !newWish.message.trim()}
            className="w-full rounded-full py-2 text-white text-sm font-semibold tracking-wider disabled:opacity-50 transition-all"
            style={{
              background: 'linear-gradient(135deg, #9b6dd7 0%, #7c4dbd 100%)',
              fontFamily: "'Urbanist', sans-serif",
            }}
          >
            {submitting ? 'Mengirim...' : 'Kirim Ucapan'}
          </button>
        </motion.div>

        {/* Show more/less toggle */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => setShowAll(false)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all ${
              !showAll ? 'text-white' : 'text-[#6b4d8e]'
            }`}
            style={{
              fontFamily: "'Urbanist', sans-serif",
              ...(!showAll ? { background: 'linear-gradient(135deg, #9b6dd7 0%, #7c4dbd 100%)' } : {}),
            }}
          >
            Sedikit
          </button>
          <button
            onClick={() => setShowAll(true)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all ${
              showAll ? 'text-white' : 'text-[#6b4d8e]'
            }`}
            style={{
              fontFamily: "'Urbanist', sans-serif",
              ...(showAll ? { background: 'linear-gradient(135deg, #9b6dd7 0%, #7c4dbd 100%)' } : {}),
            }}
          >
            Semua ({wishes.length})
          </button>
        </motion.div>

        {/* Wishes list */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="w-full rounded-2xl bg-white/50 backdrop-blur-sm max-h-[50vh] overflow-y-auto"
          style={{ scrollbarWidth: 'thin' }}
        >
          {displayItems.map((item, i) => (
            <div key={i} className="px-4 py-3 border-b border-[#d4c5e8]/50 last:border-b-0">
              <div className="flex items-center gap-2">
                <p
                  className="text-[#5b3a8c] text-sm font-bold"
                  style={{ fontFamily: "'Urbanist', sans-serif" }}
                >
                  {item.name}
                </p>
                {i === 0 && (
                  <svg viewBox="0 0 24 24" className="w-4 fill-emerald-500">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.59 3.2c-.24.21-.37.31-.5.4a2.5 2.5 0 01-.98.4c-.15.04-.32.05-.63.07C6.68.14 6.28.17 5.94.29a2.5 2.5 0 00-1.65 1.65c-.12.33-.15.73-.21 1.54-.03.32-.04.48-.07.63a2.5 2.5 0 01-.41.99c-.09.13-.19.26-.4.49a3.5 3.5 0 00-.94 1.23 3.5 3.5 0 000 2.34c.15.32.41.63.93 1.24.21.24.31.37.4.5.2.3.34.63.41.99.03.15.04.32.07.63.06.8.09 1.2.21 1.54a2.5 2.5 0 001.65 1.65c.34.12.74.15 1.54.21.32.03.48.04.63.07.35.07.69.21.99.41.13.09.26.19.49.4.61.52.92.78 1.24.93a3.5 3.5 0 002.34 0c.32-.15.63-.41 1.24-.93.24-.21.37-.31.5-.4.3-.2.63-.34.99-.41.15-.03.32-.04.63-.07.8-.06 1.2-.09 1.54-.21a2.5 2.5 0 001.65-1.65c.12-.34.15-.74.21-1.54.03-.32.04-.48.07-.63.07-.35.21-.69.41-.99.09-.13.19-.26.4-.49.52-.61.78-.92.93-1.24a3.5 3.5 0 000-2.34 3.5 3.5 0 00-.93-1.24c-.21-.24-.31-.37-.4-.5a2.5 2.5 0 01-.41-.99c-.03-.15-.04-.32-.07-.63-.06-.8-.09-1.2-.21-1.54a2.5 2.5 0 00-1.65-1.65c-.34-.12-.74-.15-1.54-.21-.32-.03-.48-.04-.63-.07a2.5 2.5 0 01-.99-.41c-.13-.09-.26-.19-.49-.4A3.5 3.5 0 0013.17 2.27a3.5 3.5 0 00-2.34 0c-.32.15-.63.41-1.24.93zm6.78 6.66a.81.81 0 00-1.15-1.15l-4.85 4.85-1.6-1.6a.81.81 0 00-1.15 1.16l2.17 2.17a.81.81 0 001.15 0l5.43-5.43z" />
                  </svg>
                )}
              </div>
              <p className="text-[#8b6db5] text-[10px] mt-0.5" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                {item.date}
              </p>
              <p
                className="text-[#4a3660] text-sm mt-1 leading-relaxed whitespace-pre-wrap"
                style={{ fontFamily: "'Urbanist', sans-serif" }}
              >
                {item.message}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
