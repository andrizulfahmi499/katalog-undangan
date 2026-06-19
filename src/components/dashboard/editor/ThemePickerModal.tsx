'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Crown, Search, CheckCircle } from 'lucide-react'

// Dummy data for now, ideally this comes from catalogThemes
const THEME_LIST = [
  { id: 'black-aysha', name: 'Black Aysha', category: 'Elegant', isPremium: true, thumbnail: '/themes/aysha/bg-tree.webp' },
  { id: 'dreamy-javanese', name: 'Dreamy Javanese', category: 'Tradisional', isPremium: true, thumbnail: '/images/themes/dreamy-javanese/585c26d0-e603-11f0-87fb-874a516696dc.jpg' },
  { id: 'royal-garden', name: 'Royal Garden', category: 'Modern', isPremium: true, thumbnail: '/icons/bg.webp' },
  { id: 'dream-land', name: 'Dream Land', category: 'Modern', isPremium: false, thumbnail: '/icons/flowers.webp' },
  { id: 'verdant', name: 'Verdant Elegance', category: 'Minimalis', isPremium: false, thumbnail: '/icons/right.webp' },
  { id: 'elgaze', name: 'Elgaze Luxury', category: 'Luxury', isPremium: true, thumbnail: '/icons/bg-end.webp' },
  { id: 'corelia', name: 'Corelia', category: 'Minimalis', isPremium: false, thumbnail: '/icons/frame-mempelai.webp' },
  { id: 'eden-purple', name: 'Eden Purple', category: 'Elegant', isPremium: true, thumbnail: '/templates/eden/images/portal.jpg' },
  { id: 'banjar-parallax', name: 'Banjar 3D Parallax', category: 'Parallax', isPremium: true, thumbnail: '/templates/banjar/images/cover-img.webp' },
]

type ThemePickerModalProps = {
  isOpen: boolean
  currentThemeId: string
  onClose: () => void
  onSaveTheme: (themeId: string) => void
}

export default function ThemePickerModal({ isOpen, currentThemeId, onClose, onSaveTheme }: ThemePickerModalProps) {
  const [selectedThemeId, setSelectedThemeId] = useState(currentThemeId)
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  const categories = ['Semua', ...Array.from(new Set(THEME_LIST.map(t => t.category)))]

  const filteredThemes = THEME_LIST.filter(theme => {
    if (activeCategory !== 'Semua' && theme.category !== activeCategory) return false
    if (searchQuery && !theme.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Pilih Tema Undangan</h2>
              <p className="text-sm text-slate-500 mt-1">Ubah tampilan visual keseluruhan undangan Anda.</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filter Bar */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari tema..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
              />
            </div>
          </div>

          {/* Grid Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredThemes.map(theme => (
                <motion.div
                  whileHover={{ y: -4 }}
                  key={theme.id}
                  onClick={() => setSelectedThemeId(theme.id)}
                  className={`group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                    selectedThemeId === theme.id 
                    ? 'border-pink-500 shadow-xl shadow-pink-500/20 ring-4 ring-pink-50' 
                    : 'border-transparent shadow-md hover:shadow-xl hover:border-pink-200'
                  }`}
                >
                  {theme.isPremium && (
                    <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <Crown className="w-3 h-3" /> PREMIUM
                    </div>
                  )}

                  {selectedThemeId === theme.id && (
                    <div className="absolute top-3 right-3 z-10 bg-pink-500 text-white p-1 rounded-full shadow-md">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}

                  <div className="aspect-[9/16] relative overflow-hidden bg-slate-100">
                    <img 
                      src={theme.thumbnail} 
                      alt={theme.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-slate-800">{theme.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{theme.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredThemes.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-500">Tidak ada tema yang sesuai.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-white flex justify-between items-center">
            <button className="px-6 py-2.5 text-slate-500 font-medium hover:bg-slate-100 rounded-xl transition-colors">
              Request Tema Kustom
            </button>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">
                Batal
              </button>
              <button 
                onClick={() => onSaveTheme(selectedThemeId)}
                className="px-8 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
