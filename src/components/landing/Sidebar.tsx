'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Grid3X3, Tag, User, Zap, HelpCircle, ShoppingCart, Shield, Menu, X } from 'lucide-react'
import Link from 'next/link'

export function Sidebar() {
  // Default is CLOSED (false) so it doesn't block the screen
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { id: 'login-admin', label: 'Login Admin', icon: <Shield size={20} />, href: '/login?role=admin' },
    { id: 'login-member', label: 'Login Member', icon: <User size={20} />, href: '/login?role=member' },
    { id: 'home', label: 'Home', icon: <Home size={20} />, href: '#home' },
    { id: 'order', label: 'Order', icon: <ShoppingCart size={20} />, href: '#order' },
    { id: 'fitur', label: 'Fitur', icon: <Zap size={20} />, href: '#fitur' },
    { id: 'katalog', label: 'Katalog', icon: <Grid3X3 size={20} />, href: '#catalog' },
    { id: 'harga', label: 'Harga', icon: <Tag size={20} />, href: '#pricing' },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle size={20} />, href: '#faq' },
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
      {/* Overlay: Meredupkan layar saat sidebar terbuka di Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          />
        )}
      </AnimatePresence>

      <motion.div
        layout
        className={`fixed top-4 left-4 z-[9999] flex flex-col overflow-hidden shadow-2xl transition-colors duration-300 ${
          isOpen ? 'bg-[#172a26] border border-white/10 shadow-black/80' : 'bg-[#172a26]/90 backdrop-blur-md border border-white/20 hover:bg-[#1a2f2a]'
        }`}
        style={{
          width: isOpen ? '280px' : 'auto',
          height: isOpen ? 'calc(100vh - 32px)' : 'auto',
          borderRadius: isOpen ? '24px' : '99px' // Bentuk Pil saat tertutup, Kotak rounded saat terbuka
        }}
      >
        {/* HEADER */}
        <div className={`flex items-center justify-between px-4 h-14 ${isOpen ? 'border-b border-white/5 mt-2' : ''}`}>
          {isOpen ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between w-full pr-1">
              <Link href="/" className="font-bold text-white tracking-widest uppercase text-sm pl-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                AKA<span className="text-[#a8d5c4]">INVITATION</span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-2 bg-white/5 rounded-full">
                <X size={20} />
              </button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 cursor-pointer py-1" onClick={() => setIsOpen(true)}>
              <div className="w-9 h-9 rounded-full overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center p-0.5">
                <img src="/logo.png" alt="Admin" className="w-full h-full object-contain rounded-full bg-black/20" onError={(e) => { e.currentTarget.src = 'https://gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }} />
              </div>
              <button className="text-white pr-2 flex items-center gap-2">
                <Menu size={22} className="text-[#a8d5c4]" />
              </button>
            </motion.div>
          )}
        </div>

        {/* MENU ITEMS */}
        <div className={`flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1 ${isOpen ? 'block' : 'hidden'}`}>
          {menuItems.map(item => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => {
                setIsOpen(false)
                handleScroll(e, item.href)
              }}
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-white/70 hover:text-white hover:bg-white/10 transition-colors group"
            >
              <span className="text-white/50 group-hover:text-[#a8d5c4] transition-colors">{item.icon}</span>
              <span className="font-bold text-[13px] tracking-wide uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{item.label}</span>
            </a>
          ))}
        </div>

        {/* FOOTER */}
        {isOpen && (
          <div className="p-5 border-t border-white/5 mt-auto bg-black/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-white/20 p-0.5">
                <img src="/logo.png" alt="Admin" className="w-full h-full object-contain rounded-full bg-black/20" onError={(e) => { e.currentTarget.src = 'https://gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }} />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-[13px] font-bold tracking-wider" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>AKA Team</span>
                <span className="text-white/50 text-[11px] uppercase tracking-widest mt-0.5" style={{ fontFamily: "'Lato', sans-serif" }}>Administrator</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </>
  )
}
