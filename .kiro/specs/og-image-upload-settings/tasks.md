# Implementation Tasks: Open Graph Image Upload for Landing Page Settings

## Task Breakdown

### Phase 1: Database Schema and Infrastructure

#### Task 1.1: Update Prisma Schema
- [ ] Add `landingPageOgImage String?` field to GlobalSetting model in `prisma/schema.prisma`
- [ ] Ensure field is optional (nullable)
- [ ] Add comment documenting field purpose
- [ ] Run `prisma format` to format schema

**Acceptance Criteria**:
- Field added to schema with correct type
- Schema file is properly formatted
- No syntax errors in schema

**Estimated Effort**: 15 minutes

---

#### Task 1.2: Create Database Migration
- [ ] Run `npx prisma migrate dev --name add_landing_page_og_image` to create migration
- [ ] Review generated migration SQL
- [ ] Verify migration adds column without dropping data
- [ ] Test migration on development database
- [ ] Commit migration files to version control

**Acceptance Criteria**:
- Migration file created in `prisma/migrations/`
- Migration successfully adds column
- Existing GlobalSetting record is not affected
- Migration is reversible

**Estimated Effort**: 20 minutes

---

#### Task 1.3: Create Upload Directory
- [ ] Create `/public/uploads/og-images/` directory structure
- [ ] Add `.gitkeep` file to ensure directory is tracked
- [ ] Add `.gitignore` entry to ignore uploaded images (keep directory, ignore files)
- [ ] Verify directory has correct permissions for web server
- [ ] Document directory structure in README or deployment docs

**Acceptance Criteria**:
- Directory exists and is writable
- Git tracks directory but not uploaded files
- Permissions allow web server to read/write

**Estimated Effort**: 10 minutes

---

### Phase 2: Backend API Implementation

#### Task 2.1: Create File Upload Utility Functions
- [ ] Create `src/lib/fileUpload.ts` utility file
- [ ] Implement `validateImageFile(file: File): Promise<ValidationResult>` function
  - Validate MIME type (image/png, image/jpeg, image/webp)
  - Validate file size (max 5MB)
  - Check image dimensions using sharp library
- [ ] Implement `generateUniqueFilename(originalName: string): string` function
  - Use timestamp and UUID for uniqueness
  - Preserve file extension
- [ ] Implement `saveFileToDisk(file: File, path: string): Promise<void>` function
- [ ] Implement `deleteFileFromDisk(path: string): Promise<void>` function
- [ ] Add TypeScript types for all functions
- [ ] Add JSDoc comments

**Acceptance Criteria**:
- All utility functions are pure and testable
- Functions handle errors gracefully
- TypeScript types are correct
- Functions are exported for use in API routes

**Estimated Effort**: 1 hour

---

#### Task 2.2: Create Upload API Endpoint
- [ ] Create `src/app/api/admin/og-image/route.ts` file
- [ ] Implement POST handler for file upload
  - Check admin authentication
  - Extract file from FormData
  - Validate file using utility function
  - Generate unique filename
  - Save file to `/public/uploads/og-images/`
  - Update GlobalSetting.landingPageOgImage in database
  - Return success response with image URL
- [ ] Implement error handling
  - Return 401 for unauthorized
  - Return 400 for validation errors
  - Return 500 for server errors
  - Rollback file if database update fails
- [ ] Add request logging
- [ ] Add response type definitions

**Acceptance Criteria**:
- Endpoint accepts multipart/form-data
- Authentication is enforced
- File validation works correctly
- Atomic transaction (file + database)
- Appropriate HTTP status codes returned
- Error messages are clear

**Estimated Effort**: 1.5 hours

---

#### Task 2.3: Create Delete API Endpoint
- [ ] Add DELETE handler to `src/app/api/admin/og-image/route.ts`
- [ ] Implement delete logic
  - Check admin authentication
  - Fetch current OG image path from database
  - Delete file from disk (handle missing file gracefully)
  - Set GlobalSetting.landingPageOgImage to null
  - Return success response
- [ ] Implement error handling
- [ ] Add request logging

**Acceptance Criteria**:
- Endpoint requires authentication
- File is deleted from disk
- Database is updated to null
- Handles missing file gracefully
- Returns appropriate status codes

**Estimated Effort**: 45 minutes

---

#### Task 2.4: Create Metadata Helper Function
- [ ] Create `src/lib/metadata.ts` utility file
- [ ] Implement `getOGImageForMetadata(): Promise<string>` function
  - Fetch GlobalSetting from database
  - Return custom OG image if exists
  - Return default `/logo.png` if null
  - Handle database errors gracefully
- [ ] Add caching for performance (optional)
- [ ] Add TypeScript types
- [ ] Add JSDoc comments

**Acceptance Criteria**:
- Function always returns valid image URL
- Never returns null or undefined
- Handles database errors gracefully
- Performance is acceptable (< 50ms)

**Estimated Effort**: 30 minutes

---

#### Task 2.5: Update Layout Metadata Generation
- [ ] Modify `src/app/layout.tsx`
- [ ] Update `generateMetadata()` function
  - Import `getOGImageForMetadata` helper
  - Call helper to get OG image URL
  - Use dynamic OG image in OpenGraph metadata
  - Use dynamic OG image in Twitter Card metadata
- [ ] Ensure metadata structure is correct
- [ ] Test with both custom and default images
- [ ] Verify social media preview works

**Acceptance Criteria**:
- Metadata uses custom OG image when set
- Metadata uses default image when not set
- OpenGraph and Twitter Card both updated
- Social media previews show correct image

**Estimated Effort**: 30 minutes

---

### Phase 3: Frontend UI Implementation

#### Task 3.1: Create File Validation Utility (Client-Side)
- [ ] Create `src/lib/clientFileValidation.ts` utility file
- [ ] Implement `validateImageFileClient(file: File): ValidationResult` function
  - Check file type
  - Check file size
  - Return validation result with error message
- [ ] Add TypeScript types
- [ ] Keep validation logic consistent with server-side

**Acceptance Criteria**:
- Validation matches server-side logic
- Error messages are user-friendly
- Function is synchronous for immediate feedback

**Estimated Effort**: 20 minutes

---

#### Task 3.2: Create OGImageUploader Component
- [ ] Create `src/components/admin/OGImageUploader.tsx` component
- [ ] Implement component structure
  - File input with drag-and-drop support
  - Upload button
  - Loading state during upload
  - Error display
  - Success feedback
- [ ] Implement file selection handler
  - Validate file on selection
  - Show validation errors
  - Prepare FormData for upload
- [ ] Implement upload handler
  - Call POST `/api/admin/og-image` endpoint
  - Show loading indicator
  - Handle success response
  - Handle error response
  - Show toast notifications
- [ ] Add TypeScript props interface
- [ ] Style with Tailwind CSS and Shadcn UI components
- [ ] Make component accessible (ARIA labels, keyboard navigation)

**Acceptance Criteria**:
- Component renders correctly
- File selection works (click and drag-and-drop)
- Validation provides immediate feedback
- Upload shows progress/loading state
- Success/error notifications appear
- Component is keyboard accessible

**Estimated Effort**: 2 hours

---

#### Task 3.3: Create ImagePreview Component
- [ ] Create `src/components/admin/ImagePreview.tsx` component
- [ ] Implement component structure
  - Image display with proper aspect ratio
  - Image metadata (dimensions, file size)
  - Delete/Replace button
  - Confirmation dialog for delete
- [ ] Implement delete handler
  - Show confirmation dialog
  - Call DELETE `/api/admin/og-image` endpoint
  - Handle success/error
  - Update parent component state
- [ ] Style with Tailwind CSS
- [ ] Add loading state for delete action
- [ ] Make component accessible

**Acceptance Criteria**:
- Preview displays image correctly
- Metadata is shown clearly
- Delete button works with confirmation
- Component updates after delete
- Accessible to screen readers

**Estimated Effort**: 1.5 hours

---

#### Task 3.4: Integrate Upload UI into Admin Settings
- [ ] Open `src/app/admin/dashboard/page.tsx` (or relevant settings page)
- [ ] Add new section for "Open Graph Image"
- [ ] Import and render `OGImageUploader` component
- [ ] Import and render `ImagePreview` component (conditionally)
- [ ] Fetch current OG image on page load
  - Call GET `/api/admin/settings` endpoint
  - Extract `landingPageOgImage` from response
  - Pass to components as props
- [ ] Handle state updates after upload/delete
- [ ] Add section heading and description
- [ ] Style section to match existing settings UI

**Acceptance Criteria**:
- New section appears in admin settings
- Current OG image is displayed if exists
- Upload component is functional
- Preview component shows after upload
- UI matches existing design patterns

**Estimated Effort**: 1 hour

---

#### Task 3.5: Add Recommended Dimensions Hint
- [ ] Add informational text near upload component
- [ ] Display "Recommended size: 1200x630px for optimal social media display"
- [ ] Style as subtle hint (not error)
- [ ] Add info icon with tooltip (optional)
- [ ] Ensure hint is visible but not intrusive

**Acceptance Criteria**:
- Hint text is visible near upload area
- Text is styled appropriately
- Does not block or distract from main UI

**Estimated Effort**: 15 minutes

---

### Phase 4: Testing

#### Task 4.1: Write Unit Tests for File Upload Utilities
- [ ] Create `src/lib/fileUpload.test.ts` test file
- [ ] Test `validateImageFile()` function
  - Valid PNG file passes
  - Valid JPG file passes
  - Valid WEBP file passes
  - Invalid file type fails
  - Oversized file fails
  - Null file fails
- [ ] Test `generateUniqueFilename()` function
  - Generates unique names
  - Preserves file extension
  - Format is correct
- [ ] Test `saveFileToDisk()` function (mock fs operations)
- [ ] Test `deleteFileFromDisk()` function (mock fs operations)
- [ ] Achieve > 80% code coverage

**Acceptance Criteria**:
- All test cases pass
- Code coverage > 80%
- Tests are isolated and repeatable
- Mock external dependencies

**Estimated Effort**: 1.5 hours

---

#### Task 4.2: Write Unit Tests for API Endpoints
- [ ] Create `src/app/api/admin/og-image/route.test.ts` test file
- [ ] Test POST endpoint
  - Successful upload returns 200
  - Missing file returns 400
  - Invalid file type returns 400
  - Oversized file returns 400
  - Unauthorized request returns 401
  - Database error triggers rollback
- [ ] Test DELETE endpoint
  - Successful delete returns 200
  - Unauthorized request returns 401
  - Missing file handled gracefully
- [ ] Mock database and file system operations
- [ ] Achieve > 80% code coverage

**Acceptance Criteria**:
- All test cases pass
- Code coverage > 80%
- Tests use proper mocks
- Edge cases are covered

**Estimated Effort**: 2 hours

---

#### Task 4.3: Write Unit Tests for Metadata Helper
- [ ] Create `src/lib/metadata.test.ts` test file
- [ ] Test `getOGImageForMetadata()` function
  - Returns custom image when set
  - Returns default image when null
  - Handles database errors
  - Never returns null/undefined
- [ ] Mock Prisma client
- [ ] Achieve > 80% code coverage

**Acceptance Criteria**:
- All test cases pass
- Code coverage > 80%
- Database is properly mocked

**Estimated Effort**: 45 minutes

---

#### Task 4.4: Write Component Tests
- [ ] Create `src/components/admin/OGImageUploader.test.tsx` test file
- [ ] Test OGImageUploader component
  - Renders correctly
  - File selection works
  - Validation errors display
  - Upload triggers API call
  - Success/error states work
- [ ] Create `src/components/admin/ImagePreview.test.tsx` test file
- [ ] Test ImagePreview component
  - Renders image correctly
  - Delete button works
  - Confirmation dialog appears
- [ ] Use React Testing Library
- [ ] Mock API calls

**Acceptance Criteria**:
- All component tests pass
- User interactions are tested
- API calls are mocked
- Accessibility is verified

**Estimated Effort**: 2 hours

---

#### Task 4.5: Write Property-Based Tests
- [ ] Create `src/lib/fileUpload.pbt.test.ts` test file
- [ ] Use fast-check library (already in devDependencies)
- [ ] Test filename uniqueness property
  - For any two inputs, generated filenames are unique
- [ ] Test validation consistency property
  - Same file always produces same validation result
- [ ] Test metadata fallback property
  - Metadata always has valid OG image URL
- [ ] Run property tests with sufficient iterations (100+)

**Acceptance Criteria**:
- Property tests pass with 100+ iterations
- Properties are well-defined
- Tests catch edge cases

**Estimated Effort**: 1 hour

---

#### Task 4.6: Manual Integration Testing
- [ ] Test complete upload flow
  - Log in as admin
  - Navigate to settings
  - Upload valid OG image
  - Verify preview appears
  - Check database for updated value
  - Verify file exists on disk
  - Check metadata in page source
  - Test social media preview (Facebook Debugger, Twitter Card Validator)
- [ ] Test delete flow
  - Delete uploaded image
  - Verify file removed
  - Verify database updated
  - Verify default image used in metadata
- [ ] Test error scenarios
  - Upload invalid file type
  - Upload oversized file
  - Test without authentication
  - Test with network error
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test drag-and-drop functionality
- [ ] Test keyboard navigation

**Acceptance Criteria**:
- All manual test scenarios pass
- No console errors
- UI behaves as expected
- Social media previews work

**Estimated Effort**: 2 hours

---

### Phase 5: Documentation and Deployment

#### Task 5.1: Update API Documentation
- [ ] Document POST `/api/admin/og-image` endpoint
  - Request format (multipart/form-data)
  - Request parameters
  - Response format
  - Error codes
  - Example requests
- [ ] Document DELETE `/api/admin/og-image` endpoint
  - Request format
  - Response format
  - Error codes
- [ ] Add to API documentation file or create new one

**Acceptance Criteria**:
- Endpoints are fully documented
- Examples are provided
- Documentation is clear and accurate

**Estimated Effort**: 30 minutes

---

#### Task 5.2: Update Deployment Documentation
- [ ] Document database migration requirement
  - Add to deployment checklist
  - Provide migration command
- [ ] Document upload directory requirement
  - Ensure directory exists in deployment
  - Document permissions needed
- [ ] Update environment setup guide
- [ ] Add to DEPLOYMENT.md or similar file

**Acceptance Criteria**:
- Deployment steps are documented
- Migration is included in checklist
- Directory setup is explained

**Estimated Effort**: 20 minutes

---

#### Task 5.3: Create User Guide for Admins
- [ ] Write admin user guide for OG image upload
  - How to access settings
  - How to upload image
  - Recommended image specifications
  - How to delete/replace image
  - How to verify social media preview
- [ ] Add screenshots or GIFs (optional)
- [ ] Add to admin documentation

**Acceptance Criteria**:
- Guide is clear and easy to follow
- All steps are documented
- Non-technical language used

**Estimated Effort**: 30 minutes

---

#### Task 5.4: Run Database Migration in Production
- [ ] Backup production database before migration
- [ ] Run `npx prisma migrate deploy` in production
- [ ] Verify migration succeeded
- [ ] Check that GlobalSetting table has new column
- [ ] Verify existing data is intact
- [ ] Monitor for errors

**Acceptance Criteria**:
- Migration runs successfully
- No data loss
- Application continues to function
- New column is available

**Estimated Effort**: 30 minutes (including backup and verification)

---

#### Task 5.5: Deploy Feature to Production
- [ ] Merge feature branch to main
- [ ] Deploy to production environment
- [ ] Verify upload directory exists and is writable
- [ ] Test upload functionality in production
- [ ] Test metadata generation in production
- [ ] Test social media preview with real URLs
- [ ] Monitor logs for errors
- [ ] Verify performance metrics

**Acceptance Criteria**:
- Feature is live in production
- All functionality works as expected
- No errors in production logs
- Performance is acceptable

**Estimated Effort**: 1 hour (including monitoring)

---

### Phase 6: Post-Deployment

#### Task 6.1: Monitor Feature Usage
- [ ] Monitor upload success rate
- [ ] Check error logs for issues
- [ ] Track how many admins use the feature
- [ ] Gather feedback from admin users
- [ ] Monitor performance impact on metadata generation

**Acceptance Criteria**:
- Monitoring is in place
- Metrics are being collected
- Issues are identified and tracked

**Estimated Effort**: Ongoing (30 minutes initial setup)

---

#### Task 6.2: Address Feedback and Bugs
- [ ] Collect user feedback
- [ ] Prioritize bug fixes
- [ ] Implement fixes for critical issues
- [ ] Deploy bug fixes
- [ ] Update documentation if needed

**Acceptance Criteria**:
- Critical bugs are fixed within 48 hours
- User feedback is addressed
- Documentation is updated

**Estimated Effort**: Variable (depends on issues found)

---

## Task Summary

### Total Estimated Effort
- **Phase 1 (Database & Infrastructure)**: 45 minutes
- **Phase 2 (Backend API)**: 4.5 hours
- **Phase 3 (Frontend UI)**: 5.25 hours
- **Phase 4 (Testing)**: 9.25 hours
- **Phase 5 (Documentation & Deployment)**: 2.5 hours
- **Phase 6 (Post-Deployment)**: 30 minutes + ongoing

**Total**: ~22.75 hours (approximately 3 working days)

### Critical Path
1. Database schema update (Task 1.1, 1.2)
2. Backend API implementation (Task 2.1, 2.2, 2.3)
3. Frontend UI implementation (Task 3.1, 3.2, 3.3, 3.4)
4. Integration testing (Task 4.6)
5. Deployment (Task 5.4, 5.5)

### Dependencies
- Task 2.1 must complete before Task 2.2, 2.3
- Task 1.1, 1.2 must complete before Task 2.2
- Task 3.1 must complete before Task 3.2
- Task 3.2, 3.3 must complete before Task 3.4
- All Phase 2 and Phase 3 tasks must complete before Phase 4
- All Phase 4 tasks must complete before Phase 5
- Task 5.4 must complete before Task 5.5

### Risk Mitigation
- **Risk**: Database migration fails in production
  - **Mitigation**: Test migration thoroughly in staging, backup before migration
- **Risk**: File upload fails due to permissions
  - **Mitigation**: Document and verify directory permissions in deployment checklist
- **Risk**: Large files cause timeout
  - **Mitigation**: Enforce 5MB limit, show upload progress
- **Risk**: Security vulnerability in file upload
  - **Mitigation**: Implement thorough validation on both client and server

## Testing Checklist

### Unit Tests
- [ ] File upload utilities (validateImageFile, generateUniqueFilename, etc.)
- [ ] API endpoint handlers (POST, DELETE)
- [ ] Metadata helper function
- [ ] Client-side validation utility

### Component Tests
- [ ] OGImageUploader component
- [ ] ImagePreview component

### Property-Based Tests
- [ ] Filename uniqueness property
- [ ] Validation consistency property
- [ ] Metadata fallback property

### Integration Tests
- [ ] Complete upload flow (manual)
- [ ] Complete delete flow (manual)
- [ ] Error scenarios (manual)
- [ ] Cross-browser testing (manual)
- [ ] Social media preview testing (manual)

### Performance Tests
- [ ] Metadata generation time < 50ms
- [ ] Upload time < 10s for 5MB file
- [ ] Database query time < 10ms

### Security Tests
- [ ] Authentication enforcement
- [ ] File type validation
- [ ] File size validation
- [ ] Path traversal prevention
- [ ] MIME type verification

### Accessibility Tests
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] ARIA labels
- [ ] Color contrast
- [ ] Focus management

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Database migration tested in staging
- [ ] Backup plan prepared

### Deployment
- [ ] Backup production database
- [ ] Run database migration
- [ ] Deploy application code
- [ ] Verify upload directory exists
- [ ] Test basic functionality

### Post-Deployment
- [ ] Monitor error logs
- [ ] Test upload in production
- [ ] Test social media preview
- [ ] Verify performance metrics
- [ ] Notify admin users of new feature

## Success Criteria

### Feature Complete When:
- [ ] All tasks in Phases 1-5 are completed
- [ ] All tests are passing (> 80% coverage)
- [ ] Feature is deployed to production
- [ ] Admin can successfully upload OG image
- [ ] Custom OG image appears in social media previews
- [ ] No critical bugs reported
- [ ] Documentation is complete
- [ ] Performance metrics are acceptable

### Feature Successful When:
- [ ] 80%+ of admins use custom OG image within 30 days
- [ ] Upload success rate > 99%
- [ ] < 5 support tickets in first month
- [ ] Positive feedback from admin users
- [ ] No security vulnerabilities found
