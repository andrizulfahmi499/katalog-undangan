'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Music, Play, UploadCloud, Search, CheckCircle } from 'lucide-react'

type MusicManagerModalProps = {
  isOpen: boolean
  onClose: () => void
  currentMusicUrl?: string
  musicEnabled?: boolean
  onSave: (url: string, enabled: boolean) => void
}

const DEFAULT_MUSIC_LIBRARY = [
  { id: 'm1', name: 'Beautiful In White', artist: 'Westlife', url: '/music/beautiful-in-white.mp3' },
  { id: 'm2', name: 'A Thousand Years', artist: 'Christina Perri', url: '/music/a-thousand-years.mp3' },
  { id: 'm3', name: 'Perfect', artist: 'Ed Sheeran', url: '/music/perfect.mp3' },
  { id: 'm4', name: 'Can\'t Help Falling in Love', artist: 'Elvis Presley', url: '/music/cant-help-falling.mp3' },
]

export default function MusicManagerModal({ isOpen, onClose, currentMusicUrl = '', musicEnabled = true, onSave }: MusicManagerModalProps) {
  const [isEnabled, setIsEnabled] = useState(musicEnabled)
  const [selectedMusic, setSelectedMusic] = useState(currentMusicUrl)
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Musik Latar</h2>
              <p className="text-sm text-slate-500 mt-1">Pilih atau unggah musik yang akan diputar otomatis.</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </div>
                <span className="text-sm font-medium text-slate-700">Aktifkan Musik</span>
              </label>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
            {/* Upload Section */}
            <div className={`transition-opacity ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">Unggah Musik Kustom</h3>
              <div className="border-2 border-dashed border-slate-200 bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-pink-300 hover:bg-pink-50/30 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-pink-100 group-hover:text-pink-500 transition-colors mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-700">Klik untuk mencari file MP3</p>
                <p className="text-xs text-slate-400 mt-1">Maksimal 5 MB. Biaya: -10 Credit</p>
              </div>
            </div>

            {/* Library Section */}
            <div className={`transition-opacity ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Pustaka Musik</h3>
                <div className="relative w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" placeholder="Cari..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-pink-500" />
                </div>
              </div>

              <div className="space-y-2">
                {DEFAULT_MUSIC_LIBRARY.map(music => (
                  <div key={music.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${selectedMusic === music.url ? 'bg-pink-50 border-pink-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                    <div className="flex items-center gap-4">
                      <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-pink-500 hover:text-white transition-colors">
                        <Play className="w-4 h-4 ml-0.5" />
                      </button>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{music.name}</p>
                        <p className="text-xs text-slate-500">{music.artist}</p>
                      </div>
                    </div>
                    {selectedMusic === music.url ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500 text-white rounded-full text-xs font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Digunakan
                      </div>
                    ) : (
                      <button onClick={() => setSelectedMusic(music.url)} className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-full text-xs font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors">
                        Gunakan
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">
              Batal
            </button>
            <button 
              onClick={() => onSave(selectedMusic, isEnabled)}
              className="px-8 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-pink-500/20"
            >
              Simpan Perubahan
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
