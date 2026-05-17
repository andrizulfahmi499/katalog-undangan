'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Zap, HelpCircle, ShoppingCart, Menu, X, Heart, ChevronRight, User } from 'lucide-react'
import Link from 'next/link'
import { useFavorites } from '@/hooks/useFavorites'
import FavoritesPanel from '@/components/catalog/FavoritesPanel'
import PreviewModal from '@/components/catalog/PreviewModal'
import type { CatalogTheme } from '@/lib/catalogThemes'
import { CATALOG_THEMES } from '@/lib/catalogThemes'

// Custom SVGs matching the user's requested style
const CatalogSvg = () => (
  <svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor">
    <path d="M61.8,29.4l8.9,8.9l0,0c2,1.9,2,5.1,0,7l0,0L47.5,68.4V36.6l7.2-7.2C56.6,27.4,59.9,27.4,61.8,29.4z M80,62.5V75c0,2.8-2.2,5-5,5H43.8l22.5-22.5H75C77.8,57.5,80,59.8,80,62.5z M20,68.8V25c0-2.8,2.2-5,5-5h12.5c2.8,0,5,2.2,5,5v43.8 c0,6.2-5,11.2-11.2,11.2S20,75,20,68.8z M31.2,73.8c2.8,0,5-2.2,5-5s-2.2-5-5-5s-5,2.2-5,5S28.5,73.8,31.2,73.8z"></path>
  </svg>
)

const PriceSvg = () => (
  <svg width="20" height="20" viewBox="-3 -1 21 21" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m13.842 11.52-4.389 4.388a1.112 1.112 0 0 1-1.567 0l-6.28-6.28a3.027 3.027 0 0 1-.771-1.892l.043-3.681A1.141 1.141 0 0 1 2 2.935L5.67 2.9a3.04 3.04 0 0 1 1.892.773l6.28 6.28a1.112 1.112 0 0 1 0 1.567zM3.826 5.133a.792.792 0 1 0-.792.792.792.792 0 0 0 .792-.792zm6.594 7.348a.554.554 0 0 0 0-.784l-.401-.401a2.53 2.53 0 0 0 .35-.83 1.565 1.565 0 0 0-.397-1.503 1.59 1.59 0 0 0-1.017-.46 2.14 2.14 0 0 0-.75.085h-.002a2.444 2.444 0 0 0-.59.277H7.61a2.677 2.677 0 0 0-.438.357 2.043 2.043 0 0 1-.259.22 1.29 1.29 0 0 1-.329.17h-.002a.835.835 0 0 1-.338.038h-.002a.53.53 0 0 1-.314-.136.539.539 0 0 1-.106-.534 1.54 1.54 0 0 1 .41-.71 1.632 1.632 0 0 1 .23-.165l.03-.019a1.783 1.783 0 0 1 .322-.155.942.942 0 0 1 .325-.06.554.554 0 0 0 0-1.108h-.001a2.058 2.058 0 0 0-.717.132 2.846 2.846 0 0 0-.529.26l-.01.006-.398-.4a.554.554 0 1 0-.784.785l.388.387a2.513 2.513 0 0 0-.347.803 1.644 1.644 0 0 0 .404 1.561 1.622 1.622 0 0 0 .983.456 1.922 1.922 0 0 0 .805-.089 2.372 2.372 0 0 0 .624-.319 3.142 3.142 0 0 0 .398-.339 1.569 1.569 0 0 1 .256-.208 1.381 1.381 0 0 1 .32-.151 1.023 1.023 0 0 1 .348-.038.485.485 0 0 1 .308.139c.05.049.165.165.097.488a1.558 1.558 0 0 1-.413.729 2.476 2.476 0 0 1-.28.219 1.727 1.727 0 0 1-.306.157.687.687 0 0 1-.32.042.554.554 0 1 0-.08 1.106c.052.004.103.005.152.005a1.723 1.723 0 0 0 .685-.134 2.678 2.678 0 0 0 .507-.27l.01-.007.397.398a.555.555 0 0 0 .783 0z"></path>
  </svg>
)

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isFavPanelOpen, setIsFavPanelOpen] = useState(false)
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false)
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
    { id: 'login', label: 'Sign-in', icon: <User size={18} className="text-white" />, href: '#', bgColor: 'bg-[#8dc34f]' },
    { id: 'home', label: 'Home', icon: <Home size={18} className="text-white" />, href: '#home', bgColor: 'bg-[#ef4444]' },
    { id: 'order', label: 'Order', icon: <ShoppingCart size={18} className="text-white" />, href: '#order', bgColor: 'bg-[#3b82f6]' },
    { id: 'fitur', label: 'Fitur', icon: <Zap size={18} className="text-white" />, href: '#fitur', bgColor: 'bg-[#14b8a6]' },
    { id: 'katalog', label: 'Katalog', icon: <CatalogSvg />, href: '#katalog', bgColor: 'bg-[#d946ef]' },
    { id: 'harga', label: 'Harga', icon: <PriceSvg />, href: '#pricing', bgColor: 'bg-[#f59e0b]' },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle size={18} className="text-white" />, href: '#faq', bgColor: 'bg-[#8b5cf6]' },
  ]

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      
      // Khusus untuk home, kembali ke paling atas
      if (href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

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

              {menuItems.map(item => {
                if (item.id === 'login') {
                  return (
                    <div key={item.id} className="flex flex-col">
                      <button
                        onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                        className="flex items-center gap-4 px-2 py-2.5 rounded-xl text-white/90 hover:bg-white/10 active:bg-white/15 transition-colors group w-full text-left"
                      >
                        <div className={`w-9 h-9 flex items-center justify-center rounded-full shadow-inner ${item.bgColor}`}>
                          {item.icon}
                        </div>
                        <span className="font-medium text-[15px] tracking-wide" style={{ fontFamily: "'Lato', sans-serif" }}>{item.label}</span>
                        <ChevronRight size={16} className={`ml-auto text-white/30 group-hover:text-white/60 transition-transform duration-300 ${isLoginDropdownOpen ? 'rotate-90' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isLoginDropdownOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-12 pr-2 flex flex-col gap-1 mt-1"
                          >
                            <a href="/login?role=admin" onClick={() => setIsOpen(false)} className="px-3 py-2 text-[14px] text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span> Admin
                            </a>
                            <a href="/login?role=member" onClick={() => setIsOpen(false)} className="px-3 py-2 text-[14px] text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span> Member
                            </a>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                return (
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
                )
              })}

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
