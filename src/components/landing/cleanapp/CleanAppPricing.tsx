'use client'

import { useCleanAppConfig } from '@/context/CleanAppConfigContext'
import { useReducedMotion, getReducedMotionVariants, getReducedMotionTransition } from '@/hooks/useReducedMotion'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

/**
 * CleanAppPricing Component
 * 
 * Pricing section for the CleanApp theme featuring:
 * - Card-based layout with pricing tiers
 * - Tier name, price, features list, and CTA button
 * - Recommended tier highlighting with ring/border styling
 * - Responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
 * - Smooth entrance animations
 * - Hover effects for interactive feedback
 * - Respects prefers-reduced-motion accessibility setting
 * 
 * Requirements: 11.1, 11.2, 11.4, 11.5
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

export function CleanAppPricing() {
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
      id="pricing"
      className="py-16 sm:py-20 md:py-24 px-4"
      style={{ backgroundColor: config.colors.backgroundSecondary || '#FFFFFF' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        {config.pricing.title && (
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16"
            style={{ color: config.colors.textPrimary }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={getReducedMotionTransition({ duration: 0.6 }, prefersReducedMotion)}
          >
            {config.pricing.title}
          </motion.h2>
        )}

        {/* Pricing Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {config.pricing.tiers.map((tier, index) => (
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
              {/* Pricing Card */}
              <div
                className={`h-full p-6 sm:p-8 rounded-2xl shadow-lg transition-shadow duration-300 group-hover:shadow-2xl relative ${
                  tier.recommended ? 'ring-4' : ''
                }`}
                style={{
                  backgroundColor: config.colors.background,
                  boxShadow: `0 4px 20px ${config.colors.textSecondary}15`,
                  ringColor: tier.recommended ? config.colors.accent : 'transparent',
                }}
              >
                {/* Recommended Badge */}
                {tier.recommended && (
                  <div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
                    style={{
                      backgroundColor: config.colors.accent,
                      color: config.colors.textPrimary,
                    }}
                  >
                    Rekomendasi
                  </div>
                )}

                {/* Tier Name */}
                <h3
                  className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 transition-colors duration-300"
                  style={{
                    color: config.colors.textPrimary,
                  }}
                >
                  {tier.name}
                </h3>

                {/* Price */}
                <div
                  className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8"
                  style={{
                    color: config.colors.primary,
                  }}
                >
                  {tier.price}
                </div>

                {/* Features List */}
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {tier.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className="flex items-start gap-3 text-base sm:text-lg"
                      style={{ color: config.colors.textSecondary }}
                    >
                      <Check
                        className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 mt-0.5"
                        style={{ color: config.colors.primary }}
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className="w-full py-3 sm:py-4 rounded-full font-semibold text-white text-base sm:text-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2 min-h-[44px]"
                  style={{
                    backgroundColor: config.colors.primary,
                    boxShadow: `0 4px 15px ${config.colors.primary}40`,
                  }}
                  aria-label={`${tier.ctaText} - ${tier.name}`}
                >
                  {tier.ctaText}
                </button>

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
