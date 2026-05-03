/**
 * Animation Utilities Index
 * 
 * Central export point for all animation utilities, variants, easing functions,
 * and performance helpers.
 */

// Animation variants
export {
  animationVariants,
  createVariant,
  createStaggerVariant,
  type AnimationVariant,
  type AnimationVariants
} from './variants'

// Easing functions and spring physics
export {
  springPresets,
  easingFunctions,
  easingPresets,
  createSpringTransition,
  createTweenTransition,
  createStaggerTransition,
  type SpringConfig
} from './easing'

// Performance utilities
export {
  defaultPerformanceConfig,
  gpuAcceleration,
  willChange,
  removeWillChange,
  optimizedTransform,
  optimizedScale,
  combineTransforms,
  PerformanceMonitor,
  throttle,
  debounce,
  requestAnimFrame,
  cancelAnimFrame,
  supportsGPUAcceleration,
  isLowEndDevice,
  getOptimalAnimationComplexity,
  type PerformanceConfig
} from './performance'
