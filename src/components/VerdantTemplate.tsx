"use client"

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, CalendarDays, Gift, Copy, Share2 } from 'lucide-react'
import CopyLinkButton from './CopyLinkButton'
import CountdownTimer from './CountdownTimer'

interface VerdantTemplateProps {
  invitation: {
    id: string
    title: string
    eventName: string
    eventDate: string
    location: string
    invitationLink: string
    assignedMember?: {
      name: string
      email: string
    }
    templateMessage: string
  }
  formattedDate: string
}

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function VerdantTemplate({ invitation, formattedDate }: VerdantTemplateProps) {
  const [groomName, brideName] = invitation.title.split(/\s*&\s*/).map((name) => name.trim())
  const [showGallery, setShowGallery] = useState(false)
  const bgRef = useRef<HTMLDivElement | null>(null)
  const headingRef = useRef<HTMLDivElement | null>(null)
  const uid = useRef(`v-${Math.random().toString(36).slice(2,9)}`)

  useEffect(() => {
    let rafId: number | null = null
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset
        const heroHeight = headingRef.current?.offsetHeight ?? 600
        const factor = Math.min(1, scrollY / heroHeight)
        const bgTranslate = factor * 30
        const textTranslate = factor * -16
        if (bgRef.current) {
          bgRef.current.style.transform = `translateY(${bgTranslate}px)`
        }
        if (headingRef.current) {
          headingRef.current.style.transform = `translateY(${textTranslate}px)`
        }
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 antialiased">
      <motion.div initial="hidden" animate="show" variants={container} className="relative overflow-hidden">
        {/* Background image with slow parallax-like scale */}
        <motion.div ref={bgRef} className="absolute inset-0 -z-10 overflow-hidden">
          <motion.img
            src="/images/templates/verdant/couple2.jpg"
            alt="couple"
            className="w-full h-full object-cover"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 10, ease: 'linear' }}
            style={{ filter: 'brightness(0.78) saturate(0.95)' }}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/12 via-transparent to-white/80" />

        {/* Decorative floating leaf (subtle) */}
        <motion.svg
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.12, y: 0 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 6 }}
          className="absolute left-6 top-12 w-40 h-40 text-emerald-300"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M2 12c5-6 14-8 20-6-2 6-8 12-14 14C5 20 2 18 2 12z" fill="currentColor" />
        </motion.svg>

        <div className="container mx-auto px-4 py-28 text-center">
          <motion.p variants={fadeUp} className="inline-block rounded-full bg-white/60 px-6 py-2 backdrop-blur text-sm uppercase tracking-widest text-emerald-700 font-semibold">
            MY LOVE
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8" ref={headingRef}>
            <h1 className="sr-only">{`${groomName} & ${brideName}`}</h1>
            <div className="mx-auto max-w-4xl">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="xMidYMid meet" className="w-full h-32">
                <defs>
                  <linearGradient id={`${uid.current}-grad`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1200" y2="0">
                    <stop offset="0%" stopColor="#065f46" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                    <animateTransform attributeName="gradientTransform" type="translate" values="-200 0;200 0;-200 0" dur="8s" repeatCount="indefinite" />
                  </linearGradient>
                  <clipPath id={`${uid.current}-clip`}>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="48" fontWeight="700" fontFamily="var(--font-playfair), serif">
                      {`${groomName} & ${brideName}`}
                    </text>
                  </clipPath>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${uid.current}-grad)`} clipPath={`url(#${uid.current}-clip)`} />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="48" fontWeight="700" fill="rgba(2,6,23,0.06)" fontFamily="var(--font-playfair), serif" transform="translate(6,6)">
                  {`${groomName} & ${brideName}`}
                </text>
              </svg>
            </div>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-4 text-lg text-emerald-700 max-w-2xl mx-auto">
            {invitation.eventName || 'Dengan Kebanggaan dan Cinta'}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex items-center justify-center gap-4">
            <a href={invitation.invitationLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 px-6 py-3 text-white font-semibold shadow-lg transform hover:-translate-y-0.5 hover:scale-105 transition">
              <Heart className="w-5 h-5" /> OPEN INVITATION
            </a>
            <CopyLinkButton link={invitation.invitationLink} label="Copy Link" />
          </motion.div>
        </div>
      </motion.div>

      {/* Details / Countdown */}
      <div className="py-16 -mt-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl bg-white/90 backdrop-blur p-8 shadow-xl border border-emerald-100">
            <h2 className="text-2xl font-semibold text-emerald-900">Save The Date</h2>
            <p className="text-emerald-700 mt-2">{formattedDate}</p>
            <div className="mt-6">
              <CountdownTimer targetDate={new Date(invitation.eventDate)} />
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <a href={invitation.invitationLink} className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-4 py-2 text-emerald-800 hover:bg-emerald-50 transition"><CalendarDays className="w-4 h-4"/> Add to Calendar</a>
              <a href={`https://maps.app.goo.gl/?q=${encodeURIComponent(invitation.location || '')}`} className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-4 py-2 text-emerald-800 hover:bg-emerald-50 transition"><MapPin className="w-4 h-4"/> Get Directions</a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gallery */}
      <div className="py-12 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-emerald-900 mb-6">Our Gallery</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {["gallery1.jpg","gallery2.jpg","couple1.jpg"].map((img, i) => (
                <motion.div key={i} whileHover={{ scale: 1.04 }} className="overflow-hidden rounded-2xl shadow-lg cursor-pointer" onClick={() => setShowGallery(true)}>
                  <motion.img src={`/images/templates/verdant/${img}`} alt={`gallery-${i}`} className="w-full h-64 object-cover transform transition" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RSVP and Wishing Well */}
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-2xl font-semibold text-emerald-900 mb-4">RSVP</h4>
              <form className="space-y-4 bg-white rounded-2xl p-6 shadow-md">
                <input type="text" placeholder="Nama Lengkap" className="w-full rounded-lg border border-emerald-200 px-4 py-3" />
                <div className="flex gap-4">
                  <label className="flex items-center gap-2"><input type="radio" name="attend" value="yes"/> Ya</label>
                  <label className="flex items-center gap-2"><input type="radio" name="attend" value="no"/> Tidak</label>
                </div>
                <textarea placeholder="Ucapan & Doa" className="w-full rounded-lg border border-emerald-200 px-4 py-3" rows={4}></textarea>
                <button className="w-full rounded-lg bg-emerald-700 text-white py-3 font-semibold">Kirim</button>
              </form>
            </div>

            <div>
              <h4 className="text-2xl font-semibold text-emerald-900 mb-4">Wishing Well</h4>
              <div className="rounded-2xl bg-white p-6 shadow-md space-y-4">
                <p className="text-emerald-700">Your presence is the greatest gift. If you would like to contribute, please use the bank details below.</p>
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                  <p className="font-semibold text-emerald-900">BCA • 1234 5678 901</p>
                  <p className="text-sm text-emerald-700">a.n {groomName} & {brideName}</p>
                </div>
                <button className="w-full rounded-lg bg-white border border-emerald-200 py-3 font-semibold">Salin Nomor Rekening</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-emerald-600">Created with ❤️ using Katalog Undangan</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <CopyLinkButton link={invitation.invitationLink} label="Bagikan Undangan" />
            <button className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2"><Share2 className="w-4 h-4"/> Share</button>
          </div>
        </div>
      </div>

      {/* Simple full-screen gallery modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowGallery(false)}>
          <div className="max-w-4xl mx-auto">
            <img src="/images/templates/verdant/couple3.jpg" alt="large" className="w-full h-auto rounded-2xl shadow-xl" />
          </div>
        </div>
      )}
    </div>
  )
}
