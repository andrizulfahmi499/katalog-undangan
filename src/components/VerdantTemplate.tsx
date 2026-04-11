"use client"

import { useState } from 'react'
import { Heart, MapPin, CalendarDays, Gift, Copy, Share2 } from 'lucide-react'
import CopyLinkButton from './CopyLinkButton'
import CountdownTimer from './CountdownTimer'

interface VerdantTemplateProps {
  invitation: {
    id: string
    title: string
    eventName: string
    eventDate: string
    location: string
    invitationLink: string
    assignedMember?: {
      name: string
      email: string
    }
    templateMessage: string
  }
  formattedDate: string
}

export default function VerdantTemplate({ invitation, formattedDate }: VerdantTemplateProps) {
  const [groomName, brideName] = invitation.title.split(/\s*&\s*/).map((name) => name.trim())
  const [showGallery, setShowGallery] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-emerald-50">
        <div className="absolute inset-0 -z-10">
          <img src="/images/templates/verdant/couple2.jpg" alt="couple" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-transparent to-white/80"></div>
        </div>

        <div className="container mx-auto px-4 py-28 text-center">
          <p className="inline-block rounded-full bg-white/60 px-6 py-2 backdrop-blur text-sm uppercase tracking-widest text-emerald-700 font-semibold">The Wedding Of</p>

          <h1 className="mt-8 text-6xl sm:text-7xl font-extrabold text-emerald-900 drop-shadow-md">
            {groomName}
            <span className="block text-emerald-500 text-4xl">&</span>
            {brideName}
          </h1>

          <p className="mt-4 text-lg text-emerald-700 max-w-2xl mx-auto">{invitation.eventName || 'Dengan Kebanggaan dan Cinta'}</p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <a href={invitation.invitationLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 px-6 py-3 text-white font-semibold shadow-lg hover:scale-105 transition">
              <Heart className="w-5 h-5" /> OPEN INVITATION
            </a>
            <CopyLinkButton link={invitation.invitationLink} label="Copy Link" />
          </div>
        </div>
      </div>

      {/* Details / Countdown */}
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="rounded-2xl bg-white/80 backdrop-blur p-8 shadow-md">
            <h2 className="text-2xl font-bold text-emerald-900">Save The Date</h2>
            <p className="text-emerald-700 mt-2">{formattedDate}</p>
            <div className="mt-6">
              <CountdownTimer targetDate={new Date(invitation.eventDate)} />
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <a href={invitation.invitationLink} className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-4 py-2 text-emerald-800 hover:bg-emerald-50 transition"><CalendarDays className="w-4 h-4"/> Add to Calendar</a>
              <a href={`https://maps.app.goo.gl/?q=${encodeURIComponent(invitation.location || '')}`} className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-4 py-2 text-emerald-800 hover:bg-emerald-50 transition"><MapPin className="w-4 h-4"/> Get Directions</a>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="py-12 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-emerald-900 mb-4">Our Gallery</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <img src="/images/templates/verdant/gallery1.jpg" alt="gallery1" className="w-full h-64 object-cover transform hover:scale-105 transition" />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <img src="/images/templates/verdant/gallery2.jpg" alt="gallery2" className="w-full h-64 object-cover transform hover:scale-105 transition" />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-lg cursor-pointer" onClick={() => setShowGallery(true)}>
                <img src="/images/templates/verdant/couple1.jpg" alt="gallery3" className="w-full h-64 object-cover transform hover:scale-105 transition" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP and Wishing Well */}
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-2xl font-bold text-emerald-900 mb-4">RSVP</h4>
              <form className="space-y-4 bg-white rounded-2xl p-6 shadow-md">
                <input type="text" placeholder="Nama Lengkap" className="w-full rounded-lg border border-emerald-200 px-4 py-3" />
                <div className="flex gap-4">
                  <label className="flex items-center gap-2"><input type="radio" name="attend" value="yes"/> Ya</label>
                  <label className="flex items-center gap-2"><input type="radio" name="attend" value="no"/> Tidak</label>
                </div>
                <textarea placeholder="Ucapan & Doa" className="w-full rounded-lg border border-emerald-200 px-4 py-3" rows={4}></textarea>
                <button className="w-full rounded-lg bg-emerald-700 text-white py-3 font-semibold">Kirim</button>
              </form>
            </div>

            <div>
              <h4 className="text-2xl font-bold text-emerald-900 mb-4">Wishing Well</h4>
              <div className="rounded-2xl bg-white p-6 shadow-md space-y-4">
                <p className="text-emerald-700">Your presence is the greatest gift. If you would like to contribute, please use the bank details below.</p>
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                  <p className="font-semibold text-emerald-900">BCA • 1234 5678 901</p>
                  <p className="text-sm text-emerald-700">a.n {groomName} & {brideName}</p>
                </div>
                <button className="w-full rounded-lg bg-white border border-emerald-200 py-3 font-semibold">Salin Nomor Rekening</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-emerald-600">Created with ❤️ using Katalog Undangan</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <CopyLinkButton link={invitation.invitationLink} label="Bagikan Undangan" />
            <button className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2"><Share2 className="w-4 h-4"/> Share</button>
          </div>
        </div>
      </div>

      {/* Simple full-screen gallery modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowGallery(false)}>
          <div className="max-w-4xl mx-auto">
            <img src="/images/templates/verdant/couple3.jpg" alt="large" className="w-full h-auto rounded-2xl shadow-xl" />
          </div>
        </div>
      )}
    </div>
  )
}
