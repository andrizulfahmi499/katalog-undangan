'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useCleanAppConfig } from '@/context/CleanAppConfigContext'
import { Loader2, ExternalLink, Search, X } from 'lucide-react'

interface Theme {
  id: string
  name: string
  category: string
  image: string
}

interface Category {
  id: string
  name: string
}

export function CleanAppExternalCatalog() {
  const { config } = useCleanAppConfig()
  const { templates, colors } = config

  const [themes, setThemes] = useState<Theme[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)

  // Fetch themes from API
  useEffect(() => {
    const fetchThemes = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/catalog/external?category=${activeCategory}`)
        const data = await res.json()
        if (data.success) {
          setThemes(data.data.themes)
          setCategories(data.data.categories)
        } else {
          throw new Error(data.error || 'Failed to fetch themes')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load themes')
      } finally {
        setIsLoading(false)
      }
    }

    fetchThemes()
  }, [activeCategory])

  // Filter themes by search query
  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const buttonStyle = {
    backgroundColor: templates.buttonColor || colors.primary,
    color: templates.buttonTextColor || '#ffffff',
  }

  // Don't render if external catalog is disabled
  if (!templates?.enabled || templates.useExternalCatalog === false) return null

  return (
    <section id="templates" className="py-16 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.textPrimary }}
          >
            {templates.title || 'Katalog Tema Undangan'}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.textSecondary }}
          >
            {templates.subtitle || 'Pilih tema undangan digital terbaik untuk momen spesial Anda'}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-md mx-auto mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: colors.textSecondary }}
            />
            <input
              type="text"
              placeholder="Cari tema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-full border-2 focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: colors.textSecondary + '30',
                backgroundColor: colors.backgroundSecondary || '#ffffff',
                color: colors.textPrimary,
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                style={{ color: colors.textSecondary }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
            {categories.map((category) => {
              const isActive = activeCategory === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className="px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all min-h-[44px]"
                  style={{
                    backgroundColor: isActive
                      ? templates.buttonColor || colors.primary
                      : colors.backgroundSecondary || '#F3F4F6',
                    color: isActive
                      ? '#ffffff'
                      : colors.textSecondary,
                    boxShadow: isActive ? `0 4px 15px ${colors.primary}40` : 'none',
                  }}
                >
                  {category.name}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: colors.primary }} />
            <span className="ml-3" style={{ color: colors.textSecondary }}>Memuat tema...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full font-semibold text-white"
              style={{ backgroundColor: colors.primary }}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Themes Grid */}
        {!isLoading && !error && (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
            >
              {filteredThemes.map((theme) => (
                <motion.div
                  key={theme.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                  style={{ backgroundColor: colors.backgroundSecondary || '#ffffff' }}
                  onClick={() => setSelectedTheme(theme)}
                  whileHover={{ y: -5 }}
                >
                  {/* Theme Image */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <Image
                      src={theme.image}
                      alt={theme.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      onError={(e) => {
                        // Fallback to placeholder if image fails
                        const target = e.target as HTMLImageElement
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"%3E%3Crect fill="%23f3f4f6" width="400" height="500"/%3E%3Ctext x="50%25" y="50%25" fill="%239ca3af" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="14"%3EGambar tidak tersedia%3C/text%3E%3C/svg%3E'
                      }}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <span
                        className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Lihat Detail
                      </span>
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md"
                        style={{ backgroundColor: colors.accent }}
                      >
                        {theme.category}
                      </span>
                    </div>
                  </div>

                  {/* Theme Info */}
                  <div className="p-4">
                    <h3
                      className="font-semibold text-lg mb-1 line-clamp-1"
                      style={{ color: colors.textPrimary }}
                    >
                      {theme.name}
                    </h3>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      {theme.category}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredThemes.length === 0 && (
              <div className="text-center py-20">
                <div
                  className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.backgroundSecondary || '#F3F4F6' }}
                >
                  <Search className="w-10 h-10" style={{ color: colors.textSecondary }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Tema tidak ditemukan
                </h3>
                <p style={{ color: colors.textSecondary }}>
                  Coba kata kunci lain atau pilih kategori berbeda
                </p>
              </div>
            )}
          </>
        )}

        {/* Theme Detail Modal */}
        {selectedTheme && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedTheme(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
              className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
              style={{ backgroundColor: colors.backgroundSecondary || '#ffffff' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedTheme(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                style={{ color: colors.textPrimary }}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Theme Image */}
              <div className="relative w-full aspect-[4/5]">
                <Image
                  src={selectedTheme.image}
                  alt={selectedTheme.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 500px"
                />
              </div>

              {/* Theme Info */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: colors.accent + '30',
                      color: colors.textPrimary
                    }}
                  >
                    {selectedTheme.category}
                  </span>
                </div>
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: colors.textPrimary }}
                >
                  {selectedTheme.name}
                </h3>
                <div className="flex gap-3">
                  <a
                    href={`https://id.akainvitation.com/themes/${selectedTheme.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-full font-semibold text-center transition-all hover:shadow-lg flex items-center justify-center gap-2"
                    style={buttonStyle}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Lihat Demo
                  </a>
                  <a
                    href={templates.externalUrl || 'https://id.akainvitation.com/tema'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-full font-semibold text-center border-2 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                    style={{
                      borderColor: colors.primary,
                      color: colors.primary,
                    }}
                  >
                    {templates.orderButtonText || 'Pesan Sekarang'}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-6" style={{ color: colors.textSecondary }}>
            Tidak menemukan tema yang cocok? Kami juga menerima custom design!
          </p>
          <a
            href={`https://wa.me/6281234567890?text=Halo, saya ingin konsultasi tentang custom desain undangan`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all"
            style={{
              backgroundColor: '#25D366',
              boxShadow: '0 10px 30px #25D36640',
            }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Hubungi via WhatsApp
          </a>
        </motion.div>

        {/* Source Attribution */}
        <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: colors.textSecondary + '20' }}>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Tema undangan dari{' '}
            <a
              href="https://id.akainvitation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: colors.primary }}
            >
              Aka-Invitation
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}