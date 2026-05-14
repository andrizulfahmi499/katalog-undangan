'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Grid3X3, Tag, User, Menu, X, MessageCircle, Phone, Mail, Sparkles, ShoppingCart, Heart } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
}

const CatalogSvg = () => (
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor">
    <path d="M61.8,29.4l8.9,8.9l0,0c2,1.9,2,5.1,0,7l0,0L47.5,68.4V36.6l7.2-7.2C56.6,27.4,59.9,27.4,61.8,29.4z M80,62.5V75c0,2.8-2.2,5-5,5H43.8l22.5-22.5H75C77.8,57.5,80,59.8,80,62.5z M20,68.8V25c0-2.8,2.2-5,5-5h12.5c2.8,0,5,2.2,5,5v43.8 c0,6.2-5,11.2-11.2,11.2S20,75,20,68.8z M31.2,73.8c2.8,0,5-2.2,5-5s-2.2-5-5-5s-5,2.2-5,5S28.5,73.8,31.2,73.8z"></path>
  </svg>
)

const PriceSvg = () => (
  <svg width="20" height="20" viewBox="-3 -1 21 21" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m13.842 11.52-4.389 4.388a1.112 1.112 0 0 1-1.567 0l-6.28-6.28a3.027 3.027 0 0 1-.771-1.892l.043-3.681A1.141 1.141 0 0 1 2 2.935L5.67 2.9a3.04 3.04 0 0 1 1.892.773l6.28 6.28a1.112 1.112 0 0 1 0 1.567zM3.826 5.133a.792.792 0 1 0-.792.792.792.792 0 0 0 .792-.792zm6.594 7.348a.554.554 0 0 0 0-.784l-.401-.401a2.53 2.53 0 0 0 .35-.83 1.565 1.565 0 0 0-.397-1.503 1.59 1.59 0 0 0-1.017-.46 2.14 2.14 0 0 0-.75.085h-.002a2.444 2.444 0 0 0-.59.277H7.61a2.677 2.677 0 0 0-.438.357 2.043 2.043 0 0 1-.259.22 1.29 1.29 0 0 1-.329.17h-.002a.835.835 0 0 1-.338.038h-.002a.53.53 0 0 1-.314-.136.539.539 0 0 1-.106-.534 1.54 1.54 0 0 1 .41-.71 1.632 1.632 0 0 1 .23-.165l.03-.019a1.783 1.783 0 0 1 .322-.155.942.942 0 0 1 .325-.06.554.554 0 0 0 0-1.108h-.001a2.058 2.058 0 0 0-.717.132 2.846 2.846 0 0 0-.529.26l-.01.006-.398-.4a.554.554 0 1 0-.784.785l.388.387a2.513 2.513 0 0 0-.347.803 1.644 1.644 0 0 0 .404 1.561 1.622 1.622 0 0 0 .983.456 1.922 1.922 0 0 0 .805-.089 2.372 2.372 0 0 0 .624-.319 3.142 3.142 0 0 0 .398-.339 1.569 1.569 0 0 1 .256-.208 1.381 1.381 0 0 1 .32-.151 1.023 1.023 0 0 1 .348-.038.485.485 0 0 1 .308.139c.05.049.165.165.097.488a1.558 1.558 0 0 1-.413.729 2.476 2.476 0 0 1-.28.219 1.727 1.727 0 0 1-.306.157.687.687 0 0 1-.32.042.554.554 0 1 0-.08 1.106c.052.004.103.005.152.005a1.723 1.723 0 0 0 .685-.134 2.678 2.678 0 0 0 .507-.27l.01-.007.397.398a.555.555 0 0 0 .783 0z"></path>
  </svg>
)

const navItems: NavItem[] = [
  { id: 'home', label: 'Beranda', icon: <Home className="w-5 h-5" />, href: '#home' },
  { id: 'katalog', label: 'Katalog', icon: <CatalogSvg />, href: '#katalog' },
  { id: 'pricing', label: 'Harga', icon: <PriceSvg />, href: '#pricing' },
]

const contactOptions = [
  { icon: <MessageCircle className="w-5 h-5" />, label: 'WhatsApp', href: 'https://wa.me/6285299659458', color: 'from-green-400 to-emerald-500' },
  { icon: <Phone className="w-5 h-5" />, label: 'Telepon', href: 'tel:+6285299659458', color: 'from-blue-400 to-blue-500' },
  { icon: <Mail className="w-5 h-5" />, label: 'Email', href: 'mailto:hello@katalogundanganku.com', color: 'from-gray-400 to-gray-600' },
]

export function FloatingNav() {
  const [activeSection, setActiveSection] = useState('home')
  const [showContactMenu, setShowContactMenu] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { isLight } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Hide floating nav on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      // Detect active section
      const sections = navItems.map(item => item.href.replace('#', ''))
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section)
            break
          }
        }
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleNavClick = (href: string) => {
    setShowContactMenu(false)
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Main Floating Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
        {/* Container */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: isVisible ? 0 : 100, opacity: isVisible ? 1 : 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="relative"
        >
          {/* Main Nav Bar */}
          <div className={`${
            isLight
              ? 'bg-[#e0e5ec] border-t border-[#d1d9e6] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]'
              : 'bg-white/10 backdrop-blur-2xl border-t border-white/20 shadow-[0_-8px_32px_rgba(139,92,246,0.15)]'
          }`}>
            {/* Desktop: Show all items */}
            <div className="hidden md:flex items-center justify-between px-8 py-4 max-w-4xl mx-auto">
              <div className="flex items-center gap-2">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavClick(item.href)}
                    className={`relative px-6 py-3 rounded-2xl flex items-center gap-2 transition-all ${
                      isLight
                        ? activeSection === item.id
                          ? 'neu-pressed text-[#2d3748] font-semibold'
                          : 'text-[#6b7280] hover:text-[#2d3748]'
                        : activeSection === item.id
                          ? 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white shadow-lg shadow-[#A5B4FC]/30'
                          : 'hover:bg-white/10 text-purple-200/70 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                    {!isLight && activeSection === item.id && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] rounded-2xl -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick('#order-form')}
                  className={`px-5 py-3 rounded-2xl font-semibold text-sm transition-all flex items-center gap-2 ${
                    isLight
                      ? 'neu-btn text-[#2d3748] hover:shadow-[inset_2px_2px_4px_#b8bec7,inset_-2px_-2px_4px_#ffffff]'
                      : 'bg-gradient-to-r from-[#FBCFE8] to-[#F9A8D4] text-white shadow-lg shadow-[#FBCFE8]/30 hover:shadow-xl hover:shadow-[#F9A8D4]/40'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Pesan
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowContactMenu(!showContactMenu)}
                  className={`p-3 rounded-2xl flex items-center gap-2 transition-all ${
                    isLight
                      ? showContactMenu
                        ? 'neu-pressed text-[#2d3748]'
                        : 'text-[#6b7280] hover:text-[#2d3748]'
                      : showContactMenu
                        ? 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white shadow-lg shadow-[#A5B4FC]/30'
                        : 'hover:bg-white/10 text-purple-200/70 hover:text-white'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Mobile: Compact view */}
            <div className="md:hidden">
              <div className="flex items-center justify-between px-2 py-3">
                <div className="flex items-center gap-1 flex-1 justify-center">
                  {navItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleNavClick(item.href)}
                      className={`flex-1 max-w-[80px] py-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                        isLight
                          ? activeSection === item.id
                            ? 'neu-pressed text-[#2d3748]'
                            : 'text-[#6b7280]'
                          : activeSection === item.id
                            ? 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white shadow-lg shadow-[#A5B4FC]/30'
                            : 'text-purple-200/70'
                      }`}
                    >
                      {item.icon}
                      <span className="text-[10px] font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Mobile Contact */}
                <div className={`flex items-center gap-1 pl-2 ${
                  isLight ? 'border-l border-[#d1d9e6]' : 'border-l border-white/20'
                }`}>
                  <motion.button
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNavClick('#order-form')}
                    className={`p-3 rounded-2xl transition-all ${
                      isLight ? 'text-[#6b7280] hover:text-[#2d3748]' : 'text-purple-200/70 hover:text-white'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowContactMenu(!showContactMenu)}
                    className={`p-3 rounded-2xl transition-all ${
                      isLight
                        ? showContactMenu
                          ? 'neu-pressed-sm text-[#2d3748]'
                          : 'text-[#6b7280] hover:text-[#2d3748]'
                        : showContactMenu
                          ? 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white shadow-lg shadow-[#A5B4FC]/30'
                          : 'text-purple-200/70 hover:text-white'
                    }`}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Menu Popup */}
          <AnimatePresence>
            {showContactMenu && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 mb-4"
              >
                <div className={`rounded-3xl p-4 min-w-[220px] ${
                  isLight
                    ? 'neu-raised-lg'
                    : 'bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_16px_48px_rgba(139,92,246,0.2)]'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className={`w-4 h-4 ${isLight ? 'text-[#8b8fa3]' : 'text-[#A5B4FC]'}`} />
                    <span className={`text-sm font-semibold ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>Hubungi Kami</span>
                  </div>
                  <div className="space-y-2">
                    {contactOptions.map((option, index) => (
                      <motion.a
                        key={option.label}
                        href={option.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 p-3 rounded-2xl transition-all group ${
                          isLight ? 'hover:bg-[#d1d9e6]' : 'hover:bg-white/10'
                        }`}
                      >
                        <motion.div
                          className={`p-2.5 rounded-xl text-white shadow-md transition-all ${
                            isLight
                              ? 'neu-raised-sm group-hover:shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff]'
                              : `bg-gradient-to-br ${option.color} shadow-[#A5B4FC]/20 group-hover:shadow-lg group-hover:shadow-[#A5B4FC]/30 group-hover:scale-110`
                          }`}
                        >
                          {option.icon}
                        </motion.div>
                        <span className={`text-sm font-medium transition-colors ${
                          isLight
                            ? 'text-[#6b7280] group-hover:text-[#2d3748]'
                            : 'text-purple-200/80 group-hover:text-white'
                        }`}>{option.label}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>


      </div>
    </>
  )
}
