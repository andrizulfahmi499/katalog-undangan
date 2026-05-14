'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Grid3X3, Tag, User, Zap, HelpCircle, ShoppingCart, Menu, X, Heart, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useFavorites } from '@/hooks/useFavorites'
import FavoritesPanel from '@/components/catalog/FavoritesPanel'
import PreviewModal from '@/components/catalog/PreviewModal'
import type { CatalogTheme } from '@/lib/catalogThemes'
import { CATALOG_THEMES } from '@/lib/catalogThemes'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isFavPanelOpen, setIsFavPanelOpen] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<CatalogTheme | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Get memberId from localStorage (client-side only)
  const [memberId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('memberId')
    return null
  })

  const { favorites, toggleFavorite } = useFavorites(memberId)

  const openPreview = useCallback((theme: CatalogTheme) => {
    setIsFavPanelOpen(false)
    setPreviewTheme(theme)
    setIsPreviewOpen(true)
  }, [])

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false)
    setTimeout(() => setPreviewTheme(null), 300)
  }, [])

  const handleRemoveFavorite = useCallback(
    (slug: string) => {
      const theme = CATALOG_THEMES.find((t) => t.slug === slug)
      if (theme) toggleFavorite(slug, theme.name)
    },
    [toggleFavorite]
  )

  const menuItems = [
    { id: 'login', label: 'Sign-in', icon: <User size={18} className="text-white" />, href: '/login', bgColor: 'bg-[#8dc34f]' },
    { id: 'home', label: 'Home', icon: <Home size={18} className="text-white" />, href: '#home', bgColor: 'bg-[#ef4444]' },
    { id: 'order', label: 'Order', icon: <ShoppingCart size={18} className="text-white" />, href: '#order', bgColor: 'bg-[#3b82f6]' },
    { id: 'fitur', label: 'Fitur', icon: <Zap size={18} className="text-white" />, href: '#fitur', bgColor: 'bg-[#14b8a6]' },
    { id: 'katalog', label: 'Katalog', icon: <Grid3X3 size={18} className="text-white" />, href: '#catalog', bgColor: 'bg-[#d946ef]' },
    { id: 'harga', label: 'Harga', icon: <Tag size={18} className="text-white" />, href: '#pricing', bgColor: 'bg-[#f59e0b]' },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle size={18} className="text-white" />, href: '#faq', bgColor: 'bg-[#8b5cf6]' },
  ]

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.getElementById(href.replace('#', ''))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />
        )}
      </AnimatePresence>

      {/* Floating Hamburger Button (When Closed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 right-4 z-[9997] cursor-pointer" 
            onClick={() => setIsOpen(true)}
          >
            <div className="w-11 h-11 flex-shrink-0 rounded-full overflow-hidden bg-[#172a26]/90 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg hover:bg-[#1a2f2a] transition-colors">
              <Menu size={22} className="text-[#a8d5c4]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer Sidebar Kanan */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[9999] flex flex-col h-[100vh] w-[85vw] max-w-[320px] overflow-hidden shadow-2xl bg-[#172a26]/85 backdrop-blur-xl border-l border-white/10 rounded-l-2xl"
          >
            {/* Header Cover Image */}
            <div className="relative h-40 w-full shrink-0 border-b border-white/10">
              <img 
                src="https://simplora.id/assets/home/bootslander/img/hero-bg-2.jpg" 
                alt="DearmyLove Cover" 
                className="absolute inset-0 w-full h-full object-cover brightness-75"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#172a26] via-[#172a26]/40 to-transparent" />
              
              {/* Close Button */}
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-4 right-4 text-white hover:text-white/80 p-2 bg-black/20 backdrop-blur-md rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              {/* Brand Logo & Text */}
              <div className="absolute bottom-4 left-5 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                  <img src="/logo.png" alt="Logo" className="w-9 h-9 object-contain" onError={(e) => { e.currentTarget.src = 'https://gravatar.com/avatar/0000?d=mp&f=y' }} />
                </div>
                <div className="flex flex-col drop-shadow-md">
                  <span className="text-white text-xl font-bold tracking-wider" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>DearmyLove</span>
                  <span className="text-white/80 text-[11px] tracking-widest mt-0.5" style={{ fontFamily: "'Lato', sans-serif" }}>Platform Undangan Digital</span>
                </div>
              </div>
            </div>

            {/* Scrollable Menu Items */}
            <div className="flex-1 overflow-y-auto px-4 py-5 hide-scrollbar flex flex-col gap-1">
              
              <div className="px-2 pb-2">
                <span className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>MENU</span>
              </div>

              {menuItems.map(item => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    if (item.href.startsWith('#')) {
                      setIsOpen(false)
                      handleScroll(e, item.href)
                    }
                  }}
                  className="flex items-center gap-4 px-2 py-2.5 rounded-xl text-white/90 hover:bg-white/10 active:bg-white/15 transition-colors group"
                >
                  <div className={`w-9 h-9 flex items-center justify-center rounded-full shadow-inner ${item.bgColor}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-[15px] tracking-wide" style={{ fontFamily: "'Lato', sans-serif" }}>{item.label}</span>
                  <ChevronRight size={16} className="ml-auto text-white/30 group-hover:text-white/60 transition-colors" />
                </a>
              ))}

              <div className="px-2 pt-4 pb-2 mt-2 border-t border-white/10">
                <span className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>SETTINGS</span>
              </div>

              {/* Favorites menu item */}
              <button
                onClick={() => {
                  setIsOpen(false)
                  setIsFavPanelOpen(true)
                }}
                className="flex items-center gap-4 px-2 py-2.5 rounded-xl text-white/90 hover:bg-white/10 transition-colors group w-full text-left"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-full shadow-inner bg-[#64748b] relative">
                  <Heart size={18} className="text-white" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-[#172a26]">
                      {favorites.length > 9 ? '9+' : favorites.length}
                    </span>
                  )}
                </div>
                <span className="font-medium text-[15px] tracking-wide" style={{ fontFamily: "'Lato', sans-serif" }}>
                  Favorit
                </span>
                {favorites.length > 0 ? (
                  <span className="ml-auto bg-rose-500/20 text-rose-300 text-xs font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                    {favorites.length}
                  </span>
                ) : (
                  <ChevronRight size={16} className="ml-auto text-white/30 group-hover:text-white/60 transition-colors" />
                )}
              </button>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 mt-auto bg-black/20 shrink-0 text-center">
              <span className="text-white/30 text-[10px] tracking-widest uppercase" style={{ fontFamily: "'Lato', sans-serif" }}>
                © 2026 DearmyLove. All rights reserved.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favorites Panel */}
      <FavoritesPanel
        isOpen={isFavPanelOpen}
        onClose={() => setIsFavPanelOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleRemoveFavorite}
        onPreview={openPreview}
      />

      {/* Preview Modal */}
      <PreviewModal isOpen={isPreviewOpen} onClose={closePreview} theme={previewTheme} />
    </>
  )
}
