/**
 * Easing Functions and Spring Physics Configuration
 * 
 * Custom easing functions and spring physics configurations for natural animations.
 * Based on common animation patterns and physics-based motion.
 */

import { Transition } from 'framer-motion'

/**
 * Spring physics configuration
 */
export interface SpringConfig {
  stiffness: number
  damping: number
  mass: number
}

/**
 * Predefined spring physics configurations
 */
export const springPresets = {
  // Gentle, smooth spring
  gentle: {
    stiffness: 100,
    damping: 20,
    mass: 1
  } as SpringConfig,

  // Default balanced spring
  default: {
    stiffness: 300,
    damping: 30,
    mass: 1
  } as SpringConfig,

  // Bouncy, playful spring
  bouncy: {
    stiffness: 400,
    damping: 20,
    mass: 1
  } as SpringConfig,

  // Snappy, responsive spring
  snappy: {
    stiffness: 500,
    damping: 35,
    mass: 0.8
  } as SpringConfig,

  // Slow, heavy spring
  slow: {
    stiffness: 80,
    damping: 25,
    mass: 1.5
  } as SpringConfig,

  // Fast, light spring
  fast: {
    stiffness: 600,
    damping: 40,
    mass: 0.5
  } as SpringConfig
}

/**
 * Custom cubic-bezier easing functions
 */
export const easingFunctions = {
  // Standard easing
  easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
  easeOut: [0, 0, 0.2, 1] as [number, number, number, number],
  easeIn: [0.4, 0, 1, 1] as [number, number, number, number],

  // Sharp easing
  sharp: [0.4, 0, 0.6, 1] as [number, number, number, number],

  // Smooth easing
  smooth: [0.25, 0.1, 0.25, 1] as [number, number, number, number],

  // Emphasized easing (Material Design)
  emphasized: [0.4, 0, 0.2, 1] as [number, number, number, number],
  emphasizedDecelerate: [0.05, 0.7, 0.1, 1] as [number, number, number, number],
  emphasizedAccelerate: [0.3, 0, 0.8, 0.15] as [number, number, number, number],

  // Bounce easing
  bounceOut: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  bounceIn: [0.6, -0.28, 0.735, 0.045] as [number, number, number, number],

  // Elastic easing
  elasticOut: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
  elasticIn: [0.6, -0.28, 0.735, 0.045] as [number, number, number, number],

  // Back easing
  backOut: [0.175, 0.885, 0.32, 1.275] as [number, number, number, number],
  backIn: [0.6, -0.28, 0.735, 0.045] as [number, number, number, number]
}

/**
 * Easing presets for common animation patterns
 */
export const easingPresets = {
  // Fade animations
  fade: {
    duration: 0.6,
    ease: easingFunctions.easeOut
  } as Transition,

  // Slide animations
  slide: {
    duration: 0.6,
    ease: easingFunctions.easeOut
  } as Transition,

  // Scale animations
  scale: {
    duration: 0.5,
    ease: easingFunctions.easeOut
  } as Transition,

  // Hover animations
  hover: {
    duration: 0.2,
    ease: easingFunctions.easeInOut
  } as Transition,

  // Spring-based hover
  hoverSpring: {
    type: 'spring' as const,
    ...springPresets.snappy
  } as Transition,

  // Floating animations
  floating: {
    duration: 3,
    repeat: Infinity,
    ease: easingFunctions.easeInOut
  } as Transition,

  // Stagger animations
  stagger: {
    duration: 0.6,
    ease: easingFunctions.easeOut,
    staggerChildren: 0.1
  } as Transition,

  // Quick animations
  quick: {
    duration: 0.3,
    ease: easingFunctions.sharp
  } as Transition,

  // Smooth animations
  smooth: {
    duration: 0.8,
    ease: easingFunctions.smooth
  } as Transition,

  // Emphasized animations (Material Design)
  emphasized: {
    duration: 0.5,
    ease: easingFunctions.emphasized
  } as Transition,

  // Bounce animations
  bounce: {
    duration: 0.6,
    ease: easingFunctions.bounceOut
  } as Transition,

  // Elastic animations
  elastic: {
    duration: 0.8,
    ease: easingFunctions.elasticOut
  } as Transition
}

/**
 * Helper function to create spring transition with custom config
 */
export function createSpringTransition(
  config: Partial<SpringConfig> = {}
): Transition {
  return {
    type: 'spring',
    ...springPresets.default,
    ...config
  }
}

/**
 * Helper function to create tween transition with custom easing
 */
export function createTweenTransition(
  duration: number = 0.6,
  ease: keyof typeof easingFunctions = 'easeOut'
): Transition {
  return {
    duration,
    ease: easingFunctions[ease]
  }
}

/**
 * Helper function to create stagger transition
 */
export function createStaggerTransition(
  staggerDelay: number = 0.1,
  duration: number = 0.6,
  ease: keyof typeof easingFunctions = 'easeOut'
): Transition {
  return {
    duration,
    ease: easingFunctions[ease],
    staggerChildren: staggerDelay,
    delayChildren: 0
  }
}
