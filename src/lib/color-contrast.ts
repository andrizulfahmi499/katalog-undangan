/**
 * Color Contrast Utilities
 * 
 * Utilities for checking WCAG color contrast compliance.
 * Ensures text is readable against background colors.
 * 
 * WCAG 2.1 Standards:
 * - Level AA: Contrast ratio of at least 4.5:1 for normal text
 * - Level AA: Contrast ratio of at least 3:1 for large text (18pt+ or 14pt+ bold)
 * - Level AAA: Contrast ratio of at least 7:1 for normal text
 * - Level AAA: Contrast ratio of at least 4.5:1 for large text
 * 
 * @see https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Calculate relative luminance of a color
 * @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 * @param color1 - First color in hex format (e.g., '#FF6B9D')
 * @param color2 - Second color in hex format (e.g., '#FFFFFF')
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid hex color format')
  }

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if contrast ratio meets WCAG AA standard
 * @param ratio - Contrast ratio to check
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 * @returns true if contrast meets WCAG AA standard
 */
export function meetsWCAG_AA(ratio: number, isLargeText: boolean = false): boolean {
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}

/**
 * Check if contrast ratio meets WCAG AAA standard
 * @param ratio - Contrast ratio to check
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 * @returns true if contrast meets WCAG AAA standard
 */
export function meetsWCAG_AAA(ratio: number, isLargeText: boolean = false): boolean {
  return isLargeText ? ratio >= 4.5 : ratio >= 7
}

/**
 * Validate color contrast for CleanApp theme
 * @param colors - Color palette to validate
 * @returns Validation results with contrast ratios and compliance status
 */
export function validateCleanAppColorContrast(colors: {
  primary: string
  secondary: string
  accent: string
  background: string
  backgroundSecondary?: string
  textPrimary: string
  textSecondary: string
}) {
  const results = {
    textPrimaryOnBackground: {
      ratio: getContrastRatio(colors.textPrimary, colors.background),
      meetsAA: false,
      meetsAAA: false,
    },
    textSecondaryOnBackground: {
      ratio: getContrastRatio(colors.textSecondary, colors.background),
      meetsAA: false,
      meetsAAA: false,
    },
    whiteOnPrimary: {
      ratio: getContrastRatio('#FFFFFF', colors.primary),
      meetsAA: false,
      meetsAAA: false,
    },
    textPrimaryOnBackgroundSecondary: colors.backgroundSecondary
      ? {
          ratio: getContrastRatio(colors.textPrimary, colors.backgroundSecondary),
          meetsAA: false,
          meetsAAA: false,
        }
      : null,
  }

  // Check compliance
  results.textPrimaryOnBackground.meetsAA = meetsWCAG_AA(results.textPrimaryOnBackground.ratio)
  results.textPrimaryOnBackground.meetsAAA = meetsWCAG_AAA(results.textPrimaryOnBackground.ratio)

  results.textSecondaryOnBackground.meetsAA = meetsWCAG_AA(results.textSecondaryOnBackground.ratio)
  results.textSecondaryOnBackground.meetsAAA = meetsWCAG_AAA(results.textSecondaryOnBackground.ratio)

  results.whiteOnPrimary.meetsAA = meetsWCAG_AA(results.whiteOnPrimary.ratio)
  results.whiteOnPrimary.meetsAAA = meetsWCAG_AAA(results.whiteOnPrimary.ratio)

  if (results.textPrimaryOnBackgroundSecondary) {
    results.textPrimaryOnBackgroundSecondary.meetsAA = meetsWCAG_AA(
      results.textPrimaryOnBackgroundSecondary.ratio
    )
    results.textPrimaryOnBackgroundSecondary.meetsAAA = meetsWCAG_AAA(
      results.textPrimaryOnBackgroundSecondary.ratio
    )
  }

  return results
}

/**
 * Get contrast ratio grade (AAA, AA, or Fail)
 */
export function getContrastGrade(ratio: number, isLargeText: boolean = false): 'AAA' | 'AA' | 'Fail' {
  if (meetsWCAG_AAA(ratio, isLargeText)) return 'AAA'
  if (meetsWCAG_AA(ratio, isLargeText)) return 'AA'
  return 'Fail'
}
