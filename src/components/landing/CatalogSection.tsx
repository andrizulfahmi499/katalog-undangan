'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import { ThemePreviewModal } from './ThemePreviewModal'
import { Heart, Eye, Bookmark, Search, Filter, Sparkles, Grid, Star, CheckCircle, Clock, TrendingUp, ArrowRight } from 'lucide-react'

// Enhanced theme data with more details
const catalogThemes = [
  {
    id: 1,
    name: 'Elegant Floral',
    category: 'Floral',
    subcategory: 'Elegan',
    price: '349K',
    originalPrice: '499K',
    discount: '30%',
    image: '🌸',
    color: 'from-pink-300 to-rose-300',
    views: 1234,
    likes: 89,
    featured: true,
    rating: 4.8,
    reviews: 156
  },
  {
    id: 2,
    name: 'Modern Minimalist',
    category: 'Minimalis',
    subcategory: 'Modern',
    price: '199K',
    originalPrice: '299K',
    discount: '33%',
    image: '✨',
    color: 'from-slate-300 to-gray-300',
    views: 987,
    likes: 67,
    featured: true,
    rating: 4.7,
    reviews: 124
  },
  {
    id: 3,
    name: 'Rustic Wedding',
    category: 'Floral',
    subcategory: 'Rustic',
    price: '299K',
    originalPrice: '399K',
    discount: '25%',
    image: '🍂',
    color: 'from-amber-300 to-orange-300',
    views: 756,
    likes: 54,
    featured: false,
    rating: 4.6,
    reviews: 89
  },
  {
    id: 4,
    name: 'Gold Luxury',
    category: 'Elegan',
    subcategory: 'Luxury',
    price: '599K',
    originalPrice: '799K',
    discount: '25%',
    image: '👑',
    color: 'from-yellow-300 to-amber-400',
    views: 2341,
    likes: 156,
    featured: true,
    rating: 4.9,
    reviews: 234
  },
  {
    id: 5,
    name: 'Beach Paradise',
    category: 'Minimalis',
    subcategory: 'Beach',
    price: '399K',
    originalPrice: '499K',
    discount: '20%',
    image: '🏖️',
    color: 'from-cyan-300 to-blue-300',
    views: 654,
    likes: 45,
    featured: false,
    rating: 4.5,
    reviews: 67
  },
  {
    id: 6,
    name: 'Classic Romance',
    category: 'Floral',
    subcategory: 'Classic',
    price: '249K',
    originalPrice: '349K',
    discount: '29%',
    image: '💕',
    color: 'from-rose-300 to-pink-400',
    views: 1876,
    likes: 123,
    featured: true,
    rating: 4.8,
    reviews: 189
  },
  {
    id: 7,
    name: 'Bohemian Dream',
    category: 'Minimalis',
    subcategory: 'Bohemian',
    price: '349K',
    originalPrice: '449K',
    discount: '22%',
    image: '🌿',
    color: 'from-green-300 to-emerald-400',
    views: 543,
    likes: 38,
    featured: false,
    rating: 4.4,
    reviews: 56
  },
  {
    id: 8,
    name: 'Royal Purple',
    category: 'Elegan',
    subcategory: 'Luxury',
    price: '499K',
    originalPrice: '699K',
    discount: '29%',
    image: '💜',
    color: 'from-purple-300 to-violet-400',
    views: 876,
    likes: 72,
    featured: false,
    rating: 4.7,
    reviews: 98
  },
  {
    id: 9,
    name: 'Sunset Garden',
    category: 'Floral',
    subcategory: 'Garden',
    price: '299K',
    originalPrice: '399K',
    discount: '25%',
    image: '🌺',
    color: 'from-orange-300 to-red-300',
    views: 698,
    likes: 51,
    featured: false,
    rating: 4.6,
    reviews: 78
  },
  {
    id: 10,
    name: 'Winter Wonderland',
    category: 'Minimalis',
    subcategory: 'Seasonal',
    price: '449K',
    originalPrice: '599K',
    discount: '25%',
    image: '❄️',
    color: 'from-blue-200 to-indigo-300',
    views: 1098,
    likes: 87,
    featured: true,
    rating: 4.8,
    reviews: 145
  },
  {
    id: 11,
    name: 'Vintage Charm',
    category: 'Elegan',
    subcategory: 'Vintage',
    price: '279K',
    originalPrice: '379K',
    discount: '26%',
    image: '📜',
    color: 'from-stone-300 to-amber-200',
    views: 789,
    likes: 59,
    featured: false,
    rating: 4.5,
    reviews: 87
  },
  {
    id: 12,
    name: 'Islamic Elegance',
    category: 'Islami',
    subcategory: 'Traditional',
    price: '399K',
    originalPrice: '549K',
    discount: '27%',
    image: '🕌',
    color: 'from-teal-300 to-cyan-400',
    views: 1567,
    likes: 112,
    featured: true,
    rating: 4.9,
    reviews: 198
  },
  {
    id: 13,
    name: 'Peony Dreams',
    category: 'Floral',
    subcategory: 'Elegan',
    price: '329K',
    originalPrice: '449K',
    discount: '27%',
    image: '🌷',
    color: 'from-pink-200 to-pink-300',
    views: 923,
    likes: 76,
    featured: false,
    rating: 4.7,
    reviews: 112
  },
  {
    id: 14,
    name: 'Nordic Clean',
    category: 'Minimalis',
    subcategory: 'Modern',
    price: '279K',
    originalPrice: '379K',
    discount: '26%',
    image: '🤍',
    color: 'from-gray-100 to-gray-200',
    views: 645,
    likes: 48,
    featured: false,
    rating: 4.6,
    reviews: 73
  },
  {
    id: 15,
    name: 'Rose Gold',
    category: 'Elegan',
    subcategory: 'Luxury',
    price: '449K',
    originalPrice: '599K',
    discount: '25%',
    image: '🌹',
    color: 'from-pink-200 to-rose-200',
    views: 1345,
    likes: 98,
    featured: true,
    rating: 4.8,
    reviews: 167
  },
  {
    id: 16,
    name: 'Greenery Fresh',
    category: 'Floral',
    subcategory: 'Natural',
    price: '289K',
    originalPrice: '389K',
    discount: '26%',
    image: '🌱',
    color: 'from-green-200 to-emerald-300',
    views: 756,
    likes: 52,
    featured: false,
    rating: 4.5,
    reviews: 89
  }
]

const categories = [
  { id: 'all', name: 'Semua', icon: <Grid className="w-4 h-4" /> },
  { id: 'Elegan', name: 'Elegan', icon: <Star className="w-4 h-4" /> },
  { id: 'Minimalis', name: 'Minimalis', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'Islami', name: 'Islami', icon: <CheckCircle className="w-4 h-4" /> },
  { id: 'Floral', name: 'Floral', icon: <Heart className="w-4 h-4" /> }
]

// Loading Skeleton Component
function ThemeCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/80">
      <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
        <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    </div>
  )
}

export function CatalogSection() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [likedThemes, setLikedThemes] = useState<Set<number>>(new Set())
  const [bookmarkedThemes, setBookmarkedThemes] = useState<Set<number>>(new Set())
  const [selectedTheme, setSelectedTheme] = useState<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-low' | 'price-high'>('popular')

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [selectedCategory])

  const filteredThemes = catalogThemes
    .filter(theme => {
      const matchesCategory = selectedCategory === 'all' || theme.category === selectedCategory
      const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           theme.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           theme.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.views - a.views
        case 'newest':
          return b.id - a.id
        case 'price-low':
          return parseInt(a.price) - parseInt(b.price)
        case 'price-high':
          return parseInt(b.price) - parseInt(a.price)
        default:
          return 0
      }
    })

  const toggleLike = (id: number) => {
    setLikedThemes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleBookmark = (id: number) => {
    setBookmarkedThemes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handlePreview = (theme: any) => {
    setSelectedTheme(theme)
    setIsPreviewOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const handleClosePreview = () => {
    setIsPreviewOpen(false)
    document.body.style.overflow = 'unset'
  }

  const handleSelectTheme = (theme: any) => {
    console.log('Selected theme:', theme.name)
    // Here you would typically save the selected theme or redirect to order page
    alert(`Anda memilih tema: ${theme.name}\n\nHarga: ${theme.price}\n\nLanjutkan ke pembuatan undangan?`)
    handleClosePreview()
  }

  return (
    <>
      <section id="catalog" className="relative py-24 overflow-hidden min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                  <Sparkles className="w-6 h-6 text-[#A5B4FC]" />
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2F2F2F]">
                    Katalog Tema Undangan
                  </h2>
                  <Sparkles className="w-6 h-6 text-[#C4B5FD]" />
                </div>
              </motion.div>
              <p className="text-xl text-[#4A4A4A] max-w-2xl mx-auto mb-8 leading-relaxed">
                Temukan tema undangan pernikahan digital yang sesuai dengan impian Anda
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="flex items-center gap-2 text-[#6B7280]">
                  <Grid className="w-5 h-5 text-[#A5B4FC]" />
                  <span className="font-semibold text-[#2F2F2F]">{catalogThemes.length}+ Tema</span>
                </div>
                <div className="flex items-center gap-2 text-[#6B7280]">
                  <TrendingUp className="w-5 h-5 text-[#C4B5FD]" />
                  <span className="font-semibold text-[#2F2F2F]">Trending Now</span>
                </div>
                <div className="flex items-center gap-2 text-[#6B7280]">
                  <Clock className="w-5 h-5 text-[#FBCFE8]" />
                  <span className="font-semibold text-[#2F2F2F]">Update Harian</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Search Bar */}
          <ScrollReveal delay={0.1}>
            <div className="max-w-2xl mx-auto mb-10">
              <div className="bg-white rounded-3xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/80">
                <div className="flex items-center gap-3 px-6 py-3">
                  <Search className="w-5 h-5 text-[#A5B4FC]" />
                  <input
                    type="text"
                    placeholder="Cari tema undangan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-[#2F2F2F] placeholder-[#9CA3AF] text-base"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white px-8 py-3 rounded-2xl font-medium hover:shadow-lg hover:shadow-[#A5B4FC]/30 transition-all duration-300"
                  >
                    Cari
                  </motion.button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Category Filter */}
          <ScrollReveal delay={0.2}>
            <div className="mb-10">
              <div className="bg-white rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/80">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-[#6B7280]" />
                  <span className="text-sm font-medium text-[#6B7280]">Filter Kategori:</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white shadow-lg shadow-[#A5B4FC]/30'
                          : 'bg-white text-[#6B7280] hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {category.icon}
                      {category.name}
                    </motion.button>
                  ))}
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-2 pt-6 border-t border-gray-100">
                  <span className="text-sm font-medium text-[#6B7280]">Urutkan:</span>
                  <div className="flex gap-2">
                    {[
                      { value: 'popular', label: 'Terpopuler' },
                      { value: 'newest', label: 'Terbaru' },
                      { value: 'price-low', label: 'Harga Terendah' },
                      { value: 'price-high', label: 'Harga Tertinggi' },
                    ].map((sort) => (
                      <motion.button
                        key={sort.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSortBy(sort.value as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                          sortBy === sort.value
                            ? 'bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white shadow-md'
                            : 'bg-white text-[#6B7280] hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {sort.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <ThemeCardSkeleton key={index} />
              ))
            ) : (
              // Theme Cards
              filteredThemes.map((theme, index) => (
                <ScrollReveal key={theme.id} delay={index * 0.05}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    {/* Card */}
                    <div className="relative bg-white rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/80 hover:shadow-[0_20px_60px_rgba(165,180,252,0.25)] transition-all duration-500">
                      {/* Featured & Discount Badges */}
                      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        {theme.featured && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg shadow-[#A5B4FC]/30"
                          >
                            <Sparkles className="w-3 h-3" />
                            POPULER
                          </motion.div>
                        )}
                        {theme.discount && (
                          <div className="bg-gradient-to-r from-[#FBCFE8] to-[#F9A8D4] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                            {theme.discount} OFF
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleLike(theme.id)}
                          className="bg-white/90 backdrop-blur-sm p-2.5 rounded-2xl shadow-md hover:shadow-lg border border-white/60 transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${likedThemes.has(theme.id) ? 'text-[#FBCFE8] fill-[#FBCFE8]' : 'text-[#6B7280] hover:text-[#FBCFE8]'}`}
                          />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleBookmark(theme.id)}
                          className="bg-white/90 backdrop-blur-sm p-2.5 rounded-2xl shadow-md hover:shadow-lg border border-white/60 transition-colors"
                        >
                          <Bookmark
                            className={`w-4 h-4 ${bookmarkedThemes.has(theme.id) ? 'text-[#A5B4FC] fill-[#A5B4FC]' : 'text-[#6B7280] hover:text-[#A5B4FC]'}`}
                          />
                        </motion.button>
                      </div>

                      {/* Theme Preview */}
                      <div className="relative h-64 overflow-hidden">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                          className={`absolute inset-0 bg-gradient-to-br ${theme.color} flex items-center justify-center text-8xl`}
                        >
                          {theme.image}
                        </motion.div>

                        {/* Overlay with Preview Button */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-gradient-to-t from-[#2F2F2F]/60 via-[#2F2F2F]/20 to-transparent flex items-end justify-center pb-6 backdrop-blur-sm"
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePreview(theme)}
                            className="bg-white/95 text-[#2F2F2F] px-6 py-3 rounded-2xl font-semibold text-sm shadow-lg flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Preview Tema
                          </motion.button>
                        </motion.div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 bg-white/80 border-t border-gray-100">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-[#2F2F2F] mb-1">{theme.name}</h3>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-[#2F2F2F] bg-gray-100 px-2.5 py-1 rounded-full">
                                {theme.category}
                              </span>
                              <span className="text-xs text-[#6B7280]">
                                {theme.subcategory}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#2F2F2F]">
                              {theme.price}
                            </div>
                            {theme.originalPrice && (
                              <div className="text-xs text-[#9CA3AF] line-through">
                                {theme.originalPrice}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < Math.floor(theme.rating) ? 'text-[#A5B4FC] fill-[#A5B4FC]' : 'text-gray-200'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-[#6B7280]">
                            {theme.rating} ({theme.reviews} ulasan)
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs text-[#6B7280] mb-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-[#C4B5FD]" />
                            <span>{theme.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-[#FBCFE8]" />
                            <span>{theme.likes}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[#A5B4FC]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Trending</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePreview(theme)}
                            className="flex-1 py-3 rounded-2xl font-semibold text-sm bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white shadow-lg shadow-[#A5B4FC]/30 hover:shadow-xl hover:shadow-[#C4B5FD]/40 transition-all flex items-center justify-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectTheme(theme)}
                            className="flex-1 py-3 rounded-2xl font-semibold text-sm border-2 border-[#A5B4FC] text-[#A5B4FC] hover:bg-[#A5B4FC] hover:text-white transition-all flex items-center justify-center gap-2 bg-white"
                          >
                            Pilih
                            <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))
            )}
          </div>

          {/* Empty State */}
          {!isLoading && filteredThemes.length === 0 && (
            <ScrollReveal>
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-[#2F2F2F] mb-2">Tidak ada tema ditemukan</h3>
                <p className="text-[#6B7280] mb-4">Coba ubah kata kunci pencarian atau filter kategori</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] text-white rounded-2xl font-medium shadow-lg shadow-[#A5B4FC]/30"
                >
                  Reset Filter
                </motion.button>
              </div>
            </ScrollReveal>
          )}

          {/* Load More Button */}
          {!isLoading && filteredThemes.length > 0 && (
            <ScrollReveal delay={0.5}>
              <div className="text-center mt-16">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#2F2F2F] px-12 py-4 rounded-full font-semibold shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/80 hover:shadow-[0_16px_48px_rgba(165,180,252,0.25)] hover:bg-gray-50 transition-all inline-flex items-center gap-2"
                >
                  Lihat Lebih Banyak Tema
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Preview Modal */}
      <ThemePreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        theme={selectedTheme}
        onSelectTheme={() => handleSelectTheme(selectedTheme)}
      />
    </>
  )
}
