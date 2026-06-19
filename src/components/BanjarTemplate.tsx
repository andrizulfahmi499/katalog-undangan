'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useParallax, ParallaxState } from '@/hooks/useParallax'
import { parseEditorConfig } from '@/lib/invitationEditorConfig'

/* ─── Helpers ─── */
function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

type Props = {
  invitation: any
  formattedDate: string
  editable?: boolean
  /** Pass a ref to the outer frame when rendering inside a preview container */
  frameRef?: React.RefObject<HTMLElement | null>
}

/* ─── Social Icon SVGs ─── */
function SocialIcon({ name }: { name: string }) {
  const size = 18
  switch (name) {
    case 'instagram': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
    case 'facebook': return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
    case 'youtube': return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff"/></svg>
    case 'spotify': return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M16.5 16.5a.75.75 0 01-1.03.28c-2.25-1.37-5.08-1.68-8.41-.92a.75.75 0 11-.34-1.46c3.73-.85 6.88-.48 9.5 1.07a.75.75 0 01.28 1.03zm1.08-2.37a.94.94 0 01-1.29.35c-2.57-1.58-6.49-2.04-9.52-1.12a.94.94 0 11-.54-1.8c3.48-1.06 7.8-.55 10.78 1.28a.94.94 0 01.57 1.29zm.1-2.49c-3.08-1.83-8.16-2-11.1-1.1a1.12 1.12 0 11-.65-2.15c3.39-1.03 9-0.85 12.57 1.28a1.12 1.12 0 01-1.82 1.97z" fill="#fff"/></svg>
    case 'tiktok': return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.15V11.7a4.83 4.83 0 01-3.77-1.24V6.69h3.77z"/></svg>
    case 'whatsapp': return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.214l-.29-.174-3.01.893.834-2.94-.19-.3A8 8 0 1112 20z"/></svg>
    default: return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
  }
}

/* ═══════════════════════════════════════════════════
   BANJAR 3D PARALLAX TEMPLATE
   Faithful React port of the Laxy Motions Banjar template
   ═══════════════════════════════════════════════════ */
export default function BanjarTemplate({ invitation, formattedDate, editable, frameRef }: Props) {
  const ec = parseEditorConfig(invitation.editorConfig)
  const sections = ec.sections
  const ui = ec.ui

  const [groomName, brideName] = (invitation.title || '— & —').split(/\s*&\s*/).map((n: string) => n.trim())
  const [initials] = useState(() => {
    const g = groomName?.[0] || '—'
    const b = brideName?.[0] || '—'
    return `${g} & ${b}`
  })

  // Section helpers
  const sec = (id: string) => sections.find(s => s.id === id)
  const isOn = (id: string) => sec(id)?.enabled !== false
  const content = (id: string) => sec(id)?.content || {}

  // Splash state
  const [splashVisible, setSplashVisible] = useState(true)
  const [coverVisible, setCoverVisible] = useState(false)
  const [parallaxActive, setParallaxActive] = useState(false)

  // Audio
  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioPlaying, setAudioPlaying] = useState(false)

  // Parallax engine
  const { containerRef, state, open, worldTransform, curtainTransforms, heroOpacity } = useParallax(frameRef)

  // Countdown
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [countdownPassed, setCountdownPassed] = useState(false)

  // Guest name from URL
  const [guestName, setGuestName] = useState('Tamu Undangan')

  // RSVP
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false)
  const [rsvpForm, setRsvpForm] = useState({ nama: '', kehadiran: '', jumlah: 1, pesan: '' })

  // Wishes
  const [wishes, setWishes] = useState<any[]>([])
  const [wishesLoading, setWishesLoading] = useState(false)

  // Kado Digital toggle
  const [showRekening, setShowRekening] = useState(false)

  // Scroll reveal
  const revealRefs = useRef<Set<HTMLElement>>(new Set())

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const to = params.get('to')
    if (to) setGuestName(decodeURIComponent(to))
  }, [])

  useEffect(() => {
    const targetDate = content('countdown')?.targetDate || invitation.eventDate
    const target = new Date(targetDate).getTime()
    function update() {
      const now = Date.now()
      const dist = target - now
      if (dist <= 0) {
        setCountdownPassed(true)
        return
      }
      setCountdown({
        days: Math.floor(dist / 86400000),
        hours: Math.floor((dist % 86400000) / 3600000),
        minutes: Math.floor((dist % 3600000) / 60000),
        seconds: Math.floor((dist % 60000) / 1000),
      })
    }
    update()
    const iv = setInterval(update, 1000)
    return () => clearInterval(iv)
  }, [invitation.eventDate])

  // Scroll reveal observer
  useEffect(() => {
    if (!parallaxActive) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('revealed')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [parallaxActive])

  // Load wishes
  useEffect(() => {
    if (!invitation?.id) return
    setWishesLoading(true)
    fetch(`/api/wishes/${invitation.id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setWishes(d.data || []) })
      .catch(() => {})
      .finally(() => setWishesLoading(false))
  }, [invitation?.id])

  const handleOpenInvitation = useCallback(() => {
    setSplashVisible(false)
    setCoverVisible(true)
    if (audioRef.current) {
      audioRef.current.play().then(() => setAudioPlaying(true)).catch(() => {})
    }
  }, [])

  const handleOpenParallax = useCallback(() => {
    setCoverVisible(false)
    setParallaxActive(true)
    open()
  }, [open])

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (audioPlaying) {
      audioRef.current.pause()
      setAudioPlaying(false)
    } else {
      audioRef.current.play().then(() => setAudioPlaying(true)).catch(() => {})
    }
  }

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!invitation?.id) return
    try {
      const res = await fetch(`/api/rsvp/${invitation.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpForm),
      })
      if (res.ok) setRsvpSubmitted(true)
    } catch {}
  }

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!invitation?.id || !rsvpForm.nama || !rsvpForm.pesan) return
    try {
      const res = await fetch(`/api/wishes/${invitation.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: rsvpForm.nama, message: rsvpForm.pesan, attendance: rsvpForm.kehadiran || 'hadir' }),
      })
      if (res.ok) {
        const d = await res.json()
        if (d.data) setWishes(prev => [d.data, ...prev])
      }
    } catch {}
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
  }

  // Parallax layer transforms based on scroll progress
  const layerStyle = useCallback((
    st: ParallaxState,
    config: { depth?: number; startP?: number; endP?: number; scaleFrom?: number; scaleTo?: number; yFrom?: number; yTo?: number; opacityFrom?: number; opacityTo?: number; fadeIn?: boolean; fadeOut?: boolean }
  ): React.CSSProperties => {
    const depth = config.depth ?? 0
    const startP = config.startP ?? 0
    const endP = config.endP ?? 1
    const p = clamp((st.progress - startP) / (endP - startP), 0, 1)
    const scaleFrom = config.scaleFrom ?? 1
    const scaleTo = config.scaleTo ?? 1
    const scale = lerp(scaleFrom, scaleTo, p)
    const yFrom = config.yFrom ?? 0
    const yTo = config.yTo ?? 0
    const ty = lerp(yFrom, yTo, p) + st.ry * depth
    const tx = st.rx * depth
    let opacity = 1
    if (config.fadeIn) opacity = clamp(p / 0.15, 0, 1)
    if (config.fadeOut && p > 0.7) opacity = clamp(1 - (p - 0.7) / 0.3, 0, 1)
    if (config.opacityFrom !== undefined && config.opacityTo !== undefined) {
      opacity = lerp(config.opacityFrom, config.opacityTo, p)
    }
    return {
      transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`,
      opacity,
    }
  }, [])

  // Progress bar segments
  const progressSegments = useMemo(() => [0, 0.2, 0.4, 0.6, 0.8], [])

  // Event data
  const eventData = content('event')
  const groomData = content('groom')
  const brideData = content('bride')
  const giftData = content('gift')
  const thanksData = content('thanks')
  const openingData = content('opening')
  const quoteData = content('quotes')
  const yangMengundangData = content('yangMengundang')
  const turutMengundangData = content('turutMengundang')

  const pad = (n: number) => String(n).padStart(2, '0')

  const css = parallaxCSS(!!frameRef)

  return (
    <>
      <style jsx global>{css}</style>

      {/* Audio */}
      <audio ref={audioRef} loop preload="none" src={ui.musicUrl || undefined} />

      {/* Audio toggle */}
      {parallaxActive && (
        <button className="audio-toggle" onClick={toggleAudio} aria-label="Toggle musik">
          <span className={`bar ${audioPlaying ? '' : 'flat'}`} />
          <span className={`bar ${audioPlaying ? '' : 'flat'}`} />
          <span className={`bar ${audioPlaying ? '' : 'flat'}`} />
          <span className={`bar ${audioPlaying ? '' : 'flat'}`} />
        </button>
      )}

      <div className={`app-container${frameRef ? ' banjar-root' : ''}`} ref={containerRef}>
        {/* ═══ SPLASH SCREEN ═══ */}
        {splashVisible && (
          <div className="splash-screen">
            <div className="splash-overlay" />
            <div className="splash-content">
              <div className="splash-gold-lines">
                <span /><span />
              </div>
              <p className="splash-label">{openingData.subtitle || 'The Wedding Of'}</p>
              <h1 className="splash-names">{groomName} &amp; {brideName}</h1>
              <div className="splash-separator">✦</div>
              <p className="splash-date">{formattedDate}</p>
              <div className="splash-bottom">
                <p className="splash-to">Kepada Yth.</p>
                <p className="splash-tamu-nama">{guestName}</p>
                <button className="btn-open" onClick={handleOpenInvitation}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  BUKA UNDANGAN
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ COVER SECTION ═══ */}
        {coverVisible && !parallaxActive && (
          <div className="cover-section" onClick={handleOpenParallax}>
            <div className="splash-overlay" />
            <div className="cover-content">
              <p className="splash-label">{openingData.subtitle || 'The Wedding Of'}</p>
              <h1 className="cover-inisial">{initials}</h1>
              <div className="splash-separator">✦</div>
              <p className="splash-date">{formattedDate}</p>
              <p className="splash-to" style={{ marginTop: '2rem' }}>KETUK ATAU GULIR UNTUK LANJUT</p>
            </div>
          </div>
        )}

        {/* ═══ PARALLAX STAGE (Zone A) ═══ */}
        {parallaxActive && (
          <>
            <div className="parallax-stage">
              {/* Background layer */}
              <div className="layer layer--background" style={layerStyle(state, { depth: 2, scaleFrom: 1, scaleTo: 1.18 })}>
                <img src="/templates/banjar/images/background-img.webp" alt="" />
              </div>

              {/* Progress Bar */}
              <div className="stage-progress">
                {progressSegments.map((start, i) => {
                  const end = i < 4 ? progressSegments[i + 1] : 1
                  const segP = clamp((state.progress - start) / (end - start), 0, 1)
                  return (
                    <div className="stage-progress__segment" key={i}>
                      <div className="stage-progress__fill" style={{ width: `${segP * 100}%` }} />
                    </div>
                  )
                })}
              </div>

              {/* Stage Header */}
              <div className="layer layer--stage-header" style={{ opacity: heroOpacity(state) }}>
                <div className="stage-header-content">
                  <p className="stage-header__label">The Wedding Of</p>
                  <h1 className="stage-header__names">{groomName} &amp; {brideName}</h1>
                  <div className="stage-header__separator">✦</div>
                  <p className="stage-header__date">{formattedDate}</p>
                </div>
              </div>

              {/* Cover Image */}
              <div className="layer layer--cover-img" style={layerStyle(state, { depth: 4, startP: 0, endP: 0.3, scaleFrom: 1, scaleTo: 1.1, yFrom: 0, yTo: -30, fadeOut: true })}>
                <img src="/templates/banjar/images/cover-img.webp" alt="" />
              </div>

              {/* Couple Image */}
              <div className="layer layer--couple" style={layerStyle(state, { depth: 5, startP: 0.05, endP: 0.35, scaleFrom: 0.9, scaleTo: 1.15, yFrom: 40, yTo: -20, fadeIn: true, fadeOut: true })}>
                <img src="/templates/banjar/images/couple-img.webp" alt="" />
              </div>

              {/* Mempelai gradient */}
              <div className="layer layer--mempelai-gradient" style={layerStyle(state, { depth: 0, startP: 0.25, endP: 0.5, opacityFrom: 0, opacityTo: 1 })} />

              {/* Verse / Quote */}
              {isOn('quotes') && (
                <div className="layer layer--verse" style={layerStyle(state, { depth: 6, startP: 0.12, endP: 0.35, yFrom: 60, yTo: 0, fadeIn: true, fadeOut: true })}>
                  <blockquote className="verse">
                    <span className="verse__hashtag">#{groomName.replace(/\s/g,'')}{brideName.replace(/\s/g,'')}</span>
                    <span className="verse__text">{quoteData.verse || ''}</span>
                    {quoteData.source && <span className="verse__source">{quoteData.source}</span>}
                  </blockquote>
                </div>
              )}

              {/* Groom Info */}
              {isOn('groom') && (
                <div className="layer layer--info-groom" style={layerStyle(state, { depth: 7, startP: 0.3, endP: 0.5, yFrom: 80, yTo: 0, fadeIn: true, fadeOut: true })}>
                  <div className="info-card">
                    <h2 className="info-card__name-script">{groomData.name || groomName}</h2>
                    <p className="info-card__label">PUTRA PERTAMA DARI</p>
                    <p className="info-card__parents">{groomData.parents || ''}</p>
                    <div className="info-card__social">
                      {['instagram','facebook','youtube','spotify','tiktok','whatsapp'].map(s => (
                        <a key={s} className="social-icon" href="#" aria-label={s}>
                          <SocialIcon name={s} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bride Info */}
              {isOn('bride') && (
                <div className="layer layer--info-bride" style={layerStyle(state, { depth: 7, startP: 0.4, endP: 0.6, yFrom: 80, yTo: 0, fadeIn: true, fadeOut: true })}>
                  <div className="info-card">
                    <h2 className="info-card__name-script">{brideData.name || brideName}</h2>
                    <p className="info-card__label">PUTRI KEEMPAT DARI</p>
                    <p className="info-card__parents">{brideData.parents || ''}</p>
                    <div className="info-card__social">
                      {['instagram','facebook','youtube','spotify','tiktok','whatsapp'].map(s => (
                        <a key={s} className="social-icon" href="#" aria-label={s}>
                          <SocialIcon name={s} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Events */}
              {isOn('event') && (
                <div className="layer layer--info-events" style={layerStyle(state, { depth: 7, startP: 0.55, endP: 0.75, yFrom: 80, yTo: 0, fadeIn: true, fadeOut: true })}>
                  <div className="acara-group">
                    <div className="acara-card">
                      <div className="acara-card__line" />
                      <h3 className="acara-card__title">Akad Nikah</h3>
                      <div className="acara-card__diamond">◆</div>
                      <p className="acara-card__date">{eventData.date || formattedDate}</p>
                      <p className="acara-card__time">{eventData.akadTime || eventData.time || ''}</p>
                      <p className="acara-card__venue">{eventData.akadVenue || eventData.venue || invitation.location}</p>
                      {eventData.address && <p className="acara-card__address">{eventData.address}</p>}
                      {eventData.mapsUrl && <a className="acara-maps-btn" href={eventData.mapsUrl} target="_blank" rel="noopener noreferrer">Google Maps</a>}
                      <div className="acara-card__line" />
                    </div>
                    <div className="acara-card">
                      <div className="acara-card__line" />
                      <h3 className="acara-card__title">Resepsi</h3>
                      <div className="acara-card__diamond">◆</div>
                      <p className="acara-card__date">{eventData.date || formattedDate}</p>
                      <p className="acara-card__time">{eventData.time || ''}</p>
                      <p className="acara-card__venue">{eventData.venue || invitation.location}</p>
                      {eventData.address && <p className="acara-card__address">{eventData.address}</p>}
                      {eventData.mapsUrl && <a className="acara-maps-btn" href={eventData.mapsUrl} target="_blank" rel="noopener noreferrer">Google Maps</a>}
                      <div className="acara-card__line" />
                    </div>
                  </div>
                </div>
              )}

              {/* Countdown */}
              {isOn('countdown') && (
                <div className="layer layer--info-countdown" style={layerStyle(state, { depth: 7, startP: 0.7, endP: 0.9, yFrom: 80, yTo: 0, fadeIn: true })}>
                  <div className="countdown-panel">
                    <h2 className="countdown__heading">Hari Bahagia Kami</h2>
                    <div className="countdown__gold-sep" />
                    {countdownPassed ? (
                      <p className="countdown-passed">Alhamdulillah, acara telah terlaksana</p>
                    ) : (
                      <div className="countdown__grid">
                        <div className="countdown__unit"><span className="countdown__value">{pad(countdown.days)}</span><span className="countdown__label">HARI</span></div>
                        <div className="countdown__unit"><span className="countdown__value">{pad(countdown.hours)}</span><span className="countdown__label">JAM</span></div>
                        <div className="countdown__unit"><span className="countdown__value">{pad(countdown.minutes)}</span><span className="countdown__label">MENIT</span></div>
                        <div className="countdown__unit"><span className="countdown__value">{pad(countdown.seconds)}</span><span className="countdown__label">DETIK</span></div>
                      </div>
                    )}
                    <p className="countdown__desc">Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami.</p>
                    {eventData.liveUrl && (
                      <a className="btn-live-streaming" href={eventData.liveUrl} target="_blank" rel="noopener noreferrer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        Live Streaming
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Semak decorations */}
              <div className="layer layer--semak layer--semak-left" style={layerStyle(state, { depth: 10, startP: 0.1, endP: 0.5, yFrom: 0, yTo: -20, fadeIn: true, fadeOut: true })}>
                <img src="/templates/banjar/images/semak-img.webp" alt="" />
              </div>
              <div className="layer layer--semak layer--semak-right" style={layerStyle(state, { depth: 10, startP: 0.1, endP: 0.5, yFrom: 0, yTo: -20, fadeIn: true, fadeOut: true })}>
                <img src="/templates/banjar/images/semak-img.webp" alt="" />
              </div>

              {/* Outro couple */}
              <div className="layer layer--outro-couple" style={layerStyle(state, { depth: 3, startP: 0.85, endP: 1, yFrom: 60, yTo: 0, fadeIn: true })}>
                <img src="/templates/banjar/images/couple-img.webp" alt="" />
                <div className="outro-scroll-hint">
                  <span className="outro-scroll-hint__text">Gulir tuk lanjutkan</span>
                  <div className="outro-scroll-hint__arrow">↓</div>
                </div>
              </div>

              {/* Swipe hint */}
              <div className="swipe-hint" style={{ opacity: clamp(1 - state.progress / 0.1, 0, 1) }}>
                <span className="swipe-hint__arrow-wrap"><span className="swipe-hint__arrow" /></span>
                <span className="swipe-hint__text">Ketuk atau Gulir untuk lanjut</span>
              </div>
            </div>

            {/* ═══ SCROLL OVERLAY ═══ */}
            <div className="scroll-overlay">
              <div className="scroll-gap" /><div className="scroll-gap" /><div className="scroll-gap" />
              <div className="scroll-gap" /><div className="scroll-gap" /><div className="scroll-gap" />

              {/* ═══ ZONE B: POST-IMMERSIVE ═══ */}
              <div className="post-immersive">
                <main className="banjar-container">

                  {/* Love Story */}
                  {isOn('story') && (
                    <section className="section section-warm">
                      <h2 className="section-title reveal">Love Story</h2>
                      <div className="section-ornament reveal" />
                      <div className="story-timeline reveal">
                        <div className="story-line" />
                        {[
                          { year: '2018', title: 'Pertama Bertemu', desc: 'Kami pertama kali bertemu di sebuah acara keluarga besar.', img: '/templates/banjar/images/cover-img.webp' },
                          { year: '2019', title: 'Mulai Dekat', desc: 'Hubungan kami semakin dekat dan saling mengenal satu sama lain.', img: '/templates/banjar/images/couple-img.webp' },
                          { year: '2022', title: 'Lamaran', desc: 'Dengan bismillah, kami memutuskan untuk melangkah ke jenjang yang lebih serius.', img: '/templates/banjar/images/cover-img.webp' },
                          { year: '2024', title: 'Menuju Halal', desc: 'Insya Allah kami akan melangsungkan pernikahan.', img: '/templates/banjar/images/couple-img.webp' },
                        ].map((item, i) => (
                          <div key={i} className={`story-node ${i % 2 === 0 ? 'story-node--left' : 'story-node--right'}`}>
                            <div className="story-marker">
                              <span className="story-marker__dot" />
                            </div>
                            <span className="story-year">{item.year}</span>
                            <div className="story-card">
                              <img className="story-photo" src={item.img} alt={item.title} />
                              <div className="story-text">
                                <h4>{item.title}</h4>
                                <p>{item.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Gallery */}
                  {isOn('gallery') && (
                    <section className="section">
                      <h2 className="section-title reveal">Galeri</h2>
                      <div className="section-ornament reveal" />
                      <div className="galeri-container reveal">
                        <div className="galeri-video">
                          <div className="galeri-video__badge">4K</div>
                          <div className="galeri-video__play">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          </div>
                          <img src="/templates/banjar/images/cover-img.webp" alt="Video thumbnail" className="galeri-video__thumb" />
                        </div>
                        <div className="galeri-photos">
                          {['cover-img.webp','couple-img.webp','cover-img.webp','couple-img.webp','cover-img.webp'].map((img, i) => (
                            <div key={i} className="galeri-thumb">
                              <img src={`/templates/banjar/images/${img}`} alt={`Gallery ${i + 1}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Live Streaming */}
                  {isOn('live') && (
                    <section className="section section-warm">
                      <h2 className="section-title reveal">Live Streaming</h2>
                      <div className="section-ornament reveal" />
                      <div className="reveal">
                        <p style={{ fontStyle: 'italic', color: 'var(--color-text-light)' }}>
                          Link live streaming akan ditampilkan di sini.
                        </p>
                      </div>
                    </section>
                  )}

                  {/* Kado Digital */}
                  {isOn('gift') && (
                    <section className="section">
                      <h2 className="section-title reveal">Kado Digital</h2>
                      <div className="section-ornament reveal" />
                      <div className="reveal">
                        <button className="btn-rekening" onClick={() => setShowRekening(!showRekening)}>
                          {showRekening ? 'SEMBUNYIKAN REKENING' : 'TAMPILKAN REKENING'}
                        </button>
                        {showRekening && (
                          <div className="bank-card">
                            <div className="bank-card__badge-row">
                              <span className="bank-card__badge">{giftData.bankName || 'BCA'}</span>
                            </div>
                            <div className="bank-card__chip-row">
                              <div className="bank-card__chip" />
                            </div>
                            <div className="bank-card__info-group">
                              <span className="bank-card__number">{giftData.accountNumber || '12345678'}</span>
                              <span className="bank-card__holder-name">{giftData.accountName || 'Atas Nama'}</span>
                            </div>
                            <div className="bank-card__action-row">
                              <button className="btn btn-copy btn-sm" onClick={() => copyToClipboard(giftData.accountNumber || '')}>
                                Salin
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="kirim-hadiah">
                          <div className="kirim-hadiah__icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-dark)" strokeWidth="1.5"><rect x="3" y="8" width="18" height="4" rx="1"/><rect x="5" y="12" width="14" height="8" rx="1"/><path d="M12 8v12"/><path d="M12 8c-1.5-2-4-3-4-3s1-2 3-2 2.5 2 1 3"/><path d="M12 8c1.5-2 4-3 4-3s-1-2-3-2-2.5 2-1 3"/></svg>
                          </div>
                          <h4 className="kirim-hadiah__title">Kirim Hadiah</h4>
                          {giftData.address && <p className="kirim-hadiah__address">{giftData.address}</p>}
                          <a className="btn-whatsapp" href={`https://wa.me/?text=Halo, saya ingin konfirmasi pengiriman hadiah`} target="_blank" rel="noopener noreferrer">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                            KONFIRMASI VIA WHATSAPP
                          </a>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Dresscode */}
                  {isOn('dresscode') && (
                    <section className="section section-dark">
                      <h2 className="section-title reveal">Dresscode</h2>
                      <div className="section-ornament reveal" />
                      <div className="dresscode-content-wrap reveal">
                        <p className="dresscode-desc">Kami mengundang Anda untuk mengenakan pakaian berwarna berikut ini sebagai tanda kebahagiaan di hari istimewa kami. Mohon untuk menyesuaikan warna pakaian dengan tema yang telah kami pilih.</p>
                        <div className="dresscode-colors">
                          {['#7c0f16', '#e2b714', '#faf8f5', '#3d2b24'].map((c, i) => (
                            <div key={i} className="dresscode-color-circle" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Protokol Kesehatan */}
                  <section className="section">
                    <h2 className="section-title reveal">Protokol Kesehatan</h2>
                    <div className="section-ornament reveal" />
                    <div className="protokol-grid reveal">
                      {[
                        { icon: 'mask', title: 'Masker', desc: 'Wajib mengenakan masker selama acara berlangsung' },
                        { icon: 'wash', title: 'Cuci Tangan', desc: 'Rajin mencuci tangan dengan sabun atau hand sanitizer' },
                        { icon: 'distance', title: 'Jaga Jarak', desc: 'Menjaga jarak minimal 1 meter antar tamu undangan' },
                        { icon: 'avoid', title: 'Hindari Sentuhan', desc: 'Hindari berjabat tangan, pelukan atau cipika-cipiki' },
                      ].map((item, i) => (
                        <div key={i} className="protokol-card">
                          <div className="protokol-card__icon">
                            {item.icon === 'mask' && <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-dark)" strokeWidth="1.5"><path d="M3 10c0-2 2-4 4-4h10c2 0 4 2 4 4v2c0 3-3 6-9 6s-9-3-9-6v-2z"/><path d="M3 10l-1 3"/><path d="M21 10l1 3"/></svg>}
                            {item.icon === 'wash' && <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-dark)" strokeWidth="1.5"><path d="M12 2v6"/><path d="M8 8h8"/><path d="M6 8c0 6 6 10 6 14 0-4 6-8 6-14"/></svg>}
                            {item.icon === 'distance' && <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-dark)" strokeWidth="1.5"><circle cx="7" cy="10" r="3"/><circle cx="17" cy="10" r="3"/><path d="M4 18h6"/><path d="M14 18h6"/><path d="M10 15h4" strokeDasharray="2 2"/></svg>}
                            {item.icon === 'avoid' && <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-dark)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>}
                          </div>
                          <h4 className="protokol-card__title">{item.title}</h4>
                          <p className="protokol-card__desc">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* RSVP */}
                  {isOn('rsvp') && (
                    <section className="section section-warm">
                      <h2 className="section-title reveal">RSVP</h2>
                      <div className="section-ornament reveal" />
                      {rsvpSubmitted ? (
                        <div className="rsvp-success reveal">
                          <p>Terima kasih atas konfirmasi dan ucapan Anda!</p>
                        </div>
                      ) : (
                        <form className="reveal" onSubmit={handleRsvpSubmit}>
                          <div className="form-group">
                            <label>Nama</label>
                            <input type="text" value={rsvpForm.nama} onChange={e => setRsvpForm(p => ({ ...p, nama: e.target.value }))} required placeholder="Nama lengkap Anda" />
                          </div>
                          <div className="form-group">
                            <label>Konfirmasi Kehadiran</label>
                            <select value={rsvpForm.kehadiran} onChange={e => setRsvpForm(p => ({ ...p, kehadiran: e.target.value }))} required>
                              <option value="">— Pilih —</option>
                              <option value="hadir">Hadir</option>
                              <option value="tidak">Tidak Hadir</option>
                            </select>
                          </div>
                          {rsvpForm.kehadiran === 'hadir' && (
                            <div className="form-group">
                              <label>Jumlah Tamu</label>
                              <input type="number" min={1} max={10} value={rsvpForm.jumlah} onChange={e => setRsvpForm(p => ({ ...p, jumlah: +e.target.value }))} />
                            </div>
                          )}
                          <div className="form-group">
                            <label>Ucapan & Doa</label>
                            <textarea value={rsvpForm.pesan} onChange={e => setRsvpForm(p => ({ ...p, pesan: e.target.value }))} required placeholder="Tulis ucapan dan doa terbaik Anda..." />
                          </div>
                          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Kirim RSVP & Ucapan</button>
                        </form>
                      )}
                    </section>
                  )}

                  {/* Ucapan */}
                  {isOn('rsvp') && (
                    <section className="section">
                      <h2 className="section-title reveal">Ucapan & Doa</h2>
                      <div className="section-ornament reveal" />
                      <div className="ucapan-list reveal">
                        {wishes.length === 0 ? (
                          <p className="ucapan-empty">Belum ada ucapan. Jadilah yang pertama!</p>
                        ) : (
                          wishes.map((w, i) => (
                            <div key={i} className="ucapan-item">
                              <div className="ucapan-header">
                                <span className="ucapan-nama">{w.name}</span>
                                <span className="ucapan-date">{w.createdAt ? new Date(w.createdAt).toLocaleDateString('id-ID') : ''}</span>
                              </div>
                              <div className="ucapan-badge-row">
                                <span className={`ucapan-badge ucapan-badge--${w.attendance === 'hadir' ? 'hadir' : 'tidak'}`}>
                                  {w.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                                </span>
                              </div>
                              <p className="ucapan-text">{w.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </section>
                  )}

                  {/* Penutup */}
                  <section className="section penutup-section">
                    <div className="penutup-frame reveal">
                      <div className="penutup-frame__inner">
                        <img src="/templates/banjar/images/cover-img.webp" alt="Couple" />
                      </div>
                    </div>
                    <div className="penutup-content-wrap reveal">
                      <p className="penutup-teks">{thanksData.message || "Atas kehadiran dan do'a restunya kami ucapkan terima kasih."}</p>
                      {yangMengundangData.families && (
                        <p className="yang-mengundang">{yangMengundangData.families}</p>
                      )}
                      <p className="penutup-names">
                        {thanksData.groomName || groomName} &amp; {thanksData.brideName || brideName}
                      </p>
                    </div>
                  </section>

                  {/* Turut Mengundang */}
                  {isOn('turutMengundang') && (
                    <section className="section">
                      <h2 className="section-title reveal">Turut Mengundang</h2>
                      <div className="section-ornament reveal" />
                      <div className="turut-list reveal">
                        {turutMengundangData.maleSide && <p>{turutMengundangData.maleSide}</p>}
                        {turutMengundangData.femaleSide && <p>{turutMengundangData.femaleSide}</p>}
                      </div>
                    </section>
                  )}

                  {/* Footer */}
                  <footer className="banjar-footer">
                    <div className="banjar-footer__logo">wdp</div>
                    <p className="banjar-footer__label">Website Undangan</p>
                    <p className="banjar-footer__credit">Powered by WeddingPress</p>
                    <div className="banjar-footer__social">
                      {['globe','whatsapp','youtube','facebook','telegram'].map(s => (
                        <a key={s} className="footer-social-icon" href="#" aria-label={s}>
                          {s === 'globe' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>}
                          {s === 'whatsapp' && <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>}
                          {s === 'youtube' && <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff"/></svg>}
                          {s === 'facebook' && <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>}
                          {s === 'telegram' && <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.198 2.433a2.242 2.242 0 00-1.022.215l-8.609 3.33c-2.068.8-4.133 1.598-5.724 2.21a405.15 405.15 0 01-2.849 1.09c-.42.147-.99.332-1.473.901-.728.855.075 1.644.357 1.898.31.282.686.475.976.622l.142.072 3.464 1.481c.148.498.854 2.889 1.06 3.575.094.322.207.603.381.84a1.12 1.12 0 00.58.413l.04.01c.024.005.047.01.068.013.261.063.532.04.762-.064.149-.067.284-.166.405-.284.203-.197.393-.423.573-.641l.088-.107c.614-.747 1.708-2.045 2.207-2.639l3.423 2.593.073.037c.39.174.785.236 1.16.172a1.71 1.71 0 001.029-.597c.27-.318.393-.724.342-1.128-.083-.67-.524-3.394-.982-6.224-.232-1.44-.466-2.879-.63-3.89l-.032-.2c-.132-.812-.214-1.312-.383-1.606a1.42 1.42 0 00-.569-.548 1.832 1.832 0 00-.783-.218z"/></svg>}
                        </a>
                      ))}
                    </div>
                  </footer>

                </main>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════
   CSS — Complete Banjar Template Styles
   ═══════════════════════════════════════════════════ */
const parallaxCSS = (scoped: boolean) => `
/* ─── CSS Variables ─── */
${scoped ? '.banjar-root' : ':root'} {
  --color-bg: #faf8f5;
  --color-bg-warm: #f5f0e8;
  --color-bg-dark: #2a1515;
  --color-text: #3d2b24;
  --color-text-light: #806c64;
  --color-text-inverse: #faf8f5;
  --color-accent: #e2b714;
  --color-accent-light: #ffd700;
  --color-accent-dark: #7c0f16;
  --color-border: rgba(124, 15, 22, 0.15);
  --color-overlay: rgba(35, 7, 9, 0.80);
  --overlay-gradient: linear-gradient(to bottom, rgba(35,7,9,0.75) 0%, rgba(35,7,9,0.85) 100%);
  --font-display: 'Marcellus', Georgia, serif;
  --font-script: 'Great Vibes', cursive;
  --font-body: 'Lora', 'Times New Roman', serif;
  --max-width: 480px;
  --cover-inisial-size: 4.5rem;
  --cover-inisial-color: #ffd700;
  --splash-names-size: 3.4rem;
  --splash-names-color: #ffffff;
  --splash-label-size: 0.9rem;
  --splash-label-letter-spacing: 0.3em;
  --splash-date-size: 1rem;
  --section-title-size: 1.6rem;
  --section-title-color: #7c0f16;
  --section-title-letter-spacing: 0.02em;
  --section-body-size: 17px;
  --section-body-line-height: 1.7;
  --closing-text-size: 1.05rem;
  --closing-text-color: #ffffff;
  --closing-text-line-height: 1.8;
  --closing-names-size: 2.6rem;
  --closing-names-color: #ffd700;
  --closing-yang-mengundang-size: 1.4rem;
  --closing-yang-mengundang-color: #ffd700;
  --transition: 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
  --section-padding: 4rem 1.5rem;
}

@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Lora:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Marcellus&display=swap');

${scoped ? '' : `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  font-family: var(--font-body);
  font-size: var(--section-body-size);
  font-weight: 400;
  line-height: var(--section-body-line-height);
  color: var(--color-text);
  background: var(--color-bg);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
body.no-scroll { overflow: hidden; }
`}
${scoped ? `
.banjar-root {
  font-family: var(--font-body);
  font-size: var(--section-body-size);
  font-weight: 400;
  line-height: var(--section-body-line-height);
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
.banjar-root *, .banjar-root *::before, .banjar-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
` : ''}
.app-container { width: 100%; min-height: ${scoped ? '100%' : '100vh'}; }
.banjar-container { width: 100%; max-width: var(--max-width); margin: 0 auto; }

/* ─── SPLASH SCREEN ─── */
.splash-screen {
  position: fixed; inset: 0; z-index: 1000;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background-image: url('/templates/banjar/images/background-img.webp');
  background-size: cover; background-position: center; background-color: var(--color-bg-dark);
  text-align: center;
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.splash-overlay {
  position: absolute; inset: 0; background: var(--color-overlay);
}
.splash-content {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 100vh; padding: 2rem;
}
.splash-gold-lines {
  display: flex; flex-direction: column; gap: 4px; width: 80px;
  margin-bottom: 2rem;
}
.splash-gold-lines span {
  display: block; height: 1px; background: var(--color-accent-light);
  width: 100%;
}
.splash-label {
  font-family: var(--font-body); font-size: var(--splash-label-size);
  letter-spacing: var(--splash-label-letter-spacing); text-transform: uppercase;
  color: var(--color-accent-light); margin-bottom: 1rem;
}
.splash-names {
  font-family: var(--font-script); font-size: var(--splash-names-size);
  font-weight: 400; color: var(--splash-names-color); line-height: 1.2; margin-bottom: 0.5rem;
}
.splash-separator { color: var(--color-accent); margin: 0.5rem 0; font-size: 0.8rem; }
.splash-date { font-family: var(--font-body); font-size: var(--splash-date-size); color: var(--color-accent-light); margin-bottom: 0.5rem; }
.splash-to {
  font-family: var(--font-body); font-size: 0.85rem;
  color: rgba(255,255,255,0.6); margin-bottom: 0.3rem;
  letter-spacing: 0.15em; text-transform: uppercase;
}
.splash-tamu-nama {
  font-family: var(--font-script); font-size: 2rem; font-style: normal;
  color: #fff; margin-bottom: 2rem; font-weight: 400;
}
.splash-bottom { display: flex; flex-direction: column; align-items: center; }
.btn-open {
  font-family: var(--font-body); font-size: 0.85rem; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase;
  padding: 0.9rem 2.5rem;
  border: none; color: #fff; background: #7c0f16;
  border-radius: 50px; cursor: pointer; transition: var(--transition);
  display: inline-flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 15px rgba(124, 15, 22, 0.4);
}
.btn-open:hover { background: #9a1a24; box-shadow: 0 6px 20px rgba(124, 15, 22, 0.5); }

/* ─── COVER SECTION ─── */
.cover-section {
  position: fixed; inset: 0; z-index: 999;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background-image: url('/templates/banjar/images/cover-img.webp');
  background-size: cover; background-position: center; background-color: var(--color-bg-dark);
  color: #fff; cursor: pointer;
  transition: opacity 0.8s ease;
}
.cover-content { position: relative; z-index: 1; text-align: center; }
.cover-inisial {
  font-family: var(--font-script); font-size: var(--cover-inisial-size);
  font-weight: 400; font-style: normal; color: var(--cover-inisial-color);
  margin-bottom: 0.8rem; opacity: 0.95;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
}

/* ─── PARALLAX STAGE ─── */
.parallax-stage {
  position: fixed; inset: 0; z-index: 100;
  overflow: hidden; pointer-events: none;
}
.parallax-stage * { pointer-events: auto; }

.layer {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  will-change: transform, opacity;
  transition: none;
}
.layer img { max-width: 100%; max-height: 100%; object-fit: cover; }

.layer--background { z-index: 1; }
.layer--background img { width: 100%; height: 100%; object-fit: cover; }

.layer--stage-header { z-index: 10; }
.stage-header-content { text-align: center; padding: 0 1.5rem; }
.stage-header__label {
  font-family: var(--font-body); font-size: var(--splash-label-size);
  letter-spacing: var(--splash-label-letter-spacing); text-transform: uppercase;
  color: var(--color-accent-light); margin-bottom: 0.5rem;
}
.stage-header__names {
  font-family: var(--font-script); font-size: var(--splash-names-size);
  color: #fff; line-height: 1.2; margin-bottom: 0.3rem;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
}
.stage-header__separator { color: var(--color-accent); font-size: 0.8rem; margin: 0.3rem 0; }
.stage-header__date {
  font-family: var(--font-body); font-size: var(--splash-date-size);
  color: var(--color-accent-light);
}

.layer--cover-img { z-index: 5; }
.layer--cover-img img { width: 85%; max-width: 380px; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }

.layer--couple { z-index: 4; }
.layer--couple img { width: 75%; max-width: 340px; border-radius: 50%; border: 3px solid var(--color-accent-light); box-shadow: 0 8px 32px rgba(184, 149, 106, 0.15); }

.layer--mempelai-gradient {
  z-index: 3;
  background: linear-gradient(to top, var(--color-bg) 0%, transparent 100%);
  pointer-events: none;
}

.layer--verse { z-index: 6; bottom: 10%; top: auto; height: auto; }
.verse {
  background: transparent; border: none; box-shadow: none;
  padding: 1.5rem 2rem; margin: 0 1.5rem;
  max-width: 400px;
  text-align: center;
}
.verse__hashtag {
  display: block; font-family: var(--font-display); font-size: 1.4rem;
  color: #7c0f16; font-weight: 700; letter-spacing: 0.02em;
  margin-bottom: 1rem;
}
.verse__text {
  font-family: var(--font-body); font-size: 0.95rem;
  color: #ffffff; line-height: 1.9; font-style: italic;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}
.verse__source {
  display: block; font-family: var(--font-body); font-size: 0.8rem;
  color: rgba(255,255,255,0.8); margin-top: 0.8rem; font-style: normal;
}

.layer--info-groom { z-index: 7; }
.layer--info-bride { z-index: 7; }
.info-card {
  background: rgba(255,255,255,0.95); backdrop-filter: blur(12px);
  border-radius: 20px; padding: 2.5rem 1.5rem; margin: 0 1.5rem;
  max-width: 380px; width: calc(100% - 3rem);
  box-shadow: 0 12px 40px rgba(0,0,0,0.1);
  border: 1px solid var(--color-border);
  text-align: center;
}
.info-card__name-script {
  font-family: var(--font-script); font-size: 2.6rem; font-weight: 400;
  color: var(--color-accent); line-height: 1.2; margin-bottom: 0.8rem;
}
.info-card__label {
  font-family: var(--font-body); font-size: 0.7rem; font-weight: 700;
  color: var(--color-text-light); letter-spacing: 0.15em;
  text-transform: uppercase; margin-bottom: 0.5rem;
}
.info-card__parents {
  font-family: var(--font-body); font-size: 0.95rem;
  color: var(--color-text); margin-bottom: 1.2rem; line-height: 1.6;
}
.info-card__social {
  display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap;
}
.social-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 36px; height: 36px;
  border: 1.5px solid var(--color-accent); border-radius: 8px;
  color: var(--color-accent); transition: all 0.3s ease;
  text-decoration: none;
}
.social-icon:hover { background: var(--color-accent); color: #fff; }

.info-card--events { text-align: left; }

.layer--info-events { z-index: 7; }
.layer--info-countdown { z-index: 7; }

/* Acara Cards */
.acara-group {
  display: flex; flex-direction: column; gap: 1.5rem; margin: 0 1.5rem; max-width: 380px; width: 100%;
}
.acara-card {
  background: rgba(255,255,255,0.95); backdrop-filter: blur(12px);
  border-radius: 20px; padding: 2rem 1.5rem;
  box-shadow: 0 12px 40px rgba(0,0,0,0.1);
  border: 1px solid var(--color-border);
  text-align: center; position: relative;
}
.acara-card__line {
  width: 2px; height: 30px; background: var(--color-accent);
  margin: 0 auto 0.8rem;
}
.acara-card__line:last-child { margin: 0.8rem auto 0; }
.acara-card__title {
  font-family: var(--font-script); font-size: 2rem; font-weight: 400;
  color: var(--color-accent); margin-bottom: 0.5rem;
}
.acara-card__diamond {
  color: var(--color-accent); font-size: 0.6rem; margin-bottom: 0.8rem;
}
.acara-card__date {
  font-family: var(--font-display); font-size: 1rem;
  color: var(--color-text); margin-bottom: 0.3rem; font-weight: 500;
}
.acara-card__time {
  font-family: var(--font-body); font-size: 0.9rem;
  color: var(--color-text-light); margin-bottom: 0.3rem;
}
.acara-card__venue {
  font-family: var(--font-display); font-size: 1rem;
  color: var(--color-accent); margin-bottom: 0.3rem; font-weight: 500;
}
.acara-card__address {
  font-size: 0.85rem; color: var(--color-text-light); margin-bottom: 1rem; line-height: 1.5;
}
.acara-maps-btn {
  display: inline-block; font-family: var(--font-body); font-size: 0.8rem; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  padding: 0.6rem 2rem; background: #7c0f16; color: #fff;
  border-radius: 50px; text-decoration: none;
  transition: var(--transition); box-shadow: 0 4px 12px rgba(124,15,22,0.3);
}
.acara-maps-btn:hover { background: #9a1a24; }

/* Countdown Panel */
.countdown-panel {
  background: rgba(255,255,255,0.95); backdrop-filter: blur(12px);
  border-radius: 20px; padding: 2.5rem 1.5rem; margin: 0 1.5rem;
  max-width: 380px; width: calc(100% - 3rem);
  box-shadow: 0 12px 40px rgba(0,0,0,0.1);
  border: 1px solid var(--color-border);
  text-align: center;
}
.countdown__heading {
  font-family: var(--font-display); font-size: 1.3rem;
  color: #7c0f16; margin-bottom: 0.5rem; font-weight: 500;
}
.countdown__gold-sep {
  width: 50px; height: 2px; background: var(--color-accent);
  margin: 0 auto 1.5rem;
}
.countdown__grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.6rem;
  margin-bottom: 1.2rem;
}
.countdown__unit {
  background: #f5f0e8; border-radius: 12px;
  padding: 1rem 0.3rem; text-align: center;
}
.countdown__value {
  font-family: var(--font-display); font-size: 1.6rem;
  font-weight: 600; color: var(--color-accent-dark); display: block;
}
.countdown__label {
  font-size: 0.65rem; text-transform: uppercase;
  letter-spacing: 0.15em; color: var(--color-text-light); margin-top: 0.2rem;
}
.countdown-passed {
  font-style: italic; color: var(--color-accent-dark); font-size: 1rem;
}
.countdown__desc {
  font-size: 0.85rem; color: var(--color-text-light);
  line-height: 1.7; margin-bottom: 1.2rem;
}
.btn-live-streaming {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-family: var(--font-body); font-size: 0.85rem; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 0.75rem 2rem; background: #7c0f16; color: #fff;
  border-radius: 50px; text-decoration: none;
  transition: var(--transition); box-shadow: 0 4px 12px rgba(124,15,22,0.3);
}
.btn-live-streaming:hover { background: #9a1a24; }

/* Semak decorations */
.layer--semak { z-index: 12; pointer-events: none; }
.layer--semak-left { left: -15%; right: auto; width: 50%; }
.layer--semak-left img { width: 100%; transform: scaleX(-1); opacity: 0.7; }
.layer--semak-right { right: -15%; left: auto; width: 50%; }
.layer--semak-right img { width: 100%; opacity: 0.7; }

/* Outro couple */
.layer--outro-couple { z-index: 8; bottom: 0; top: auto; height: auto; }
.layer--outro-couple img { width: 60%; max-width: 280px; border-radius: 50%; border: 2px solid var(--color-accent-light); margin-bottom: 1rem; }
.outro-scroll-hint { text-align: center; }
.outro-scroll-hint__text { font-size: 0.8rem; color: var(--color-text-light); letter-spacing: 0.1em; }
.outro-scroll-hint__arrow { font-size: 1.2rem; color: var(--color-accent); animation: bounce 1.5s infinite; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }

/* Progress bar */
.stage-progress {
  position: absolute; top: 1rem; left: 1rem; right: 1rem;
  z-index: 20; display: flex; gap: 4px; pointer-events: none;
}
.stage-progress__segment {
  flex: 1; height: 3px; background: rgba(255,255,255,0.2);
  border-radius: 2px; overflow: hidden;
}
.stage-progress__fill {
  height: 100%; background: var(--color-accent-light);
  border-radius: 2px; transition: width 0.1s linear;
}

/* Swipe hint */
.swipe-hint {
  position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
  z-index: 15; text-align: center; pointer-events: none;
}
.swipe-hint__arrow-wrap {
  display: block; margin-bottom: 0.5rem;
}
.swipe-hint__arrow {
  display: inline-block; width: 20px; height: 20px;
  border-right: 2px solid var(--color-accent-light);
  border-bottom: 2px solid var(--color-accent-light);
  transform: rotate(45deg); animation: swipeDown 1.5s infinite;
}
@keyframes swipeDown { 0% { opacity: 0; transform: rotate(45deg) translateY(-8px); } 50% { opacity: 1; } 100% { opacity: 0; transform: rotate(45deg) translateY(8px); } }
.swipe-hint__text { font-size: 0.75rem; color: rgba(255,255,255,0.7); letter-spacing: 0.1em; }

/* Scroll overlay */
.scroll-overlay { position: relative; z-index: 50; }
.scroll-gap { height: 100vh; }

/* ─── ZONE B: POST-IMMERSIVE ─── */
.post-immersive {
  background: var(--color-bg);
  position: relative; z-index: 60;
}

.section {
  padding: var(--section-padding);
  text-align: center; position: relative;
}
.section-title {
  font-family: var(--font-display); font-size: var(--section-title-size);
  font-weight: 500; color: var(--section-title-color);
  margin-bottom: 0.3rem; letter-spacing: var(--section-title-letter-spacing);
}
.section-ornament {
  width: 60px; height: 1px; background: var(--color-accent);
  margin: 0.8rem auto 2rem; position: relative;
}
.section-ornament::before {
  content: '✦'; position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%); background: var(--color-bg);
  padding: 0 0.8rem; color: var(--color-accent); font-size: 0.7rem;
}
.section-warm { background: var(--color-bg-warm); }
.section-warm .section-ornament::before { background: var(--color-bg-warm); }
.section-dark { background: linear-gradient(180deg, #3a2020 0%, #2a1515 50%, #1e0f0f 100%); color: var(--color-text-inverse); }
.section-dark .section-title { color: var(--color-accent-light); }
.section-dark .section-ornament::before { background: #2a1515; }

/* Bank Card */
.bank-card {
  position: relative; width: 100%; max-width: 380px; height: 210px;
  margin: 0 auto 1.5rem; padding: 1.25rem 1.5rem; border-radius: 20px;
  background: linear-gradient(135deg, #f5f0e8 0%, #e2d9cb 100%);
  border: 1px solid rgba(255,255,255,0.4);
  box-shadow: 0 15px 35px rgba(124, 15, 22, 0.06), 0 5px 15px rgba(0, 0, 0, 0.04);
  display: flex; flex-direction: column; justify-content: space-between;
  overflow: hidden; text-align: left;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease;
}
.bank-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 20px 40px rgba(124, 15, 22, 0.10), 0 8px 20px rgba(0, 0, 0, 0.06);
}
.bank-card__badge-row { display: flex; justify-content: flex-end; width: 100%; }
.bank-card__badge {
  font-family: var(--font-display); font-weight: 700; font-size: 0.85rem;
  color: var(--color-accent-dark); background: rgba(124, 15, 22, 0.08);
  border: 1px solid rgba(124, 15, 22, 0.2);
  padding: 0.3rem 0.8rem; border-radius: 20px;
  letter-spacing: 0.05em; text-transform: uppercase;
}
.bank-card__chip-row { display: flex; justify-content: flex-start; width: 100%; margin-top: -0.2rem; }
.bank-card__chip {
  width: 42px; height: 33px; border-radius: 6px;
  background: linear-gradient(135deg, #e2b714, #ffd700);
  box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 1px 3px rgba(0,0,0,0.1);
}
.bank-card__info-group { display: flex; flex-direction: column; gap: 0.15rem; width: 100%; }
.bank-card__number {
  font-family: 'Courier New', Courier, monospace; font-size: 1.45rem;
  font-weight: 700; color: var(--color-text); letter-spacing: 0.08em; line-height: 1.2;
}
.bank-card__holder-name {
  font-family: var(--font-body); font-size: 0.9rem; font-weight: 500;
  color: var(--color-text-light); letter-spacing: 0.02em; line-height: 1.2;
}
.bank-card__action-row { display: flex; justify-content: flex-end; width: 100%; }

/* Kado Digital */
.btn-rekening {
  display: inline-block; font-family: var(--font-body); font-size: 0.85rem; font-weight: 600;
  letter-spacing: 0.15em; text-transform: uppercase;
  padding: 0.8rem 2.5rem; background: #fff;
  color: #7c0f16; border: 2px solid #7c0f16;
  border-radius: 50px; cursor: pointer; transition: var(--transition);
  margin-bottom: 1.5rem;
}
.btn-rekening:hover { background: #7c0f16; color: #fff; }

.kirim-hadiah {
  margin-top: 2rem; padding: 2rem 1.5rem;
  background: var(--color-bg-warm); border-radius: 16px;
  text-align: center;
}
.kirim-hadiah__icon { margin-bottom: 0.8rem; }
.kirim-hadiah__title {
  font-family: var(--font-display); font-size: 1.2rem;
  color: var(--color-accent-dark); margin-bottom: 0.8rem;
}
.kirim-hadiah__address {
  font-size: 0.9rem; color: var(--color-text-light);
  line-height: 1.6; margin-bottom: 1.5rem;
}
.btn-whatsapp {
  display: inline-flex; align-items: center; justify-content: center;
  font-family: var(--font-body); font-size: 0.85rem; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 0.8rem 2rem; background: #25d366; color: #fff;
  border-radius: 50px; text-decoration: none;
  transition: var(--transition); box-shadow: 0 4px 12px rgba(37,211,102,0.3);
}
.btn-whatsapp:hover { background: #1ebe57; box-shadow: 0 6px 18px rgba(37,211,102,0.4); }

/* Dresscode */
.dresscode-content-wrap { max-width: 600px; margin: 0 auto; text-align: center; padding: 1.5rem 1rem; }
.dresscode-desc { font-size: 0.92rem; line-height: 1.7; color: rgba(255,255,255,0.8); max-width: 480px; margin: 0 auto 1.8rem; }
.dresscode-colors { display: flex; justify-content: center; align-items: center; padding: 0.5rem; }
.dresscode-color-circle {
  width: 58px; height: 58px; border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: transform var(--transition), box-shadow var(--transition);
  cursor: pointer; position: relative;
}
.dresscode-color-circle:not(:first-child) { margin-left: -18px; }
.dresscode-color-circle:hover { transform: scale(1.2) translateY(-4px); z-index: 10; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4); }

/* Penutup */
.penutup-section {
  position: relative;
  background-image: linear-gradient(to bottom, rgba(14, 18, 15, 0.76) 0%, rgba(14, 18, 15, 0.84) 100%), url('/templates/banjar/images/background-img.webp');
  background-size: cover; background-position: center;
  min-height: 100vh; display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  padding: 4rem 2rem; overflow: hidden;
}
.penutup-frame {
  position: relative; width: 200px; height: 260px;
  border: 3px solid var(--color-accent-light);
  border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
  overflow: hidden; margin-bottom: 2rem;
  box-shadow: 0 0 0 6px rgba(226, 183, 20, 0.2), 0 20px 60px rgba(0,0,0,0.5);
}
.penutup-frame__inner {
  width: 100%; height: 100%; overflow: hidden;
}
.penutup-frame__inner img {
  width: 100%; height: 100%; object-fit: cover;
  animation: zoomInOut 6s ease-in-out infinite;
}
@keyframes zoomInOut { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
.penutup-content-wrap { position: relative; z-index: 2; width: 100%; max-width: 360px; text-align: center; }
.penutup-teks {
  white-space: pre-line; font-size: var(--closing-text-size);
  line-height: var(--closing-text-line-height); color: var(--closing-text-color);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.95);
}
.yang-mengundang {
  font-family: var(--font-display); font-size: var(--closing-yang-mengundang-size);
  font-style: italic; color: var(--closing-yang-mengundang-color);
  margin-top: 2rem; text-shadow: 0 2px 12px rgba(0, 0, 0, 0.95);
}
.penutup-names {
  font-family: var(--font-script); font-size: var(--closing-names-size);
  font-style: normal; color: var(--closing-names-color);
  margin-top: 0.5rem; text-shadow: 0 2px 12px rgba(0, 0, 0, 0.95);
}

.turut-list { white-space: pre-line; font-size: 0.95rem; color: var(--color-text-light); margin-top: 1rem; line-height: 1.8; }

/* RSVP & Form */
.form-group { margin-bottom: 1rem; text-align: left; }
.form-group label { display: block; font-size: 0.85rem; color: var(--color-text-light); margin-bottom: 0.3rem; letter-spacing: 0.05em; }
.form-group input, .form-group select, .form-group textarea {
  width: 100%; padding: 0.75rem 1rem;
  border: 1px solid var(--color-border); border-radius: 8px;
  font-family: var(--font-body); font-size: 1rem;
  color: var(--color-text); background: #fff; transition: border-color 0.3s;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: var(--color-accent); }
.form-group textarea { resize: vertical; min-height: 80px; }
.rsvp-success { padding: 2rem; text-align: center; font-size: 1.1rem; color: var(--color-accent-dark); }

/* Ucapan */
.ucapan-list { max-height: 400px; overflow-y: auto; margin-bottom: 1.5rem; padding-right: 0.4rem; scrollbar-width: thin; scrollbar-color: rgba(184, 149, 106, 0.4) transparent; }
.ucapan-list::-webkit-scrollbar { width: 3px; }
.ucapan-list::-webkit-scrollbar-thumb { background: rgba(184, 149, 106, 0.35); border-radius: 99px; }
.ucapan-item {
  display: flex; flex-direction: column; text-align: left;
  padding: 1.25rem 1.5rem; margin-bottom: 0.8rem; border-radius: 12px;
  border: 1px solid rgba(124, 15, 22, 0.12); background: #ffffff;
  box-shadow: 0 4px 12px rgba(124, 15, 22, 0.02);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.ucapan-item:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(124, 15, 22, 0.06); }
.ucapan-item:nth-child(even) { background: rgba(245, 240, 232, 0.4); }
.ucapan-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
.ucapan-nama { font-family: var(--font-body); font-weight: 600; font-size: 0.95rem; color: var(--color-text); }
.ucapan-date { font-size: 0.78rem; color: var(--color-text-light); opacity: 0.8; }
.ucapan-badge-row { margin-bottom: 0.75rem; display: flex; }
.ucapan-badge {
  display: inline-flex; align-items: center; font-size: 0.7rem;
  font-weight: 700; padding: 0.2rem 0.65rem; border-radius: 20px;
  letter-spacing: 0.05em; text-transform: uppercase;
}
.ucapan-badge--hadir { background-color: rgba(124, 15, 22, 0.05); color: var(--color-accent-dark); border: 1px solid rgba(124, 15, 22, 0.15); }
.ucapan-badge--tidak { background-color: rgba(128, 108, 100, 0.05); color: var(--color-text-light); border: 1px solid rgba(128, 108, 100, 0.15); }
.ucapan-text { font-size: 0.92rem; color: var(--color-text); line-height: 1.6; }
.ucapan-empty { color: var(--color-text-light); font-style: italic; padding: 1.5rem 0; text-align: center; }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  font-family: var(--font-body); font-size: 0.9rem; font-weight: 600;
  text-decoration: none; cursor: pointer; border: 1px solid transparent;
  border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-transform: uppercase; letter-spacing: 0.08em;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.btn:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12); }
.btn-primary { background: linear-gradient(135deg, #8c121b 0%, #4a0208 100%); color: #fff; padding: 0.8rem 2.2rem; border: none; }
.btn-primary:hover { background: linear-gradient(135deg, #ffd700 0%, #e2b714 100%); color: #230709; }
.btn-copy { background: var(--color-bg-warm); border: 1px solid var(--color-border); color: var(--color-text-light); }
.btn-copy:hover { background: var(--color-accent-light); color: #fff; border-color: var(--color-accent-light); }
.btn-sm { font-size: 0.78rem; padding: 0.45rem 1.4rem; letter-spacing: 0.06em; }

/* Audio toggle */
.audio-toggle {
  position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 200;
  width: 44px; height: 44px; border-radius: 50%;
  border: 1px solid var(--color-border);
  background: rgba(255,255,255,0.9); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--color-text-light);
  transition: var(--transition); gap: 2px;
}
.audio-toggle:hover { border-color: var(--color-accent); color: var(--color-accent); }
.audio-toggle .bar { width: 2px; background: currentColor; border-radius: 1px; transition: height 0.3s; }
.audio-toggle .bar:nth-child(1) { height: 8px; }
.audio-toggle .bar:nth-child(2) { height: 14px; }
.audio-toggle .bar:nth-child(3) { height: 10px; }
.audio-toggle .bar:nth-child(4) { height: 16px; }
.audio-toggle .bar.flat { height: 3px !important; }

/* Scroll reveal */
.reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.revealed { opacity: 1; transform: translateY(0); }

/* Story Timeline */
.story-timeline {
  position: relative; width: 100%; padding: 1rem 0;
}
.story-line {
  position: absolute; left: 50%; top: 0; bottom: 0;
  width: 2px; background: var(--color-accent);
  transform: translateX(-50%);
}
.story-node {
  position: relative; display: flex; align-items: flex-start;
  margin-bottom: 2.5rem; padding: 0 1rem;
}
.story-node--left { flex-direction: row; }
.story-node--right { flex-direction: row-reverse; }
.story-marker {
  position: absolute; left: 50%; top: 0.5rem;
  width: 20px; height: 20px;
  background: var(--color-bg); border: 2px solid var(--color-accent);
  border-radius: 50%; transform: translateX(-50%);
  z-index: 2; display: flex; align-items: center; justify-content: center;
}
.story-marker__dot {
  width: 8px; height: 8px; background: var(--color-accent); border-radius: 50%;
}
.story-year {
  position: absolute; left: 50%; top: 1.8rem;
  transform: translateX(-50%);
  font-family: var(--font-display); font-size: 0.8rem; font-weight: 700;
  color: var(--color-accent); white-space: nowrap; z-index: 2;
}
.story-card {
  width: 42%; background: #fff; border-radius: 12px;
  padding: 1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  border: 1px solid var(--color-border); overflow: hidden;
}
.story-node--left .story-card { margin-right: auto; }
.story-node--right .story-card { margin-left: auto; }
.story-photo {
  width: 100%; height: 120px; object-fit: cover;
  border-radius: 8px; margin-bottom: 0.8rem;
}
.story-text h4 {
  font-family: var(--font-display); font-size: 1rem;
  color: var(--color-accent-dark); margin-bottom: 0.3rem;
}
.story-text p {
  font-size: 0.85rem; color: var(--color-text-light);
  line-height: 1.6;
}

/* Gallery */
.galeri-container { width: 100%; }
.galeri-video {
  position: relative; border-radius: 16px; overflow: hidden;
  margin-bottom: 1.5rem; aspect-ratio: 16/9;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}
.galeri-video__thumb {
  width: 100%; height: 100%; object-fit: cover;
}
.galeri-video__badge {
  position: absolute; top: 12px; left: 12px; z-index: 2;
  background: #ff0000; color: #fff; font-size: 0.65rem; font-weight: 700;
  padding: 3px 8px; border-radius: 4px; letter-spacing: 0.05em;
}
.galeri-video__play {
  position: absolute; inset: 0; display: flex;
  align-items: center; justify-content: center; z-index: 2;
  background: rgba(0,0,0,0.3);
}
.galeri-photos {
  display: flex; gap: 0.8rem; overflow-x: auto;
  padding-bottom: 0.5rem; scroll-snap-type: x mandatory;
  scrollbar-width: thin; scrollbar-color: rgba(184,149,106,0.3) transparent;
}
.galeri-photos::-webkit-scrollbar { height: 4px; }
.galeri-photos::-webkit-scrollbar-thumb { background: rgba(184,149,106,0.3); border-radius: 99px; }
.galeri-thumb {
  flex-shrink: 0; width: 140px; height: 140px;
  border-radius: 12px; overflow: hidden;
  scroll-snap-align: start;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.galeri-thumb img {
  width: 100%; height: 100%; object-fit: cover;
}

/* Protokol Kesehatan */
.protokol-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;
  max-width: 400px; margin: 0 auto;
}
.protokol-card {
  background: #fff; border-radius: 16px; padding: 1.5rem 1rem;
  text-align: center; border: 1px solid var(--color-border);
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
}
.protokol-card:hover { transform: translateY(-3px); }
.protokol-card__icon {
  width: 56px; height: 56px; margin: 0 auto 0.8rem;
  display: flex; align-items: center; justify-content: center;
  background: rgba(124,15,22,0.05); border-radius: 50%;
}
.protokol-card__title {
  font-family: var(--font-display); font-size: 0.95rem;
  color: var(--color-accent-dark); margin-bottom: 0.4rem;
}
.protokol-card__desc {
  font-size: 0.8rem; color: var(--color-text-light);
  line-height: 1.5;
}

/* Footer */
.banjar-footer {
  padding: 3rem 1.5rem; text-align: center;
  background: var(--color-bg-dark); color: rgba(255,255,255,0.7);
}
.banjar-footer__logo {
  font-family: var(--font-display); font-size: 1.8rem;
  color: var(--color-accent-light); margin-bottom: 0.3rem; font-weight: 700;
}
.banjar-footer__label {
  font-size: 0.85rem; color: rgba(255,255,255,0.6);
  margin-bottom: 0.2rem;
}
.banjar-footer__credit {
  font-size: 0.75rem; color: rgba(255,255,255,0.4);
  margin-bottom: 1.5rem;
}
.banjar-footer__social {
  display: flex; justify-content: center; gap: 1rem;
}
.footer-social-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 36px; height: 36px;
  border: 1px solid rgba(255,255,255,0.2); border-radius: 50%;
  color: rgba(255,255,255,0.6);
  transition: all 0.3s ease; text-decoration: none;
}
.footer-social-icon:hover {
  border-color: var(--color-accent-light); color: var(--color-accent-light);
}
`
