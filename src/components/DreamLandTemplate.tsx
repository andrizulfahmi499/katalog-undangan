'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Heart, MapPin, CalendarDays, Music, Users, Gift, MessageCircle, Copy, Share2, ArrowRight } from 'lucide-react'
import CopyLinkButton from './CopyLinkButton'
import CountdownTimer from './CountdownTimer'

interface DreamLandTemplateProps {
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

export default function DreamLandTemplate({ invitation, formattedDate }: DreamLandTemplateProps) {
  const [groomName, brideName] = invitation.title.split(/\s*&\s*/).map((name) => name.trim())
  const [isOpened, setIsOpened] = useState(false)
  
  // Parallax effects
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  })
  const leftOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8])
  const leftScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])

  if (!isOpened) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#faf8f3]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 px-4"
        >
          <div className="space-y-4">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm uppercase tracking-[0.4em] text-rose-600 font-semibold"
            >
              The Wedding Of
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-7xl font-bold font-playfair text-slate-900"
            >
              {groomName} <span className="text-pink-400">&</span> {brideName}
            </motion.h1>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpened(true)}
            className="group relative inline-flex items-center gap-3 rounded-full bg-slate-900 px-8 py-4 text-white font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl"
          >
            <span className="relative z-10 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> BUKA UNDANGAN
            </span>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-500 to-rose-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#faf8f3] text-slate-900" ref={scrollRef}>
      {/* Split Screen Layout for Desktop */}
      <div className="flex flex-col lg:flex-row">
        
        {/* Left Side: Sticky Image / Cover */}
        <div className="relative w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 overflow-hidden order-1 lg:order-1">
          <motion.div 
            style={{ opacity: leftOpacity, scale: leftScale }}
            className="absolute inset-0"
          >
            <img 
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" 
              alt="Background" 
              className="h-full w-full object-cover grayscale-[20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 lg:bg-gradient-to-r lg:from-black/10 lg:via-transparent lg:to-black/40"></div>
          </motion.div>
          
          <div className="relative z-10 h-full flex flex-col justify-between p-8 sm:p-12 lg:p-16 text-white min-h-[500px] lg:min-h-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xs sm:text-sm uppercase tracking-[0.5em] font-medium opacity-80 mb-2">Save The Date</p>
              <h2 className="text-2xl sm:text-3xl font-playfair">{formattedDate}</h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold font-playfair mb-4 leading-none">
                {groomName}<br/>
                <span className="text-pink-400">&</span><br/>
                {brideName}
              </h1>
              <p className="text-lg opacity-90 max-w-sm font-light leading-relaxed">
                "Dua hati yang menyatu, mengawali perjalanan indah selamanya."
              </p>
            </motion.div>
          </div>
          
          {/* Watercolor Ornaments Over Left Side */}
          <div className="absolute top-0 right-0 p-4 opacity-40 pointer-events-none">
             <img src="/vectors/ornaments.svg" className="w-32 h-32 rotate-90" alt="" />
          </div>
        </div>

        {/* Right Side: Scrollable Content */}
        <div className="w-full lg:w-1/2 order-2 lg:order-2">
          
          {/* Profil Section */}
          <section className="py-20 px-8 sm:px-12 lg:px-20 space-y-20">
            <div className="text-center space-y-4">
              <span className="text-pink-600 text-sm uppercase tracking-[0.4em] font-bold">The Couple</span>
              <h3 className="text-4xl font-playfair">Mempelai Pengantin</h3>
              <p className="text-slate-500 font-light italic max-w-md mx-auto">"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya..."</p>
            </div>

            <div className="space-y-24">
              {/* Groom */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center space-y-6"
              >
                <div className="relative group">
                  <div className="absolute -inset-4 bg-pink-100/50 rounded-full blur-2xl group-hover:bg-pink-100 transition-colors"></div>
                  <div className="relative w-56 h-72 rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1550005810-350a417a1505?q=80&w=1974&auto=format&fit=crop" alt="Groom" className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl">
                    <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-3xl font-playfair text-slate-900">{groomName}</h4>
                  <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">Mempelai Pria</p>
                  <div className="pt-4 text-slate-600">
                    <p className="font-semibold">Putra dari:</p>
                    <p>Bapak Fulan & Ibu Fulanah</p>
                  </div>
                </div>
              </motion.div>

              {/* Bride */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center space-y-6"
              >
                <div className="relative group">
                  <div className="absolute -inset-4 bg-rose-100/50 rounded-full blur-2xl group-hover:bg-rose-100 transition-colors"></div>
                  <div className="relative w-56 h-72 rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop" alt="Bride" className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl">
                    <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-3xl font-playfair text-slate-900">{brideName}</h4>
                  <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">Mempelai Wanita</p>
                  <div className="pt-4 text-slate-600">
                    <p className="font-semibold">Putri dari:</p>
                    <p>Bapak Fulano & Ibu Fulana</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Events Section */}
          <section className="bg-white/40 py-24 px-8 sm:px-12 lg:px-20 space-y-16">
            <div className="text-center space-y-2">
              <span className="text-pink-600 text-sm uppercase tracking-[0.4em] font-bold">Wedding Events</span>
              <h3 className="text-4xl font-playfair">Acara Bahagia</h3>
            </div>

            <div className="grid gap-12">
              {[
                { title: 'Holy Matrimony', time: '10:00 - 12:00 WIB', icon: CalendarDays, color: 'bg-blue-50 text-blue-600 border-blue-100' },
                { title: 'Reception', time: '13:00 - 16:00 WIB', icon: Users, color: 'bg-rose-50 text-rose-600 border-rose-100' },
                { title: 'Tea Pai', time: '16:30 - 18:00 WIB', icon: Music, color: 'bg-amber-50 text-amber-600 border-amber-100' }
              ].map((event, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative p-8 rounded-[2.5rem] border-2 ${event.color} bg-white group hover:shadow-2xl hover:shadow-pink-100 transition-all duration-500`}
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className={`p-5 rounded-2xl ${event.color} flex-shrink-0`}>
                      <event.icon className="w-8 h-8" />
                    </div>
                    <div className="text-center sm:text-left space-y-4 flex-grow">
                      <h4 className="text-2xl font-playfair font-bold text-slate-900">{event.title}</h4>
                      <div className="grid gap-2 text-slate-600 font-light">
                        <p className="flex items-center justify-center sm:justify-start gap-2">
                           <CalendarDays className="w-4 h-4 opacity-50" /> {formattedDate}
                        </p>
                        <p className="flex items-center justify-center sm:justify-start gap-2">
                           <Music className="w-4 h-4 opacity-50" /> {event.time}
                        </p>
                        <p className="flex items-center justify-center sm:justify-start gap-2">
                           <MapPin className="w-4 h-4 opacity-50" /> {invitation.location}
                        </p>
                      </div>
                      <button className="mt-4 px-6 py-2 rounded-full border border-current text-sm font-semibold hover:bg-current hover:text-white transition-colors">
                        BUKA GOOGLE MAPS
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Gallery Section */}
          <section className="py-24 px-8 sm:px-12 lg:px-20 space-y-12">
             <div className="text-center space-y-2">
                <span className="text-pink-600 text-sm uppercase tracking-[0.4em] font-bold">Our Moments</span>
                <h3 className="text-4xl font-playfair">Galeri Foto</h3>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                {[1,2,3,4,5,6].map((i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 0.98 }}
                    className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg"
                  >
                    <img src={`https://images.unsplash.com/photo-${1511285560929 + i}?q=80&w=800&auto=format&fit=crop`} className="w-full h-full object-cover" alt="" />
                  </motion.div>
                ))}
             </div>
          </section>

          {/* RSVP Section */}
          <section className="bg-slate-900 py-24 px-8 sm:px-12 lg:px-20 rounded-t-[4rem] text-white">
            <div className="max-w-md mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-playfair">Konfirmasi Kehadiran</h3>
                <p className="text-slate-400 font-light">Berikan kabar kehadiran Anda melalui form di bawah ini.</p>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Nama Lengkap</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-pink-500 transition-colors" placeholder="Masukkan nama" />
                </div>
                
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-bold block">Kehadiran</label>
                  <div className="flex gap-4">
                    <button type="button" className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500 transition-all">YA</button>
                    <button type="button" className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500 transition-all">TIDAK</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Pesan & Doa</label>
                  <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-pink-500 transition-colors" placeholder="Tuliskan ucapan..."></textarea>
                </div>

                <button className="w-full py-5 rounded-2xl bg-pink-600 hover:bg-pink-700 font-bold tracking-widest transition-colors shadow-lg shadow-pink-900/20">
                  KIRIM KONFIRMASI
                </button>
              </form>
            </div>
          </section>

          {/* Gift Section / Footer */}
          <footer className="bg-[#faf8f3] py-24 px-8 sm:px-12 lg:px-20 space-y-16 text-center">
             <div className="space-y-8">
                <Gift className="w-12 h-12 mx-auto text-pink-500" />
                <div className="space-y-4">
                  <h3 className="text-3xl font-playfair">Wedding Gift</h3>
                  <p className="text-slate-500 max-w-sm mx-auto font-light">Tanpa mengurangi rasa hormat, bagi Anda yang ingin mengirimkan hadiah digital.</p>
                </div>
                
                <div className="max-w-xs mx-auto p-8 rounded-[3rem] bg-white shadow-xl border border-pink-50 space-y-4">
                   <p className="text-slate-900 font-bold text-xl">BANK BCA</p>
                   <p className="text-slate-500 text-sm">Transfer atas nama:</p>
                   <p className="text-slate-900 font-medium">{groomName} & {brideName}</p>
                   <div className="py-4 border-y border-slate-100">
                      <p className="text-2xl font-mono tracking-wider font-bold text-pink-600">123 456 7890</p>
                   </div>
                   <button className="w-full flex items-center justify-center gap-2 text-pink-600 font-bold text-sm tracking-widest hover:text-pink-700 transition">
                      <Copy className="w-4 h-4" /> SALIN NO. REKENING
                   </button>
                </div>
             </div>

             <div className="pt-24 space-y-8">
                <p className="text-slate-400 font-light max-w-md mx-auto italic">"Terima kasih atas doa dan restu Anda di hari bahagia kami."</p>
                <div className="flex justify-center gap-4">
                   <CopyLinkButton link={invitation.invitationLink} label="Copy Link" />
                   <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 text-slate-600 font-semibold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                      <Share2 className="w-4 h-4" /> Share
                   </button>
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-bold">Katalog Undangan &copy; 2026</p>
             </div>
          </footer>

        </div>
      </div>
    </div>
  )
}
