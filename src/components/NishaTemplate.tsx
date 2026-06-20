'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const P = '/templates/nisha'

interface NishaProps {
  invitation: {
    id: string
    templateSlug?: string
    subdomain?: string
    primaryColor?: string
    headingFont?: string
    bodyFont?: string
    accentFont?: string
    musicUrl?: string | null
    musicEnabled?: boolean
    dateLanguage?: string
    coupleOrder?: string
    editorConfig?: any
    events?: any[]
    bankAccounts?: any[]
    giftItems?: any[]
    showWatermark?: boolean
    endUser?: { role: string; packageStatus: string }
  }
}

const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const DAYS_ID = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
function fmtDate(d: string) {
  const dt = new Date(d)
  return `${DAYS_ID[dt.getDay()]}, ${dt.getDate()} ${MONTHS_ID[dt.getMonth()]} ${dt.getFullYear()}`
}

export default function NishaTemplate({ invitation }: NishaProps) {
  const [liveInvitation, setLiveInvitation] = useState(invitation)

  useEffect(() => {
    setLiveInvitation(invitation)
  }, [invitation])

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'UPDATE_INVITATION' && e.data?.payload) {
        setLiveInvitation(e.data.payload)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const cfg = liveInvitation.editorConfig || {}
  const events = liveInvitation.events || []
  const bankAccounts = liveInvitation.bankAccounts || []

  // Data from editorConfig
  const groomName = cfg.groom?.namaPanggilan || cfg.groom?.namaLengkap || 'Mempelai Pria'
  const brideName = cfg.bride?.namaPanggilan || cfg.bride?.namaLengkap || 'Mempelai Wanita'
  const groomFull = cfg.groom?.namaLengkap || groomName
  const brideFull = cfg.bride?.namaLengkap || brideName
  const groomParents = cfg.groom?.orangTua || ''
  const brideParents = cfg.bride?.orangTua || ''
  const groomIg = cfg.groom?.instagram || ''
  const brideIg = cfg.bride?.instagram || ''
  const coverLabel = cfg.cover?.labelAtas || 'The Wedding Of'
  const coverDate = cfg.cover?.tanggal || (events[0]?.date ? fmtDate(events[0].date) : '')
  const quoteText = cfg.quotes?.kutipan || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.'
  const quoteSource = cfg.quotes?.sumber || 'QS. Ar-Rum: 21'
  const quoteArab = cfg.quotes?.teksArab || ''
  const hashtag = cfg.cover?.hashtag || `#${groomName}${brideName}`
  const musicUrl = liveInvitation.musicUrl || cfg.ui?.musicUrl || `${P}/the-beatles-something.mp3`
  const musicEnabled = liveInvitation.musicEnabled !== false
  const guestName = cfg.cover?.teksKepada || 'Tamu Undangan'
  const closingMsg = cfg.penutup?.message || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.'

  // State
  const [coverOpen, setCoverOpen] = useState(false)
  const [scene, setScene] = useState(0) // 0=cover,1=verse,2=couple,3=events,4=finale
  const [camDir, setCamDir] = useState<'fwd'|'back'>('fwd')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAutoScroll, setIsAutoScroll] = useState(false)
  const [galleryIdx, setGalleryIdx] = useState(0)
  const [copied, setCopied] = useState('')
  const [rsvpForm, setRsvpForm] = useState({ name: '', attendance: 'hadir', guestCount: 1, message: '' })
  const [rsvpSent, setRsvpSent] = useState(false)
  const [rsvpLoading, setRsvpLoading] = useState(false)
  const [wishes, setWishes] = useState<any[]>([])
  const audioRef = useRef<HTMLAudioElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const galleryImages = [
    `${P}/gallery-1.webp`, `${P}/gallery-2.webp`, `${P}/gallery-3.webp`, `${P}/gallery-4.webp`,
    `${P}/gallery-1.webp`, `${P}/gallery-2.webp`, `${P}/gallery-3.webp`,
  ]

  // Scene navigation
  const isAnimating = useRef(false)
  const goScene = useCallback((idx: number) => {
    if (isAnimating.current) return
    isAnimating.current = true
    setTimeout(() => { isAnimating.current = false }, 1200)
    setCamDir(idx > scene ? 'fwd' : 'back')
    setScene(idx)
  }, [scene])

  // Swipe/scroll detection for scene navigation
  const touchStartY = useRef(0)
  const handleWheel = useCallback((e: WheelEvent) => {
    if (isAnimating.current) return
    if (scene < 4 && e.deltaY > 15) goScene(scene + 1)
    else if (scene > 0 && scene < 4 && e.deltaY < -15) goScene(scene - 1)
    else if (scene === 4 && e.deltaY < -15 && scrollRef.current && scrollRef.current.scrollTop <= 5) goScene(3)
  }, [scene, goScene])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (isAnimating.current) return
    const diff = touchStartY.current - e.changedTouches[0].clientY
    if (scene < 4 && diff > 40) goScene(scene + 1)
    else if (scene > 0 && scene < 4 && diff < -40) goScene(scene - 1)
    else if (scene === 4 && diff < -40 && scrollRef.current && scrollRef.current.scrollTop <= 5) goScene(3)
  }, [scene, goScene])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isAnimating.current) return
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      if (scene < 4) {
        e.preventDefault()
        goScene(scene + 1)
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (scene > 0 && scene < 4) {
        e.preventDefault()
        goScene(scene - 1)
      } else if (scene === 4 && scrollRef.current && scrollRef.current.scrollTop <= 5) {
        e.preventDefault()
        goScene(3)
      }
    }
  }, [scene, goScene])

  useEffect(() => {
    if (coverOpen) {
      window.addEventListener('wheel', handleWheel, { passive: true })
      window.addEventListener('touchstart', handleTouchStart, { passive: true })
      window.addEventListener('touchend', handleTouchEnd, { passive: true })
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        window.removeEventListener('wheel', handleWheel)
        window.removeEventListener('touchstart', handleTouchStart)
        window.removeEventListener('touchend', handleTouchEnd)
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [coverOpen, scene, handleWheel, handleTouchStart, handleTouchEnd, handleKeyDown])

  // Auto Scroll logic
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (!isAutoScroll || !coverOpen) {
      if (autoScrollInterval.current) clearInterval(autoScrollInterval.current)
      return
    }

    if (scene < 4) {
      autoScrollInterval.current = setInterval(() => {
        goScene(scene + 1)
      }, 3000)
    } else if (scene === 4) {
      autoScrollInterval.current = setInterval(() => {
        if (scrollRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
          if (scrollTop + clientHeight >= scrollHeight - 2) {
            setIsAutoScroll(false)
          } else {
            scrollRef.current.scrollBy(0, 1)
          }
        }
      }, 16)
    }

    return () => {
      if (autoScrollInterval.current) clearInterval(autoScrollInterval.current)
    }
  }, [isAutoScroll, scene, coverOpen, goScene])

  // Open cover
  const openCover = () => {
    setCoverOpen(true)
    setScene(1)
    if (musicEnabled && audioRef.current) {
      audioRef.current.muted = false
      audioRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  // Music toggle
  const toggleMusic = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.muted = false
      audioRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  // IntersectionObserver for scroll reveal
  useEffect(() => {
    if (!coverOpen || scene !== 4) return
    const els = document.querySelectorAll('[data-io]')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('io-in') })
    }, { threshold: 0.15 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [coverOpen, scene])

  // Load wishes
  useEffect(() => {
    if (!liveInvitation.id) return
    fetch(`/api/v2/invitations/${liveInvitation.id}/rsvp`).then(r => r.json()).then(d => {
      if (d.data) setWishes(d.data.slice(0, 10))
    }).catch(() => {})
  }, [liveInvitation.id])

  // RSVP submit
  const submitRsvp = async (e: React.FormEvent) => {
    e.preventDefault()
    setRsvpLoading(true)
    try {
      await fetch(`/api/v2/invitations/${liveInvitation.id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName: rsvpForm.name, attendance: rsvpForm.attendance, guestCount: rsvpForm.guestCount, message: rsvpForm.message }),
      })
      setRsvpSent(true)
    } catch {} finally { setRsvpLoading(false) }
  }

  const copyAcc = (num: string) => {
    navigator.clipboard.writeText(num)
    setCopied(num)
    setTimeout(() => setCopied(''), 2000)
  }

  // Countdown
  const Countdown = ({ target }: { target: string }) => {
    const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })
    useEffect(() => {
      const u = () => {
        const diff = Math.max(0, new Date(target).getTime() - Date.now())
        setT({ d: Math.floor(diff / 864e5), h: Math.floor((diff / 36e5) % 24), m: Math.floor((diff / 6e4) % 60), s: Math.floor((diff / 1000) % 60) })
      }
      u(); const i = setInterval(u, 1000); return () => clearInterval(i)
    }, [target])
    return <div className="nisha-countdown">{[{l:'Hari',v:t.d},{l:'Jam',v:t.h},{l:'Menit',v:t.m},{l:'Detik',v:t.s}].map((x,i) => <div key={i} className="nisha-cd-cell"><b>{x.v}</b><span>{x.l}</span></div>)}</div>
  }

  // ============= RENDER =============
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Dancing+Script:wght@400;700&family=Jost:wght@300;400;500&display=swap');
        :root {
          --nisha-ink: #f4f1ea;
          --nisha-ink-dim: rgba(244,241,234,0.62);
          --nisha-ink-faint: rgba(244,241,234,0.38);
          --nisha-paper: #070707;
          --nisha-hairline: rgba(244,241,234,0.28);
          --nisha-warm: #f4f1ea;
        }
        .nisha-root { position: relative; width: 100%; min-height: 100dvh; background: var(--nisha-paper); color: var(--nisha-ink); font-family: 'Jost', sans-serif; overflow: hidden; }
        .nisha-stage { position: relative; width: 100%; max-width: 460px; height: 100dvh; margin: 0 auto; overflow: hidden; }
        @media (min-width: 1024px) {
          .nisha-root { display: flex; min-height: 100dvh; }
          .nisha-deskcover { flex: 1; position: relative; overflow: hidden; }
          .nisha-deskcover img { position: absolute; inset: -9%; width: 120%; height: 120%; object-fit: cover; animation: nisha-kenburns 26s ease-in-out infinite alternate; }
          .nisha-deskcover::after { content:''; position:absolute; inset:0; background: linear-gradient(90deg, transparent 60%, var(--nisha-paper)); }
        }
        .nisha-scene { position: absolute; inset: 0; visibility: hidden; pointer-events: none; z-index: 1; perspective: 1500px; }
        .nisha-scene.is-active { visibility: visible; pointer-events: auto; z-index: 2; }
        .nisha-scene.is-leaving { visibility: visible; z-index: 3; }
        .nisha-scene__bg { position: absolute; inset: -9%; overflow: hidden; }
        .nisha-scene__bg img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.12); filter: contrast(1.03) brightness(0.94) saturate(0.94); }
        .nisha-scene__veil { position: absolute; inset: 0; background: linear-gradient(rgba(5,5,5,0.62), rgba(5,5,5,0) 40%, rgba(5,5,5,0.82)); z-index: 1; }
        .nisha-scene__veil--deep { background: linear-gradient(rgba(5,5,5,0.75), rgba(5,5,5,0.2) 50%, rgba(5,5,5,0.88)); }
        .nisha-scene__content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; padding: 0 24px; }
        .label { font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 300; letter-spacing: 0.42em; text-transform: uppercase; color: var(--nisha-ink-dim); }
        .script { font-family: 'Pinyon Script', cursive; font-weight: 400; color: var(--nisha-warm); }
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .serif-i { font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; }
        .hand { font-family: 'Dancing Script', cursive; }

        /* Cover */
        .cover-content { justify-content: space-between; align-items: center; text-align: center; padding-top: 18vh; padding-bottom: 10vh; }
        .cover__names { font-size: clamp(40px, 12vw, 54px); line-height: 1.2; margin: 12px 0; }
        .cover__date { font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--nisha-ink-dim); }
        .cover__guest { margin-top: auto; }
        .cover__guest-name { font-family: 'Cormorant Garamond', serif; font-size: 18px; margin-top: 4px; color: var(--nisha-ink); }
        .btn-open { display: inline-flex; align-items: center; gap: 8px; background: rgba(7,7,7,0.32); border: 1px solid color(srgb 0.96 0.95 0.92 / 0.45); border-radius: 999px; padding: 11px 26px; color: var(--nisha-ink); font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 300; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: all 0.3s; backdrop-filter: blur(8px); }
        .btn-open:hover { background: rgba(244,241,234,0.12); }
        .btn-open svg { width: 16px; height: 16px; }

        /* Verse */
        .verse-content { justify-content: center; align-items: center; text-align: center; gap: 16px; }
        .verse__hashtag { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 15px; color: var(--nisha-ink-dim); }
        .verse__text { font-family: 'Dancing Script', cursive; font-size: clamp(18px, 5vw, 22px); line-height: 1.7; max-width: 340px; color: var(--nisha-ink); }
        .verse__attr { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--nisha-ink-faint); }

        /* Couple */
        .couple-content { justify-content: center; align-items: center; gap: 28px; }
        .couple-card { text-align: center; }
        .couple-card h2 { font-size: clamp(36px, 10vw, 48px); margin-bottom: 4px; }
        .couple-card__full { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: var(--nisha-ink-dim); margin-bottom: 8px; }
        .couple-card__parents { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 13px; line-height: 1.7; color: var(--nisha-ink-dim); }
        .btn-ig { display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; color: var(--nisha-ink-dim); text-decoration: none; font-size: 12px; }
        .btn-ig:hover { color: var(--nisha-ink); }
        .btn-ig svg { width: 16px; height: 16px; }

        /* Events */
        .events-content { justify-content: center; overflow-y: auto; padding-top: 10vh; padding-bottom: 6vh; }
        .events__deck { display: flex; flex-direction: column; gap: 14px; width: 100%; }
        .event-card { padding: 26px 24px; display: flex; flex-direction: column; gap: 9px; text-align: center; background: rgba(7,7,7,0.35); border: 1px solid var(--nisha-hairline); border-radius: 4px; backdrop-filter: blur(6px); }
        .event-card__title { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 400; color: var(--nisha-ink); }
        .rule { display: block; width: 40px; height: 1px; background: var(--nisha-hairline); margin: 4px auto; }
        .event-card__line { font-size: 14px; color: var(--nisha-ink); font-family: 'Cormorant Garamond', serif; }
        .event-card__line--dim { color: var(--nisha-ink-dim); font-size: 13px; }
        .event-card__venue { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14px; color: var(--nisha-ink-dim); }
        .event-card__addr { font-size: 11px; color: var(--nisha-ink-faint); }
        .btn-map { display: inline-flex; align-items: center; gap: 6px; margin-top: 6px; justify-content: center; color: var(--nisha-ink-dim); text-decoration: none; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; }
        .btn-map:hover { color: var(--nisha-ink); }
        .btn-map svg { width: 14px; height: 14px; }
        .event-card__swatches { display: flex; gap: 6px; justify-content: center; margin-top: 8px; }
        .event-card__swatches i { width: 22px; height: 22px; border-radius: 50%; display: block; background: var(--c); border: 1px solid var(--nisha-hairline); }

        /* Finale */
        .finale__bg { position: absolute; inset: 0; z-index: 0; }
        .finale__bg video { width: 100%; height: 100%; object-fit: cover; }
        .finale__hero { min-height: 100dvh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 20px; position: relative; z-index: 2; padding: 24px; }
        .finale__hero h2 { font-size: clamp(36px, 10vw, 48px); }
        .nisha-countdown { display: flex; gap: 12px; align-items: center; }
        .nisha-cd-cell { text-align: center; }
        .nisha-cd-cell b { display: block; font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300; color: var(--nisha-ink); }
        .nisha-cd-cell span { font-size: 8.5px; letter-spacing: 2.55px; text-transform: uppercase; color: var(--nisha-ink-faint); }
        .finale__cal { margin-top: 8px; }

        /* Scrollable sheet */
        .finale__scroll { height: 100dvh; overflow-y: auto; scrollbar-width: none; position: relative; z-index: 2; }
        .finale__scroll::-webkit-scrollbar { display: none; }
        .sheet { padding: 48px 26px 0; }

        /* Love Story */
        .story__heading { font-size: clamp(36px, 11vw, 48px); text-align: center; margin-bottom: 32px; }
        .story__item { display: flex; gap: 16px; margin-bottom: 36px; opacity: 0; transform: translateY(26px); transition: opacity 0.8s cubic-bezier(0.2,0.7,0.2,1), transform 0.8s; }
        .story__item.io-in, .story__item--alt.io-in { opacity: 1; transform: translateY(0); }
        .story__item--alt { flex-direction: row-reverse; }
        .story__photo { flex: 0 0 42%; aspect-ratio: 3/4; overflow: hidden; border-radius: 2px; padding: 5px; box-shadow: 0 14px 30px rgba(0,0,0,0.5); }
        .story__photo img { width: 100%; height: 100%; object-fit: cover; }
        .story__detail { flex: 0 0 50%; padding-top: 8px; }
        .story__title { font-family: 'Cormorant Garamond', serif; font-size: clamp(19px, 5.2vw, 23px); color: var(--nisha-ink); margin-bottom: 8px; }
        .story__text { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 15px; line-height: 1.7; color: var(--nisha-ink-dim); }

        /* Gallery */
        .gallery__title { font-size: clamp(36px, 11vw, 48px); text-align: center; margin-bottom: 24px; }
        .carousel { position: relative; width: 100%; height: 360px; margin-bottom: 24px; touch-action: pan-y; }
        .carousel__stage { position: absolute; inset: 0; }
        .carousel__item { position: absolute; left: 50%; top: 50%; width: 60%; aspect-ratio: 3/4; border-radius: 2px; overflow: hidden; transform: translate(-50%, -50%); transition: transform 0.55s cubic-bezier(0.2,0.7,0.2,1), opacity 0.55s; cursor: grab; }
        .carousel__item img { width: 100%; height: 100%; object-fit: cover; }
        .gallery__quote-wrap { text-align: center; margin: 24px 0; }
        .gallery__quote { font-family: 'Dancing Script', cursive; font-size: clamp(16px, 4.5vw, 20px); line-height: 1.7; color: var(--nisha-ink); max-width: 340px; margin: 0 auto; }
        .gallery__quote-sign { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14px; color: var(--nisha-ink-dim); margin-top: 12px; }

        /* RSVP */
        .nisha-rsvp-heading { font-size: clamp(36px, 11vw, 48px); text-align: center; margin-bottom: 24px; }
        .tpl-rsvp { max-width: 440px; margin: 0 auto; }
        .tpl-rsvp__form { display: flex; flex-direction: column; gap: 12px; }
        .tpl-rsvp__field { display: flex; flex-direction: column; gap: 4px; }
        .tpl-rsvp__field label { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--nisha-ink-faint); }
        .tpl-rsvp__input, .tpl-rsvp__select, .tpl-rsvp__textarea { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.14); border-radius: 0; padding: 13px 16px; color: var(--nisha-ink); font-family: 'Cormorant Garamond', serif; font-size: 16px; outline: none; }
        .tpl-rsvp__input:focus, .tpl-rsvp__textarea:focus { border-color: var(--nisha-ink-dim); }
        .tpl-rsvp__textarea { resize: none; min-height: 80px; }
        .tpl-rsvp__counter { font-size: 10px; color: var(--nisha-ink-faint); text-align: right; }
        .tpl-rsvp__choices { display: flex; gap: 8px; flex-wrap: wrap; }
        .tpl-rsvp__choice-input { display: none; }
        .tpl-rsvp__choice-label { display: block; padding: 8px 16px; border: 1px solid var(--nisha-hairline); border-radius: 999px; font-size: 13px; cursor: pointer; transition: all 0.2s; color: var(--nisha-ink-dim); }
        .tpl-rsvp__choice-input:checked + .tpl-rsvp__choice-label { background: rgba(244,241,234,0.12); border-color: var(--nisha-ink); color: var(--nisha-ink); }
        .tpl-rsvp__submit { display: block; width: 100%; margin-top: 8px; background: rgba(7,7,7,0.32); border: 1px solid color(srgb 0.96 0.95 0.92 / 0.45); border-radius: 999px; padding: 11px 26px; color: var(--nisha-ink); font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 300; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; backdrop-filter: blur(8px); }
        .tpl-rsvp__submit:hover { background: rgba(244,241,234,0.12); }
        .tpl-rsvp__wishes { margin-top: 32px; }
        .tpl-rsvp__wishes-label { font-size: 9px; letter-spacing: 0.42em; text-transform: uppercase; color: var(--nisha-ink-faint); margin-bottom: 16px; }
        .tpl-rsvp__wish { padding: 14px 0; border-bottom: 1px solid var(--nisha-hairline); }
        .tpl-rsvp__wish-header { display: flex; justify-content: space-between; align-items: center; }
        .tpl-rsvp__wish-name { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: var(--nisha-ink); }
        .tpl-rsvp__wish-date { font-size: 11px; color: var(--nisha-ink-faint); }
        .tpl-rsvp__wish-status { display: inline-block; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 10px; border-radius: 999px; margin: 6px 0; }
        .tpl-rsvp__wish-status--hadir { background: rgba(74,222,128,0.15); color: #4ade80; }
        .tpl-rsvp__wish-status--tidak { background: rgba(248,113,113,0.15); color: #f87171; }
        .tpl-rsvp__wish-status--ragu { background: rgba(250,204,21,0.15); color: #facc15; }
        .tpl-rsvp__wish-message { font-size: 13px; color: var(--nisha-ink-dim); line-height: 1.5; }

        /* Gift */
        .gift__intro { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14px; line-height: 1.7; color: var(--nisha-ink-dim); text-align: center; max-width: 380px; margin: 0 auto 18px; }
        .gift__open { margin: 0 auto; display: flex; }
        .gift__accounts { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
        .gift__acc-card { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.14); }
        .gift__acc-card p:first-child { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: var(--nisha-ink); }
        .gift__acc-card p:nth-child(2) { font-size: 11px; color: var(--nisha-ink-faint); }
        .gift__acc-card p:nth-child(3) { font-family: monospace; font-size: 14px; color: var(--nisha-ink); margin-top: 4px; }
        .gift__copy { background: rgba(244,241,234,0.1); border: 1px solid var(--nisha-hairline); border-radius: 999px; padding: 6px 14px; color: var(--nisha-ink-dim); font-size: 11px; cursor: pointer; }
        .gift__copy:hover { background: rgba(244,241,234,0.18); }

        /* Closing */
        .closing-portrait { position: relative; text-align: center; margin-top: 40px; }
        .closing-flowers { position: absolute; top: -48px; left: -20px; width: 116px; transform: rotate(-26deg); filter: drop-shadow(0 8px 20px rgba(0,0,0,0.5)); pointer-events: none; }
        .polaroid { display: inline-block; padding: 8px 8px 32px; background: #f5f0e8; box-shadow: 0 14px 30px rgba(0,0,0,0.5); }
        .polaroid img { width: 200px; aspect-ratio: 3/4; object-fit: cover; }
        .closing-names { font-size: clamp(46px, 14vw, 58px); margin-top: 16px; transform: rotate(-3deg); }
        .heart-line { width: 240px; margin: 24px auto; color: var(--nisha-ink-dim); }
        .sheet__pray { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14px; line-height: 1.7; color: var(--nisha-ink-dim); text-align: center; max-width: 360px; margin: 0 auto; }
        .sheet__tag { font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--nisha-ink-dim); text-align: center; margin: 24px 0; }
        .sheet__footer { text-align: center; padding: 32px 0 48px; }
        .sheet__footer p { font-size: 10px; color: var(--nisha-ink-faint); }

        /* Music button */
        .nisha-music { position: fixed; bottom: 24px; right: 16px; z-index: 100; width: 44px; height: 44px; background: rgba(7,7,7,0.5); border: 1px solid var(--nisha-hairline); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(8px); }
        .nisha-vinyl { width: 26px; height: 26px; border-radius: 50%; background: radial-gradient(circle, #333 20%, #111 21%, #111 40%, #333 41%, #333 60%, #111 61%); position: relative; }
        .nisha-vinyl.spinning { animation: vinylSpin 2s linear infinite; }
        .nisha-vinyl::after { content:''; position: absolute; top: 50%; left: 50%; width: 6px; height: 6px; border-radius: 50%; background: var(--nisha-ink); transform: translate(-50%, -50%); }

        /* Swipe hint */
        .nisha-hint { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 10; display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .nisha-hint__line { width: 1px; height: 32px; background: var(--nisha-hairline); animation: hintBounce 1.8s ease-in-out infinite; }
        .nisha-hint .label { font-size: 8px; color: var(--nisha-ink-faint); }

        /* Grain overlay */
        .nisha-grain { position: fixed; inset: 0; z-index: 999; pointer-events: none; opacity: 0.03; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

        /* Watermark */
        .nisha-watermark { text-align: center; padding: 16px 0 24px; }
        .nisha-watermark a { display: inline-block; background: rgba(255,255,255,0.06); border: 1px solid var(--nisha-hairline); border-radius: 999px; padding: 6px 16px; text-decoration: none; }
        .nisha-watermark span:first-child { font-size: 10px; color: var(--nisha-ink-faint); }
        .nisha-watermark span:last-child { font-size: 10px; font-weight: 600; color: #4ade80; margin-left: 4px; }

        /* Animations */
        @keyframes nisha-kenburns { 0% { transform: scale(1.12) translate(0,0); } 100% { transform: scale(1.22) translate(-1%, -1.5%); } }
        @keyframes vinylSpin { to { transform: rotate(360deg); } }
        @keyframes hintBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes nisha-rise { 0% { opacity: 0; transform: translateY(40px) scale(0.96); filter: blur(6px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
        @keyframes nisha-cam-in { 0% { transform: scale(1.05); filter: blur(4px); opacity: 0.6; } 100% { transform: scale(1); filter: blur(0); opacity: 1; } }
        @keyframes nisha-cam-out { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(0.95); opacity: 0; } }
        @keyframes reveal { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }

        .anim-rise { animation: nisha-rise 1.2s cubic-bezier(0.2,0.7,0.2,1) both; }
        .anim-cam-in { animation: nisha-cam-in 0.8s ease-out both; }
        .anim-cam-out { animation: nisha-cam-out 0.6s ease-in both; }
        .reveal { opacity: 0; animation: reveal 0.8s ease-out both; }
        .reveal-d1 { animation-delay: 0.2s; }
        .reveal-d2 { animation-delay: 0.45s; }
        .reveal-d3 { animation-delay: 0.7s; }
        .reveal-d4 { animation-delay: 1s; }
        .reveal-d5 { animation-delay: 1.25s; }
        .io-in { opacity: 1 !important; transform: translateY(0) scale(1) !important; filter: blur(0) !important; }

        [data-io] { opacity: 0; transform: translateY(54px) scale(0.97); filter: blur(6px); transition: opacity 1.1s cubic-bezier(0.16,0.84,0.34,1), transform 1.2s cubic-bezier(0.16,0.84,0.34,1); }

        @media (min-width: 1024px) {
          .nisha-root { display: flex; }
          .nisha-deskcover { display: block !important; flex: 1; position: relative; overflow: hidden; }
          .nisha-deskcover img { position: absolute; inset: -9%; width: 120%; height: 120%; object-fit: cover; animation: nisha-kenburns 26s ease-in-out infinite alternate; }
          .nisha-deskcover::after { content:''; position:absolute; inset:0; background: linear-gradient(90deg, transparent 60%, var(--nisha-paper)); }
        }
      `}</style>

      <div className="nisha-root">
        {/* Audio */}
        {musicEnabled && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

        {/* Desktop sidecover */}
        <aside className="nisha-deskcover" style={{ display: 'none' }}>
          <img src={`${P}/gallery-1.webp`} alt="" />
        </aside>

        {/* Stage */}
        <div className="nisha-stage">

          {/* ===== SCENE 0: COVER ===== */}
          <div className={`nisha-scene ${!coverOpen ? 'is-active' : 'is-leaving'}`} style={{ zIndex: !coverOpen ? 2 : 1 }}>
            <div className="nisha-scene__bg"><img src={`${P}/cover.webp`} alt="" style={{ animation: 'nisha-kenburns 26s ease-in-out infinite alternate' }} /></div>
            <div className="nisha-scene__veil" />
            <div className="nisha-scene__content cover-content">
              <div>
                <p className="label reveal reveal-d1">{coverLabel}</p>
                <h1 className="cover__names script reveal reveal-d2">{groomName} &amp; {brideName}</h1>
                {coverDate && <p className="cover__date reveal reveal-d3">{coverDate}</p>}
              </div>
              <div className="cover__bottom" style={{ marginTop: 'auto' }}>
                <div className="cover__guest reveal reveal-d4">
                  <p className="label">Kepada Yth.</p>
                  <p className="cover__guest-name">{guestName}</p>
                </div>
                <button className="btn-open reveal reveal-d5" onClick={openCover}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="2.5" y="5.5" width="19" height="13" rx="1.5" /><path d="M3 6.5l9 7 9-7" /></svg>
                  <span>Buka Undangan</span>
                </button>
              </div>
            </div>
          </div>

          {/* ===== SCENE 1: VERSE ===== */}
          {coverOpen && (
            <div className={`nisha-scene ${scene === 1 ? 'is-active anim-cam-in' : ''}`}>
              <div className="nisha-scene__bg"><img src={`${P}/verse.webp`} alt="" style={{ transformOrigin: '50% 30%', animation: 'nisha-kenburns 26s ease-in-out infinite alternate' }} /></div>
              <div className="nisha-scene__veil nisha-scene__veil--deep" />
              <div className="nisha-scene__content verse-content">
                <p className="verse__hashtag serif-i reveal reveal-d1">{hashtag}</p>
                <blockquote className="verse__text hand reveal reveal-d2">{quoteText}</blockquote>
                {quoteArab && <p className="serif reveal reveal-d2" style={{ fontSize: 18, color: 'var(--nisha-ink-dim)', direction: 'rtl' as any }}>{quoteArab}</p>}
                <p className="label verse__attr reveal reveal-d3">{quoteSource}</p>
              </div>
              <div className="nisha-hint" onClick={() => goScene(scene + 1)} style={{ cursor: 'pointer' }}>
                <div className="nisha-hint__line" />
                <p className="label">Swipe Up</p>
              </div>
            </div>
          )}

          {/* ===== SCENE 2: COUPLE ===== */}
          {coverOpen && (
            <div className={`nisha-scene ${scene === 2 ? 'is-active anim-cam-in' : ''}`}>
              <div className="nisha-scene__bg"><img src={`${P}/couple.webp`} alt="" style={{ animation: 'nisha-kenburns 26s ease-in-out infinite alternate' }} /></div>
              <div className="nisha-scene__veil" />
              <div className="nisha-scene__content couple-content">
                <article className="couple-card">
                  <h2 className="script">{groomName}</h2>
                  <p className="couple-card__full serif">{groomFull}</p>
                  {groomParents && <p className="couple-card__parents">{groomParents}</p>}
                  {groomIg && <a className="btn-ig" href={`https://instagram.com/${groomIg.replace('@','')}`} target="_blank"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /></svg><span>{groomIg}</span></a>}
                </article>
                <article className="couple-card">
                  <h2 className="script">{brideName}</h2>
                  <p className="couple-card__full serif">{brideFull}</p>
                  {brideParents && <p className="couple-card__parents">{brideParents}</p>}
                  {brideIg && <a className="btn-ig" href={`https://instagram.com/${brideIg.replace('@','')}`} target="_blank"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /></svg><span>{brideIg}</span></a>}
                </article>
              </div>
            </div>
          )}

          {/* ===== SCENE 3: EVENTS ===== */}
          {coverOpen && (
            <div className={`nisha-scene ${scene === 3 ? 'is-active anim-cam-in' : ''}`}>
              <div className="nisha-scene__bg"><img src={`${P}/events.webp`} alt="" style={{ animation: 'nisha-kenburns 26s ease-in-out infinite alternate' }} /></div>
              <div className="nisha-scene__veil" />
              <div className="nisha-scene__content events-content">
                <div className="events__deck">
                  {events.map((ev: any, i: number) => (
                    <article className="event-card" key={i}>
                      <h3 className="event-card__title">{ev.eventName}</h3>
                      <span className="rule" />
                      <p className="event-card__line">{fmtDate(ev.date)}</p>
                      <p className="event-card__line event-card__line--dim">{ev.startTime} - {ev.endTime} {ev.timezone || 'WIB'}</p>
                      {ev.venue && <p className="event-card__venue">{ev.venue}</p>}
                      {ev.address && <p className="event-card__addr">{ev.address}</p>}
                      {ev.mapsUrl && <a className="btn-map" href={ev.mapsUrl} target="_blank"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg><span>Lihat Lokasi</span></a>}
                    </article>
                  ))}
                  {events.length === 0 && (
                    <article className="event-card">
                      <h3 className="event-card__title">Acara Pernikahan</h3>
                      <span className="rule" />
                      <p className="event-card__line">Segera diumumkan</p>
                    </article>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== SCENE 4: FINALE ===== */}
          {coverOpen && (
            <div 
              className={`nisha-scene ${scene === 4 ? 'is-active anim-cam-in' : ''}`}
              style={{ overflowY: scene === 4 ? 'auto' : 'hidden', overflowX: 'hidden' }}
              ref={scrollRef}
            >
              <div className="finale__bg" style={{ position: 'sticky', top: 0, height: '100dvh' }}>
                <video id="nishaFinaleVideo" src={`${P}/parallax-overlay.mp4`} muted loop autoPlay playsInline preload="auto" />
              </div>
              <div className="nisha-scene__veil nisha-scene__veil--deep" style={{ position: 'sticky', top: 0, height: '100dvh', marginTop: '-100dvh' }} />

              {/* Hero: Countdown */}
              <div className="finale__hero" style={{ marginTop: '-100dvh' }}>
                <p className="label reveal reveal-d1">Menghitung Hari</p>
                <h2 className="script reveal reveal-d2">Save the Date</h2>
                <div className="reveal reveal-d3">
                  {events[0]?.date ? <Countdown target={events[0].date} /> : <Countdown target={new Date(Date.now() + 90 * 864e5).toISOString()} />}
                </div>
                <button className="btn-open finale__cal reveal reveal-d4" onClick={() => {
                  if (scrollRef.current) scrollRef.current.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })
                }} style={{ pointerEvents: 'auto' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></svg>
                  <span>Lihat Selengkapnya</span>
                </button>
              </div>

              {/* Scrollable sheet */}
              <div className="finale__scroll" style={{ height: 'auto', overflowY: 'visible', marginTop: 0 }}>
                <div className="sheet">

                  {/* Love Story */}
                  <section data-io="true">
                    <h3 className="script story__heading">Love Story</h3>
                    <div className="story">
                      {[
                        { img: `${P}/gallery-1.webp`, title: 'Pertama Bertemu', text: 'Dua jalan yang berbeda dipertemukan dalam satu waktu yang terasa begitu tepat.' },
                        { img: `${P}/gallery-2.webp`, title: 'Merajut Cerita', text: 'Hari demi hari kami lalui bersama, menumbuhkan rasa yang semakin dalam.' },
                        { img: `${P}/gallery-3.webp`, title: 'Sebuah Janji', text: 'Sebuah pertanyaan sederhana, dan jawaban iya yang mengubah segalanya.' },
                        { img: `${P}/gallery-4.webp`, title: 'Menuju Janji Suci', text: 'Dengan penuh keyakinan, kami melangkah menuju jenjang yang lebih suci.' },
                      ].map((s, i) => (
                        <article key={i} className={`story__item${i % 2 ? ' story__item--alt' : ''}`} data-io="true">
                          <figure className="story__photo"><img src={s.img} alt="" loading="lazy" /></figure>
                          <div className="story__detail">
                            <h4 className="story__title">{s.title}</h4>
                            <p className="story__text">{s.text}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  {/* Gallery */}
                  <section data-io="true" style={{ marginTop: 40 }}>
                    <h3 className="script gallery__title">Our Moments</h3>
                    <div className="carousel">
                      <div className="carousel__stage">
                        {galleryImages.map((src, i) => {
                          const offset = i - galleryIdx
                          const abs = Math.abs(offset)
                          const scale = abs === 0 ? 1 : abs === 1 ? 0.74 : abs === 2 ? 0.52 : 0.45
                          const opacity = abs === 0 ? 1 : abs === 1 ? 0.9 : abs === 2 ? 0.38 : 0
                          const x = offset * 35
                          return (
                            <figure key={i} className="carousel__item" style={{
                              transform: `translate(-50%, -50%) translateX(${x}%) scale(${scale})`,
                              opacity,
                              zIndex: abs === 0 ? 30 : abs === 1 ? 20 : abs === 2 ? 10 : 0,
                              filter: abs === 0 ? 'brightness(1) saturate(1)' : 'brightness(0.7) saturate(0.94)',
                            }}>
                              <img src={src} alt="" loading="lazy" />
                            </figure>
                          )
                        })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
                      <button onClick={() => setGalleryIdx(Math.max(0, galleryIdx - 1))} className="btn-open" style={{ padding: '8px 16px', fontSize: 8 }}>&lsaquo;</button>
                      <span style={{ fontSize: 12, color: 'var(--nisha-ink-dim)', alignSelf: 'center' }}>{galleryIdx + 1} / {galleryImages.length}</span>
                      <button onClick={() => setGalleryIdx(Math.min(galleryImages.length - 1, galleryIdx + 1))} className="btn-open" style={{ padding: '8px 16px', fontSize: 8 }}>&rsaquo;</button>
                    </div>
                    <div className="gallery__quote-wrap">
                      <blockquote className="gallery__quote">Dari setiap sudut dunia yang kami singgahi, hatiku selalu menemukan jalan pulang — padamu.</blockquote>
                      <p className="gallery__quote-sign">{groomName} &amp; {brideName}</p>
                    </div>
                  </section>

                  {/* RSVP */}
                  <section data-io="true" style={{ marginTop: 40 }}>
                    <h3 className="script nisha-rsvp-heading">RSVP &amp;<br />Ucapan</h3>
                    <div className="tpl-rsvp">
                      {rsvpSent ? (
                        <div style={{ textAlign: 'center', padding: '32px 0' }}>
                          <p style={{ fontSize: 18, color: 'var(--nisha-ink)', marginBottom: 8 }}>Terima kasih!</p>
                          <p style={{ fontSize: 13, color: 'var(--nisha-ink-dim)' }}>Doa dan kehadiran Anda sangat berarti bagi kami</p>
                        </div>
                      ) : (
                        <form className="tpl-rsvp__form" onSubmit={submitRsvp}>
                          <div className="tpl-rsvp__field">
                            <label>Nama</label>
                            <input className="tpl-rsvp__input" type="text" placeholder="Masukkan nama Anda" value={rsvpForm.name} onChange={e => setRsvpForm({ ...rsvpForm, name: e.target.value })} required />
                          </div>
                          <div className="tpl-rsvp__field">
                            <label>Konfirmasi Kehadiran</label>
                            <div className="tpl-rsvp__choices">
                              {['hadir', 'tidak', 'ragu'].map(v => (
                                <span key={v}>
                                  <input type="radio" id={`att-${v}`} className="tpl-rsvp__choice-input" name="att" value={v} checked={rsvpForm.attendance === v} onChange={() => setRsvpForm({ ...rsvpForm, attendance: v })} />
                                  <label htmlFor={`att-${v}`} className="tpl-rsvp__choice-label">{v === 'hadir' ? 'Hadir' : v === 'tidak' ? 'Tidak Hadir' : 'Masih Ragu'}</label>
                                </span>
                              ))}
                            </div>
                          </div>
                          {rsvpForm.attendance === 'hadir' && (
                            <div className="tpl-rsvp__field">
                              <label>Jumlah Tamu</label>
                              <select className="tpl-rsvp__select" value={rsvpForm.guestCount} onChange={e => setRsvpForm({ ...rsvpForm, guestCount: +e.target.value })}>
                                {[1,2,3].map(n => <option key={n} value={n}>{n} Orang</option>)}
                              </select>
                            </div>
                          )}
                          <div className="tpl-rsvp__field">
                            <label>Doa &amp; Ucapan</label>
                            <textarea className="tpl-rsvp__textarea" placeholder="Tulis doa & ucapan untuk kedua mempelai..." maxLength={1000} value={rsvpForm.message} onChange={e => setRsvpForm({ ...rsvpForm, message: e.target.value })} />
                            <p className="tpl-rsvp__counter">{rsvpForm.message.length}/1000</p>
                          </div>
                          <button type="submit" className="tpl-rsvp__submit" disabled={rsvpLoading || !rsvpForm.name}>
                            {rsvpLoading ? 'Mengirim...' : 'Kirim Ucapan'}
                          </button>
                        </form>
                      )}
                      {wishes.length > 0 && (
                        <div className="tpl-rsvp__wishes">
                          <p className="tpl-rsvp__wishes-label">Wishes</p>
                          {wishes.map((w: any, i: number) => (
                            <div key={i} className="tpl-rsvp__wish">
                              <div className="tpl-rsvp__wish-header">
                                <div className="tpl-rsvp__wish-name">{w.guestName}</div>
                                <div className="tpl-rsvp__wish-date">{new Date(w.createdAt).toLocaleDateString('id-ID')}</div>
                              </div>
                              <div className={`tpl-rsvp__wish-status tpl-rsvp__wish-status--${w.attendance}`}>
                                {w.attendance === 'hadir' ? 'Hadir' : w.attendance === 'tidak_hadir' ? 'Tidak Hadir' : 'Masih Ragu'}
                              </div>
                              {w.message && <div className="tpl-rsvp__wish-message">{w.message}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Gift */}
                  {bankAccounts.length > 0 && (
                    <section data-io="true" style={{ marginTop: 40 }}>
                      <h3 className="script story__heading">Tanda Kasih</h3>
                      <p className="gift__intro">Doa restu Anda sudah lebih dari cukup. Jika berkenan memberi hadiah, kami telah menyiapkan amplop digital di bawah ini.</p>
                      <div className="gift__accounts">
                        {bankAccounts.map((acc: any) => (
                          <div key={acc.id} className="gift__acc-card">
                            <div>
                              <p>{acc.bankName}</p>
                              <p>{acc.accountName}</p>
                              <p>{acc.accountNumber}</p>
                            </div>
                            <button className="gift__copy" onClick={() => copyAcc(acc.accountNumber)}>
                              {copied === acc.accountNumber ? '✓ Tersalin' : 'Salin'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Closing */}
                  <section className="sheet__closing" data-io="true">
                    <div className="closing-portrait">
                      <img className="closing-flowers" src={`${P}/flower.webp`} alt="" />
                      <figure className="polaroid">
                        <img src={`${P}/gallery-1.webp`} alt={`${groomName} & ${brideName}`} loading="lazy" />
                      </figure>
                      <p className="closing-names script">{groomName} &amp; {brideName}</p>
                    </div>
                    <p className="sheet__pray">{closingMsg}</p>
                    <svg className="heart-line" viewBox="0 0 240 54" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 30 C 50 22 80 24 99 29" opacity=".7" />
                      <path d="M120 42 C 112 32 99 28 99 19.5 C 99 13.5 107.5 12.5 111.5 17.5 C 114.5 20.5 117.5 22.5 120 26.5 C 122.5 22.5 125.5 20.5 128.5 17.5 C 132.5 12.5 141 13.5 141 19.5 C 141 28 128 32 120 42 Z" />
                      <path d="M141 29 C 166 23 196 22 224 27.5 C 233 29 234 22.5 229 21 C 225.5 20 224 23.5 227 25.5" opacity=".7" />
                    </svg>
                    <p className="sheet__tag">{hashtag}</p>
                  </section>

                  {/* Footer */}
                  <footer className="sheet__footer">
                    <p>Digital Wedding Invitation © {new Date().getFullYear()}</p>
                  </footer>

                  {/* Watermark */}
                  {liveInvitation.showWatermark && (
                    <div className="nisha-watermark">
                      <a href="/">
                        <span>Powered by</span>
                        <span>Katalog Undangan</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Grain overlay */}
          <div className="nisha-grain" />
        </div>

        {/* Music player */}
        {coverOpen && musicEnabled && (
          <button className="nisha-music" onClick={toggleMusic} aria-label="Toggle music">
            <div className={`nisha-vinyl${isPlaying ? ' spinning' : ''}`} />
          </button>
        )}

        {/* Auto Scroll button */}
        {coverOpen && cfg.ui?.autoScroll && (
          <button 
            className="nisha-music" 
            style={{ bottom: musicEnabled ? 76 : 24, zIndex: 101, background: 'rgba(244,241,234,0.1)', borderColor: 'rgba(244,241,234,0.4)', color: 'rgba(244,241,234,0.9)' }} 
            onClick={() => setIsAutoScroll(!isAutoScroll)} 
            aria-label="Toggle auto scroll"
          >
            {isAutoScroll ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
        )}
      </div>
    </>
  )
}
