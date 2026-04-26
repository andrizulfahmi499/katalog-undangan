'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface ScrollFocusProps {
  children: React.ReactNode
  className?: string
  isHero?: boolean
}

export function ScrollFocus({ children, className = '', isHero = false }: ScrollFocusProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  // Track scroll position relative to this element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: isHero ? ["start start", "end start"] : ["start end", "center center", "end start"]
  })

  // Smooth the progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Map progress to Blur & Opacity
  // If isHero: start sharp (0), blur as we scroll down (1)
  // Else: bottom (0) -> center (0.5) -> top (1)
  const blur = useTransform(
    smoothProgress, 
    isHero ? [0, 0.8] : [0, 0.5, 1], 
    isHero ? ["blur(0px)", "blur(10px)"] : ["blur(10px)", "blur(0px)", "blur(10px)"]
  )
  const opacity = useTransform(
    smoothProgress, 
    isHero ? [0, 0.8] : [0, 0.5, 1], 
    isHero ? [1, 0] : [0, 1, 0]
  )
  const scale = useTransform(
    smoothProgress, 
    isHero ? [0, 1] : [0, 0.5, 1], 
    isHero ? [1, 0.95] : [0.95, 1, 0.95]
  )

  return (
    <motion.div
      ref={ref}
      style={{ filter: blur, opacity, scale }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
