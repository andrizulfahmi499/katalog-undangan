'use client'

import { useState, useEffect, useRef } from 'react'
import { parseEditorConfig } from '@/lib/invitationEditorConfig'

interface CoreliTemplateProps {
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
}

const IMG = '/templates/corelia/images/'

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function AnimDiv({ className, anim, children, style }: { className?: string; anim: string; children: React.ReactNode; style?: React.CSSProperties }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className={className} style={style}>
      <div className={inView ? anim : 'opacity-0'} style={{ animationFillMode: 'forwards' }}>
        {children}
      </div>
    </div>
  )
}

function Countdown({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
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
    <div className="flex gap-4 justify-center text-[#FEFBF0]">
      {[['Days', time.days], ['Hours', time.hours], ['Minutes', time.minutes], ['Seconds', time.seconds]].map(([label, val]) => (
        <div key={label as string} className="flex flex-col items-center min-w-[60px]">
          <span className="font-outfit text-[36px] md:text-[48px] font-light leading-none">{String(val).padStart(2, '0')}</span>
          <span className="font-outfit text-[10px] uppercase tracking-widest mt-1 opacity-80">{label}</span>
        </div>
      ))}
    </div>
  )
}

export default function CoreliTemplate({ invitation, formattedDate }: CoreliTemplateProps) {
  const [isOpened, setIsOpened] = useState(false)
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpAttend, setRsvpAttend] = useState('hadir')
  const [rsvpMsg, setRsvpMsg] = useState('')
  const [rsvpSent, setRsvpSent] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const cfg = parseEditorConfig(invitation.editorConfig)
  const sec = (id: string) => cfg.sections.find((s) => s.id === id)?.content ?? {}

  const opening = sec('opening')
  const groomSec = sec('groom')
  const brideSec = sec('bride')
  const eventSec = sec('event')
  const giftSec = sec('gift')
  const thanksSec = sec('thanks')
  const countdownSec = sec('countdown')

  const [groomName, brideName] = invitation.title.split(/\s*&\s*/).map((n) => n.trim())
  const guestName = invitation.assignedMember?.name || 'Tamu Undangan'
  const targetDate = countdownSec.targetDate || invitation.eventDate?.toString() || ''

  const fonts = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700&family=Cormorant+Upright:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
    @font-face { font-family: 'Cloudy Aurora'; src: url('/templates/corelia/fonts/Cloudy%20Aurora%20Serif-s.p.d8e8ab59.otf') format('opentype'); font-weight: normal; }
    @font-face { font-family: 'Canela Thin'; src: url('/templates/corelia/fonts/Canela_Thin_Trial-s.p.eea79f83.otf') format('opentype'); font-weight: 100; }
    @font-face { font-family: 'Channe'; src: url('/templates/corelia/fonts/Channe-s.p.4f49e234.otf') format('opentype'); }
    @font-face { font-family: 'Perpetua'; src: url('/templates/corelia/fonts/Perpetua%20Regular-s.p.724c7637.otf') format('opentype'); }
    @font-face { font-family: 'Thesignature'; src: url('/templates/corelia/fonts/Thesignature-s.p.0f1f5ff4.otf') format('opentype'); }
    @keyframes zoomIn { 0%{opacity:0;transform:scale(.8)} to{opacity:1;transform:scale(1)} }
    @keyframes fadeUp { 0%{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeDown { 0%{opacity:0;transform:translateY(-100px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeRight { 0%{opacity:0;transform:translateX(-50px)} to{opacity:1;transform:translateX(0)} }
    @keyframes fadeLeft { 0%{opacity:0;transform:translateX(50px)} to{opacity:1;transform:translateX(0)} }
    .coreli-zoom-in { animation: 1s forwards zoomIn; }
    .coreli-fade-up { animation: 1.5s forwards fadeUp; }
    .coreli-fade-down { animation: 1.5s forwards fadeDown; }
    .coreli-fade-right { animation: 1.5s forwards fadeRight; }
    .coreli-fade-left { animation: 1.5s forwards fadeLeft; }
  `

  if (!isOpened) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: fonts }} />
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url('${IMG}bg-hero-mobile.png')`, backgroundColor: '#3B3B3B' }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: '#000000B5' }} />
          <div className="relative z-10 text-center px-6 coreli-zoom-in" style={{ animationFillMode: 'forwards' }}>
            <p className="font-outfit font-extralight text-[11px] uppercase tracking-[0.3em] text-[#FEFBF0] mb-3">
              {opening.subtitle || 'The Wedding Of'}
            </p>
            <h1
              className="text-[48px] md:text-[72px] leading-none uppercase text-[#FEFBF0] mb-4"
              style={{ fontFamily: "'Cloudy Aurora', serif" }}
            >
              {opening.title || invitation.title}
            </h1>
            <p className="font-outfit font-light text-[11px] uppercase tracking-[0.2em] text-[#FEFBF0] mb-2">
              {formattedDate}
            </p>
            <p className="font-outfit text-[12px] text-[#FEFBF0] mb-1 mt-4">
              Dear Mr./Mrs./Ms.
            </p>
            <p className="font-outfit text-[15px] capitalize text-[#FEFBF0] mb-6">{guestName}</p>
            <button
              onClick={() => setIsOpened(true)}
              className="font-outfit uppercase text-[11px] tracking-widest px-10 py-3 border border-[#FEFBF0] text-[#FEFBF0] hover:bg-[#FEFBF0] hover:text-[#3B3B3B] transition-colors duration-300"
            >
              Open Invitation
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fonts }} />
      <div className="w-full" style={{ backgroundColor: '#FEFBF0', color: '#3B3B3B' }}>

        {/* HERO */}
        <section
          className="relative w-full h-screen bg-cover bg-center"
          style={{ backgroundImage: `url('${IMG}bg-hero-mobile.png')` }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: '#000000B5' }} />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div
              className="text-center text-[#FEFBF0] w-[290px] md:w-[480px] py-[60px] px-6 coreli-zoom-in"
              style={{ backgroundColor: 'rgba(254,251,240,0.08)', animationFillMode: 'forwards' }}
            >
              <p className="font-outfit font-extralight text-[10px] uppercase tracking-[0.3em]">we invite you to celebrate</p>
              <h2
                className="text-[28px] md:text-[46px] leading-none uppercase mt-3"
                style={{ fontFamily: "'Cloudy Aurora', serif" }}
              >
                {groomName} &amp; {brideName}
              </h2>
              <p className="font-outfit font-extralight text-[10px] uppercase tracking-[0.2em] mt-3">{formattedDate}</p>
              <p className="font-outfit text-[12px] mt-6">Dear Mr./Mrs./Ms.</p>
              <p className="font-outfit text-[14px] capitalize mt-1">{guestName}</p>
              <p className="font-outfit font-extralight text-[9px] mt-4 opacity-80">
                We sincerely apologize<br />for any misspelling of names or titles
              </p>
              <button
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="font-outfit uppercase text-[10px] tracking-widest mt-6 px-8 py-2 border border-[#FEFBF0] text-[#FEFBF0] hover:bg-[#FEFBF0] hover:text-[#3B3B3B] transition-colors duration-300"
              >
                open invitation
              </button>
            </div>
          </div>
        </section>

        {/* COUPLE */}
        <section className="py-16 px-6 max-w-2xl mx-auto text-center">
          <AnimDiv anim="coreli-fade-down">
            <p className="font-outfit text-[10px] uppercase tracking-[0.4em] text-[#3B3B3B] opacity-60 mb-2">bismillahirrahmanirrahim</p>
            <p className="font-outfit text-[11px] leading-relaxed text-[#3B3B3B] opacity-70 mb-8 max-w-sm mx-auto">
              Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.
            </p>
          </AnimDiv>
          <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
            {/* Groom */}
            <AnimDiv anim="coreli-fade-right" className="flex flex-col items-center">
              <div className="w-[160px] h-[200px] overflow-hidden mb-4">
                <img src={`${IMG}img-profile-cornel.png`} alt="Groom" className="w-full h-full object-cover" />
              </div>
              <p className="font-outfit text-[9px] uppercase tracking-[0.3em] opacity-60 mb-1">The Groom</p>
              <h3 className="text-[22px] leading-tight" style={{ fontFamily: "'Cloudy Aurora', serif" }}>
                {groomSec.name || groomName}
              </h3>
              <p className="font-outfit text-[11px] text-center opacity-70 mt-2 max-w-[200px]">{groomSec.parents || ''}</p>
              {groomSec.instagram && (
                <a href={groomSec.instagram} target="_blank" rel="noreferrer" className="font-outfit text-[10px] mt-1 opacity-50 hover:opacity-100">@instagram</a>
              )}
            </AnimDiv>

            <div className="text-[32px] opacity-30" style={{ fontFamily: "'Thesignature', cursive" }}>&amp;</div>

            {/* Bride */}
            <AnimDiv anim="coreli-fade-left" className="flex flex-col items-center">
              <div className="w-[160px] h-[200px] overflow-hidden mb-4">
                <img src={`${IMG}img-profile-tiara.png`} alt="Bride" className="w-full h-full object-cover" />
              </div>
              <p className="font-outfit text-[9px] uppercase tracking-[0.3em] opacity-60 mb-1">The Bride</p>
              <h3 className="text-[22px] leading-tight" style={{ fontFamily: "'Cloudy Aurora', serif" }}>
                {brideSec.name || brideName}
              </h3>
              <p className="font-outfit text-[11px] text-center opacity-70 mt-2 max-w-[200px]">{brideSec.parents || ''}</p>
              {brideSec.instagram && (
                <a href={brideSec.instagram} target="_blank" rel="noreferrer" className="font-outfit text-[10px] mt-1 opacity-50 hover:opacity-100">@instagram</a>
              )}
            </AnimDiv>
          </div>
        </section>

        {/* OUR STORY */}
        <section className="py-12 px-6 max-w-2xl mx-auto">
          <AnimDiv anim="coreli-fade-up" className="text-center mb-8">
            <p className="font-outfit text-[9px] uppercase tracking-[0.4em] opacity-50 mb-1">our</p>
            <h2 className="text-[32px]" style={{ fontFamily: "'Cloudy Aurora', serif" }}>Story</h2>
          </AnimDiv>
          <div className="grid grid-cols-2 gap-4">
            <AnimDiv anim="coreli-fade-right">
              <img src={`${IMG}img-our-story-1.png`} alt="Our Story 1" className="w-full h-[260px] object-cover" />
            </AnimDiv>
            <AnimDiv anim="coreli-fade-left">
              <img src={`${IMG}img-our-story-2.png`} alt="Our Story 2" className="w-full h-[260px] object-cover" />
            </AnimDiv>
          </div>
        </section>

        {/* EVENT / ACARA */}
        <section className="py-16 px-6 max-w-lg mx-auto text-center">
          <AnimDiv anim="coreli-fade-up">
            <p className="font-outfit text-[9px] uppercase tracking-[0.4em] opacity-50 mb-1">save the</p>
            <h2 className="text-[32px] mb-8" style={{ fontFamily: "'Cloudy Aurora', serif" }}>Date</h2>
            <div className="border border-[#3B3B3B]/20 p-8">
              <p className="font-outfit text-[10px] uppercase tracking-[0.3em] opacity-60 mb-2">{eventSec.eventTitle || invitation.eventName}</p>
              <p className="font-outfit text-[13px] font-medium mb-1">{eventSec.date || formattedDate}</p>
              <p className="font-outfit text-[12px] opacity-70 mb-4">{eventSec.time || ''}</p>
              <div className="w-8 h-px bg-[#3B3B3B]/30 mx-auto mb-4" />
              <p className="font-outfit text-[13px] font-medium mb-1">{eventSec.venue || invitation.location}</p>
              <p className="font-outfit text-[11px] opacity-60">{eventSec.address || ''}</p>
            </div>
          </AnimDiv>
        </section>

        {/* COUNTING DOWN */}
        <section
          className="py-20 px-6 bg-cover bg-center relative"
          style={{ backgroundImage: `url('${IMG}bg-counting-down-mobile.png')` }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: '#000000B5' }} />
          <div className="relative z-10 text-center">
            <AnimDiv anim="coreli-fade-up">
              <p className="font-outfit text-[9px] uppercase tracking-[0.4em] text-[#FEFBF0] opacity-70 mb-2">counting down</p>
              <h2 className="text-[28px] mb-8 text-[#FEFBF0]" style={{ fontFamily: "'Cloudy Aurora', serif" }}>
                {groomName} &amp; {brideName}
              </h2>
              <Countdown targetDate={targetDate} />
            </AnimDiv>
          </div>
        </section>

        {/* GALLERY */}
        <section className="py-16 px-4 max-w-2xl mx-auto">
          <AnimDiv anim="coreli-fade-up" className="text-center mb-8">
            <p className="font-outfit text-[9px] uppercase tracking-[0.4em] opacity-50 mb-1">our</p>
            <h2 className="text-[32px]" style={{ fontFamily: "'Cloudy Aurora', serif" }}>Gallery</h2>
          </AnimDiv>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <div
                key={n}
                className="overflow-hidden cursor-pointer aspect-square"
                onClick={() => setLightbox(`${IMG}img-gallery-${n}.png`)}
              >
                <img
                  src={`${IMG}img-gallery-${n}.png`}
                  alt={`Gallery ${n}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* LIGHTBOX */}
        {lightbox && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80"
            onClick={() => setLightbox(null)}
          >
            <img src={lightbox} alt="Gallery" className="max-w-[90vw] max-h-[90vh] object-contain" />
          </div>
        )}

        {/* LOCATION */}
        <section
          className="py-20 px-6 bg-cover bg-center relative"
          style={{ backgroundImage: `url('${IMG}bg-location-mobile.png')` }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: '#000000B5' }} />
          <div className="relative z-10 text-center text-[#FEFBF0]">
            <AnimDiv anim="coreli-fade-up">
              <p className="font-outfit text-[9px] uppercase tracking-[0.4em] opacity-70 mb-1">our</p>
              <h2 className="text-[28px] mb-4" style={{ fontFamily: "'Cloudy Aurora', serif" }}>Location</h2>
              <p className="font-outfit text-[13px] font-medium mb-1">{eventSec.venue || invitation.location}</p>
              <p className="font-outfit text-[11px] opacity-70 mb-6">{eventSec.address || ''}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent((eventSec.venue || '') + ' ' + (eventSec.address || ''))}`}
                target="_blank"
                rel="noreferrer"
                className="font-outfit text-[10px] uppercase tracking-widest border border-[#FEFBF0] px-8 py-2 hover:bg-[#FEFBF0] hover:text-[#3B3B3B] transition-colors duration-300"
              >
                Open Maps
              </a>
            </AnimDiv>
          </div>
        </section>

        {/* RSVP */}
        <section className="py-16 px-6 max-w-md mx-auto text-center">
          <AnimDiv anim="coreli-fade-up">
            <p className="font-outfit text-[9px] uppercase tracking-[0.4em] opacity-50 mb-1">kindly</p>
            <h2 className="text-[32px] mb-8" style={{ fontFamily: "'Cloudy Aurora', serif" }}>RSVP</h2>
            {rsvpSent ? (
              <p className="font-outfit text-[13px] opacity-70">Terima kasih atas konfirmasi Anda!</p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setRsvpSent(true) }}
                className="flex flex-col gap-4 text-left"
              >
                <input
                  type="text"
                  placeholder="Nama Anda"
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  required
                  className="font-outfit text-[12px] border border-[#3B3B3B]/30 bg-transparent px-4 py-3 outline-none focus:border-[#3B3B3B] placeholder-[#3B3B3B]/40"
                />
                <select
                  value={rsvpAttend}
                  onChange={(e) => setRsvpAttend(e.target.value)}
                  className="font-outfit text-[12px] border border-[#3B3B3B]/30 bg-[#FEFBF0] px-4 py-3 outline-none"
                >
                  <option value="hadir">Hadir</option>
                  <option value="tidak">Tidak Hadir</option>
                  <option value="mungkin">Mungkin Hadir</option>
                </select>
                <textarea
                  placeholder="Pesan / Ucapan (opsional)"
                  value={rsvpMsg}
                  onChange={(e) => setRsvpMsg(e.target.value)}
                  rows={3}
                  className="font-outfit text-[12px] border border-[#3B3B3B]/30 bg-transparent px-4 py-3 outline-none focus:border-[#3B3B3B] placeholder-[#3B3B3B]/40 resize-none"
                />
                <button
                  type="submit"
                  className="font-outfit text-[11px] uppercase tracking-widest border border-[#3B3B3B] py-3 hover:bg-[#3B3B3B] hover:text-[#FEFBF0] transition-colors duration-300"
                >
                  Kirim Konfirmasi
                </button>
              </form>
            )}
          </AnimDiv>
        </section>

        {/* WEDDING GIFT */}
        <section className="py-16 px-6 max-w-md mx-auto text-center" style={{ backgroundColor: '#F5F0E0' }}>
          <AnimDiv anim="coreli-fade-up">
            <p className="font-outfit text-[9px] uppercase tracking-[0.4em] opacity-50 mb-1">wedding</p>
            <h2 className="text-[32px] mb-8" style={{ fontFamily: "'Cloudy Aurora', serif" }}>Gift</h2>
            <div className="border border-[#3B3B3B]/20 p-8">
              <p className="font-outfit text-[10px] uppercase tracking-[0.3em] opacity-60 mb-3">{giftSec.bankName || 'BCA'}</p>
              <p className="font-outfit text-[20px] font-medium tracking-widest mb-2">{giftSec.accountNumber || '—'}</p>
              <p className="font-outfit text-[11px] opacity-60 mb-6">a.n. {giftSec.accountName || `${groomName} & ${brideName}`}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(giftSec.accountNumber || '')
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="font-outfit text-[10px] uppercase tracking-widest border border-[#3B3B3B] px-8 py-2 hover:bg-[#3B3B3B] hover:text-[#FEFBF0] transition-colors duration-300"
              >
                {copied ? 'Tersalin!' : 'Salin Nomor'}
              </button>
            </div>
          </AnimDiv>
        </section>

        {/* FOOTER */}
        <section className="relative">
          <img src={`${IMG}img-footer.png`} alt="Footer" className="w-full object-cover" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ backgroundColor: '#000000B5' }}>
            <p className="font-outfit text-[9px] uppercase tracking-[0.4em] text-[#FEFBF0] opacity-70 mb-2">thank you</p>
            <h2
              className="text-[32px] md:text-[48px] text-[#FEFBF0] mb-4"
              style={{ fontFamily: "'Cloudy Aurora', serif" }}
            >
              {thanksSec.groomName || groomName} &amp; {thanksSec.brideName || brideName}
            </h2>
            <p className="font-outfit text-[11px] text-[#FEFBF0] opacity-80 max-w-xs leading-relaxed">
              {thanksSec.message || "Atas kehadiran dan do'a restunya kami ucapkan terima kasih."}
            </p>
            <p className="font-outfit text-[9px] uppercase tracking-widest text-[#FEFBF0] opacity-40 mt-8">
              Katalog Undangan &copy; {new Date().getFullYear()}
            </p>
          </div>
        </section>

      </div>
    </>
  )
}
