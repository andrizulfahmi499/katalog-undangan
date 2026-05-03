'use client'

import { motion } from 'framer-motion'
import { useCleanAppConfig } from '@/context/CleanAppConfigContext'

/**
 * CleanAppCategoryPills Component
 * 
 * Category filter buttons for template grid. Displays pill-shaped buttons
 * for each category with active state styling.
 * 
 * Features:
 * - Pill-shaped buttons with rounded corners
 * - Active state with primary color background
 * - Smooth transitions on state changes
 * - Touch-friendly sizing (min 44px height)
 * - Horizontal scrollable on mobile
 * 
 * Requirements: 8.1, 8.2
 * Correctness Properties: CP-8, CP-9
 * 
 * @param categories - Array of category names to display
 * @param activeCategory - Currently selected category
 * @param onCategoryChange - Callback when category is selected
 */

interface CleanAppCategoryPillsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CleanAppCategoryPills({
  categories,
  activeCategory,
  onCategoryChange,
}: CleanAppCategoryPillsProps) {
  const { config } = useCleanAppConfig()

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const isActive = activeCategory === category

        return (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category)}
            className="px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all min-h-[44px] flex items-center"
            style={{
              backgroundColor: isActive
                ? config.colors.primary
                : config.colors.backgroundSecondary || '#F3F4F6',
              color: isActive ? '#FFFFFF' : config.colors.textSecondary,
              border: isActive ? 'none' : `1px solid ${config.colors.textSecondary}20`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-pressed={isActive}
            aria-label={`Filter by ${category}`}
          >
            {category}
          </motion.button>
        )
      })}
    </div>
  )
}
