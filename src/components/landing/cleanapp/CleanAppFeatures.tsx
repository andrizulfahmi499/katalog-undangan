'use client'

import { useCleanAppConfig } from '@/context/CleanAppConfigContext'
import { useReducedMotion, getReducedMotionVariants, getReducedMotionTransition } from '@/hooks/useReducedMotion'
import { motion } from 'framer-motion'

/**
 * CleanAppFeatures Component
 * 
 * Features section for the CleanApp theme featuring:
 * - Card-based layout with consistent styling
 * - Responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
 * - Feature items with icon, title, and description
 * - Smooth entrance animations
 * - Hover effects for interactive feedback
 * - Respects prefers-reduced-motion accessibility setting
 * 
 * Requirements: 10.1, 10.2, 10.3
 * 
 * Design Features:
 * - Mobile-first responsive design (Requirement 6.1)
 * - Card-based layout system (Requirement 7.1, 7.2, 7.3)
 * - Interactive card feedback (Requirement 7.4)
 * - Touch-friendly interactive elements (Requirement 6.5)
 * - Consistent elevation shadows and border radius (Requirement 7.2)
 * - Consistent spacing and whitespace (Requirement 7.3)
 * - Animations respect prefers-reduced-motion (Requirement 7.2)
 */

export function CleanAppFeatures() {
  const { config } = useCleanAppConfig()
  const prefersReducedMotion = useReducedMotion()

  // Animation variants for staggered entrance
  const containerVariants = getReducedMotionVariants({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }, prefersReducedMotion)

  const cardVariants = getReducedMotionVariants({
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth motion
      },
    },
  }, prefersReducedMotion)

  return (
    <section
      id="features"
      className="py-16 sm:py-20 md:py-24 px-4"
      style={{ backgroundColor: config.colors.backgroundSecondary || '#FFFFFF' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        {config.features.title && (
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16"
            style={{ color: config.colors.textPrimary }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={getReducedMotionTransition({ duration: 0.6 }, prefersReducedMotion)}
          >
            {config.features.title}
          </motion.h2>
        )}

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {config.features.items.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={prefersReducedMotion ? {} : {
                scale: 1.05,
                y: -8,
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              className="group relative"
            >
              {/* Feature Card */}
              <div
                className="h-full p-6 sm:p-8 rounded-2xl shadow-lg transition-shadow duration-300 group-hover:shadow-2xl"
                style={{
                  backgroundColor: config.colors.background,
                  boxShadow: `0 4px 20px ${config.colors.textSecondary}15`,
                }}
              >
                {/* Icon */}
                <div
                  className="text-5xl sm:text-6xl mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110"
                  role="img"
                  aria-label={`${feature.title} icon`}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h3
                  className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 transition-colors duration-300"
                  style={{
                    color: config.colors.textPrimary,
                  }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-base sm:text-lg leading-relaxed"
                  style={{
                    color: config.colors.textSecondary,
                  }}
                >
                  {feature.description}
                </p>

                {/* Decorative accent line */}
                <div
                  className="absolute bottom-0 left-0 h-1 w-0 rounded-full transition-all duration-300 group-hover:w-full"
                  style={{
                    backgroundColor: config.colors.primary,
                  }}
                  aria-hidden="true"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
