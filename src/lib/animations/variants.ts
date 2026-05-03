/**
 * Animation Variants Configuration
 * 
 * Centralized animation variants for consistent animations across the landing page.
 * Uses Framer Motion's Variant system for reusable animation configurations.
 */

import { Variant, Transition } from 'framer-motion'

/**
 * Single animation variant with initial, animate, and optional exit states
 */
export interface AnimationVariant {
  initial: Variant
  animate: Variant
  exit?: Variant
  transition?: Transition
}

/**
 * Collection of all predefined animation variants
 */
export interface AnimationVariants {
  fadeIn: AnimationVariant
  fadeInUp: AnimationVariant
  fadeInDown: AnimationVariant
  fadeInLeft: AnimationVariant
  fadeInRight: AnimationVariant
  scaleIn: AnimationVariant
  slideInLeft: AnimationVariant
  slideInRight: AnimationVariant
  floatingSubtle: AnimationVariant
  floatingMedium: AnimationVariant
  floatingStrong: AnimationVariant
}

/**
 * Predefined animation variants for common animation patterns
 */
export const animationVariants: AnimationVariants = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  fadeInDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  fadeInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  fadeInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.5, ease: 'easeOut' }
  },

  // Slide animations
  slideInLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  slideInRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },

  // Floating animations (continuous loop)
  floatingSubtle: {
    initial: { y: 0 },
    animate: {
      y: [-10, 0, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },

  floatingMedium: {
    initial: { y: 0 },
    animate: {
      y: [-15, 0, -15],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },

  floatingStrong: {
    initial: { y: 0 },
    animate: {
      y: [-20, 0, -20],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }
}

/**
 * Helper function to create custom animation variants with overrides
 */
export function createVariant(
  baseVariant: keyof AnimationVariants,
  overrides?: Partial<AnimationVariant>
): AnimationVariant {
  const base = animationVariants[baseVariant]
  return {
    ...base,
    ...overrides,
    transition: {
      ...base.transition,
      ...overrides?.transition
    }
  }
}

/**
 * Helper function to create stagger container variants
 */
export function createStaggerVariant(staggerDelay: number = 0.1) {
  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0
      }
    }
  }
}
