'use client'

import { useState } from 'react'
import { Heart, MapPin, CalendarDays, Music, Users, Gift, MessageCircle, Copy, Share2 } from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState<'all' | 'blessings'>('all')
  const [wishesData] = useState([
    { name: 'Keluarga & Kerabat', message: 'Selamat atas pernikahan kalian. Semoga lancar sampai hari H dan bahagia selama-lamanya.', date: '23-07-2024, 15:20' },
    { name: 'Teman Karib', message: 'Congratulations on your wedding! Wishing you endless love and happiness together.', date: '24-07-2024, 09:15' },
    { name: 'Saudara', message: 'Bahagia selalu untuk kalian berdua. Terima kasih sudah mengundang kami.', date: '25-07-2024, 14:30' },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f3] via-[#f5f0eb] to-[#f9f5f1]">
      {/* Hero Section with Ornaments */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#f9f4ee] to-[#faf8f3] py-16 sm:py-24">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 opacity-20">
          <svg className="h-64 w-64" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#E6A8D7" strokeWidth="2"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#F4D4E8" strokeWidth="1.5"/>
          </svg>
        </div>
        <div className="absolute left-0 bottom-0 opacity-10">
          <svg className="h-96 w-96" viewBox="0 0 100 100">
            <path d="M50,10 Q70,30 70,50 Q70,70 50,90 Q30,70 30,50 Q30,30 50,10" fill="none" stroke="#D4A574" strokeWidth="2"/>
          </svg>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="inline-block rounded-full bg-white/60 px-6 py-2 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.3em] text-rose-600 font-semibold">Bersama Keluarga Kami</p>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900">
              {groomName}
              <span className="block text-pink-400">&</span>
              {brideName}
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Dengan hormat dan kebanggaan kami mengundang Anda untuk merayakan hari istimewa kami di pernikahan yang akan menjadi awal kehidupan baru kami bersama.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href={invitation.invitationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 px-8 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition hover:scale-105"
              >
                <Heart className="w-5 h-5" /> Lihat Undangan Lengkap
              </a>
              <CopyLinkButton link={invitation.invitationLink} label="Bagikan Link" />
            </div>
          </div>
        </div>
      </div>

      {/* Couple Profiles Section */}
      <div className="relative py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900 mb-12">Pasangan Pengantin</h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Groom */}
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-200 to-rose-200 blur-lg opacity-40"></div>
                <div className="relative w-48 h-48 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shadow-xl border-4 border-white">
                  <span className="text-slate-400">👰</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-pink-600 font-semibold">Mempelai Pria</p>
                <h3 className="text-3xl font-bold text-slate-900">{groomName}</h3>
                <p className="text-slate-600">Putra dari keluarga besar...</p>
              </div>
            </div>

            {/* Bride */}
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-200 to-rose-200 blur-lg opacity-40"></div>
                <div className="relative w-48 h-48 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shadow-xl border-4 border-white">
                  <span className="text-slate-400">🤵</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-pink-600 font-semibold">Mempelai Wanita</p>
                <h3 className="text-3xl font-bold text-slate-900">{brideName}</h3>
                <p className="text-slate-600">Putri dari keluarga besar...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="py-16 sm:py-20 bg-white/50 backdrop-blur">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900 mb-12">Acara Pernikahan</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Event 1: Holy Matrimony */}
            <div className="rounded-2xl border-2 border-pink-200 bg-white p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-full bg-pink-100 p-3">
                  <CalendarDays className="w-5 h-5 text-pink-600" />
                </div>
                <h3 className="font-bold text-slate-900">Holy Matrimony</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide">Hari</p>
                  <p className="font-semibold text-slate-900">Kamis, 27 Juli 2023</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide">Waktu</p>
                  <p className="font-semibold text-slate-900">11:00 WIB</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide">Lokasi</p>
                  <p className="font-semibold text-slate-900">{invitation.location}</p>
                </div>
              </div>
              <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-pink-400 to-rose-500 px-4 py-2 text-sm font-semibold text-white hover:shadow-md transition">
                <MapPin className="inline w-4 h-4 mr-2" /> Lihat Maps
              </button>
            </div>

            {/* Event 2: Reception */}
            <div className="rounded-2xl border-2 border-rose-200 bg-white p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-full bg-rose-100 p-3">
                  <Users className="w-5 h-5 text-rose-600" />
                </div>
                <h3 className="font-bold text-slate-900">Resepsi</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide">Hari</p>
                  <p className="font-semibold text-slate-900">Sabtu, 29 Juli 2023</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide">Waktu</p>
                  <p className="font-semibold text-slate-900">17:00 WIB</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide">Lokasi</p>
                  <p className="font-semibold text-slate-900">Grand Ballroom...</p>
                </div>
              </div>
              <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-rose-400 to-pink-500 px-4 py-2 text-sm font-semibold text-white hover:shadow-md transition">
                <MapPin className="inline w-4 h-4 mr-2" /> Lihat Maps
              </button>
            </div>

            {/* Event 3: Tea Ceremony */}
            <div className="rounded-2xl border-2 border-amber-200 bg-white p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-full bg-amber-100 p-3">
                  <Music className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-bold text-slate-900">Tea Ceremony</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide">Hari</p>
                  <p className="font-semibold text-slate-900">Minggu, 30 Juli 2023</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide">Waktu</p>
                  <p className="font-semibold text-slate-900">16:00 WIB</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide">Lokasi</p>
                  <p className="font-semibold text-slate-900">Heritage Room...</p>
                </div>
              </div>
              <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-semibold text-white hover:shadow-md transition">
                <MapPin className="inline w-4 h-4 mr-2" /> Lihat Maps
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Section */}
      <div className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-600 font-semibold mb-2">Hitung Mundur</p>
              <h2 className="text-3xl font-bold text-slate-900">Save the Date</h2>
            </div>
            <CountdownTimer targetDate={new Date(invitation.eventDate)} />
            <button className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-pink-300 px-6 py-3 font-semibold text-slate-900 hover:bg-pink-50 transition">
              <CalendarDays className="w-5 h-5" /> Tambah ke Kalender
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="py-16 sm:py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900 mb-3">Galeri Kami</h2>
          <p className="text-center text-slate-600 mb-12">Momen-momen berharga kami bersama</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 aspect-square shadow-md hover:shadow-xl transition cursor-pointer"
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                  <span className="text-slate-400 text-4xl">📷</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900 mb-12">Video Kami</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Prewed Video */}
            <div className="space-y-3">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 shadow-lg flex items-center justify-center">
                <button className="rounded-full bg-white/90 p-4 hover:bg-white transition">
                  <span className="text-3xl">▶️</span>
                </button>
              </div>
              <p className="font-semibold text-slate-900">Pre-Wedding Video</p>
              <p className="text-sm text-slate-600">Momen indah persiapan kami menjelang hari istimewa</p>
            </div>

            {/* Live Stream */}
            <div className="space-y-3">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 shadow-lg flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                  <button className="rounded-full bg-white/90 p-4 hover:bg-white transition">
                    <span className="text-3xl">▶️</span>
                  </button>
                </div>
              </div>
              <p className="font-semibold text-slate-900">Live Streaming</p>
              <p className="text-sm text-slate-600">Saksikan pernikahan kami secara langsung</p>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP Section */}
      <div className="py-16 sm:py-20 bg-white/50">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-600 font-semibold mb-2">Konfirmasi</p>
            <h2 className="text-3xl font-bold text-slate-900">Formulir RSVP</h2>
            <p className="text-slate-600 mt-2">Bantu kami untuk mempersiapkan segala sesuatu dengan memberitahu kehadiran Anda</p>
          </div>

          <form className="space-y-5 bg-white rounded-2xl p-6 shadow-md">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama Anda"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Akan Hadir?</label>
              <div className="flex gap-4">
                {['Ya', 'Tidak'].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input type="radio" name="attend" value={option} className="w-4 h-4" />
                    <span className="text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Acara Mana yang Akan Dihadiri?</label>
              <div className="space-y-2">
                {['Holy Matrimony', 'Reception', 'Tea Ceremony'].map((event) => (
                  <label key={event} className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <span className="text-slate-700">{event}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Ucapan & Doa</label>
              <textarea
                placeholder="Sampaikan ucapan terbaik Anda untuk kami..."
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-pink-400 to-rose-500 px-6 py-3 font-semibold text-white hover:shadow-lg transition"
            >
              Kirim RSVP
            </button>
          </form>
        </div>
      </div>

      {/* Wishing Well Section */}
      <div className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-600 font-semibold mb-2">Ucapan</p>
            <h2 className="text-3xl font-bold text-slate-900">Kolom Doa & Ucapan</h2>
            <p className="text-slate-600 mt-2">Terima kasih atas do'a dan restu untuk pernikahan kami</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl bg-white/70 backdrop-blur p-6 shadow-md space-y-4">
              {wishesData.map((wish, i) => (
                <div key={i} className="border-b border-slate-200 pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-900">{wish.name}</p>
                      <p className="text-xs text-slate-500">{wish.date}</p>
                    </div>
                    <span className="text-2xl">💕</span>
                  </div>
                  <p className="text-slate-700 text-sm">{wish.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gift Section */}
      <div className="py-16 sm:py-20 bg-white/50">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <Gift className="w-12 h-12 mx-auto text-pink-500 mb-4" />
            <h2 className="text-3xl font-bold text-slate-900">Hadiah Pernikahan</h2>
            <p className="text-slate-600 mt-2">Kehadiran Anda adalah hadiah terbesar bagi kami. Jika ingin memberikan hadiah, Anda dapat menggunakankan amplop digital berikut:</p>
          </div>

          <div className="space-y-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold mb-2">Bank Tujuan</p>
              <p className="font-bold text-2xl text-slate-900 mb-1">BCA</p>
              <p className="text-sm text-slate-600">Account Number</p>
              <p className="font-mono font-bold text-lg text-slate-900">1234 5678 9001</p>
              <p className="text-sm text-slate-600 mt-2">Atas Nama: {groomName} & {brideName}</p>
            </div>

            <button className="w-full rounded-lg bg-slate-900 text-white py-3 font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2">
              <Copy className="w-5 h-5" /> Salin Nomor Rekening
            </button>
          </div>
        </div>
      </div>

      {/* Thank You Section */}
      <div className="py-20 sm:py-28 bg-gradient-to-b from-white/50 to-[#f9f5f1]">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6 max-w-2xl mx-auto">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-600 font-semibold">Penutup</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900">Terima Kasih</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Terima kasih telah meluangkan waktu untuk menjadi bagian dari hari istimewa kami. Doa dan restu dari Anda sangat berarti bagi kami. Sampai jumpa di acara pernikahan!
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <CopyLinkButton link={invitation.invitationLink} label="Bagikan Undangan" />
              <button className="inline-flex items-center gap-2 rounded-full border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-50 transition">
                <Share2 className="w-5 h-5" /> Bagikan di Media Sosial
              </button>
            </div>

            <div className="pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-500">Created with ❤️ using Katalog Undangan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
