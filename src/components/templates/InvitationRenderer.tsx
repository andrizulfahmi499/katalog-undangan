'use client'

import { useState, useEffect, useRef } from 'react'
import { Heart, Calendar, Clock, MapPin, Music, VolumeX, Volume2, Send, ChevronDown, ExternalLink, Copy, Check } from 'lucide-react'

interface InvitationProps {
  invitation: {
    id: string
    templateSlug: string
    subdomain: string
    primaryColor: string
    headingFont: string
    bodyFont: string
    accentFont: string
    musicUrl: string | null
    musicEnabled: boolean
    dateLanguage: string
    coupleOrder: string
    editorConfig: any
    events: any[]
    bankAccounts: any[]
    giftItems: any[]
    showWatermark?: boolean
    endUser?: {
      role: string
      packageStatus: string
    }
  }
}

const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatDate(dateStr: string, lang: string) {
  const d = new Date(dateStr)
  const months = lang === 'id' ? MONTHS_ID : MONTHS_EN
  const days = lang === 'id' ? DAYS_ID : DAYS_EN
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export default function InvitationRenderer({ invitation }: InvitationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [rsvpForm, setRsvpForm] = useState({ name: '', whatsapp: '', attendance: 'hadir', guestCount: 1, message: '' })
  const [rsvpSent, setRsvpSent] = useState(false)
  const [rsvpLoading, setRsvpLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const config = invitation.editorConfig || {}
  const c = invitation.primaryColor || '#D0A77B'

  // Auto-play music on open
  useEffect(() => {
    if (isOpen && invitation.musicEnabled && invitation.musicUrl && audioRef.current) {
      audioRef.current.muted = isMuted
      audioRef.current.play().catch(() => {})
    }
  }, [isOpen, isMuted])

  const handleOpen = () => {
    setIsOpen(true)
    if (invitation.musicEnabled && invitation.musicUrl && audioRef.current) {
      audioRef.current.muted = false
      setIsMuted(false)
      audioRef.current.play().catch(() => {})
    }
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false
        audioRef.current.play().catch(() => {})
        setIsMuted(false)
      } else {
        audioRef.current.muted = true
        setIsMuted(true)
      }
    }
  }

  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault()
    setRsvpLoading(true)
    try {
      await fetch(`/api/v2/invitations/${invitation.id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: rsvpForm.name,
          guestWhatsapp: rsvpForm.whatsapp,
          attendance: rsvpForm.attendance,
          guestCount: rsvpForm.guestCount,
          message: rsvpForm.message,
        }),
      })
      setRsvpSent(true)
    } catch {} finally {
      setRsvpLoading(false)
    }
  }

  const copyAccount = (num: string) => {
    navigator.clipboard.writeText(num)
    setCopied(num)
    setTimeout(() => setCopied(null), 2000)
  }

  // Countdown
  const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
      const update = () => {
        const now = new Date().getTime()
        const target = new Date(targetDate).getTime()
        const diff = target - now
        if (diff > 0) {
          setTimeLeft({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
          })
        }
      }
      update()
      const timer = setInterval(update, 1000)
      return () => clearInterval(timer)
    }, [targetDate])

    return (
      <div className="flex justify-center gap-4">
        {[
          { label: 'Hari', value: timeLeft.days },
          { label: 'Jam', value: timeLeft.hours },
          { label: 'Menit', value: timeLeft.minutes },
          { label: 'Detik', value: timeLeft.seconds },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: c + '20', color: c }}>
              {item.value}
            </div>
            <p className="text-xs mt-1.5 opacity-60">{item.label}</p>
          </div>
        ))}
      </div>
    )
  }

  // Cover / Splash Screen
  if (!isOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${c}15, ${c}30, ${c}10)` }}>
        {/* Music */}
        {invitation.musicEnabled && invitation.musicUrl && (
          <audio ref={audioRef} src={invitation.musicUrl} loop preload="auto" />
        )}

        <div className="text-center max-w-md z-10">
          {/* Decorative circle */}
          <div className="w-32 h-32 rounded-full mx-auto mb-8 flex items-center justify-center" style={{ backgroundColor: c + '15', border: `2px solid ${c}30` }}>
            <Heart className="w-12 h-12" style={{ color: c }} fill={c + '30'} />
          </div>

          <p className="text-sm uppercase tracking-[0.3em] mb-4 opacity-50">{config.cover?.labelAtas || 'The Wedding Of'}</p>

          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: invitation.headingFont, color: c }}>
            {config.cover?.namaPasangan || config.groom?.namaPanggilan + ' & ' + config.bride?.namaPanggilan || 'Undangan Pernikahan'}
          </h1>

          {config.cover?.tanggal && (
            <p className="text-sm opacity-60 mb-2">{config.cover.tanggal}</p>
          )}

          <p className="text-sm opacity-50 mb-8">{config.cover?.teksKepada || 'Kepada Yth.'}</p>

          <button
            onClick={handleOpen}
            className="px-8 py-3.5 rounded-full text-white font-semibold text-sm flex items-center gap-2 mx-auto transition-all hover:shadow-lg active:scale-95"
            style={{ backgroundColor: c }}
          >
            <Heart className="w-4 h-4 fill-white" />
            {config.cover?.labelTombol || 'Buka Undangan'}
          </button>
        </div>

        {/* Floating music button */}
        {invitation.musicEnabled && invitation.musicUrl && (
          <button
            onClick={toggleMusic}
            className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center z-50"
          >
            {isMuted ? <VolumeX className="w-4 h-4" style={{ color: c }} /> : <Volume2 className="w-4 h-4" style={{ color: c }} />}
          </button>
        )}
      </div>
    )
  }

  // Main invitation content
  return (
    <div className="min-h-screen" style={{ fontFamily: invitation.bodyFont, backgroundColor: '#FAFAF8' }}>
      {/* Music */}
      {invitation.musicEnabled && invitation.musicUrl && (
        <audio ref={audioRef} src={invitation.musicUrl} loop preload="auto" />
      )}

      {/* Music Toggle */}
      {invitation.musicEnabled && invitation.musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center z-50"
        >
          {isMuted ? <VolumeX className="w-4 h-4" style={{ color: c }} /> : <Volume2 className="w-4 h-4" style={{ color: c }} />}
        </button>
      )}

      {/* Hero / Names Section */}
      <section className="py-20 px-6 text-center" style={{ background: `linear-gradient(180deg, ${c}10, transparent)` }}>
        <p className="text-sm uppercase tracking-[0.3em] mb-6 opacity-40">{config.cover?.labelAtas || 'The Wedding Of'}</p>

        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: invitation.headingFont, color: c }}>
              {invitation.coupleOrder === 'groom-bride'
                ? (config.groom?.namaPanggilan || 'Mempelai Pria')
                : (config.bride?.namaPanggilan || 'Mempelai Wanita')}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: c + '15' }}>
            <span style={{ color: c }} className="text-lg">&</span>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: invitation.headingFont, color: c }}>
              {invitation.coupleOrder === 'groom-bride'
                ? (config.bride?.namaPanggilan || 'Mempelai Wanita')
                : (config.groom?.namaPanggilan || 'Mempelai Pria')}
            </h2>
          </div>
        </div>

        {config.cover?.tanggal && (
          <p className="text-sm opacity-60">{config.cover.tanggal}</p>
        )}
      </section>

      {/* Quote Section */}
      {config.quotes?.enabled !== false && (config.quotes?.kutipan || config.quotes?.teksArab) && (
        <section className="py-12 px-6">
          <div className="max-w-lg mx-auto text-center">
            {config.quotes?.teksArab && (
              <p className="text-xl mb-4 leading-loose" dir="rtl" style={{ color: c }}>{config.quotes.teksArab}</p>
            )}
            {config.quotes?.kutipan && (
              <p className="text-sm italic leading-relaxed opacity-70 mb-2">&quot;{config.quotes.kutipan}&quot;</p>
            )}
            {config.quotes?.sumber && (
              <p className="text-xs font-semibold opacity-50">- {config.quotes.sumber}</p>
            )}
          </div>
        </section>
      )}

      {/* Couple Section */}
      <section className="py-12 px-6">
        <div className="max-w-lg mx-auto">
          <h3 className="text-center text-2xl font-bold mb-10" style={{ fontFamily: invitation.headingFont, color: c }}>
            Mempelai
          </h3>

          {invitation.coupleOrder === 'groom-bride' ? (
            <>
              {config.groom?.enabled !== false && <CoupleCard data={config.groom} color={c} headingFont={invitation.headingFont} accentFont={invitation.accentFont} />}
              <div className="my-6" />
              {config.bride?.enabled !== false && <CoupleCard data={config.bride} color={c} headingFont={invitation.headingFont} accentFont={invitation.accentFont} />}
            </>
          ) : (
            <>
              {config.bride?.enabled !== false && <CoupleCard data={config.bride} color={c} headingFont={invitation.headingFont} accentFont={invitation.accentFont} />}
              <div className="my-6" />
              {config.groom?.enabled !== false && <CoupleCard data={config.groom} color={c} headingFont={invitation.headingFont} accentFont={invitation.accentFont} />}
            </>
          )}
        </div>
      </section>

      {/* Events Section */}
      {invitation.events?.length > 0 && (
        <section className="py-12 px-6" style={{ backgroundColor: c + '05' }}>
          <div className="max-w-lg mx-auto">
            <h3 className="text-center text-2xl font-bold mb-10" style={{ fontFamily: invitation.headingFont, color: c }}>
              Acara Pernikahan
            </h3>
            <div className="space-y-6">
              {invitation.events.map((event: any, i: number) => (
                <div key={event.id || i} className="bg-white rounded-2xl p-6 text-center shadow-sm border" style={{ borderColor: c + '20' }}>
                  <h4 className="text-lg font-bold mb-4" style={{ fontFamily: invitation.headingFont, color: c }}>{event.eventName}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" style={{ color: c }} />
                      <span>{formatDate(event.date, invitation.dateLanguage)}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Clock className="w-4 h-4" style={{ color: c }} />
                      <span>{event.startTime} - {event.endTime} {event.timezone || 'WIB'}</span>
                    </div>
                    {event.venue && (
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" style={{ color: c }} />
                        <span>{event.venue}</span>
                      </div>
                    )}
                    {event.address && (
                      <p className="text-xs opacity-60">{event.address}</p>
                    )}
                    {event.mapsUrl && (
                      <a href={event.mapsUrl} target="_blank" className="inline-flex items-center gap-1.5 text-xs font-semibold mt-2 px-4 py-2 rounded-full text-white" style={{ backgroundColor: c }}>
                        <MapPin className="w-3 h-3" /> Lihat Lokasi
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Countdown */}
      {config.countdown?.enabled !== false && invitation.events?.[0]?.date && (
        <section className="py-12 px-6">
          <div className="max-w-lg mx-auto text-center">
            <h3 className="text-xl font-bold mb-6" style={{ fontFamily: invitation.headingFont, color: c }}>
              Menghitung Hari
            </h3>
            <CountdownTimer targetDate={invitation.events[0].date} />
          </div>
        </section>
      )}

      {/* Gift / Amplop Digital */}
      {config.amplopDigital?.enabled !== false && invitation.bankAccounts?.length > 0 && (
        <section className="py-12 px-6" style={{ backgroundColor: c + '05' }}>
          <div className="max-w-lg mx-auto">
            <h3 className="text-center text-2xl font-bold mb-8" style={{ fontFamily: invitation.headingFont, color: c }}>
              Amplop Digital
            </h3>
            <p className="text-center text-sm opacity-60 mb-6">
              Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih, kami menyediakan amplop digital.
            </p>
            <div className="space-y-3">
              {invitation.bankAccounts.map((acc: any) => (
                <div key={acc.id} className="bg-white rounded-xl p-4 flex items-center justify-between border" style={{ borderColor: c + '20' }}>
                  <div>
                    <p className="text-sm font-bold">{acc.bankName}</p>
                    <p className="text-xs opacity-60">{acc.accountName}</p>
                    <p className="text-sm font-mono font-semibold mt-1">{acc.accountNumber}</p>
                  </div>
                  <button
                    onClick={() => copyAccount(acc.accountNumber)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                    style={{ backgroundColor: c + '15' }}
                  >
                    {copied === acc.accountNumber ? (
                      <Check className="w-4 h-4" style={{ color: c }} />
                    ) : (
                      <Copy className="w-4 h-4" style={{ color: c }} />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Alamat Kado */}
            {config.alamatKado?.enabled && config.alamatKado?.address && (
              <div className="mt-6 bg-white rounded-xl p-4 border" style={{ borderColor: c + '20' }}>
                <p className="text-sm font-bold mb-2" style={{ color: c }}>Alamat Kirim Kado</p>
                <p className="text-sm opacity-70">{config.alamatKado.address}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <section className="py-12 px-6">
        <div className="max-w-lg mx-auto">
          <h3 className="text-center text-2xl font-bold mb-8" style={{ fontFamily: invitation.headingFont, color: c }}>
            Konfirmasi Kehadiran
          </h3>

          {rsvpSent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: c + '15' }}>
                <Check className="w-8 h-8" style={{ color: c }} />
              </div>
              <p className="font-semibold">Terima kasih atas konfirmasinya!</p>
              <p className="text-sm opacity-60 mt-1">Doa dan kehadiran Anda sangat berarti bagi kami</p>
            </div>
          ) : (
            <form onSubmit={handleRsvp} className="space-y-4">
              <input
                type="text"
                value={rsvpForm.name}
                onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                placeholder="Nama Anda"
                required
                className="w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none"
                style={{ borderColor: c + '40' }}
              />
              <input
                type="tel"
                value={rsvpForm.whatsapp}
                onChange={(e) => setRsvpForm({ ...rsvpForm, whatsapp: e.target.value })}
                placeholder="Nomor WhatsApp"
                className="w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none"
                style={{ borderColor: c + '40' }}
              />
              <select
                value={rsvpForm.attendance}
                onChange={(e) => setRsvpForm({ ...rsvpForm, attendance: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none"
                style={{ borderColor: c + '40' }}
              >
                <option value="hadir">Hadir</option>
                <option value="tidak_hadir">Tidak Hadir</option>
                <option value="mungkin">Mungkin</option>
              </select>
              <div className="flex items-center gap-2">
                <label className="text-sm whitespace-nowrap">Jumlah tamu:</label>
                <select
                  value={rsvpForm.guestCount}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, guestCount: parseInt(e.target.value) })}
                  className="px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none"
                  style={{ borderColor: c + '40' }}
                >
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <textarea
                value={rsvpForm.message}
                onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                placeholder="Ucapan & doa untuk mempelai (opsional)"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none resize-none"
                style={{ borderColor: c + '40' }}
              />
              <button
                type="submit"
                disabled={rsvpLoading || !rsvpForm.name}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: c }}
              >
                {rsvpLoading ? 'Mengirim...' : <><Send className="w-4 h-4" /> Kirim RSVP</>}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Closing */}
      {config.penutup?.enabled !== false && config.penutup?.message && (
        <section className="py-12 px-6 text-center" style={{ background: `linear-gradient(0deg, ${c}10, transparent)` }}>
          <div className="max-w-lg mx-auto">
            <p className="text-sm leading-relaxed opacity-70">{config.penutup.message}</p>
            <div className="mt-8">
              <Heart className="w-6 h-6 mx-auto" style={{ color: c }} fill={c} />
            </div>
          </div>
        </section>
      )}

      {/* Footer / Watermark */}
      <footer className="py-6 text-center">
        <p className="text-xs opacity-30">Made with Editor Undangan v2</p>
        {invitation.showWatermark && (
          <a
            href="/"
            target="_blank"
            className="inline-block mt-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-xs font-medium text-gray-500">Powered by</span>
            <span className="text-xs font-bold text-green-700 ml-1">Katalog Undangan</span>
          </a>
        )}
      </footer>
    </div>
  )
}

// Couple Card Component
function CoupleCard({ data, color, headingFont, accentFont }: { data: any; color: string; headingFont: string; accentFont: string }) {
  if (!data) return null

  return (
    <div className="text-center">
      {data.fotoUrl && (
        <div className="w-36 h-36 rounded-full mx-auto mb-4 overflow-hidden border-4 shadow-lg" style={{ borderColor: color + '30' }}>
          <img src={data.fotoUrl} alt={data.namaPanggilan} className="w-full h-full object-cover" />
        </div>
      )}
      <h4 className="text-2xl font-bold mb-1" style={{ fontFamily: headingFont, color }}>
        {data.namaLengkap || data.namaPanggilan}
      </h4>
      {data.namaPanggilan && data.namaLengkap && (
        <p className="text-sm opacity-50 mb-2">({data.namaPanggilan})</p>
      )}
      {data.orangTua && (
        <p className="text-sm opacity-60 mb-2" style={{ fontFamily: accentFont }}>{data.orangTua}</p>
      )}
      {data.instagram && (
        <a href={`https://instagram.com/${data.instagram.replace('@', '')}`} target="_blank" className="text-xs font-semibold" style={{ color }}>
          {data.instagram}
        </a>
      )}
    </div>
  )
}
