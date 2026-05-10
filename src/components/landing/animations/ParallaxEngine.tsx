'use client'

import { ReactNode } from 'react'
import { motion, useScroll, useSpring, useTransform, MotionValue } from 'framer-motion'

// ─── Exact blur/opacity patterns from dearmylove.org ─────────────────────────
// First section:  blur goes from clear to blurry, opacity from 1 to 0
// Middle sections: blur goes blurry→clear→clear→blurry, opacity goes 0→1→1→0
// Last section:  blur goes from blurry to clear, opacity from 0 to 1

const BLUR_FIRST = ['blur(0px)', 'blur(5px)']
const BLUR_MIDDLE = ['blur(5px)', 'blur(0px)', 'blur(0px)', 'blur(5px)']
const BLUR_LAST = ['blur(5px)', 'blur(0px)']

const OPACITY_FIRST = [1, 0]
const OPACITY_MIDDLE = [0, 1, 1, 0]
const OPACITY_LAST = [0, 1]

// ─── Custom easing (matches dearmylove.org) ──────────────────────────────────
export const EASE_CUSTOM: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ─── Rose SVG path ──────────────────────────────────────────────────────────
export const ROSE_PATH = "M1431 5750c0,-651 0,-1302 0,-1954 -205,-447 -746,-551 -950,-512 -613,115 -279,-290 49,302 269,394 572,437 901,210 0,-300 0,-600 0,-900 226,-16 504,-84 555,-264 166,-514 319,-435 246,-367 -67,62 -192,66 -277,71 -175,2 -284,8 -435,75 -368,163 -72,305 -97,-131 -8,-140 -56,-244 -99,-348 -218,-530 324,-205 -238,-118 -392,60 -855,28 -1003,-404 -126,-386 130,-448 437,-302 233,111 471,263 708,358 114,46 239,82 362,50 297,-90 466,-207 464,-541 -1,-281 -201,-121 -337,-48 -282,150 -659,293 -940,63 -158,-133 -172,-263 -153,-454 9,-86 23,-170 -66,-215 -113,-38 -186,56 -232,146 -53,104 -75,280 -21,388 113,191 455,209 649,279 150,53 235,205 337,237 149,41 180,-159 34,-211 -259,-86 -557,-125 -647,-426 -82,-293 489,-36 599,45 211,163 366,434 657,442 173,-18 365,-211 414,-373 46,-155 -48,-191 -154,-301 -150,-153 -35,-471 -484,-313 -223,78 -397,349 -147,420 112,32 227,-5 256,-128 15,-63 -2,-120 -32,-175 -170,-271 -457,-314 -753,-291 -171,14 -320,172 -252,348 128,194 506,438 738,333 99,-52 152,-141 84,-243 -77,-116 -304,-161 -381,-33 -95,176 255,491 370,596 90,82 160,145 239,244 203,260 45,279 29,252 -22,-37 41,-89 65,-107 113,-77 272,-120 335,-251 34,-75 119,-353 242,-259 83,63 28,204 -21,271 -114,154 -312,266 -451,406 -125,128 -177,160 -346,216 -486,155 -767,-103 -1066,-439 -111,-125 -258,-304 -423,-354"

// ─── Generate section ranges (exact same algorithm as dearmylove.org) ────────
// 11 sections, evenly spaced across 0→1 scroll progress
// Each middle section has 4 keyframes: [enter-start, enter-end, exit-start, exit-end]
// First section has 2: [visible, exit-end]
// Last section has 2: [enter-start, visible]
export function generateSectionRanges(sectionCount: number = 11) {
  const step = 1 / (sectionCount * 3) // Each section takes ~3 steps
  const ranges: number[][] = []
  
  // Exact ranges from dearmylove.org source code
  ranges.push([0, 1/30])                                      // Section 0
  ranges.push([1/30, 2/30, 3/30, 4/30])                       // Section 1
  ranges.push([4/30, 5/30, 6/30, 7/30])                       // Section 2
  ranges.push([7/30, 8/30, 9/30, 10/30])                      // Section 3
  ranges.push([10/30, 11/30, 12/30, 13/30])                   // Section 4
  ranges.push([13/30, 14/30, 15/30, 16/30])                   // Section 5
  ranges.push([16/30, 17/30, 18/30, 19/30])                   // Section 6
  ranges.push([19/30, 20/30, 21/30, 22/30])                   // Section 7
  ranges.push([22/30, 23/30, 24/30, 25/30])                   // Section 8
  ranges.push([25/30, 26/30, 27/30, 28/30])                   // Section 9
  ranges.push([29/30, 1])                                      // Section 10
  
  return ranges
}

// ─── Hook: useParallaxSection ───────────────────────────────────────────────
// Returns { filter, opacity } motion values for a specific section index
export function useParallaxSection(
  smoothProgress: MotionValue<number>,
  ranges: number[][],
  index: number
) {
  const range = ranges[index]
  const isFirst = index === 0
  const isLast = index === ranges.length - 1

  const filter = useTransform(
    smoothProgress,
    range,
    isFirst ? BLUR_FIRST : isLast ? BLUR_LAST : BLUR_MIDDLE
  )
  
  const opacity = useTransform(
    smoothProgress,
    range,
    isFirst ? OPACITY_FIRST : isLast ? OPACITY_LAST : OPACITY_MIDDLE
  )

  return { filter, opacity }
}

// ─── Component: ParallaxSection ─────────────────────────────────────────────
// Wraps content with scroll-driven opacity and blur transitions
interface ParallaxSectionProps {
  smoothProgress: MotionValue<number>
  ranges: number[][]
  index: number
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  /** Extra motion style props (e.g. y displacement for hero/closing) */
  extraStyle?: Record<string, MotionValue<number | string>>
}

export function ParallaxSection({
  smoothProgress,
  ranges,
  index,
  children,
  className = '',
  style,
  extraStyle,
}: ParallaxSectionProps) {
  const { filter, opacity } = useParallaxSection(smoothProgress, ranges, index)

  return (
    <motion.div
      style={{
        filter,
        opacity,
        color: '#ededed',
        ...extraStyle,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Component: AnimatedRoseSVG ─────────────────────────────────────────────
// SVG rose with path drawing animation driven by scroll progress
interface AnimatedRoseSVGProps {
  scrollYProgress: MotionValue<number>
  size?: number
  strokeColor?: string
  strokeWidth?: number | string
  className?: string
}

export function AnimatedRoseSVG({
  scrollYProgress,
  size = 70,
  strokeColor = '#ededed',
  strokeWidth = '50',
  className = '',
}: AnimatedRoseSVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2600 5800"
      width={size}
      className={className}
    >
      <motion.path
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        d={ROSE_PATH}
        style={{ pathLength: scrollYProgress }}
      />
    </svg>
  )
}

// ─── Component: FloralParallaxLayer ─────────────────────────────────────────
// All floating botanical elements with parallax transforms
interface FloralParallaxLayerProps {
  smoothProgress: MotionValue<number>
}

export function FloralParallaxLayer({ smoothProgress }: FloralParallaxLayerProps) {
  // Global opacity and blur for all florals — fade out as scroll progresses
  const floralOpacity = useTransform(smoothProgress, [0.3, 0.9], [1, 0])
  const floralBlur = useTransform(smoothProgress, [0.2, 0.8], ['blur(0px)', 'blur(5px)'])

  // Rotation transforms
  const rotateCW = useTransform(smoothProgress, [0, 1], ['0deg', '-90deg'])
  const rotateCCW = useTransform(smoothProgress, [0, 1], ['-90deg', '120deg'])

  // ── Floral 1: Top-left large ──
  const f1x = useTransform(smoothProgress, [0, 1], [0, -260])
  const f1y = useTransform(smoothProgress, [0, 1], [0, -330])
  const f1scale = useTransform(smoothProgress, [0, 1], [1, 2])

  // ── Floral 2: Top-right ──
  const f2x = useTransform(smoothProgress, [0, 1], [0, 240])
  const f2y = useTransform(smoothProgress, [0, 1], [0, -400])
  const f2scale = useTransform(smoothProgress, [0, 1], [1, 2.1])

  // ── Floral 3: Bottom-right ──
  const f3x = useTransform(smoothProgress, [0, 1], [0, 200])
  const f3y = useTransform(smoothProgress, [0, 1], [0, 80])
  const f3scale = useTransform(smoothProgress, [0, 1], [1, 1.7])

  // ── Floral 4: Bottom-left ──
  const f4x = useTransform(smoothProgress, [0, 1], [0, -120])
  const f4y = useTransform(smoothProgress, [0, 1], [0, 30])
  const f4scale = useTransform(smoothProgress, [0, 1], [1, 2])

  // Shared animation props
  const enterAnimation = {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 1.5, ease: EASE_CUSTOM, delay: 1.5 },
  }

  return (
    <>
      {/* Floral 1 — Top-left large */}
      <motion.div
        {...enterAnimation}
        style={{
          x: f1x, y: f1y, scale: f1scale,
          opacity: floralOpacity, filter: floralBlur,
        }}
        className="fixed top-0 left-[-80px] pointer-events-none"
      >
        <img src="/svg/dearmylove.org-1.svg" alt="" className="w-[280px] md:w-[480px] h-auto opacity-40" />
      </motion.div>

      {/* Floral 2 — Top-right */}
      <motion.div
        {...enterAnimation}
        style={{
          x: f2x, y: f2y, scale: f2scale,
          opacity: floralOpacity, filter: floralBlur,
        }}
        className="fixed top-0 right-0 pointer-events-none"
      >
        <img src="/svg/dearmylove.org-9.svg" alt="" className="w-[180px] md:w-[320px] h-auto opacity-40 transform scale-y-[-1]" />
      </motion.div>

      {/* Floral 3 — Bottom-right */}
      <motion.div
        {...enterAnimation}
        style={{
          x: f3x, y: f3y, scale: f3scale,
          opacity: floralOpacity, filter: floralBlur,
        }}
        className="fixed bottom-0 -right-20 md:right-0 lg:right-40 pointer-events-none"
      >
        <img src="/svg/dearmylove.org-9.svg" alt="" className="w-[280px] md:w-[400px] h-auto opacity-40" />
      </motion.div>

      {/* Floral 4 — Bottom-left */}
      <motion.div
        {...enterAnimation}
        style={{
          x: f4x, y: f4y, scale: f4scale,
          opacity: floralOpacity, filter: floralBlur,
        }}
        className="fixed bottom-0 -left-20 md:left-0 pointer-events-none"
      >
        <img src="/svg/dearmylove.org-1.svg" alt="" className="w-[280px] md:w-[400px] h-auto opacity-40 transform scale-x-[-1]" />
      </motion.div>

      {/* Small decorative elements */}
      <motion.div
        {...enterAnimation}
        style={{
          x: f2x, y: f4y, scale: f4scale,
          opacity: floralOpacity, filter: floralBlur,
          rotate: rotateCW,
        }}
        className="fixed bottom-80 right-60 pointer-events-none"
      >
        <img src="/svg/dearmylove.org-5.svg" alt="" className="w-[60px] md:w-[100px] h-auto opacity-40" />
      </motion.div>

      <motion.div
        {...enterAnimation}
        style={{
          x: f1x, y: f4y, scale: f4scale,
          opacity: floralOpacity, filter: floralBlur,
          rotate: rotateCW,
        }}
        className="fixed bottom-64 left-56 pointer-events-none"
      >
        <img src="/svg/dearmylove.org-6.svg" alt="" className="w-[70px] md:w-[120px] h-auto opacity-40" />
      </motion.div>

      <motion.div
        {...enterAnimation}
        style={{
          x: f1x, y: f2y, scale: f4scale,
          opacity: floralOpacity, filter: floralBlur,
          rotate: rotateCW,
        }}
        className="fixed top-80 left-64 pointer-events-none"
      >
        <img src="/svg/dearmylove.org-7.svg" alt="" className="w-[60px] md:w-[100px] h-auto opacity-40" />
      </motion.div>

      <motion.div
        {...enterAnimation}
        style={{
          x: f1x, y: f2y, scale: f4scale,
          opacity: floralOpacity, filter: floralBlur,
          rotate: rotateCCW,
        }}
        className="fixed top-8 left-1/3 pointer-events-none"
      >
        <img src="/svg/dearmylove.org-9.svg" alt="" className="w-[80px] md:w-[140px] h-auto opacity-40" />
      </motion.div>
    </>
  )
}
