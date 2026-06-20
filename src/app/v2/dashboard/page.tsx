'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Heart, Plus, Layout, Users, MessageSquare, LogOut, Eye,
  Loader2, Globe, FileEdit, Trash2, ExternalLink, MoreVertical,
  ChevronRight, CreditCard, BarChart3, Send, X
} from 'lucide-react'
import { useV2Auth } from '@/hooks/useV2Auth'

interface Invitation {
  id: string
  templateSlug: string
  subdomain: string
  isOnline: boolean
  ogTitle: string | null
  primaryColor: string
  createdAt: string
  events: any[]
  _count: { guests: number; rsvpEntries: number }
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading, setUser } = useV2Auth()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newSubdomain, setNewSubdomain] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  useEffect(() => {
    if (user) loadInvitations()
  }, [user])

  const loadInvitations = async () => {
    try {
      const invRes = await fetch('/api/v2/invitations')
      if (invRes.ok) {
        const invData = await invRes.json()
        setInvitations(invData.data || [])
      }
    } catch {}
  }

  const isLoading = authLoading

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setError('')

    try {
      const res = await fetch('/api/v2/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomain: newSubdomain.toLowerCase(), templateSlug: 'starry-sea' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal membuat undangan')

      setShowCreateModal(false)
      setNewSubdomain('')
      router.push(`/v2/editor/${data.data.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus undangan ini?')) return
    try {
      await fetch(`/api/v2/invitations/${id}`, { method: 'DELETE' })
      setInvitations(invitations.filter(inv => inv.id !== id))
    } catch {}
    setMenuOpen(null)
  }

  const handleToggleOnline = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/v2/invitations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnline: !current }),
      })
      setInvitations(invitations.map(inv =>
        inv.id === id ? { ...inv, isOnline: !current } : inv
      ))
    } catch {}
    setMenuOpen(null)
  }

  const handleLogout = async () => {
    await fetch('/api/v2/auth/me', { method: 'DELETE' })
    localStorage.removeItem('adminId')
    localStorage.removeItem('adminName')
    localStorage.removeItem('adminEmail')
    localStorage.removeItem('memberId')
    localStorage.removeItem('memberName')
    localStorage.removeItem('memberEmail')
    router.push('/login')
  }

  const templateNames: Record<string, string> = {
    'starry-sea': 'The Starry Sea',
    'kalyana': 'Kalyana',
    'blooming-garden': 'Blooming Garden',
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#3A5A40]" />
      </div>
    )
  }

  const totalViews = invitations.length * 42 // Placeholder until analytics
  const totalGuests = invitations.reduce((acc, inv) => acc + (inv._count?.guests || 0), 0)
  const totalRsvp = invitations.reduce((acc, inv) => acc + (inv._count?.rsvpEntries || 0), 0)

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#3A5A40] min-h-screen flex flex-col fixed left-0 top-0 bottom-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 text-white fill-white" />
            <span className="font-bold text-white text-lg">Editor Undangan</span>
          </div>
          <p className="text-white/50 text-xs">v2.0</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <div className="bg-white/15 rounded-xl px-4 py-3 flex items-center gap-3 text-white">
            <Layout className="w-4 h-4" />
            <span className="text-sm font-medium">Undangan Saya</span>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full rounded-xl px-4 py-3 flex items-center gap-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Buat Baru</span>
          </button>
          <Link
            href="/v2/packages"
            className="rounded-xl px-4 py-3 flex items-center gap-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            <span className="text-sm font-medium">Paket</span>
          </Link>
        </nav>

        <div className="p-3">
          <button
            onClick={handleLogout}
            className="w-full rounded-xl px-4 py-3 flex items-center gap-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Payment Status Banner */}
        {user?.packageStatus !== 'paid' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Paket belum aktif</p>
                <p className="text-xs text-amber-600">Pilih paket untuk mengaktifkan undangan dan menjadikannya online</p>
              </div>
            </div>
            <Link href="/v2/packages" className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors">
              Pilih Paket
            </Link>
          </div>
        )}

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2D2D2D]">Halo, {user?.name}!</h1>
          <p className="text-sm text-[#8B7E6F] mt-1">Kelola undangan pernikahan digitalmu di sini</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Undangan', value: invitations.length, icon: FileEdit, color: '#3A5A40' },
            { label: 'Total Dilihat', value: totalViews, icon: Eye, color: '#D4A853' },
            { label: 'Total RSVP', value: totalRsvp, icon: MessageSquare, color: '#5B8C5A' },
            { label: 'Total Tamu', value: totalGuests, icon: Users, color: '#7B68EE' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#E8E0D4] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#2D2D2D]">{stat.value}</p>
              <p className="text-xs text-[#8B7E6F] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Invitations Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#2D2D2D]">Undangan Saya</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#3A5A40] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#2D4732] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Buat Undangan
          </button>
        </div>

        {/* Invitation Cards */}
        {invitations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E0D4] p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#3A5A40]/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-[#3A5A40]" />
            </div>
            <h3 className="text-lg font-bold text-[#2D2D2D] mb-2">Belum ada undangan</h3>
            <p className="text-sm text-[#8B7E6F] mb-6">Mulai buat undangan pernikahan digital pertamamu</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#3A5A40] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2D4732] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Buat Undangan Pertama
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {invitations.map(inv => (
              <div key={inv.id} className="bg-white rounded-xl border border-[#E8E0D4] p-5 hover:shadow-md transition-shadow relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-[#2D2D2D]">{inv.ogTitle || `Undangan ${inv.subdomain}`}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        inv.isOnline
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-gray-50 text-gray-500 border border-gray-200'
                      }`}>
                        {inv.isOnline ? 'Online' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#8B7E6F]">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" /> {inv.subdomain}.editorundangan.id
                      </span>
                      <span>Template: {templateNames[inv.templateSlug] || inv.templateSlug}</span>
                      <span>{new Date(inv.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[#8B7E6F]">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {inv._count?.guests || 0} tamu</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {inv._count?.rsvpEntries || 0} RSVP</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {inv.isOnline && (
                      <a
                        href={`/v2/i/${inv.subdomain}`}
                        target="_blank"
                        className="text-[#8B7E6F] hover:text-[#3A5A40] p-2 rounded-lg hover:bg-[#3A5A40]/5 transition-all"
                        title="Lihat undangan"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === inv.id ? null : inv.id)}
                        className="text-[#8B7E6F] hover:text-[#3A5A40] p-2 rounded-lg hover:bg-[#3A5A40]/5 transition-all"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuOpen === inv.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-[#E8E0D4] rounded-xl shadow-lg py-1 z-10 w-48">
                          <button
                            onClick={() => handleToggleOnline(inv.id, inv.isOnline)}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#FAF7F2] flex items-center gap-2"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            {inv.isOnline ? 'Set Offline' : 'Set Online'}
                          </button>
                          <button
                            onClick={() => { handleDelete(inv.id) }}
                            className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#F0EBE3]">
                  <Link
                    href={`/v2/editor/${inv.id}`}
                    className="flex-1 bg-[#3A5A40] text-white py-2.5 rounded-xl text-sm font-semibold text-center hover:bg-[#2D4732] transition-colors flex items-center justify-center gap-2"
                  >
                    <FileEdit className="w-3.5 h-3.5" /> Lanjut Edit
                  </Link>
                  <Link
                    href={`/v2/guests/${inv.id}`}
                    className="flex-1 bg-[#3A5A40]/10 text-[#3A5A40] py-2.5 rounded-xl text-sm font-semibold text-center hover:bg-[#3A5A40]/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Users className="w-3.5 h-3.5" /> Tamu
                  </Link>
                  <Link
                    href={`/v2/rsvp/${inv.id}`}
                    className="flex-1 bg-[#3A5A40]/10 text-[#3A5A40] py-2.5 rounded-xl text-sm font-semibold text-center hover:bg-[#3A5A40]/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> RSVP
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#2D2D2D]">Buat Undangan Baru</h3>
              <button onClick={() => { setShowCreateModal(false); setError('') }} className="text-[#8B7E6F] hover:text-[#2D2D2D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Subdomain Undangan</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSubdomain}
                    onChange={(e) => setNewSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="nama-pasangan"
                    required
                    className="flex-1 px-4 py-3 rounded-xl border border-[#D4C9B8] bg-[#FAFAF8] text-[#2D2D2D] placeholder-[#B0A898] focus:outline-none focus:border-[#3A5A40] focus:ring-1 focus:ring-[#3A5A40]/20 text-sm"
                  />
                  <span className="text-sm text-[#8B7E6F] whitespace-nowrap">.editorundangan.id</span>
                </div>
                <p className="text-xs text-[#B0A898] mt-1.5">Hanya huruf kecil, angka, dan strip (-)</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={isCreating || !newSubdomain}
                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  isCreating || !newSubdomain
                    ? 'bg-[#3A5A40]/60 cursor-not-allowed'
                    : 'bg-[#3A5A40] hover:bg-[#2D4732]'
                } text-white`}
              >
                {isCreating ? <><Loader2 className="w-4 h-4 animate-spin" /> Membuat...</> : <><Plus className="w-4 h-4" /> Buat Undangan</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
