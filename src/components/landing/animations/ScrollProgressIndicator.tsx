'use client'

import { motion } from 'framer-motion'
import { useScrollProgress } from '@/lib/hooks'

export interface ScrollProgressIndicatorProps {
  position?: 'top' | 'bottom' | 'left' | 'right'
  thickness?: number
  color?: string
  className?: string
}

/**
 * ScrollProgressIndicator Component
 * 
 * Visual indicator showing scroll progress through the page (0-100%).
 * Uses useScrollProgress hook for optimized scroll tracking.
 * 
 * @example
 * ```tsx
 * <ScrollProgressIndicator position="top" thickness={4} color="hsl(var(--primary))" />
 * ```
 */
export function ScrollProgressIndicator({
  position = 'top',
  thickness = 4,
  color,
  className = ''
}: ScrollProgressIndicatorProps) {
  const scrollProgress = useScrollProgress()

  // Determine positioning and scaling based on position
  const isHorizontal = position === 'top' || position === 'bottom'
  const positionStyles = {
    top: { top: 0, left: 0, right: 0, height: thickness },
    bottom: { bottom: 0, left: 0, right: 0, height: thickness },
    left: { top: 0, left: 0, bottom: 0, width: thickness },
    right: { top: 0, right: 0, bottom: 0, width: thickness }
  }

  // Default color based on theme (using CSS variable)
  const defaultColor = 'hsl(var(--primary))'

  return (
    <motion.div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        backgroundColor: color || defaultColor,
        transformOrigin: isHorizontal ? 'left' : 'top',
        zIndex: 9999,
        ...(isHorizontal
          ? { scaleX: scrollProgress }
          : { scaleY: scrollProgress })
      }}
      className={className}
    />
  )
}
