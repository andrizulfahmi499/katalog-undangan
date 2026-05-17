'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, Paintbrush, FileText, Users, Settings, ChevronRight, ChevronDown,
  LogOut, Smartphone, Monitor, Menu, X, ArrowLeft, MessageCircle, Send,
  CreditCard, CheckCircle, Clock, Copy, Image, Type, Palette, Music,
  Globe, Heart, Camera, CalendarDays, BookOpen, Video, Gift, Sliders
} from 'lucide-react'

// Types
type Invitation = {
  id: string
  title: string
  eventName: string
  eventDate: string
  location: string
  invitationLink: string
  invitationDomain: string
  templateMessage: string
  costPoints: number
  status: string
  templateId?: string
  invitationMessages: Array<{ id: string; messageTemplate: string }>
  invitationSends: Array<{ id: string; guestName: string; sentAt: string; status: string }>
}

type Guest = {
  name: string
  whatsapp?: string
  email?: string
}

export default function MemberDashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [activeSubMenu, setActiveSubMenu] = useState('preset')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile')
  const [showWizard, setShowWizard] = useState(true)

  // Existing states
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null)
  const [customMessage, setCustomMessage] = useState('')
  const [guests, setGuests] = useState<Guest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSendModal, setShowSendModal] = useState(false)
  const [memberProfile, setMemberProfile] = useState<any>(null)
  const [memberId, setMemberId] = useState<string>('')
  
  // Landing Page Settings
  const [lpSlug, setLpSlug] = useState('')
  const [lpConfig, setLpConfig] = useState<any>({
    logoUrl: '', address: '', whatsappNumber: '',
    socialMedia: { instagram: { enabled: false, url: '' }, tiktok: { enabled: false, url: '' }, facebook: { enabled: false, url: '' }, twitter: { enabled: false, url: '' } },
    themeColor: 'pink',
    pricingPackages: [
      { id: 1, name: 'Basic', price: '150.000', features: 'Masa aktif selamanya\nTanpa Batas Tamu', enabled: true }
    ]
  })
  const [isSavingLp, setIsSavingLp] = useState(false)

  // Initialization
  useEffect(() => {
    const storedMemberId = localStorage.getItem('memberId')
    if (storedMemberId) {
      setMemberId(storedMemberId)
    } else {
      window.location.href = '/login'
    }
  }, [])

  useEffect(() => {
    if (memberId) {
      fetchInvitations()
      fetchProfile()
    }
  }, [memberId])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/member/profile?memberId=${memberId}&_t=${Date.now()}`)
      const data = await response.json()
      if (data.success) {
        setMemberProfile(data.data)
        if (data.data.landingPageConfig) setLpConfig(data.data.landingPageConfig)
        if (data.data.customSlug) setLpSlug(data.data.customSlug)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchInvitations = async () => {
    try {
      const response = await fetch(`/api/member/invitations?memberId=${memberId}&_t=${Date.now()}`, { cache: 'no-store' })
      const data = await response.json()
      if (data.success) {
        setInvitations(data.data)
        if (data.data.length > 0 && !selectedInvitation) {
          setSelectedInvitation(data.data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching invitations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('memberId')
    localStorage.removeItem('memberName')
    localStorage.removeItem('memberEmail')
    window.location.href = '/login'
  }

  // SVG icon paths from our-wedding.link reference
  const svgIcon = (name: string) => `/icons/dashboard/our-wedding.link-${name}.svg`
  
  const [selectedThemeId, setSelectedThemeId] = useState<string>(selectedInvitation?.templateId || 'dreamy-javanese')
  const [showThemeGrid, setShowThemeGrid] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dasbor', svg: svgIcon('4') },
    { id: 'theme', label: 'Tampilan', svg: svgIcon('5'), subMenus: [
      { id: 'preset', label: 'Preset', svg: svgIcon('7') },
      { id: 'warna', label: 'Warna', svg: svgIcon('8') },
      { id: 'font', label: 'Jenis tulisan', svg: svgIcon('9') },
    ]},
    { id: 'content', label: 'Isi', svg: svgIcon('14'), subMenus: [
      { id: 'sampul', label: 'Sampul', svg: svgIcon('10') },
      { id: 'pembukaan', label: 'Pembukaan', svg: svgIcon('11') },
      { id: 'profil', label: 'Profil', svg: svgIcon('12') },
      { id: 'acara', label: 'Detail Acara', svg: svgIcon('2') },
      { id: 'galeri', label: 'Album Foto', svg: svgIcon('12') },
      { id: 'penutup', label: 'Penutup', svg: svgIcon('15') },
    ]},
    { id: 'guest', label: 'Tamu', svg: svgIcon('16') },
    { id: 'settings', label: 'Pengaturan', svg: svgIcon('17'), subMenus: [
      { id: 'musik', label: 'Musik Latar', svg: svgIcon('13') },
      { id: 'landing', label: 'Landing Page', svg: svgIcon('18') },
    ]},
  ]

  const themeList = [
    { id: 'dreamy-javanese', name: 'Dreamy Javanese', cat: 'Premium', img: '/images/themes/dreamy-javanese/585c26d0-e603-11f0-87fb-874a516696dc.jpg' },
    { id: 'royal-garden', name: 'Royal Garden', cat: 'Premium', img: '/icons/bg.webp' },
    { id: 'dream-land', name: 'Dream Land', cat: 'Basic', img: '/icons/flowers.webp' },
    { id: 'verdant', name: 'Verdant Elegance', cat: 'Basic', img: '/icons/right.webp' },
    { id: 'elgaze', name: 'Elgaze Luxury', cat: 'Luxury', img: '/icons/bg-end.webp' },
    { id: 'corelia', name: 'Corelia', cat: 'Basic', img: '/icons/frame-mempelai.webp' },
  ]
  const currentTheme = themeList.find(t => t.id === selectedThemeId) || themeList[0]

  const totalSent = invitations.reduce((sum, inv) => sum + inv.invitationSends.length, 0)
  const totalCreditUsed = invitations.reduce((sum, inv) => sum + inv.costPoints, 0)

  return (
    <div className="flex h-screen bg-[#f4f7f6] overflow-hidden text-slate-800 font-sans">
      {/* 1. SIDEBAR (Left Column) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">Katalog</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-4rem)] p-3 space-y-0.5">
          {menuItems.map((menu) => (
            <div key={menu.id}>
              <button
                onClick={() => {
                  setActiveMenu(menu.id)
                  if (menu.subMenus) setActiveSubMenu(menu.subMenus[0].id)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-200 ${activeMenu === menu.id ? 'bg-[#fce4ec] text-[#e91e63] font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <img src={menu.svg} alt="" className="w-[22px] h-[22px]" />
                <span className="flex-1 text-left text-[14px]">{menu.label}</span>
                {menu.subMenus && <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${activeMenu === menu.id ? 'rotate-90 text-[#e91e63]' : 'text-slate-300'}`} />}
              </button>
              <AnimatePresence>
                {menu.subMenus && activeMenu === menu.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="ml-6 mt-1 space-y-0.5 overflow-hidden border-l-[3px] border-[#f8bbd0] pl-3">
                    {menu.subMenus.map((sub) => (
                      <button key={sub.id} onClick={() => setActiveSubMenu(sub.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-xl transition-all duration-200 ${activeSubMenu === sub.id ? 'text-[#e91e63] font-semibold bg-[#fce4ec]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                        <img src={sub.svg} alt="" className="w-4 h-4" />
                        <span>{sub.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <div className="pt-6 mt-6 border-t border-slate-100">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="text-[14px]">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT (Center Column) */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f4f7f6]">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-40 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-500">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-slate-800 capitalize">
                {activeMenu === 'dashboard' ? 'Selamat Datang, ' + (memberProfile?.name || 'Member') : activeMenu} 
                {activeMenu !== 'dashboard' && activeSubMenu && <span className="text-slate-400 font-normal"> / {activeSubMenu}</span>}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => window.location.href = '/'} className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-2">
               <ArrowLeft className="w-4 h-4" /> Ke Halaman Utama
             </button>
          </div>
        </header>

        {/* Workspace Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          
          {/* Dashboard Stats & Wizard */}
          {activeMenu === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-500"><MessageCircle className="w-7 h-7" /></div>
                  <div><p className="text-sm text-slate-500">Undangan Aktif</p><p className="text-2xl font-bold">{invitations.length}</p></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-500"><Send className="w-7 h-7" /></div>
                  <div><p className="text-sm text-slate-500">Total Dikirim</p><p className="text-2xl font-bold">{totalSent}</p></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500"><CreditCard className="w-7 h-7" /></div>
                  <div><p className="text-sm text-slate-500">Sisa Kredit</p><p className="text-2xl font-bold">100</p></div>
                </div>
              </div>

              {/* Setup Wizard Checklist */}
              {showWizard && (
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-100 to-rose-50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Mari Lengkapi Undanganmu ✨</h2>
                      <p className="text-slate-500 mt-1">Ikuti langkah-langkah berikut untuk mempublikasikan undangan.</p>
                    </div>
                    <button onClick={() => setShowWizard(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'theme', label: 'Pilih Tema Preset', desc: 'Tentukan visual utama undangan', done: true },
                      { id: 'profile', label: 'Isi Data Profil Pasangan', desc: 'Nama mempelai, orang tua, dsb', done: false },
                      { id: 'event', label: 'Atur Jadwal Acara', desc: 'Tanggal akad dan resepsi', done: false },
                      { id: 'gallery', label: 'Upload Galeri Foto', desc: 'Momen spesial kalian', done: false },
                    ].map((step, idx) => (
                      <div key={step.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => { setActiveMenu('content'); setActiveSubMenu(step.id); }}>
                        <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                          {step.done ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs">{idx + 1}</span>}
                        </div>
                        <div>
                          <h3 className={`font-semibold ${step.done ? 'text-slate-800' : 'text-slate-700'}`}>{step.label}</h3>
                          <p className="text-sm text-slate-500">{step.desc}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 ml-auto text-slate-300 mt-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Theme Preset */}
          {activeMenu === 'theme' && activeSubMenu === 'preset' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {!showThemeGrid ? (
                /* Current Theme Display */
                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-slate-800">Preset yang digunakan: <span className="text-[#e91e63]">{currentTheme.name}</span></h2>
                  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                    <img src={currentTheme.img} alt={currentTheme.name} className="w-full h-64 object-cover" />
                  </div>
                  <button onClick={() => setShowThemeGrid(true)} className="w-full py-3 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    <Copy className="w-4 h-4" /> Ganti preset
                  </button>
                </div>
              ) : (
                /* Theme Grid Selection */
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800">Pilih Preset Tema</h2>
                    <button onClick={() => setShowThemeGrid(false)} className="text-sm text-pink-500 font-medium hover:underline">← Kembali</button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {['Semua', 'Basic', 'Premium', 'Luxury'].map(cat => (
                      <button key={cat} className="px-4 py-2 rounded-full text-sm font-medium border border-slate-200 bg-white hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600 transition-colors">{cat}</button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {themeList.map(t => (
                      <div key={t.id} onClick={() => { setSelectedThemeId(t.id); setShowThemeGrid(false); }}
                        className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all hover:shadow-lg ${selectedThemeId === t.id ? 'border-pink-500 shadow-pink-100 ring-2 ring-pink-200' : 'border-slate-200 hover:border-pink-300'}`}>
                        {selectedThemeId === t.id && <div className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-white" /></div>}
                        <img src={t.img} alt={t.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="p-4 bg-white">
                          <h3 className="font-bold text-slate-800">{t.name}</h3>
                          <span className="text-xs text-pink-500 font-medium">{t.cat}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Bottom bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-sm font-semibold text-slate-700">Preset</span>
                <button className="text-sm font-semibold text-pink-500 hover:text-pink-600">Simpan</button>
              </div>
            </motion.div>
          )}

          {/* Theme Warna */}
          {activeMenu === 'theme' && activeSubMenu === 'warna' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-6">
              <h3 className="font-bold text-lg">Pilih Warna Utama</h3>
              <div className="flex flex-wrap gap-3">
                {['#e11d48','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316','#6366f1','#84cc16','#d4a373','#2d2d2d'].map(c => (
                  <button key={c} className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform ring-2 ring-transparent hover:ring-pink-300" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="flex justify-end"><button className="px-6 py-2.5 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600">Simpan</button></div>
            </motion.div>
          )}

          {/* Theme Font / Jenis Tulisan */}
          {activeMenu === 'theme' && activeSubMenu === 'font' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-6">
              <h3 className="font-bold text-lg">Jenis Tulisan</h3>
              <div><label className="text-sm font-medium text-slate-700">Font Judul</label>
              <select className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none">
                <option>Playfair Display</option><option>Great Vibes</option><option>Cormorant Garamond</option><option>Cinzel</option><option>Alex Brush</option>
              </select></div>
              <div><label className="text-sm font-medium text-slate-700">Font Body</label>
              <select className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none">
                <option>Inter</option><option>Poppins</option><option>Lato</option><option>Open Sans</option><option>Montserrat</option>
              </select></div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-sm font-semibold text-slate-700">Jenis tulisan</span>
                <button className="text-sm font-semibold text-pink-500 hover:text-pink-600">Simpan</button>
              </div>
            </motion.div>
          )}

          {/* Content Forms */}
          {activeMenu === 'content' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-6">
              <h3 className="font-bold text-lg capitalize">{activeSubMenu === 'sampul' ? 'Sampul / Cover' : activeSubMenu === 'pembukaan' ? 'Pembukaan' : activeSubMenu === 'profil' ? 'Profil Pasangan' : activeSubMenu === 'acara' ? 'Detail Acara' : activeSubMenu === 'galeri' ? 'Album Foto' : 'Penutup'}</h3>
              {activeSubMenu === 'sampul' && (<div className="space-y-4">
                <div><label className="text-sm font-medium text-slate-700">Judul Sampul</label><input type="text" placeholder="The Wedding Of" className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-1 focus:ring-pink-200 outline-none" /></div>
                <div><label className="text-sm font-medium text-slate-700">Nama Pasangan</label><input type="text" placeholder="Andi & Sari" className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-1 focus:ring-pink-200 outline-none" /></div>
                <div><label className="text-sm font-medium text-slate-700">Upload Foto Sampul</label><input type="file" accept="image/*" className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-pink-50 file:text-pink-600 file:font-medium" /></div>
              </div>)}
              {activeSubMenu === 'pembukaan' && (<div className="space-y-4">
                <div><label className="text-sm font-medium text-slate-700">Kutipan / Ayat</label><textarea rows={3} placeholder="QS. Ar-Rum: 21" className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-1 focus:ring-pink-200 outline-none" /></div>
              </div>)}
              {activeSubMenu === 'profil' && (<div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 p-4 bg-slate-50 rounded-xl"><h4 className="font-semibold text-pink-600">Mempelai Pria</h4>
                    <input type="text" placeholder="Nama lengkap" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none" />
                    <input type="text" placeholder="Putra dari Bapak & Ibu..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none" />
                    <input type="text" placeholder="@instagram" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none" />
                  </div>
                  <div className="space-y-3 p-4 bg-slate-50 rounded-xl"><h4 className="font-semibold text-pink-600">Mempelai Wanita</h4>
                    <input type="text" placeholder="Nama lengkap" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none" />
                    <input type="text" placeholder="Putri dari Bapak & Ibu..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none" />
                    <input type="text" placeholder="@instagram" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none" />
                  </div>
                </div>
              </div>)}
              {activeSubMenu === 'acara' && (<div className="space-y-4">
                <div><label className="text-sm font-medium text-slate-700">Nama Acara</label><input type="text" placeholder="Akad Nikah" className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium text-slate-700">Tanggal</label><input type="date" className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none" /></div>
                  <div><label className="text-sm font-medium text-slate-700">Waktu</label><input type="time" className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none" /></div>
                </div>
                <div><label className="text-sm font-medium text-slate-700">Tempat / Venue</label><input type="text" placeholder="Gedung Serbaguna" className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none" /></div>
                <div><label className="text-sm font-medium text-slate-700">Alamat Lengkap</label><textarea rows={2} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none" /></div>
                <div><label className="text-sm font-medium text-slate-700">Link Google Maps</label><input type="url" placeholder="https://goo.gl/maps/..." className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none" /></div>
              </div>)}
              {activeSubMenu === 'galeri' && (<div className="space-y-4">
                <p className="text-sm text-slate-500">Upload foto-foto momen spesial kalian (maks 10 foto).</p>
                <input type="file" accept="image/*" multiple className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-pink-50 file:text-pink-600 file:font-medium" />
              </div>)}
              {activeSubMenu === 'penutup' && (<div className="space-y-4">
                <div><label className="text-sm font-medium text-slate-700">Pesan Penutup</label><textarea rows={3} placeholder="Terima kasih atas kehadiran dan doa restunya..." className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none" /></div>
              </div>)}
              <div className="flex justify-end pt-4"><button className="px-6 py-2.5 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600">Simpan</button></div>
            </motion.div>
          )}

          {/* Guest / Tamu Area */}
          {activeMenu === 'guest' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-2xl border border-slate-100">
              <h2 className="text-xl font-bold mb-4">Daftar Tamu & Kirim Undangan</h2>
              {invitations.length === 0 ? (
                <div className="p-10 text-center text-slate-500"><p>Belum ada undangan.</p></div>
              ) : (
                <div className="space-y-4">
                  {invitations.map(inv => (
                    <div key={inv.id} className="p-4 border border-slate-200 rounded-2xl flex justify-between items-center">
                      <div><h3 className="font-bold">{inv.title}</h3><p className="text-sm text-slate-500">{inv.invitationLink}</p></div>
                      <button className="px-4 py-2 bg-pink-500 text-white rounded-xl text-sm font-medium hover:bg-pink-600">Kirim</button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Settings - Musik */}
          {activeMenu === 'settings' && activeSubMenu === 'musik' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-6">
              <h3 className="font-bold text-lg">Musik Latar</h3>
              <div><label className="text-sm font-medium text-slate-700">URL Musik (MP3)</label><input type="url" placeholder="https://..." className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none" /></div>
              <div className="flex items-center gap-3"><input type="checkbox" id="autoplay" className="w-4 h-4 accent-pink-500" /><label htmlFor="autoplay" className="text-sm text-slate-700">Auto-play saat undangan dibuka</label></div>
              <div className="flex justify-end"><button className="px-6 py-2.5 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600">Simpan</button></div>
            </motion.div>
          )}

          {/* Settings - Landing Page (RESTORED) */}
          {activeMenu === 'settings' && activeSubMenu === 'landing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-5">
                  <h3 className="font-bold text-lg">Pengaturan Custom Landing Page</h3>
                  <div><label className="text-sm font-medium text-slate-700">Custom Slug Profil (URL)</label>
                    <div className="mt-1 flex items-center gap-2"><span className="text-sm text-slate-400 bg-slate-50 px-3 py-2.5 rounded-l-xl border border-r-0 border-slate-200">katalog-id.vercel.app /</span>
                    <input type="text" value={lpSlug} onChange={e => setLpSlug(e.target.value)} placeholder="nama-kamu" className="flex-1 px-4 py-2.5 rounded-r-xl border border-slate-200 focus:border-pink-400 outline-none" /></div>
                  </div>
                  <div><label className="text-sm font-medium text-slate-700">Logo (Upload dari Komputer/HP)</label>
                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if(!f) return; if(f.size > 1024*1024){alert('Max 1MB');return;} const r = new FileReader(); r.onload = (ev) => setLpConfig({...lpConfig, logoUrl: ev.target?.result as string}); r.readAsDataURL(f); }} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-pink-50 file:text-pink-600 file:font-medium" />
                    <p className="text-xs text-slate-400 mt-1">Logo URL otomatis tersimpan jika gambar diunggah.</p>
                  </div>
                  <div><label className="text-sm font-medium text-slate-700">Pilih Warna Tema</label>
                    <select value={lpConfig.themeColor} onChange={e => setLpConfig({...lpConfig, themeColor: e.target.value})} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none">
                      <option value="pink">Pink (Default)</option><option value="green">Green</option><option value="blue">Blue</option><option value="purple">Purple</option><option value="amber">Amber</option>
                    </select>
                  </div>
                  <div><label className="text-sm font-medium text-slate-700">Nomor WhatsApp Bisnis</label>
                    <input type="text" value={lpConfig.whatsappNumber || ''} onChange={e => setLpConfig({...lpConfig, whatsappNumber: e.target.value})} placeholder="62812345678" className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none" />
                  </div>
                  <div><label className="text-sm font-medium text-slate-700">Lokasi / Alamat Lengkap</label>
                    <textarea rows={2} value={lpConfig.address || ''} onChange={e => setLpConfig({...lpConfig, address: e.target.value})} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 outline-none" />
                  </div>
                  <div><label className="text-sm font-medium text-slate-700 mb-2 block">Link Sosial Media</label>
                    {['instagram','tiktok','facebook','twitter'].map(soc => (
                      <div key={soc} className="flex items-center gap-3 mb-2">
                        <input type="checkbox" checked={lpConfig.socialMedia?.[soc]?.enabled || false} onChange={e => setLpConfig({...lpConfig, socialMedia: {...lpConfig.socialMedia, [soc]: {...lpConfig.socialMedia?.[soc], enabled: e.target.checked}}})} className="w-4 h-4 accent-pink-500" />
                        <span className="text-xs font-semibold uppercase text-slate-600 w-20">{soc}</span>
                        <input type="text" value={lpConfig.socialMedia?.[soc]?.url || ''} onChange={e => setLpConfig({...lpConfig, socialMedia: {...lpConfig.socialMedia, [soc]: {...lpConfig.socialMedia?.[soc], url: e.target.value}}})} placeholder={`URL ${soc}`} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-pink-400 outline-none" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-5">
                  <h3 className="font-bold text-lg">Paket Harga (Pricing)</h3>
                  <p className="text-sm text-slate-500">Ubah nama paket, harga, dan fitur (pisahkan dengan baris baru / Enter).</p>
                  {(lpConfig.pricingPackages || []).map((pkg: any, i: number) => (
                    <div key={pkg.id || i} className="border border-slate-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between"><h4 className="font-semibold">Paket {i + 1}</h4>
                        <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={pkg.enabled !== false} onChange={e => { const pkgs = [...lpConfig.pricingPackages]; pkgs[i] = {...pkgs[i], enabled: e.target.checked}; setLpConfig({...lpConfig, pricingPackages: pkgs}); }} className="sr-only peer" /><div className="w-11 h-6 bg-slate-200 peer-checked:bg-teal-500 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" /></label>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs text-slate-500">Nama Paket</label><input type="text" value={pkg.name} onChange={e => { const pkgs = [...lpConfig.pricingPackages]; pkgs[i] = {...pkgs[i], name: e.target.value}; setLpConfig({...lpConfig, pricingPackages: pkgs}); }} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-pink-400 outline-none" /></div>
                        <div><label className="text-xs text-slate-500">Harga (Rp)</label><input type="text" value={pkg.price} onChange={e => { const pkgs = [...lpConfig.pricingPackages]; pkgs[i] = {...pkgs[i], price: e.target.value}; setLpConfig({...lpConfig, pricingPackages: pkgs}); }} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-pink-400 outline-none" /></div>
                      </div>
                      <div><label className="text-xs text-slate-500">Fitur (pisahkan enter)</label><textarea rows={3} value={pkg.features} onChange={e => { const pkgs = [...lpConfig.pricingPackages]; pkgs[i] = {...pkgs[i], features: e.target.value}; setLpConfig({...lpConfig, pricingPackages: pkgs}); }} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-pink-400 outline-none" /></div>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={async () => { setIsSavingLp(true); try { const r = await fetch('/api/member/profile', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ memberId, customSlug: lpSlug, landingPageConfig: lpConfig }) }); const d = await r.json(); if(d.success){alert('Berhasil disimpan!');fetchProfile()}else{alert(d.error||'Gagal')} } catch{alert('Error')} finally{setIsSavingLp(false)} }} disabled={isSavingLp} className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors">
                {isSavingLp ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
              </button>
            </motion.div>
          )}

        </div>
      </main>

      {/* 3. LIVE PREVIEW (Right Column) */}
      <aside className="hidden lg:flex flex-col w-[380px] xl:w-[420px] bg-gradient-to-b from-slate-50 to-slate-100 border-l border-slate-200 relative z-20">
        <div className="flex items-center justify-between px-5 py-3">
          <span className="text-xs font-medium text-slate-500 tracking-wide">mode tampilan</span>
          <div className="flex items-center gap-1 border border-slate-200 bg-white p-1 rounded-lg">
            <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-pink-50 text-pink-600 border border-pink-200' : 'text-slate-400 hover:text-slate-600'}`}><Smartphone className="w-4 h-4" /></button>
            <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-pink-50 text-pink-600 border border-pink-200' : 'text-slate-400 hover:text-slate-600'}`}><Monitor className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center overflow-hidden px-4 pb-4">
          {selectedInvitation ? (
            <>
              <div className={`transition-all duration-500 ease-in-out bg-black overflow-hidden relative ${previewMode === 'mobile' ? 'w-[290px] h-[590px] rounded-[3rem] border-[6px] border-slate-900 shadow-[0_0_40px_rgba(0,0,0,0.15)]' : 'w-full h-full rounded-xl border border-slate-200 shadow-sm bg-white'}`}>
                {previewMode === 'mobile' && (
                  <>
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-7 bg-black z-50 flex items-center justify-between px-6 text-white text-[10px] font-semibold">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="white"><rect x="0" y="4" width="3" height="6" rx="0.5"/><rect x="4" y="2" width="3" height="8" rx="0.5"/><rect x="8" y="0" width="3" height="10" rx="0.5"/></svg>
                        <svg width="16" height="10" viewBox="0 0 16 10" fill="white"><rect x="0" y="0" width="14" height="10" rx="2" stroke="white" strokeWidth="1" fill="none"/><rect x="2" y="2" width="9" height="6" rx="1" fill="white"/><rect x="15" y="3" width="1" height="4" rx="0.5" fill="white"/></svg>
                      </div>
                    </div>
                    {/* Dynamic Island */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50" />
                  </>
                )}
                <iframe src={selectedInvitation.invitationLink} className={`w-full h-full border-none ${previewMode === 'mobile' ? 'rounded-[2.4rem]' : ''}`} title="Preview" />
              </div>
              {previewMode === 'mobile' && (
                <p className="mt-3 text-xs text-slate-400 text-center">{selectedInvitation.title?.toLowerCase().replace(/\s+/g, '-') || 'preview'}</p>
              )}
            </>
          ) : (
            <div className="text-slate-400 text-center">
              <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm">Pilih undangan untuk melihat preview.</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
