# Implementation Plan: Landing Page Animations

## Overview

This implementation plan breaks down the landing page animation enhancement into discrete, actionable coding tasks. The approach follows a bottom-up strategy: first building foundational utilities and reusable components, then integrating animations into existing landing page sections, and finally optimizing for performance and accessibility.

The implementation uses TypeScript and React with Framer Motion for all animations, ensuring type safety and maintainable code.

## Tasks

- [x] 1. Set up animation foundation and utilities
  - [x] 1.1 Create animation variants configuration file
    - Create `src/lib/animations/variants.ts` with TypeScript interfaces and predefined animation variants
    - Define at least 5 animation variants: fadeIn, fadeInUp, fadeInDown, scaleIn, slideInLeft, slideInRight
    - Include floating animation variants (floatingSubtle, floatingMedium, floatingStrong)
    - Export AnimationVariant and AnimationVariants interfaces
    - _Requirements: 9.2, 15.1, 15.2, 15.3, 15.5_
  
  - [x] 1.2 Create easing functions utility
    - Create `src/lib/animations/easing.ts` with custom easing functions
    - Define spring physics configurations (stiffness, damping, mass)
    - Export easing presets for common animation patterns
    - _Requirements: 5.2, 6.4_
  
  - [x] 1.3 Create performance utilities
    - Create `src/lib/animations/performance.ts` with performance monitoring utilities
    - Implement GPU acceleration helpers (transform3d, will-change)
    - Define PerformanceConfig interface
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [x] 1.4 Create animation hooks module
    - Create `src/lib/hooks/useReducedMotion.ts` hook
    - Implement media query detection for `prefers-reduced-motion`
    - Add event listener for media query changes
    - _Requirements: 13.3, 13.4_
  
  - [x] 1.5 Create scroll progress hook
    - Create `src/lib/hooks/useScrollProgress.ts` hook
    - Use Framer Motion's `useScroll` hook with `scrollYProgress`
    - Return scroll progress value (0-1)
    - _Requirements: 7.2, 7.4_
  
  - [x] 1.6 Create parallax hook
    - Create `src/lib/hooks/useParallax.ts` hook
    - Use `useScroll` and `useTransform` from Framer Motion
    - Accept speed and direction parameters
    - Calculate parallax offset based on scroll position
    - _Requirements: 1.1, 1.2, 1.5_
  
  - [x] 1.7 Create in-view animation hook
    - Create `src/lib/hooks/useInViewAnimation.ts` hook
    - Use Framer Motion's `useInView` hook
    - Accept threshold, once, and rootMargin parameters
    - Return ref and inView state
    - _Requirements: 3.3, 3.4, 9.4, 9.5_
  
  - [x] 1.8 Create index files for exports
    - Create `src/lib/animations/index.ts` to export all animation utilities
    - Create `src/lib/hooks/index.ts` to export all custom hooks
    - Ensure clean import paths for consumers
    - _Requirements: 15.4_

  - [x] 1.9 Enhance easing functions with cubic bezier curves
    - Update `src/lib/animations/easing.ts` with cubic bezier configurations
    - Add smoothEaseOut [0.22, 1, 0.36, 1] for entrance animations
    - Add smoothEaseInOut [0.25, 0.1, 0.25, 1] for SVG drawing
    - Document each easing curve with use cases
    - _Requirements: 24.1, 24.2, 24.3, 24.4_

  - [x] 1.10 Create SVG path library
    - Create `src/lib/animations/svgPaths.ts` with predefined SVG paths
    - Define rose, leaf, and ornament path configurations
    - Include stroke colors, widths, and durations
    - _Requirements: 16.1, 16.3_

  - [x] 1.11 Create scroll section tracking hook
    - Create `src/lib/hooks/useScrollSectionTracking.ts`
    - Use useMotionValueEvent to track scrollYProgress
    - Calculate active section based on thresholds
    - Return active section ID
    - _Requirements: 22.1, 22.2, 22.3_

- [ ]* 1.9 Write unit tests for animation utilities
    - Test animation variant configurations return correct motion props
    - Test easing functions calculate correct values
    - Test scroll progress calculations return values between 0-1
    - Test parallax offset calculations produce correct transform values
    - Test reduced motion hook correctly detects media query changes
    - _Requirements: All Phase 1 requirements_

- [x] 2. Create reusable animation components
  - [x] 2.1 Create FadeInUp component
    - Create `src/components/landing/animations/FadeInUp.tsx`
    - Define FadeInUpProps interface with children, delay, duration, offset, threshold, once, className
    - Use `useInView` hook to detect viewport intersection
    - Apply initial, animate, and transition props to motion.div
    - Default threshold to 0.1 (10% visible)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x] 2.2 Create ParallaxContainer component
    - Create `src/components/landing/animations/ParallaxContainer.tsx`
    - Define ParallaxContainerProps interface with children, speed, direction, className
    - Use `useParallax` hook for scroll-based transform
    - Apply transform3d for GPU acceleration
    - Default speed to 0.5
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [x] 2.3 Enhance ScrollReveal component
    - Locate existing `ScrollReveal` component (if exists) or create new one
    - Define ScrollRevealProps interface with variant support
    - Support multiple animation variants from centralized config
    - Use variant system for consistent animations
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 2.4 Create FloatingElement component
    - Create `src/components/landing/animations/FloatingElement.tsx`
    - Define FloatingElementProps interface with children, duration, offset, delay, className
    - Use animate prop with infinite repeat
    - Apply ease-in-out easing for smooth motion
    - Use transform: translateY for performance
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [x] 2.5 Create StaggerContainer component
    - Create `src/components/landing/animations/StaggerContainer.tsx`
    - Define StaggerContainerProps interface with children, staggerDelay, threshold, once, className
    - Use staggerChildren in parent variants
    - Apply delayChildren for initial delay
    - _Requirements: 4.1, 4.2, 4.3, 14.1, 14.2, 14.3, 14.5_
  
  - [x] 2.6 Create ScrollProgressIndicator component
    - Create `src/components/landing/animations/ScrollProgressIndicator.tsx`
    - Define ScrollProgressIndicatorProps interface with position, thickness, color, className
    - Use `useScrollProgress` hook
    - Use motion.div with scaleX or scaleY based on position
    - Apply fixed positioning for visibility during scroll
    - Respect theme colors (light/dark mode)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 2.7 Create animation components index file
    - Create `src/components/landing/animations/index.ts`
    - Export all animation components for clean imports
    - _Requirements: 15.4_

  - [x] 2.8 Create SVGPathDrawing component
    - Create `src/components/landing/animations/SVGPathDrawing.tsx`
    - Define SVGPathDrawingProps interface
    - Use motion.path with pathLength animation from 0 to 1
    - Apply cubic bezier easing [0.25, 0.1, 0.25, 1]
    - Support ghost trail effect with multiple path layers
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

  - [x] 2.9 Create LetterSpacingText component
    - Create `src/components/landing/animations/LetterSpacingText.tsx`
    - Define LetterSpacingTextProps interface
    - Animate letter spacing from expanded to normal
    - Combine with fade-in opacity animation
    - Use cubic bezier [0.22, 1, 0.36, 1]
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

  - [x] 2.10 Create BreathingElement component
    - Create `src/components/landing/animations/BreathingElement.tsx`
    - Define BreathingElementProps interface
    - Animate opacity between 0.2 and 0.6
    - Animate scale between 1.0 and 1.05
    - Use infinite repeat with ease-in-out
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

  - [x] 2.11 Create Card3DRotation component
    - Create `src/components/landing/animations/Card3DRotation.tsx`
    - Define Card3DRotationProps interface
    - Apply rotateY animation from 0 to 360 degrees
    - Add rotateX animation for tilt effect
    - Set perspective: 800px on parent
    - Use backfaceVisibility: hidden
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

  - [x] 2.12 Create ParallaxImage component
    - Create `src/components/landing/animations/ParallaxImage.tsx`
    - Define ParallaxImageProps interface
    - Use useScroll with target ref and offset
    - Transform Y based on scrollYProgress and speed
    - Apply overflow: hidden to parent
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

  - [x] 2.13 Create AmbientParticles component
    - Create `src/components/landing/animations/AmbientParticles.tsx`
    - Define AmbientParticlesProps interface
    - Generate particles with deterministic positions
    - Animate with y movement and opacity
    - Use staggered delays
    - Apply pointer-events: none
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_

- [ ]* 2.14 Write component tests for new animation components
    - Test SVGPathDrawing renders and animates pathLength
    - Test LetterSpacingText animates letter spacing correctly
    - Test BreathingElement applies breathing animation
    - Test Card3DRotation applies 3D transforms
    - Test ParallaxImage moves based on scroll
    - Test AmbientParticles generates and animates particles
    - _Requirements: All Phase 2 new requirements_

- [x] 3. Checkpoint - Verify foundation and components
  - Ensure all tests pass, ask the user if questions arise.

- [-] 4. Enhance VideoHeroSection with animations
  - [x] 4.1 Add hero section entrance animations
    - Locate and open `src/components/landing/VideoHeroSection.tsx` (or similar path)
    - Wrap main heading with FadeInUp component (800ms duration)
    - Apply stagger animation to child elements (200ms delays)
    - Animate call-to-action buttons with scale and fade-in effect
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [x] 4.2 Add floating animations to hero decorative elements
    - Identify decorative elements in hero section
    - Wrap decorative elements with FloatingElement component
    - Set cycle duration to 3-5 seconds
    - Vary duration and offset for natural movement
    - _Requirements: 2.4, 5.1, 5.2, 5.3_
  
  - [x] 4.3 Add hover animations to hero CTA buttons
    - Apply hover variants to call-to-action buttons
    - Implement lift effect (translateY -4px) and scale effect (1.05x)
    - Set transition duration to 200ms
    - Use spring physics for natural motion
    - _Requirements: 2.5, 6.1, 6.4, 6.5_
  
  - [x] 4.4 Preserve all existing hero section functionality
    - Verify video playback still works correctly
    - Ensure all text content is preserved
    - Verify responsive behavior on mobile
    - Test theme switching (light/dark mode)
    - _Requirements: 12.1, 12.2, 12.4, 12.5_

  - [x] 4.5 Add letter spacing animation to hero heading
    - Wrap hero heading with LetterSpacingText component
    - Animate from 0.8em to 0.35em letter spacing
    - Combine with fade-in effect
    - Use duration 1000ms with smooth easing
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

  - [x] 4.6 Add ambient particles to hero section
    - Add AmbientParticles component to hero background
    - Set particle count to 6-8
    - Apply low opacity (0.08-0.2)
    - Ensure particles don't interfere with content
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_

  - [x] 4.7 Add SVG decorative elements with path drawing
    - Add SVGPathDrawing components for decorative elements
    - Use rose or leaf paths from SVG library
    - Apply path drawing animation on page load
    - Position decoratively around hero content
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ]* 4.5 Write integration tests for hero section animations
    - Test hero animations trigger on page load
    - Test floating animations run continuously
    - Test hover animations apply correctly
    - Mock IntersectionObserver for testing
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 5. Enhance FeatureSection with stagger animations
  - [x] 5.1 Add scroll-triggered section animation
    - Locate and open `src/components/landing/FeatureSection.tsx` (or similar path)
    - Wrap section with ScrollReveal component
    - Set threshold to 0.1 (10% visible)
    - Apply fade-in and slide-up animation (600ms duration, 30px offset)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 5.2 Add stagger animations to feature cards
    - Wrap feature cards grid with StaggerContainer component
    - Set stagger delay to 100ms between cards
    - Apply fade-in and slide-up effects to each card
    - Ensure all animations complete within 1200ms
    - _Requirements: 4.1, 4.2, 4.3, 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 5.3 Add hover animations to feature cards
    - Apply hover variants to each feature card
    - Implement lift effect (translateY -12px) and subtle rotation (±2 degrees)
    - Set transition duration to 300ms
    - Maintain hover state until cursor leaves
    - _Requirements: 4.4, 4.5, 6.1, 6.2, 6.4, 6.5_
  
  - [x] 5.4 Preserve all existing feature section content
    - Verify all feature cards display correctly
    - Ensure all icons and text are preserved
    - Verify responsive grid layout on mobile
    - _Requirements: 12.1, 12.2, 12.4_

  - [x] 5.5 Add spring physics to feature card hover
    - Update hover animations to use spring physics
    - Configure stiffness: 350, damping: 25
    - Apply to lift and scale effects
    - Test smooth spring motion on hover
    - _Requirements: 21.1, 21.2, 21.3_

  - [x] 5.6 Add breathing animation to feature icons
    - Wrap feature icons with BreathingElement component
    - Set duration to 4 seconds
    - Apply subtle opacity and scale changes
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [ ]* 5.5 Write integration tests for feature section animations
    - Test feature cards animate when scrolled into view
    - Test stagger animations sequence correctly
    - Test hover animations apply to cards
    - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.4_

- [x] 6. Enhance IntroSection with parallax effects
  - [x] 6.1 Add parallax effects to intro section
    - Locate and open `src/components/landing/IntroSection.tsx` (or similar path)
    - Identify background decorative elements
    - Wrap decorative elements with ParallaxContainer component
    - Apply different speed ratios (0.3x, 0.5x, 0.8x) to different elements
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 6.2 Add scroll-triggered animation to intro content
    - Wrap intro content with ScrollReveal component
    - Apply fade-in and slide-up animation
    - Set threshold to 0.1
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [x] 6.3 Preserve all existing intro section content
    - Verify all text content is preserved
    - Ensure images display correctly
    - Verify responsive behavior
    - _Requirements: 12.1, 12.2, 12.4_

  - [x] 6.4 Replace images with ParallaxImage component
    - Replace standard img tags with ParallaxImage component
    - Set speed to 0.15 for subtle parallax
    - Apply to intro section images
    - Test parallax movement on scroll
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [x] 7. Enhance CatalogSection with scroll animations
  - [x] 7.1 Add scroll-triggered section animation
    - Locate and open `src/components/landing/CatalogSection.tsx` (or similar path)
    - Wrap section with ScrollReveal component
    - Apply fade-in animation
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [x] 7.2 Add stagger animations to catalog items
    - Wrap catalog items with StaggerContainer component
    - Set stagger delay to 100ms
    - Apply fade-in and slide-up effects
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 7.3 Add hover animations to catalog cards
    - Apply hover variants to catalog cards
    - Implement scale effect (1.02x-1.05x)
    - Set transition duration to 200ms
    - _Requirements: 6.1, 6.4, 6.5_
  
  - [x] 7.4 Preserve all existing catalog section content
    - Verify all catalog items display correctly
    - Ensure all images and descriptions are preserved
    - Verify responsive grid layout
    - _Requirements: 12.1, 12.2, 12.4_

- [ ] 8. Enhance PricingSection and OrderFormSection
  - [x] 8.1 Add scroll-triggered animation to pricing section
    - Locate and open `src/components/landing/PricingSection.tsx` (or similar path)
    - Wrap section with ScrollReveal component
    - Apply fade-in and slide-up animation
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [x] 8.2 Add stagger animations to pricing cards
    - Wrap pricing cards with StaggerContainer component
    - Set stagger delay to 100ms
    - Apply fade-in and scale-in effects
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 8.3 Add hover animations to pricing cards
    - Apply hover variants to pricing cards
    - Implement lift effect and shadow enhancement
    - Set transition duration to 300ms
    - _Requirements: 6.1, 6.2, 6.4, 6.5_
  
  - [x] 8.4 Add scroll-triggered animation to order form section
    - Locate and open `src/components/landing/OrderFormSection.tsx` (or similar path)
    - Wrap section with ScrollReveal component
    - Apply fade-in animation
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [x] 8.5 Preserve all existing pricing and order form content
    - Verify all pricing information is preserved
    - Ensure order form functionality works correctly
    - Verify responsive behavior
    - _Requirements: 12.1, 12.2, 12.4_

  - [x] 8.6 Add spring physics to pricing card hover
    - Update pricing card hover to use spring physics
    - Configure stiffness: 350, damping: 25
    - Apply lift effect (y: -12, scale: 1.03)
    - Test smooth spring motion
    - _Requirements: 21.1, 21.2, 21.3, 21.4_

  - [x] 8.7 Add 3D rotation effect to featured pricing card
    - Wrap featured pricing card with Card3DRotation component
    - Set rotation duration to 12 seconds
    - Apply subtle tilt effect
    - Ensure card content remains readable
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [ ] 9. Enhance FAQSection with animations
  - [x] 9.1 Add scroll-triggered section animation
    - Locate and open `src/components/landing/FAQSection.tsx` (or similar path)
    - Wrap section with ScrollReveal component
    - Apply fade-in animation
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [x] 9.2 Add stagger animations to FAQ items
    - Wrap FAQ items with StaggerContainer component
    - Set stagger delay to 80ms
    - Apply fade-in and slide-up effects
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 9.3 Preserve all existing FAQ content
    - Verify all FAQ questions and answers are preserved
    - Ensure accordion functionality works correctly
    - Verify responsive behavior
    - _Requirements: 12.1, 12.2, 12.4_

- [x] 10. Checkpoint - Verify all section enhancements
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Add scroll progress indicator to landing page
  - [x] 11.1 Integrate ScrollProgressIndicator component
    - Open main landing page file (likely `src/app/page.tsx`)
    - Add ScrollProgressIndicator component at the top of the page
    - Set position to 'top' and configure styling
    - Ensure indicator respects theme colors
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 11.2 Test scroll progress indicator
    - Verify indicator updates smoothly during scroll
    - Test in both light and dark mode
    - Verify indicator doesn't interfere with other elements
    - _Requirements: 7.2, 7.3, 7.5_

  - [x] 11.3 Add scroll section tracking to navigation
    - Integrate useScrollSectionTracking hook
    - Define section thresholds (home: 0-0.15, features: 0.15-0.35, etc.)
    - Update navigation active state based on current section
    - Apply smooth transitions when section changes
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_

- [ ] 12. Implement scale-on-scroll effects
  - [x] 12.1 Add scale effects to section headers
    - Identify at least 3 section headers or hero images
    - Use `useScroll` and `useTransform` to calculate scale values
    - Apply scale between 0.8x and 1.2x based on viewport position
    - Use smooth interpolation for scale calculations
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 12.2 Test scale effects
    - Verify scale effects work smoothly during scroll
    - Ensure no layout shifts occur
    - Test on different screen sizes
    - _Requirements: 8.5_

- [ ] 13. Implement performance optimizations
  - [x] 13.1 Add GPU acceleration to animated elements
    - Review all animated components
    - Ensure transform3d is applied for GPU acceleration
    - Add will-change property to actively animating elements
    - Remove will-change after animations complete
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [x] 13.2 Implement scroll event throttling
    - Add throttling to scroll event listeners (16.67ms for 60fps)
    - Use requestAnimationFrame for scroll-based animations
    - Add passive: true to scroll event listeners
    - _Requirements: 10.4, 10.5_
  
  - [x] 13.3 Add mobile-specific optimizations
    - Detect mobile devices using screen size or user agent
    - Reduce parallax intensity by 50% on mobile
    - Disable resource-intensive animations on mobile
    - _Requirements: 13.1, 13.2, 13.5_
  
  - [x] 13.4 Implement reduced motion support
    - Use useReducedMotion hook in all animation components
    - Disable parallax effects when reduced motion is preferred
    - Use instant transitions instead of animations
    - Maintain functionality without animations
    - _Requirements: 13.3, 13.4_

- [ ]* 13.5 Write performance tests
    - Test animations maintain 60fps on desktop
    - Test animations maintain 30fps minimum on mobile
    - Verify scroll events are throttled
    - Verify GPU acceleration is applied
    - Measure frame rates using Performance API
    - _Requirements: 10.3, 10.4, 10.5_

- [ ] 14. Add error handling and fallbacks
  - [x] 14.1 Create animation error boundary
    - Create `src/components/landing/animations/AnimationErrorBoundary.tsx`
    - Implement componentDidCatch to log errors
    - Fallback to children without animation on error
    - _Requirements: 11.2, 11.3_
  
  - [x] 14.2 Wrap animation components with error boundary
    - Wrap all animation components with AnimationErrorBoundary
    - Ensure graceful degradation on animation failures
    - Test error boundary by simulating animation errors
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [x] 14.3 Add browser compatibility checks
    - Check for Framer Motion support
    - Provide CSS-only animation fallbacks for unsupported browsers
    - Ensure no broken functionality in older browsers
    - _Requirements: 11.4_

- [ ] 15. Fix existing animation bugs
  - [x] 15.1 Audit existing animations
    - Review all existing Section_Components for animation issues
    - Identify non-functional or broken animations
    - Document animation timing issues
    - _Requirements: 11.1, 11.4_
  
  - [x] 15.2 Fix identified animation bugs
    - Fix animations that don't complete properly
    - Ensure elements remain in final animated state
    - Fix animation timing issues
    - Verify animations work in both light and dark mode
    - _Requirements: 11.2, 11.3, 11.4, 11.5_

- [ ] 16. Add floating animations to decorative elements
  - [x] 16.1 Identify decorative elements across sections
    - Review all landing page sections
    - Identify at least 5 decorative icons or elements
    - Document which elements should have floating animations
    - _Requirements: 5.4_
  
  - [x] 16.2 Apply floating animations
    - Wrap identified decorative elements with FloatingElement component
    - Vary duration (2-4 seconds) and offset (-20px to 0px) for natural movement
    - Use ease-in-out easing
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 17. Add hover animations to navigation and interactive elements
  - [x] 17.1 Add hover animations to navigation items
    - Locate navigation component
    - Apply color transition effect to navigation items (200ms duration)
    - Use spring physics for natural motion
    - _Requirements: 6.3, 6.4, 6.5_
  
  - [x] 17.2 Verify all interactive elements have hover states
    - Review all buttons, cards, and interactive elements
    - Ensure consistent hover animations across the page
    - Test hover state reversals
    - _Requirements: 6.1, 6.2, 6.4, 6.5_

- [ ] 18. Final checkpoint and verification
  - [x] 18.1 Run full test suite
    - Run all unit tests
    - Run all component tests
    - Run all integration tests
    - Fix any failing tests
    - _Requirements: All requirements_
  
  - [x] 18.2 Manual QA across browsers and devices
    - Test on Chrome, Firefox, Safari, Edge (latest versions)
    - Test on iOS Safari and Android Chrome
    - Test on mobile, tablet, and desktop screen sizes
    - Test with reduced motion enabled
    - Test theme switching with animations
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [x] 18.3 Verify all existing sections are preserved
    - Verify VideoHeroSection is intact
    - Verify IntroSection is intact
    - Verify FeatureSection is intact
    - Verify CatalogSection is intact
    - Verify PricingSection is intact
    - Verify OrderFormSection is intact
    - Verify FAQSection is intact
    - Verify all navigation links work
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [x] 18.4 Performance verification
    - Measure frame rates during scroll animations
    - Verify 60fps on desktop, 30fps minimum on mobile
    - Check for layout shifts or jank
    - Verify animations don't block main thread
    - _Requirements: 10.3, 10.4, 10.5_
  
  - [x] 18.5 Accessibility verification
    - Test keyboard navigation with animations
    - Test screen reader compatibility
    - Verify reduced motion support works correctly
    - Ensure focus states work with animations
    - _Requirements: 13.3, 13.4_

- [x] 19. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- The implementation uses TypeScript and React with Framer Motion
- All existing landing page sections must be preserved
- Performance and accessibility are critical considerations
- Testing focuses on unit tests, component tests, integration tests, and manual QA (not property-based testing)

## New Animation Techniques from DearMyLove.org

The following advanced animation techniques have been added to the spec based on learning from dearmylove.org:

### 1. **SVG Path Drawing Animation**
- Elegant drawing effect for decorative SVG elements (roses, leaves, ornaments)
- Uses `pathLength` property animated from 0 to 1
- Cubic bezier easing [0.25, 0.1, 0.25, 1] for natural drawing motion
- Ghost trail effect with multiple path layers for glow appearance

### 2. **Letter Spacing Animation**
- Premium typography effect for hero headings
- Animates from expanded (0.8em) to normal (0.35em) letter spacing
- Combined with fade-in for dramatic entrance
- Duration 800-1200ms with smooth cubic bezier easing

### 3. **Breathing Animation**
- Subtle continuous animation for decorative elements
- Synchronized opacity (0.2-0.6) and scale (1.0-1.05) changes
- Creates organic, living feel to botanical graphics
- 3-5 second cycle duration with ease-in-out timing

### 4. **3D Card Rotation**
- Modern product showcase effect
- Continuous rotateY (0-360°) and rotateX (-15° to 15°) animation
- Perspective: 800px for depth effect
- Multiple card layers with different speeds for enhanced depth

### 5. **Parallax Image Component**
- Reusable component for depth effects on images
- Uses `useScroll` and `useTransform` for scroll-based movement
- Speed parameter (0.05-0.3) for different parallax intensities
- Height 130% with overflow hidden for smooth parallax range

### 6. **Spring Physics**
- Natural, realistic motion for interactive elements
- Configuration: stiffness: 350, damping: 25 for responsive feel
- Applied to hover effects (lift, scale) and tap interactions
- Creates premium, polished interaction feel

### 7. **Scroll Section Tracking**
- Automatic navigation highlighting based on scroll position
- Uses `useMotionValueEvent` to track `scrollYProgress`
- Threshold-based section detection (0-0.15 = home, 0.15-0.35 = features, etc.)
- Smooth transitions when active section changes

### 8. **Ambient Floating Particles**
- Atmospheric background effect for hero and key sections
- Deterministic random positioning (avoids hydration mismatch)
- Vertical movement with opacity changes
- Low opacity (0.08-0.2) to maintain content readability

### 9. **Cubic Bezier Easing Library**
- Standardized easing curves for consistent feel
- `[0.22, 1, 0.36, 1]` - smooth ease-out for entrance animations
- `[0.25, 0.1, 0.25, 1]` - smooth ease-in-out for SVG drawing
- Documented with use cases and visual examples

### Implementation Priority

**High Priority** (Core enhancements):
1. Letter spacing animation for hero heading
2. Spring physics for hover interactions
3. Parallax image component for depth
4. Breathing animation for decorative elements

**Medium Priority** (Visual polish):
5. SVG path drawing for decorative elements
6. Scroll section tracking for navigation
7. Ambient particles for atmosphere

**Low Priority** (Optional enhancements):
8. 3D card rotation for product showcase
9. Additional cubic bezier easing variations

All new components follow the same patterns as existing animation components and integrate seamlessly with the current architecture.
