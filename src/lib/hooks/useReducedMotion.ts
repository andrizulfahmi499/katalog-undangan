/**
 * useReducedMotion Hook
 * 
 * Detects if the user has enabled reduced motion in their system preferences.
 * Respects the prefers-reduced-motion media query for accessibility.
 */

import { useState, useEffect } from 'react'

/**
 * Hook to detect if user prefers reduced motion
 * 
 * @returns {boolean} True if user prefers reduced motion, false otherwise
 * 
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 * 
 * return (
 *   <motion.div
 *     animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
 *   >
 *     Content
 *   </motion.div>
 * )
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') {
      return
    }

    // Create media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)

    // Create event handler
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Add event listener
    // Use addEventListener for modern browsers, addListener for older browsers
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
