/**
 * Animation Components Index
 * 
 * Central export point for all reusable animation components.
 * These components use the animation utilities and hooks from src/lib/animations and src/lib/hooks.
 */

export { FadeInUp, type FadeInUpProps } from './FadeInUp'
export { ParallaxContainer, type ParallaxContainerProps } from './ParallaxContainer'
export { FloatingElement, type FloatingElementProps } from './FloatingElement'
export { StaggerContainer, type StaggerContainerProps } from './StaggerContainer'
export { ScrollProgressIndicator, type ScrollProgressIndicatorProps } from './ScrollProgressIndicator'

// New components inspired by dearmylove.org
export { SVGPathDrawing, type SVGPathDrawingProps } from './SVGPathDrawing'
export { LetterSpacingText, type LetterSpacingTextProps } from './LetterSpacingText'
export { BreathingElement, type BreathingElementProps } from './BreathingElement'
export { Card3DRotation, Card3DRotationLayer, type Card3DRotationProps } from './Card3DRotation'
export { ParallaxImage, ParallaxImageWithBrightness, type ParallaxImageProps } from './ParallaxImage'
export { AmbientParticles, AmbientParticlesWithColor, type AmbientParticlesProps } from './AmbientParticles'

// Error handling
export { AnimationErrorBoundary } from './AnimationErrorBoundary'
