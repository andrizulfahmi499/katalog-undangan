'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MapPin, Calendar, Gift, Copy, Music, Volume2, VolumeX, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { parseEditorConfig } from '@/lib/invitationEditorConfig'

interface AyshaTemplateProps {
  invitation: {
    id: string
    title: string
    eventName: string
    eventDate: string | Date
    location: string
    invitationLink: string
    templateMessage: string
    assignedMember?: { name: string; email: string } | null
    editorConfig?: any
  }
  formattedDate: string
  editable?: boolean
}

// Fade up animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

export default function AyshaTemplate({ invitation, formattedDate, editable = false }: AyshaTemplateProps) {
  const [isOpened, setIsOpened] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState<'wishes' | 'confirm'>('wishes')
  
  // RSVP states
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpAttend, setRsvpAttend] = useState('hadir')
  const [rsvpCount, setRsvpCount] = useState(1)
  const [rsvpMsg, setRsvpMsg] = useState('')
  const [rsvpSent, setRsvpSent] = useState(false)
  
  // Wish list local state
  const [wishes, setWishes] = useState<any[]>([
    { name: 'Keluarga Bara', date: '01-06-2026', message: 'Selamat atas bersatunya Yunita & Irjan. Tuhan Yesus memberkati pernikahan kalian hingga maut memisahkan.' },
    { name: 'Pdt. Jemaat Moria', date: '02-06-2026', message: 'Selamat membina rumah tangga baru. Kasih Tuhan selalu melingkupi keluarga baru ini.' },
    { name: 'Sertu Luther', date: '03-06-2026', message: 'Selamat ya Irjan & Yunita! Sukses selalu langkah ke depannya.' }
  ])

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const cfg = parseEditorConfig(invitation.editorConfig)

  // Parse names
  const [groomNameDefault, brideNameDefault] = invitation.title.split(/\s*&\s*/).map((n) => n.trim())
  const guestName = invitation.assignedMember?.name || 'Tamu Undangan'

  // Extract content config helpers
  const getSection = (categoryOrId: string) => {
    return cfg.sections.find((s) => s.category === categoryOrId || s.id === categoryOrId)
  }
  const isSectionEnabled = (categoryOrId: string) => {
    const s = getSection(categoryOrId)
    return s ? s.enabled : true
  }
  const getSectionContent = (categoryOrId: string) => {
    return getSection(categoryOrId)?.content || {}
  }

  const musicUrl = cfg.ui.musicUrl?.trim() || 'https://assets.satumomen.com/audio/i-think-they-call-this-love.mp3'

  useEffect(() => {
    if (isOpened && cfg.ui.musicEnabled !== false) {
      if (!audioRef.current) {
        audioRef.current = new Audio(musicUrl)
        audioRef.current.loop = true
      }
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch((err) => {
        console.error('Audio play failed:', err)
      })
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [isOpened, musicUrl, cfg.ui.musicEnabled])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard?.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rsvpName.trim() || !rsvpMsg.trim()) return
    const newWish = {
      name: rsvpName,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      message: rsvpMsg
    }
    setWishes([newWish, ...wishes])
    setRsvpSent(true)
    setRsvpName('')
    setRsvpMsg('')
  }

  // Fallback to sections list or custom order
  const orderedSections = cfg.sections && cfg.sections.length > 0 ? cfg.sections : [
    { id: 'opening', category: 'opening', enabled: true },
    { id: 'quotes', category: 'quotes', enabled: true },
    { id: 'mempelai', category: 'mempelai', enabled: true },
    { id: 'event', category: 'event', enabled: true },
    { id: 'countdown', category: 'countdown', enabled: true },
    { id: 'gallery', category: 'gallery', enabled: true },
    { id: 'rsvp', category: 'rsvp', enabled: true },
    { id: 'gift', category: 'gift', enabled: true },
    { id: 'closing', category: 'closing', enabled: true }
  ]

  // Styles Injection
  const cssStyles = `
    @import url('/fonts/e111viva/style.css');
    @import url('/fonts/against/style.css');
    @import url('/fonts/brittany_signature/BrittanySignature.css');
    @import url('/fonts/photograph_signature/fonts.css');
    @import url('/fonts/heatwood/Heatwood.css');
    @import url('https://fonts.googleapis.com/css2?family=Marcellus&display=swap');

    :root {
      --inv-bg: #d8dad7;
      --inv-base: #5e4e41;
      --inv-accent: #a7883b;
      --inv-border: #dad2b9;
      --menu-bg: #fffff9;
      --menu-inactive: #5e4e41;
      --menu-active: #a7883b;
      --btn-color: #ffffff;
      --font-base: "Marcellus", serif;
      --font-accent: "Against", sans-serif;
      --font-latin: "English111 Vivace BT", cursive;
    }

    @keyframes wave-left {
      0% { transform: rotate(-3deg); }
      100% { transform: rotate(4deg); }
    }
    @keyframes wave-right {
      0% { transform: rotate(3deg); }
      100% { transform: rotate(-4deg); }
    }
    .wave-left img {
      animation: wave-left 4s ease-in-out infinite alternate;
    }
    .wave-right img {
      animation: wave-right 4s ease-in-out infinite alternate;
    }
    .frame-mempelai::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: url(/themes/aysha/frame-mempelai.webp);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      z-index: 1;
      top: 0;
      left: 0;
    }
    
    .font-latin-custom {
      font-family: var(--font-latin), cursive;
    }
    .font-accent-custom {
      font-family: var(--font-accent), sans-serif;
    }
    .font-base-custom {
      font-family: var(--font-base), serif;
    }
  `

  // 1. Cover View
  if (!isOpened) {
    const openingContent = getSectionContent('opening')
    return (
      <div className="fixed inset-0 z-[999] flex flex-col justify-between items-center text-center p-8 bg-[#d8dad7]"
        style={{
          backgroundImage: `url('${cfg.ui.backgroundImageUrl || '/themes/aysha/bg.webp'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'var(--inv-base)',
          fontFamily: 'var(--font-base), serif'
        }}>
        <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
        
        {/* Cover Top Ornament */}
        <div className="wave-left mt-8 w-48 opacity-80">
          <img src="/themes/aysha/bg-batik.webp" alt="Ornament" className="mx-auto" />
        </div>

        {/* Title Block */}
        <div className="my-auto max-w-md flex flex-col justify-center items-center">
          <p className="text-[12px] uppercase tracking-[0.3em] opacity-80 mb-4">
            {openingContent.subtitle || 'The Wedding Of'}
          </p>
          <h1 className="text-5xl md:text-6xl font-latin-custom color-accent text-[#a7883b] my-4 leading-none">
            {openingContent.coupleNames || openingContent.title || invitation.title}
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] opacity-70 mt-2 mb-10">
            {formattedDate}
          </p>

          <div className="border border-[#dad2b9] bg-white/40 backdrop-blur-sm rounded-xl px-6 py-5 max-w-sm w-full shadow-sm">
            <p className="text-[11px] uppercase tracking-widest opacity-80 mb-2">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
            <h2 className="text-xl font-bold font-base-custom text-[#5e4e41] mb-1">{guestName}</h2>
            <p className="text-[11px] opacity-75 font-italic">di tempat</p>
          </div>

          <button onClick={() => setIsOpened(true)}
            className="mt-8 flex items-center justify-center gap-2 bg-[#5e4e41] hover:bg-[#a7883b] text-white px-8 py-3 rounded-full text-sm tracking-widest uppercase transition-all duration-300 shadow-md">
            <Heart className="w-4 h-4 fill-white" />
            Buka Undangan
          </button>
        </div>

        {/* Cover Bottom Ornament */}
        <div className="wave-right mb-4 w-48 opacity-80">
          <img src="/themes/aysha/bg-batik.webp" alt="Ornament" className="mx-auto" />
        </div>
      </div>
    )
  }

  // Gather photos from gallery sections
  const galleryImages = orderedSections
    .filter(s => s.category === 'gallery' && s.enabled)
    .flatMap(s => s.content?.images || [])
    .filter(img => img && img.url)
    .map(img => img.url)

  // Default gallery photos if empty
  const defaultGallery = galleryImages.length > 0 ? galleryImages : [
    '/themes/aysha/bg-tree.webp',
    '/themes/aysha/bg-waterfall.webp',
    '/themes/aysha/bg-rimbun.webp',
    '/themes/aysha/bg-batik.webp'
  ]

  // Main Page View (Dynamic Smart Renderer)
  return (
    <div className="relative min-h-screen bg-[#d8dad7] pb-24 text-slate-800 antialiased font-base-custom"
      style={{
        backgroundImage: `url('${cfg.ui.backgroundImageUrl || '/themes/aysha/bg.webp'}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'var(--inv-base)',
        fontFamily: 'var(--font-base), serif'
      }}>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

      {/* Floating Music Button */}
      {cfg.ui.musicEnabled !== false && (
        <button onClick={togglePlay}
          className="fixed bottom-6 right-6 z-50 p-3 bg-white/70 backdrop-blur-md border border-[#dad2b9] rounded-full text-[#5e4e41] shadow-lg hover:bg-[#5e4e41] hover:text-white transition-all duration-300">
          {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
        </button>
      )}

      {/* Dynamic Sections Renderer */}
      <div className="max-w-md mx-auto bg-[#fffff9]/90 min-h-screen shadow-2xl relative border-x border-[#dad2b9]">
        {orderedSections.map((section, idx) => {
          if (!section.enabled) return null
          const key = section.id || `${section.category}-${idx}`
          const category = section.category || section.id
          const content = section.content || {}

          switch (category) {
            // Opening Block
            case 'opening': {
              return (
                <section key={key} className="py-20 px-8 text-center border-b border-[#dad2b9] relative overflow-hidden flex flex-col justify-center items-center min-h-[80vh]">
                  <div className="wave-left w-32 opacity-70 mb-8"><img src="/themes/aysha/bg-batik.webp" alt="" className="mx-auto" /></div>
                  <span className="text-xs tracking-[0.4em] uppercase text-[#a7883b] font-semibold">{content.subtitle || 'The Wedding Of'}</span>
                  <h2 className="text-4xl md:text-5xl font-latin-custom text-[#a7883b] my-6 leading-tight">{content.coupleNames || invitation.title}</h2>
                  <p className="text-sm tracking-widest text-[#5e4e41]">{formattedDate}</p>
                  <div className="wave-right w-32 opacity-70 mt-8"><img src="/themes/aysha/bg-batik.webp" alt="" className="mx-auto" /></div>
                </section>
              )
            }

            // Quotes Block
            case 'quotes': {
              return (
                <section key={key} className="py-16 px-8 text-center border-b border-[#dad2b9] relative bg-cover bg-center" style={{ backgroundImage: `url('/themes/aysha/bg-adat.webp')`, backgroundBlendMode: 'overlay', backgroundColor: 'rgba(255,255,249,0.92)' }}>
                  <div className="max-w-sm mx-auto">
                    <img src="/themes/aysha/bg-tree.webp" alt="Tree" className="w-24 mx-auto opacity-70 mb-6" />
                    <p className="text-sm italic font-base-custom leading-relaxed text-[#5e4e41] px-4">
                      "{content.verse || 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.'}"
                    </p>
                    {content.source && (
                      <p className="text-xs uppercase tracking-widest font-bold mt-4 text-[#a7883b]">
                        {content.source}
                      </p>
                    )}
                  </div>
                </section>
              )
            }

            // Mempelai Block (Supports groom, bride, couple presets)
            case 'mempelai':
            case 'groom':
            case 'bride': {
              const groomName = content.groomName || groomNameDefault || 'Mempelai Pria'
              const groomParents = content.groomParents || 'Putra dari Bapak SERTU Luther & Ibu Natalia'
              const brideName = content.brideName || brideNameDefault || 'Mempelai Wanita'
              const brideParents = content.brideParents || 'Putri dari Bapak Aris Bara & Ibu Yakolina (Almh)'

              return (
                <section key={key} className="py-20 px-6 border-b border-[#dad2b9] relative" style={{ backgroundImage: `url('/themes/aysha/bg.webp')` }}>
                  <div className="wave-left absolute top-4 left-4 w-28 opacity-40"><img src="/themes/aysha/bg-rimbun.webp" alt="" /></div>
                  <div className="wave-right absolute bottom-4 right-4 w-28 opacity-40"><img src="/themes/aysha/bg-rimbun.webp" alt="" /></div>

                  <div className="text-center max-w-sm mx-auto">
                    <span className="text-xs tracking-[0.3em] uppercase text-[#a7883b]">Mempelai</span>
                    <h2 className="text-3xl font-latin-custom text-[#5e4e41] mt-2 mb-10">Pria & Wanita</h2>

                    {/* Groom Profile */}
                    <div className="mb-14">
                      <div className="relative w-44 h-44 mx-auto mb-6 frame-mempelai overflow-hidden flex items-center justify-center p-2">
                        <img src={content.groomPhoto || '/themes/aysha/bg-tree.webp'} alt={groomName} className="w-[85%] h-[85%] object-cover rounded-full z-0" />
                      </div>
                      <h3 className="text-2xl font-accent-custom text-[#a7883b] font-semibold">{groomName}</h3>
                      <p className="text-xs text-[#5e4e41] max-w-xs mx-auto mt-2 leading-relaxed">{groomParents}</p>
                    </div>

                    {/* And Connector */}
                    <div className="text-4xl font-latin-custom text-[#a7883b] my-4 font-bold">&</div>

                    {/* Bride Profile */}
                    <div className="mt-6">
                      <div className="relative w-44 h-44 mx-auto mb-6 frame-mempelai overflow-hidden flex items-center justify-center p-2">
                        <img src={content.bridePhoto || '/themes/aysha/bg-tree.webp'} alt={brideName} className="w-[85%] h-[85%] object-cover rounded-full z-0" />
                      </div>
                      <h3 className="text-2xl font-accent-custom text-[#a7883b] font-semibold">{brideName}</h3>
                      <p className="text-xs text-[#5e4e41] max-w-xs mx-auto mt-2 leading-relaxed">{brideParents}</p>
                    </div>
                  </div>
                </section>
              )
            }

            // Event details block
            case 'event':
            case 'acara': {
              return (
                <section key={key} className="py-20 px-8 border-b border-[#dad2b9] text-center relative" style={{ backgroundImage: `url('/themes/aysha/bg-waterfall.webp')`, backgroundBlendMode: 'overlay', backgroundColor: 'rgba(255,255,249,0.92)' }}>
                  <img src="/themes/aysha/ranting.webp" alt="Ornaments" className="w-24 mx-auto opacity-70 mb-4" />
                  
                  <div className="max-w-sm mx-auto space-y-12">
                    {/* Event 1 */}
                    <div>
                      <h3 className="text-2xl font-accent-custom text-[#a7883b] font-semibold">{content.title1 || 'Pemberkatan Nikah'}</h3>
                      <p className="text-xs tracking-widest uppercase mt-3 text-[#5e4e41] font-bold">{content.date1 || 'Sabtu, 14 Maret 2026'}</p>
                      <p className="text-sm mt-1 text-[#5e4e41]">{content.time1 || '10.00 Wita - Selesai'}</p>
                      <p className="text-sm font-semibold mt-4 text-[#a7883b]">{content.venue1 || 'Gereja Toraja Jemaat Moria'}</p>
                      <p className="text-xs text-[#5e4e41] mt-1 max-w-xs mx-auto leading-relaxed">{content.address1 || 'Jl. Tanjung Harapan No. 13 Palu'}</p>
                    </div>

                    {/* Divider line */}
                    <div className="w-16 h-[1px] bg-[#dad2b9] mx-auto"></div>

                    {/* Event 2 */}
                    <div>
                      <h3 className="text-2xl font-accent-custom text-[#a7883b] font-semibold">{content.title2 || 'Resepsi Pernikahan'}</h3>
                      <p className="text-xs tracking-widest uppercase mt-3 text-[#5e4e41] font-bold">{content.date2 || 'Sabtu, 14 Maret 2026'}</p>
                      <p className="text-sm mt-1 text-[#5e4e41]">{content.time2 || '19.00 Wita - Selesai'}</p>
                      <p className="text-sm font-semibold mt-4 text-[#a7883b]">{content.venue2 || 'Gedung Merry Glow (Convention Hall)'}</p>
                      <p className="text-xs text-[#5e4e41] mt-1 max-w-xs mx-auto leading-relaxed">{content.address2 || 'Jl. Pattimura No. 30 Palu'}</p>
                    </div>

                    {/* Google Maps Button */}
                    {content.mapsUrl && (
                      <div className="pt-4">
                        <a href={content.mapsUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-[#5e4e41] hover:bg-[#a7883b] text-white px-6 py-2.5 rounded-full text-xs uppercase tracking-widest transition-all duration-300">
                          <MapPin className="w-4 h-4" />
                          Buka Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                </section>
              )
            }

            // Countdown Block
            case 'countdown': {
              const targetDateStr = content.targetDate || invitation.eventDate
              return (
                <section key={key} className="py-16 px-6 border-b border-[#dad2b9] text-center bg-cover bg-center" style={{ backgroundImage: `url('/themes/aysha/bg-waterfall.webp')`, backgroundBlendMode: 'overlay', backgroundColor: 'rgba(255,255,249,0.92)' }}>
                  <div className="max-w-sm mx-auto">
                    <span className="text-xs tracking-[0.2em] uppercase text-[#a7883b]">Waktu Acara</span>
                    <h3 className="text-2xl font-latin-custom mt-2 mb-8 text-[#5e4e41]">Hitung Mundur</h3>

                    <div className="relative p-6 max-w-xs mx-auto flex items-center justify-center min-h-[140px]" 
                      style={{ backgroundImage: "url('/themes/aysha/frame-countdown.webp')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                      <CountdownTimer targetDate={targetDateStr} />
                    </div>
                  </div>
                </section>
              )
            }

            // Gallery Block
            case 'gallery': {
              return (
                <section key={key} className="py-20 px-4 border-b border-[#dad2b9] text-center bg-[#fffff9]/80">
                  <span className="text-xs tracking-[0.3em] uppercase text-[#a7883b]">Galeri Foto</span>
                  <h2 className="text-3xl font-latin-custom text-[#5e4e41] mt-2 mb-8">Our Memories</h2>

                  <div className="grid grid-cols-3 gap-2">
                    {defaultGallery.map((photoUrl, pIdx) => (
                      <div key={pIdx} onClick={() => setLightboxIndex(pIdx)}
                        className="aspect-square bg-slate-100 overflow-hidden cursor-pointer hover:opacity-90 border border-[#dad2b9]/40 rounded shadow-sm transition-all duration-300">
                        <img src={photoUrl} alt="Gallery item" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                </section>
              )
            }

            // RSVP & Wishes Block
            case 'rsvp': {
              return (
                <section key={key} className="py-20 px-6 border-b border-[#dad2b9]" style={{ backgroundImage: `url('/themes/aysha/bg.webp')` }}>
                  <div className="max-w-sm mx-auto">
                    <div className="text-center mb-8">
                      <span className="text-xs tracking-[0.3em] uppercase text-[#a7883b]">Buku Tamu</span>
                      <h2 className="text-3xl font-latin-custom text-[#5e4e41] mt-2">RSVP & Wishes</h2>
                      <p className="text-xs text-[#5e4e41] mt-2 leading-relaxed">Silakan konfirmasi kehadiran Anda dan berikan pesan atau doa restu kepada kedua mempelai.</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-[#dad2b9] mb-6">
                      <button onClick={() => setActiveTab('wishes')}
                        className={`flex-1 pb-3 text-sm tracking-wider uppercase transition-all ${activeTab === 'wishes' ? 'border-b-2 border-[#a7883b] text-[#a7883b] font-bold' : 'text-[#5e4e41]/60'}`}>
                        Doa Restu
                      </button>
                      <button onClick={() => setActiveTab('confirm')}
                        className={`flex-1 pb-3 text-sm tracking-wider uppercase transition-all ${activeTab === 'confirm' ? 'border-b-2 border-[#a7883b] text-[#a7883b] font-bold' : 'text-[#5e4e41]/60'}`}>
                        Konfirmasi Kehadiran
                      </button>
                    </div>

                    {activeTab === 'wishes' ? (
                      <div className="space-y-6">
                        {/* Wish Form */}
                        <form onSubmit={handleAddWish} className="space-y-4 bg-white/70 p-5 border border-[#dad2b9] rounded-xl shadow-sm">
                          <div>
                            <label className="block text-[11px] uppercase tracking-widest text-[#5e4e41] font-bold mb-1">Nama Tamu</label>
                            <input type="text" required value={rsvpName} onChange={(e) => setRsvpName(e.target.value)}
                              placeholder="Masukkan nama Anda"
                              className="w-full bg-white/90 border border-[#dad2b9] text-[#5e4e41] text-sm rounded-lg px-3 py-2 outline-none focus:border-[#a7883b] transition-all" />
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase tracking-widest text-[#5e4e41] font-bold mb-1">Pesan & Doa Restu</label>
                            <textarea required rows={3} value={rsvpMsg} onChange={(e) => setRsvpMsg(e.target.value)}
                              placeholder="Tuliskan ucapan selamat..."
                              className="w-full bg-white/90 border border-[#dad2b9] text-[#5e4e41] text-sm rounded-lg px-3 py-2 outline-none focus:border-[#a7883b] transition-all resize-none"></textarea>
                          </div>
                          <button type="submit"
                            className="w-full bg-[#5e4e41] hover:bg-[#a7883b] text-white text-xs uppercase tracking-widest py-3 rounded-full transition-all duration-300 shadow">
                            Kirim Ucapan
                          </button>
                        </form>

                        {/* Wishing comments lists */}
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                          {wishes.map((w, wIdx) => (
                            <div key={wIdx} className="bg-white/50 p-4 border border-[#dad2b9]/60 rounded-xl">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-sm text-[#5e4e41]">{w.name}</h4>
                                <span className="text-[10px] text-[#5e4e41]/60">{w.date}</span>
                              </div>
                              <p className="text-xs text-[#5e4e41] leading-relaxed">{w.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white/70 p-5 border border-[#dad2b9] rounded-xl shadow-sm space-y-5">
                        {rsvpSent ? (
                          <div className="text-center py-6">
                            <h4 className="text-lg font-bold text-[#a7883b]">Terima Kasih!</h4>
                            <p className="text-xs text-[#5e4e41] mt-2">Konfirmasi kehadiran Anda telah dikirimkan ke pihak panitia pernikahan.</p>
                          </div>
                        ) : (
                          <>
                            <div>
                              <label className="block text-[11px] uppercase tracking-widest text-[#5e4e41] font-bold mb-1">Nama</label>
                              <input type="text" required value={rsvpName} onChange={(e) => setRsvpName(e.target.value)}
                                placeholder="Masukkan nama"
                                className="w-full bg-white/90 border border-[#dad2b9] text-[#5e4e41] text-sm rounded-lg px-3 py-2 outline-none focus:border-[#a7883b] transition-all" />
                            </div>

                            <div>
                              <label className="block text-[11px] uppercase tracking-widest text-[#5e4e41] font-bold mb-1">Konfirmasi Kehadiran</label>
                              <div className="grid grid-cols-2 gap-2 mt-1">
                                <button type="button" onClick={() => setRsvpAttend('hadir')}
                                  className={`py-2 rounded-lg text-xs uppercase tracking-wider border font-bold transition-all ${rsvpAttend === 'hadir' ? 'bg-[#a7883b] border-[#a7883b] text-white' : 'border-[#dad2b9] text-[#5e4e41]'}`}>
                                  Saya Hadir
                                </button>
                                <button type="button" onClick={() => setRsvpAttend('tidak')}
                                  className={`py-2 rounded-lg text-xs uppercase tracking-wider border font-bold transition-all ${rsvpAttend === 'tidak' ? 'bg-red-700/80 border-red-700/80 text-white' : 'border-[#dad2b9] text-[#5e4e41]'}`}>
                                  Tidak Hadir
                                </button>
                              </div>
                            </div>

                            {rsvpAttend === 'hadir' && (
                              <div>
                                <label className="block text-[11px] uppercase tracking-widest text-[#5e4e41] font-bold mb-1">Jumlah Tamu</label>
                                <select value={rsvpCount} onChange={(e) => setRsvpCount(Number(e.target.value))}
                                  className="w-full bg-white/90 border border-[#dad2b9] text-[#5e4e41] text-sm rounded-lg px-3 py-2 outline-none focus:border-[#a7883b] transition-all">
                                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Orang</option>)}
                                </select>
                              </div>
                            )}

                            <button onClick={() => setRsvpSent(true)}
                              className="w-full bg-[#5e4e41] hover:bg-[#a7883b] text-white text-xs uppercase tracking-widest py-3 rounded-full transition-all duration-300 shadow">
                              Kirim Konfirmasi
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )
            }

            // Gift / Digital Angpao Block
            case 'gift': {
              const accounts = content.accounts || [
                { bank: 'BRI', number: '351301063747538', holder: 'Irjan Priyatno' },
                { bank: 'BRI', number: '363401041570539', holder: 'Yunita Timang' }
              ]

              return (
                <section key={key} className="py-20 px-6 border-b border-[#dad2b9] text-center bg-[#fffff9]/70 relative">
                  <div className="max-w-sm mx-auto">
                    <Gift className="w-10 h-10 text-[#a7883b] mx-auto mb-4" />
                    <span className="text-xs tracking-[0.3em] uppercase text-[#a7883b]">Digital Gift</span>
                    <h2 className="text-3xl font-latin-custom text-[#5e4e41] mt-2 mb-4">Kado Digital</h2>
                    <p className="text-xs text-[#5e4e41] max-w-xs mx-auto leading-relaxed mb-8">Tanpa mengurangi rasa hormat, bagi Anda yang ingin memberikan tanda kasih untuk kedua mempelai secara digital dapat ditransfer ke rekening di bawah ini:</p>

                    <div className="space-y-4">
                      {accounts.map((acc: any, aIdx: number) => (
                        <div key={aIdx} className="bg-white/80 p-6 border border-[#dad2b9] rounded-2xl shadow-sm text-center max-w-xs mx-auto relative overflow-hidden">
                          <p className="text-sm tracking-wider uppercase font-bold text-[#a7883b] mb-1">{acc.bank}</p>
                          <p className="text-xs text-[#5e4e41]/70">a.n. {acc.holder}</p>
                          <div className="py-3 my-3 border-y border-[#dad2b9]/60">
                            <p className="text-xl font-mono tracking-widest font-bold text-[#5e4e41]">{acc.number}</p>
                          </div>
                          
                          <button onClick={() => handleCopyText(acc.number, aIdx)}
                            className="text-xs uppercase tracking-widest font-bold inline-flex items-center gap-1.5 hover:text-[#a7883b] text-[#5e4e41]/80 transition-colors">
                            <Copy className="w-3.5 h-3.5" />
                            {copiedIndex === aIdx ? 'Tersalin' : 'Salin Rekening'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )
            }

            // Closing / Ending Block
            case 'closing':
            case 'thanks': {
              return (
                <section key={key} className="py-24 px-8 text-center bg-cover bg-center relative" style={{ backgroundImage: `url('/themes/aysha/bg-adat.webp')`, backgroundBlendMode: 'overlay', backgroundColor: 'rgba(216,218,215,0.92)' }}>
                  <div className="wave-left w-32 opacity-40 absolute top-4 left-4"><img src="/themes/aysha/flamingo.webp" alt="" /></div>
                  <div className="wave-right w-32 opacity-40 absolute bottom-4 right-4"><img src="/themes/aysha/flamingo.webp" alt="" /></div>

                  <div className="max-w-sm mx-auto">
                    <p className="text-sm italic font-base-custom leading-relaxed text-[#5e4e41] mb-8">
                      "{content.message || 'Demikianlah mereka bukan lagi dua, melainkan satu, karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia. Atas kehadiran dan do’a restunya kami ucapkan terima kasih.'}"
                    </p>

                    <h3 className="text-3xl font-latin-custom text-[#a7883b] mt-4 mb-2">Kami yang berbahagia</h3>
                    <h2 className="text-4xl font-latin-custom text-[#5e4e41] leading-none my-4">{invitation.title}</h2>
                    
                    <p className="mt-16 text-[10px] uppercase tracking-[0.3em] text-[#5e4e41]/50">
                      Wedding Invitation - by Aka Invitation ✨
                    </p>
                  </div>
                </section>
              )
            }

            // Love Story Block
            case 'loveStory': {
              const stories = content.stories || [
                { year: '2022', title: 'Pertama Bertemu', description: 'Pertemuan pertama kami berawal dari perkenalan tidak sengaja di kampus...' },
                { year: '2024', title: 'Jalinan Kasih', description: 'Kami memutuskan untuk melangkah lebih serius dan membangun komitmen bersama...' },
                { year: '2026', title: 'Pernikahan', description: 'Atas restu keluarga, kami melangsungkan upacara suci pernikahan...' }
              ]

              return (
                <section key={key} className="py-20 px-6 border-b border-[#dad2b9] text-center" style={{ backgroundImage: `url('/themes/aysha/bg.webp')` }}>
                  <div className="max-w-sm mx-auto">
                    <span className="text-xs tracking-[0.3em] uppercase text-[#a7883b]">Our Journey</span>
                    <h2 className="text-3xl font-latin-custom text-[#5e4e41] mt-2 mb-10">Love Story</h2>

                    <div className="relative border-l border-[#dad2b9] ml-4 text-left pl-6 space-y-10">
                      {stories.map((story: any, sIdx: number) => (
                        <div key={sIdx} className="relative">
                          <span className="absolute -left-[31px] top-1.5 w-4 h-4 bg-[#a7883b] rounded-full border border-white"></span>
                          <span className="text-xs uppercase tracking-widest font-bold text-[#a7883b]">{story.year}</span>
                          <h4 className="text-lg font-bold text-[#5e4e41] mt-1">{story.title}</h4>
                          <p className="text-xs text-[#5e4e41]/90 leading-relaxed mt-2">{story.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )
            }

            // Dresscode Block
            case 'dresscode': {
              const colors = content.colors || [
                { name: 'Sage Green', hex: '#87A878' },
                { name: 'Cream / Khaki', hex: '#FAF3E0' },
                { name: 'Dusty Rose', hex: '#C4A4A4' }
              ]

              return (
                <section key={key} className="py-16 px-6 border-b border-[#dad2b9] text-center" style={{ backgroundImage: `url('/themes/aysha/bg-waterfall.webp')`, backgroundBlendMode: 'overlay', backgroundColor: 'rgba(255,255,249,0.92)' }}>
                  <div className="max-w-sm mx-auto">
                    <span className="text-xs tracking-[0.3em] uppercase text-[#a7883b]">Dress Code</span>
                    <h2 className="text-2xl font-latin-custom text-[#5e4e41] mt-2 mb-4">{content.sectionTitle || 'Dress Code'}</h2>
                    <p className="text-xs text-[#5e4e41] max-w-xs mx-auto leading-relaxed mb-6">
                      {content.instruction || 'Untuk keindahan dokumentasi, kami mengharapkan Anda mengenakan warna busana berikut:'}
                    </p>

                    <div className="flex justify-center items-center gap-4 mb-6">
                      {colors.map((c: any, cIdx: number) => (
                        <div key={cIdx} className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full border border-[#dad2b9] shadow-sm mb-1.5" style={{ backgroundColor: c.hex }}></div>
                          <span className="text-[10px] uppercase tracking-wider text-[#5e4e41]/80 font-bold">{c.name}</span>
                        </div>
                      ))}
                    </div>

                    {content.avoidColors && (
                      <p className="text-[11px] text-red-800/80 italic mt-2">{content.avoidColors}</p>
                    )}
                  </div>
                </section>
              )
            }

            // Protokol Block
            case 'protokol': {
              const items = content.items || [
                { text: 'Wajib menggunakan masker' },
                { text: 'Menjaga jarak minimal 1 meter' },
                { text: 'Gunakan Hand Sanitizer' }
              ]

              return (
                <section key={key} className="py-16 px-6 border-b border-[#dad2b9] text-center bg-[#fffff9]/80">
                  <div className="max-w-sm mx-auto">
                    <span className="text-xs tracking-[0.3em] uppercase text-[#a7883b]">Protokol</span>
                    <h2 className="text-2xl font-latin-custom text-[#5e4e41] mt-2 mb-6">{content.sectionTitle || 'Protokol Kesehatan'}</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {items.map((item: any, iIdx: number) => (
                        <div key={iIdx} className="bg-white/80 p-4 border border-[#dad2b9] rounded-xl shadow-sm flex flex-col justify-center items-center">
                          <span className="text-[11px] text-[#5e4e41] font-semibold text-center leading-normal">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )
            }

            default:
              return null
          }
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4">
            <button onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            
            <button onClick={() => setLightboxIndex(prev => prev !== null && prev > 0 ? prev - 1 : defaultGallery.length - 1)}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="max-w-3xl max-h-[80vh] overflow-hidden flex items-center justify-center">
              <img src={defaultGallery[lightboxIndex]} alt="Lightbox item" className="max-w-full max-h-[80vh] object-contain rounded-md" />
            </div>

            <button onClick={() => setLightboxIndex(prev => prev !== null && prev < defaultGallery.length - 1 ? prev + 1 : 0)}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return (
    <div className="flex gap-4 justify-center text-[#5e4e41]">
      {[['Hari', time.days], ['Jam', time.hours], ['Menit', time.minutes], ['Detik', time.seconds]].map(([label, val]) => (
        <div key={label as string} className="flex flex-col items-center min-w-[50px]">
          <span className="text-2xl font-bold font-mono">{String(val).padStart(2, '0')}</span>
          <span className="text-[10px] uppercase mt-1 opacity-70">{label}</span>
        </div>
      ))}
    </div>
  )
}
