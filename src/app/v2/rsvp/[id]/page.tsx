'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Heart, Layout, Users, MessageSquare, LogOut, Loader2,
  CheckCircle, XCircle, Clock, Filter, Search, FileEdit,
  BarChart3, UserCheck, UserX, HelpCircle
} from 'lucide-react'
import { useV2Auth } from '@/hooks/useV2Auth'

interface RsvpEntry {
  id: string
  guestName: string
  guestWhatsapp: string | null
  attendance: string
  guestCount: number
  message: string | null
  groupName: string | null
  createdAt: string
}

interface RsvpStats {
  total: number
  hadir: number
  tidakHadir: number
  mungkin: number
  totalGuests: number
}

export default function RsvpPage() {
  const router = useRouter()
  const params = useParams()
  const invitationId = params.id as string
  const { user, loading: authLoading } = useV2Auth()

  const [entries, setEntries] = useState<RsvpEntry[]>([])
  const [stats, setStats] = useState<RsvpStats>({ total: 0, hadir: 0, tidakHadir: 0, mungkin: 0, totalGuests: 0 })
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')
  const isLoading = authLoading && entries.length === 0

  useEffect(() => {
    if (user) loadData()
  }, [user, invitationId])

  const loadData = async () => {
    try {
      const res = await fetch(`/api/v2/invitations/${invitationId}/rsvp`)
      const data = await res.json()
      if (res.ok) {
        setEntries(data.data?.entries || [])
        setStats(data.data?.stats || { total: 0, hadir: 0, tidakHadir: 0, mungkin: 0, totalGuests: 0 })
      }
    } catch {
      router.push('/v2/dashboard')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/v2/auth/me', { method: 'DELETE' })
    router.push('/login')
  }

  const filtered = entries.filter(e => {
    const matchSearch = !search || e.guestName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || e.attendance === filterStatus
    return matchSearch && matchStatus
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
          <Link href={`/v2/guests/${invitationId}`} className="rounded-xl px-4 py-2.5 flex items-center gap-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors">
            <Users className="w-4 h-4" /><span className="text-sm">Tamu</span>
          </Link>
          <div className="rounded-xl px-4 py-2.5 flex items-center gap-3 bg-white/15 text-white">
            <MessageSquare className="w-4 h-4" /><span className="text-sm font-medium">RSVP</span>
          </div>
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout} className="w-full rounded-xl px-4 py-2.5 flex items-center gap-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /><span className="text-sm">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-56 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#2D2D2D]">RSVP</h1>
          <p className="text-sm text-[#8B7E6F] mt-1">Konfirmasi kehadiran tamu undangan</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total RSVP', value: stats.total, icon: BarChart3, color: '#3A5A40', bg: '#3A5A4015' },
            { label: 'Hadir', value: stats.hadir, icon: UserCheck, color: '#16a34a', bg: '#16a34a15' },
            { label: 'Tidak Hadir', value: stats.tidakHadir, icon: UserX, color: '#dc2626', bg: '#dc262615' },
            { label: 'Mungkin', value: stats.mungkin, icon: HelpCircle, color: '#d97706', bg: '#d9770615' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#E8E0D4] p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-[#2D2D2D]">{stat.value}</p>
                  <p className="text-xs text-[#8B7E6F]">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0A898]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama tamu..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D4C9B8] bg-white text-[#2D2D2D] placeholder-[#B0A898] focus:outline-none focus:border-[#3A5A40] text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-[#D4C9B8] bg-white text-sm text-[#4A4A4A] focus:outline-none focus:border-[#3A5A40]"
          >
            <option value="">Semua Status</option>
            <option value="hadir">Hadir</option>
            <option value="tidak_hadir">Tidak Hadir</option>
            <option value="mungkin">Mungkin</option>
          </select>
        </div>

        {/* RSVP List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E0D4] p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#3A5A40]/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-7 h-7 text-[#3A5A40]" />
            </div>
            <h3 className="text-lg font-bold text-[#2D2D2D] mb-2">
              {entries.length === 0 ? 'Belum ada RSVP' : 'Tidak ada hasil'}
            </h3>
            <p className="text-sm text-[#8B7E6F]">
              {entries.length === 0
                ? 'RSVP akan muncul setelah tamu mengisi konfirmasi kehadiran'
                : 'Coba ubah filter pencarian'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(entry => (
              <div key={entry.id} className="bg-white rounded-xl border border-[#E8E0D4] p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    entry.attendance === 'hadir' ? 'bg-green-50' :
                    entry.attendance === 'tidak_hadir' ? 'bg-red-50' :
                    'bg-amber-50'
                  }`}>
                    {entry.attendance === 'hadir' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                     entry.attendance === 'tidak_hadir' ? <XCircle className="w-5 h-5 text-red-500" /> :
                     <Clock className="w-5 h-5 text-amber-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2D2D2D]">{entry.guestName}</p>
                    <div className="flex items-center gap-2 text-xs text-[#8B7E6F]">
                      {entry.guestWhatsapp && <span>{entry.guestWhatsapp}</span>}
                      {entry.guestCount > 1 && <span>{entry.guestCount} orang</span>}
                      <span>{new Date(entry.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    entry.attendance === 'hadir' ? 'bg-green-50 text-green-700 border border-green-200' :
                    entry.attendance === 'tidak_hadir' ? 'bg-red-50 text-red-700 border border-red-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {entry.attendance === 'hadir' ? 'Hadir' : entry.attendance === 'tidak_hadir' ? 'Tidak Hadir' : 'Mungkin'}
                  </span>
                  {entry.message && (
                    <p className="text-xs text-[#8B7E6F] mt-1 max-w-[200px] truncate">{entry.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
