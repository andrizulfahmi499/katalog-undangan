/**
 * useScrollProgress Hook
 * 
 * Tracks scroll progress through the page (0-1).
 * Uses Framer Motion's useScroll hook for optimized scroll tracking.
 */

import { useScroll, MotionValue } from 'framer-motion'

/**
 * Hook to track scroll progress through the page
 * 
 * @returns {MotionValue<number>} Scroll progress value (0-1)
 * 
 * @example
 * ```tsx
 * const scrollProgress = useScrollProgress()
 * 
 * return (
 *   <motion.div
 *     style={{
 *       scaleX: scrollProgress,
 *       transformOrigin: 'left'
 *     }}
 *   >
 *     Progress Bar
 *   </motion.div>
 * )
 * ```
 */
export function useScrollProgress(): MotionValue<number> {
  const { scrollYProgress } = useScroll()
  return scrollYProgress
}
