/**
 * useInViewAnimation Hook
 * 
 * Detects when an element enters the viewport and triggers animations.
 * Uses Framer Motion's useInView hook for optimized intersection detection.
 */

import { useInView } from 'framer-motion'
import { useRef } from 'react'

export interface UseInViewAnimationOptions {
  /**
   * Threshold for intersection (0-1)
   * 0.1 = trigger when 10% of element is visible
   * @default 0.1
   */
  threshold?: number

  /**
   * Trigger animation only once
   * @default true
   */
  once?: boolean

  /**
   * Root margin for intersection observer
   * Positive values trigger animation before element enters viewport
   * Negative values trigger animation after element enters viewport
   * @default '0px'
   * 
   * @example '50px' - trigger 50px before entering viewport
   * @example '-50px' - trigger 50px after entering viewport
   */
  rootMargin?: string

  /**
   * Amount of the element that must be visible (0-1)
   * Alternative to threshold
   * @default undefined
   */
  amount?: number | 'some' | 'all'
}

/**
 * Hook to detect when element enters viewport and trigger animations
 * 
 * @param {UseInViewAnimationOptions} options - Configuration options
 * @returns {Object} Object containing ref and inView state
 * 
 * @example
 * ```tsx
 * const { ref, inView } = useInViewAnimation({ threshold: 0.1, once: true })
 * 
 * return (
 *   <motion.div
 *     ref={ref}
 *     initial={{ opacity: 0, y: 30 }}
 *     animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
 *   >
 *     Content
 *   </motion.div>
 * )
 * ```
 */
export function useInViewAnimation(options: UseInViewAnimationOptions = {}) {
  const {
    threshold = 0.1,
    once = true,
    rootMargin,
    amount
  } = options

  const ref = useRef<HTMLDivElement>(null)

  // Build options object conditionally
  const viewOptions: any = {
    once,
    amount: amount !== undefined ? amount : threshold
  }

  // Only add margin if rootMargin is provided and not default
  if (rootMargin && rootMargin !== '0px') {
    viewOptions.margin = rootMargin
  }

  const inView = useInView(ref, viewOptions)

  return { ref, inView }
}

/**
 * Hook to detect when element enters viewport with custom callback
 * 
 * @param {Function} onEnter - Callback when element enters viewport
 * @param {Function} onLeave - Callback when element leaves viewport (optional)
 * @param {UseInViewAnimationOptions} options - Configuration options
 * @returns {Object} Object containing ref and inView state
 * 
 * @example
 * ```tsx
 * const { ref, inView } = useInViewAnimationWithCallback(
 *   () => console.log('Entered viewport'),
 *   () => console.log('Left viewport'),
 *   { threshold: 0.5 }
 * )
 * 
 * return <div ref={ref}>Content</div>
 * ```
 */
export function useInViewAnimationWithCallback(
  onEnter?: () => void,
  onLeave?: () => void,
  options: UseInViewAnimationOptions = {}
) {
  const {
    threshold = 0.1,
    once = true,
    rootMargin,
    amount
  } = options

  const ref = useRef<HTMLDivElement>(null)
  const hasEnteredRef = useRef(false)

  // Build options object conditionally
  const viewOptions: any = {
    once,
    amount: amount !== undefined ? amount : threshold
  }

  // Only add margin if rootMargin is provided and not default
  if (rootMargin && rootMargin !== '0px') {
    viewOptions.margin = rootMargin
  }

  const inView = useInView(ref, viewOptions)

  // Trigger callbacks based on inView state
  if (inView && !hasEnteredRef.current) {
    hasEnteredRef.current = true
    onEnter?.()
  } else if (!inView && hasEnteredRef.current && !once) {
    hasEnteredRef.current = false
    onLeave?.()
  }

  return { ref, inView }
}
