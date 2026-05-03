/**
 * useScrollSectionTracking Hook
 * 
 * Tracks which section is currently active based on scroll position.
 * Uses Framer Motion's useMotionValueEvent to track scrollYProgress.
 * 
 * Inspired by dearmylove.org's navigation highlighting system.
 */

import { useState, useEffect } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'

export interface SectionThreshold {
  id: string
  start: number // 0-1 (percentage of page scroll)
  end: number   // 0-1 (percentage of page scroll)
}

export interface UseScrollSectionTrackingOptions {
  sections: SectionThreshold[]
  offset?: number // Optional offset for fine-tuning (default: 0)
}

/**
 * Hook to track active section based on scroll position
 * 
 * @example
 * ```tsx
 * const sections = [
 *   { id: 'home', start: 0, end: 0.15 },
 *   { id: 'features', start: 0.15, end: 0.35 },
 *   { id: 'pricing', start: 0.35, end: 0.65 },
 *   { id: 'faq', start: 0.65, end: 1 }
 * ]
 * 
 * const activeSection = useScrollSectionTracking({ sections })
 * ```
 */
export function useScrollSectionTracking({
  sections,
  offset = 0
}: UseScrollSectionTrackingOptions): string {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '')
  const { scrollYProgress } = useScroll()

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const adjustedProgress = latest + offset

    // Find which section the current scroll position falls into
    for (const section of sections) {
      if (adjustedProgress >= section.start && adjustedProgress < section.end) {
        setActiveSection(section.id)
        break
      }
    }

    // Handle edge case: if at the very end, set to last section
    if (adjustedProgress >= sections[sections.length - 1].end) {
      setActiveSection(sections[sections.length - 1].id)
    }
  })

  return activeSection
}
