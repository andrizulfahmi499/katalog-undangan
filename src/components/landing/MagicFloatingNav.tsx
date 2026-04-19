'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Grid3X3, Tag, User, MessageCircle, Instagram } from 'lucide-react'

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
  const [activeIndex, setActiveIndex] = useState(0)
  const [showContactPopup, setShowContactPopup] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-6 h-6" />, href: '#home' },
    { id: 'contact', label: 'Contact', icon: <MessageCircle className="w-6 h-6" />, href: '#contact', isContact: true },
    { id: 'login', label: 'Login', icon: <User className="w-6 h-6" />, href: '/login' },
    { id: 'catalog', label: 'Catalog', icon: <Grid3X3 className="w-6 h-6" />, href: '#catalog' },
    { id: 'pricing', label: 'Pricing', icon: <Tag className="w-6 h-6" />, href: '#pricing' },
  ]

  useEffect(() => {
    // Sync active index with activeSection prop
    const index = navItems.findIndex(item => item.id === initialSection)
    if (index !== -1) setActiveIndex(index)
  }, [initialSection])

  // Removed scroll hiding logic per user request: "buat navbarnya selalu floating tidak terhide"

  const handleNavClick = (index: number, e: React.MouseEvent) => {
    const item = navItems[index]
    
    if (item.id === 'contact') {
      e.preventDefault()
      setShowContactPopup(!showContactPopup)
      setShowLoginPopup(false)
      setActiveIndex(index)
      return
    }

    if (item.id === 'login') {
      e.preventDefault()
      setShowLoginPopup(!showLoginPopup)
      setShowContactPopup(false)
      setActiveIndex(index)
      return
    }

    setShowContactPopup(false)
    setShowLoginPopup(false)
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
              className="absolute bottom-[90px] left-[30%] -translate-x-1/2 flex flex-col items-center pointer-events-auto z-[110]"
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

        {/* Login Selection Popup */}
        <AnimatePresence>
          {showLoginPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-[90px] left-[50%] -translate-x-1/2 flex flex-col items-center pointer-events-auto z-[110]"
            >
              <div className={`flex flex-col gap-1 p-2 rounded-2xl shadow-2xl border ${
                isLight ? 'bg-white border-gray-100' : 'bg-[#1a2f26] border-white/10'
              }`}>
                <a
                  href="/login"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-500/10 transition-colors group"
                >
                  <div className="p-2 bg-blue-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-semibold tracking-wide ${isLight ? 'text-gray-700' : 'text-white'}`}>Member Login</span>
                </a>
                <a
                  href="/login"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-500/10 transition-colors group"
                >
                  <div className="p-2 bg-gray-700 rounded-lg text-white group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-semibold tracking-wide ${isLight ? 'text-gray-700' : 'text-white'}`}>Admin Login</span>
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
        <div className={`magic-nav-container relative flex items-center h-[75px] rounded-[25px] px-2 shadow-2xl ${
          isLight ? 'bg-white shadow-black/10' : 'bg-[#ededed]'
        }`}>
          {/* Moving Indicator */}
          <motion.div
            className="magic-indicator"
            animate={{ x: activeIndex * 64 }} // 64 is the approx width of each item slot
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{
              position: 'absolute',
              top: '-32px',
              left: '12px', // Initial offset to align with first item
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: isLight ? '#9B1FE8' : '#172a26',
              border: `6px solid ${isLight ? '#FFFFFF' : '#ededed'}`,
              zIndex: 1
            }}
          >
            {/* Curved Connectors using box-shadow trick from CSS reference */}
            <div className="magic-curve-left" />
            <div className="magic-curve-right" />
          </motion.div>

          {/* Nav Items */}
          {navItems.map((item, index) => {
            const isActive = activeIndex === index
            return (
              <div
                key={item.id}
                className="relative w-16 h-full flex flex-col items-center justify-center cursor-pointer group"
                onClick={(e) => handleNavClick(index, e)}
              >
                {/* Label Section */}
                <div className={`absolute bottom-2 transition-all duration-300 ${
                  isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <span className="text-[10px] font-bold tracking-widest uppercase transition-colors" style={{ 
                    color: isLight ? '#9B1FE8' : '#172a26',
                    fontFamily: "'Josefin Sans', sans-serif"
                  }}>
                    {item.label}
                  </span>
                </div>

                {/* Icon Section */}
                <div className={`relative z-10 transition-all duration-300 flex items-center justify-center ${
                  isActive ? '-translate-y-9' : 'translate-y-0'
                }`}>
                  <div className={`transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                  }`}>
                    {item.icon}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      <style jsx>{`
        .magic-nav-container {
            width: fit-content;
            margin: 0 auto;
        }
        .magic-indicator::before,
        .magic-indicator::after {
            content: "";
            position: absolute;
            bottom: 4px; /* Adjusted to match border thickness and positioning */
            width: 15px;
            height: 15px;
            background: transparent;
            border-radius: 50%;
            z-index: -1;
        }
        .magic-indicator::before {
            left: -19px;
            box-shadow: 7px 7px 0 0 ${isLight ? '#FFFFFF' : '#ededed'};
        }
        .magic-indicator::after {
            right: -19px;
            box-shadow: -7px 7px 0 0 ${isLight ? '#FFFFFF' : '#ededed'};
        }
      `}</style>
    </div>
  )
}
