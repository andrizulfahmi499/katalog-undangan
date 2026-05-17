'use client'

import React, { useState, useEffect } from 'react'
import BentoAnalytics from './BentoAnalytics'
import ActionBar from './ActionBar'
import GuestTable from './GuestTable'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Loader2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import SessionsModal from './SessionsModal'
import QRISGiftModal from './QRISGiftModal'

// Types based on Prisma Schema
export type GuestData = {
  id: string
  invitationId: string
  name: string
  category: 'VIP' | 'Reguler'
  session: 'Sesi 1' | 'Sesi 2'
  tableNumber: string
  rsvpStatus: 'Hadir' | 'Menolak' | 'Pending'
  checkIn: boolean
  whatsapp: string
  invitationToken: string
  createdAt?: string
}

export default function GuestManagementView({ invitationId, initialAction }: { invitationId?: string, initialAction?: string }) {
  const [guests, setGuests] = useState<GuestData[]>([])
  const [dummyAngpao, setDummyAngpao] = useState(2500000)
  const [isLoading, setIsLoading] = useState(true)

  // Modal States
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [aiModalOpen, setAiModalOpen] = useState(initialAction === 'management-ai')
  const [sessionsModalOpen, setSessionsModalOpen] = useState(initialAction === 'management-sessions')
  const [qrisModalOpen, setQrisModalOpen] = useState(initialAction === 'management-qris')
  const [selectedGuest, setSelectedGuest] = useState<GuestData | null>(null)
  
  const [isSaving, setIsSaving] = useState(false)

  // Sync state with sidebar clicks
  useEffect(() => {
    setAiModalOpen(initialAction === 'management-ai')
    setSessionsModalOpen(initialAction === 'management-sessions')
    setQrisModalOpen(initialAction === 'management-qris')
  }, [initialAction])

  // AI Generator States
  const [aiCategory, setAiCategory] = useState<string>('Keluarga Besar')
  const [aiMessage, setAiMessage] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Fetch Data
  useEffect(() => {
    if (!invitationId) return
    
    const fetchGuests = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/member/guests?invitationId=${invitationId}`)
        const data = await res.json()
        if (data.success) {
          // Normalize the tableNumber for the Table UI (it expects 'table')
          const normalized = data.data.map((g: any) => ({
            ...g,
            table: g.tableNumber
          }))
          setGuests(normalized)
        }
      } catch (error) {
        console.error('Failed to fetch guests', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchGuests()
  }, [invitationId])

  // Handlers
  const handleOpenEdit = (guest: GuestData) => {
    setSelectedGuest(guest)
    setEditModalOpen(true)
  }

  const handleOpenQR = (guest: GuestData) => {
    setSelectedGuest(guest)
    setQrModalOpen(true)
  }

  const handleOpenAI = () => {
    setAiMessage('')
    setAiCategory('Keluarga Besar')
    setAiModalOpen(true)
  }

  const handleGenerateAI = () => {
    setIsGenerating(true)
    // Simulasi delay API Call (Dummy AI)
    setTimeout(() => {
      let template = ''
      switch (aiCategory) {
        case 'Keluarga Besar':
          template = `Assalamualaikum Wr. Wb. \n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i [Nama Tamu] dari keluarga besar untuk hadir dan memberikan doa restu pada acara pernikahan kami.\n\nDetail undangan dapat diakses melalui tautan berikut:\n[Link Undangan]\n\nKehadiran dan doa restu Bapak/Ibu sangat berarti bagi kami.\n\nWassalamualaikum Wr. Wb.`
          break
        case 'Teman Dekat':
          template = `Halo [Nama Tamu]! 👋\n\nKami sangat menantikan kehadiranmu di hari bahagia kami! Yuk, cek detail acara dan lokasi pernikahan kami di link berikut:\n\n[Link Undangan]\n\nJangan lupa datang dan ramaikan ya! Kehadiranmu bakal bikin acara ini makin spesial. See you! ✨`
          break
        case 'Rekan Kerja':
          template = `Selamat Pagi/Siang/Sore Bapak/Ibu [Nama Tamu],\n\nDengan penuh rasa syukur, kami bermaksud mengundang Bapak/Ibu untuk hadir pada perayaan pernikahan kami. Informasi lengkap mengenai waktu dan tempat acara dapat dilihat pada tautan undangan digital berikut:\n\n[Link Undangan]\n\nMerupakan suatu kehormatan bagi kami apabila Bapak/Ibu berkenan hadir.\n\nTerima kasih.`
          break
        case 'VIP / Pejabat':
          template = `Yth. Bapak/Ibu [Nama Tamu],\n\nDengan hormat, kami memohon kesediaan waktu dan kehadiran Bapak/Ibu pada acara resepsi pernikahan kami. \n\nUndangan resmi dan detail acara telah kami lampirkan secara digital melalui tautan berikut:\n[Link Undangan]\n\nKehadiran Bapak/Ibu merupakan suatu kehormatan dan kebahagiaan yang tak terhingga bagi kami sekeluarga.\n\nHormat kami.`
          break
        default:
          template = `Halo [Nama Tamu], kami mengundang Anda untuk hadir di pernikahan kami. Buka undangan Anda di: [Link Undangan]`
      }
      setAiMessage(template)
      setIsGenerating(false)
    }, 1500)
  }

  const handleSaveEdit = async (updatedGuest: any) => {
    try {
      setIsSaving(true)
      const res = await fetch(`/api/member/guests/${updatedGuest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updatedGuest.name,
          tableNumber: updatedGuest.table,
          session: updatedGuest.session,
          rsvpStatus: updatedGuest.rsvpStatus,
          checkIn: updatedGuest.checkIn,
          category: updatedGuest.category,
          whatsapp: updatedGuest.whatsapp
        })
      })
      const data = await res.json()
      if (data.success) {
        setGuests(prev => prev.map(g => g.id === updatedGuest.id ? { ...updatedGuest, tableNumber: updatedGuest.table } : g))
        setEditModalOpen(false)
        setSelectedGuest(null)
      } else {
        alert('Gagal menyimpan perubahan: ' + (data.error || 'Server error'))
      }
    } catch (error) {
      console.error('Error updating guest', error)
      alert('Terjadi kesalahan jaringan')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddGuest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!invitationId) return
    
    try {
      setIsSaving(true)
      const formData = new FormData(e.currentTarget)
      const payload = {
        invitationId,
        name: formData.get('name'),
        whatsapp: formData.get('whatsapp'),
        category: formData.get('category'),
        session: formData.get('session'),
        tableNumber: formData.get('tableNumber')
      }

      const res = await fetch('/api/member/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        const newGuest = { ...data.data, table: data.data.tableNumber }
        setGuests(prev => [newGuest, ...prev])
        setAddModalOpen(false)
      } else {
        alert('Gagal menambahkan tamu: ' + (data.error || 'Server error'))
      }
    } catch (error) {
      console.error('Error adding guest', error)
      alert('Terjadi kesalahan jaringan')
    } finally {
      setIsSaving(false)
    }
  }

  if (!invitationId) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl border border-slate-100">
        <p className="text-slate-500">Pilih undangan terlebih dahulu dari menu di atas.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Management Tamu</h2>
          <button 
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-xl text-sm font-medium hover:bg-pink-600 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Tamu
          </button>
        </div>
        
        {/* Bagian Atas - Bento Grid */}
        <BentoAnalytics guests={guests} dummyAngpao={dummyAngpao} />
        
        {/* Bagian Bawah - Tabel Data Interaktif */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12 bg-white rounded-2xl border border-slate-100">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
          </div>
        ) : (
          <GuestTable 
            guests={guests} 
            onOpenEdit={handleOpenEdit} 
            onOpenQR={handleOpenQR} 
          />
        )}
        
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {/* Modal Tambah Tamu */}
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-lg">Tambah Tamu Baru</h3>
                <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleAddGuest} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
                  <input name="name" className="mt-1 w-full px-3 py-2 border rounded-xl outline-none focus:border-pink-500" required placeholder="Cth: Budi Santoso" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Nomor WhatsApp</label>
                  <input name="whatsapp" className="mt-1 w-full px-3 py-2 border rounded-xl outline-none focus:border-pink-500" placeholder="62812345678" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Kategori</label>
                    <select name="category" className="mt-1 w-full px-3 py-2 border rounded-xl outline-none focus:border-pink-500">
                      <option value="Reguler">Reguler</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Meja</label>
                    <input name="tableNumber" className="mt-1 w-full px-3 py-2 border rounded-xl outline-none focus:border-pink-500" placeholder="Opsional" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Sesi Kehadiran</label>
                  <select name="session" className="mt-1 w-full px-3 py-2 border rounded-xl outline-none focus:border-pink-500">
                    <option value="Sesi 1">Sesi 1</option>
                    <option value="Sesi 2">Sesi 2</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl">Batal</button>
                  <button type="submit" disabled={isSaving} className="flex items-center justify-center min-w-[120px] px-4 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-50 rounded-xl">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Modal Edit */}
        {editModalOpen && selectedGuest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-lg">Edit Data Tamu</h3>
                <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleSaveEdit({
                    ...selectedGuest,
                    name: formData.get('name') as string,
                    whatsapp: formData.get('whatsapp') as string,
                    category: formData.get('category') as string,
                    table: formData.get('table') as string,
                    rsvpStatus: formData.get('rsvpStatus') as any,
                    session: formData.get('session') as any,
                    checkIn: formData.get('checkIn') === 'true'
                  })
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium text-slate-700">Nama Tamu</label>
                  <input name="name" defaultValue={selectedGuest.name} className="mt-1 w-full px-3 py-2 border rounded-xl outline-none focus:border-pink-500" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Nomor WhatsApp</label>
                    <input name="whatsapp" defaultValue={selectedGuest.whatsapp || ''} className="mt-1 w-full px-3 py-2 border rounded-xl outline-none focus:border-pink-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Kategori</label>
                    <select name="category" defaultValue={selectedGuest.category} className="mt-1 w-full px-3 py-2 border rounded-xl outline-none focus:border-pink-500">
                      <option value="Reguler">Reguler</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Meja</label>
                    <input name="table" defaultValue={selectedGuest.table} className="mt-1 w-full px-3 py-2 border rounded-xl outline-none focus:border-pink-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Sesi</label>
                    <select name="session" defaultValue={selectedGuest.session} className="mt-1 w-full px-3 py-2 border rounded-xl outline-none focus:border-pink-500">
                      <option value="Sesi 1">Sesi 1</option>
                      <option value="Sesi 2">Sesi 2</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Status RSVP</label>
                    <select name="rsvpStatus" defaultValue={selectedGuest.rsvpStatus} className="mt-1 w-full px-3 py-2 border rounded-xl outline-none focus:border-pink-500">
                      <option value="Hadir">Hadir</option>
                      <option value="Pending">Pending</option>
                      <option value="Menolak">Menolak</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Check-In</label>
                    <select name="checkIn" defaultValue={selectedGuest.checkIn.toString()} className="mt-1 w-full px-3 py-2 border rounded-xl outline-none focus:border-pink-500">
                      <option value="true">Sudah</option>
                      <option value="false">Belum</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl">Batal</button>
                  <button type="submit" disabled={isSaving} className="flex items-center justify-center min-w-[120px] px-4 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-50 rounded-xl">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Modal QR Code */}
        {qrModalOpen && selectedGuest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">QR Code Tamu</h3>
                <button onClick={() => setQrModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
              </div>
              <div className="flex justify-center p-4 bg-white border-2 border-slate-100 rounded-2xl mb-4 inline-block">
                {selectedGuest.invitationToken ? (
                   <QRCodeSVG value={selectedGuest.invitationToken} size={200} />
                ) : (
                   <div className="w-[200px] h-[200px] flex items-center justify-center text-slate-400">Token tidak ditemukan</div>
                )}
              </div>
              <h4 className="font-bold text-slate-800 text-xl">{selectedGuest.name}</h4>
              <p className="text-slate-500 text-sm">{selectedGuest.category} • {selectedGuest.session} • {selectedGuest.table}</p>
            </motion.div>
          </div>
        )}

        {/* Modal AI Generator */}
        {aiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <span className="text-pink-500">✨</span> AI Greeting Generator
                </h3>
                <button onClick={() => setAiModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Pilih kategori tamu untuk men-generate pesan otomatis yang sopan dan personal menggunakan AI.</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Keluarga Besar', 'Teman Dekat', 'Rekan Kerja', 'VIP / Pejabat'].map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setAiCategory(cat)}
                      className={`px-3 py-2 border rounded-xl text-sm transition-colors ${
                        aiCategory === cat 
                          ? 'border-pink-500 bg-pink-50 text-pink-700 font-medium' 
                          : 'border-slate-200 hover:border-pink-400 hover:bg-pink-50/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="pt-2 relative">
                  <textarea 
                    rows={6} 
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-pink-500 bg-slate-50 leading-relaxed" 
                    placeholder="Klik tombol di bawah untuk men-generate pesan otomatis..."
                  />
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                      <Loader2 className="w-6 h-6 text-pink-500 animate-spin" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                  ) : (
                    <>Generate Pesan</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Sessions Modal */}
        {sessionsModalOpen && invitationId && (
          <SessionsModal 
            invitationId={invitationId} 
            guests={guests} 
            onClose={() => setSessionsModalOpen(false)} 
          />
        )}

        {/* QRIS & Gift Registry Modal */}
        {qrisModalOpen && invitationId && (
          <QRISGiftModal 
            invitationId={invitationId} 
            onClose={() => setQrisModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}
