'use client'

import { motion } from 'framer-motion'
import { useInViewAnimation } from '@/lib/hooks'
import { animationVariants } from '@/lib/animations'

export interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  variant?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInLeft' | 'slideInRight'
  threshold?: number
  once?: boolean
  className?: string
}

/**
 * ScrollReveal Component (Enhanced)
 * 
 * Generic scroll-triggered animation wrapper with support for multiple animation variants.
 * Uses centralized animation variants for consistent animations across the landing page.
 * 
 * @example
 * ```tsx
 * <ScrollReveal variant="fadeInUp" delay={200}>
 *   <h1>Animated Content</h1>
 * </ScrollReveal>
 * ```
 */
export function ScrollReveal({
  children,
  delay = 0,
  variant = 'fadeInUp',
  threshold = 0.1,
  once = true,
  className = ''
}: ScrollRevealProps) {
  const { ref, inView } = useInViewAnimation({ threshold, once })

  // Get the animation variant from centralized config
  const animVariant = animationVariants[variant]

  return (
    <motion.div
      ref={ref}
      initial={animVariant.initial as any}
      animate={inView ? (animVariant.animate as any) : (animVariant.initial as any)}
      exit={animVariant.exit as any}
      transition={{
        ...(animVariant.transition as any),
        delay: delay / 1000 // Convert ms to seconds
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
