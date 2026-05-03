'use client'

import { motion } from 'framer-motion'

export interface BreathingElementProps {
  children: React.ReactNode
  duration?: number // Breathing cycle duration (seconds, default 4)
  minOpacity?: number // Minimum opacity (default 0.2)
  maxOpacity?: number // Maximum opacity (default 0.6)
  minScale?: number // Minimum scale (default 1.0)
  maxScale?: number // Maximum scale (default 1.05)
  className?: string
  delay?: number // Initial delay before animation starts
}

/**
 * BreathingElement Component
 * 
 * Applies breathing animation to decorative elements with synchronized
 * opacity and scale changes for an organic, living feel.
 * Inspired by dearmylove.org's botanical graphics.
 * 
 * @example
 * ```tsx
 * <BreathingElement duration={4} className="breathing-1">
 *   <img src="/decorative-flower.svg" alt="" />
 * </BreathingElement>
 * ```
 */
export function BreathingElement({
  children,
  duration = 4,
  minOpacity = 0.2,
  maxOpacity = 0.6,
  minScale = 1.0,
  maxScale = 1.05,
  className = '',
  delay = 0,
}: BreathingElementProps) {
  return (
    <motion.div
      animate={{
        opacity: [minOpacity, maxOpacity, minOpacity],
        scale: [minScale, maxScale, minScale],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * CSS-based breathing animation as fallback
 * Add this to your global CSS for browsers that don't support Framer Motion
 */
export const breathingCSS = `
@keyframes breathing {
  0%, 100% { 
    opacity: 0.2; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.6; 
    transform: scale(1.05); 
  }
}

.breathing-fallback {
  animation: breathing 4s ease-in-out infinite;
}
`
