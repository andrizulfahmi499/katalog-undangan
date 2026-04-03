'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Grid3X3, Tag, User, Menu, X, ChevronUp, MessageCircle, Phone, Mail } from 'lucide-react'

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
  { icon: <MessageCircle className="w-5 h-5" />, label: 'WhatsApp', href: 'https://wa.me/6281234567890', color: 'from-green-400 to-green-500' },
  { icon: <Phone className="w-5 h-5" />, label: 'Telepon', href: 'tel:+6281234567890', color: 'from-blue-400 to-blue-500' },
  { icon: <Mail className="w-5 h-5" />, label: 'Email', href: 'mailto:hello@undangansamawa.com', color: 'from-purple-400 to-purple-500' },
]

export function FloatingNav() {
  const [activeSection, setActiveSection] = useState('home')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showContactMenu, setShowContactMenu] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll to top button when scrolled down
      setShowScrollTop(window.scrollY > 500)

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
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavClick = (href: string) => {
    setIsExpanded(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Main Floating Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        {/* Glassmorphism Container */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative"
        >
          {/* Expanded Menu (for mobile) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4"
              >
                <div className="backdrop-blur-xl bg-white/90 border border-white/50 rounded-3xl p-4 shadow-2xl shadow-purple-500/20">
                  <div className="grid grid-cols-4 gap-4">
                    {navItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleNavClick(item.href)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                          activeSection === item.id
                            ? 'bg-gradient-to-br from-[#C2185B] to-purple-600 text-white shadow-lg'
                            : 'hover:bg-white/50 text-gray-700'
                        }`}
                      >
                        {item.icon}
                        <span className="text-xs font-medium">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Nav Bar */}
          <div className="backdrop-blur-xl bg-white/60 border border-white/50 rounded-3xl shadow-2xl shadow-purple-500/20 overflow-hidden">
            {/* Desktop: Show all items */}
            <div className="hidden md:flex items-center gap-1 px-2 py-2">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative px-6 py-3 rounded-2xl flex items-center gap-2 transition-all ${
                    activeSection === item.id
                      ? 'bg-gradient-to-br from-[#C2185B] to-purple-600 text-white shadow-lg'
                      : 'hover:bg-white/50 text-gray-700'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-gradient-to-br from-[#C2185B] to-purple-600 rounded-2xl -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}

              {/* Contact Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowContactMenu(!showContactMenu)}
                className={`ml-2 px-6 py-3 rounded-2xl flex items-center gap-2 transition-all ${
                  showContactMenu
                    ? 'bg-gradient-to-br from-[#C2185B] to-purple-600 text-white shadow-lg'
                    : 'hover:bg-white/50 text-gray-700'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Hubungi</span>
              </motion.button>
            </div>

            {/* Mobile: Compact view */}
            <div className="md:hidden flex items-center justify-between px-4 py-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-xl hover:bg-white/50 text-gray-700 transition-colors"
              >
                {isExpanded ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="flex items-center gap-1">
                {navItems.slice(0, 3).map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNavClick(item.href)}
                    className={`p-3 rounded-xl transition-all ${
                      activeSection === item.id
                        ? 'bg-gradient-to-br from-[#C2185B] to-purple-600 text-white shadow-lg'
                        : 'hover:bg-white/50 text-gray-700'
                    }`}
                  >
                    {item.icon}
                  </motion.button>
                ))}
              </div>

              {/* Mobile Contact Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowContactMenu(!showContactMenu)}
                className={`p-3 rounded-xl transition-all ${
                  showContactMenu
                    ? 'bg-gradient-to-br from-[#C2185B] to-purple-600 text-white shadow-lg'
                    : 'hover:bg-white/50 text-gray-700'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
              </motion.button>
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
                className="absolute bottom-full right-0 mb-4 md:mb-0 md:bottom-full md:right-auto md:left-0"
              >
                <div className="backdrop-blur-xl bg-white/95 border border-white/50 rounded-3xl p-4 shadow-2xl shadow-purple-500/30 min-w-[200px]">
                  <div className="text-sm font-semibold text-gray-700 mb-3 px-2">
                    Hubungi Kami
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
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/50 transition-colors group"
                      >
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${option.color} text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                          {option.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{option.label}</span>
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
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="fixed bottom-28 right-6 md:bottom-8 md:right-8 z-50 backdrop-blur-xl bg-gradient-to-br from-[#C2185B] to-purple-600 text-white p-4 rounded-full shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
            >
              <ChevronUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
