'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useCleanAppConfig } from '@/context/CleanAppConfigContext'
import { motion } from 'framer-motion'

// Dynamic import for modal - only loaded when user clicks CTA
const CleanAppLoginModal = dynamic(() => import('./CleanAppLoginModal').then(mod => ({ default: mod.CleanAppLoginModal })), {
  ssr: false, // Modal doesn't need SSR
})

/**
 * CleanAppHero Component
 * 
 * Hero section for the CleanApp theme featuring:
 * - Customized hero text, subtitle, and CTA button
 * - Customized hero image or background
 * - Responsive layout for mobile, tablet, and desktop
 * - Login modal integration
 * 
 * Requirements: 9.1, 9.2, 9.3
 * 
 * Design Features:
 * - Mobile-first responsive design (Requirement 6.1)
 * - Touch-friendly interactive elements (Requirement 6.5)
 * - Smooth animations with Framer Motion
 * - Clean, modern mobile app aesthetic
 */

export function CleanAppHero() {
  const { config } = useCleanAppConfig()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleCTAClick = () => {
    setIsLoginModalOpen(true)
  }

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false)
    // TODO: Update UI to reflect authenticated state
    // This could involve redirecting to dashboard or showing user menu
  }

  return (
    <>
      <section
        id="home"
        className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden"
        style={{ backgroundColor: config.colors.background }}
      >
        {/* Background Image (if configured) */}
        {config.hero.backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${config.hero.backgroundImage})` }}
            aria-hidden="true"
          />
        )}

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <motion.div
              className="text-center lg:text-left space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Title */}
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                style={{ color: config.colors.textPrimary }}
              >
                {config.hero.title}
              </h1>

              {/* Subtitle */}
              {config.hero.subtitle && (
                <p
                  className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto lg:mx-0"
                  style={{ color: config.colors.textSecondary }}
                >
                  {config.hero.subtitle}
                </p>
              )}

              {/* CTA Button */}
              <div className="pt-4">
                <button
                  onClick={handleCTAClick}
                  className="px-8 py-4 rounded-full font-semibold text-white text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2 min-w-[200px] min-h-[56px]"
                  style={{
                    backgroundColor: config.colors.primary,
                    boxShadow: `0 10px 30px ${config.colors.primary}40`,
                  }}
                  aria-label={config.hero.ctaText}
                >
                  {config.hero.ctaText}
                </button>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {config.hero.heroImage ? (
                <div className="relative w-full max-w-md lg:max-w-lg aspect-square">
                  <Image
                    src={config.hero.heroImage}
                    alt="Hero illustration"
                    fill
                    className="object-contain rounded-3xl"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                // Placeholder when no hero image is configured
                <div
                  className="w-full max-w-md lg:max-w-lg aspect-square rounded-3xl flex items-center justify-center"
                  style={{
                    backgroundColor: config.colors.backgroundSecondary || '#FFFFFF',
                    border: `2px dashed ${config.colors.textSecondary}40`,
                  }}
                >
                  <div className="text-center p-8">
                    <div
                      className="text-6xl mb-4"
                      style={{ color: config.colors.primary }}
                    >
                      💝
                    </div>
                    <p
                      className="text-sm"
                      style={{ color: config.colors.textSecondary }}
                    >
                      Hero Image
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
      </section>

      {/* Login Modal */}
      <CleanAppLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  )
}
