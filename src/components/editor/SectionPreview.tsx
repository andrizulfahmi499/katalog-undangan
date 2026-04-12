'use client'

import { motion } from 'framer-motion'
import type { EditorSectionItem } from '@/lib/invitationEditorConfig'

interface SectionPreviewProps {
  section: EditorSectionItem
  primaryColor: string
  title: string
  eventName: string
  eventDate: string
  location: string
  backgroundImageUrl: string
}

export default function SectionPreview({
  section,
  primaryColor,
  title,
  eventName,
  eventDate,
  location,
  backgroundImageUrl,
}: SectionPreviewProps) {
  const c = section.content ?? {}
  const color = primaryColor || '#6C5CE7'

  if (section.id === 'opening') {
    return (
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{
          backgroundImage: backgroundImageUrl?.trim()
            ? `url(${backgroundImageUrl.trim()})`
            : 'url(https://assets.satumomen.com/images/invitation/bg-section-90534941775604513.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '320px',
        }}
      >
        <div className="absolute inset-0 bg-black/25" />
        {/* Frame Left */}
        <div
          className="absolute left-0 top-0 h-full w-10 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to right, rgba(120,40,40,0.8) 0%, transparent 100%)' }}
        >
          <div className="h-full flex flex-col justify-between py-3 pl-1.5">
            {[...Array(6)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-yellow-300/60" />)}
          </div>
        </div>
        {/* Frame Right */}
        <div
          className="absolute right-0 top-0 h-full w-10 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to left, rgba(120,40,40,0.8) 0%, transparent 100%)' }}
        >
          <div className="h-full flex flex-col justify-between py-3 pr-1.5 items-end">
            {[...Array(6)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-yellow-300/60" />)}
          </div>
        </div>
        <div className="relative z-20 flex flex-col items-center justify-between px-12 pt-6 pb-8" style={{ minHeight: '320px' }}>
          <div className="text-center mt-2">
            <p className="text-white/90 text-xs tracking-widest uppercase mb-1">{c.subtitle || 'The Wedding Of'}</p>
            <h1 className="text-white font-bold leading-tight" style={{ fontSize: '1.8rem', fontFamily: 'Georgia, serif', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              {c.title || title}
            </h1>
          </div>
          <div className="w-full flex flex-col items-center gap-3 mt-4">
            <div className="text-center px-4 py-3 rounded-xl w-full max-w-[200px]" style={{ backgroundColor: 'rgba(255,255,255,0.77)', backdropFilter: 'blur(2px)' }}>
              <p className="text-gray-700 text-xs mb-0.5">Kepada Yth.<br />Bapak/Ibu/Saudara/i</p>
              <p className="font-bold text-sm mb-0.5" style={{ color }}>{c.guest || 'Tamu Undangan'}</p>
              <p className="text-gray-600 text-xs">{c.place || 'di Tempat'}</p>
            </div>
            <button className="px-6 py-2 rounded-full text-white text-xs font-semibold shadow-lg" style={{ backgroundColor: color }}>
              Open Invitation
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (section.id === 'quotes') {
    return (
      <div className="rounded-xl p-5 text-center" style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)`, border: `1px solid ${color}30` }}>
        <p className="text-sm italic text-gray-700 leading-relaxed">"{c.verse || 'Ayat Al-Quran...'}"</p>
        <p className="text-xs font-semibold mt-2" style={{ color }}>{c.source || '(QS ...)'}</p>
      </div>
    )
  }

  if (section.id === 'groom') {
    return (
      <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl flex-shrink-0">👨</div>
        <div>
          <p className="text-xs uppercase tracking-wider font-bold" style={{ color }}>Mempelai Pria</p>
          <p className="font-semibold text-gray-800 text-sm mt-0.5">{c.name || 'Nama Mempelai Pria'}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{c.parents || 'Putra dari ...'}</p>
        </div>
      </div>
    )
  }

  if (section.id === 'bride') {
    return (
      <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl flex-shrink-0">👰</div>
        <div>
          <p className="text-xs uppercase tracking-wider font-bold" style={{ color }}>Mempelai Wanita</p>
          <p className="font-semibold text-gray-800 text-sm mt-0.5">{c.name || 'Nama Mempelai Wanita'}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{c.parents || 'Putri dari ...'}</p>
        </div>
      </div>
    )
  }

  if (section.id === 'event') {
    return (
      <div className="rounded-xl p-4 space-y-2" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
        <p className="font-semibold text-gray-800 text-sm">{c.eventTitle || eventName}</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div><span className="font-medium text-gray-500">Tanggal:</span><br />{c.date || eventDate}</div>
          <div><span className="font-medium text-gray-500">Waktu:</span><br />{c.time || '00.00 - Selesai'}</div>
          <div className="col-span-2"><span className="font-medium text-gray-500">Tempat:</span><br />{c.venue || location}<br /><span className="text-gray-400">{c.address || ''}</span></div>
        </div>
      </div>
    )
  }

  if (section.id === 'maps') {
    return (
      <div className="rounded-xl p-4" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
        <p className="font-semibold text-gray-800 text-sm">{c.venueName || 'Nama Venue'}</p>
        <p className="text-xs text-gray-500 mt-1">{c.address || 'Alamat venue...'}</p>
        <div className="mt-3 h-20 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-400">
          📍 Google Maps Preview
        </div>
        {c.mapsUrl && (
          <a href={c.mapsUrl} target="_blank" rel="noreferrer" className="mt-2 block text-xs font-semibold text-center py-1.5 rounded-lg" style={{ color, border: `1px solid ${color}40` }}>
            Buka Maps
          </a>
        )}
      </div>
    )
  }

  if (section.id === 'countdown') {
    const target = c.targetDate ? new Date(c.targetDate) : new Date(eventDate)
    const now = new Date()
    const diff = target.getTime() - now.getTime()
    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
    return (
      <div className="rounded-xl p-4 text-center" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
        <p className="text-xs text-gray-500 mb-2">Menuju Hari Bahagia</p>
        <div className="flex justify-center gap-3">
          {[{ v: days, l: 'Hari' }, { v: 0, l: 'Jam' }, { v: 0, l: 'Menit' }].map(({ v, l }) => (
            <div key={l} className="text-center">
              <div className="text-2xl font-bold" style={{ color }}>{v}</div>
              <div className="text-xs text-gray-400">{l}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (section.id === 'yangMengundang') {
    return (
      <div className="rounded-xl p-4 text-center" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Yang Mengundang</p>
        <p className="text-sm text-gray-700 leading-relaxed">{c.families || 'Nama Keluarga'}</p>
      </div>
    )
  }

  if (section.id === 'turutMengundang') {
    return (
      <div className="rounded-xl p-4" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Turut Mengundang</p>
        <div className="space-y-1 text-xs text-gray-600">
          <p>{c.maleSide || 'Keluarga Pria'}</p>
          <p>{c.femaleSide || 'Keluarga Wanita'}</p>
        </div>
      </div>
    )
  }

  if (section.id === 'gallery') {
    return (
      <div className="rounded-xl p-3" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
        <p className="text-xs text-gray-500 mb-2">Gallery Foto</p>
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">📷</div>
          ))}
        </div>
      </div>
    )
  }

  if (section.id === 'rsvp') {
    return (
      <div className="rounded-xl p-4" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
        <p className="text-xs text-gray-500 mb-3">{c.message || 'Konfirmasi kehadiran Anda'}</p>
        <input type="text" placeholder="Nama Anda" className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 mb-2 outline-none" readOnly />
        <div className="flex gap-2 mb-2">
          <button className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 text-gray-600">Hadir</button>
          <button className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 text-gray-600">Tidak Hadir</button>
        </div>
        <button className="w-full text-xs py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: color }}>
          Kirim Konfirmasi
        </button>
      </div>
    )
  }

  if (section.id === 'gift') {
    return (
      <div className="rounded-xl p-4" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Wedding Gift</p>
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <p className="text-xs font-bold text-gray-700">{c.bankName || 'BCA'}</p>
          <p className="text-sm font-mono font-bold mt-1" style={{ color }}>{c.accountNumber || '0000 0000 0000'}</p>
          <p className="text-xs text-gray-500">{c.accountName || 'Atas Nama'}</p>
        </div>
        {c.address && <p className="text-xs text-gray-400 mt-2">📍 {c.address}</p>}
      </div>
    )
  }

  if (section.id === 'thanks') {
    return (
      <div className="rounded-xl p-4 text-center" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
        <p className="text-lg font-bold" style={{ color }}>{c.groomName || 'Akbar'} & {c.brideName || 'Madia'}</p>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{c.message || 'Terima kasih atas kehadiran Anda'}</p>
      </div>
    )
  }

  // Generic fallback
  return (
    <div className="rounded-xl p-4" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
      <p className="text-xs text-gray-500">Preview section: <span className="font-semibold">{section.label}</span></p>
      {Object.entries(c).map(([k, v]) => (
        <p key={k} className="text-xs text-gray-600 mt-1"><span className="font-medium">{k}:</span> {v}</p>
      ))}
    </div>
  )
}
