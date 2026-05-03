'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useCleanAppConfig } from '@/context/CleanAppConfigContext'
import { TEMPLATE_OPTIONS } from '@/lib/invitationTemplates'
import { CleanAppCategoryPills } from './CleanAppCategoryPills'
import { CleanAppTemplateCard } from './CleanAppTemplateCard'

/**
 * CleanAppTemplateGrid Component
 * 
 * Template grid section with category filtering. Displays all available
 * invitation templates in a responsive grid layout with category filters.
 * 
 * Features:
 * - Category filtering with "Semua" (All) option
 * - Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)
 * - Staggered entrance animations
 * - Empty state when no templates match filter
 * - Template selection handling
 * - Smooth transitions between filter states
 * 
 * Requirements: 8.1, 8.2, 9.1, 9.2, 9.3, 10.1
 * Correctness Properties: CP-8, CP-9, CP-10, CP-11, CP-12, CP-13
 * 
 * @param onTemplateSelect - Optional callback when template is selected
 */

interface CleanAppTemplateGridProps {
  onTemplateSelect?: (templateId: string) => void
}

export function CleanAppTemplateGrid({ onTemplateSelect }: CleanAppTemplateGridProps) {
  const { config } = useCleanAppConfig()
  const [activeCategory, setActiveCategory] = useState<string>('Semua')

  // Extract unique categories from templates
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(TEMPLATE_OPTIONS.map((template) => template.category))
    )
    return ['Semua', ...uniqueCategories]
  }, [])

  // Filter templates based on active category
  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'Semua') {
      return TEMPLATE_OPTIONS
    }
    return TEMPLATE_OPTIONS.filter((template) => template.category === activeCategory)
  }, [activeCategory])

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    if (onTemplateSelect) {
      onTemplateSelect(templateId)
    } else {
      // Default behavior: scroll to order form or show alert
      const orderSection = document.getElementById('order')
      if (orderSection) {
        orderSection.scrollIntoView({ behavior: 'smooth' })
      } else {
        alert(`Template ${templateId} dipilih. Silakan hubungi admin untuk melanjutkan.`)
      }
    }
  }

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  }

  return (
    <section
      id="templates"
      className="py-20 px-4"
      style={{ backgroundColor: config.colors.background }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {config.templates.title && (
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ color: config.colors.textPrimary }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {config.templates.title}
          </motion.h2>
        )}

        {config.templates.subtitle && (
          <motion.p
            className="text-center mb-12 max-w-2xl mx-auto"
            style={{ color: config.colors.textSecondary }}
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {config.templates.subtitle}
          </motion.p>
        )}

        {/* Category Filter Pills */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CleanAppCategoryPills
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </motion.div>

        {/* Template Grid */}
        {filteredTemplates.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {filteredTemplates.map((template) => (
              <motion.div key={template.id} variants={itemVariants}>
                <CleanAppTemplateCard
                  template={template}
                  onSelect={handleTemplateSelect}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Empty State
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: config.colors.backgroundSecondary || '#F3F4F6' }}
            >
              <svg
                className="w-12 h-12"
                style={{ color: config.colors.textSecondary }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: config.colors.textPrimary }}
            >
              Tidak Ada Template
            </h3>
            <p
              className="text-sm mb-6"
              style={{ color: config.colors.textSecondary }}
            >
              Tidak ada template yang tersedia untuk kategori &quot;{activeCategory}&quot;
            </p>
            <button
              onClick={() => setActiveCategory('Semua')}
              className="px-6 py-3 rounded-full font-semibold text-white transition-all hover:shadow-lg min-h-[44px]"
              style={{ backgroundColor: config.colors.primary }}
            >
              Lihat Semua Template
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
