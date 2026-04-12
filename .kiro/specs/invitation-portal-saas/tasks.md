# Implementation Plan: Invitation Portal SaaS

## Overview

This implementation plan breaks down the Invitation Portal SaaS into discrete, manageable coding tasks. The plan follows a phased approach starting with core infrastructure, then user features, public features, admin features, and finally testing. Each task builds on previous steps with incremental validation through automated tests.

**Technology Stack:**
- Frontend: Next.js 14+ with React, TypeScript, Tailwind CSS
- Backend: Next.js API Routes with Node.js
- Database: PostgreSQL with Prisma ORM
- Storage: AWS S3 for image management
- Authentication: NextAuth.js with JWT

---

## Phase 1: Foundation (Core Infrastructure)

- [ ] 1. Setup project structure and dependencies
  - Initialize Next.js 14+ project with TypeScript
  - Install core dependencies: Prisma, NextAuth.js, Tailwind CSS, AWS SDK
  - Configure TypeScript strict mode and ESLint
  - Setup environment variables (.env.local template)
  - _Requirements: 1.1, 1.2_

- [ ] 2. Setup PostgreSQL database and Prisma schema
  - Create PostgreSQL database connection
  - Define Prisma schema with all models (Users, Invitations, Templates, Sections, Images, Analytics)
  - Configure Prisma client and generate types
  - Setup database connection pooling
  - _Requirements: 1.1, 1.2_

- [ ] 3. Create database migrations and seed initial data
  - Create initial migration for all tables
  - Setup Prisma seed script
  - Seed default templates (Elegant, AKA-Inspired)
  - Seed admin user account
  - _Requirements: 1.1, 1.2_

- [ ] 4. Implement authentication system with NextAuth.js
  - Configure NextAuth.js with JWT strategy
  - Implement credentials provider (email/password)
  - Setup session callbacks and JWT encoding/decoding
  - Create authentication middleware for protected routes
  - _Requirements: 1.1, 1.2_

- [ ] 5. Setup AWS S3 integration for image storage
  - Configure AWS SDK with S3 credentials
  - Create S3 bucket and configure CORS
  - Implement image upload utility functions
  - Setup image URL generation and expiration
  - _Requirements: 1.1, 1.2_

- [ ] 6. Create base layout components and routing structure
  - Create MainLayout component with header, sidebar, footer
  - Create EditorLayout component for split-screen editor
  - Create AdminLayout component for admin pages
  - Setup Next.js routing structure (pages, API routes)
  - Setup navigation and routing guards
  - _Requirements: 1.1, 1.2_

- [ ] 7. Checkpoint - Verify core infrastructure
  - Ensure database migrations run successfully
  - Verify NextAuth.js authentication flow works
  - Test AWS S3 connection and image upload
  - Confirm all base layouts render correctly

---

## Phase 2: User Features (User Invitation Management)

- [ ] 8. Implement user registration and login pages
  - Create registration form with email/password validation
  - Create login form with error handling
  - Implement form validation and error messages
  - Setup password hashing and secure storage
  - _Requirements: 1.1, 1.2_

- [ ]* 8.1 Write unit tests for authentication service
  - Test user registration with valid/invalid inputs
  - Test login with correct/incorrect credentials
  - Test password hashing and verification
  - _Requirements: 1.1, 1.2_

- [ ] 9. Create dashboard with statistics overview
  - Create Dashboard page component
  - Implement statistics display (total invitations, published, views)
  - Fetch user invitation data from database
  - Display recent invitations list
  - _Requirements: 19.1, 19.2, 19.3_

- [ ]* 9.1 Write unit tests for dashboard data fetching
  - Test statistics calculation
  - Test recent invitations sorting
  - _Requirements: 19.1, 19.2_

- [ ] 10. Implement card list page for displaying all user invitations
  - Create Card List page component
  - Implement invitation grid/list view with thumbnails
  - Add filter and sort options
  - Implement pagination or infinite scroll
  - _Requirements: 3.1, 3.2, 3.3_

- [ ]* 10.1 Write unit tests for card list filtering and sorting
  - Test filter by status
  - Test sort by date/name
  - _Requirements: 3.1, 3.2_

- [ ] 11. Create invitation creation flow with template selection
  - Create template selection modal/page
  - Implement template grid display with previews
  - Add category filtering for templates
  - Create new invitation from selected template
  - _Requirements: 2.1, 2.2, 2.3, 21.1, 21.2_

- [ ]* 11.1 Write unit tests for template selection
  - Test template loading and filtering
  - Test invitation creation from template
  - _Requirements: 2.1, 2.2, 21.1_

- [ ] 12. Implement invitation editor with split-screen layout (neumorphism)
  - Create Editor page with split-screen layout
  - Implement ControlPanel component on left side
  - Implement RealTimePreview component on right side
  - Apply neumorphism styling to all components
  - Setup responsive layout for mobile/tablet
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 12.1 Write unit tests for editor layout responsiveness
  - Test split-screen layout on different viewport sizes
  - Test independent scrolling of panels
  - _Requirements: 4.4, 4.5_

- [ ] 13. Implement real-time preview with debouncing
  - Create RealTimePreview component
  - Implement debounced state updates (300ms)
  - Setup preview rendering with current invitation data
  - Implement responsive preview rendering
  - _Requirements: 4.2, 4.3_

- [ ]* 13.1 Write unit tests for debouncing mechanism
  - Test debounce timing and updates
  - Test preview updates after debounce
  - _Requirements: 4.3_

- [ ] 14. Implement text editor with validation
  - Create TextEditor component with editable fields
  - Implement field validation (required fields, character limits)
  - Add character count display
  - Setup auto-save on text changes
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 14.1 Write unit tests for text editor validation
  - Test required field validation
  - Test character limit enforcement
  - Test auto-save functionality
  - _Requirements: 5.5_

- [ ] 15. Implement font manager with font selection and sizing
  - Create FontManager component
  - Implement font family selector with available fonts
  - Add font size slider and input field
  - Add font weight options
  - Setup font preview in real-time
  - _Requirements: 6.1, 6.2, 6.3_

- [ ]* 15.1 Write unit tests for font manager
  - Test font selection and application
  - Test font size adjustments
  - Test font weight changes
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 16. Implement color picker with color palette
  - Create ColorPicker component
  - Implement color palette with predefined colors
  - Add custom color input (hex, rgb, hsl)
  - Setup color preview
  - Implement text and background color selection
  - _Requirements: 6.4, 6.5, 7.2_

- [ ]* 16.1 Write unit tests for color picker
  - Test color selection and application
  - Test color format conversion
  - Test color persistence
  - _Requirements: 6.4, 6.5_

- [ ] 17. Implement image uploader with crop functionality
  - Create ImageUploader component
  - Implement file upload interface with drag-and-drop
  - Setup image preview after upload
  - Implement crop tool with aspect ratio options
  - Add image optimization settings
  - _Requirements: 8.1, 8.2, 8.3, 9.1, 9.2, 9.3, 9.4_

- [ ]* 17.1 Write unit tests for image upload and cropping
  - Test file upload validation
  - Test image preview generation
  - Test crop functionality
  - Test image optimization
  - _Requirements: 8.1, 8.2, 9.1, 9.2_

- [ ] 18. Implement section manager (toggle, add, remove sections)
  - Create SectionManager component
  - Implement section toggle switches for all section types
  - Add "Add Section" functionality with section type selection
  - Implement section deletion with confirmation
  - Setup section reordering
  - _Requirements: 10.1, 10.2, 11.1, 11.2, 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ]* 18.1 Write unit tests for section manager
  - Test section toggle functionality
  - Test section addition and removal
  - Test section reordering
  - _Requirements: 10.1, 10.2, 12.1, 12.2_

- [ ] 19. Implement save and auto-save functionality
  - Create save handler for invitation updates
  - Implement auto-save with debouncing (optional)
  - Setup save validation and error handling
  - Display save status indicators
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ]* 19.1 Write unit tests for save functionality
  - Test save validation
  - Test database persistence
  - Test auto-save timing
  - _Requirements: 14.1, 14.2, 14.5_

- [ ] 20. Implement publish and unpublish functionality
  - Create publish handler for invitations
  - Generate unique public URL/slug for published invitations
  - Implement unpublish handler
  - Setup published status tracking
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ]* 20.1 Write unit tests for publish/unpublish
  - Test unique slug generation
  - Test publish status updates
  - Test public URL generation
  - _Requirements: 16.1, 16.2, 16.3_

- [ ] 21. Implement share functionality (WhatsApp, Email, Copy Link)
  - Create ShareDialog component
  - Implement copy-to-clipboard functionality
  - Setup WhatsApp share with pre-filled message
  - Setup email share with invitation link
  - Track share events for analytics
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [ ]* 21.1 Write unit tests for share functionality
  - Test copy-to-clipboard
  - Test WhatsApp share URL generation
  - Test email share URL generation
  - Test share event tracking
  - _Requirements: 17.1, 17.2, 17.3, 17.4_

- [ ] 22. Implement delete invitation with confirmation
  - Create delete handler for invitations
  - Implement confirmation dialog
  - Setup cascade deletion of related data
  - Redirect to card list after deletion
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ]* 22.1 Write unit tests for delete functionality
  - Test confirmation dialog
  - Test cascade deletion
  - Test redirect after deletion
  - _Requirements: 15.1, 15.2, 15.3_

- [ ] 23. Implement preview mode full-screen
  - Create Preview page component
  - Implement full-screen read-only invitation view
  - Setup return-to-editor button
  - Preserve unsaved changes when returning to editor
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ]* 23.1 Write unit tests for preview mode
  - Test full-screen rendering
  - Test return to editor functionality
  - Test unsaved changes preservation
  - _Requirements: 13.1, 13.2, 13.3_

- [ ] 24. Checkpoint - Verify all user features
  - Test complete invitation creation workflow
  - Test editor with all customization options
  - Test save, publish, and share functionality
  - Verify real-time preview updates
  - Test on mobile and desktop viewports

---

## Phase 3: Public Features (Public Invitation Viewing)

- [ ] 25. Create public invitation viewer page
  - Create public invitation page component (no auth required)
  - Implement invitation rendering from slug
  - Setup responsive design for mobile and desktop
  - Handle 404 for unpublished/deleted invitations
  - _Requirements: 18.1, 18.2, 18.3, 18.4_

- [ ]* 25.1 Write unit tests for public viewer
  - Test invitation rendering
  - Test 404 handling
  - Test responsive rendering
  - _Requirements: 18.1, 18.2, 18.3_

- [ ] 26. Implement analytics tracking for view events
  - Create analytics tracking service
  - Implement view event tracking on public page
  - Store analytics data in database
  - Track user agent and IP address
  - _Requirements: 18.5, 25.1, 25.2, 25.3_

- [ ]* 26.1 Write unit tests for analytics tracking
  - Test view event recording
  - Test analytics data persistence
  - _Requirements: 25.1, 25.2_

- [ ] 27. Implement responsive design for mobile and desktop
  - Test and optimize all pages for mobile viewport
  - Test and optimize all pages for tablet viewport
  - Test and optimize all pages for desktop viewport
  - Implement touch-friendly controls for mobile
  - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5_

- [ ]* 27.1 Write responsive design tests
  - Test layout on mobile (375px)
  - Test layout on tablet (768px)
  - Test layout on desktop (1920px)
  - _Requirements: 24.1, 24.2, 24.3_

- [ ] 28. Create landing page (public, no auth required)
  - Create landing page component
  - Implement feature showcase
  - Add call-to-action buttons (Register/Login)
  - Setup responsive design
  - _Requirements: 32.1, 32.2, 32.3, 32.4, 32.5_

- [ ]* 28.1 Write unit tests for landing page
  - Test page rendering
  - Test navigation links
  - _Requirements: 32.1, 32.2_

- [ ] 29. Checkpoint - Verify public features
  - Test public invitation viewing
  - Verify analytics tracking
  - Test landing page accessibility
  - Verify responsive design on all devices

---

## Phase 4: Admin Features (Admin Template Management)

- [ ] 30. Implement role-based access control (RBAC)
  - Create role checking middleware
  - Implement admin role assignment in database
  - Setup protected admin routes
  - Create permission checking utilities
  - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5_

- [ ]* 30.1 Write unit tests for RBAC
  - Test role assignment
  - Test permission checking
  - Test admin route protection
  - _Requirements: 26.1, 26.2, 26.3_

- [ ] 31. Create admin panel layout
  - Create AdminLayout component
  - Implement admin navigation menu
  - Setup admin dashboard page
  - Create admin page structure
  - _Requirements: 26.3, 26.4_

- [ ] 32. Implement admin template list page
  - Create admin template list page
  - Display all templates with metadata
  - Implement template filtering and sorting
  - Add create/edit/delete action buttons
  - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5_

- [ ]* 32.1 Write unit tests for template list
  - Test template loading
  - Test filtering and sorting
  - _Requirements: 28.1, 28.2_

- [ ] 33. Implement admin template creation with design editor
  - Create template creation form
  - Implement template design editor (similar to invitation editor)
  - Setup template preview
  - Implement template save functionality
  - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5_

- [ ]* 33.1 Write unit tests for template creation
  - Test template form validation
  - Test template save
  - _Requirements: 27.1, 27.2_

- [ ] 34. Implement admin template editing
  - Create template edit page
  - Load existing template data
  - Implement template property updates
  - Setup template preview updates
  - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.5_

- [ ]* 34.1 Write unit tests for template editing
  - Test template loading
  - Test template updates
  - _Requirements: 29.1, 29.2_

- [ ] 35. Implement admin template deletion with cascade handling
  - Create delete handler for templates
  - Implement confirmation dialog with usage count
  - Setup cascade handling for invitations using template
  - Redirect to template list after deletion
  - _Requirements: 30.1, 30.2, 30.3, 30.4, 30.5_

- [ ]* 35.1 Write unit tests for template deletion
  - Test cascade deletion handling
  - Test confirmation dialog
  - _Requirements: 30.1, 30.2, 30.3_

- [ ] 36. Implement template visibility management (Active/Inactive/Draft)
  - Create visibility toggle in template editor
  - Implement visibility state updates
  - Filter templates by visibility in user template selection
  - Setup visibility enforcement in API
  - _Requirements: 31.1, 31.2, 31.3, 31.4, 31.5_

- [ ]* 36.1 Write unit tests for template visibility
  - Test visibility state changes
  - Test visibility filtering
  - _Requirements: 31.1, 31.2, 31.3_

- [ ] 37. Implement template usage tracking
  - Create usage counter in templates table
  - Increment counter when invitation created from template
  - Display usage count in admin template list
  - _Requirements: 28.5, 29.5_

- [ ]* 37.1 Write unit tests for usage tracking
  - Test usage counter increments
  - Test usage display
  - _Requirements: 28.5_

- [ ] 38. Checkpoint - Verify admin features
  - Test admin access control
  - Test template creation, editing, deletion
  - Verify visibility management
  - Test usage tracking

---

## Phase 5: Analytics & Optimization (Optional)

- [ ] 39. Implement analytics dashboard for tracking engagement
  - Create analytics dashboard page
  - Display view count and engagement metrics
  - Implement charts and graphs
  - Setup analytics data aggregation
  - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5_

- [ ]* 39.1 Write unit tests for analytics dashboard
  - Test analytics data aggregation
  - Test chart rendering
  - _Requirements: 25.1, 25.2_

- [ ] 40. Implement detailed analytics page per invitation
  - Create invitation analytics page
  - Display view timeline and metrics
  - Implement analytics filtering by date range
  - Setup analytics export functionality
  - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5_

- [ ]* 40.1 Write unit tests for invitation analytics
  - Test analytics data retrieval
  - Test date range filtering
  - _Requirements: 25.1, 25.2_

- [ ] 41. Implement caching strategy for templates
  - Setup Redis caching for templates
  - Implement cache invalidation on template updates
  - Setup cache warming on application startup
  - _Requirements: Optional optimization_

- [ ] 42. Implement performance optimization
  - Optimize image loading with lazy loading
  - Implement code splitting for pages
  - Setup database query optimization
  - Implement API response caching
  - _Requirements: Optional optimization_

---

## Phase 6: Testing & Deployment

- [ ] 43. Implement integration tests for API endpoints
  - Test authentication endpoints
  - Test invitation CRUD endpoints
  - Test template management endpoints
  - Test public invitation endpoint
  - Test analytics endpoints
  - _Requirements: All API endpoints_

- [ ] 44. Implement E2E tests for critical workflows
  - Test complete user registration and first invitation creation
  - Test invitation editing and publishing workflow
  - Test admin template creation and application
  - Test public invitation viewing
  - _Requirements: All user workflows_

- [ ] 45. Setup CI/CD pipeline
  - Configure GitHub Actions or similar CI/CD tool
  - Setup automated testing on pull requests
  - Setup automated deployment to staging
  - Setup automated deployment to production
  - _Requirements: Deployment automation_

- [ ] 46. Deploy to production
  - Deploy database migrations to production
  - Deploy application to Vercel
  - Setup production environment variables
  - Verify all features work in production
  - _Requirements: Production deployment_

- [ ] 47. Final checkpoint - Production verification
  - Test all features in production environment
  - Verify analytics tracking
  - Monitor application performance
  - Ensure all security measures are in place

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and early error detection
- All code should follow TypeScript best practices and Next.js conventions
- Neumorphism styling should be consistently applied across all UI components
- Real-time preview should maintain < 500ms latency for optimal UX
- All API endpoints should include proper error handling and validation
- Database operations should use Prisma transactions for data consistency
