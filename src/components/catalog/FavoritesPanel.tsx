'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Eye } from 'lucide-react'
import Image from 'next/image'
import { getCatalogThemeBySlug, type CatalogTheme } from '@/lib/catalogThemes'

interface FavoritesPanelProps {
  isOpen: boolean
  onClose: () => void
  favorites: string[]
  onRemoveFavorite: (slug: string) => void
  onPreview: (theme: CatalogTheme) => void
}

export default function FavoritesPanel({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onPreview,
}: FavoritesPanelProps) {
  const favoriteThemes = favorites
    .map((slug) => getCatalogThemeBySlug(slug))
    .filter(Boolean) as CatalogTheme[]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 max-w-full z-50 bg-[#172a26] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                <h2 className="text-[#f4e4c1] font-semibold">Tema Favorit</h2>
                {favorites.length > 0 && (
                  <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {favorites.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-[#f4e4c1] transition-colors"
                aria-label="Tutup panel favorit"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {favoriteThemes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <Heart className="w-16 h-16 text-white/20 mb-4" />
                  <p className="text-[#f4e4c1]/60 text-sm">Belum ada tema favorit</p>
                  <p className="text-[#f4e4c1]/40 text-xs mt-1">
                    Klik ikon ♡ pada tema untuk menyimpannya
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favoriteThemes.map((theme) => (
                    <motion.div
                      key={theme.slug}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-white/10">
                        <Image
                          src={theme.imageUrl}
                          alt={theme.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[#f4e4c1] text-sm font-medium truncate">{theme.name}</p>
                        <p className="text-[#f4e4c1]/50 text-xs">{theme.category}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onPreview(theme)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-[#f4e4c1] transition-colors"
                          aria-label={`Preview ${theme.name}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemoveFavorite(theme.slug)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                          aria-label={`Hapus ${theme.name} dari favorit`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
