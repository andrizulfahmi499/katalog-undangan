'use client'

import { useState } from 'react'
import { X, Check, Lock, Star, Search, Sparkles } from 'lucide-react'

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
  currentSlug: string
  onSelect: (slug: string) => void
}

interface Template {
  slug: string
  name: string
  category: string
  subcategory?: string
  description: string
  available: boolean
  premium?: boolean
  colors: string[]
  tags?: string[]
}

const TEMPLATES: Template[] = [
  // Nisha - Featured Premium
  {
    slug: 'nisha',
    name: 'Nisha',
    category: 'Elegant',
    subcategory: 'Premium',
    description: 'Cinematic parallax wedding invitation with scene transitions, Ken Burns effects, vinyl music player, and elegant dark theme',
    available: true,
    premium: true,
    colors: ['#070707', '#f4f1ea', '#D4A853'],
    tags: ['premium', 'cinematic', 'parallax', 'dark'],
  },
  // Kasual & Formal
  {
    slug: 'starry-sea',
    name: 'The Starry Sea',
    category: 'Kasual & Formal',
    subcategory: 'Modern',
    description: '3D immersive starry night theme with gold typography and celestial animations',
    available: true,
    colors: ['#1a1a4e', '#d4a853', '#2d2d8f'],
    tags: ['modern', 'elegant', 'night'],
  },
  {
    slug: 'minimalist-white',
    name: 'Minimalist White',
    category: 'Kasual & Formal',
    subcategory: 'Minimalist',
    description: 'Clean minimalist design with white space and elegant typography',
    available: true,
    colors: ['#FFFFFF', '#2D2D2D', '#D4C9B8'],
    tags: ['minimal', 'clean', 'modern'],
  },
  {
    slug: 'rustic-barn',
    name: 'Rustic Barn',
    category: 'Kasual & Formal',
    subcategory: 'Rustic',
    description: 'Warm rustic theme with wood textures and natural elements',
    available: false,
    colors: ['#8B4513', '#D2B48C', '#228B22'],
    tags: ['rustic', 'outdoor', 'natural'],
  },

  // Elegant
  {
    slug: 'kalyana',
    name: 'Kalyana',
    category: 'Elegant',
    subcategory: 'Classic',
    description: 'Classic elegant with earth tone palette and serif typography',
    available: true,
    premium: true,
    colors: ['#8B7355', '#D4C9B8', '#2D2D2D'],
    tags: ['classic', 'elegant', 'formal'],
  },
  {
    slug: 'blooming-garden',
    name: 'Blooming Garden',
    category: 'Elegant',
    subcategory: 'Floral',
    description: 'Light cream with hand-painted flowers and maroon accents',
    available: true,
    colors: ['#800020', '#d4a853', '#5B8C5A'],
    tags: ['floral', 'garden', 'romantic'],
  },
  {
    slug: 'royal-gold',
    name: 'Royal Gold',
    category: 'Elegant',
    subcategory: 'Luxury',
    description: 'Luxurious gold theme with royal ornaments and premium feel',
    available: false,
    premium: true,
    colors: ['#FFD700', '#8B6914', '#1a1a1a'],
    tags: ['luxury', 'gold', 'royal'],
  },

  // Religi
  {
    slug: 'dusk-mosque',
    name: 'Dusk Mosque',
    category: 'Religi',
    subcategory: 'Islami',
    description: 'Islamic-inspired with mosque silhouette at dusk and Arabic calligraphy',
    available: true,
    colors: ['#2D4732', '#D4A853', '#1E3630'],
    tags: ['islamic', 'mosque', 'religious'],
  },
  {
    slug: 'sacred-chapel',
    name: 'Sacred Chapel',
    category: 'Religi',
    subcategory: 'Kristen',
    description: 'Beautiful chapel theme with stained glass and spiritual ambiance',
    available: false,
    colors: ['#4B0082', '#FFD700', '#FFFFFF'],
    tags: ['christian', 'chapel', 'religious'],
  },
  {
    slug: 'hijab-love',
    name: 'Hijab Love',
    category: 'Religi',
    subcategory: 'Islami',
    description: 'Modern Islamic theme with soft pastel colors and modest design',
    available: false,
    colors: ['#E8D5E0', '#8B5A7C', '#FFFFFF'],
    tags: ['islamic', 'modern', 'pastel'],
  },

  // Adat
  {
    slug: 'joglo-forest',
    name: 'Joglo Forest',
    category: 'Adat',
    subcategory: 'Jawa',
    description: 'Javanese Joglo with lush forest backdrop and traditional ornaments',
    available: true,
    premium: true,
    colors: ['#2D5016', '#8B7355', '#D4A853'],
    tags: ['javanese', 'traditional', 'nature'],
  },
  {
    slug: 'hastana-java',
    name: 'Hastana Java',
    category: 'Adat',
    subcategory: 'Jawa',
    description: 'Royal Javanese palace inspired with batik patterns',
    available: false,
    premium: true,
    colors: ['#8B6914', '#2D2D2D', '#D4A853'],
    tags: ['javanese', 'royal', 'batik'],
  },
  {
    slug: 'bali-paradise',
    name: 'Bali Paradise',
    category: 'Adat',
    subcategory: 'Bali',
    description: 'Balinese temple theme with tropical flowers and traditional decorations',
    available: false,
    colors: ['#228B22', '#FFD700', '#8B4513'],
    tags: ['balinese', 'tropical', 'temple'],
  },
  {
    slug: 'minang-house',
    name: 'Minang House',
    category: 'Adat',
    subcategory: 'Minang',
    description: 'West Sumatra traditional house with rich cultural elements',
    available: false,
    colors: ['#8B0000', '#FFD700', '#000000'],
    tags: ['minang', 'sumatera', 'traditional'],
  },

  // Tropical & Destination
  {
    slug: 'beach-sunset',
    name: 'Beach Sunset',
    category: 'Tropical',
    subcategory: 'Beach',
    description: 'Romantic beach sunset with ocean waves and golden sand',
    available: false,
    colors: ['#FF6B35', '#FFD700', '#1E90FF'],
    tags: ['beach', 'sunset', 'romantic'],
  },
  {
    slug: 'mountain-mist',
    name: 'Mountain Mist',
    category: 'Tropical',
    subcategory: 'Mountain',
    description: 'Misty mountain theme with pine trees and fresh air ambiance',
    available: false,
    colors: ['#2F4F4F', '#90EE90', '#F5F5DC'],
    tags: ['mountain', 'nature', 'outdoor'],
  },
  {
    slug: 'sun-of-monet',
    name: 'Sun of Monet',
    category: 'Tropical',
    subcategory: 'Artistic',
    description: 'Impressionist-inspired with warm golden light and artistic brushstrokes',
    available: false,
    colors: ['#C9A84C', '#5B8C5A', '#E8D5B5'],
    tags: ['artistic', 'impressionist', 'painting'],
  },
]

const CATEGORIES = [
  { id: 'all', name: 'Semua', icon: 'âœ¨' },
  { id: 'Kasual & Formal', name: 'Kasual & Formal', icon: 'ðŸŽ©' },
  { id: 'Elegant', name: 'Elegant', icon: 'ðŸ‘‘' },
  { id: 'Religi', name: 'Religi', icon: 'ðŸ•Œ' },
  { id: 'Adat', name: 'Adat', icon: 'ðŸ›ï¸' },
  { id: 'Tropical', name: 'Tropical', icon: 'ðŸŒ´' },
]

export default function TemplateModal({ isOpen, onClose, currentSlug, onSelect }: TemplateModalProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory
    const matchesSearch = !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const availableCount = filteredTemplates.filter(t => t.available).length
  const premiumCount = filteredTemplates.filter(t => t.premium && t.available).length

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E0D4] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#2D2D2D]">Pilih Template</h3>
            <p className="text-xs text-[#8B7E6F]">Temukan template yang sesuai dengan tema pernikahanmu</p>
          </div>
          <button onClick={onClose} className="text-[#8B7E6F] hover:text-[#2D2D2D] p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs & Search */}
        <div className="px-6 py-3 border-b border-[#E8E0D4] bg-[#FAFAF8]">
          <div className="flex items-center gap-4">
            {/* Category Tabs */}
            <div className="flex gap-2 flex-1 overflow-x-auto pb-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-[#3A5A40] text-white'
                      : 'bg-white text-[#8B7E6F] hover:bg-[#F5F5F0] border border-[#E8E0D4]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7E6F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari template..."
                className="pl-9 pr-4 py-2 border border-[#E8E0D4] rounded-lg text-sm w-48 focus:outline-none focus:border-[#3A5A40]"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-3 text-xs text-[#8B7E6F]">
            <span>{filteredTemplates.length} template ditemukan</span>
            <span>â€¢</span>
            <span>{availableCount} tersedia</span>
            {premiumCount > 0 && (
              <>
                <span>â€¢</span>
                <span className="text-amber-600">{premiumCount} premium</span>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F5F5F0] flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[#8B7E6F]" />
              </div>
              <p className="text-[#8B7E6F]">Tidak ada template yang ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTemplates.map(template => (
                <div
                  key={template.slug}
                  className={`relative rounded-xl border-2 overflow-hidden transition-all group ${
                    currentSlug === template.slug
                      ? 'border-[#3A5A40] shadow-lg ring-2 ring-[#3A5A40]/20'
                      : template.available
                      ? 'border-[#E8E0D4] hover:border-[#3A5A40]/50 cursor-pointer hover:shadow-md'
                      : 'border-[#E8E0D4] opacity-70'
                  }`}
                  onClick={() => template.available && template.slug !== currentSlug && onSelect(template.slug)}
                >
                  {/* Template Preview */}
                  <div
                    className="h-36 relative"
                    style={{
                      background: `linear-gradient(135deg, ${template.colors[0]}25, ${template.colors[1]}35, ${template.colors[2]}25)`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                          style={{ backgroundColor: template.colors[0] + '40' }}
                        >
                          <span className="text-lg" style={{ color: template.colors[0] }}>â™¥</span>
                        </div>
                        <p className="text-sm font-bold" style={{ color: template.colors[0] }}>
                          A & B
                        </p>
                        <p className="text-[10px] mt-1 opacity-60" style={{ color: template.colors[1] }}>
                          {template.subcategory}
                        </p>
                      </div>
                    </div>

                    {/* Premium badge */}
                    {template.premium && template.available && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" fill="white" />
                        Premium
                      </div>
                    )}

                    {/* Active indicator */}
                    {currentSlug === template.slug && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#3A5A40] flex items-center justify-center shadow-lg">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}

                    {/* Locked overlay */}
                    {!template.available && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/95 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                          <Lock className="w-3.5 h-3.5 text-[#8B7E6F]" />
                          <span className="text-xs font-semibold text-[#8B7E6F]">Coming Soon</span>
                        </div>
                      </div>
                    )}

                    {/* Hover preview button */}
                    {template.available && currentSlug !== template.slug && (
                      <div className="absolute inset-0 bg-[#3A5A40]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/95 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                          <Sparkles className="w-3.5 h-3.5 text-[#3A5A40]" />
                          <span className="text-xs font-semibold text-[#3A5A40]">Pilih Template</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-sm font-semibold text-[#2D2D2D] truncate">{template.name}</p>
                    <p className="text-xs text-[#8B7E6F] mt-0.5 line-clamp-2">{template.description}</p>

                    {/* Color swatches */}
                    <div className="flex gap-1 mt-2">
                      {template.colors.map((color, i) => (
                        <div key={i} className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8E0D4] bg-[#FAFAF8] flex items-center justify-between">
          <p className="text-xs text-[#8B7E6F]">
            Template lainnya akan segera tersedia. Pantau terus update kami!
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              Tersedia
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              Segera Hadir
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
