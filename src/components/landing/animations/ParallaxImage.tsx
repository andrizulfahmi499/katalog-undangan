'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export interface ParallaxImageProps {
  src: string
  alt: string
  speed?: number // Parallax speed (0.05-0.3, default 0.15)
  className?: string
  containerClassName?: string
}

/**
 * ParallaxImage Component
 * 
 * Image with parallax scroll effect for depth. The image moves at a different
 * speed than the scroll to create a 3D depth illusion.
 * Inspired by dearmylove.org's parallax image sections.
 * 
 * @example
 * ```tsx
 * <ParallaxImage
 *   src="/images/hero-bg.jpg"
 *   alt="Hero Background"
 *   speed={0.15}
 *   containerClassName="h-60 md:h-72 rounded-2xl"
 * />
 * ```
 */
export function ParallaxImage({
  src,
  alt,
  speed = 0.15,
  className = '',
  containerClassName = '',
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  // Track scroll progress relative to element position
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'], // Start when element enters viewport, end when it leaves
  })
  
  // Transform Y position based on scroll progress and speed
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${speed * -100}px`, `${speed * 100}px`]
  )

  return (
    <div 
      ref={ref} 
      className={`relative overflow-hidden ${containerClassName}`}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className={`absolute inset-0 w-full h-[130%] -top-[15%] object-cover ${className}`}
      />
    </div>
  )
}

/**
 * ParallaxImageWithBrightness Component
 * 
 * ParallaxImage with brightness control for better text readability.
 * 
 * @example
 * ```tsx
 * <ParallaxImageWithBrightness
 *   src="/images/hero-bg.jpg"
 *   alt="Hero Background"
 *   speed={0.15}
 *   brightness={0.9}
 * />
 * ```
 */
export function ParallaxImageWithBrightness({
  src,
  alt,
  speed = 0.15,
  brightness = 1,
  className = '',
  containerClassName = '',
}: ParallaxImageProps & { brightness?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${speed * -100}px`, `${speed * 100}px`]
  )

  return (
    <div 
      ref={ref} 
      className={`relative overflow-hidden ${containerClassName}`}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ 
          y,
          filter: `brightness(${brightness})`,
        }}
        className={`absolute inset-0 w-full h-[130%] -top-[15%] object-cover ${className}`}
      />
    </div>
  )
}
