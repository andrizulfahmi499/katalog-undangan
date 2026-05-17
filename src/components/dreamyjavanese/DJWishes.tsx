'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const ASSET = '/images/themes/dreamy-javanese'

interface WishItem {
  name: string
  message: string
  timestamp?: string
}

interface Props {
  invitationId: string
  groomName: string
  brideName: string
  closingMessage?: string
}

export default function DJWishes({ invitationId, groomName, brideName, closingMessage }: Props) {
  const [wishes, setWishes] = useState<WishItem[]>([
    { name: 'Keluarga Besar', message: 'Selamat menempuh hidup baru! Semoga menjadi keluarga sakinah mawaddah warahmah.', timestamp: 'Baru saja' },
  ])
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !msg) return
    setWishes(prev => [{ name, message: msg, timestamp: 'Baru saja' }, ...prev])
    setName('')
    setMsg('')
  }

  return (
    <section className="relative w-full py-20 overflow-hidden" style={{ backgroundColor: '#261a10' }}>
      <img src={`${ASSET}/paperize.png`} alt="" className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none" />
      <img src={`${ASSET}/paperize_7.png`} alt="" className="absolute bottom-0 left-0 w-full pointer-events-none opacity-60 rotate-180" />

      <div className="relative z-10 max-w-md mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="font-dreamy-title text-[#d0ba96] tracking-[0.3em] uppercase text-xs mb-3">Ucapan & Doa</p>
          <h2 className="font-dreamy-display text-4xl md:text-5xl text-[#eedcbd] mb-4">Wishes</h2>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="space-y-4 mb-10"
        >
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama Anda" required
            className="w-full px-4 py-3 bg-[#3a2a1a] border border-[#d0ba96]/20 rounded-lg text-[#eedcbd] placeholder-[#d0ba96]/40 font-dreamy-body text-sm focus:border-[#d0ba96]/50 outline-none"
          />
          <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Tulis ucapan & doa..." rows={3} required
            className="w-full px-4 py-3 bg-[#3a2a1a] border border-[#d0ba96]/20 rounded-lg text-[#eedcbd] placeholder-[#d0ba96]/40 font-dreamy-body text-sm focus:border-[#d0ba96]/50 outline-none resize-none"
          />
          <button type="submit"
            className="w-full py-3 bg-[#4a3623] hover:bg-[#5a432d] text-[#eedcbd] border border-[#d0ba96]/30 rounded-full font-dreamy-title tracking-widest text-xs uppercase transition-colors"
          >
            Kirim Ucapan
          </button>
        </motion.form>

        {/* Wishes list */}
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
          {wishes.map((w, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#3a2a1a]/60 border border-[#d0ba96]/10 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-dreamy-title text-[#eedcbd] text-sm">{w.name}</p>
                <span className="font-dreamy-body text-[#d0ba96]/40 text-[10px]">{w.timestamp}</span>
              </div>
              <p className="font-dreamy-body text-[#d0ba96]/80 text-sm leading-relaxed">{w.message}</p>
            </motion.div>
          ))}
        </div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 pt-10 border-t border-[#d0ba96]/10"
        >
          <img src={`${ASSET}/quotes_decor_13.png`} alt="" className="w-24 mx-auto mb-6 opacity-50" />
          <p className="font-dreamy-body text-[#d0ba96]/70 text-sm mb-6">
            {closingMessage || "Atas kehadiran dan do'a restunya kami ucapkan terima kasih."}
          </p>
          <h3 className="font-dreamy-display text-3xl text-[#eedcbd] mb-2">{groomName} & {brideName}</h3>
          <img src={`${ASSET}/quotes_decor_13.png`} alt="" className="w-24 mx-auto mt-6 opacity-50 rotate-180" />
        </motion.div>
      </div>
    </section>
  )
}
