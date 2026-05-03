# Implementation Plan: CleanApp Landing Page Theme

## Overview

This implementation plan breaks down the CleanApp theme feature into discrete, actionable coding tasks. The CleanApp theme is a mobile-first landing page theme with comprehensive customization capabilities for text, images, and colors. The implementation follows a layered approach: database schema and API endpoints first, then core context and configuration system, followed by individual theme components, and finally integration, testing, and documentation.

**Technology Stack:** TypeScript, React, Next.js, Prisma, PostgreSQL, Tailwind CSS

**Implementation Strategy:**
1. Start with backend infrastructure (database, API)
2. Build configuration context system
3. Implement theme components incrementally
4. Add admin dashboard integration
5. Implement responsive design and animations
6. Add comprehensive testing
7. Complete with documentation

## Tasks

- [ ] 1. Database schema and API foundation
  - [x] 1.1 Update Prisma schema for theme configuration
    - Add `landingPageTheme` field to Member model (enum: 'default', 'neumorphism', 'cleanapp')
    - Ensure `landingPageConfig` JSON field exists for storing theme customization
    - Generate Prisma client with updated schema
    - _Requirements: 1.1, 2.1_
  
  - [ ]* 1.2 Write property test for theme selection persistence
    - **Property 1: Theme Selection Persistence**
    - **Validates: Requirements 1.2**
    - Test that storing and retrieving theme selection returns the same value
  
  - [x] 1.3 Create theme configuration API endpoints
    - Implement GET `/api/public/settings` endpoint to fetch theme configuration
    - Implement POST `/api/admin/theme-config` endpoint to save theme configuration
    - Add validation for configuration structure using Zod schemas
    - _Requirements: 2.2, 2.3, 2.4_
  
  - [ ]* 1.4 Write property test for configuration structure validation
    - **Property 3: Configuration Structure Validation**
    - **Validates: Requirements 2.2**
    - Test that API accepts valid configurations and rejects invalid ones
  
  - [ ]* 1.5 Write property test for configuration persistence round-trip
    - **Property 4: Configuration Persistence Round-Trip**
    - **Validates: Requirements 2.3, 3.4, 4.4, 5.4**
    - Test that saving and retrieving configuration returns equivalent data

- [ ] 2. Configuration context and type definitions
  - [x] 2.1 Define TypeScript types for CleanApp configuration
    - Create `types/cleanapp-theme.ts` with interfaces for all configuration sections
    - Define types for hero, features, pricing, FAQ, footer, colors, and images
    - Export type definitions for use across components
    - _Requirements: 16.5_
  
  - [x] 2.2 Create CleanAppConfigContext provider
    - Implement React context for managing theme configuration state
    - Add loading and error state handling
    - Fetch configuration from `/api/public/settings` on initialization
    - Provide type-safe access to configuration properties
    - _Requirements: 16.1, 16.2, 16.3, 16.4_
  
  - [ ]* 2.3 Write property test for context initialization
    - **Property 36: Context Initialization**
    - **Validates: Requirements 16.2**
    - Test that context initializes correctly with API response data
  
  - [ ]* 2.4 Write property test for context data propagation
    - **Property 37: Context Data Propagation**
    - **Validates: Requirements 16.3**
    - Test that child components can access configuration data
  
  - [x] 2.3 Create default configuration values
    - Define default text content for all sections
    - Define default placeholder image URLs
    - Define default soft pastel color palette (pink, blue, cream, gold)
    - Define default feature items, pricing tiers, and FAQ items
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_
  
  - [ ]* 2.6 Write property test for default configuration application
    - **Property 5: Default Configuration Application**
    - **Validates: Requirements 2.5, 20.5**
    - Test that members without custom config receive all default values

- [x] 3. Checkpoint - Ensure foundation is solid
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. CleanApp main layout component
  - [x] 4.1 Create CleanAppLanding root component
    - Create `src/components/landing/cleanapp/CleanAppLanding.tsx`
    - Wrap all CleanApp components with CleanAppConfigProvider
    - Implement component composition structure
    - Add loading and error states
    - _Requirements: 1.3_
  
  - [ ]* 4.2 Write property test for theme-specific rendering
    - **Property 2: Theme-Specific Rendering**
    - **Validates: Requirements 1.3, 1.4**
    - Test that CleanApp theme renders CleanApp components only
  
  - [x] 4.3 Integrate CleanAppLanding into page routing
    - Update `src/app/[slug]/DynamicLandingClient.tsx` to check for 'cleanapp' theme
    - Conditionally render CleanAppLanding when theme is 'cleanapp'
    - Ensure existing themes continue to work
    - _Requirements: 1.3, 1.4_

- [ ] 5. Hero section with login modal
  - [x] 5.1 Implement CleanAppHero component
    - Create `src/components/landing/cleanapp/CleanAppHero.tsx`
    - Display customized hero text, description, and CTA button
    - Display customized hero image or background
    - Add responsive layout for mobile, tablet, and desktop
    - _Requirements: 9.1, 9.2_
  
  - [x] 5.2 Implement CleanAppLoginModal component
    - Create `src/components/landing/cleanapp/CleanAppLoginModal.tsx`
    - Implement modal dialog with authentication form
    - Add form validation and error handling
    - Handle successful authentication and UI state updates
    - _Requirements: 9.3, 9.4, 9.5_
  
  - [ ]* 5.3 Write property test for component content completeness
    - **Property 19: Component Content Completeness (Hero)**
    - **Validates: Requirements 9.1, 9.2**
    - Test that hero renders all configured elements
  
  - [ ]* 5.4 Write property test for modal interaction behavior
    - **Property 20: Modal Interaction Behavior**
    - **Validates: Requirements 9.3, 9.5**
    - Test modal open/close and authentication flow
  
  - [ ]* 5.5 Write unit tests for CleanAppHero
    - Test responsive layout rendering
    - Test CTA button click handling
    - Test image lazy loading

- [ ] 6. Features section
  - [x] 6.1 Implement CleanAppFeatures component
    - Create `src/components/landing/cleanapp/CleanAppFeatures.tsx`
    - Display feature items with icon, title, and description
    - Use card-based layout with consistent styling
    - Add responsive grid layout
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [ ]* 6.2 Write property test for feature count validation
    - **Property 21: Feature Count Validation**
    - **Validates: Requirements 10.4**
    - Test that system accepts 3-6 features and rejects others
  
  - [ ]* 6.3 Write property test for card styling consistency
    - **Property 13: Card Styling Consistency**
    - **Validates: Requirements 7.2, 7.3**
    - Test that all feature cards have consistent styling
  
  - [ ]* 6.4 Write unit tests for CleanAppFeatures
    - Test feature item rendering
    - Test responsive grid behavior
    - Test card hover interactions

- [ ] 7. Template grid with category filtering
  - [x] 7.1 Implement CleanAppCategoryPills component
    - Create `src/components/landing/cleanapp/CleanAppCategoryPills.tsx`
    - Display category filter buttons
    - Handle category selection and active state
    - Provide visual feedback for active filter
    - _Requirements: 8.2, 8.5_
  
  - [x] 7.2 Implement CleanAppTemplateCard component
    - Create `src/components/landing/cleanapp/CleanAppTemplateCard.tsx`
    - Display template preview image, title, and category
    - Use card-based layout with hover effects
    - Add lazy loading for images
    - _Requirements: 8.6_
  
  - [x] 7.3 Implement CleanAppTemplateGrid component
    - Create `src/components/landing/cleanapp/CleanAppTemplateGrid.tsx`
    - Display templates in responsive grid layout
    - Integrate CleanAppCategoryPills for filtering
    - Implement category filtering logic
    - Handle empty states
    - _Requirements: 8.1, 8.3, 8.4_
  
  - [ ]* 7.4 Write property test for template category filtering
    - **Property 16: Template Category Filtering**
    - **Validates: Requirements 8.3**
    - Test that filtering shows only matching templates
  
  - [ ]* 7.5 Write property test for active filter visual feedback
    - **Property 17: Active Filter Visual Feedback**
    - **Validates: Requirements 8.5**
    - Test that active filter has distinct styling
  
  - [ ]* 7.6 Write property test for template card content completeness
    - **Property 18: Template Card Content Completeness**
    - **Validates: Requirements 8.6**
    - Test that cards contain all required elements
  
  - [ ]* 7.7 Write unit tests for template grid
    - Test category filtering logic
    - Test grid responsive behavior
    - Test empty state rendering

- [ ] 8. Checkpoint - Ensure core components work
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Pricing section
  - [x] 9.1 Implement CleanAppPricing component
    - Create `src/components/landing/cleanapp/CleanAppPricing.tsx`
    - Display pricing tiers in card-based layout
    - Show tier name, price, features list, and CTA button
    - Implement recommended tier highlighting
    - Add responsive layout for mobile, tablet, and desktop
    - _Requirements: 11.1, 11.2, 11.4, 11.5_
  
  - [ ]* 9.2 Write property test for recommended tier highlighting
    - **Property 22: Recommended Tier Highlighting**
    - **Validates: Requirements 11.4**
    - Test that recommended tier has visual highlighting
  
  - [ ]* 9.3 Write property test for component content completeness
    - **Property 19: Component Content Completeness (Pricing)**
    - **Validates: Requirements 11.2**
    - Test that pricing tiers render all configured elements
  
  - [ ]* 9.4 Write unit tests for CleanAppPricing
    - Test pricing tier rendering
    - Test responsive layout behavior
    - Test CTA button interactions

- [ ] 10. Order form section
  - [x] 10.1 Implement CleanAppOrderForm component
    - Create `src/components/landing/cleanapp/CleanAppOrderForm.tsx`
    - Add input fields for name, email, phone, event type, and message
    - Implement form validation using react-hook-form and Zod
    - Handle form submission to backend API
    - Display success and error messages
    - Use appropriate input types for mobile optimization
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_
  
  - [ ]* 10.2 Write property test for form validation behavior
    - **Property 23: Form Validation Behavior**
    - **Validates: Requirements 12.2**
    - Test that form validates required fields correctly
  
  - [ ]* 10.3 Write property test for form submission success handling
    - **Property 24: Form Submission Success Handling**
    - **Validates: Requirements 12.4**
    - Test that successful submission shows message and clears form
  
  - [ ]* 10.4 Write property test for form submission error handling
    - **Property 25: Form Submission Error Handling**
    - **Validates: Requirements 12.5**
    - Test that failed submission shows actionable error message
  
  - [ ]* 10.5 Write property test for form input type appropriateness
    - **Property 26: Form Input Type Appropriateness**
    - **Validates: Requirements 12.6**
    - Test that form fields use appropriate input types
  
  - [ ]* 10.6 Write unit tests for CleanAppOrderForm
    - Test form field rendering
    - Test validation error display
    - Test submission flow

- [ ] 11. FAQ section
  - [x] 11.1 Implement CleanAppFAQ component
    - Create `src/components/landing/cleanapp/CleanAppFAQ.tsx`
    - Display FAQ items using accordion pattern
    - Implement expand/collapse behavior (one item open at a time)
    - Add smooth animations for expand/collapse
    - Use Radix UI Accordion for accessibility
    - _Requirements: 13.1, 13.2, 13.3_
  
  - [ ]* 11.2 Write property test for FAQ accordion behavior
    - **Property 27: FAQ Accordion Behavior**
    - **Validates: Requirements 13.3**
    - Test that clicking an item expands it and collapses others
  
  - [ ]* 11.3 Write property test for FAQ count validation
    - **Property 28: FAQ Count Validation**
    - **Validates: Requirements 13.5**
    - Test that system accepts 3-10 FAQ items and rejects others
  
  - [ ]* 11.4 Write unit tests for CleanAppFAQ
    - Test accordion expand/collapse
    - Test keyboard navigation
    - Test animation behavior

- [ ] 12. Footer and bottom navigation
  - [x] 12.1 Implement CleanAppFooter component
    - Create `src/components/landing/cleanapp/CleanAppFooter.tsx`
    - Display footer text, links, and contact information
    - Add social media links with customizable URLs
    - Display copyright with dynamic current year
    - Apply customized color palette
    - Add responsive layout
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [ ]* 12.2 Write property test for footer social media links
    - **Property 29: Footer Social Media Links**
    - **Validates: Requirements 14.2**
    - Test that footer contains links with configured URLs
  
  - [ ]* 12.3 Write property test for footer dynamic year display
    - **Property 30: Footer Dynamic Year Display**
    - **Validates: Requirements 14.3**
    - Test that footer displays current year
  
  - [ ]* 12.4 Write property test for footer color palette application
    - **Property 31: Footer Color Palette Application**
    - **Validates: Requirements 14.5**
    - Test that footer uses customized colors
  
  - [x] 12.5 Implement CleanAppBottomNav component
    - Create `src/components/landing/cleanapp/CleanAppBottomNav.tsx`
    - Display navigation items for Home, Templates, Pricing, Contact
    - Implement scroll-to-section behavior
    - Add active section highlighting based on scroll position
    - Fix position at bottom on mobile, hide on desktop
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [ ]* 12.6 Write property test for bottom navigation positioning
    - **Property 32: Bottom Navigation Positioning**
    - **Validates: Requirements 15.1**
    - Test that bottom nav is fixed at bottom on mobile
  
  - [ ]* 12.7 Write property test for bottom navigation scroll behavior
    - **Property 33: Bottom Navigation Scroll Behavior**
    - **Validates: Requirements 15.3**
    - Test that clicking nav items scrolls to sections
  
  - [ ]* 12.8 Write property test for bottom navigation active state
    - **Property 34: Bottom Navigation Active State**
    - **Validates: Requirements 15.4**
    - Test that active section is highlighted correctly
  
  - [ ]* 12.9 Write property test for bottom navigation responsive visibility
    - **Property 35: Bottom Navigation Responsive Visibility**
    - **Validates: Requirements 15.5**
    - Test that bottom nav is hidden on desktop
  
  - [ ]* 12.10 Write unit tests for footer and bottom nav
    - Test footer link rendering
    - Test bottom nav scroll behavior
    - Test responsive visibility

- [ ] 13. Checkpoint - Ensure all components are complete
  - Ensure all tests pass, ask the user if questions arise.

- [-] 14. Admin dashboard integration
  - [x] 14.1 Create admin theme configuration UI structure
    - Update `src/app/admin/dashboard/page.tsx` to add CleanApp theme option
    - Create tabbed interface for configuration sections: Text, Images, Colors, Features, Pricing, FAQ
    - Add theme selection dropdown with 'default', 'neumorphism', 'cleanapp' options
    - _Requirements: 17.1, 17.2_
  
  - [x] 14.2 Implement text content configuration UI
    - Add input fields for hero text, features, pricing, FAQ, footer
    - Use controlled form inputs with state management
    - Provide character count indicators where appropriate
    - _Requirements: 3.1, 17.2_
  
  - [x] 14.3 Implement image configuration UI
    - Add image upload functionality for all image positions
    - Implement image preview
    - Add image validation (format, size)
    - Store image URLs in configuration
    - _Requirements: 4.1, 4.2_
  
  - [ ]* 14.4 Write property test for image validation
    - **Property 8: Image Validation**
    - **Validates: Requirements 4.2**
    - Test that system accepts valid images and rejects invalid ones
  
  - [x] 14.5 Implement color palette configuration UI
    - Add color picker controls for all customizable colors
    - Display color preview swatches
    - Validate color contrast ratios for accessibility
    - _Requirements: 5.1, 5.2, 5.6_
  
  - [ ]* 14.6 Write property test for color contrast validation
    - **Property 10: Color Contrast Validation**
    - **Validates: Requirements 5.6, 19.2**
    - Test that system validates color contrast ratios
  
  - [x] 14.7 Implement live preview functionality
    - Add iframe or embedded preview of landing page
    - Update preview in real-time as configuration changes
    - Handle preview loading and error states
    - _Requirements: 3.2, 5.3, 17.3_
  
  - [ ]* 14.8 Write property test for live preview updates
    - **Property 7: Live Preview Updates**
    - **Validates: Requirements 3.2, 5.3, 17.3**
    - Test that preview updates immediately on config changes
  
  - [x] 14.9 Implement save and reset functionality
    - Add save button to persist configuration
    - Add reset button to restore default values
    - Display confirmation messages
    - Handle save errors gracefully
    - _Requirements: 17.4, 17.5_
  
  - [ ]* 14.10 Write property test for configuration save confirmation
    - **Property 39: Configuration Save Confirmation**
    - **Validates: Requirements 17.5**
    - Test that save action displays confirmation message
  
  - [ ]* 14.11 Write property test for configuration rendering consistency
    - **Property 6: Configuration Rendering Consistency**
    - **Validates: Requirements 3.5, 4.5, 5.5**
    - Test that customized values appear in rendered output

- [ ] 15. Responsive design implementation
  - [x] 15.1 Implement mobile-first responsive layouts
    - Ensure all components are optimized for mobile as primary viewport
    - Add responsive breakpoints for tablet (768px) and desktop (1024px)
    - Test all components at different viewport sizes
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 15.2 Write property test for responsive breakpoint behavior
    - **Property 11: Responsive Breakpoint Behavior**
    - **Validates: Requirements 6.2, 6.3, 6.4**
    - Test that correct layouts apply at different viewport widths
  
  - [x] 15.3 Ensure touch-friendly interactive elements
    - Verify all buttons, links, and interactive elements are at least 44x44px
    - Add appropriate touch feedback (active states)
    - Test on actual mobile devices if possible
    - _Requirements: 6.5_
  
  - [ ]* 15.4 Write property test for touch-friendly element sizing
    - **Property 12: Touch-Friendly Element Sizing**
    - **Validates: Requirements 6.5**
    - Test that interactive elements meet minimum size requirements
  
  - [x] 15.5 Implement card responsive adaptation
    - Ensure cards adapt layout appropriately at different viewport sizes
    - Test card grids, spacing, and readability
    - _Requirements: 7.5, 11.5, 14.4_
  
  - [ ]* 15.6 Write property test for card responsive adaptation
    - **Property 15: Card Responsive Adaptation**
    - **Validates: Requirements 7.5, 11.5, 14.4**
    - Test that cards adapt to viewport size changes
  
  - [ ]* 15.7 Write property test for interactive card feedback
    - **Property 14: Interactive Card Feedback**
    - **Validates: Requirements 7.4**
    - Test that interactive cards provide visual feedback

- [ ] 16. Animation and interaction implementation
  - [x] 16.1 Add scroll reveal animations
    - Implement scroll-triggered animations for sections
    - Use Framer Motion for smooth animations
    - Ensure animations respect prefers-reduced-motion
    - _Requirements: 7.2, 7.4_
  
  - [x] 16.2 Add hover and touch interactions
    - Implement hover effects for cards and buttons
    - Add touch feedback for mobile interactions
    - Ensure smooth transitions
    - _Requirements: 7.4_
  
  - [x] 16.3 Add accordion animations
    - Implement smooth expand/collapse animations for FAQ
    - Use Radix UI Accordion with custom animations
    - _Requirements: 13.2, 13.3_
  
  - [ ]* 16.4 Write unit tests for animations
    - Test animation triggers
    - Test animation completion
    - Test reduced-motion preference handling

- [ ] 17. Checkpoint - Ensure responsive design and animations work
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Performance optimization
  - [x] 18.1 Implement image lazy loading
    - Add lazy loading to all image components
    - Use Next.js Image component for optimization
    - Implement blur placeholders
    - _Requirements: 4.6, 18.1_
  
  - [ ]* 18.2 Write property test for image lazy loading
    - **Property 9: Image Lazy Loading**
    - **Validates: Requirements 4.6, 18.1**
    - Test that all images have lazy loading enabled
  
  - [x] 18.3 Optimize images for web delivery
    - Compress images appropriately
    - Use modern formats (WebP, AVIF) with fallbacks
    - Implement responsive images with srcset
    - _Requirements: 18.2_
  
  - [x] 18.4 Implement code splitting
    - Split CleanApp theme components into separate chunks
    - Use dynamic imports for modal and heavy components
    - Measure bundle size impact
    - _Requirements: 18.5_
  
  - [x] 18.5 Minimize layout shifts
    - Add explicit dimensions to images
    - Reserve space for dynamic content
    - Test Cumulative Layout Shift (CLS) score
    - Target CLS < 0.1
    - _Requirements: 18.3_
  
  - [x] 18.6 Optimize Largest Contentful Paint
    - Prioritize loading of hero section
    - Preload critical resources
    - Test LCP score, target < 2.5 seconds
    - _Requirements: 18.4_
  
  - [ ]* 18.7 Write integration tests for performance metrics
    - Test that CLS is below threshold
    - Test that LCP is below threshold
    - Test that images are optimized

- [ ] 19. Accessibility implementation
  - [x] 19.1 Add ARIA labels to interactive elements
    - Add aria-label to all buttons, links, and interactive elements
    - Add aria-expanded to accordion items
    - Add aria-current to active navigation items
    - _Requirements: 19.1_
  
  - [ ]* 19.2 Write property test for accessibility ARIA labels
    - **Property 40: Accessibility ARIA Labels**
    - **Validates: Requirements 19.1**
    - Test that interactive elements have appropriate ARIA labels
  
  - [x] 19.3 Ensure color contrast compliance
    - Verify all text meets contrast ratio requirements
    - Test with color contrast analyzer
    - Adjust colors if needed to meet WCAG AA standards
    - _Requirements: 19.2_
  
  - [x] 19.4 Implement keyboard navigation
    - Ensure all interactive elements are keyboard accessible
    - Add visible focus indicators
    - Test tab order and focus management
    - _Requirements: 19.3, 19.4_
  
  - [ ]* 19.5 Write property test for keyboard navigation support
    - **Property 41: Keyboard Navigation Support**
    - **Validates: Requirements 19.3, 19.4**
    - Test that elements are keyboard accessible with focus indicators
  
  - [x] 19.6 Use semantic HTML structure
    - Use header, nav, main, section, article, footer elements
    - Ensure proper heading hierarchy
    - Add landmark roles where appropriate
    - _Requirements: 19.5_
  
  - [ ]* 19.7 Write property test for semantic HTML structure
    - **Property 42: Semantic HTML Structure**
    - **Validates: Requirements 19.5**
    - Test that page uses semantic HTML elements
  
  - [ ]* 19.8 Write integration tests for accessibility
    - Test keyboard navigation flow
    - Test screen reader compatibility
    - Test focus management

- [ ] 20. Integration testing
  - [ ]* 20.1 Write integration test for full theme flow
    - Test theme selection → configuration → rendering flow
    - Test that all components work together correctly
    - Test navigation between sections
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [ ]* 20.2 Write integration test for admin configuration flow
    - Test configuration UI → save → preview → public page flow
    - Test that changes persist across sessions
    - Test that multiple members can have different configurations
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_
  
  - [ ]* 20.3 Write integration test for form submission flow
    - Test order form submission end-to-end
    - Test validation, submission, success/error handling
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ]* 20.4 Write integration test for responsive behavior
    - Test that theme works correctly at all breakpoints
    - Test that bottom nav appears/disappears correctly
    - Test that all components are usable on mobile
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 15.1, 15.5_

- [ ] 21. Documentation
  - [x] 21.1 Create component documentation
    - Document all CleanApp components with usage examples
    - Document props and configuration options
    - Add JSDoc comments to all exported functions and components
    - _Requirements: All_
  
  - [x] 21.2 Create admin user guide
    - Write guide for configuring CleanApp theme
    - Include screenshots and step-by-step instructions
    - Document best practices for images, colors, and content
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_
  
  - [x] 21.3 Create developer documentation
    - Document architecture and component hierarchy
    - Document configuration schema and API endpoints
    - Document how to extend or customize the theme
    - _Requirements: All_
  
  - [x] 21.4 Update project README
    - Add CleanApp theme to list of available themes
    - Document theme selection process
    - Add links to detailed documentation
    - _Requirements: 1.1_

- [ ] 22. Final checkpoint and verification
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all requirements are met
  - Test on multiple devices and browsers
  - Perform final accessibility audit
  - Review code quality and documentation

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end workflows
- The implementation follows a layered approach: backend → context → components → integration → testing → documentation
- All components should use TypeScript for type safety
- All components should use Tailwind CSS for styling
- All components should follow the existing project conventions and patterns
- Performance and accessibility are built in from the start, not added later
