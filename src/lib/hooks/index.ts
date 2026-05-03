/**
 * Custom Hooks Index
 * 
 * Central export point for all custom animation hooks.
 */

// Animation hooks
export { useReducedMotion } from './useReducedMotion'
export { useScrollProgress } from './useScrollProgress'
export {
  useParallax,
  useParallaxHorizontal,
  useParallaxScale,
  type UseParallaxOptions
} from './useParallax'
export {
  useInViewAnimation,
  useInViewAnimationWithCallback,
  type UseInViewAnimationOptions
} from './useInViewAnimation'
export {
  useScrollSectionTracking,
  type SectionThreshold,
  type UseScrollSectionTrackingOptions
} from './useScrollSectionTracking'
