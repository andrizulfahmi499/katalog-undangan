'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Share2, ZoomIn, ExternalLink, CheckCircle, Sparkles } from 'lucide-react'

interface ThemePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  theme: any
  onSelectTheme: () => void
}

export function ThemePreviewModal({ isOpen, onClose, theme, onSelectTheme }: ThemePreviewModalProps) {
  if (!theme) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex items-center justify-center"
          >
            <div className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b bg-gradient-to-r from-[#C2185B] to-purple-600">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">{theme.name}</h2>
                  <p className="text-white/80 text-sm">{theme.category} • {theme.price}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Preview Image Area */}
                <div className="relative">
                  {/* Loading Skeleton */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />

                  {/* Theme Preview */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`relative h-64 md:h-96 bg-gradient-to-br ${theme.color} flex items-center justify-center`}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [-2, 2, -2]
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-9xl md:text-[12rem] filter drop-shadow-2xl"
                    >
                      {theme.image}
                    </motion.div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      {theme.featured && (
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
                        >
                          <Sparkles className="w-3 h-3" />
                          POPULER
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Theme Details */}
                <div className="p-6 md:p-8 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Tentang Tema Ini</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Tema {theme.name} dengan gaya {theme.category.toLowerCase()} yang elegan dan modern.
                      Cocok untuk pernikahan impian Anda dengan desain yang memukau dan fitur lengkap.
                    </p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Fitur Unggulan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'RSVP Online Real-time',
                        'Lokasi dengan Google Maps',
                        'Galeri Foto Unlimited',
                        'Buku Tamu Digital',
                        'Fitur Kirim Kado',
                        'Countdown Timer',
                        'Musik Background',
                        'Animasi Halus'
                      ].map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#C2185B]">
                        {theme.views.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Dilihat</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#C2185B]">
                        {theme.likes}
                      </div>
                      <div className="text-xs text-gray-600">Disukai</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#C2185B]">
                        {Math.floor(Math.random() * 500) + 100}
                      </div>
                      <div className="text-xs text-gray-600">Digunakan</div>
                    </div>
                  </div>

                  {/* Color Palette Preview */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Palet Warna</h3>
                    <div className="flex gap-2">
                      {['#C2185B', '#E91E63', '#9C27B0', '#673AB7', '#F8BBD9'].map((color, index) => (
                        <motion.div
                          key={color}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          whileHover={{ scale: 1.2, y: -5 }}
                          className="w-12 h-12 rounded-xl shadow-lg cursor-pointer"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 md:p-6 border-t bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border-2 border-[#C2185B] text-[#C2185B] rounded-xl font-semibold hover:bg-[#C2185B]/5 transition-colors"
                  >
                    Tutup
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C2185B] to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Lihat Demo Live
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSelectTheme}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-[#C2185B] text-white rounded-xl font-semibold shadow-lg hover:bg-[#A01748] transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Pilih Tema Ini
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
