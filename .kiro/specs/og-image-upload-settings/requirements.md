# Requirements Document: Open Graph Image Upload for Landing Page Settings

## Feature Overview

Enable administrators to upload custom Open Graph (OG) images for the landing page through the admin settings panel. The custom OG image will be displayed when the landing page is shared on social media platforms, independent of the selected landing page theme.

## Acceptance Criteria

### 1. Database Schema Extension

**Criteria**: The GlobalSetting table must be extended to store the custom OG image path

**Acceptance Tests**:
- [ ] GlobalSetting model includes new optional field `landingPageOgImage` of type String
- [ ] Field can store file paths in format `/uploads/og-images/{filename}`
- [ ] Field is nullable (null indicates use default image)
- [ ] Database migration successfully adds the new field
- [ ] Existing GlobalSetting record is not affected by migration

### 2. File Upload API Endpoint

**Criteria**: A secure API endpoint must handle OG image uploads with proper validation

**Acceptance Tests**:
- [ ] POST `/api/admin/og-image` endpoint accepts multipart/form-data
- [ ] Endpoint requires admin authentication
- [ ] Validates file type (only PNG, JPG, WEBP allowed)
- [ ] Validates file size (maximum 5MB)
- [ ] Generates unique filename using timestamp and UUID
- [ ] Saves file to `/public/uploads/og-images/` directory
- [ ] Updates GlobalSetting.landingPageOgImage in database
- [ ] Returns success response with image URL on success
- [ ] Returns appropriate error codes (400, 401, 500) on failure
- [ ] Implements atomic transaction (rollback file if database update fails)

### 3. File Delete API Endpoint

**Criteria**: An API endpoint must allow deletion of custom OG images

**Acceptance Tests**:
- [ ] DELETE `/api/admin/og-image` endpoint exists
- [ ] Endpoint requires admin authentication
- [ ] Deletes file from file system
- [ ] Sets GlobalSetting.landingPageOgImage to null
- [ ] Returns success response
- [ ] Handles case where file doesn't exist gracefully
- [ ] Does not fail if file already deleted but database still has reference

### 4. Admin UI - Upload Component

**Criteria**: Admin settings panel must include an intuitive OG image upload interface

**Acceptance Tests**:
- [ ] Upload section appears in admin settings panel
- [ ] Section labeled "Open Graph Image" or similar
- [ ] File input accepts image files (PNG, JPG, WEBP)
- [ ] Drag-and-drop functionality works
- [ ] Shows current OG image preview if exists
- [ ] Displays image dimensions and file size
- [ ] Shows recommended dimensions hint (1200x630px)
- [ ] Upload button is clearly visible
- [ ] Loading indicator appears during upload
- [ ] Success toast notification on successful upload
- [ ] Error toast notification on upload failure with clear message

### 5. Admin UI - Image Preview

**Criteria**: Uploaded OG image must be displayed with preview and metadata

**Acceptance Tests**:
- [ ] Preview shows uploaded image with correct aspect ratio
- [ ] Preview displays image dimensions (width x height)
- [ ] Preview shows file size in human-readable format (KB/MB)
- [ ] Delete/Replace button is visible on preview
- [ ] Clicking delete button removes image and shows confirmation
- [ ] After deletion, preview shows default image or placeholder
- [ ] Preview updates immediately after successful upload

### 6. Client-Side Validation

**Criteria**: File validation must occur on client-side before upload

**Acceptance Tests**:
- [ ] Validates file type before upload
- [ ] Shows error if file type is not PNG, JPG, or WEBP
- [ ] Validates file size before upload
- [ ] Shows error if file exceeds 5MB
- [ ] Reads image dimensions and displays warning if below recommended size
- [ ] Validation errors are user-friendly and actionable
- [ ] Validation does not block upload for dimension warnings (only errors)

### 7. Server-Side Validation

**Criteria**: All file validation must be repeated on server-side for security

**Acceptance Tests**:
- [ ] Server validates MIME type matches allowed types
- [ ] Server validates file size is within limit
- [ ] Server rejects requests with missing file
- [ ] Server rejects requests from non-admin users
- [ ] Server sanitizes filename to prevent path traversal
- [ ] Server validates file extension matches MIME type
- [ ] All validation errors return appropriate HTTP status codes

### 8. Metadata Integration

**Criteria**: Next.js layout must dynamically use custom OG image in metadata

**Acceptance Tests**:
- [ ] `generateMetadata()` function fetches OG image from database
- [ ] Custom OG image is used in OpenGraph metadata when set
- [ ] Custom OG image is used in Twitter Card metadata when set
- [ ] Default `/logo.png` is used when no custom image exists
- [ ] Metadata generation never returns null/undefined for OG image
- [ ] OG image URL is absolute (includes domain)
- [ ] Metadata includes correct image dimensions (1200x630)
- [ ] Changes to OG image reflect on next page load

### 9. File Storage Management

**Criteria**: Uploaded files must be stored securely and efficiently

**Acceptance Tests**:
- [ ] Upload directory `/public/uploads/og-images/` is created if not exists
- [ ] Files are saved with unique names (no collisions)
- [ ] Filename format: `og-{timestamp}-{uuid}.{ext}`
- [ ] Files are publicly accessible via URL
- [ ] Old files are deleted when new image is uploaded (cleanup)
- [ ] File permissions are set correctly (readable by web server)
- [ ] Directory structure is maintained consistently

### 10. Error Handling

**Criteria**: All error scenarios must be handled gracefully with clear feedback

**Acceptance Tests**:
- [ ] Invalid file type shows error: "Invalid file type. Only PNG, JPG, WEBP allowed"
- [ ] Oversized file shows error: "File too large. Maximum size is 5MB"
- [ ] Missing file shows error: "No file provided"
- [ ] Unauthorized access shows error: "You don't have permission to perform this action"
- [ ] File system errors show generic error: "Failed to save file. Please try again."
- [ ] Database errors trigger file rollback and show error
- [ ] Network errors during upload show appropriate message
- [ ] All errors are logged server-side for debugging

### 11. Theme Independence

**Criteria**: Custom OG image must work independently of landing page theme selection

**Acceptance Tests**:
- [ ] Custom OG image is used regardless of selected theme (default, neumorphism, cleanapp)
- [ ] Changing theme does not affect OG image setting
- [ ] OG image setting is stored in GlobalSetting, not theme-specific config
- [ ] Theme changes do not reset OG image to default

### 12. Performance

**Criteria**: Feature must not negatively impact page load performance

**Acceptance Tests**:
- [ ] Metadata generation completes in < 100ms
- [ ] Database query for OG image is optimized
- [ ] Image preview in admin panel uses lazy loading
- [ ] Upload progress indicator provides feedback for large files
- [ ] No memory leaks during file upload
- [ ] File upload handles concurrent requests safely

### 13. Security

**Criteria**: Feature must be secure against common vulnerabilities

**Acceptance Tests**:
- [ ] Only admin users can access upload endpoint
- [ ] Path traversal attacks are prevented
- [ ] File type validation prevents malicious file uploads
- [ ] MIME type is verified, not just file extension
- [ ] File size limits prevent DoS attacks
- [ ] Uploaded files cannot execute server-side code
- [ ] CSRF protection is enabled for upload endpoint
- [ ] All file operations are within designated directory

### 14. Accessibility

**Criteria**: Upload interface must be accessible to users with disabilities

**Acceptance Tests**:
- [ ] File input has proper ARIA labels
- [ ] Upload button is keyboard accessible
- [ ] Error messages are announced to screen readers
- [ ] Image preview has descriptive alt text
- [ ] Focus management works correctly during upload flow
- [ ] Color contrast meets WCAG AA standards
- [ ] Upload progress is communicated to assistive technologies

## User Stories

### Story 1: Upload Custom OG Image
**As an** administrator  
**I want to** upload a custom Open Graph image for the landing page  
**So that** our brand image appears when the page is shared on social media

**Acceptance Criteria**:
- Admin can navigate to settings panel
- Admin can select image file from local disk
- Admin can see preview of selected image before upload
- Admin receives confirmation when upload succeeds
- Uploaded image appears in social media previews

### Story 2: Replace Existing OG Image
**As an** administrator  
**I want to** replace the current OG image with a new one  
**So that** I can update the brand image for seasonal campaigns or rebranding

**Acceptance Criteria**:
- Admin can see current OG image in settings
- Admin can click "Replace" or "Upload New" button
- Old image is replaced by new image
- Only one OG image is active at a time

### Story 3: Remove Custom OG Image
**As an** administrator  
**I want to** remove the custom OG image and revert to default  
**So that** I can use the default logo when no custom image is needed

**Acceptance Criteria**:
- Admin can click "Delete" or "Remove" button on current image
- System confirms deletion action
- After deletion, default logo is used in metadata
- Deleted file is removed from server

### Story 4: Validate Image Before Upload
**As an** administrator  
**I want to** receive immediate feedback if my image doesn't meet requirements  
**So that** I don't waste time uploading invalid files

**Acceptance Criteria**:
- System validates file type before upload
- System validates file size before upload
- System shows warning if dimensions are not optimal
- Error messages are clear and actionable

### Story 5: View Upload Progress
**As an** administrator  
**I want to** see upload progress for large image files  
**So that** I know the upload is working and not stuck

**Acceptance Criteria**:
- Progress indicator appears during upload
- Progress percentage or spinner is visible
- Upload can be cancelled if needed
- Success/failure is clearly indicated when complete

## Non-Functional Requirements

### Performance Requirements
- **Upload Speed**: Files up to 5MB should upload in < 10 seconds on standard broadband
- **Metadata Generation**: OG image lookup should add < 50ms to page load time
- **Database Query**: GlobalSetting query should complete in < 10ms
- **Image Preview**: Preview should render in < 500ms after upload

### Scalability Requirements
- **Concurrent Uploads**: System should handle at least 5 concurrent admin uploads
- **Storage**: File storage should support at least 100 OG images (500MB total)
- **Database**: Single GlobalSetting record, no scalability concerns

### Reliability Requirements
- **Upload Success Rate**: 99% success rate for valid files
- **Atomic Transactions**: 100% rollback success on database failures
- **Error Recovery**: System should recover gracefully from all error scenarios

### Security Requirements
- **Authentication**: 100% of upload requests must be authenticated
- **Authorization**: Only admin role can upload OG images
- **File Validation**: 100% of uploads must pass server-side validation
- **Path Security**: Zero path traversal vulnerabilities

### Usability Requirements
- **Upload Time**: Admin should complete upload in < 2 minutes
- **Error Clarity**: All error messages must be understandable by non-technical users
- **Visual Feedback**: All actions must provide immediate visual feedback
- **Accessibility**: Interface must meet WCAG 2.1 Level AA standards

### Maintainability Requirements
- **Code Coverage**: Minimum 80% test coverage for all new code
- **Documentation**: All API endpoints must be documented
- **Error Logging**: All errors must be logged with sufficient context
- **Code Style**: Code must follow existing project conventions

## Technical Constraints

### Technology Stack
- **Framework**: Next.js 16 (existing)
- **Database**: PostgreSQL with Prisma ORM (existing)
- **UI Library**: React 19 with Shadcn UI components (existing)
- **File Storage**: Local file system in `/public/uploads/` directory
- **Image Processing**: Sharp library (already in dependencies)

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **File API**: Must support HTML5 File API for drag-and-drop
- **FormData**: Must support FormData for file uploads

### Infrastructure
- **File System**: Requires writable `/public/uploads/og-images/` directory
- **Permissions**: Web server must have read/write access to upload directory
- **Storage**: Minimum 500MB available disk space for uploads
- **Database**: PostgreSQL 12+ with Prisma schema migrations

### Deployment
- **Environment Variables**: No new environment variables required
- **Migration**: Database migration must run before deployment
- **Rollback**: Feature must support rollback to previous version
- **Zero Downtime**: Deployment should not cause downtime

## Out of Scope

The following items are explicitly **not** included in this feature:

### Not Included
- ❌ Multiple OG images per page or per theme
- ❌ Automatic image optimization or compression
- ❌ Image editing or cropping tools
- ❌ CDN integration for image hosting
- ❌ Virus scanning for uploaded files
- ❌ Image gallery or media library
- ❌ Bulk upload of multiple images
- ❌ Image versioning or history
- ❌ Automatic image generation from templates
- ❌ Social media preview testing tool
- ❌ Analytics for OG image performance
- ❌ A/B testing different OG images

### Future Enhancements (Potential)
- 🔮 Client-side image compression before upload
- 🔮 Automatic image resizing to optimal dimensions
- 🔮 Multiple OG images for different social platforms
- 🔮 OG image preview tool (how it looks on Facebook, Twitter, etc.)
- 🔮 Integration with external image hosting services (Cloudinary, S3)
- 🔮 Scheduled OG image changes (e.g., for campaigns)

## Dependencies and Prerequisites

### Prerequisites
- Admin authentication system must be functional
- GlobalSetting table must exist in database
- Admin settings panel must be accessible
- File system must have writable upload directory

### Dependencies
- Prisma migration for database schema change
- Admin authentication middleware
- File upload handling in Next.js API routes
- Toast notification system (existing)

## Success Metrics

### Adoption Metrics
- **Target**: 80% of admins upload custom OG image within 30 days
- **Measurement**: Track GlobalSetting.landingPageOgImage != null

### Performance Metrics
- **Upload Success Rate**: > 99% for valid files
- **Average Upload Time**: < 5 seconds for typical 2MB image
- **Error Rate**: < 1% of upload attempts

### User Satisfaction Metrics
- **Admin Feedback**: Positive feedback from admin users
- **Support Tickets**: < 5 support tickets related to OG image upload in first month
- **Feature Usage**: Custom OG image used in production

### Technical Metrics
- **Test Coverage**: > 80% code coverage
- **Bug Count**: < 3 bugs reported in first month
- **Performance Impact**: < 50ms added to metadata generation time

## Glossary

- **OG Image**: Open Graph Image - the image displayed when a URL is shared on social media
- **GlobalSetting**: Database table storing application-wide settings
- **MIME Type**: Multipurpose Internet Mail Extensions type - identifies file format
- **FormData**: Web API for constructing key/value pairs representing form fields and files
- **Atomic Transaction**: Database operation that either fully completes or fully rolls back
- **Path Traversal**: Security vulnerability allowing access to files outside intended directory
- **WCAG**: Web Content Accessibility Guidelines - standards for web accessibility
