'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

export interface AmbientParticlesProps {
  count?: number // Number of particles (default 6-8)
  className?: string
  minOpacity?: number // Minimum particle opacity (default 0.08)
  maxOpacity?: number // Maximum particle opacity (default 0.2)
}

/**
 * Deterministic pseudo-random based on seed
 * Avoids hydration mismatch by not using Math.random() in render
 */
function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

/**
 * AmbientParticles Component
 * 
 * Floating particle background effect for atmospheric ambiance.
 * Particles are generated with deterministic positions to avoid
 * hydration mismatch. Inspired by dearmylove.org's splash screen.
 * 
 * @example
 * ```tsx
 * <AmbientParticles
 *   count={8}
 *   className="absolute inset-0 pointer-events-none"
 * />
 * ```
 */
export function AmbientParticles({
  count = 6,
  className = '',
  minOpacity = 0.08,
  maxOpacity = 0.2,
}: AmbientParticlesProps) {
  // Pre-generate particles with deterministic values
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        width: 2 + seededRandom(i * 5 + 1) * 3, // 2-5px
        height: 2 + seededRandom(i * 5 + 2) * 3, // 2-5px
        left: 15 + seededRandom(i * 5 + 3) * 70, // 15-85%
        top: 20 + seededRandom(i * 5 + 4) * 60, // 20-80%
        duration: 2.5 + seededRandom(i * 5 + 5) * 1.5, // 2.5-4s
        delay: 0.3 + i * 0.2, // Staggered delays
      })),
    [count]
  )

  return (
    <div className={`overflow-hidden ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: `${p.width}px`,
            height: `${p.height}px`,
            backgroundColor: `rgba(237,237,237,${minOpacity})`,
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, maxOpacity, 0],
            y: [20, -30, -60],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}
    </div>
  )
}

/**
 * AmbientParticlesWithColor Component
 * 
 * Ambient particles with customizable color.
 * 
 * @example
 * ```tsx
 * <AmbientParticlesWithColor
 *   count={8}
 *   color="168, 213, 196" // RGB values for #a8d5c4
 *   className="absolute inset-0 pointer-events-none"
 * />
 * ```
 */
export function AmbientParticlesWithColor({
  count = 6,
  className = '',
  color = '237, 237, 237', // RGB values
  minOpacity = 0.08,
  maxOpacity = 0.4,
}: AmbientParticlesProps & { color?: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        width: 1.5 + seededRandom(i * 5 + 1) * 2, // 1.5-3.5px
        height: 1.5 + seededRandom(i * 5 + 2) * 2,
        left: 15 + seededRandom(i * 5 + 3) * 70,
        top: 20 + seededRandom(i * 5 + 4) * 60,
        duration: 3 + seededRandom(i * 5 + 5) * 2, // 3-5s
        delay: i * 0.4,
      })),
    [count]
  )

  return (
    <div className={`overflow-hidden ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: `${p.width}px`,
            height: `${p.height}px`,
            backgroundColor: `rgba(${color}, ${minOpacity})`,
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
          animate={{
            y: [-15, 15, -15],
            opacity: [minOpacity, maxOpacity, minOpacity],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
