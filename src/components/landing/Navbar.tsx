'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Heart, Sparkles, Phone, Mail, MoreVertical, XCircle } from 'lucide-react'

interface NavItem {
  name: string
  href: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { name: 'Beranda', href: '#home' },
  { name: 'Tema', href: '#catalog' },
  { name: 'Fitur', href: '#features' },
  { name: 'Harga', href: '#pricing' },
  { name: 'Kontak', href: '#contact' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Hide navbar on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      // Add glassmorphism effect when scrolled
      setIsScrolled(currentScrollY > 50)

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Animation variants
  const navbarVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }
    },
    hidden: {
      y: -100,
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        type: 'spring',
        stiffness: 300,
      }
    })
  }

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      scaleY: 0,
      originY: 0,
    },
    visible: {
      opacity: 1,
      scaleY: 1,
      originY: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
      }
    },
    exit: {
      opacity: 0,
      scaleY: 0,
      originY: 0,
      transition: {
        duration: 0.2,
      }
    }
  }

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }
    }
  }

  return (
    <>
      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-b border-white/10"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline text-gray-300">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline text-gray-300">hello@undangansamawa.com</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Bantuan
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Navbar */}
      <motion.nav
        variants={navbarVariants}
        animate={isVisible ? 'visible' : 'hidden'}
        initial="visible"
        className={`fixed top-[40px] left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-gray-950/90 backdrop-blur-xl shadow-lg shadow-purple-500/20 border-b border-white/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.a
              href="#home"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="relative w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-xl group-hover:shadow-purple-500/50 transition-shadow"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Heart className="w-6 h-6 text-white fill-white" />
              </motion.div>
              <div className="hidden sm:block">
                <motion.div className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                  UndanganSamawa
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="text-xs text-gray-400"
                >
                  Platform Undangan Digital Terbaik
                </motion.div>
              </div>
            </motion.a>

            {/* Desktop Menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="hidden lg:flex items-center gap-1"
            >
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-1 relative group"
                >
                  {item.name}
                  {/* Animated Underline */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 rounded-full"
                    initial={{ scaleX: 0, originX: 0.5 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="hidden lg:flex items-center gap-3"
            >
              <motion.a
                href="#login"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 text-gray-300 hover:text-purple-400 font-medium text-sm transition-colors"
              >
                Masuk
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Buat Undangan
              </motion.button>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu - Enhanced Animation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="lg:hidden bg-gray-950/95 backdrop-blur-xl border-t border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    variants={mobileItemVariants}
                    className="mb-2"
                  >
                    <motion.a
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.98 }}
                      className="block px-6 py-4 rounded-2xl text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all font-medium text-lg"
                    >
                      {item.name}
                    </motion.a>
                  </motion.div>
                ))}

                <motion.div
                  variants={mobileItemVariants}
                  className="pt-6 mt-6 border-t border-white/10 space-y-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 text-gray-300 hover:text-purple-400 font-medium rounded-2xl hover:bg-white/5 transition-colors text-lg"
                  >
                    Masuk
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white py-4 rounded-2xl font-semibold shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 text-lg"
                  >
                    <Sparkles className="w-5 h-5" />
                    Buat Undangan
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
