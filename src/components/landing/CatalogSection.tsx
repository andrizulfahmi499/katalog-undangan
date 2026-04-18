'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import { Sparkles, Grid, TrendingUp, Clock, ArrowRight, ChevronDown, Eye } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

// Types
interface Theme {
  id: number
  name: string
  slug: string
  featured_image: string
  category: string
  price?: string
  originalPrice?: string | null
  discount?: string | null
  description?: string
  previewUrl: string
  orderUrl: string
}

interface Category {
  id: string
  name: string
  slug: string
}

// Loading Skeleton Component
function ThemeCardSkeleton({ isLight }: { isLight: boolean }) {
  return (
    <div className={`rounded-3xl overflow-hidden ${
      isLight
        ? 'neu-raised'
        : 'bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/15'
    }`}>
      <div className={`aspect-[3/4] animate-pulse ${
        isLight ? 'bg-[#d1d9e6]' : 'bg-gradient-to-br from-[#1b2f29]/80 to-[#223e36]/80'
      }`} />
      <div className="p-4 space-y-3">
        <div className={`h-4 rounded animate-pulse ${isLight ? 'bg-[#d1d9e6]' : 'bg-white/10'}`} />
        <div className={`h-3 rounded w-2/3 animate-pulse ${isLight ? 'bg-[#d1d9e6]' : 'bg-white/10'}`} />
        <div className="grid grid-cols-2 gap-2">
          <div className={`h-10 rounded-xl animate-pulse ${isLight ? 'bg-[#d1d9e6]' : 'bg-white/10'}`} />
          <div className={`h-10 rounded-xl animate-pulse ${isLight ? 'bg-[#d1d9e6]' : 'bg-white/10'}`} />
        </div>
      </div>
    </div>
  )
}

export function CatalogSection() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalThemes, setTotalThemes] = useState(0)
  const { isLight } = useTheme()

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories')
        const result = await response.json()
        if (result.success) {
          setCategories(result.data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  // Fetch themes
  useEffect(() => {
    async function fetchThemes(page: number = 1, reset: boolean = true) {
      try {
        if (page === 1) {
          setIsLoading(true)
        } else {
          setIsLoadingMore(true)
        }

        const categoryId = selectedCategory === 'all' ? '' : selectedCategory
        const url = `/api/themes?page=${page}&limit=12${categoryId ? `&categoryId=${categoryId}` : ''}`

        const response = await fetch(url)
        const result = await response.json()

        if (result.success) {
          if (reset) {
            setThemes(result.data)
          } else {
            setThemes(prev => [...prev, ...result.data])
          }

          setHasMore(result.pagination.hasMore)
          setTotalThemes(prev => reset ? result.data.length : prev + result.data.length)
        }
      } catch (error) {
        console.error('Error fetching themes:', error)
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    }

    setCurrentPage(1)
    fetchThemes(1, true)
  }, [selectedCategory])

  const handleLoadMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    setIsLoadingMore(true)

    const categoryId = selectedCategory === 'all' ? '' : selectedCategory
    fetch(`/api/themes?page=${nextPage}&limit=12${categoryId ? `&categoryId=${categoryId}` : ''}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setThemes(prev => [...prev, ...result.data])
          setHasMore(result.pagination.hasMore)
          setTotalThemes(prev => prev + result.data.length)
        }
      })
      .catch(error => {
        console.error('Error loading more themes:', error)
      })
      .finally(() => {
        setIsLoadingMore(false)
      })
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setIsFilterOpen(false)
  }

  return (
    <section id="catalog" className="relative py-10 overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles className={`w-6 h-6 ${isLight ? 'text-[#8b8fa3]' : 'text-[#aabbb2]'}`} />
                <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${
                  isLight ? 'text-[#2d3748]' : 'text-white'
                }`}>
                  Katalog Tema Undangan
                </h2>
                <Sparkles className={`w-6 h-6 ${isLight ? 'text-[#a0a4b8]' : 'text-[#ededed]'}`} />
              </div>
            </motion.div>
            <p className={`text-xl max-w-2xl mx-auto mb-8 leading-relaxed ${
              isLight ? 'text-[#6b7280]' : 'text-gray-200/80'
            }`}>
              Temukan tema undangan pernikahan digital yang sesuai dengan impian Anda
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className={`flex items-center gap-2 ${isLight ? 'text-[#9ca3af]' : 'text-gray-300/70'}`}>
                <Grid className={`w-5 h-5 ${isLight ? 'text-[#8b8fa3]' : 'text-[#aabbb2]'}`} />
                <span className={`font-semibold ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>{totalThemes}+ Tema</span>
              </div>
              <div className={`flex items-center gap-2 ${isLight ? 'text-[#9ca3af]' : 'text-gray-300/70'}`}>
                <TrendingUp className={`w-5 h-5 ${isLight ? 'text-[#8b8fa3]' : 'text-[#ededed]'}`} />
                <span className={`font-semibold ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>Trending Now</span>
              </div>
              <div className={`flex items-center gap-2 ${isLight ? 'text-[#9ca3af]' : 'text-gray-300/70'}`}>
                <Clock className={`w-5 h-5 ${isLight ? 'text-[#8b8fa3]' : 'text-[#FBCFE8]'}`} />
                <span className={`font-semibold ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>Update Harian</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Category Filter - Dropdown Style */}
        <ScrollReveal delay={0.1}>
          <div className="mb-10">
            <div className="flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  isLight
                    ? 'neu-btn text-[#2d3748]'
                    : 'bg-[#ededed] text-[#172a26] shadow-lg hover:bg-white'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Pilih Kategori</span>
                <motion.div
                  animate={{ rotate: isFilterOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              {/* Filter Content */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isFilterOpen ? 'auto' : 0,
                  opacity: isFilterOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden w-full"
              >
                <div className="flex flex-wrap gap-2 items-center justify-center py-6">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 ${
                        isLight
                          ? selectedCategory === category.id
                            ? 'neu-pressed text-[#2d3748]'
                            : 'neu-flat text-[#6b7280] hover:text-[#2d3748]'
                          : selectedCategory === category.id
                            ? 'bg-[#ededed] text-[#172a26] shadow-lg'
                            : 'bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/15 border border-white/15 shadow-sm'
                      }`}
                    >
                      <span>{category.name}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </ScrollReveal>

        {/* Catalog Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading Skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <ThemeCardSkeleton key={index} isLight={isLight} />
            ))
          ) : (
            // Theme Cards
            themes.map((theme, index) => (
              <ScrollReveal key={theme.id} delay={index * 0.05}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  {/* Card */}
                  <div className={`relative rounded-3xl overflow-hidden transition-all duration-500 ${
                    isLight
                      ? 'neu-raised hover:shadow-[10px_10px_20px_#b8bec7,-10px_-10px_20px_#ffffff]'
                      : 'bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/15 hover:bg-white/15 hover:shadow-[0_20px_60px_rgba(165,180,252,0.2)]'
                  }`}>
                    {/* Theme Preview Image */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={theme.featured_image}
                        alt={theme.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Overlay on Hover */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-t from-[#2F2F2F]/60 via-[#2F2F2F]/20 to-transparent"
                      />
                    </div>

                    {/* Card Content */}
                    <div className={`p-4 ${
                      isLight
                        ? 'bg-[#e0e5ec] border-t border-[#d1d9e6]'
                        : 'bg-white/5 backdrop-blur-sm border-t border-white/10'
                    }`}>
                      {/* Category Badge */}
                      <div className="mb-2">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                          isLight
                            ? 'text-[#8b8fa3] bg-[#d1d9e6]'
                            : 'text-white/60 bg-white/10'
                        }`}>
                          {theme.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className={`text-base font-bold mb-3 line-clamp-2 min-h-[3rem] ${
                        isLight ? 'text-[#2d3748]' : 'text-white'
                      }`}>
                        {theme.name}
                      </h3>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 gap-2">
                        <a
                          href={theme.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs font-semibold py-2.5 px-3 text-center rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                            isLight
                              ? 'neu-flat text-[#6b7280] hover:text-[#2d3748] hover:shadow-[inset_2px_2px_4px_#b8bec7,inset_-2px_-2px_4px_#ffffff]'
                              : 'bg-white/10 text-white/70 border border-white/15 hover:bg-white/20 hover:text-white'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Preview
                        </a>
                        <a
                          href={theme.orderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs font-semibold py-2.5 px-3 text-center rounded-2xl transition-all duration-300 ${
                            isLight
                              ? 'neu-btn text-[#2d3748] hover:shadow-[inset_2px_2px_4px_#b8bec7,inset_-2px_-2px_4px_#ffffff]'
                              : 'bg-[#ededed] text-[#172a26] hover:bg-white'
                          }`}
                        >
                          Pesan Sekarang
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))
          )}
        </div>

        {/* Empty State */}
        {!isLoading && themes.length === 0 && (
          <ScrollReveal>
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className={`text-xl font-bold mb-2 ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>Tidak ada tema ditemukan</h3>
              <p className={`mb-4 ${isLight ? 'text-[#6b7280]' : 'text-gray-200/70'}`}>Coba pilih kategori lain</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory('all')}
                className={`px-8 py-3 rounded-2xl font-medium ${
                  isLight
                    ? 'neu-btn text-[#2d3748]'
                    : 'bg-[#ededed] text-[#172a26] hover:bg-white'
                }`}
              >
                Lihat Semua Tema
              </motion.button>
            </div>
          </ScrollReveal>
        )}

        {/* Load More Button */}
        {!isLoading && themes.length > 0 && hasMore && (
          <ScrollReveal delay={0.5}>
            <div className="text-center mt-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className={`px-12 py-4 rounded-full font-semibold inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                  isLight
                    ? 'neu-btn text-[#2d3748]'
                    : 'bg-[#ededed] text-[#172a26] hover:bg-white shadow-lg'
                }`}
              >
                {isLoadingMore ? (
                  <>
                    <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    Load More Themes
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
