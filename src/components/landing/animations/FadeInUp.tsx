'use client'

import { motion } from 'framer-motion'
import { useInViewAnimation, useReducedMotion } from '@/lib/hooks'

export interface FadeInUpProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  offset?: number
  threshold?: number
  once?: boolean
  className?: string
}

/**
 * FadeInUp Component
 * 
 * Reusable component that fades in and slides up when entering viewport.
 * Uses useInViewAnimation hook for optimized viewport detection.
 * Respects prefers-reduced-motion setting with instant transitions.
 * 
 * @example
 * ```tsx
 * <FadeInUp delay={200} duration={600} offset={30}>
 *   <h1>Animated Content</h1>
 * </FadeInUp>
 * ```
 */
export function FadeInUp({
  children,
  delay = 0,
  duration = 0.6,
  offset = 30,
  threshold = 0.1,
  once = true,
  className = ''
}: FadeInUpProps) {
  const { ref, inView } = useInViewAnimation({ threshold, once })
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : offset }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : offset }}
      transition={{
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay / 1000,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
