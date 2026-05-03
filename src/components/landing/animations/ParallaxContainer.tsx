'use client'

import { motion } from 'framer-motion'
import { useParallax, useReducedMotion } from '@/lib/hooks'
import { gpuAcceleration } from '@/lib/animations'

export interface ParallaxContainerProps {
  children: React.ReactNode
  speed?: number
  direction?: 'up' | 'down'
  className?: string
}

/**
 * ParallaxContainer Component
 * 
 * Container that applies parallax scrolling effect to children.
 * Uses useParallax hook for scroll-based transform with GPU acceleration.
 * Respects prefers-reduced-motion setting.
 * 
 * @example
 * ```tsx
 * <ParallaxContainer speed={0.5} direction="up">
 *   <img src="/decorative-element.png" alt="Decoration" />
 * </ParallaxContainer>
 * ```
 */
export function ParallaxContainer({
  children,
  speed = 0.5,
  direction = 'up',
  className = ''
}: ParallaxContainerProps) {
  const { ref, parallaxY } = useParallax({ speed, direction })
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      style={{
        y: prefersReducedMotion ? 0 : parallaxY,
        ...gpuAcceleration()
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
