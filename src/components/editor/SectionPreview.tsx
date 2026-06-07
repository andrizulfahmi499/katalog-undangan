'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { EditorSectionItem } from '@/lib/invitationEditorConfig'

// ─── localStorage helpers ───────────────────────────────────────
const GALLERY_KEY = (id: string) => `dreamland-gallery-${id}`
const GROOM_KEY  = (id: string) => `dreamland-groom-photo-${id}`
const BRIDE_KEY  = (id: string) => `dreamland-bride-photo-${id}`

function loadLS(key: string): string | null {
  if (typeof window === 'undefined') return null
  try { return localStorage.getItem(key) } catch { return null }
}
function saveLS(key: string, v: string) {
  try { localStorage.setItem(key, v) } catch {}
}
function loadGallery(id: string): string[] {
  const r = loadLS(GALLERY_KEY(id))
  if (r) try { return JSON.parse(r) } catch {}
  return []
}
function saveGallery(id: string, arr: string[]) {
  saveLS(GALLERY_KEY(id), JSON.stringify(arr))
}
function fileToB64(f: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result as string)
    r.onerror = rej
    r.readAsDataURL(f)
  })
}

// ─── DreamLand paths ────────────────────────────────────────────
const DL = '/templates/dream-land'

// ─── Props ──────────────────────────────────────────────────────
interface SectionPreviewProps {
  section: EditorSectionItem
  primaryColor: string
  title: string
  eventName: string
  eventDate: string
  location: string
  backgroundImageUrl: string
  templateId?: string
  invitationId?: string
}

// ─── Shared Photo Upload Widget ─────────────────────────────────
function PhotoUpload({
  label, storageKey, defaultSrc, shape = 'circle',
}: {
  label: string; storageKey: string; defaultSrc: string; shape?: 'circle' | 'square'
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [src, setSrc] = useState(defaultSrc)

  useEffect(() => {
    const stored = loadLS(storageKey)
    if (stored) setSrc(stored)
  }, [storageKey])

  const handle = useCallback(async (files: FileList | null) => {
    if (!files?.[0]) return
    const b64 = await fileToB64(files[0])
    setSrc(b64)
    saveLS(storageKey, b64)
  }, [storageKey])

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative overflow-hidden cursor-pointer group ${shape === 'circle' ? 'w-20 h-20 rounded-full' : 'w-full aspect-square rounded-xl'} bg-gray-100 border-2 border-dashed border-gray-300 hover:border-[#6C5CE7] transition-colors`}
        onClick={() => ref.current?.click()}
      >
        <img src={src} alt={label} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-center px-1">
            📷 Ganti
          </span>
        </div>
      </div>
      <span className="text-xs text-gray-500">{label}</span>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => handle(e.target.files)} />
    </div>
  )
}

// ─── Gallery Upload Widget ──────────────────────────────────────
function GalleryUpload({ invitationId }: { invitationId: string }) {
  const ref = useRef<HTMLInputElement>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [replaceIdx, setReplaceIdx] = useState<number | null>(null)

  useEffect(() => {
    setPhotos(loadGallery(invitationId))
  }, [invitationId])

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files) return
    const next = [...photos]
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.startsWith('image/')) continue
      const b64 = await fileToB64(files[i])
      if (replaceIdx !== null) {
        next[replaceIdx] = b64
        setReplaceIdx(null)
      } else if (next.length < 12) {
        next.push(b64)
      }
    }
    setPhotos(next)
    saveGallery(invitationId, next)
  }, [photos, invitationId, replaceIdx])

  const handleDelete = (i: number) => {
    const next = photos.filter((_, idx) => idx !== i)
    setPhotos(next)
    saveGallery(invitationId, next)
  }

  return (
    <div>
      <input ref={ref} type="file" accept="image/*" multiple className="hidden"
        onChange={e => handleUpload(e.target.files)} />
      <div className="grid grid-cols-3 gap-1.5">
        {photos.map((p, i) => (
          <div key={i} className="aspect-square rounded-lg relative overflow-hidden group cursor-pointer">
            <img src={p} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
              <button onClick={() => { setReplaceIdx(i); ref.current?.click() }}
                className="p-1 rounded-full bg-white/90 text-gray-700 text-xs" title="Ganti">✏️</button>
              <button onClick={() => handleDelete(i)}
                className="p-1 rounded-full bg-red-500/90 text-white text-xs" title="Hapus">🗑️</button>
            </div>
          </div>
        ))}
        {photos.length < 12 && (
          <button onClick={() => { setReplaceIdx(null); ref.current?.click() }}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-[#6C5CE7] flex items-center justify-center text-gray-400 hover:text-[#6C5CE7] transition-colors">
            <span className="text-2xl">+</span>
          </button>
        )}
      </div>
      {photos.length === 0 && (
        <p className="text-xs text-gray-400 mt-2 text-center">Belum ada foto. Klik + untuk upload.</p>
      )}
      <p className="text-xs text-gray-400 mt-1 text-center">{photos.length}/12 foto</p>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────
export default function SectionPreview({
  section, primaryColor, title, eventName, eventDate, location, backgroundImageUrl,
  templateId, invitationId,
}: SectionPreviewProps) {
  const c = section.content ?? {}
  const color = primaryColor || '#6C5CE7'
  const isDreamLand = templateId === 'dream-land'
  const invId = invitationId || 'default'
  // category (new pages) takes priority over legacy id
  const sectionType = (section as any).category || section.id

  // ── OPENING ──
  if (sectionType === 'opening') {
    if (isDreamLand) {
      return (
        <div className="relative w-full overflow-hidden rounded-xl" style={{
          backgroundImage: `url(${DL}/bg-5.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '280px',
        }}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-20 flex flex-col items-center justify-center px-6 py-8" style={{ minHeight: '280px' }}>
            <p className="font-michelia text-[#b1914f] text-xs mb-1">{c.subtitle || 'The Wedding Of'}</p>
            <h1 className="font-cormorantSemiBold text-white text-xl text-center" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              {c.title || title}
            </h1>
            {c.guest && (
              <div className="text-center mt-3 px-4 py-2 rounded-xl bg-white/70 backdrop-blur-sm">
                <p className="text-gray-600 text-xs">Kepada Yth.</p>
                <p className="font-cormorantSemiBold text-[#775D34] text-sm">{c.guest}</p>
              </div>
            )}
            <button className="mt-4 px-5 py-1.5 rounded-full bg-[#F6EAD3] text-[#777] text-xs font-cormorant shadow-lg">
              Buka Undangan
            </button>
          </div>
        </div>
      )
    }
    // Generic opening
    return (
      <div className="relative w-full overflow-hidden rounded-xl" style={{
        backgroundImage: backgroundImageUrl?.trim()
          ? `url(${backgroundImageUrl.trim()})`
          : 'url(https://assets.satumomen.com/images/invitation/bg-section-90534941775604513.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '320px',
      }}>
        <div className="absolute inset-0 bg-black/25" />
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
            <button className="px-6 py-2 rounded-full text-white text-xs font-semibold shadow-lg" style={{ backgroundColor: color }}>Open Invitation</button>
          </div>
        </div>
      </div>
    )
  }

  // ── QUOTES ──
  if (sectionType === 'quotes') {
    return (
      <div className="rounded-xl p-5 text-center" style={{ background: isDreamLand ? `url(${DL}/bg-1.jpg) center/cover` : `linear-gradient(135deg, ${color}15, ${color}05)`, border: isDreamLand ? 'none' : `1px solid ${color}30` }}>
        <p className={`text-sm italic leading-relaxed ${isDreamLand ? 'font-cormorant text-[#555]' : 'text-gray-700'}`}>"{c.verse || 'Ayat Al-Quran...'}"</p>
        <p className={`text-xs font-semibold mt-2 ${isDreamLand ? 'font-cormorant text-[#775D34]' : ''}`} style={isDreamLand ? {} : { color }}>{c.source || '(QS ...)'}</p>
      </div>
    )
  }

  // ── GROOM ──
  if (sectionType === 'groom' || sectionType === 'mempelai') {
    return (
      <div className="rounded-xl p-4" style={{ background: isDreamLand ? `url(${DL}/bg-1.jpg) center/cover` : `${color}08`, border: isDreamLand ? 'none' : `1px solid ${color}20` }}>
        <div className="flex items-center gap-4">
          <PhotoUpload
            label="Foto Mempelai Pria"
            storageKey={GROOM_KEY(invId)}
            defaultSrc={isDreamLand ? `${DL}/groom-illustration.webp` : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e5e7eb" width="100" height="100"/><text x="50" y="55" text-anchor="middle" font-size="40">👨</text></svg>'}
            shape="circle"
          />
          <div className="flex-1">
            <p className={`text-xs uppercase tracking-wider font-bold ${isDreamLand ? 'font-cormorant text-[#775D34]' : ''}`} style={isDreamLand ? {} : { color }}>Mempelai Pria</p>
            <p className={`font-semibold text-sm mt-0.5 ${isDreamLand ? 'font-cormorantSemiBold text-[#775D34]' : 'text-gray-800'}`}>{c.name || 'Nama Mempelai Pria'}</p>
            <p className={`text-xs mt-0.5 leading-relaxed ${isDreamLand ? 'font-cormorant text-[#555]' : 'text-gray-500'}`}>{c.parents || 'Putra dari ...'}</p>
          </div>
        </div>
      </div>
    )
  }

  // ── BRIDE ──
  if (sectionType === 'bride') {
    return (
      <div className="rounded-xl p-4" style={{ background: isDreamLand ? `url(${DL}/bg-1.jpg) center/cover` : `${color}08`, border: isDreamLand ? 'none' : `1px solid ${color}20` }}>
        <div className="flex items-center gap-4">
          <PhotoUpload
            label="Foto Mempelai Wanita"
            storageKey={BRIDE_KEY(invId)}
            defaultSrc={isDreamLand ? `${DL}/bride-illustration.webp` : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e5e7eb" width="100" height="100"/><text x="50" y="55" text-anchor="middle" font-size="40">👰</text></svg>'}
            shape="circle"
          />
          <div className="flex-1">
            <p className={`text-xs uppercase tracking-wider font-bold ${isDreamLand ? 'font-cormorant text-[#775D34]' : ''}`} style={isDreamLand ? {} : { color }}>Mempelai Wanita</p>
            <p className={`font-semibold text-sm mt-0.5 ${isDreamLand ? 'font-cormorantSemiBold text-[#775D34]' : 'text-gray-800'}`}>{c.name || 'Nama Mempelai Wanita'}</p>
            <p className={`text-xs mt-0.5 leading-relaxed ${isDreamLand ? 'font-cormorant text-[#555]' : 'text-gray-500'}`}>{c.parents || 'Putri dari ...'}</p>
          </div>
        </div>
      </div>
    )
  }

  // ── EVENT ──
  if (sectionType === 'event' || sectionType === 'acara') {
    return (
      <div className="rounded-xl p-4 space-y-2" style={{ background: isDreamLand ? `url(${DL}/bg-5.jpg) center/cover` : `${color}08`, border: isDreamLand ? 'none' : `1px solid ${color}20` }}>
        <p className={`font-semibold text-sm ${isDreamLand ? 'font-michelia text-[#775D34] text-lg' : 'text-gray-800'}`}>{c.eventTitle || eventName}</p>
        <div className={`grid grid-cols-2 gap-2 text-xs ${isDreamLand ? 'font-cormorant text-[#555]' : 'text-gray-600'}`}>
          <div><span className="font-medium text-gray-500">Tanggal:</span><br />{c.date || eventDate}</div>
          <div><span className="font-medium text-gray-500">Waktu:</span><br />{c.time || '00.00 - Selesai'}</div>
          <div className="col-span-2"><span className="font-medium text-gray-500">Tempat:</span><br />{c.venue || location}<br /><span className="text-gray-400">{c.address || ''}</span></div>
        </div>
      </div>
    )
  }

  // ── MAPS ──
  if (sectionType === 'maps') {
    return (
      <div className="rounded-xl p-4" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
        <p className="font-semibold text-gray-800 text-sm">{c.venueName || 'Nama Venue'}</p>
        <p className="text-xs text-gray-500 mt-1">{c.address || 'Alamat venue...'}</p>
        <div className="mt-3 h-20 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-400">📍 Google Maps Preview</div>
        {c.mapsUrl && (
          <a href={c.mapsUrl} target="_blank" rel="noreferrer" className="mt-2 block text-xs font-semibold text-center py-1.5 rounded-lg" style={{ color, border: `1px solid ${color}40` }}>
            Buka Maps
          </a>
        )}
      </div>
    )
  }

  // ── COUNTDOWN ──
  if (sectionType === 'countdown') {
    const target = c.targetDate ? new Date(c.targetDate) : new Date(eventDate)
    const diff = target.getTime() - Date.now()
    const days = Math.max(0, Math.floor(diff / 86400000))
    if (isDreamLand) {
      return (
        <div className="rounded-xl p-4 text-center" style={{ background: `url(${DL}/bg-4.jpg) center/cover` }}>
          <p className="font-michelia text-[#775D34] text-2xl mb-2">Save the Date</p>
          <div className="flex justify-center gap-2">
            {[{ v: days, l: 'Days' }, { v: 0, l: 'Hours' }, { v: 0, l: 'Min' }, { v: 0, l: 'Sec' }].map(({ v, l }) => (
              <div key={l} className="w-14 h-16 rounded-2xl bg-gradient-to-tr from-[#F6EAD3] to-[#ededed] shadow flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-[#775D34]">{String(v).padStart(2, '0')}</span>
                <span className="text-[10px] font-cormorant italic text-[#555]">{l}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
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

  // ── GALLERY ──
  if (sectionType === 'gallery') {
    const images: any[] = Array.isArray(c.images) ? c.images : []
    const hasPhotos = images.some((img: any) => img.url)
    return (
      <div className="rounded-xl p-3" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
        <p className="text-xs text-gray-500 font-medium mb-2">{c.sectionTitle || 'Gallery Foto'}</p>
        {hasPhotos ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', width: '100%' }}>
            {images.filter((img: any) => img.url).map((img: any, i: number) => (
              <div key={i} style={{ overflow: 'hidden', width: '100%', height: '80px', borderRadius: '0.375rem' }}>
                <img src={img.url} alt={img.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="aspect-square bg-slate-200 rounded-md flex items-center justify-center">
                <span className="text-slate-400 text-xs">📷</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── YANG MENGUNDANG / MENGUNDANG ──
  if (sectionType === 'yangMengundang' || sectionType === 'mengundang') {
    return (
      <div className="rounded-xl p-4 text-center" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Yang Mengundang</p>
        <p className="text-sm text-gray-700 leading-relaxed">{c.families || 'Nama Keluarga'}</p>
      </div>
    )
  }

  // ── TURUT MENGUNDANG / PROTOKOL ──
  if (sectionType === 'turutMengundang' || sectionType === 'protokol') {
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

  // ── RSVP ──
  if (sectionType === 'rsvp') {
    return (
      <div className="rounded-xl p-4" style={{ background: isDreamLand ? `url(${DL}/bg-1.jpg) center/cover` : `${color}08`, border: isDreamLand ? 'none' : `1px solid ${color}20` }}>
        <p className={`text-xs mb-3 ${isDreamLand ? 'font-cormorant text-[#555] text-center' : 'text-gray-500'}`}>{c.message || 'Konfirmasi kehadiran Anda'}</p>
        <div className="flex gap-2 mb-2">
          <button className={`flex-1 text-xs py-1.5 rounded-lg ${isDreamLand ? 'rounded-full bg-[#BABD91] text-white' : 'border border-gray-200 text-gray-600'}`}>Hadir</button>
          <button className={`flex-1 text-xs py-1.5 rounded-lg ${isDreamLand ? 'rounded-full border border-gray-400 text-gray-500' : 'border border-gray-200 text-gray-600'}`}>Tidak Hadir</button>
        </div>
        <button className={`w-full text-xs py-2 rounded-lg text-white font-semibold ${isDreamLand ? 'rounded-full bg-[#BABD91]' : ''}`} style={isDreamLand ? {} : { backgroundColor: color }}>
          Kirim Konfirmasi
        </button>
      </div>
    )
  }

  // ── GIFT ──
  if (sectionType === 'gift') {
    const accounts: any[] = Array.isArray(c.accounts) ? c.accounts : []
    return (
      <div className="rounded-xl p-4" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Wedding Gift</p>
        {accounts.length > 0 ? accounts.map((ac: any, i: number) => (
          <div key={i} className="rounded-lg p-3 bg-white border border-gray-100 mb-2">
            <p className="text-xs font-bold text-gray-700">{ac.bankName}</p>
            <p className="text-sm font-mono font-bold mt-0.5" style={{ color }}>{ac.accountNumber}</p>
            <p className="text-xs text-gray-500">{ac.accountName}</p>
          </div>
        )) : (
          <div className="rounded-lg p-3 bg-white border border-gray-100">
            <p className="text-xs font-bold text-gray-700">{c.bankName || 'BCA'}</p>
            <p className="text-sm font-mono font-bold mt-1" style={{ color }}>{c.accountNumber || '0000 0000 0000'}</p>
            <p className="text-xs text-gray-500">{c.accountName || 'Atas Nama'}</p>
          </div>
        )}
      </div>
    )
  }

  // ── THANKS ──
  if (sectionType === 'thanks') {
    return (
      <div className="rounded-xl p-4 text-center" style={{ background: isDreamLand ? `url(${DL}/bg-1.jpg) center/cover` : `${color}08`, border: isDreamLand ? 'none' : `1px solid ${color}20` }}>
        <p className={`text-lg font-bold ${isDreamLand ? 'font-michelia text-[#775D34]' : ''}`} style={isDreamLand ? {} : { color }}>{c.groomName || 'Akbar'} & {c.brideName || 'Madia'}</p>
        <p className={`text-xs mt-1 leading-relaxed ${isDreamLand ? 'font-cormorant text-[#555] italic' : 'text-gray-500'}`}>{c.message || 'Terima kasih atas kehadiran Anda'}</p>
      </div>
    )
  }

  // ── GENERIC FALLBACK ──
  return (
    <div className="rounded-xl p-4" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
      <p className="text-xs text-gray-500">Preview section: <span className="font-semibold">{section.label}</span></p>
      {Object.entries(c).map(([k, v]) => (
        <p key={k} className="text-xs text-gray-600 mt-1"><span className="font-medium">{k}:</span> {typeof v === 'object' ? JSON.stringify(v) : String(v)}</p>
      ))}
    </div>
  )
}
