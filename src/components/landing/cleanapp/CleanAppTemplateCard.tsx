'use client'

import { motion } from 'framer-motion'
import { useCleanAppConfig } from '@/context/CleanAppConfigContext'
import { useState } from 'react'
import Image from 'next/image'
import type { TemplateOption } from '@/lib/invitationTemplates'

/**
 * CleanAppTemplateCard Component
 * 
 * Individual template card with image, title, description, and CTA button.
 * Implements lazy loading for images and hover effects.
 * 
 * Features:
 * - Lazy loading images with Next.js Image component
 * - Fallback placeholder for missing images
 * - Hover effects (scale, shadow enhancement)
 * - Responsive card layout
 * - Touch-friendly CTA button
 * - Accessible with ARIA labels
 * 
 * Requirements: 9.1, 9.2, 9.3
 * Correctness Properties: CP-10, CP-11, CP-12
 * 
 * @param template - Template data object
 * @param onSelect - Callback when template is selected
 */

interface CleanAppTemplateCardProps {
  template: TemplateOption
  onSelect: (templateId: string) => void
}

export function CleanAppTemplateCard({ template, onSelect }: CleanAppTemplateCardProps) {
  const { config } = useCleanAppConfig()
  const [imageError, setImageError] = useState(false)

  // Generate image path based on template ID
  const imagePath = `/images/templates/${template.id}/preview.jpg`

  return (
    <motion.div
      className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
      style={{ backgroundColor: config.colors.backgroundSecondary || '#FFFFFF' }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Template Image */}
      <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
        {!imageError ? (
          <Image
            src={imagePath}
            alt={`${template.title} template preview`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          // Fallback placeholder
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: config.colors.backgroundSecondary || '#F3F4F6' }}
          >
            <div className="text-center p-6">
              <div
                className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{ backgroundColor: config.colors.primary + '20' }}
              >
                <svg
                  className="w-8 h-8"
                  style={{ color: config.colors.primary }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p
                className="text-sm font-medium"
                style={{ color: config.colors.textSecondary }}
              >
                {template.title}
              </p>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md"
            style={{ backgroundColor: config.colors.accent }}
          >
            {template.category}
          </span>
        </div>
      </div>

      {/* Template Info */}
      <div className="p-5">
        <h3
          className="text-lg font-bold mb-2 line-clamp-1"
          style={{ color: config.colors.textPrimary }}
        >
          {template.title}
        </h3>
        <p
          className="text-sm mb-4 line-clamp-2"
          style={{ color: config.colors.textSecondary }}
        >
          {template.description}
        </p>

        {/* CTA Button */}
        <button
          onClick={() => onSelect(template.id)}
          className="w-full py-3 rounded-full font-semibold text-white transition-all hover:shadow-lg min-h-[44px]"
          style={{ backgroundColor: config.colors.primary }}
          aria-label={`Select ${template.title} template`}
        >
          Pilih Template
        </button>
      </div>

      {/* Hover Accent Line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: config.colors.accent }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
