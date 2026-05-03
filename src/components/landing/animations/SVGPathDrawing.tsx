'use client'

import { motion } from 'framer-motion'

export interface SVGPathDrawingProps {
  path: string // SVG path data
  strokeColor?: string
  strokeWidth?: number
  duration?: number // Animation duration (seconds)
  delay?: number
  className?: string
  viewBox?: string
  width?: number | string
  height?: number | string
  showGhostTrail?: boolean // Enable ghost trail for glow effect
}

/**
 * SVGPathDrawing Component
 * 
 * Animates SVG paths with drawing effect for decorative elements.
 * Inspired by dearmylove.org's elegant rose drawing animation.
 * 
 * @example
 * ```tsx
 * <SVGPathDrawing
 *   path="M10 10 L90 90"
 *   strokeColor="rgba(237,237,237,0.5)"
 *   strokeWidth={2}
 *   duration={1.8}
 *   showGhostTrail
 * />
 * ```
 */
export function SVGPathDrawing({
  path,
  strokeColor = 'rgba(237,237,237,0.5)',
  strokeWidth = 2,
  duration = 1.8,
  delay = 0,
  className = '',
  viewBox = '0 0 100 100',
  width = 100,
  height = 100,
  showGhostTrail = false,
}: SVGPathDrawingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        width={width}
        height={height}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_15px_rgba(237,237,237,0.1)]"
      >
        {/* Main path with drawing animation */}
        <motion.path
          d={path}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{
            pathLength: { 
              duration, 
              ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for smooth drawing
              delay 
            },
            opacity: { 
              duration: 0.5, 
              ease: 'easeOut',
              delay 
            },
          }}
        />
        
        {/* Ghost trail for glow effect */}
        {showGhostTrail && (
          <motion.path
            d={path}
            stroke={strokeColor.replace(/[\d.]+\)$/, '0.15)')} // Reduce opacity for ghost trail
            strokeWidth={strokeWidth * 1.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              pathLength: { 
                duration, 
                ease: [0.25, 0.1, 0.25, 1],
                delay 
              },
            }}
          />
        )}
      </svg>
    </motion.div>
  )
}
