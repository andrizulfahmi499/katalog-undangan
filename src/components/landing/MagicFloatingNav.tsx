'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, User, MessageCircle, Instagram, Shield } from 'lucide-react'
import Link from 'next/link'

const CatalogSvg = () => (
  <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor">
    <path d="M61.8,29.4l8.9,8.9l0,0c2,1.9,2,5.1,0,7l0,0L47.5,68.4V36.6l7.2-7.2C56.6,27.4,59.9,27.4,61.8,29.4z M80,62.5V75c0,2.8-2.2,5-5,5H43.8l22.5-22.5H75C77.8,57.5,80,59.8,80,62.5z M20,68.8V25c0-2.8,2.2-5,5-5h12.5c2.8,0,5,2.2,5,5v43.8 c0,6.2-5,11.2-11.2,11.2S20,75,20,68.8z M31.2,73.8c2.8,0,5-2.2,5-5s-2.2-5-5-5s-5,2.2-5,5S28.5,73.8,31.2,73.8z"></path>
  </svg>
)

const PriceSvg = () => (
  <svg width="28" height="28" viewBox="-3 -1 21 21" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m13.842 11.52-4.389 4.388a1.112 1.112 0 0 1-1.567 0l-6.28-6.28a3.027 3.027 0 0 1-.771-1.892l.043-3.681A1.141 1.141 0 0 1 2 2.935L5.67 2.9a3.04 3.04 0 0 1 1.892.773l6.28 6.28a1.112 1.112 0 0 1 0 1.567zM3.826 5.133a.792.792 0 1 0-.792.792.792.792 0 0 0 .792-.792zm6.594 7.348a.554.554 0 0 0 0-.784l-.401-.401a2.53 2.53 0 0 0 .35-.83 1.565 1.565 0 0 0-.397-1.503 1.59 1.59 0 0 0-1.017-.46 2.14 2.14 0 0 0-.75.085h-.002a2.444 2.444 0 0 0-.59.277H7.61a2.677 2.677 0 0 0-.438.357 2.043 2.043 0 0 1-.259.22 1.29 1.29 0 0 1-.329.17h-.002a.835.835 0 0 1-.338.038h-.002a.53.53 0 0 1-.314-.136.539.539 0 0 1-.106-.534 1.54 1.54 0 0 1 .41-.71 1.632 1.632 0 0 1 .23-.165l.03-.019a1.783 1.783 0 0 1 .322-.155.942.942 0 0 1 .325-.06.554.554 0 0 0 0-1.108h-.001a2.058 2.058 0 0 0-.717.132 2.846 2.846 0 0 0-.529.26l-.01.006-.398-.4a.554.554 0 1 0-.784.785l.388.387a2.513 2.513 0 0 0-.347.803 1.644 1.644 0 0 0 .404 1.561 1.622 1.622 0 0 0 .983.456 1.922 1.922 0 0 0 .805-.089 2.372 2.372 0 0 0 .624-.319 3.142 3.142 0 0 0 .398-.339 1.569 1.569 0 0 1 .256-.208 1.381 1.381 0 0 1 .32-.151 1.023 1.023 0 0 1 .348-.038.485.485 0 0 1 .308.139c.05.049.165.165.097.488a1.558 1.558 0 0 1-.413.729 2.476 2.476 0 0 1-.28.219 1.727 1.727 0 0 1-.306.157.687.687 0 0 1-.32.042.554.554 0 1 0-.08 1.106c.052.004.103.005.152.005a1.723 1.723 0 0 0 .685-.134 2.678 2.678 0 0 0 .507-.27l.01-.007.397.398a.555.555 0 0 0 .783 0z"></path>
  </svg>
)

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
    { id: 'catalog', label: 'Catalog', icon: <CatalogSvg />, href: '#katalog' },
    { id: 'pricing', label: 'Pricing', icon: <PriceSvg />, href: '#pricing' },
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
      
      // Khusus untuk home, kembali ke paling atas
      if (item.href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

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
