'use client'

import { useEffect, useState } from 'react'

/**
 * useReducedMotion Hook
 * 
 * Detects user's motion preference from system settings.
 * Returns true if user prefers reduced motion (prefers-reduced-motion: reduce).
 * 
 * This hook respects accessibility preferences and should be used to
 * conditionally disable or simplify animations for users who prefer
 * reduced motion.
 * 
 * Requirements: 7.2 - Animations respect prefers-reduced-motion
 * 
 * @returns boolean - true if user prefers reduced motion, false otherwise
 * 
 * Usage:
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 * 
 * <motion.div
 *   animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
 *   transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
 * >
 *   Content
 * </motion.div>
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window === 'undefined') {
      return
    }

    // Create media query for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes to the preference
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Add event listener (use deprecated addListener for older browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  return prefersReducedMotion
}

/**
 * getReducedMotionVariants
 * 
 * Helper function to get animation variants that respect reduced motion preference.
 * Returns empty variants if reduced motion is preferred, otherwise returns the provided variants.
 * 
 * @param variants - Framer Motion variants object
 * @param prefersReducedMotion - Boolean indicating if user prefers reduced motion
 * @returns Variants object (empty if reduced motion preferred, original otherwise)
 * 
 * Usage:
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 * const variants = getReducedMotionVariants({
 *   hidden: { opacity: 0, y: 20 },
 *   visible: { opacity: 1, y: 0 }
 * }, prefersReducedMotion)
 * ```
 */
export function getReducedMotionVariants<T extends Record<string, any>>(
  variants: T,
  prefersReducedMotion: boolean
): T | Record<string, {}> {
  if (prefersReducedMotion) {
    // Return empty variants for all states
    return Object.keys(variants).reduce((acc, key) => {
      acc[key] = {}
      return acc
    }, {} as Record<string, {}>)
  }
  return variants
}

/**
 * getReducedMotionTransition
 * 
 * Helper function to get transition config that respects reduced motion preference.
 * Returns instant transition (duration: 0) if reduced motion is preferred.
 * 
 * @param transition - Framer Motion transition config
 * @param prefersReducedMotion - Boolean indicating if user prefers reduced motion
 * @returns Transition config (instant if reduced motion preferred, original otherwise)
 * 
 * Usage:
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 * const transition = getReducedMotionTransition(
 *   { duration: 0.5, ease: 'easeOut' },
 *   prefersReducedMotion
 * )
 * ```
 */
export function getReducedMotionTransition(
  transition: any,
  prefersReducedMotion: boolean
): any {
  if (prefersReducedMotion) {
    return { duration: 0 }
  }
  return transition
}
