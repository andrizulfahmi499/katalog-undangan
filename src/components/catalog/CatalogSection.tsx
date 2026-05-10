'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { CATALOG_THEMES, CATALOG_CATEGORIES, type CatalogTheme } from '@/lib/catalogThemes'
import { useFavorites } from '@/hooks/useFavorites'
import PreviewModal from '@/components/catalog/PreviewModal'
import FavoritesPanel from '@/components/catalog/FavoritesPanel'

interface CatalogSectionProps {
  isLight?: boolean
}

export default function CatalogSection({ isLight = false }: CatalogSectionProps) {
  const [catalogLayout, setCatalogLayout] = useState<'grid' | 'thumbnail'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [previewTheme, setPreviewTheme] = useState<CatalogTheme | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isFavPanelOpen, setIsFavPanelOpen] = useState(false)
  const [memberId, setMemberId] = useState<string | null>(null)

  const { favorites, isFavorited, toggleFavorite } = useFavorites(memberId)

  // Get memberId from localStorage
  useEffect(() => {
    const id = localStorage.getItem('memberId')
    setMemberId(id)
  }, [])

  // Fetch catalog layout setting
  useEffect(() => {
    fetch('/api/public/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.catalogLayout) {
          setCatalogLayout(data.data.catalogLayout)
        }
      })
      .catch(() => {})
  }, [])

  const filteredThemes =
    selectedCategory === 'Semua'
      ? CATALOG_THEMES
      : CATALOG_THEMES.filter((t) => t.category === selectedCategory)

  const openPreview = useCallback((theme: CatalogTheme) => {
    setPreviewTheme(theme)
    setIsPreviewOpen(true)
  }, [])

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false)
    setTimeout(() => setPreviewTheme(null), 300)
  }, [])

  const handleRemoveFavorite = useCallback(
    (slug: string) => {
      const theme = CATALOG_THEMES.find((t) => t.slug === slug)
      if (theme) toggleFavorite(slug, theme.name)
    },
    [toggleFavorite]
  )

  const textColor = isLight ? 'text-gray-800' : 'text-[#f4e4c1]'
  const subTextColor = isLight ? 'text-gray-500' : 'text-[#f4e4c1]/60'
  const cardBg = isLight ? 'bg-white shadow-md' : 'bg-white/10 backdrop-blur-sm border border-white/10'
  const btnBg = isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-white/10 hover:bg-white/20 text-[#f4e4c1]'

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 relative">
      {/* Favorites floating button */}
      <button
        onClick={() => setIsFavPanelOpen(true)}
        className="fixed right-4 bottom-20 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-lg transition-all"
        aria-label="Buka favorit"
      >
        <Heart className="w-5 h-5 fill-white" />
        {favorites.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4af37] text-[#172a26] text-xs font-bold rounded-full flex items-center justify-center">
            {favorites.length > 9 ? '9+' : favorites.length}
          </span>
        )}
      </button>

      {/* Section header */}
      <div className="text-center mb-8">
        <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${textColor}`}>
          Katalog Tema Undangan
        </h2>
        <p className={`text-sm sm:text-base ${subTextColor}`}>
          Pilih tema yang sesuai dengan momen spesial Anda
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATALOG_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#d4af37] text-[#172a26]'
                : `${btnBg} border border-white/20`
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Layout */}
      {catalogLayout === 'thumbnail' ? (
        <ThumbnailLayout
          themes={filteredThemes}
          favorites={favorites}
          isFavorited={isFavorited}
          onPreview={openPreview}
          onToggleFavorite={toggleFavorite}
          isLight={isLight}
        />
      ) : (
        <GridLayout
          themes={filteredThemes}
          isFavorited={isFavorited}
          onPreview={openPreview}
          onToggleFavorite={toggleFavorite}
          isLight={isLight}
          cardBg={cardBg}
          textColor={textColor}
          subTextColor={subTextColor}
        />
      )}

      {/* Preview Modal */}
      <PreviewModal isOpen={isPreviewOpen} onClose={closePreview} theme={previewTheme} />

      {/* Favorites Panel */}
      <FavoritesPanel
        isOpen={isFavPanelOpen}
        onClose={() => setIsFavPanelOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleRemoveFavorite}
        onPreview={(theme) => {
          setIsFavPanelOpen(false)
          openPreview(theme)
        }}
      />
    </section>
  )
}

// ─── Grid Layout ────────────────────────────────────────────────────────────

interface GridLayoutProps {
  themes: CatalogTheme[]
  isFavorited: (slug: string) => boolean
  onPreview: (theme: CatalogTheme) => void
  onToggleFavorite: (slug: string, name: string) => void
  isLight: boolean
  cardBg: string
  textColor: string
  subTextColor: string
}

function GridLayout({ themes, isFavorited, onPreview, onToggleFavorite, isLight, cardBg, textColor, subTextColor }: GridLayoutProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {themes.map((theme) => (
        <motion.div
          key={theme.slug}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl overflow-hidden ${cardBg} group`}
        >
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={theme.imageUrl}
              alt={theme.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
            {/* Overlay buttons */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => onPreview(theme)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-gray-800 hover:bg-[#d4af37] transition-colors"
                aria-label={`Preview ${theme.name}`}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onToggleFavorite(theme.slug, theme.name)}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                  isFavorited(theme.slug)
                    ? 'bg-rose-500 text-white'
                    : 'bg-white text-gray-800 hover:bg-rose-500 hover:text-white'
                }`}
                aria-label={isFavorited(theme.slug) ? `Hapus ${theme.name} dari favorit` : `Tambah ${theme.name} ke favorit`}
              >
                <Heart className={`w-4 h-4 ${isFavorited(theme.slug) ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-2">
            <p className={`text-xs font-medium truncate ${textColor}`}>{theme.name}</p>
            <p className={`text-xs ${subTextColor}`}>{theme.category}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Thumbnail Layout ────────────────────────────────────────────────────────

interface ThumbnailLayoutProps {
  themes: CatalogTheme[]
  favorites: string[]
  isFavorited: (slug: string) => boolean
  onPreview: (theme: CatalogTheme) => void
  onToggleFavorite: (slug: string, name: string) => void
  isLight: boolean
}

function ThumbnailLayout({ themes, isFavorited, onPreview, onToggleFavorite, isLight }: ThumbnailLayoutProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', dragFree: true })

  const activeTheme = themes[activeIndex] || themes[0]

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (!activeTheme) return null

  const textColor = isLight ? 'text-gray-800' : 'text-[#f4e4c1]'
  const subTextColor = isLight ? 'text-gray-500' : 'text-[#f4e4c1]/60'
  const cardBg = isLight ? 'bg-white shadow-lg' : 'bg-white/10 backdrop-blur-sm border border-white/10'

  return (
    <div className={`rounded-2xl overflow-hidden ${cardBg} p-4 sm:p-6`}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Main image + thumbnails */}
        <div className="flex-1 min-w-0">
          {/* Main image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTheme.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full aspect-[3/4] max-h-[400px] rounded-xl overflow-hidden mb-4"
            >
              <Image
                src={activeTheme.imageUrl}
                alt={activeTheme.name}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Thumbnail slider */}
          <div className="relative">
            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="overflow-hidden mx-8" ref={emblaRef}>
              <div className="flex gap-2">
                {themes.map((theme, idx) => (
                  <button
                    key={theme.slug}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === activeIndex
                        ? 'border-[#d4af37] scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    aria-label={`Pilih tema ${theme.name}`}
                  >
                    <Image
                      src={theme.imageUrl}
                      alt={theme.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Info + actions */}
        <div className="md:w-64 flex flex-col justify-center gap-4">
          <div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-[#d4af37]/20 text-[#d4af37] mb-2 inline-block`}>
              {activeTheme.category}
            </span>
            <h3 className={`text-xl sm:text-2xl font-bold ${textColor} mb-1`}>
              {activeTheme.name}
            </h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {activeTheme.tags.map((tag) => (
                <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-[#f4e4c1]/70'}`}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => onPreview(activeTheme)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#c19b2a] text-[#172a26] rounded-xl font-semibold transition-all"
            >
              <Eye className="w-4 h-4" />
              Preview Tema
            </button>

            <button
              onClick={() => onToggleFavorite(activeTheme.slug, activeTheme.name)}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border ${
                isFavorited(activeTheme.slug)
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : isLight
                  ? 'bg-white border-gray-200 text-gray-700 hover:border-rose-400 hover:text-rose-500'
                  : 'bg-white/10 border-white/20 text-[#f4e4c1] hover:border-rose-400 hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited(activeTheme.slug) ? 'fill-white' : ''}`} />
              {isFavorited(activeTheme.slug) ? 'Tersimpan' : 'Simpan Favorit'}
            </button>
          </div>

          <p className={`text-xs ${subTextColor}`}>
            {activeIndex + 1} dari {themes.length} tema
          </p>
        </div>
      </div>
    </div>
  )
}
