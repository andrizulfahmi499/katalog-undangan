'use client'

import { motion } from 'framer-motion'
import { useInViewAnimation } from '@/lib/hooks'
import { createStaggerVariant } from '@/lib/animations'

export interface StaggerContainerProps {
  children: React.ReactNode
  staggerDelay?: number
  threshold?: number
  once?: boolean
  className?: string
}

/**
 * StaggerContainer Component
 * 
 * Container that staggers animations of child elements.
 * Children must be motion components to receive stagger animation.
 * 
 * @example
 * ```tsx
 * <StaggerContainer staggerDelay={100}>
 *   <motion.div variants={childVariant}>Item 1</motion.div>
 *   <motion.div variants={childVariant}>Item 2</motion.div>
 *   <motion.div variants={childVariant}>Item 3</motion.div>
 * </StaggerContainer>
 * ```
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  threshold = 0.1,
  once = true,
  className = ''
}: StaggerContainerProps) {
  const { ref, inView } = useInViewAnimation({ threshold, once })

  // Convert staggerDelay from ms to seconds if it's > 1
  const delayInSeconds = staggerDelay > 1 ? staggerDelay / 1000 : staggerDelay

  const containerVariants = createStaggerVariant(delayInSeconds)

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={inView ? 'animate' : 'initial'}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
