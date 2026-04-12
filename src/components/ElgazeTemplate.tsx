'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Heart, MapPin, CalendarDays, Music, Users, Gift, MessageCircle, Copy, Share2, Compass, Sparkles, Shirt } from 'lucide-react'
import CopyLinkButton from './CopyLinkButton'
import CountdownTimer from './CountdownTimer'

interface ElgazeTemplateProps {
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

export default function ElgazeTemplate({ invitation, formattedDate }: ElgazeTemplateProps) {
  const [groomName, brideName] = invitation.title.split(/\s*&\s*/).map((name) => name.trim())
  const [isOpened, setIsOpened] = useState(false)
  
  // Parallax effects
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  })
  
  const imgScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2])
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -40])

  if (!isOpened) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#121212] text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 scale-110" 
            alt="Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 via-[#121212]/40 to-[#121212]"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center space-y-12 px-6"
        >
          <div className="space-y-6">
            <motion.p 
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "0.5em" }}
              className="text-xs sm:text-sm uppercase font-light text-amber-200"
            >
              The Grand Wedding Of
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-8xl font-playfair tracking-tight"
            >
              {groomName} <span className="italic text-amber-500">&</span> {brideName}
            </motion.h1>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpened(true)}
            className="group relative inline-flex items-center gap-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-10 py-5 text-white font-medium overflow-hidden transition-all duration-500 hover:bg-white hover:text-black hover:border-white"
          >
             <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
             <span className="tracking-[0.2em] text-sm font-bold">OPEN INVITATION</span>
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#121212] text-[#e5e5e5] selection:bg-amber-500 selection:text-black" ref={scrollRef}>
      
      {/* Cinematic Split Screen */}
      <div className="flex flex-col lg:flex-row">
        
        {/* Sticky Left Media */}
        <div className="relative w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 overflow-hidden order-1 lg:order-1">
          <motion.div style={{ scale: imgScale }} className="h-full">
            <img 
              src="https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=2000&auto=format&fit=crop" 
              alt="Cinematic pair" 
              className="h-full w-full object-cover grayscale-[30%] brightness-[0.7]"
            />
          </motion.div>
          
          {/* Leaf Shadow Overlay Placeholder (Using a subtle gradient/noise) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)]"></div>
          
          <motion.div 
            style={{ y: textY }}
            className="absolute inset-0 flex flex-col justify-end p-12 sm:p-20 space-y-6"
          >
            <div className="w-16 h-[2px] bg-amber-500"></div>
            <h2 className="text-4xl sm:text-6xl font-playfair leading-tight italic">
              "Beginning of our <br/>
              <span className="text-amber-500 not-italic font-bold">Forever journey"</span>
            </h2>
            <p className="text-sm uppercase tracking-[0.4em] text-white/60 font-medium">EST. {new Date().getFullYear()}</p>
          </motion.div>
        </div>

        {/* Content Right */}
        <div className="w-full lg:w-1/2 order-2 lg:order-2 bg-[#121212] relative">
          
          {/* Intro Section */}
          <section className="py-32 px-10 sm:px-20 lg:px-24 space-y-16 border-b border-white/5">
            <div className="space-y-6 text-center lg:text-left">
              <Compass className="w-8 h-8 text-amber-500 mx-auto lg:mx-0 animate-spin-slow" />
              <h3 className="text-sm uppercase tracking-[0.6em] text-amber-200/50">Introduction</h3>
              <h2 className="text-4xl sm:text-5xl font-playfair font-medium">Bismillahirranmannirrahim</h2>
              <p className="text-white/60 font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
                Atas izin Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir di acara perayaan pernikahan kami yang akan diselenggarakan pada:
              </p>
            </div>

            <div className="grid gap-20">
              {/* Couple Info */}
              <div className="space-y-16">
                 {/* Groom */}
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   className="flex flex-col sm:flex-row items-center gap-10"
                 >
                   <div className="w-40 h-56 rounded-full overflow-hidden border border-white/10 ring-8 ring-white/5 flex-shrink-0">
                     <img src="https://images.unsplash.com/photo-1550005810-350a417a1505?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover" alt="Groom" />
                   </div>
                   <div className="text-center sm:text-left space-y-2">
                     <h4 className="text-3xl font-playfair text-amber-100">{groomName}</h4>
                     <p className="text-xs uppercase tracking-widest text-white/40 font-bold mb-4">The Groom</p>
                     <p className="text-sm text-white/50 leading-loose max-w-xs">Putra ke-2 dari Bapak Nama Ayah & Ibu Nama Ibu</p>
                   </div>
                 </motion.div>

                 {/* Bride */}
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   className="flex flex-col sm:flex-row-reverse items-center gap-10"
                 >
                   <div className="w-40 h-56 rounded-full overflow-hidden border border-white/10 ring-8 ring-white/5 flex-shrink-0">
                     <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop" className="w-full h-full object-cover" alt="Bride" />
                   </div>
                   <div className="text-center sm:text-right space-y-2">
                     <h4 className="text-3xl font-playfair text-amber-100">{brideName}</h4>
                     <p className="text-xs uppercase tracking-widest text-white/40 font-bold mb-4">The Bride</p>
                     <p className="text-sm text-white/50 leading-loose max-w-xs ml-auto">Putri bungsu dari Bapak Nama Ayah & Ibu Nama Ibu</p>
                   </div>
                 </motion.div>
              </div>
            </div>
          </section>

          {/* Events Section */}
          <section className="py-32 px-10 sm:px-20 lg:px-24 space-y-20">
            <div className="text-center space-y-4">
              <h3 className="text-sm uppercase tracking-[0.6em] text-amber-200/50">Our Holy Matrimony</h3>
              <h2 className="text-4xl sm:text-5xl font-playfair italic underline underline-offset-8 decoration-amber-500/30">Save The Date</h2>
            </div>
            
            <div className="grid gap-12">
               {[
                 { type: 'Ceremony', icon: Heart, time: '08:00 - 10:00 WIB', location: 'Hotel Mulia, Jakarta' },
                 { type: 'Reception', icon: Star, time: '13:00 - 15:00 WIB', location: 'Grand Ballroom, Jakarta' }
               ].map((ev, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ y: -5 }}
                   className="p-10 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:border-amber-500/20 transition-all duration-500 group"
                 >
                    <div className="space-y-6">
                       <div className="flex justify-between items-center">
                          <ev.icon className="w-6 h-6 text-amber-500" />
                          <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">{ev.type}</span>
                       </div>
                       <div className="space-y-2">
                          <p className="text-xs uppercase tracking-widest text-white/40 font-bold">When & Where</p>
                          <p className="text-2xl font-playfair text-white">{formattedDate}</p>
                          <p className="text-lg text-white/70">{ev.time}</p>
                          <div className="pt-4 flex items-center gap-2 text-amber-200/60 font-light italic">
                             <MapPin className="w-4 h-4" />
                             <span>{ev.location}</span>
                          </div>
                       </div>
                       <button className="w-full py-4 rounded-xl border border-white/10 text-xs font-bold tracking-[0.3em] hover:bg-white hover:text-black transition-all">VIEW MAPS</button>
                    </div>
                 </motion.div>
               ))}
            </div>
            
            <div className="pt-10">
               <CountdownTimer targetDate={new Date(invitation.eventDate)} />
            </div>
          </section>

          {/* Gallery Section */}
          <section className="bg-white/[0.02] py-32 px-10 sm:px-20 lg:px-24 space-y-16 overflow-hidden">
             <div className="flex justify-between items-end">
                <div className="space-y-4">
                  <h3 className="text-sm uppercase tracking-[0.5em] text-amber-200/50">Journal</h3>
                  <h2 className="text-5xl font-playfair">Gallery</h2>
                </div>
                <Users className="w-12 h-12 text-white/5 -mb-4 transform rotate-12" />
             </div>
             
             <div className="columns-2 gap-4 space-y-4">
                {[1,2,3,4,5].map((i) => (
                  <motion.div key={i} whileHover={{ filter: "grayscale(0%)" }} className="rounded-3xl overflow-hidden border border-white/10 grayscale-[100%] transition-all duration-500">
                    <img src={`https://images.unsplash.com/photo-${1511285560929 + i}?q=80&w=800&auto=format&fit=crop`} alt="gallery" className="w-full h-auto object-cover" />
                  </motion.div>
                ))}
             </div>
          </section>

          {/* Dress Code Section */}
          <section className="py-24 px-10 sm:px-20 lg:px-24 space-y-12">
             <div className="text-center lg:text-left space-y-4">
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                   <Shirt className="w-6 h-6 text-amber-500" />
                   <h3 className="text-sm uppercase tracking-[0.5em] text-amber-200/50">Attire</h3>
                </div>
                <h2 className="text-4xl font-playfair">Dress Code</h2>
                <p className="text-white/50 font-light max-w-sm">Mohon berkenan hadir dengan menggunakan warna pakaian yang disarankan:</p>
             </div>
             
             <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                {[
                  { name: 'Black', color: '#000000' },
                  { name: 'Sage', color: '#979c84' },
                  { name: 'Beige', color: '#d5c2a1' },
                  { name: 'Coffee', color: '#4b3d30' }
                ].map((c, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div style={{ backgroundColor: c.color }} className="w-16 h-16 rounded-full border border-white/20 shadow-xl" />
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">{c.name}</span>
                  </div>
                ))}
             </div>
          </section>

          {/* Gift Section */}
          <section className="py-32 px-10 sm:px-20 lg:px-24 bg-white/[0.02] space-y-16">
             <div className="text-center space-y-8">
                <Gift className="w-10 h-10 text-amber-500 mx-auto" />
                <div className="space-y-4">
                  <h2 className="text-4xl font-playfair">Wedding Gift</h2>
                  <p className="text-white/40 font-light">Berbagi kebahagiaan melalui amplop digital</p>
                </div>
             </div>

             <div className="max-w-md mx-auto space-y-6">
                <div className="relative group p-10 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent border border-white/5 hover:border-amber-500/30 transition-all duration-500 overflow-hidden text-center">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                       <Sparkles className="w-20 h-20 text-white" />
                    </div>
                    <div className="relative z-10 space-y-6">
                       <p className="text-sm uppercase tracking-[0.4em] font-bold text-amber-200">BANK BCA</p>
                       <p className="text-3xl font-mono tracking-[0.2em] font-bold text-white">123 456 7890</p>
                       <p className="text-xs uppercase tracking-widest text-white/40">A.N {groomName} & {brideName}</p>
                       <button className="flex items-center gap-2 mx-auto px-6 py-3 rounded-full bg-white text-black font-bold text-xs tracking-widest hover:bg-amber-500 transition-colors">
                          <Copy className="w-4 h-4" /> COPY NUMBER
                       </button>
                    </div>
                </div>
             </div>
          </section>

          {/* Footer */}
          <footer className="py-40 px-10 sm:px-20 lg:px-24 text-center space-y-12">
             <div className="space-y-6">
                <h2 className="text-6xl sm:text-7xl font-playfair opacity-80 italic underline decoration-amber-500/20 underline-offset-[20px]">Thank You</h2>
                <p className="text-white/40 font-light max-w-sm mx-auto leading-loose italic">"Terima kasih atas doa dan kehadiran Bapak/Ibu/Saudara/i yang sangat bermakna bagi kami."</p>
             </div>
             
             <div className="pt-20 space-y-8 border-t border-white/5">
                <div className="flex flex-wrap justify-center gap-6">
                   <CopyLinkButton link={invitation.invitationLink} />
                   <button className="flex items-center gap-3 px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all">
                      <Share2 className="w-4 h-4" /> 
                      <span className="text-xs font-bold tracking-widest">SHARE</span>
                   </button>
                </div>
                <div className="space-y-2 opacity-30">
                   <p className="text-[10px] tracking-[0.5em] font-bold uppercase">Katalog Undangan</p>
                   <p className="text-[9px] font-light">Build your special moment with us &copy; 2026</p>
                </div>
             </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
