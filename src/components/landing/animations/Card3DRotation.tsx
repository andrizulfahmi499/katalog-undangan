'use client'

import { motion } from 'framer-motion'

export interface Card3DRotationProps {
  children: React.ReactNode
  rotationDuration?: number // Full rotation duration (seconds)
  tiltDuration?: number // Tilt animation duration (seconds)
  perspective?: number // Perspective value (px, default 800)
  className?: string
  enableTilt?: boolean // Enable rotateX tilt effect
}

/**
 * Card3DRotation Component
 * 
 * 3D rotating card effect for product showcases with continuous rotation
 * and optional tilt animation. Inspired by dearmylove.org's 3D wedding preview.
 * 
 * @example
 * ```tsx
 * <Card3DRotation
 *   rotationDuration={12}
 *   enableTilt
 *   className="w-40 h-52"
 * >
 *   <div className="card-content">
 *     Your card content here
 *   </div>
 * </Card3DRotation>
 * ```
 */
export function Card3DRotation({
  children,
  rotationDuration = 12,
  tiltDuration = 6,
  perspective = 800,
  className = '',
  enableTilt = true,
}: Card3DRotationProps) {
  return (
    <motion.div
      animate={{
        rotateY: [0, 360],
        ...(enableTilt && { rotateX: [15, -15, 15] }),
      }}
      transition={{
        rotateY: { 
          duration: rotationDuration, 
          repeat: Infinity, 
          ease: 'linear' 
        },
        ...(enableTilt && {
          rotateX: { 
            duration: tiltDuration, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }
        }),
      }}
      style={{ 
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      <div
        style={{
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}

/**
 * Card3DRotationLayer Component
 * 
 * Use this for multiple card layers with different rotation speeds
 * to create enhanced depth effect.
 * 
 * @example
 * ```tsx
 * <div className="relative">
 *   <Card3DRotationLayer delay={0}>
 *     <div>Front card</div>
 *   </Card3DRotationLayer>
 *   <Card3DRotationLayer delay={0.5} className="absolute inset-0">
 *     <div>Back card</div>
 *   </Card3DRotationLayer>
 * </div>
 * ```
 */
export function Card3DRotationLayer({
  children,
  rotationDuration = 12,
  tiltDuration = 6,
  perspective = 800,
  className = '',
  delay = 0,
}: Card3DRotationProps & { delay?: number }) {
  return (
    <motion.div
      animate={{
        rotateY: [180, 540],
        rotateX: [-15, 15, -15],
      }}
      transition={{
        rotateY: { 
          duration: rotationDuration, 
          repeat: Infinity, 
          ease: 'linear',
          delay 
        },
        rotateX: { 
          duration: tiltDuration, 
          repeat: Infinity, 
          ease: 'easeInOut',
          delay 
        },
      }}
      style={{ 
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      <div
        style={{
          backfaceVisibility: 'hidden',
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}
