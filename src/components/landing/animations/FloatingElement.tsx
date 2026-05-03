'use client'

import { motion } from 'framer-motion'
import { gpuAcceleration } from '@/lib/animations'
import { useReducedMotion } from '@/lib/hooks'

export interface FloatingElementProps {
  children: React.ReactNode
  duration?: number
  offset?: number
  delay?: number
  className?: string
}

/**
 * FloatingElement Component
 * 
 * Applies continuous floating animation to decorative elements.
 * Uses infinite repeat with ease-in-out easing for smooth motion.
 * Respects prefers-reduced-motion setting.
 * 
 * @example
 * ```tsx
 * <FloatingElement duration={3} offset={20} delay={0.5}>
 *   <img src="/icon.svg" alt="Floating Icon" />
 * </FloatingElement>
 * ```
 */
export function FloatingElement({
  children,
  duration = 3,
  offset = 20,
  delay = 0,
  className = ''
}: FloatingElementProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ y: prefersReducedMotion ? 0 : -offset }}
      animate={{
        y: prefersReducedMotion ? 0 : [-offset, 0, -offset]
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : duration,
        repeat: prefersReducedMotion ? 0 : Infinity,
        ease: 'easeInOut',
        delay: prefersReducedMotion ? 0 : delay
      }}
      style={gpuAcceleration()}
      className={className}
    >
      {children}
    </motion.div>
  )
}
