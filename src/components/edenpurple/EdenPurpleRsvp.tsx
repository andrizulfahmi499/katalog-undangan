'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

const P = '/templates/eden/images'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
}

interface Props {
  eventNames?: string[]
  rsvpMessage?: string
  invitationId?: string
}

export default function EdenPurpleRsvp({ eventNames, rsvpMessage, invitationId }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [attending, setAttending] = useState<boolean | null>(null)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [wishes, setWishes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const events = eventNames || ['Holy Matrimony', 'Reception']

  const toggleEvent = (e: string) => {
    setSelectedEvents(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e])
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      // Try to submit via API
      if (invitationId) {
        await fetch(`/api/rsvp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invitationId,
            attending: attending ?? false,
            events: selectedEvents,
            message: wishes,
          }),
        })
      }
    } catch (e) { console.warn('RSVP submit failed:', e) }
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center py-20"
      style={{ background: 'linear-gradient(180deg, #e8dff5 0%, #f5f0ff 50%, #ede4f7 100%)' }}
    >
      {/* Cloud decorations */}
      <img src={`${P}/cloud.jpg`} alt="" className="absolute top-0 left-0 w-[120px] md:w-[200px] pointer-events-none select-none" />
      <img src={`${P}/cloud.jpg`} alt="" className="absolute top-0 right-0 w-[120px] md:w-[200px] pointer-events-none select-none" style={{ transform: 'scaleX(-1)' }} />

      {/* Leaf decorations */}
      <img src={`${P}/leaf-2.jpg`} alt="" className="absolute top-[10%] left-0 w-[80px] md:w-[120px] pointer-events-none select-none" />
      <img src={`${P}/flower-top.jpg`} alt="" className="absolute top-0 right-[10%] w-[100px] md:w-[150px] pointer-events-none select-none" />

      <div className="relative z-30 flex flex-col items-center gap-6 px-6 max-w-md w-full">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[#5b3a8c] text-3xl md:text-4xl font-bold text-center"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Reservasi
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[#6b4d8e] text-sm text-center leading-relaxed max-w-sm"
          style={{ fontFamily: "'Urbanist', sans-serif" }}
        >
          {rsvpMessage || 'Mohon konfirmasi kehadiran Anda untuk membantu kami mempersiapkan segala sesuatu dengan lebih baik:'}
        </motion.p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <p className="text-[#5b3a8c] text-2xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Terima Kasih!
            </p>
            <p className="text-[#8b6db5] text-sm" style={{ fontFamily: "'Urbanist', sans-serif" }}>
              Konfirmasi Anda telah tercatat.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="flex flex-col items-center gap-4 w-full"
          >
            <p className="text-[#5b3a8c] text-lg font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Apakah Anda akan hadir?
            </p>

            <div className="flex items-center gap-3">
              {[{ val: true, label: 'Ya' }, { val: false, label: 'Tidak' }].map(({ val, label }) => (
                <button
                  key={String(val)}
                  onClick={() => setAttending(val)}
                  className="relative px-8 py-2 rounded-full transition-all overflow-hidden"
                >
                  {attending === val && (
                    <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg, #9b6dd7 0%, #7c4dbd 100%)' }} />
                  )}
                  <span className={`relative z-10 font-semibold text-sm ${attending === val ? 'text-white' : 'text-[#6b4d8e]'}`}
                    style={{ fontFamily: "'Urbanist', sans-serif" }}>
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {attending === true && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col items-center gap-3 w-full">
                <p className="text-[#5b3a8c] text-base font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Acara mana yang akan Anda hadiri?
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {events.map((e) => (
                    <button
                      key={e}
                      onClick={() => toggleEvent(e)}
                      className={`relative rounded-full border px-5 py-1.5 text-sm transition-all ${
                        selectedEvents.includes(e)
                          ? 'border-[#9b6dd7] text-white'
                          : 'border-[#9b6dd7]/40 text-[#6b4d8e]'
                      }`}
                      style={{
                        fontFamily: "'Urbanist', sans-serif",
                        ...(selectedEvents.includes(e) ? { background: 'linear-gradient(135deg, #9b6dd7 0%, #7c4dbd 100%)' } : {}),
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="w-full">
              <p className="text-[#5b3a8c] text-base font-semibold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Harapan & Doa
              </p>
              <textarea
                value={wishes}
                onChange={(e) => setWishes(e.target.value)}
                placeholder="Tulis ucapan dan doa Anda..."
                className="w-full text-sm rounded-xl border border-[#d4c5e8] px-4 py-3 resize-none bg-white/80 focus:outline-none focus:border-[#9b6dd7] transition-colors"
                style={{ fontFamily: "'Urbanist', sans-serif" }}
                rows={3}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-full px-6 py-3 text-white text-sm font-semibold tracking-wider shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #9b6dd7 0%, #7c4dbd 100%)',
                fontFamily: "'Urbanist', sans-serif",
              }}
            >
              {submitting ? 'Mengirim...' : 'Kirim RSVP'}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
