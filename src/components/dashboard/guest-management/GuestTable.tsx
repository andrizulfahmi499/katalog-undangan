'use client'

import React, { useState } from 'react'
import { GuestData } from './GuestManagementView'
import { Search, Edit, Send, QrCode } from 'lucide-react'

interface Props {
  guests: GuestData[]
  onOpenEdit: (guest: GuestData) => void
  onOpenQR: (guest: GuestData) => void
}

export default function GuestTable({ guests, onOpenEdit, onOpenQR }: Props) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.table.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendWA = (guest: GuestData) => {
    // Pesan otomatis yang mengandung token undangan dinamis
    const text = `Halo ${guest.name}, kami mengundang Anda ke pernikahan Ahmad & Rahmadia. Silakan buka undangan digital Anda di: https://katalog-id.vercel.app/invitation/${guest.invitation_token}`
    window.open(`https://api.whatsapp.com/send?phone=${guest.whatsapp}&text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Table Header & Search */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="font-bold text-lg text-slate-800">Daftar Tamu Undangan</h3>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Cari nama atau meja..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-pink-400 outline-none w-full sm:w-64"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
              <th className="px-5 py-3 font-medium whitespace-nowrap">Nama Tamu & Kategori</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">Sesi</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">Meja</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">Status RSVP</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">Check-In</th>
              <th className="px-5 py-3 font-medium text-right whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {filteredGuests.length > 0 ? (
              filteredGuests.map((guest) => (
                <tr key={guest.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-slate-800">{guest.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full w-max font-medium ${
                        guest.category === 'VIP' ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {guest.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-600 font-medium">
                      {guest.session}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-600 whitespace-nowrap">
                    {guest.table}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      guest.rsvpStatus === 'Hadir' ? 'bg-emerald-100 text-emerald-600' :
                      guest.rsvpStatus === 'Menolak' ? 'bg-rose-100 text-rose-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {guest.rsvpStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {guest.checkIn ? (
                      <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Sudah
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">Belum</span>
                    )}
                  </td>
                  <td className="px-5 py-4 flex items-center justify-end gap-2 whitespace-nowrap">
                    <button 
                      onClick={() => handleSendWA(guest)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-pink-500 text-white hover:bg-pink-600 rounded-lg text-xs font-medium transition-colors shadow-sm"
                    >
                      <Send className="w-3 h-3" /> WA
                    </button>
                    <button 
                      onClick={() => onOpenQR(guest)}
                      className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                      title="Lihat QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onOpenEdit(guest)}
                      className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                      title="Edit Tamu"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                  Data tamu tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
