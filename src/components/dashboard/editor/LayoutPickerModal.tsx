'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Crown, Search, Image as ImageIcon } from 'lucide-react'
import { PAGE_CATEGORIES } from '@/lib/pageCategories'

type LayoutPickerModalProps = {
  isOpen: boolean
  onClose: () => void
  onSelectLayout: (category: string, layoutId: string) => void
}

// ─── Thumbnail Generator ──────────────────────────────────────────────────────
const LayoutThumbnail = ({ layoutId }: { layoutId: string }) => {
  const CardBg = "w-full h-[150px] bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center p-2 relative"

  switch (layoutId) {
    // ── OPENING ──
    case 'opening-classic':
      return (
        <div className={CardBg + " justify-center gap-2"}>
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center"><ImageIcon className="w-6 h-6 text-slate-400" /></div>
          <div className="w-20 h-2 bg-slate-800 rounded"></div>
          <div className="w-12 h-2 bg-slate-300 rounded mt-1"></div>
          <div className="w-16 h-4 bg-slate-200 rounded-full mt-2"></div>
        </div>
      )
    case 'opening-arch':
      return (
        <div className={CardBg + " justify-end pb-4"}>
          <div className="w-20 h-24 bg-slate-200 rounded-t-full absolute top-2 flex flex-col items-center justify-center"><ImageIcon className="w-6 h-6 text-slate-400" /></div>
          <div className="w-24 h-2 bg-slate-800 rounded mt-24"></div>
          <div className="w-16 h-4 bg-slate-200 rounded-full mt-2"></div>
        </div>
      )
    case 'opening-oval-text':
      return (
        <div className={CardBg + " justify-center"}>
          <div className="w-20 h-28 border border-slate-300 rounded-[50%] flex flex-col items-center justify-center p-2 gap-2">
            <div className="w-12 h-1 bg-slate-300 rounded"></div>
            <div className="w-16 h-2 bg-slate-800 rounded"></div>
            <div className="w-10 h-1 bg-slate-300 rounded"></div>
            <div className="w-12 h-4 bg-slate-200 rounded-full mt-2"></div>
          </div>
        </div>
      )
    // ── LOVE STORY ──
    case 'lovestory-timeline':
      return (
        <div className={CardBg + " items-start pl-8 pt-4"}>
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200"></div>
          <div className="relative mb-3"><div className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-slate-400"></div><div className="w-8 h-2 bg-slate-800 rounded mb-1"></div><div className="w-20 h-8 bg-slate-100 rounded"></div></div>
          <div className="relative"><div className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-slate-400"></div><div className="w-8 h-2 bg-slate-800 rounded mb-1"></div><div className="w-20 h-8 bg-slate-100 rounded"></div></div>
        </div>
      )
    case 'lovestory-cards':
      return (
        <div className={CardBg + " flex-row justify-center items-center gap-2"}>
          <div className="w-12 h-16 bg-slate-100 rounded shadow-sm flex flex-col"><div className="h-8 bg-slate-200 rounded-t"></div><div className="p-1"><div className="w-8 h-1 bg-slate-400 rounded"></div></div></div>
          <div className="w-12 h-16 bg-slate-100 rounded shadow-sm flex flex-col mt-4"><div className="h-8 bg-slate-200 rounded-t"></div><div className="p-1"><div className="w-8 h-1 bg-slate-400 rounded"></div></div></div>
        </div>
      )
    // ── PROFIL / MEMPELAI ──
    case 'profil-split':
    case 'mempelai-minimalist':
      return (
        <div className={CardBg + " flex-row items-center justify-center gap-4"}>
          <div className="flex flex-col items-center gap-1"><div className="w-10 h-10 rounded-full bg-slate-200"></div><div className="w-12 h-1.5 bg-slate-400 rounded"></div></div>
          <div className="text-xl font-serif text-slate-300">&</div>
          <div className="flex flex-col items-center gap-1"><div className="w-10 h-10 rounded-full bg-slate-200"></div><div className="w-12 h-1.5 bg-slate-400 rounded"></div></div>
        </div>
      )
    case 'profil-stacked':
    case 'mempelai-elegant':
      return (
        <div className={CardBg + " justify-center gap-2"}>
          <div className="flex items-center gap-2 w-full px-2"><div className="w-10 h-10 rounded-full bg-slate-200"></div><div className="flex-1"><div className="w-16 h-2 bg-slate-400 rounded mb-1"></div><div className="w-24 h-1.5 bg-slate-200 rounded"></div></div></div>
          <div className="flex items-center gap-2 w-full px-2"><div className="flex-1 flex flex-col items-end"><div className="w-16 h-2 bg-slate-400 rounded mb-1"></div><div className="w-24 h-1.5 bg-slate-200 rounded"></div></div><div className="w-10 h-10 rounded-full bg-slate-200"></div></div>
        </div>
      )
    // ── ACARA ──
    case 'acara-card':
      return (
        <div className={CardBg + " justify-center gap-2"}>
          <div className="w-28 p-2 rounded bg-slate-50 border border-slate-100 flex flex-col items-center"><div className="w-12 h-2 bg-slate-800 rounded mb-1"></div><div className="w-16 h-1 bg-slate-300 rounded mb-2"></div><div className="w-20 h-4 bg-slate-200 rounded"></div></div>
          <div className="w-28 p-2 rounded bg-slate-50 border border-slate-100 flex flex-col items-center"><div className="w-12 h-2 bg-slate-800 rounded mb-1"></div><div className="w-16 h-1 bg-slate-300 rounded mb-2"></div><div className="w-20 h-4 bg-slate-200 rounded"></div></div>
        </div>
      )
    // ── GALLERY ──
    case 'gallery-grid':
      return (
        <div className={CardBg + " justify-center"}>
          <div className="grid grid-cols-3 gap-1 w-full p-2">
            {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-slate-200 rounded-sm"></div>)}
          </div>
        </div>
      )
    case 'gallery-masonry':
      return (
        <div className={CardBg + " flex-row justify-center gap-1 p-2"}>
          <div className="flex flex-col gap-1 w-1/2"><div className="h-16 bg-slate-200 rounded-sm"></div><div className="h-10 bg-slate-200 rounded-sm"></div></div>
          <div className="flex flex-col gap-1 w-1/2"><div className="h-10 bg-slate-200 rounded-sm"></div><div className="h-16 bg-slate-200 rounded-sm"></div></div>
        </div>
      )
    // ── RSVP ──
    case 'rsvp-clean':
      return (
        <div className={CardBg + " justify-center p-4"}>
          <div className="w-full bg-slate-50 rounded p-2 border border-slate-100">
            <div className="w-16 h-2 bg-slate-400 rounded mb-2"></div>
            <div className="w-full h-4 bg-slate-200 rounded mb-1"></div>
            <div className="w-full h-8 bg-slate-200 rounded mb-2"></div>
            <div className="w-full h-6 bg-slate-800 rounded"></div>
          </div>
        </div>
      )
    // ── GIFT ──
    case 'gift-bank':
      return (
        <div className={CardBg + " justify-center gap-2 p-3"}>
          <div className="w-full bg-slate-50 p-2 border border-slate-200 rounded flex items-center justify-between"><div className="flex flex-col gap-1"><div className="w-10 h-2 bg-slate-800 rounded"></div><div className="w-16 h-1.5 bg-slate-400 rounded"></div></div><div className="w-6 h-4 bg-slate-200 rounded"></div></div>
          <div className="w-full bg-slate-50 p-2 border border-slate-200 rounded flex items-center justify-between"><div className="flex flex-col gap-1"><div className="w-10 h-2 bg-slate-800 rounded"></div><div className="w-16 h-1.5 bg-slate-400 rounded"></div></div><div className="w-6 h-4 bg-slate-200 rounded"></div></div>
        </div>
      )
    case 'gift-qris':
      return (
        <div className={CardBg + " justify-center items-center"}>
          <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center p-2"><div className="w-full h-full border-2 border-slate-400 border-dashed"></div></div>
          <div className="w-24 h-2 bg-slate-400 rounded mt-2"></div>
        </div>
      )
  }

  // Generic block fallback
  return (
    <div className={CardBg + " justify-center items-center bg-slate-50 border-dashed"}>
      <div className="w-16 h-2 bg-slate-300 rounded mb-2"></div>
      <div className="w-24 h-12 bg-white rounded border border-slate-200"></div>
    </div>
  )
}

export default function LayoutPickerModal({ isOpen, onClose, onSelectLayout }: LayoutPickerModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  const filteredCategories = PAGE_CATEGORIES.filter(cat => {
    if (activeCategory !== 'all' && cat.id !== activeCategory) return false
    if (searchQuery && !cat.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Pilih Layout Halaman</h2>
              <p className="text-sm text-slate-500 mt-1">Tambahkan halaman baru ke undangan digital Anda dengan layout yang memukau.</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden flex flex-col sm:flex-row">
            {/* Sidebar Filters */}
            <div className="w-full sm:w-64 bg-slate-50 p-6 overflow-y-auto border-r border-slate-100 flex-shrink-0">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                />
              </div>

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Kategori</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === 'all' 
                    ? 'bg-pink-100 text-pink-700' 
                    : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Semua Kategori
                </button>
                {PAGE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeCategory === cat.id 
                      ? 'bg-pink-100 text-pink-700' 
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Grid */}
            <div className="flex-1 p-6 overflow-y-auto bg-[#f8fafc]">
              <div className="space-y-10">
                {filteredCategories.map(category => (
                  <div key={category.id} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-800">{category.name}</h3>
                      <span className="px-2.5 py-0.5 bg-slate-200 text-slate-600 rounded-full text-xs font-semibold">
                        {category.layouts.length}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {category.layouts.map(layout => (
                        <motion.div
                          whileHover={{ y: -4 }}
                          key={layout.id}
                          onClick={() => onSelectLayout(category.id, layout.id)}
                          className="group relative bg-white rounded-2xl border-2 border-slate-100 overflow-hidden cursor-pointer hover:border-pink-500 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 flex flex-col"
                        >
                          {layout.isPremium && (
                            <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                              <Crown className="w-3 h-3" /> PREMIUM
                            </div>
                          )}
                          
                          {/* Visual Layout Thumbnail */}
                          <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-center">
                            <LayoutThumbnail layoutId={layout.id} />
                          </div>
                          
                          <div className="p-4 flex items-center justify-between bg-white mt-auto">
                            <div>
                              <p className="font-bold text-slate-800 text-sm group-hover:text-pink-600 transition-colors">{layout.name}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{category.name}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-pink-500 group-hover:text-white transition-colors flex-shrink-0">
                              <span className="text-lg leading-none">+</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}

                {filteredCategories.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-slate-500">Tidak ada layout yang ditemukan.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
