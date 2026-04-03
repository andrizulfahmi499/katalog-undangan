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
    <div className="backdrop-blur-xl bg-gray-800/40 border border-gray-700/40 rounded-3xl overflow-hidden">
      <div className="h-64 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-700 rounded animate-pulse" />
        <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse" />
        <div className="h-10 bg-gray-700 rounded-xl animate-pulse" />
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
      <section id="catalog" className="relative py-20 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden min-h-screen">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-block mb-6"
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                    Katalog Tema Undangan
                  </h2>
                  <Sparkles className="w-6 h-6 text-rose-400" />
                </div>
              </motion.div>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
                Temukan tema undangan pernikahan digital yang sesuai dengan impian Anda
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="flex items-center gap-2 text-gray-400">
                  <Grid className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold text-white">{catalogThemes.length}+ Tema</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold text-white">Trending Now</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold text-white">Update Harian</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Search Bar - Glassmorphism */}
          <ScrollReveal delay={0.1}>
            <div className="max-w-2xl mx-auto mb-8">
              <div className="backdrop-blur-xl bg-gray-800/30 border border-gray-700/40 rounded-2xl p-2 shadow-xl shadow-purple-500/10">
                <div className="flex items-center gap-3 px-4 py-2">
                  <Search className="w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Cari tema undangan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="backdrop-blur-md bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-shadow"
                  >
                    Cari
                  </motion.button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Category Filter - Glassmorphism */}
          <ScrollReveal delay={0.2}>
            <div className="mb-8">
              <div className="backdrop-blur-xl bg-gray-800/20 border border-gray-700/30 rounded-2xl p-4 shadow-xl shadow-purple-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-400">Filter Kategori:</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                          : 'backdrop-blur-md bg-gray-800/30 text-gray-300 hover:bg-gray-800/50 border border-gray-700/40'
                      }`}
                    >
                      {category.icon}
                      {category.name}
                    </motion.button>
                  ))}
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-700/30">
                  <span className="text-sm font-medium text-gray-400">Urutkan:</span>
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
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          sortBy === sort.value
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-800/30 text-gray-400 hover:bg-gray-800/50'
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
                    {/* Glassmorphism Card */}
                    <div className="backdrop-blur-xl bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/40 rounded-3xl overflow-hidden shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300">
                      {/* Featured & Discount Badges */}
                      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        {theme.featured && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="backdrop-blur-md bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
                          >
                            <Sparkles className="w-3 h-3" />
                            POPULER
                          </motion.div>
                        )}
                        {theme.discount && (
                          <div className="backdrop-blur-md bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
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
                          className="backdrop-blur-md bg-gray-900/80 p-2 rounded-full shadow-lg hover:bg-gray-900 transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${likedThemes.has(theme.id) ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'}`}
                          />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleBookmark(theme.id)}
                          className="backdrop-blur-md bg-gray-900/80 p-2 rounded-full shadow-lg hover:bg-gray-900 transition-colors"
                        >
                          <Bookmark
                            className={`w-4 h-4 ${bookmarkedThemes.has(theme.id) ? 'text-purple-400 fill-purple-400' : 'text-gray-400 hover:text-purple-400'}`}
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
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-6"
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePreview(theme)}
                            className="backdrop-blur-md bg-gray-900/90 text-purple-400 px-6 py-3 rounded-full font-semibold text-sm shadow-lg flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Preview Tema
                          </motion.button>
                        </motion.div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 backdrop-blur-md bg-gray-900/30">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{theme.name}</h3>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                                {theme.category}
                              </span>
                              <span className="text-xs text-gray-500">
                                {theme.subcategory}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                              {theme.price}
                            </div>
                            {theme.originalPrice && (
                              <div className="text-xs text-gray-600 line-through">
                                {theme.originalPrice}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(theme.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">
                            {theme.rating} ({theme.reviews} ulasan)
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-4 pt-3 border-t border-gray-700/30">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{theme.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span>{theme.likes}</span>
                          </div>
                          <div className="flex items-center gap-1 text-purple-400">
                            <Sparkles className="w-3 h-3" />
                            <span>Trending</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePreview(theme)}
                            className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectTheme(theme)}
                            className="flex-1 py-2.5 rounded-xl font-semibold text-sm border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all flex items-center justify-center gap-2"
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
                <h3 className="text-xl font-bold text-white mb-2">Tidak ada tema ditemukan</h3>
                <p className="text-gray-400 mb-4">Coba ubah kata kunci pencarian atau filter kategori</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="px-6 py-2 bg-purple-500 text-white rounded-full font-medium"
                >
                  Reset Filter
                </motion.button>
              </div>
            </ScrollReveal>
          )}

          {/* Load More Button */}
          {!isLoading && filteredThemes.length > 0 && (
            <ScrollReveal delay={0.5}>
              <div className="text-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="backdrop-blur-xl bg-gray-800/40 border border-gray-700/50 text-purple-400 px-10 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl hover:bg-gray-800/60 transition-all inline-flex items-center gap-2"
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
