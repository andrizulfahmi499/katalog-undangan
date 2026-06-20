'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Heart, Layout, Users, MessageSquare, LogOut, Loader2,
  Plus, Search, Trash2, Upload, ArrowLeft, X, Download,
  UserPlus, FileEdit, ChevronDown
} from 'lucide-react'
import { useV2Auth } from '@/hooks/useV2Auth'

interface Guest {
  id: string
  name: string
  whatsapp: string | null
  email: string | null
  category: string
  sessionId: string | null
  tableNumber: string | null
  rsvpStatus: string
  checkIn: boolean
  invitationToken: string | null
}

interface EventSession {
  id: string
  eventName: string
}

export default function GuestsPage() {
  const router = useRouter()
  const params = useParams()
  const invitationId = params.id as string
  const { user, loading: authLoading } = useV2Auth()

  const [guests, setGuests] = useState<Guest[]>([])
  const [events, setEvents] = useState<EventSession[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [newGuest, setNewGuest] = useState({ name: '', whatsapp: '', email: '', category: 'reguler', sessionId: '' })
  const [bulkText, setBulkText] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const isLoading = authLoading && guests.length === 0

  useEffect(() => {
    if (user) loadData()
  }, [user, invitationId])

  const loadData = async () => {
    try {
      const [invRes, guestsRes] = await Promise.all([
        fetch(`/api/v2/invitations/${invitationId}`),
        fetch(`/api/v2/invitations/${invitationId}/guests`),
      ])

      const invData = await invRes.json()
      const guestsData = await guestsRes.json()

      setEvents(invData.data?.events || [])
      setGuests(guestsData.data || [])
    } catch {
      router.push('/v2/dashboard')
    }
  }

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await fetch(`/api/v2/invitations/${invitationId}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newGuest,
          sessionId: newGuest.sessionId || null,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setGuests([...guests, data.data])
        setShowAddModal(false)
        setNewGuest({ name: '', whatsapp: '', email: '', category: 'reguler', sessionId: '' })
      }
    } catch {} finally {
      setIsSaving(false)
    }
  }

  const handleBulkAdd = async () => {
    if (!bulkText.trim()) return
    setIsSaving(true)

    const lines = bulkText.trim().split('\n').filter(l => l.trim())
    const bulkGuests = lines.map(line => {
      const parts = line.split(/[,\t]/).map(p => p.trim())
      return {
        name: parts[0] || '',
        whatsapp: parts[1] || '',
        email: parts[2] || '',
        category: 'reguler',
      }
    }).filter(g => g.name)

    try {
      const res = await fetch(`/api/v2/invitations/${invitationId}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guests: bulkGuests }),
      })
      if (res.ok) {
        loadData()
        setShowBulkModal(false)
        setBulkText('')
      }
    } catch {} finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (guestId: string) => {
    if (!confirm('Hapus tamu ini?')) return
    try {
      await fetch(`/api/v2/invitations/${invitationId}/guests?guestId=${guestId}`, { method: 'DELETE' })
      setGuests(guests.filter(g => g.id !== guestId))
    } catch {}
  }

  const handleLogout = async () => {
    await fetch('/api/v2/auth/me', { method: 'DELETE' })
    router.push('/login')
  }

  const filtered = guests.filter(g => {
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase()) || (g.whatsapp || '').includes(search)
    const matchCategory = !filterCategory || g.category === filterCategory
    return matchSearch && matchCategory
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#3A5A40]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#3A5A40] min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-20">
        <div className="p-5 border-b border-white/10">
          <Link href="/v2/dashboard" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <Heart className="w-4 h-4 fill-white" />
            <span className="font-bold text-sm">Editor Undangan</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link href="/v2/dashboard" className="rounded-xl px-4 py-2.5 flex items-center gap-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors">
            <Layout className="w-4 h-4" /><span className="text-sm">Dashboard</span>
          </Link>
          <Link href={`/v2/editor/${invitationId}`} className="rounded-xl px-4 py-2.5 flex items-center gap-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors">
            <FileEdit className="w-4 h-4" /><span className="text-sm">Undangan</span>
          </Link>
          <div className="rounded-xl px-4 py-2.5 flex items-center gap-3 bg-white/15 text-white">
            <Users className="w-4 h-4" /><span className="text-sm font-medium">Tamu</span>
          </div>
          <Link href={`/v2/rsvp/${invitationId}`} className="rounded-xl px-4 py-2.5 flex items-center gap-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors">
            <MessageSquare className="w-4 h-4" /><span className="text-sm">RSVP</span>
          </Link>
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout} className="w-full rounded-xl px-4 py-2.5 flex items-center gap-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /><span className="text-sm">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-56 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#2D2D2D]">Manajemen Tamu</h1>
            <p className="text-sm text-[#8B7E6F] mt-1">{guests.length} tamu terdaftar</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBulkModal(true)}
              className="bg-[#3A5A40]/10 text-[#3A5A40] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3A5A40]/20 transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Import
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#3A5A40] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2D4732] transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Tambah Tamu
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0A898]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau nomor WhatsApp..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D4C9B8] bg-white text-[#2D2D2D] placeholder-[#B0A898] focus:outline-none focus:border-[#3A5A40] text-sm"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-[#D4C9B8] bg-white text-sm text-[#4A4A4A] focus:outline-none focus:border-[#3A5A40]"
          >
            <option value="">Semua Kategori</option>
            <option value="vip">VIP</option>
            <option value="reguler">Reguler</option>
          </select>
        </div>

        {/* Guest List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E0D4] p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#3A5A40]/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-[#3A5A40]" />
            </div>
            <h3 className="text-lg font-bold text-[#2D2D2D] mb-2">
              {guests.length === 0 ? 'Belum ada tamu' : 'Tidak ada hasil'}
            </h3>
            <p className="text-sm text-[#8B7E6F] mb-6">
              {guests.length === 0
                ? 'Tambahkan tamu undangan untuk mengelola daftar hadir'
                : 'Coba ubah kata kunci pencarian'}
            </p>
            {guests.length === 0 && (
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setShowAddModal(true)} className="bg-[#3A5A40] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2D4732] inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Tambah Tamu
                </button>
                <button onClick={() => setShowBulkModal(true)} className="bg-[#3A5A40]/10 text-[#3A5A40] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3A5A40]/20 inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Import Massal
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E8E0D4] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E0D4] bg-[#FAFAF8]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#8B7E6F] uppercase tracking-wider">Nama</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#8B7E6F] uppercase tracking-wider">WhatsApp</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#8B7E6F] uppercase tracking-wider">Kategori</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#8B7E6F] uppercase tracking-wider">RSVP</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-[#8B7E6F] uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(guest => (
                  <tr key={guest.id} className="border-b border-[#F0EBE3] hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-[#2D2D2D]">{guest.name}</p>
                      {guest.email && <p className="text-xs text-[#8B7E6F]">{guest.email}</p>}
                    </td>
                    <td className="px-5 py-3 text-sm text-[#4A4A4A]">{guest.whatsapp || '-'}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        guest.category === 'vip'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-gray-50 text-gray-500 border border-gray-200'
                      }`}>
                        {guest.category === 'vip' ? 'VIP' : 'Reguler'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium ${
                        guest.rsvpStatus === 'hadir' ? 'text-green-600' :
                        guest.rsvpStatus === 'tidak_hadir' ? 'text-red-500' :
                        'text-gray-400'
                      }`}>
                        {guest.rsvpStatus === 'hadir' ? 'Hadir' : guest.rsvpStatus === 'tidak_hadir' ? 'Tidak Hadir' : 'Belum'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleDelete(guest.id)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Add Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#2D2D2D]">Tambah Tamu</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#8B7E6F] hover:text-[#2D2D2D]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1.5">Nama *</label>
                <input type="text" value={newGuest.name} onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })} required placeholder="Nama tamu" className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C9B8] bg-[#FAFAF8] text-sm focus:outline-none focus:border-[#3A5A40]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1.5">WhatsApp</label>
                <input type="tel" value={newGuest.whatsapp} onChange={(e) => setNewGuest({ ...newGuest, whatsapp: e.target.value })} placeholder="08xxxxxxxxxx" className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C9B8] bg-[#FAFAF8] text-sm focus:outline-none focus:border-[#3A5A40]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1.5">Email</label>
                <input type="email" value={newGuest.email} onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })} placeholder="email@contoh.com" className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C9B8] bg-[#FAFAF8] text-sm focus:outline-none focus:border-[#3A5A40]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1.5">Kategori</label>
                <select value={newGuest.category} onChange={(e) => setNewGuest({ ...newGuest, category: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C9B8] bg-[#FAFAF8] text-sm focus:outline-none focus:border-[#3A5A40]">
                  <option value="reguler">Reguler</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              {events.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1.5">Sesi Acara</label>
                  <select value={newGuest.sessionId} onChange={(e) => setNewGuest({ ...newGuest, sessionId: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C9B8] bg-[#FAFAF8] text-sm focus:outline-none focus:border-[#3A5A40]">
                    <option value="">Semua Sesi</option>
                    {events.map(ev => <option key={ev.id} value={ev.id}>{ev.eventName}</option>)}
                  </select>
                </div>
              )}
              <button type="submit" disabled={isSaving} className={`w-full py-3 rounded-xl font-semibold text-sm text-white ${isSaving ? 'bg-[#3A5A40]/60' : 'bg-[#3A5A40] hover:bg-[#2D4732]'}`}>
                {isSaving ? 'Menyimpan...' : 'Tambah Tamu'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#2D2D2D]">Import Tamu Massal</h3>
              <button onClick={() => setShowBulkModal(false)} className="text-[#8B7E6F] hover:text-[#2D2D2D]"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-[#8B7E6F] mb-4">
              Format: satu tamu per baris, pisahkan dengan koma atau tab:<br />
              <code className="bg-[#F0EBE3] px-2 py-0.5 rounded text-xs">Nama, WhatsApp, Email</code>
            </p>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={"Budi Santoso, 081234567890, budi@email.com\nSiti Aminah, 089876543210, siti@email.com"}
              rows={8}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C9B8] bg-[#FAFAF8] text-sm focus:outline-none focus:border-[#3A5A40] resize-none font-mono"
            />
            <div className="flex gap-2 mt-4">
              <button onClick={handleBulkAdd} disabled={isSaving || !bulkText.trim()} className={`flex-1 py-3 rounded-xl font-semibold text-sm text-white ${isSaving || !bulkText.trim() ? 'bg-[#3A5A40]/60' : 'bg-[#3A5A40] hover:bg-[#2D4732]'}`}>
                {isSaving ? 'Mengimport...' : `Import (${bulkText.trim().split('\n').filter(l => l.trim()).length} tamu)`}
              </button>
              <button onClick={() => setShowBulkModal(false)} className="px-4 py-3 text-sm text-[#8B7E6F] bg-[#F0EBE3] rounded-xl hover:bg-[#E8E0D4]">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
