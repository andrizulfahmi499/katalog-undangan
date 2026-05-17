'use client'

import React from 'react'
import { GuestData } from './GuestManagementView'
import { Users, Clock, MapPin, Wallet } from 'lucide-react'

interface Props {
  guests: GuestData[]
  dummyAngpao: number
}

export default function BentoAnalytics({ guests, dummyAngpao }: Props) {
  const totalGuests = guests.length
  const attending = guests.filter(g => g.rsvpStatus === 'Hadir').length
  const pending = guests.filter(g => g.rsvpStatus === 'Pending').length
  const checkIns = guests.filter(g => g.checkIn).length

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: RSVP Status */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-50 flex-shrink-0 flex items-center justify-center text-pink-500">
            <Users className="w-5 h-5" />
          </div>
          <span className="font-semibold text-slate-700 leading-tight">Status RSVP</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-center">
          <div className="flex flex-col bg-slate-50 rounded-lg py-1.5">
            <span className="text-xs text-slate-500">Hadir</span>
            <span className="text-lg font-bold text-slate-800">{attending}</span>
          </div>
          <div className="flex flex-col bg-slate-50 rounded-lg py-1.5">
            <span className="text-xs text-slate-500">Pending</span>
            <span className="text-lg font-bold text-slate-800">{pending}</span>
          </div>
          <div className="flex flex-col bg-slate-50 rounded-lg py-1.5">
            <span className="text-xs text-slate-500">Total</span>
            <span className="text-lg font-bold text-slate-800">{totalGuests}</span>
          </div>
        </div>
      </div>

      {/* Card 2: Sesi */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-500">
            <Clock className="w-5 h-5" />
          </div>
          <span className="font-semibold text-slate-700 leading-tight">Kontrol Sesi</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-center">
          <div className="flex flex-col bg-slate-50 rounded-lg py-1.5">
            <span className="text-xs text-slate-500">Sesi 1</span>
            <span className="text-lg font-bold text-slate-800">
              {guests.filter(g => g.session === 'Sesi 1').length}
            </span>
          </div>
          <div className="flex flex-col bg-slate-50 rounded-lg py-1.5">
            <span className="text-xs text-slate-500">Sesi 2</span>
            <span className="text-lg font-bold text-slate-800">
              {guests.filter(g => g.session === 'Sesi 2').length}
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Check-in */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex-shrink-0 flex items-center justify-center text-emerald-500">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="font-semibold text-slate-700 leading-tight">Kehadiran Lokasi</span>
        </div>
        <div className="mt-2 flex flex-col sm:flex-row items-baseline gap-1 sm:gap-2">
          <span className="text-2xl font-bold text-slate-800">{checkIns}</span>
          <span className="text-xs sm:text-sm text-slate-500">dari {attending} tamu hadir</span>
        </div>
      </div>

      {/* Card 4: Angpao */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex-shrink-0 flex items-center justify-center text-amber-500">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="font-semibold text-slate-700 leading-tight">Angpao Digital</span>
        </div>
        <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-baseline gap-1 sm:gap-2">
          <span className="text-xl sm:text-2xl font-bold text-slate-800 whitespace-nowrap">
            Rp {(dummyAngpao / 1000000).toFixed(1)}M
          </span>
          <span className="text-[10px] sm:text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium border border-green-100">Terverifikasi</span>
        </div>
      </div>
    </div>
  )
}
