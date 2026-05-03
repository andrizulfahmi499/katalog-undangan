/**
 * Performance Utilities for Animations
 * 
 * GPU acceleration helpers and performance monitoring utilities
 * to ensure smooth 60fps animations.
 */

import { CSSProperties } from 'react'

/**
 * Performance configuration interface
 */
export interface PerformanceConfig {
  enableGPUAcceleration: boolean
  useWillChange: boolean
  reducedMotion: boolean
  maxConcurrentAnimations?: number
}

/**
 * Default performance configuration
 */
export const defaultPerformanceConfig: PerformanceConfig = {
  enableGPUAcceleration: true,
  useWillChange: true,
  reducedMotion: false,
  maxConcurrentAnimations: 10
}

/**
 * GPU acceleration helper - forces GPU layer creation
 * Uses transform3d to trigger hardware acceleration
 */
export function gpuAcceleration(): CSSProperties {
  return {
    transform: 'translate3d(0, 0, 0)',
    backfaceVisibility: 'hidden',
    perspective: 1000
  }
}

/**
 * Will-change helper for optimizing animations
 * Should be used sparingly and only during animations
 */
export function willChange(properties: string[]): CSSProperties {
  return {
    willChange: properties.join(', ')
  }
}

/**
 * Remove will-change after animation completes
 */
export function removeWillChange(): CSSProperties {
  return {
    willChange: 'auto'
  }
}

/**
 * Optimized transform styles for animations
 * Uses transform3d for GPU acceleration
 */
export function optimizedTransform(
  x: number = 0,
  y: number = 0,
  z: number = 0
): CSSProperties {
  return {
    transform: `translate3d(${x}px, ${y}px, ${z}px)`,
    backfaceVisibility: 'hidden'
  }
}

/**
 * Optimized scale transform
 */
export function optimizedScale(scale: number = 1): CSSProperties {
  return {
    transform: `scale3d(${scale}, ${scale}, 1)`,
    backfaceVisibility: 'hidden'
  }
}

/**
 * Combine multiple transform operations efficiently
 */
export function combineTransforms(transforms: {
  translateX?: number
  translateY?: number
  translateZ?: number
  scale?: number
  rotate?: number
}): CSSProperties {
  const parts: string[] = []

  if (transforms.translateX !== undefined || transforms.translateY !== undefined || transforms.translateZ !== undefined) {
    const x = transforms.translateX || 0
    const y = transforms.translateY || 0
    const z = transforms.translateZ || 0
    parts.push(`translate3d(${x}px, ${y}px, ${z}px)`)
  }

  if (transforms.scale !== undefined) {
    parts.push(`scale(${transforms.scale})`)
  }

  if (transforms.rotate !== undefined) {
    parts.push(`rotate(${transforms.rotate}deg)`)
  }

  return {
    transform: parts.join(' '),
    backfaceVisibility: 'hidden'
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private frameCount = 0
  private lastTime = performance.now()
  private fps = 60
  private rafId: number | null = null

  /**
   * Start monitoring FPS
   */
  start(callback?: (fps: number) => void): void {
    const measure = () => {
      this.frameCount++
      const currentTime = performance.now()

      if (currentTime >= this.lastTime + 1000) {
        this.fps = this.frameCount
        this.frameCount = 0
        this.lastTime = currentTime

        if (callback) {
          callback(this.fps)
        }
      }

      this.rafId = requestAnimationFrame(measure)
    }

    this.rafId = requestAnimationFrame(measure)
  }

  /**
   * Stop monitoring FPS
   */
  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.fps
  }

  /**
   * Check if performance is acceptable (>= 30fps)
   */
  isPerformanceAcceptable(): boolean {
    return this.fps >= 30
  }

  /**
   * Check if performance is optimal (>= 55fps)
   */
  isPerformanceOptimal(): boolean {
    return this.fps >= 55
  }
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 16
): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: NodeJS.Timeout | null = null

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()

    if (now - lastCall >= delay) {
      lastCall = now
      func.apply(this, args)
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        func.apply(this, args)
      }, delay - (now - lastCall))
    }
  }
}

/**
 * Debounce function for expensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 250
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * Request animation frame wrapper with fallback
 */
export function requestAnimFrame(callback: FrameRequestCallback): number {
  return (
    window.requestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    function (callback: FrameRequestCallback) {
      return window.setTimeout(callback, 1000 / 60)
    }
  )(callback)
}

/**
 * Cancel animation frame wrapper with fallback
 */
export function cancelAnimFrame(id: number): void {
  (
    window.cancelAnimationFrame ||
    (window as any).webkitCancelAnimationFrame ||
    (window as any).mozCancelAnimationFrame ||
    function (id: number) {
      clearTimeout(id)
    }
  )(id)
}

/**
 * Check if device supports GPU acceleration
 */
export function supportsGPUAcceleration(): boolean {
  if (typeof window === 'undefined') return false

  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  return !!gl
}

/**
 * Detect if device is low-end based on hardware concurrency
 */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4
  if (cores < 4) return true

  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory
  if (memory && memory < 4) return true

  return false
}

/**
 * Get optimal animation complexity based on device capabilities
 */
export function getOptimalAnimationComplexity(): 'high' | 'medium' | 'low' {
  if (isLowEndDevice()) return 'low'
  if (!supportsGPUAcceleration()) return 'medium'
  return 'high'
}
