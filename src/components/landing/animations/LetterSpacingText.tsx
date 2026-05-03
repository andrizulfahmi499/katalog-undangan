'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export interface LetterSpacingTextProps {
  children: React.ReactNode
  initialSpacing?: string // Initial letter spacing (e.g., '0.8em')
  finalSpacing?: string // Final letter spacing (e.g., '0.35em')
  duration?: number // Animation duration (seconds)
  delay?: number
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' // HTML element type
  threshold?: number // Viewport intersection threshold
  once?: boolean // Animate only once
}

/**
 * LetterSpacingText Component
 * 
 * Text component with animated letter spacing for premium typography.
 * Inspired by dearmylove.org's elegant logo animation.
 * 
 * @example
 * ```tsx
 * <LetterSpacingText
 *   as="h1"
 *   initialSpacing="0.8em"
 *   finalSpacing="0.35em"
 *   duration={1}
 *   className="text-4xl font-bold uppercase"
 * >
 *   YOUR HEADING
 * </LetterSpacingText>
 * ```
 */
export function LetterSpacingText({
  children,
  initialSpacing = '0.8em',
  finalSpacing = '0.35em',
  duration = 1,
  delay = 0,
  className = '',
  as = 'span',
  threshold = 0.1,
  once = true,
}: LetterSpacingTextProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once, amount: threshold })

  const MotionComponent = motion[as] as any

  return (
    <MotionComponent
      ref={ref}
      initial={{ 
        opacity: 0, 
        letterSpacing: initialSpacing 
      }}
      animate={inView ? { 
        opacity: 1, 
        letterSpacing: finalSpacing 
      } : {}}
      transition={{ 
        duration, 
        delay,
        ease: [0.22, 1, 0.36, 1], // Smooth cubic bezier easing
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  )
}
