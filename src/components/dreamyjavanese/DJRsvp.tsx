'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const ASSET = '/images/themes/dreamy-javanese'

interface Props {
  invitationId: string
  message?: string
}

export default function DJRsvp({ invitationId, message }: Props) {
  const [name, setName] = useState('')
  const [attendance, setAttendance] = useState<'hadir' | 'tidak' | ''>('')
  const [guests, setGuests] = useState('1')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !attendance) return
    try {
      await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId, name, attendance, guestCount: parseInt(guests) }),
      })
    } catch {}
    setSubmitted(true)
  }

  return (
    <section className="relative w-full py-20 overflow-hidden" style={{ backgroundColor: '#261a10' }}>
      <img src={`${ASSET}/paperize.png`} alt="" className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none" />
      <img src={`${ASSET}/gunungan.png`} alt="" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 opacity-20 pointer-events-none" />
      <img src={`${ASSET}/paperize_7.png`} alt="" className="absolute top-0 left-0 w-full pointer-events-none opacity-60" />

      <div className="relative z-10 max-w-md mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="font-dreamy-title text-[#d0ba96] tracking-[0.3em] uppercase text-xs mb-3">Konfirmasi</p>
          <h2 className="font-dreamy-display text-4xl md:text-5xl text-[#eedcbd] mb-4">RSVP</h2>
          <p className="font-dreamy-body text-[#d0ba96]/70 text-sm">{message || 'Mohon konfirmasi kehadiran Anda'}</p>
        </motion.div>

        {!submitted ? (
          <motion.form
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Nama Lengkap" required
                className="w-full px-4 py-3 bg-[#3a2a1a] border border-[#d0ba96]/20 rounded-lg text-[#eedcbd] placeholder-[#d0ba96]/40 font-dreamy-body text-sm focus:border-[#d0ba96]/50 outline-none transition-colors"
              />
            </div>
            <div className="flex gap-3">
              {(['hadir', 'tidak'] as const).map(opt => (
                <button key={opt} type="button" onClick={() => setAttendance(opt)}
                  className={`flex-1 py-3 rounded-lg border text-sm font-dreamy-title tracking-wider uppercase transition-all ${attendance === opt ? 'bg-[#d0ba96]/20 border-[#d0ba96] text-[#eedcbd]' : 'border-[#d0ba96]/20 text-[#d0ba96]/60 hover:border-[#d0ba96]/40'}`}
                >
                  {opt === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                </button>
              ))}
            </div>
            {attendance === 'hadir' && (
              <select value={guests} onChange={e => setGuests(e.target.value)}
                className="w-full px-4 py-3 bg-[#3a2a1a] border border-[#d0ba96]/20 rounded-lg text-[#eedcbd] font-dreamy-body text-sm focus:border-[#d0ba96]/50 outline-none"
              >
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Orang</option>)}
              </select>
            )}
            <button type="submit" disabled={!name || !attendance}
              className="w-full py-3.5 bg-[#4a3623] hover:bg-[#5a432d] disabled:opacity-40 text-[#eedcbd] border border-[#d0ba96]/30 rounded-full font-dreamy-title tracking-widest text-xs uppercase transition-colors"
            >
              Kirim Konfirmasi
            </button>
          </motion.form>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#d0ba96]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#d0ba96]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="font-dreamy-body text-[#eedcbd]">Terima kasih atas konfirmasinya!</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
