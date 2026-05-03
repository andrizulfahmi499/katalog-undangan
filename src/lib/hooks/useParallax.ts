/**
 * useParallax Hook
 * 
 * Creates parallax scrolling effect by transforming elements based on scroll position.
 * Uses Framer Motion's useScroll and useTransform for smooth parallax motion.
 */

import { useScroll, useTransform, MotionValue } from 'framer-motion'
import { useRef } from 'react'

export interface UseParallaxOptions {
  /**
   * Parallax speed multiplier (0-1)
   * 0.5 = element moves at half the scroll speed
   * 0.3 = element moves at 30% of scroll speed
   * @default 0.5
   */
  speed?: number

  /**
   * Scroll direction
   * 'up' = element moves up when scrolling down (default parallax)
   * 'down' = element moves down when scrolling down (reverse parallax)
   * @default 'up'
   */
  direction?: 'up' | 'down'

  /**
   * Custom scroll range [start, end] in pixels
   * If not provided, uses element's position in viewport
   */
  range?: [number, number]
}

/**
 * Hook to create parallax scrolling effect
 * 
 * @param {UseParallaxOptions} options - Parallax configuration options
 * @returns {Object} Object containing ref and parallax Y motion value
 * 
 * @example
 * ```tsx
 * const { ref, parallaxY } = useParallax({ speed: 0.5, direction: 'up' })
 * 
 * return (
 *   <motion.div
 *     ref={ref}
 *     style={{ y: parallaxY }}
 *   >
 *     Parallax Content
 *   </motion.div>
 * )
 * ```
 */
export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.5, direction = 'up', range } = options
  const ref = useRef<HTMLDivElement>(null)

  // Get scroll progress relative to the element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  // Calculate parallax offset
  // For 'up' direction: negative values move element up
  // For 'down' direction: positive values move element down
  const multiplier = direction === 'up' ? -1 : 1
  const offsetRange = range || [-100 * speed, 100 * speed]

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [offsetRange[0] * multiplier, offsetRange[1] * multiplier]
  )

  return { ref, parallaxY }
}

/**
 * Hook to create horizontal parallax scrolling effect
 * 
 * @param {UseParallaxOptions} options - Parallax configuration options
 * @returns {Object} Object containing ref and parallax X motion value
 * 
 * @example
 * ```tsx
 * const { ref, parallaxX } = useParallaxHorizontal({ speed: 0.3 })
 * 
 * return (
 *   <motion.div
 *     ref={ref}
 *     style={{ x: parallaxX }}
 *   >
 *     Horizontal Parallax Content
 *   </motion.div>
 * )
 * ```
 */
export function useParallaxHorizontal(options: UseParallaxOptions = {}) {
  const { speed = 0.5, direction = 'up', range } = options
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const multiplier = direction === 'up' ? -1 : 1
  const offsetRange = range || [-100 * speed, 100 * speed]

  const parallaxX = useTransform(
    scrollYProgress,
    [0, 1],
    [offsetRange[0] * multiplier, offsetRange[1] * multiplier]
  )

  return { ref, parallaxX }
}

/**
 * Hook to create scale parallax effect
 * 
 * @param {number} minScale - Minimum scale value (default: 0.8)
 * @param {number} maxScale - Maximum scale value (default: 1.2)
 * @returns {Object} Object containing ref and parallax scale motion value
 * 
 * @example
 * ```tsx
 * const { ref, parallaxScale } = useParallaxScale(0.8, 1.2)
 * 
 * return (
 *   <motion.div
 *     ref={ref}
 *     style={{ scale: parallaxScale }}
 *   >
 *     Scale Parallax Content
 *   </motion.div>
 * )
 * ```
 */
export function useParallaxScale(minScale: number = 0.8, maxScale: number = 1.2) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const parallaxScale = useTransform(scrollYProgress, [0, 0.5, 1], [minScale, maxScale, minScale])

  return { ref, parallaxScale }
}
