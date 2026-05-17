import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Loader2, Trash2 } from 'lucide-react'
import { GuestData } from './GuestManagementView'

interface SessionData {
  id?: string
  sessionName: string
  startTime: string
  endTime: string
  maxCapacity: number
}

interface Props {
  invitationId: string
  guests: GuestData[]
  onClose: () => void
}

export default function SessionsModal({ invitationId, guests, onClose }: Props) {
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`/api/member/sessions?invitationId=${invitationId}`)
        const data = await res.json()
        if (data.success) {
          if (data.data.length > 0) {
            setSessions(data.data)
          } else {
            // Default 2 sessions
            setSessions([
              { sessionName: 'Sesi 1: Keluarga', startTime: '09:00', endTime: '11:00', maxCapacity: 100 },
              { sessionName: 'Sesi 2: Rekan & Sahabat', startTime: '11:00', endTime: '13:00', maxCapacity: 150 }
            ])
          }
        }
      } catch (error) {
        console.error('Error fetching sessions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSessions()
  }, [invitationId])

  const handleAddSession = () => {
    setSessions([...sessions, { sessionName: '', startTime: '', endTime: '', maxCapacity: 100 }])
  }

  const handleRemoveSession = (index: number) => {
    setSessions(sessions.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: keyof SessionData, value: string | number) => {
    const updated = [...sessions]
    updated[index] = { ...updated[index], [field]: value }
    setSessions(updated)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/member/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId, sessions })
      })
      const data = await res.json()
      if (data.success) {
        alert('Sesi berhasil disimpan!')
        onClose()
      } else {
        alert('Gagal menyimpan sesi: ' + data.error)
      }
    } catch (error) {
      console.error(error)
      alert('Terjadi kesalahan jaringan')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-slate-800">Pengaturan Sesi & Kuota</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-pink-500 animate-spin" /></div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {sessions.map((session, i) => {
                // Calculate used quota based on guests currently assigned to this session name who are attending
                // Note: since we haven't migrated existing guests to UUID sessionIds, we match by sessionName
                const usedQuota = guests.filter(g => g.session === session.sessionName && g.rsvpStatus === 'Hadir').length
                const percent = session.maxCapacity > 0 ? Math.min(100, Math.round((usedQuota / session.maxCapacity) * 100)) : 0

                return (
                  <div key={i} className="p-4 border border-slate-200 rounded-2xl space-y-4 relative">
                    <button 
                      onClick={() => handleRemoveSession(i)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">Nama Sesi</label>
                        <input 
                          type="text" 
                          value={session.sessionName}
                          onChange={(e) => handleChange(i, 'sessionName', e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-pink-500 outline-none"
                          placeholder="Cth: Sesi 1 Keluarga"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase">Mulai</label>
                          <input 
                            type="time" 
                            value={session.startTime}
                            onChange={(e) => handleChange(i, 'startTime', e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-pink-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase">Selesai</label>
                          <input 
                            type="time" 
                            value={session.endTime}
                            onChange={(e) => handleChange(i, 'endTime', e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-pink-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Kuota Tamu (Hadir)</label>
                        <span className="text-xs font-medium text-slate-600">
                          Terisi: {usedQuota} / <input type="number" value={session.maxCapacity} onChange={(e) => handleChange(i, 'maxCapacity', parseInt(e.target.value))} className="w-16 border-b border-slate-200 text-center outline-none focus:border-pink-500" />
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${percent >= 100 ? 'bg-rose-500' : 'bg-pink-500'} transition-all duration-500`} 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <button 
              onClick={handleAddSession}
              className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-medium text-slate-500 hover:border-pink-300 hover:text-pink-500 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Tambah Sesi Lainnya
            </button>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl">Batal</button>
              <button onClick={handleSave} disabled={isSaving} className="px-5 py-2.5 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-50 rounded-xl flex items-center gap-2">
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />} Simpan Pengaturan
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
