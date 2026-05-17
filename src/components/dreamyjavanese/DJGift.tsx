'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const ASSET = '/images/themes/dreamy-javanese'

interface Props {
  bankName?: string
  accountNumber?: string
  accountName?: string
  address?: string
}

export default function DJGift({ bankName, accountNumber, accountName, address }: Props) {
  const [copied, setCopied] = useState(false)

  const copyAccount = () => {
    if (accountNumber) {
      navigator.clipboard.writeText(accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <section className="relative w-full py-20 overflow-hidden" style={{ backgroundColor: '#2f2115' }}>
      <img src={`${ASSET}/paperize.png`} alt="" className="absolute inset-0 w-full h-full object-cover opacity-8 pointer-events-none" />
      <img src={`${ASSET}/flower_red.png`} alt="" className="absolute top-0 left-0 w-32 opacity-20 pointer-events-none" />
      <img src={`${ASSET}/rose.png`} alt="" className="absolute bottom-0 right-0 w-28 opacity-20 pointer-events-none scale-x-[-1]" />

      <div className="relative z-10 max-w-md mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="font-dreamy-title text-[#d0ba96] tracking-[0.3em] uppercase text-xs mb-3">Amplop Digital</p>
          <h2 className="font-dreamy-display text-4xl md:text-5xl text-[#eedcbd] mb-4">Send Your Gift</h2>
          <p className="font-dreamy-body text-[#d0ba96]/70 text-sm leading-relaxed">
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih, kami menyediakan amplop digital.
          </p>
        </motion.div>

        {/* Bank Transfer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#3a2a1a] border border-[#d0ba96]/20 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#d0ba96]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#d0ba96]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <div>
              <p className="font-dreamy-title text-[#eedcbd] text-sm">{bankName || 'BCA'}</p>
              <p className="font-dreamy-body text-[#d0ba96]/60 text-xs">Transfer Bank</p>
            </div>
          </div>

          <div className="bg-[#2f2115] rounded-lg p-4 mb-3">
            <p className="font-dreamy-body text-[#d0ba96]/60 text-xs mb-1">Nomor Rekening</p>
            <p className="font-dreamy-title text-[#eedcbd] text-lg tracking-wider">{accountNumber || '1234567890'}</p>
          </div>
          <p className="font-dreamy-body text-[#d0ba96] text-sm mb-4">a.n. {accountName || 'Nama Pemilik'}</p>

          <button
            onClick={copyAccount}
            className="w-full py-3 border border-[#d0ba96]/30 rounded-full text-[#d0ba96] text-xs font-dreamy-title tracking-widest uppercase hover:bg-[#d0ba96]/10 transition-colors"
          >
            {copied ? '✓ Tersalin!' : 'Salin No. Rekening'}
          </button>
        </motion.div>

        {/* Gift Address */}
        {address && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#3a2a1a] border border-[#d0ba96]/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5 text-[#d0ba96]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <p className="font-dreamy-title text-[#eedcbd] text-sm">Alamat Pengiriman</p>
            </div>
            <p className="font-dreamy-body text-[#d0ba96]/70 text-sm">{address}</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
