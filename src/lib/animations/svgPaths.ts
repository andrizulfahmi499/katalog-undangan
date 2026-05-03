/**
 * SVG Path Library
 * 
 * Predefined SVG paths for decorative elements with drawing animations.
 * Paths are sourced from dearmylove.org and other elegant designs.
 */

export interface SVGPathConfig {
  path: string
  strokeColor: string
  strokeWidth: number
  duration: number
  easing: [number, number, number, number]
  viewBox: string
}

/**
 * Rose SVG path - elegant rose outline for drawing animation
 * Source: dearmylove.org
 */
export const ROSE_PATH = "M1431 5750c0,-651 0,-1302 0,-1954 -205,-447 -746,-551 -950,-512 -613,115 -279,-290 49,302 269,394 572,437 901,210 0,-300 0,-600 0,-900 226,-16 504,-84 555,-264 166,-514 319,-435 246,-367 -67,62 -192,66 -277,71 -175,2 -284,8 -435,75 -368,163 -72,305 -97,-131 -8,-140 -56,-244 -99,-348 -218,-530 324,-205 -238,-118 -392,60 -855,28 -1003,-404 -126,-386 130,-448 437,-302 233,111 471,263 708,358 114,46 239,82 362,50 297,-90 466,-207 464,-541 -1,-281 -201,-121 -337,-48 -282,150 -659,293 -940,63 -158,-133 -172,-263 -153,-454 9,-86 23,-170 -66,-215 -113,-38 -186,56 -232,146 -53,104 -75,280 -21,388 113,191 455,209 649,279 150,53 235,205 337,237 149,41 180,-159 34,-211 -259,-86 -557,-125 -647,-426 -82,-293 489,-36 599,45 211,163 366,434 657,442 173,-18 365,-211 414,-373 46,-155 -48,-191 -154,-301 -150,-153 -35,-471 -484,-313 -223,78 -397,349 -147,420 112,32 227,-5 256,-128 15,-63 -2,-120 -32,-175 -170,-271 -457,-314 -753,-291 -171,14 -320,172 -252,348 128,194 506,438 738,333 99,-52 152,-141 84,-243 -77,-116 -304,-161 -381,-33 -95,176 255,491 370,596 90,82 160,145 239,244 203,260 45,279 29,252 -22,-37 41,-89 65,-107 113,-77 272,-120 335,-251 34,-75 119,-353 242,-259 83,63 28,204 -21,271 -114,154 -312,266 -451,406 -125,128 -177,160 -346,216 -486,155 -767,-103 -1066,-439 -111,-125 -258,-304 -423,-354"

/**
 * Leaf SVG paths - decorative leaf accents
 */
export const LEAF_PATH_1 = "M20 50 Q30 20 50 10 Q40 30 45 50 Q35 40 20 50 Z"
export const LEAF_PATH_2 = "M80 50 Q70 20 50 10 Q60 30 55 50 Q65 40 80 50 Z"

/**
 * Simple ornament paths for decorative elements
 */
export const ORNAMENT_PATHS = {
  star: "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  sparkle: "M12 0L14.59 7.41L22 10L14.59 12.59L12 20L9.41 12.59L2 10L9.41 7.41L12 0Z",
}

/**
 * SVG Path Library with configurations
 */
export const SVGPathLibrary: Record<string, SVGPathConfig> = {
  rose: {
    path: ROSE_PATH,
    strokeColor: 'rgba(237,237,237,0.5)',
    strokeWidth: 40,
    duration: 1.8,
    easing: [0.25, 0.1, 0.25, 1],
    viewBox: '0 0 2600 5800',
  },
  leaf1: {
    path: LEAF_PATH_1,
    strokeColor: 'rgba(237,237,237,0.2)',
    strokeWidth: 1,
    duration: 1.2,
    easing: [0.25, 0.1, 0.25, 1],
    viewBox: '0 0 100 60',
  },
  leaf2: {
    path: LEAF_PATH_2,
    strokeColor: 'rgba(237,237,237,0.2)',
    strokeWidth: 1,
    duration: 1.2,
    easing: [0.25, 0.1, 0.25, 1],
    viewBox: '0 0 100 60',
  },
  star: {
    path: ORNAMENT_PATHS.star,
    strokeColor: 'rgba(168,213,196,0.4)',
    strokeWidth: 2,
    duration: 1.5,
    easing: [0.22, 1, 0.36, 1],
    viewBox: '0 0 24 24',
  },
  heart: {
    path: ORNAMENT_PATHS.heart,
    strokeColor: 'rgba(251,207,232,0.4)',
    strokeWidth: 2,
    duration: 1.5,
    easing: [0.22, 1, 0.36, 1],
    viewBox: '0 0 24 24',
  },
  sparkle: {
    path: ORNAMENT_PATHS.sparkle,
    strokeColor: 'rgba(165,180,252,0.4)',
    strokeWidth: 2,
    duration: 1.2,
    easing: [0.22, 1, 0.36, 1],
    viewBox: '0 0 24 24',
  },
}

/**
 * Helper function to get SVG path configuration
 */
export function getSVGPath(name: keyof typeof SVGPathLibrary): SVGPathConfig {
  return SVGPathLibrary[name]
}
