'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import { Heart, Eye, Bookmark, Search, Filter, Sparkles, Calendar, Heart as HeartFilled } from 'lucide-react'

// Mock catalog data - dalam production, ini akan diambil dari API
const catalogTemplates = [
  {
    id: 1,
    name: 'Elegant Floral',
    category: 'Floral',
    price: '349K',
    image: '🌸',
    color: 'from-pink-300 to-rose-300',
    views: 1234,
    likes: 89,
    featured: true
  },
  {
    id: 2,
    name: 'Modern Minimalist',
    category: 'Minimalist',
    price: '199K',
    image: '✨',
    color: 'from-slate-300 to-gray-300',
    views: 987,
    likes: 67,
    featured: true
  },
  {
    id: 3,
    name: 'Rustic Wedding',
    category: 'Rustic',
    price: '299K',
    image: '🍂',
    color: 'from-amber-300 to-orange-300',
    views: 756,
    likes: 54,
    featured: false
  },
  {
    id: 4,
    name: 'Gold Luxury',
    category: 'Luxury',
    price: '599K',
    image: '👑',
    color: 'from-yellow-300 to-amber-400',
    views: 2341,
    likes: 156,
    featured: true
  },
  {
    id: 5,
    name: 'Beach Paradise',
    category: 'Beach',
    price: '399K',
    image: '🏖️',
    color: 'from-cyan-300 to-blue-300',
    views: 654,
    likes: 45,
    featured: false
  },
  {
    id: 6,
    name: 'Classic Romance',
    category: 'Classic',
    price: '249K',
    image: '💕',
    color: 'from-rose-300 to-pink-400',
    views: 1876,
    likes: 123,
    featured: true
  },
  {
    id: 7,
    name: 'Bohemian Dream',
    category: 'Bohemian',
    price: '349K',
    image: '🌿',
    color: 'from-green-300 to-emerald-400',
    views: 543,
    likes: 38,
    featured: false
  },
  {
    id: 8,
    name: 'Royal Purple',
    category: 'Luxury',
    price: '499K',
    image: '💜',
    color: 'from-purple-300 to-violet-400',
    views: 876,
    likes: 72,
    featured: false
  },
  {
    id: 9,
    name: 'Sunset Garden',
    category: 'Floral',
    price: '299K',
    image: '🌺',
    color: 'from-orange-300 to-red-300',
    views: 698,
    likes: 51,
    featured: false
  },
  {
    id: 10,
    name: 'Winter Wonderland',
    category: 'Seasonal',
    price: '449K',
    image: '❄️',
    color: 'from-blue-200 to-indigo-300',
    views: 1098,
    likes: 87,
    featured: true
  },
  {
    id: 11,
    name: 'Vintage Charm',
    category: 'Vintage',
    price: '279K',
    image: '📜',
    color: 'from-stone-300 to-amber-200',
    views: 789,
    likes: 59,
    featured: false
  },
  {
    id: 12,
    name: 'Islamic Elegance',
    category: 'Islamic',
    price: '399K',
    image: '🕌',
    color: 'from-teal-300 to-cyan-400',
    views: 1567,
    likes: 112,
    featured: true
  }
]

const categories = ['Semua', 'Floral', 'Minimalist', 'Luxury', 'Rustic', 'Classic', 'Bohemian', 'Vintage', 'Islamic', 'Beach']

export function CatalogSection() {
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [likedTemplates, setLikedTemplates] = useState<Set<number>>(new Set())
  const [bookmarkedTemplates, setBookmarkedTemplates] = useState<Set<number>>(new Set())

  const filteredTemplates = catalogTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'Semua' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleLike = (id: number) => {
    setLikedTemplates(prev => {
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
    setBookmarkedTemplates(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <section id="catalog" className="relative py-20 bg-gradient-to-br from-white via-pink-50 to-purple-50 overflow-hidden min-h-screen">
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
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full blur-3xl opacity-50"
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
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-50"
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
                <Sparkles className="w-6 h-6 text-[#C2185B]" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#C2185B] to-purple-600 bg-clip-text text-transparent">
                  Katalog Template
                </h2>
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
            </motion.div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Temukan template undangan pernikahan digital yang sesuai dengan tema pernikahan impian Anda
            </p>
          </div>
        </ScrollReveal>

        {/* Search Bar - Glassmorphism */}
        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mx-auto mb-8">
            <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl p-2 shadow-xl shadow-purple-500/10">
              <div className="flex items-center gap-3 px-4 py-2">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Cari template undangan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="backdrop-blur-md bg-gradient-to-r from-[#C2185B] to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-shadow"
                >
                  Cari
                </motion.button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Category Filter - Glassmorphism */}
        <ScrollReveal delay={0.2}>
          <div className="mb-12">
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 shadow-xl shadow-purple-500/10">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Filter Kategori:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-[#C2185B] to-purple-600 text-white shadow-lg shadow-purple-500/30'
                        : 'backdrop-blur-md bg-white/30 text-gray-700 hover:bg-white/50 border border-white/40'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Catalog Grid - Glassmorphism Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template, index) => (
            <ScrollReveal key={template.id} delay={index * 0.05}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Glassmorphism Card */}
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/40 to-white/20 border border-white/40 rounded-3xl overflow-hidden shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300">
                  {/* Featured Badge */}
                  {template.featured && (
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute top-4 left-4 z-20"
                    >
                      <div className="backdrop-blur-md bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        POPULER
                      </div>
                    </motion.div>
                  )}

                  {/* Template Preview */}
                  <div className="relative h-64 overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute inset-0 bg-gradient-to-br ${template.color} flex items-center justify-center text-8xl`}
                    >
                      {template.image}
                    </motion.div>

                    {/* Overlay on Hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-4"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="backdrop-blur-md bg-white/90 text-[#C2185B] px-6 py-2 rounded-full font-semibold text-sm shadow-lg"
                      >
                        Preview Template
                      </motion.button>
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleLike(template.id)}
                        className="backdrop-blur-md bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        {likedTemplates.has(template.id) ? (
                          <HeartFilled className="w-4 h-4 text-red-500 fill-red-500" />
                        ) : (
                          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleBookmark(template.id)}
                        className="backdrop-blur-md bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            bookmarkedTemplates.has(template.id)
                              ? 'text-[#C2185B] fill-[#C2185B]'
                              : 'text-gray-600 hover:text-[#C2185B]'
                          }`}
                        />
                      </motion.button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 backdrop-blur-md bg-white/30">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{template.name}</h3>
                        <span className="text-xs font-medium text-gray-600 bg-white/50 px-2 py-1 rounded-full">
                          {template.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold bg-gradient-to-r from-[#C2185B] to-purple-600 bg-clip-text text-transparent">
                          {template.price}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-3 pt-3 border-t border-white/30">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{template.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{template.likes}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#C2185B] to-purple-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all"
                    >
                      Pilih Template Ini
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <ScrollReveal>
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Tidak ada template ditemukan</h3>
              <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter kategori</p>
            </div>
          </ScrollReveal>
        )}

        {/* Load More Button */}
        {filteredTemplates.length > 0 && (
          <ScrollReveal delay={0.5}>
            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="backdrop-blur-xl bg-white/40 border border-white/50 text-[#C2185B] px-10 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl hover:bg-white/60 transition-all"
              >
                Lihat Lebih Banyak Template
              </motion.button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
