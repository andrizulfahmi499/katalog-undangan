'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Grid3X3, Tag, User, Menu, X, ChevronUp, MessageCircle, Phone, Mail, Sparkles, ShoppingCart, Heart } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Beranda', icon: <Home className="w-5 h-5" />, href: '#home' },
  { id: 'catalog', label: 'Katalog', icon: <Grid3X3 className="w-5 h-5" />, href: '#catalog' },
  { id: 'pricing', label: 'Harga', icon: <Tag className="w-5 h-5" />, href: '#pricing' },
  { id: 'contact', label: 'Kontak', icon: <User className="w-5 h-5" />, href: '#contact' },
]

const contactOptions = [
  { icon: <MessageCircle className="w-5 h-5" />, label: 'WhatsApp', href: 'https://wa.me/6281234567890', color: 'from-green-400 to-emerald-500' },
  { icon: <Phone className="w-5 h-5" />, label: 'Telepon', href: 'tel:+6281234567890', color: 'from-blue-400 to-blue-500' },
  { icon: <Mail className="w-5 h-5" />, label: 'Email', href: 'mailto:hello@katalogundanganku.com', color: 'from-gray-400 to-gray-600' },
]

export function FloatingNav() {
  const [activeSection, setActiveSection] = useState('home')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showContactMenu, setShowContactMenu] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show scroll to top button when scrolled down
      setShowScrollTop(currentScrollY > 500)

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavClick = (href: string) => {
    setShowContactMenu(false)
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
          <div className="bg-white/98 backdrop-blur-2xl border-t border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
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
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white shadow-lg shadow-[#A5B4FC]/30'
                        : 'hover:bg-gray-50 text-[#6B7280] hover:text-[#A5B4FC]'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                    {activeSection === item.id && (
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
                  onClick={() => setShowContactMenu(!showContactMenu)}
                  className={`p-3 rounded-2xl flex items-center gap-2 transition-all ${
                    showContactMenu
                      ? 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white shadow-lg shadow-[#A5B4FC]/30'
                      : 'hover:bg-gray-50 text-[#6B7280] hover:text-[#A5B4FC]'
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
                        activeSection === item.id
                          ? 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white shadow-lg shadow-[#A5B4FC]/30'
                          : 'text-[#6B7280]'
                      }`}
                    >
                      {item.icon}
                      <span className="text-[10px] font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Mobile Contact */}
                <div className="flex items-center gap-1 pl-2 border-l border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowContactMenu(!showContactMenu)}
                    className={`p-3 rounded-2xl transition-all ${
                      showContactMenu
                        ? 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white shadow-lg shadow-[#A5B4FC]/30'
                        : 'text-[#6B7280]'
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
                <div className="bg-white/95 backdrop-blur-2xl border border-gray-100 rounded-3xl p-4 shadow-[0_16px_48px_rgba(0,0,0,0.12)] min-w-[220px]">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#A5B4FC]" />
                    <span className="text-sm font-semibold text-[#2F2F2F]">Hubungi Kami</span>
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
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all group"
                      >
                        <motion.div
                          className={`p-2.5 rounded-xl bg-gradient-to-br ${option.color} text-white shadow-md shadow-[#A5B4FC]/20 group-hover:shadow-lg group-hover:shadow-[#A5B4FC]/30 group-hover:scale-110 transition-all`}
                        >
                          {option.icon}
                        </motion.div>
                        <span className="text-sm font-medium text-[#6B7280] group-hover:text-[#A5B4FC] transition-colors">{option.label}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0, rotate: 180 }}
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="fixed bottom-24 right-4 md:bottom-28 md:right-8 z-50 bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white p-4 rounded-full shadow-lg shadow-[#A5B4FC]/30 hover:shadow-xl hover:shadow-[#C4B5FD]/40 transition-all"
            >
              <ChevronUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
