'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, Palette, Image as ImageIcon,
  Users, Settings, Search, Download, Share2, Upload,
  Crop, Sliders, Circle, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Heart, Bell, Flower2, Bird, Leaf, Pen,
  Gem, ChevronDown, Plus, Maximize2, Eye, X, Check,
  Save, ArrowLeft, RefreshCw,
} from 'lucide-react'
import BanjarTemplate from '@/components/BanjarTemplate'
import { DEFAULT_EDITOR_SECTIONS } from '@/lib/invitationEditorConfig'

/* ─── Types ─── */
type InvitationData = {
  id?: string
  title: string
  eventName: string
  eventDate: string
  location: string
  groomName: string
  brideName: string
  groomParents: string
  brideParents: string
  coverImage: string
  coupleImage: string
  backgroundImage: string
  semakImage: string
  musicUrl: string
  quote: string
  eventTitle: string
  eventTime: string
  eventVenue: string
  eventAddress: string
  bankName: string
  accountNumber: string
  accountName: string
  giftAddress: string
  closingMessage: string
  dresscodeColors: string[]
  fontFamily: string
  accentColor: string
  fontSize: string
}

const DEFAULT_DATA: InvitationData = {
  title: 'Akbar & Madia',
  eventName: 'Resepsi Pernikahan',
  eventDate: '2026-04-16',
  location: 'Dusun Silandar Desa Posona',
  groomName: 'Ahmad Akbar',
  brideName: 'Rahmadia',
  groomParents: 'Putra dari Bpk. Mansur Mading dan Ibu Ratnawati Baharuddin',
  brideParents: 'Putri dari Bpk. Marwan Mahmud (Alm) dan Ibu Rapia Hasan L Karama',
  coverImage: '/templates/banjar/images/cover-img.webp',
  coupleImage: '/templates/banjar/images/couple-img.webp',
  backgroundImage: '/templates/banjar/images/background-img.webp',
  semakImage: '/templates/banjar/images/semak-img.webp',
  musicUrl: '',
  quote: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri...',
  eventTitle: 'Mapparola',
  eventTime: '11.00 Wita - Selesai',
  eventVenue: 'Dusun Silandar Desa Posona',
  eventAddress: 'Kec Kasimbar',
  bankName: 'BCA',
  accountNumber: '12345678',
  accountName: 'Atas Nama Rekening',
  giftAddress: 'Jl. Wildan Sari 1 No 11 Banjarmasin Barat 70119',
  closingMessage: "Atas kehadiran dan do'a restunya kami ucapkan terima kasih.",
  dresscodeColors: ['#faf8f5', '#e2b714', '#7c0f16', '#3d2b24'],
  fontFamily: 'Great Vibes',
  accentColor: '#D4AF37',
  fontSize: '32px',
}

const FONT_OPTIONS = ['Great Vibes', 'Marcellus', 'Lora', 'Playfair Display', 'Cormorant Garamond', 'Georgia']

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'invites', label: 'My Invites', icon: FileText },
  { id: 'editor', label: 'Editor', icon: Palette },
  { id: 'media', label: 'Media Gallery', icon: ImageIcon },
  { id: 'guests', label: 'Guests', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const ELEMENT_ICONS = [
  { id: 'rings', icon: Gem, label: 'Rings' },
  { id: 'heart', icon: Heart, label: 'Heart' },
  { id: 'bell', icon: Bell, label: 'Bell' },
  { id: 'bouquet', icon: Flower2, label: 'Bouquet' },
  { id: 'bird', icon: Bird, label: 'Bird' },
  { id: 'leaf', icon: Leaf, label: 'Leaf' },
  { id: 'pen', icon: Pen, label: 'Pen' },
]

const COLOR_SWATCHES = ['#D4AF37', '#7c0f16', '#2a1515', '#3d2b24', '#e2b714', '#faf8f5', '#806c64', '#ffffff']

export default function ParallaxEditorPage() {
  const [data, setData] = useState<InvitationData>(DEFAULT_DATA)
  const [activeTab, setActiveTab] = useState<'text' | 'photos' | 'elements' | 'design'>('photos')
  const [activeNav, setActiveNav] = useState('editor')
  const [saved, setSaved] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewKey, setPreviewKey] = useState(0)
  const frameRef = useRef<HTMLDivElement>(null)

  const formattedDate = useMemo(() => {
    try {
      return new Date(data.eventDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    } catch { return data.eventDate }
  }, [data.eventDate])

  // Build mock invitation object for live preview
  const mockInvitation = useMemo(() => ({
    id: data.id || 'preview',
    title: `${data.groomName} & ${data.brideName}`,
    templateId: 'banjar-parallax',
    eventDate: data.eventDate,
    editorConfig: {
      version: 1,
      sections: [
        { id: 'opening', label: 'Opening', enabled: true, content: { subtitle: 'The Wedding Of', title: `${data.groomName} & ${data.brideName}`, guest: 'Tamu Undangan', place: data.location } },
        { id: 'quotes', label: 'Quotes', enabled: true, content: { verse: data.quote, source: '(QS Ar-Rum : 21)' } },
        { id: 'groom', label: 'Groom', enabled: true, content: { name: data.groomName, parents: data.groomParents, instagram: '' } },
        { id: 'bride', label: 'Bride', enabled: true, content: { name: data.brideName, parents: data.brideParents, instagram: '' } },
        { id: 'event', label: 'Event', enabled: true, content: { eventTitle: data.eventTitle, date: formattedDate, time: data.eventTime, venue: data.eventVenue, address: data.eventAddress } },
        { id: 'countdown', label: 'Countdown', enabled: true, content: { targetDate: data.eventDate + 'T11:00' } },
        { id: 'yangMengundang', label: 'Yang Mengundang', enabled: true, content: { families: data.groomParents } },
        { id: 'turutMengundang', label: 'Turut Mengundang', enabled: true, content: { maleSide: '', femaleSide: '' } },
        { id: 'gallery', label: 'Gallery', enabled: true, content: {} },
        { id: 'rsvp', label: 'RSVP', enabled: true, content: { message: 'Mohon konfirmasi kehadiran Anda' } },
        { id: 'gift', label: 'Gift', enabled: true, content: { bankName: data.bankName, accountNumber: data.accountNumber, accountName: data.accountName, address: data.giftAddress } },
        { id: 'thanks', label: 'Thanks', enabled: true, content: { groomName: data.groomName, brideName: data.brideName, message: data.closingMessage } },
      ],
      ui: { primaryColor: data.accentColor, backgroundColor: '#faf8f5', backgroundImageUrl: '', musicUrl: data.musicUrl, musicEnabled: !!data.musicUrl },
      isActive: true,
      invitationType: 'scroll',
    },
  }), [data, formattedDate])

  const handleResetPreview = useCallback(() => {
    setPreviewKey(k => k + 1)
  }, [])

  // Load invitation data if editing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (id) {
      fetch(`/api/admin/invitations/${id}?_t=${Date.now()}`, { cache: 'no-store' })
        .then(r => r.json())
        .then(d => {
          if (d.success && d.data) {
            const inv = d.data
            const [groom, bride] = (inv.title || '').split(/\s*&\s*/).map((n: string) => n.trim())
            setData(prev => ({
              ...prev,
              id: inv.id,
              title: inv.title || prev.title,
              eventName: inv.eventName || prev.eventName,
              eventDate: inv.eventDate ? new Date(inv.eventDate).toISOString().slice(0, 10) : prev.eventDate,
              location: inv.location || prev.location,
              groomName: groom || prev.groomName,
              brideName: bride || prev.brideName,
            }))
          }
        })
        .catch(() => {})
    }
  }, [])

  const update = useCallback(<K extends keyof InvitationData>(key: K, value: InvitationData[K]) => {
    setData(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }, [])

  const handleSave = useCallback(async () => {
    setSaved(true)
    // Would save to API here
    if (data.id) {
      try {
        await fetch(`/api/admin/invitations/${data.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `${data.groomName} & ${data.brideName}`,
            eventName: data.eventName,
            eventDate: data.eventDate,
            location: data.location,
            templateId: 'banjar-parallax',
          }),
        })
      } catch {}
    }
  }, [data])

  const handlePreview = useCallback(() => {
    if (data.id) {
      window.open(`/invitation/${data.id}`, '_blank')
    }
    setShowPreview(false)
  }, [data.id])

  return (
    <div className="h-screen flex bg-[#f0f4f3] overflow-hidden font-sans">
      {/* ═══ LEFT SIDEBAR ═══ */}
      <aside className="w-60 bg-[#1a3a3a] flex flex-col text-white shrink-0">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">Editor Undangan</h1>
              <p className="text-[10px] text-teal-300 leading-tight">3D Parallax Builder</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            const isActive = activeNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-teal-600/30 text-teal-200 font-semibold'
                    : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Back to dashboard */}
        <div className="px-3 pb-3 space-y-1 border-t border-white/10 pt-3">
          <a href="/admin/dashboard" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white/90 hover:bg-white/5 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Dashboard Admin
          </a>
          <a href="/admin/editor" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white/90 hover:bg-white/5 transition-all">
            <FileText className="w-4 h-4" />
            Editor Klasik
          </a>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm">
              {saved ? (
                <><Check className="w-4 h-4 text-green-500" /><span className="text-green-600 font-medium">Status: Saved</span></>
              ) : (
                <><span className="w-2 h-2 bg-amber-400 rounded-full" /><span className="text-amber-600 font-medium">Unsaved</span></>
              )}
            </div>
            <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors">
              <Download className="w-4 h-4" /> Save
            </button>
            <button onClick={handlePreview} className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 hover:bg-teal-700 rounded-lg text-sm font-medium text-white transition-colors">
              <Share2 className="w-4 h-4" /> Preview
            </button>
          </div>
        </header>

        {/* Editor Body */}
        <div className="flex-1 flex min-h-0">
          {/* ═══ CENTER PREVIEW ═══ */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#e8f0ee] min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-bold text-slate-800">Banjar 3D Parallax</h2>
              <button onClick={handleResetPreview} className="p-1.5 rounded-lg bg-white/80 hover:bg-white shadow-sm transition-colors" title="Reset preview (splash)">
                <RefreshCw className="w-4 h-4 text-slate-500" />
              </button>
              <button onClick={() => setShowPreview(true)} className="p-1.5 rounded-lg bg-white/80 hover:bg-white shadow-sm transition-colors" title="Expand preview">
                <Maximize2 className="w-4 h-4 text-slate-500" />
              </button>
              <button className="p-1.5 rounded-lg bg-white/80 hover:bg-white shadow-sm transition-colors" title="Add element">
                <Plus className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Phone Preview Frame */}
            <div className="relative w-full max-w-[340px] mx-auto" ref={frameRef}>
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-[#1a3a3a] bg-[#1a3a3a]" style={{ transform: 'translateZ(0)' }}>
                <div className="bg-[#1a3a3a] h-5 flex items-center justify-center">
                  <div className="w-16 h-2.5 bg-black rounded-full" />
                </div>
                <div className="bg-white overflow-hidden relative" style={{ height: '580px' }}>
                  {/* Live BanjarTemplate Preview */}
                  <div key={previewKey} className="w-full h-full overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <BanjarTemplate invitation={mockInvitation} formattedDate={formattedDate} frameRef={frameRef} />
                  </div>
                </div>
                <div className="bg-[#1a3a3a] h-4 flex items-center justify-center">
                  <div className="w-20 h-1 bg-gray-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* ═══ RIGHT PANEL ═══ */}
          <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              {(['text', 'photos', 'elements', 'design'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium transition-colors capitalize relative ${
                    activeTab === tab ? 'text-teal-700' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-teal-600" />}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <AnimatePresence mode="wait">
                {/* ═══ TEXT TAB ═══ */}
                {activeTab === 'text' && (
                  <motion.div key="text" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
                    <h3 className="text-sm font-bold text-slate-800">Text Editor</h3>

                    <Field label="Nama Mempelai">
                      <input type="text" value={`${data.groomName} & ${data.brideName}`} onChange={e => {
                        const [g, b] = e.target.value.split('&').map(s => s.trim())
                        update('groomName', g || ''); update('brideName', b || '')
                      }} className="editor-input" />
                    </Field>

                    <Field label="Nama Mempelai Pria">
                      <input type="text" value={data.groomName} onChange={e => update('groomName', e.target.value)} className="editor-input" />
                    </Field>
                    <Field label="Nama Mempelai Wanita">
                      <input type="text" value={data.brideName} onChange={e => update('brideName', e.target.value)} className="editor-input" />
                    </Field>
                    <Field label="Orang Tua Pria">
                      <input type="text" value={data.groomParents} onChange={e => update('groomParents', e.target.value)} className="editor-input" />
                    </Field>
                    <Field label="Orang Tua Wanita">
                      <input type="text" value={data.brideParents} onChange={e => update('brideParents', e.target.value)} className="editor-input" />
                    </Field>

                    <Field label="Judul Acara">
                      <input type="text" value={data.eventTitle} onChange={e => update('eventTitle', e.target.value)} className="editor-input" />
                    </Field>
                    <Field label="Tanggal Acara">
                      <input type="date" value={data.eventDate} onChange={e => update('eventDate', e.target.value)} className="editor-input" />
                    </Field>
                    <Field label="Waktu">
                      <input type="text" value={data.eventTime} onChange={e => update('eventTime', e.target.value)} className="editor-input" />
                    </Field>
                    <Field label="Tempat">
                      <input type="text" value={data.eventVenue} onChange={e => update('eventVenue', e.target.value)} className="editor-input" />
                    </Field>
                    <Field label="Alamat">
                      <textarea value={data.eventAddress} onChange={e => update('eventAddress', e.target.value)} className="editor-input min-h-[60px]" />
                    </Field>

                    <Field label="Kutipan / Quote">
                      <textarea value={data.quote} onChange={e => update('quote', e.target.value)} className="editor-input min-h-[80px]" />
                    </Field>

                    <Field label="Pesan Penutup">
                      <textarea value={data.closingMessage} onChange={e => update('closingMessage', e.target.value)} className="editor-input min-h-[60px]" />
                    </Field>

                    {/* Font controls */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Typography</h4>
                      <Field label="Font">
                        <select value={data.fontFamily} onChange={e => update('fontFamily', e.target.value)} className="editor-input">
                          {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </Field>
                      <Field label="Ukuran">
                        <select value={data.fontSize} onChange={e => update('fontSize', e.target.value)} className="editor-input">
                          {['20px', '24px', '28px', '32px', '36px', '40px', '48px'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </Field>
                      <Field label="Warna Aksen">
                        <div className="flex items-center gap-2">
                          <input type="color" value={data.accentColor} onChange={e => update('accentColor', e.target.value)} className="w-8 h-8 rounded border border-slate-200 cursor-pointer" />
                          <input type="text" value={data.accentColor} onChange={e => update('accentColor', e.target.value)} className="editor-input flex-1" />
                        </div>
                      </Field>
                    </div>
                  </motion.div>
                )}

                {/* ═══ PHOTOS TAB ═══ */}
                {activeTab === 'photos' && (
                  <motion.div key="photos" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
                    <h3 className="text-sm font-bold text-slate-800">Photos</h3>

                    {/* Couple Photos */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-2">Couple Photos</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[data.coverImage, data.coupleImage, data.backgroundImage].map((src, i) => (
                          <div key={i} className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors">
                          <Upload className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-[10px] text-slate-400">Upload</span>
                          <input type="file" accept="image/*" className="hidden" />
                        </label>
                      </div>
                    </div>

                    {/* Individual image controls */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Image Settings</h4>

                      <PhotoField label="Cover Image" value={data.coverImage} onChange={v => update('coverImage', v)} />
                      <PhotoField label="Couple Image" value={data.coupleImage} onChange={v => update('coupleImage', v)} />
                      <PhotoField label="Background Image" value={data.backgroundImage} onChange={v => update('backgroundImage', v)} />
                      <PhotoField label="Semak Decoration" value={data.semakImage} onChange={v => update('semakImage', v)} />
                    </div>

                    {/* Scale & Opacity */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Adjustments</h4>
                      <div className="flex items-center gap-2">
                        <Crop className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-500">Crop</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-500 w-12">Scale</span>
                        <input type="range" min={50} max={200} defaultValue={100} className="flex-1 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-teal-600" />
                        <span className="text-xs text-slate-500 w-8 text-right">100%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-500 w-12">Opacity</span>
                        <input type="range" min={0} max={100} defaultValue={100} className="flex-1 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-teal-600" />
                        <span className="text-xs text-slate-500 w-8 text-right">100%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Circle className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-500 w-12">Border</span>
                        <input type="color" value="#ffd700" className="w-6 h-6 rounded border border-slate-200 cursor-pointer" />
                        <span className="text-xs text-slate-400">#FFD700</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ═══ ELEMENTS TAB ═══ */}
                {activeTab === 'elements' && (
                  <motion.div key="elements" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
                    <h3 className="text-sm font-bold text-slate-800">Elements</h3>

                    <div className="flex gap-2 mb-3">
                      <button className="px-3 py-1.5 bg-teal-600 text-white text-xs font-medium rounded-lg">Elements</button>
                      <button className="px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-lg hover:bg-slate-200">Motifs</button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {ELEMENT_ICONS.map(el => {
                        const Icon = el.icon
                        return (
                          <button key={el.id} className="aspect-square rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center hover:border-teal-400 hover:bg-teal-50 transition-colors group">
                            <Icon className="w-6 h-6 text-slate-400 group-hover:text-teal-600 transition-colors" />
                            <span className="text-[10px] text-slate-400 mt-1">{el.label}</span>
                          </button>
                        )
                      })}
                      {/* Color squares */}
                      {['#D4AF37', '#7c0f16', '#2a1515'].map(c => (
                        <button key={c} className="aspect-square rounded-xl border border-slate-200 hover:scale-105 transition-transform" style={{ backgroundColor: c }} />
                      ))}
                    </div>

                    {/* Parallax Layer Controls */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Parallax Layers</h4>
                      {[
                        { name: 'Background', depth: 2 },
                        { name: 'Cover Image', depth: 4 },
                        { name: 'Couple', depth: 5 },
                        { name: 'Semak Left', depth: 10 },
                        { name: 'Semak Right', depth: 10 },
                      ].map(layer => (
                        <div key={layer.name} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                          <div className="w-2 h-2 rounded-full bg-teal-500" />
                          <span className="text-xs text-slate-700 flex-1">{layer.name}</span>
                          <span className="text-[10px] text-slate-400">depth: {layer.depth}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ═══ DESIGN TAB ═══ */}
                {activeTab === 'design' && (
                  <motion.div key="design" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
                    <h3 className="text-sm font-bold text-slate-800">Design</h3>

                    <Field label="Warna Aksen">
                      <div className="flex flex-wrap gap-2">
                        {COLOR_SWATCHES.map(c => (
                          <button
                            key={c}
                            onClick={() => update('accentColor', c)}
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${data.accentColor === c ? 'border-teal-600 scale-110' : 'border-slate-200'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </Field>

                    <Field label="Dresscode Colors">
                      <div className="flex items-center gap-2 flex-wrap">
                        {data.dresscodeColors.map((c, i) => (
                          <div key={i} className="relative group">
                            <input
                              type="color"
                              value={c}
                              onChange={e => {
                                const colors = [...data.dresscodeColors]
                                colors[i] = e.target.value
                                update('dresscodeColors', colors)
                              }}
                              className="w-10 h-10 rounded-full border-2 border-white shadow-md cursor-pointer"
                            />
                            <button
                              onClick={() => update('dresscodeColors', data.dresscodeColors.filter((_, j) => j !== i))}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => update('dresscodeColors', [...data.dresscodeColors, '#cccccc'])}
                          className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center hover:border-teal-400 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </Field>

                    {/* Gift / Bank Info */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Kado Digital</h4>
                      <Field label="Bank">
                        <input type="text" value={data.bankName} onChange={e => update('bankName', e.target.value)} className="editor-input" />
                      </Field>
                      <Field label="No. Rekening">
                        <input type="text" value={data.accountNumber} onChange={e => update('accountNumber', e.target.value)} className="editor-input" />
                      </Field>
                      <Field label="Atas Nama">
                        <input type="text" value={data.accountName} onChange={e => update('accountName', e.target.value)} className="editor-input" />
                      </Field>
                      <Field label="Alamat Kirim Kado">
                        <textarea value={data.giftAddress} onChange={e => update('giftAddress', e.target.value)} className="editor-input min-h-[60px]" />
                      </Field>
                    </div>

                    {/* Music */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Music</h4>
                      <Field label="URL Audio">
                        <input type="text" value={data.musicUrl} onChange={e => update('musicUrl', e.target.value)} placeholder="https://..." className="editor-input" />
                      </Field>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </div>

      {/* ═══ EXPANDED PREVIEW MODAL ═══ */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Live Preview</h3>
                <button onClick={() => setShowPreview(false)} className="p-1 hover:bg-slate-100 rounded-full">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div style={{ height: '80vh' }}>
                <div key={`modal-${previewKey}`} className="w-full h-full overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                  <BanjarTemplate invitation={mockInvitation} formattedDate={formattedDate} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global styles for editor inputs */}
      <style jsx global>{`
        .editor-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.8125rem;
          color: #334155;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .editor-input:focus {
          border-color: #0d9488;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }
        .editor-input::placeholder { color: #94a3b8; }
        select.editor-input { appearance: auto; }
      `}</style>
    </div>
  )
}

/* ─── Helper Components ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function PhotoField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
        <img src={value} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-700">{label}</p>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full text-[10px] text-slate-400 bg-transparent border-0 p-0 outline-none truncate"
        />
      </div>
      <label className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors shrink-0">
        <Upload className="w-3 h-3 text-slate-400" />
        <input type="file" accept="image/*" className="hidden" />
      </label>
    </div>
  )
}
