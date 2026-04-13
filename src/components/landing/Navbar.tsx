'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Heart, Sparkles, MessageCircle, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useCustomLanding } from '@/context/CustomLandingContext'

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
  const { isLight, toggleTheme } = useTheme()
  const landingContext = useCustomLanding ? useCustomLanding() : null
  const customConfig = landingContext?.config
  const customMember = landingContext?.member

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Hide navbar on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      // Add effect when scrolled
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
      {/* Main Navbar */}
      <motion.nav
        variants={navbarVariants}
        animate={isVisible ? 'visible' : 'hidden'}
        initial="visible"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isLight
            ? isScrolled
              ? 'neu-raised-sm border-b border-[#d1d9e6]'
              : 'bg-[#e0e5ec]'
            : isScrolled
              ? 'bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border-b border-white/10'
              : 'bg-white/5 backdrop-blur-md border-b border-white/10'
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
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-shadow overflow-hidden ${
                  isLight
                    ? 'neu-raised-sm'
                    : 'shadow-[0_8px_32px_rgba(165,180,252,0.3)] group-hover:shadow-[0_12px_48px_rgba(165,180,252,0.4)] bg-white/15 backdrop-blur-sm border border-white/20'
                }`}
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={customConfig?.logoUrl || "/logo.png"}
                  alt="Katalog Undanganku"
                  className="w-full h-full object-contain p-1"
                />
              </motion.div>
              <div className="hidden sm:block">
                <motion.div className={`text-xl font-bold ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>
                  {customMember ? customMember.name : 'Katalog Undanganku'}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className={`text-xs ${isLight ? 'text-[#6b7280]' : 'text-purple-300/80'}`}
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
              {navItems.slice(0, 2).map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-1 relative group ${
                    isLight
                      ? 'text-[#6b7280] hover:text-[#2d3748]'
                      : 'text-purple-200/80 hover:text-white'
                  }`}
                >
                  {item.name}
                  {/* Animated Underline */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                      isLight
                        ? 'bg-[#8b8fa3]'
                        : 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD]'
                    }`}
                    initial={{ scaleX: 0, originX: 0.5 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}

              {/* Centered Order Button with Vibrating Animation */}
              <motion.button
                animate={{
                  rotate: [-1, 1, -1, 1, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: 'easeInOut',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mx-4 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                  isLight
                    ? 'neu-btn hover:shadow-[inset_2px_2px_4px_#b8bec7,inset_-2px_-2px_4px_#ffffff] text-[#2d3748]'
                    : 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white shadow-lg shadow-[#A5B4FC]/30 hover:shadow-xl hover:shadow-[#C4B5FD]/40'
                }`}
                onClick={() => {
                  const element = document.querySelector('#order-form')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                <MessageCircle className="w-4 h-4" />
                Buat Undangan
              </motion.button>

              {navItems.slice(2).map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  custom={index + 2}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-1 relative group ${
                    isLight
                      ? 'text-[#6b7280] hover:text-[#2d3748]'
                      : 'text-purple-200/80 hover:text-white'
                  }`}
                >
                  {item.name}
                  {/* Animated Underline */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                      isLight
                        ? 'bg-[#8b8fa3]'
                        : 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD]'
                    }`}
                    initial={{ scaleX: 0, originX: 0.5 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`ml-3 relative w-16 h-8 rounded-full flex items-center transition-all duration-300 ${
                  isLight
                    ? 'neu-pressed-sm'
                    : 'bg-white/10 border border-white/20'
                }`}
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`absolute w-6 h-6 rounded-full flex items-center justify-center ${
                    isLight
                      ? 'left-1 neu-raised-sm'
                      : 'left-[calc(100%-28px)] bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD]'
                  }`}
                >
                  {isLight ? (
                    <Sun className="w-3.5 h-3.5 text-[#8b8fa3]" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-white" />
                  )}
                </motion.div>
              </motion.button>
            </motion.div>

            {/* Mobile: Theme Toggle + Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* Mobile Theme Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-colors ${
                  isLight
                    ? 'neu-raised-sm'
                    : 'hover:bg-white/10'
                }`}
              >
                {isLight ? (
                  <Sun className="w-5 h-5 text-[#8b8fa3]" />
                ) : (
                  <Moon className="w-5 h-5 text-white" />
                )}
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                onClick={toggleMobileMenu}
                className={`p-2 rounded-xl transition-colors ${
                  isLight
                    ? 'hover:bg-[#d1d9e6]'
                    : 'hover:bg-white/10'
                }`}
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
                      <X className={`w-6 h-6 ${isLight ? 'text-[#2d3748]' : 'text-white'}`} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className={`w-6 h-6 ${isLight ? 'text-[#2d3748]' : 'text-white'}`} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
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
              className={`lg:hidden overflow-hidden z-50 ${
                isLight
                  ? 'bg-[#e0e5ec] border-t border-[#d1d9e6]'
                  : 'bg-white/10 backdrop-blur-xl border-t border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)]'
              }`}
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
                      className={`block px-6 py-4 rounded-2xl transition-all font-medium text-lg ${
                        isLight
                          ? 'text-[#2d3748] hover:text-[#2d3748]'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                      style={isLight ? {
                        boxShadow: 'none',
                      } : {}}
                    >
                      {item.name}
                    </motion.a>
                  </motion.div>
                ))}

                <motion.div
                  variants={mobileItemVariants}
                  className={`pt-6 mt-6 space-y-3 ${
                    isLight ? 'border-t border-[#d1d9e6]' : 'border-t border-white/10'
                  }`}
                >
                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      window.location.href = '/login'
                    }}
                    className={`w-full py-4 font-medium rounded-2xl transition-colors text-lg ${
                      isLight
                        ? 'text-[#6b7280] hover:text-[#2d3748] neu-flat'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Masuk
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      rotate: [-1, 1, -1, 1, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: 'easeInOut',
                    }}
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      const element = document.querySelector('#order-form')
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 text-lg ${
                      isLight
                        ? 'neu-btn text-[#2d3748]'
                        : 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white shadow-lg shadow-[#A5B4FC]/30'
                    }`}
                  >
                    <MessageCircle className="w-5 h-5" />
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
