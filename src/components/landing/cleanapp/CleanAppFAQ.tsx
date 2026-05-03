'use client'

import { useCleanAppConfig } from '@/context/CleanAppConfigContext'
import { useReducedMotion, getReducedMotionVariants, getReducedMotionTransition } from '@/hooks/useReducedMotion'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * CleanAppFAQ Component
 * 
 * FAQ section for the CleanApp theme featuring:
 * - Accordion pattern for space-efficient display
 * - Single-item expansion (collapsible accordion)
 * - Smooth animations for expand/collapse transitions
 * - Accessible keyboard navigation via Radix UI
 * - Chevron icon indicators for expand/collapse state
 * - Responsive layout for mobile, tablet, and desktop
 * - Respects prefers-reduced-motion accessibility setting
 * 
 * Requirements: 13.1, 13.2, 13.3
 * 
 * Design Features:
 * - Mobile-first responsive design (Requirement 6.1)
 * - Card-based layout system (Requirement 7.1, 7.2, 7.3)
 * - Touch-friendly interactive elements (Requirement 6.5)
 * - Consistent elevation shadows and border radius (Requirement 7.2)
 * - Consistent spacing and whitespace (Requirement 7.3)
 * - Accessible ARIA attributes (Requirement 19.1)
 * - Keyboard navigation support (Requirement 19.3, 19.4)
 * - Animations respect prefers-reduced-motion (Requirement 7.2)
 */

export function CleanAppFAQ() {
  const { config } = useCleanAppConfig()
  const prefersReducedMotion = useReducedMotion()

  // Animation variants for section entrance
  const containerVariants = getReducedMotionVariants({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }, prefersReducedMotion)

  const itemVariants = getReducedMotionVariants({
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }, prefersReducedMotion)

  return (
    <section
      id="faq"
      className="py-16 sm:py-20 md:py-24 px-4"
      style={{ backgroundColor: config.colors.backgroundSecondary || '#FFFFFF' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        {config.faq.title && (
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16"
            style={{ color: config.colors.textPrimary }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={getReducedMotionTransition({ duration: 0.6 }, prefersReducedMotion)}
          >
            {config.faq.title}
          </motion.h2>
        )}

        {/* FAQ Accordion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <Accordion.Root
            type="single"
            collapsible
            className="space-y-4"
          >
            {config.faq.items.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Accordion.Item
                  value={`item-${index}`}
                  className="group rounded-2xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl"
                  style={{
                    backgroundColor: config.colors.background,
                    boxShadow: `0 4px 20px ${config.colors.textSecondary}15`,
                  }}
                >
                  {/* Question Header */}
                  <Accordion.Header>
                    <Accordion.Trigger
                      className="w-full flex items-center justify-between p-6 sm:p-8 text-left transition-colors duration-200 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      style={{
                        color: config.colors.textPrimary,
                        // @ts-ignore - CSS custom property for focus ring
                        '--tw-ring-color': config.colors.primary,
                      }}
                      aria-label={`Toggle ${item.question}`}
                    >
                      <h3 className="text-lg sm:text-xl font-semibold pr-4 flex-1">
                        {item.question}
                      </h3>
                      
                      {/* Chevron Icon with rotation animation */}
                      <ChevronDown
                        className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180"
                        style={{ color: config.colors.primary }}
                        aria-hidden="true"
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>

                  {/* Answer Content */}
                  <Accordion.Content
                    className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                  >
                    <div
                      className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 text-base sm:text-lg leading-relaxed"
                      style={{ color: config.colors.textSecondary }}
                    >
                      {item.answer}
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </motion.div>
            ))}
          </Accordion.Root>
        </motion.div>
      </div>
    </section>
  )
}
