'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface BankAccount {
  bankName: string
  accountNumber: string
  accountName: string
}

interface Props {
  accounts?: BankAccount[]
  phone?: string
  address?: string
}

export default function RoyalGardenGift({ 
  accounts = [
    { bankName: 'BANK BCA', accountNumber: '123 456 7890', accountName: 'Clara' },
    { bankName: 'BANK MANDIRI', accountNumber: '987 654 3210', accountName: 'Kevin' },
  ], 
  phone = '0857522222',
  address = 'Jl. Mega Kuningan Kav. E1.1 Jakarta Selatan'
}: Props) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard?.writeText(text.replace(/\s/g, ''))
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <section className="relative py-20 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f5efe3 0%, #efe6d5 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-10">
          <p className="font-cinzel text-[#c9a96e] text-xs tracking-[0.5em] uppercase mb-3">Send Gift</p>
          <h2 className="font-great-vibes text-[#5a4a2f] text-4xl md:text-5xl mb-4">Wedding Gift</h2>
          <div className="rg-divider mb-4" />
          <p className="font-cormorant text-[#7a6b52] text-sm italic">
            For family and friends who would like to send a gift.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {accounts.map((acc, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-white/70 backdrop-blur-sm rounded-3xl border border-[#d4c5a9]/40 p-6 shadow-lg text-center">
              <p className="font-cinzel text-[#c9a96e] text-sm tracking-[0.3em] uppercase font-semibold mb-1">{acc.bankName}</p>
              <p className="font-cormorant text-[#7a6b52] text-sm mb-3">a.n. {acc.accountName}</p>
              <div className="py-3 my-3 border-y border-[#d4c5a9]/40">
                <p className="font-cinzel text-[#5a4a2f] text-2xl font-bold tracking-widest">{acc.accountNumber}</p>
              </div>
              <button onClick={() => handleCopy(acc.accountNumber, i)}
                className="inline-flex items-center gap-2 font-cinzel text-[#c9a96e] text-xs tracking-[0.2em] uppercase hover:text-[#a07d54] transition-colors">
                {copiedIdx === i ? '✓ Copied!' : '📋 Copy Number'}
              </button>
            </motion.div>
          ))}
        </div>

        {phone && (
          <div className="text-center mb-4">
            <p className="font-cinzel text-[#5a4a2f] text-xs tracking-wider uppercase mb-1">Phone</p>
            <p className="font-cormorant text-[#7a6b52] text-base">{phone}</p>
          </div>
        )}
        {address && (
          <div className="bg-white/50 rounded-2xl border border-[#d4c5a9]/30 p-4 text-center">
            <p className="font-cinzel text-[#5a4a2f] text-xs tracking-wider uppercase mb-1">Send Gift To</p>
            <p className="font-cormorant text-[#7a6b52] text-sm">{address}</p>
          </div>
        )}
      </motion.div>
    </section>
  )
}
