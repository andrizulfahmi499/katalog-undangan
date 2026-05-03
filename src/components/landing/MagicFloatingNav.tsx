'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Grid3X3, Tag, User, MessageCircle, Instagram, Shield } from 'lucide-react'
import Link from 'next/link'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  isContact?: boolean
}

interface MagicFloatingNavProps {
  activeSection?: string
  whatsappNumber: string
  instagramUser: string
  isLight?: boolean
}

export function MagicFloatingNav({ activeSection: initialSection = 'home', whatsappNumber, instagramUser, isLight = false }: MagicFloatingNavProps) {
  // Use -1 as initial state so nothing is highlighted on first load per user request
  const [activeIndex, setActiveIndex] = useState(-1)
  const [showContactPopup, setShowContactPopup] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-6 h-6" strokeWidth={2.5} />, href: '#home' },
    { id: 'contact', label: 'Contact', icon: <MessageCircle className="w-6 h-6" strokeWidth={2.5} />, href: '#contact', isContact: true },
    { id: 'catalog', label: 'Catalog', icon: <Grid3X3 className="w-6 h-6" strokeWidth={2.5} />, href: '#catalog' },
    { id: 'pricing', label: 'Pricing', icon: <Tag className="w-6 h-6" strokeWidth={2.5} />, href: '#pricing' },
  ]

  // We explicitly disable initial highlight as requested.
  // We only sync if initialSection changes after the first interaction or if we want to follow scroll later.
  // For now, let's keep it inactive until first click.

  const handleNavClick = (index: number, e: React.MouseEvent) => {
    const item = navItems[index]
    
    if (item.id === 'contact') {
      e.preventDefault()
      setShowContactPopup(!showContactPopup)
      setActiveIndex(index)
      return
    }

    setShowContactPopup(false)
    setActiveIndex(index)

    if (item.href.startsWith('#')) {
      e.preventDefault()
      const element = document.getElementById(item.href.replace('#', ''))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] pb-6 flex justify-center pointer-events-none">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative pointer-events-auto"
      >
        {/* Contact Popup */}
        <AnimatePresence>
          {showContactPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-[90px] left-[25%] -translate-x-1/2 flex flex-col items-center pointer-events-auto z-[110]"
            >
              <div className={`flex flex-col gap-1 p-2 rounded-2xl shadow-2xl border ${
                isLight ? 'bg-white border-gray-100' : 'bg-[#1a2f26] border-white/10'
              }`}>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-500/10 transition-colors group"
                >
                  <div className="p-2 bg-emerald-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-semibold tracking-wide ${isLight ? 'text-gray-700' : 'text-white'}`}>WhatsApp</span>
                </a>
                <a
                  href={`https://instagram.com/${instagramUser}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-500/10 transition-colors group"
                >
                  <div className="p-2 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-semibold tracking-wide ${isLight ? 'text-gray-700' : 'text-white'}`}>Instagram</span>
                </a>
              </div>
              {/* Tooltip Arrow */}
              <div className={`w-4 h-4 rotate-45 -mt-2.5 border-r border-b ${
                isLight ? 'bg-white border-gray-100' : 'bg-[#1a2f26] border-white/10'
              }`} />
            </motion.div>
          )}
        </AnimatePresence>



        {/* Navigation Bar Body */}
        <div className="mx-auto relative flex items-center h-14 rounded-full p-1 shadow-2xl bg-[#f8f9fa] border border-gray-200">
          {/* Moving Indicator */}
          <motion.div
            className="absolute left-1 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full pointer-events-none"
            animate={{ 
              x: activeIndex * 48, // 48px is the width of each item (w-12)
              opacity: activeIndex === -1 ? 0 : 1 
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{
              backgroundColor: isLight ? '#9B1FE8' : '#172a26',
              zIndex: 0
            }}
          />

          {/* Nav Items */}
          {navItems.map((item, index) => {
            const isActive = activeIndex === index
            return (
              <div
                key={item.id}
                className="relative w-12 h-12 flex items-center justify-center cursor-pointer group z-10"
                onClick={(e) => handleNavClick(index, e)}
                title={item.label}
              >
                {/* Icon Section */}
                <div className={`transition-all duration-300 flex items-center justify-center ${
                  isActive ? 'text-white scale-110' : 'text-[#172a26] group-hover:scale-110'
                }`}>
                  {item.icon}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
