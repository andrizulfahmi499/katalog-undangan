# Design Document: Invitation Portal SaaS

## Overview

The Invitation Portal SaaS is a full-stack web application enabling users to create, customize, and share digital invitations. The system provides a comprehensive platform with invitation templates, a visual editor with real-time preview, user authentication, dashboard management, and public sharing capabilities.

**Key Design Goals:**
- Provide an intuitive, responsive interface for invitation creation and customization
- Enable real-time preview with minimal latency (< 500ms)
- Support multiple invitation templates with full customization
- Ensure secure authentication and role-based access control
- Optimize image handling with compression and cloud storage
- Track invitation engagement through analytics
- Maintain data integrity and consistency across all operations

**Technology Stack:**
- **Frontend:** Next.js 14+ with React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes with Node.js
- **Database:** PostgreSQL with Prisma ORM
- **Storage:** AWS S3 or Cloudinary for image management
- **Authentication:** NextAuth.js with JWT
- **Real-time Updates:** Debounced state management with React hooks
- **Deployment:** Vercel for frontend, managed PostgreSQL service

---

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Landing Page │  │ Auth Pages   │  │ Dashboard    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Editor       │  │ Preview      │  │ Admin Panel  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    API Layer (Next.js Routes)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Auth API     │  │ Invitations  │  │ Templates    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Images API   │  │ Analytics    │  │ Public API   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Service Layer                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Auth Service │  │ Image Service│  │ Analytics    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │ Invitation   │  │ Template     │                             │
│  │ Service      │  │ Service      │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ PostgreSQL   │  │ AWS S3       │  │ Cache Layer  │           │
│  │ Database     │  │ (Images)     │  │ (Redis)      │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User Registration/Login
    ↓
NextAuth.js Provider
    ↓
JWT Token Generation
    ↓
Session Management
    ↓
Protected Routes & API Endpoints
```

### Data Flow - Invitation Creation and Editing

```
User Action (Text/Color/Image Change)
    ↓
React State Update
    ↓
Debounce (300ms)
    ↓
Real-time Preview Update
    ↓
Auto-save to Database (optional)
    ↓
Confirmation Message
```

---

## Components and Interfaces

### Frontend Components

#### Page Components

1. **Landing Page** (`pages/index.tsx`)
   - Public-facing homepage
   - Feature showcase
   - Call-to-action buttons (Register/Login)
   - No authentication required

2. **Authentication Pages** (`pages/auth/`)
   - `login.tsx` - Login form with email/password
   - `register.tsx` - Registration form with validation
   - `forgot-password.tsx` - Password recovery (optional)

3. **Dashboard** (`pages/dashboard/index.tsx`)
   - User invitation overview
   - Statistics display (total, published, views)
   - Recent invitations list
   - Quick action buttons

4. **Card List** (`pages/invitations/index.tsx`)
   - All user invitations in grid/list view
   - Invitation thumbnails with metadata
   - Filter and sort options
   - Create new invitation button

5. **Editor** (`pages/invitations/[id]/edit.tsx`)
   - Split-screen layout (Control Panel + Preview)
   - Real-time preview updates
   - Save/Publish/Delete actions
   - Responsive design

6. **Preview Mode** (`pages/invitations/[id]/preview.tsx`)
   - Full-screen read-only invitation view
   - Responsive rendering
   - Return to editor button

7. **Public Invitation Viewer** (`pages/invitations/[slug].tsx`)
   - Public-facing invitation display
   - No authentication required
   - Analytics tracking
   - Responsive design

8. **Admin Panel** (`pages/admin/`)
   - `templates/index.tsx` - Template management list
   - `templates/create.tsx` - Create new template
   - `templates/[id]/edit.tsx` - Edit template
   - User management (optional)

#### Layout Components

1. **MainLayout** - Standard layout with header, sidebar, footer
2. **EditorLayout** - Split-screen layout for editor
3. **AdminLayout** - Admin-specific layout with navigation

#### Feature Components

1. **ControlPanel** (`components/editor/ControlPanel.tsx`)
   - Text field editor
   - Font manager
   - Color picker
   - Section manager
   - Image uploader
   - Layout controls
   - **Neumorphism Style:** Soft, embossed buttons with subtle shadows; inset input fields with soft depth

2. **RealTimePreview** (`components/editor/RealTimePreview.tsx`)
   - Live invitation preview
   - Responsive rendering
   - Debounced updates
   - **Neumorphism Style:** Soft background with subtle inset frame effect

3. **TextEditor** (`components/editor/TextEditor.tsx`)
   - Editable text fields
   - Validation
   - Character count
   - **Neumorphism Style:** Inset input fields with soft shadows and smooth focus states

4. **FontManager** (`components/editor/FontManager.tsx`)
   - Font family selector
   - Font size slider
   - Font weight options
   - Text color picker
   - **Neumorphism Style:** Soft toggle switches and sliders with embossed appearance

5. **ColorPicker** (`components/editor/ColorPicker.tsx`)
   - Color palette
   - Custom color input
   - Color preview
   - **Neumorphism Style:** Soft color swatches with subtle inset/outset effects

6. **ImageUploader** (`components/editor/ImageUploader.tsx`)
   - File upload interface
   - Image preview
   - Crop tool
   - Optimization settings
   - **Neumorphism Style:** Soft drop zone with embossed upload button

7. **SectionManager** (`components/editor/SectionManager.tsx`)
   - Section toggle switches
   - Section reordering
   - Add/remove sections
   - Section-specific editors
   - **Neumorphism Style:** Soft toggle switches and drag handles with subtle depth

8. **TemplateSelector** (`components/TemplateSelector.tsx`)
   - Template grid display
   - Template preview
   - Category filtering
   - Template selection
   - **Neumorphism Style:** Soft cards with embossed appearance on hover

9. **InvitationCard** (`components/InvitationCard.tsx`)
   - Invitation thumbnail
   - Metadata display
   - Action buttons (Edit/Delete/Share)
   - **Neumorphism Style:** Soft card with embossed action buttons

10. **ShareDialog** (`components/ShareDialog.tsx`)
    - Share options (Link/WhatsApp/Email)
    - Copy to clipboard
    - Social sharing
    - **Neumorphism Style:** Soft modal with embossed buttons

11. **AnalyticsDashboard** (`components/AnalyticsDashboard.tsx`)
    - View count display
    - Engagement metrics
    - Charts and graphs
    - **Neumorphism Style:** Soft metric cards with inset data displays

#### Reusable UI Components

- **Button** - Primary, secondary, danger variants
- **Input** - Text, email, password, number inputs
- **Select** - Dropdown selector
- **Modal** - Dialog/confirmation modals
- **Toast** - Notification messages
- **Spinner** - Loading indicator
- **Card** - Content container
- **Badge** - Status indicators

### API Endpoints

#### Authentication Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/session
POST   /api/auth/refresh-token
```

#### Invitation Endpoints

```
GET    /api/invitations              - List user invitations
POST   /api/invitations              - Create new invitation
GET    /api/invitations/:id          - Get invitation details
PUT    /api/invitations/:id          - Update invitation
DELETE /api/invitations/:id          - Delete invitation
POST   /api/invitations/:id/publish  - Publish invitation
POST   /api/invitations/:id/unpublish - Unpublish invitation
```

#### Template Endpoints

```
GET    /api/templates                - List active templates
GET    /api/admin/templates          - List all templates (admin only)
POST   /api/admin/templates          - Create template (admin only)
GET    /api/admin/templates/:id      - Get template details (admin only)
PUT    /api/admin/templates/:id      - Update template (admin only)
DELETE /api/admin/templates/:id      - Delete template (admin only)
```

#### Image Endpoints

```
POST   /api/upload                   - Upload image
DELETE /api/images/:id               - Delete image
POST   /api/images/:id/crop          - Crop image
```

#### Analytics Endpoints

```
GET    /api/invitations/:id/analytics - Get invitation analytics
POST   /api/analytics/track          - Track event (internal)
```

#### Public Endpoints

```
GET    /api/public/invitations/:slug - Get published invitation
POST   /api/public/invitations/:slug/track - Track view event
```

---

## Data Models

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
```

#### Invitations Table
```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  content JSONB,
  design_config JSONB,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  published_url VARCHAR(255),
  published_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_slug (slug)
);
```

#### Templates Table
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  design_config JSONB NOT NULL,
  thumbnail_url VARCHAR(255),
  visibility ENUM('active', 'inactive', 'draft') DEFAULT 'active',
  created_by UUID NOT NULL REFERENCES users(id),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  INDEX idx_visibility (visibility),
  INDEX idx_category (category)
);
```

#### Sections Table
```sql
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  section_type VARCHAR(100) NOT NULL,
  content JSONB,
  enabled BOOLEAN DEFAULT true,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_invitation_id (invitation_id)
);
```

#### Images Table
```sql
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255),
  position JSONB,
  size JSONB,
  crop_config JSONB,
  file_size INTEGER,
  mime_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_invitation_id (invitation_id)
);
```

#### Analytics Table
```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  event_type ENUM('view', 'click', 'share') NOT NULL,
  user_agent VARCHAR(500),
  ip_address VARCHAR(45),
  referrer VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_invitation_id (invitation_id),
  INDEX idx_created_at (created_at)
);
```

### TypeScript Interfaces

```typescript
// User
interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Invitation
interface Invitation {
  id: string;
  userId: string;
  templateId?: string;
  title: string;
  slug: string;
  content: Record<string, any>;
  designConfig: DesignConfig;
  status: 'draft' | 'published' | 'archived';
  publishedUrl?: string;
  publishedAt?: Date;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Template
interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  designConfig: DesignConfig;
  thumbnailUrl?: string;
  visibility: 'active' | 'inactive' | 'draft';
  createdBy: string;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Design Configuration
interface DesignConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    sizes: {
      h1: number;
      h2: number;
      body: number;
    };
  };
  layout: {
    spacing: number;
    padding: number;
    maxWidth: number;
  };
  sections: SectionConfig[];
}

// Section Configuration
interface SectionConfig {
  id: string;
  type: string;
  enabled: boolean;
  order: number;
  content: Record<string, any>;
}

// Analytics Event
interface AnalyticsEvent {
  id: string;
  invitationId: string;
  eventType: 'view' | 'click' | 'share';
  userAgent: string;
  ipAddress: string;
  referrer?: string;
  createdAt: Date;
}
```

---

## Error Handling

### Error Categories

1. **Authentication Errors**
   - Invalid credentials (401)
   - Token expired (401)
   - Unauthorized access (403)
   - User not found (404)

2. **Validation Errors**
   - Missing required fields (400)
   - Invalid email format (400)
   - Invalid input data (400)
   - File size exceeded (413)

3. **Resource Errors**
   - Invitation not found (404)
   - Template not found (404)
   - Image not found (404)
   - User not found (404)

4. **Permission Errors**
   - Insufficient permissions (403)
   - Admin access required (403)
   - Resource ownership violation (403)

5. **Server Errors**
   - Database connection error (500)
   - Image upload failure (500)
   - Internal server error (500)

### Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
  };
}
```

### Error Handling Strategy

- **Frontend:** Display user-friendly error messages in toast notifications
- **Backend:** Log errors with context for debugging
- **Database:** Implement transaction rollback on failures
- **Images:** Retry failed uploads with exponential backoff
- **API:** Return appropriate HTTP status codes with error details

---

## Testing Strategy

### Why Property-Based Testing Does Not Apply

This feature is primarily a full-stack SaaS application focused on UI/UX, data management, and integration rather than pure algorithmic logic. Property-based testing is not appropriate because:

1. **UI Rendering** - The invitation editor and preview components render UI based on user input. UI rendering is best tested with snapshot tests and visual regression tests, not property-based tests.

2. **Simple CRUD Operations** - Invitation, template, and image management involve straightforward database operations without complex transformation logic. Example-based unit tests are more appropriate.

3. **Authentication & Authorization** - User authentication flows are deterministic and best tested with specific examples (valid credentials, invalid credentials, expired tokens, etc.).

4. **Image Upload & Storage** - File upload operations are integration-heavy and involve external services (AWS S3). These are best tested with integration tests and mocks, not property-based tests.

5. **API Endpoints** - Most endpoints are simple data retrieval or persistence operations that don't have universal properties that hold across all inputs.

Instead, we use a comprehensive testing strategy combining unit tests, integration tests, and end-to-end tests.

### Unit Testing

**Scope:** Individual functions, components, and services

**Test Categories:**
1. **Authentication Service Tests**
   - User registration validation (email format, password strength)
   - Login credential verification (correct/incorrect passwords)
   - Token generation and validation
   - Session management

2. **Invitation Service Tests**
   - Invitation CRUD operations
   - Status transitions (draft → published → archived)
   - Slug generation and uniqueness
   - Data persistence and retrieval

3. **Template Service Tests**
   - Template CRUD operations
   - Visibility state management (active/inactive/draft)
   - Template application to invitations
   - Usage tracking

4. **Image Service Tests**
   - Image upload and storage
   - Image optimization and compression
   - Crop functionality
   - URL generation

5. **Component Tests**
   - TextEditor input validation and character limits
   - FontManager font selection and size adjustments
   - ColorPicker color selection and format conversion
   - SectionManager toggle functionality
   - ImageUploader file validation and preview

6. **Utility Function Tests**
   - Slug generation (uniqueness, format)
   - URL validation and generation
   - Email validation
   - Color format conversion (hex, rgb, hsl)
   - Date formatting and parsing

**Testing Tools:** Jest, React Testing Library, Vitest

### Integration Testing

**Scope:** API endpoints and service interactions

**Test Scenarios:**
1. **Authentication Flow**
   - Complete registration → login → session management
   - Token refresh and expiration
   - Logout and session cleanup
   - Invalid credentials handling

2. **Invitation Workflow**
   - Create invitation → edit → save → publish → share
   - Template application and customization
   - Image upload and positioning
   - Section management (toggle, add, remove)
   - Invitation deletion with cascade cleanup

3. **Admin Workflow**
   - Template creation → editing → deletion
   - Template visibility management
   - Template usage tracking
   - Admin access control enforcement

4. **Public Access**
   - Published invitation viewing without authentication
   - Analytics tracking (view events)
   - Share functionality (link copy, WhatsApp, email)

5. **Error Handling**
   - Invalid input validation
   - Permission denied scenarios
   - Resource not found scenarios
   - Database error handling

**Testing Tools:** Supertest, Jest, Postman

### End-to-End Testing

**Scope:** Complete user workflows

**Test Scenarios:**
1. **User Registration and First Invitation**
   - Register account with valid email and password
   - Create invitation from template
   - Customize content and design
   - Publish and share invitation

2. **Invitation Management**
   - View all invitations in card list
   - Edit existing invitation
   - Delete invitation with confirmation
   - Archive invitation

3. **Admin Template Management**
   - Create new template with design config
   - Edit template design and properties
   - Manage template visibility
   - Delete template and handle cascade

4. **Recipient Experience**
   - Access published invitation via public URL
   - View invitation on mobile and desktop
   - Interact with invitation elements

**Testing Tools:** Playwright, Cypress, Puppeteer

### Performance Testing

**Metrics:**
- Real-time preview update latency (target: < 500ms)
- Page load time (target: < 2s)
- Image upload and optimization time (target: < 5s)
- API response time (target: < 200ms)
- Database query time (target: < 100ms)

**Tools:** Lighthouse, WebPageTest, k6, Artillery

**Performance Test Scenarios:**
- Load testing with concurrent users
- Image upload with various file sizes
- Database query performance with large datasets
- API endpoint response times under load

### Security Testing

**Areas:**
- SQL injection prevention (Prisma parameterized queries)
- XSS protection (React escaping, input sanitization)
- CSRF token validation
- Authentication bypass attempts
- Authorization enforcement (role-based access)
- File upload validation (type, size, content)
- Sensitive data exposure (password hashing, token expiration)

**Testing Tools:** OWASP ZAP, Burp Suite, manual security review

### Test Coverage Goals

- **Unit Tests:** 80%+ coverage for services and utilities
- **Integration Tests:** All API endpoints covered
- **E2E Tests:** Critical user workflows covered
- **Overall:** 70%+ code coverage

---

## UI Design - Neumorphism Style

### Design Philosophy

Neumorphism (New Skeuomorphism) combines the best of flat design and skeuomorphism, creating a soft, extruded appearance with subtle shadows and highlights. The invitation editor uses neumorphism to create an intuitive, tactile interface that feels natural and inviting.

**Key Neumorphism Principles:**
- Soft, rounded corners (border-radius: 20-30px)
- Subtle shadows (both inset and outset)
- Monochromatic or near-monochromatic color scheme
- Soft, diffused lighting effect
- Embossed and debossed elements
- Smooth transitions and hover states

### Color Palette

**Base Colors:**
- **Background:** #E0E5EC (soft light gray)
- **Primary Surface:** #F0F4F8 (lighter gray for elevated surfaces)
- **Dark Accent:** #A3B1C6 (for shadows and depth)
- **Light Accent:** #FFFFFF (for highlights)
- **Text:** #2D3436 (dark gray for readability)
- **Accent Color:** #6C5CE7 (soft purple for interactive elements)

**Shadow System:**
```css
/* Soft Shadow (Outset) */
box-shadow: 9px 9px 16px #A3B1C6, -9px -9px 16px #FFFFFF;

/* Inset Shadow (Pressed/Input) */
box-shadow: inset 9px 9px 16px #A3B1C6, inset -9px -9px 16px #FFFFFF;

/* Hover State */
box-shadow: 4px 4px 8px #A3B1C6, -4px -4px 8px #FFFFFF;

/* Active/Pressed State */
box-shadow: inset 4px 4px 8px #A3B1C6, inset -4px -4px 8px #FFFFFF;
```

### Editor Layout - Neumorphism Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    Header (Neumorphic)                           │
│  [Logo]  [Title]  [Save] [Preview] [Publish] [Share] [Menu]    │
└─────────────────────────────────────────────────────────────────┘
┌──────────────────────────┬──────────────────────────────────────┐
│                          │                                      │
│   Control Panel          │    Real-Time Preview                 │
│   (Neumorphic)           │    (Neumorphic Frame)                │
│                          │                                      │
│  ┌────────────────────┐  │  ┌──────────────────────────────┐   │
│  │ Text Editor        │  │  │                              │   │
│  │ [Inset Input]      │  │  │   Invitation Preview         │   │
│  │ [Inset Input]      │  │  │   (Soft Background)          │   │
│  └────────────────────┘  │  │                              │   │
│                          │  │                              │   │
│  ┌────────────────────┐  │  │                              │   │
│  │ Font Manager       │  │  │                              │   │
│  │ [Soft Buttons]     │  │  │                              │   │
│  │ [Soft Slider]      │  │  │                              │   │
│  └────────────────────┘  │  └──────────────────────────────┘   │
│                          │                                      │
│  ┌────────────────────┐  │                                      │
│  │ Color Picker       │  │                                      │
│  │ [Soft Swatches]    │  │                                      │
│  └────────────────────┘  │                                      │
│                          │                                      │
│  ┌────────────────────┐  │                                      │
│  │ Section Manager    │  │                                      │
│  │ [Toggle Switches]  │  │                                      │
│  │ [Soft Buttons]     │  │                                      │
│  └────────────────────┘  │                                      │
│                          │                                      │
│  ┌────────────────────┐  │                                      │
│  │ Image Uploader     │  │                                      │
│  │ [Drop Zone]        │  │                                      │
│  │ [Embossed Button]  │  │                                      │
│  └────────────────────┘  │                                      │
│                          │                                      │
└──────────────────────────┴──────────────────────────────────────┘
```

### Component Specifications - Neumorphism

#### 1. Header Component

```css
.header {
  background: linear-gradient(145deg, #E0E5EC, #F0F4F8);
  padding: 20px 30px;
  border-radius: 0;
  box-shadow: 0 8px 16px rgba(163, 177, 198, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  color: #2D3436;
  letter-spacing: -0.5px;
}

.header-actions {
  display: flex;
  gap: 12px;
}
```

#### 2. Control Panel Container

```css
.control-panel {
  background: #E0E5EC;
  padding: 30px;
  border-radius: 30px;
  box-shadow: 9px 9px 16px #A3B1C6, -9px -9px 16px #FFFFFF;
  width: 100%;
  max-width: 380px;
  overflow-y: auto;
  height: calc(100vh - 100px);
}

.control-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #F0F4F8;
  border-radius: 20px;
  box-shadow: inset 6px 6px 12px #A3B1C6, inset -6px -6px 12px #FFFFFF;
}

.control-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
```

#### 3. Input Fields (Neumorphic Inset)

```css
.input-field {
  width: 100%;
  padding: 12px 16px;
  background: #E0E5EC;
  border: none;
  border-radius: 15px;
  box-shadow: inset 4px 4px 8px #A3B1C6, inset -4px -4px 8px #FFFFFF;
  font-size: 14px;
  color: #2D3436;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: all 0.3s ease;
  outline: none;
}

.input-field:focus {
  box-shadow: inset 6px 6px 12px #A3B1C6, inset -6px -6px 12px #FFFFFF;
  color: #6C5CE7;
}

.input-field::placeholder {
  color: #A3B1C6;
}
```

#### 4. Buttons (Neumorphic Embossed)

```css
.btn-primary {
  padding: 12px 24px;
  background: #E0E5EC;
  border: none;
  border-radius: 20px;
  box-shadow: 6px 6px 12px #A3B1C6, -6px -6px 12px #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  color: #2D3436;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.btn-primary:hover {
  box-shadow: 4px 4px 8px #A3B1C6, -4px -4px 8px #FFFFFF;
  transform: translateY(2px);
}

.btn-primary:active {
  box-shadow: inset 4px 4px 8px #A3B1C6, inset -4px -4px 8px #FFFFFF;
  transform: translateY(4px);
}

.btn-accent {
  background: linear-gradient(145deg, #6C5CE7, #7B68EE);
  color: #FFFFFF;
  box-shadow: 6px 6px 12px rgba(108, 92, 231, 0.3), -6px -6px 12px #FFFFFF;
}

.btn-accent:hover {
  box-shadow: 4px 4px 8px rgba(108, 92, 231, 0.4), -4px -4px 8px #FFFFFF;
}

.btn-accent:active {
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.2), inset -4px -4px 8px rgba(255, 255, 255, 0.5);
}
```

#### 5. Toggle Switch (Neumorphic)

```css
.toggle-switch {
  position: relative;
  width: 60px;
  height: 32px;
  background: #E0E5EC;
  border-radius: 16px;
  box-shadow: inset 3px 3px 6px #A3B1C6, inset -3px -3px 6px #FFFFFF;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-switch.active {
  background: linear-gradient(145deg, #6C5CE7, #7B68EE);
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.2), inset -3px -3px 6px rgba(255, 255, 255, 0.3);
}

.toggle-switch::after {
  content: '';
  position: absolute;
  width: 26px;
  height: 26px;
  background: #F0F4F8;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  box-shadow: 3px 3px 6px #A3B1C6, -3px -3px 6px #FFFFFF;
  transition: all 0.3s ease;
}

.toggle-switch.active::after {
  left: 31px;
  background: #FFFFFF;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.5);
}
```

#### 6. Slider (Neumorphic)

```css
.slider {
  width: 100%;
  height: 8px;
  background: #E0E5EC;
  border-radius: 4px;
  box-shadow: inset 2px 2px 4px #A3B1C6, inset -2px -2px 4px #FFFFFF;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: #E0E5EC;
  border-radius: 50%;
  box-shadow: 4px 4px 8px #A3B1C6, -4px -4px 8px #FFFFFF;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider::-webkit-slider-thumb:hover {
  box-shadow: 3px 3px 6px #A3B1C6, -3px -3px 6px #FFFFFF;
  transform: scale(1.1);
}

.slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: #E0E5EC;
  border-radius: 50%;
  box-shadow: 4px 4px 8px #A3B1C6, -4px -4px 8px #FFFFFF;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}
```

#### 7. Color Picker Swatches (Neumorphic)

```css
.color-swatch {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  box-shadow: 4px 4px 8px #A3B1C6, -4px -4px 8px #FFFFFF;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid transparent;
}

.color-swatch:hover {
  box-shadow: 3px 3px 6px #A3B1C6, -3px -3px 6px #FFFFFF;
  transform: scale(1.05);
}

.color-swatch.active {
  border-color: #6C5CE7;
  box-shadow: inset 3px 3px 6px #A3B1C6, inset -3px -3px 6px #FFFFFF, 0 0 0 3px #6C5CE7;
}
```

#### 8. Real-Time Preview Container

```css
.preview-container {
  background: #E0E5EC;
  border-radius: 30px;
  padding: 30px;
  box-shadow: 9px 9px 16px #A3B1C6, -9px -9px 16px #FFFFFF;
  height: calc(100vh - 100px);
  overflow-y: auto;
}

.preview-frame {
  background: #F0F4F8;
  border-radius: 20px;
  padding: 20px;
  box-shadow: inset 6px 6px 12px #A3B1C6, inset -6px -6px 12px #FFFFFF;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-content {
  width: 100%;
  max-width: 400px;
  background: #FFFFFF;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.2), -6px -6px 12px rgba(255, 255, 255, 0.8);
}
```

#### 9. Section Manager (Neumorphic)

```css
.section-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #E0E5EC;
  border-radius: 15px;
  margin-bottom: 8px;
  box-shadow: 3px 3px 6px #A3B1C6, -3px -3px 6px #FFFFFF;
}

.section-label {
  font-size: 14px;
  font-weight: 500;
  color: #2D3436;
}

.section-actions {
  display: flex;
  gap: 8px;
}

.section-btn {
  width: 32px;
  height: 32px;
  background: #E0E5EC;
  border: none;
  border-radius: 10px;
  box-shadow: 3px 3px 6px #A3B1C6, -3px -3px 6px #FFFFFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2D3436;
  transition: all 0.3s ease;
}

.section-btn:hover {
  box-shadow: 2px 2px 4px #A3B1C6, -2px -2px 4px #FFFFFF;
}

.section-btn:active {
  box-shadow: inset 2px 2px 4px #A3B1C6, inset -2px -2px 4px #FFFFFF;
}
```

#### 10. Image Upload Drop Zone (Neumorphic)

```css
.upload-zone {
  border: 2px dashed #A3B1C6;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  background: #F0F4F8;
  box-shadow: inset 4px 4px 8px #A3B1C6, inset -4px -4px 8px #FFFFFF;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-zone:hover {
  border-color: #6C5CE7;
  background: linear-gradient(145deg, #F0F4F8, #E8EEF5);
}

.upload-zone.dragover {
  background: linear-gradient(145deg, #E8EEF5, #F0F4F8);
  box-shadow: inset 6px 6px 12px #A3B1C6, inset -6px -6px 12px #FFFFFF;
}

.upload-icon {
  font-size: 32px;
  color: #6C5CE7;
  margin-bottom: 12px;
}

.upload-text {
  font-size: 14px;
  color: #2D3436;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 12px;
  color: #A3B1C6;
}
```

### Responsive Design - Neumorphism

**Desktop (1024px+):**
- Split-screen layout with 35% control panel, 65% preview
- Full-size buttons and controls
- Hover effects enabled

**Tablet (768px - 1023px):**
- Stacked layout with tabs (Control Panel / Preview)
- Slightly smaller padding and margins
- Touch-friendly button sizes (min 44px)

**Mobile (< 768px):**
- Full-width stacked layout
- Collapsible control panel
- Bottom sheet for additional options
- Touch-optimized spacing and sizes

### Animation and Transitions - Neumorphism

```css
/* Smooth transitions for all interactive elements */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Button press animation */
@keyframes buttonPress {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(2px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Hover lift animation */
@keyframes hoverLift {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-2px);
  }
}

.btn-primary:hover {
  animation: hoverLift 0.3s ease;
}

.btn-primary:active {
  animation: buttonPress 0.2s ease;
}
```

### Accessibility - Neumorphism

**Color Contrast:**
- Text (#2D3436) on background (#E0E5EC): 11.5:1 ratio ✓
- Accent color (#6C5CE7) on background: 5.2:1 ratio ✓
- All text meets WCAG AA standards

**Focus States:**
- Clear focus indicators with 2px outline
- Focus color: #6C5CE7
- Visible on all interactive elements

**Keyboard Navigation:**
- Tab order follows visual hierarchy
- Enter/Space to activate buttons
- Arrow keys for sliders and selectors

---

## Implementation Details

### Frontend Implementation

#### State Management

```typescript
// Using React Context + Hooks for simplicity
// For larger scale, consider Redux or Zustand

interface EditorState {
  invitationId: string;
  title: string;
  content: Record<string, any>;
  designConfig: DesignConfig;
  sections: SectionConfig[];
  isDirty: boolean;
  isSaving: boolean;
}

// Custom hook for editor state
const useEditorState = (invitationId: string) => {
  const [state, setState] = useState<EditorState>({...});
  const [debouncedSave] = useDebouncedCallback(
    async (newState) => {
      await saveInvitation(newState);
    },
    300
  );
  
  return { state, setState, debouncedSave };
};
```

#### Real-Time Preview Implementation

```typescript
// Debounced preview updates
const RealTimePreview = ({ invitation, isDirty }) => {
  const [preview, setPreview] = useState(invitation);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreview(invitation);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [invitation]);
  
  return <InvitationRenderer data={preview} />;
};
```

#### Image Optimization

```typescript
// Image compression before upload
const optimizeImage = async (file: File): Promise<Blob> => {
  const canvas = await createCanvas(file);
  const compressed = await compressImage(canvas, {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.8,
  });
  return compressed;
};
```

### Backend Implementation

#### Authentication Middleware

```typescript
// NextAuth.js configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (user && await verifyPassword(credentials.password, user.passwordHash)) {
          return { id: user.id, email: user.email, role: user.role };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
};
```

#### API Route Protection

```typescript
// Middleware for protected routes
export const withAuth = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    return handler(req, res);
  };
};

// Middleware for admin-only routes
export const withAdminAuth = (handler: NextApiHandler) => {
  return withAuth(async (req, res) => {
    const session = await getSession({ req });
    
    if (session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    return handler(req, res);
  });
};
```

#### Image Upload Handler

```typescript
// API route for image upload
export default withAuth(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const file = req.files.image;
  
  // Validate file
  if (!isValidImageFile(file)) {
    return res.status(400).json({ error: 'Invalid file' });
  }
  
  // Optimize image
  const optimized = await optimizeImage(file);
  
  // Upload to S3
  const url = await uploadToS3(optimized);
  
  // Save to database
  const image = await db.image.create({
    data: {
      url,
      invitationId: req.body.invitationId,
      mimeType: file.mimetype,
      fileSize: optimized.size,
    },
  });
  
  return res.status(200).json(image);
});
```

#### Caching Strategy

```typescript
// Cache templates in memory with TTL
const templateCache = new Map<string, { data: Template; expiry: number }>();

const getTemplates = async (forceRefresh = false) => {
  if (!forceRefresh && templateCache.has('all')) {
    const cached = templateCache.get('all');
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
  }
  
  const templates = await db.template.findMany({
    where: { visibility: 'active' },
  });
  
  templateCache.set('all', {
    data: templates,
    expiry: Date.now() + 3600000, // 1 hour TTL
  });
  
  return templates;
};
```

### Database Optimization

1. **Indexing Strategy**
   - Index on `users.email` for login queries
   - Index on `invitations.user_id` for user's invitations
   - Index on `invitations.slug` for public access
   - Index on `templates.visibility` for template listing
   - Index on `analytics.created_at` for time-range queries

2. **Query Optimization**
   - Use SELECT specific columns instead of SELECT *
   - Implement pagination for list endpoints
   - Use database-level filtering and sorting
   - Batch operations where possible

3. **Connection Pooling**
   - Configure Prisma connection pool
   - Set appropriate pool size based on load
   - Implement connection timeout handling

---

## Deployment and DevOps

### Environment Configuration

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/invitation_portal

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://yourdomain.com

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1

# Analytics (optional)
ANALYTICS_API_KEY=your-analytics-key
```

### Deployment Steps

1. **Database Setup**
   - Create PostgreSQL database
   - Run Prisma migrations
   - Seed initial templates

2. **Frontend Deployment**
   - Deploy to Vercel
   - Configure environment variables
   - Set up custom domain

3. **Backend Deployment**
   - Deploy API routes with frontend
   - Configure CORS settings
   - Set up error logging

4. **Storage Setup**
   - Create S3 bucket
   - Configure CORS for image uploads
   - Set up CloudFront CDN (optional)

### Monitoring and Logging

- **Application Logging:** Winston or Pino
- **Error Tracking:** Sentry
- **Performance Monitoring:** Vercel Analytics
- **Database Monitoring:** PostgreSQL native tools
- **Uptime Monitoring:** Uptime Robot or similar

---

## Security Considerations

1. **Authentication & Authorization**
   - Use bcrypt for password hashing
   - Implement JWT with expiration
   - Enforce HTTPS only
   - Implement rate limiting on auth endpoints

2. **Data Protection**
   - Encrypt sensitive data at rest
   - Use HTTPS for all communications
   - Implement CORS properly
   - Validate and sanitize all inputs

3. **File Upload Security**
   - Validate file types and sizes
   - Scan uploads for malware
   - Store files outside web root
   - Generate random filenames

4. **API Security**
   - Implement request validation
   - Use CSRF tokens for state-changing operations
   - Implement rate limiting
   - Log security events

5. **Database Security**
   - Use parameterized queries (Prisma handles this)
   - Implement row-level security if needed
   - Regular backups
   - Encryption for sensitive columns



---

## Design Decisions and Rationale

### 1. Technology Stack Selection

**Decision:** Next.js with React, TypeScript, PostgreSQL, and AWS S3

**Rationale:**
- **Next.js:** Provides full-stack capabilities with API routes, reducing complexity of separate frontend/backend
- **React:** Rich component ecosystem and strong community support for UI-heavy applications
- **TypeScript:** Improves code quality and catches errors at compile time
- **PostgreSQL:** Robust relational database with strong ACID guarantees for data integrity
- **AWS S3:** Scalable, reliable cloud storage with CDN integration for image delivery

### 2. Real-Time Preview with Debouncing

**Decision:** Implement 300ms debounce for preview updates

**Rationale:**
- Prevents excessive re-renders and improves performance
- Provides responsive feedback without overwhelming the system
- Balances UX (immediate feedback) with performance (avoiding lag)

### 3. Authentication Strategy

**Decision:** Use NextAuth.js with JWT tokens

**Rationale:**
- Simplifies authentication implementation
- Provides built-in session management
- Supports multiple authentication providers for future expansion
- Secure token-based authentication for API endpoints

### 4. Image Optimization

**Decision:** Compress and resize images before upload

**Rationale:**
- Reduces storage costs and bandwidth usage
- Improves page load times for recipients
- Maintains image quality with smart compression
- Prevents storage quota issues

### 5. Role-Based Access Control

**Decision:** Implement simple two-role system (User, Admin)

**Rationale:**
- Sufficient for current requirements
- Easy to extend with additional roles if needed
- Clear separation of concerns between users and admins
- Middleware-based enforcement for security

### 6. Database Schema Design

**Decision:** Normalized schema with proper foreign keys and indexes

**Rationale:**
- Ensures data integrity through referential constraints
- Optimizes query performance with strategic indexing
- Supports efficient cascade operations (e.g., delete invitation → delete sections)
- Allows for future analytics and reporting

### 7. Caching Strategy

**Decision:** In-memory cache for templates with 1-hour TTL

**Rationale:**
- Reduces database load for frequently accessed templates
- Improves response time for template listing
- Simple implementation without external cache service
- Can be upgraded to Redis if needed

### 8. Error Handling Approach

**Decision:** Structured error responses with specific error codes

**Rationale:**
- Enables frontend to handle different error types appropriately
- Provides clear error messages to users
- Facilitates debugging and monitoring
- Supports internationalization of error messages

---

## Future Enhancements

### Phase 2 Features

1. **Collaborative Editing**
   - Real-time collaboration with multiple users
   - WebSocket-based updates
   - Conflict resolution

2. **Advanced Analytics**
   - Detailed engagement metrics
   - Heatmaps and interaction tracking
   - Export analytics reports

3. **Email Integration**
   - Send invitations directly via email
   - Email templates
   - Delivery tracking

4. **Payment Integration**
   - Subscription plans
   - Premium templates
   - Usage-based pricing

5. **Mobile App**
   - Native iOS/Android apps
   - Offline editing capabilities
   - Push notifications

### Technical Debt and Improvements

1. **Performance Optimization**
   - Implement Redis caching for frequently accessed data
   - Add CDN for static assets
   - Optimize database queries with query analysis

2. **Scalability**
   - Implement horizontal scaling for API servers
   - Database replication and read replicas
   - Message queue for async operations

3. **Monitoring and Observability**
   - Implement distributed tracing
   - Enhanced logging and metrics
   - Real-time alerting

4. **Testing**
   - Increase test coverage to 90%+
   - Add performance benchmarks
   - Implement chaos engineering tests

---

## Appendix: Component Hierarchy

```
App
├── Layout
│   ├── Header
│   ├── Sidebar
│   └── Footer
├── Pages
│   ├── Landing
│   ├── Auth
│   │   ├── Login
│   │   └── Register
│   ├── Dashboard
│   ├── Invitations
│   │   ├── List (CardList)
│   │   ├── Editor
│   │   │   ├── ControlPanel
│   │   │   │   ├── TextEditor
│   │   │   │   ├── FontManager
│   │   │   │   ├── ColorPicker
│   │   │   │   ├── ImageUploader
│   │   │   │   ├── SectionManager
│   │   │   │   └── LayoutManager
│   │   │   └── RealTimePreview
│   │   ├── Preview
│   │   └── PublicViewer
│   └── Admin
│       └── Templates
│           ├── List
│           ├── Create
│           └── Edit
└── Components
    ├── UI
    │   ├── Button
    │   ├── Input
    │   ├── Modal
    │   ├── Toast
    │   └── ...
    ├── Shared
    │   ├── InvitationCard
    │   ├── ShareDialog
    │   ├── AnalyticsDashboard
    │   └── ...
    └── Renderers
        ├── InvitationRenderer
        ├── TemplateRenderer
        └── ...
```

---

## Appendix: API Response Examples

### Create Invitation Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "templateId": "550e8400-e29b-41d4-a716-446655440002",
  "title": "John & Jane Wedding",
  "slug": "john-jane-wedding-2024",
  "status": "draft",
  "content": {
    "groom": "John Doe",
    "bride": "Jane Smith",
    "date": "2024-06-15",
    "location": "Grand Ballroom, City"
  },
  "designConfig": {
    "colors": {
      "primary": "#D4AF37",
      "secondary": "#F5F5DC",
      "background": "#FFFAF0",
      "text": "#333333"
    },
    "fonts": {
      "heading": "Playfair Display",
      "body": "Lato",
      "sizes": {
        "h1": 48,
        "h2": 32,
        "body": 16
      }
    }
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Publish Invitation Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "published",
  "publishedUrl": "https://invitations.example.com/john-jane-wedding-2024",
  "publishedAt": "2024-01-15T11:00:00Z",
  "shareLinks": {
    "direct": "https://invitations.example.com/john-jane-wedding-2024",
    "whatsapp": "https://wa.me/?text=Check%20out%20my%20invitation%3A%20https%3A%2F%2Finvitations.example.com%2Fjohn-jane-wedding-2024",
    "email": "mailto:?subject=You%27re%20Invited&body=Check%20out%20my%20invitation%3A%20https%3A%2F%2Finvitations.example.com%2Fjohn-jane-wedding-2024"
  }
}
```

### Analytics Response

```json
{
  "invitationId": "550e8400-e29b-41d4-a716-446655440000",
  "totalViews": 245,
  "uniqueVisitors": 189,
  "viewsByDate": [
    {
      "date": "2024-01-15",
      "views": 45
    },
    {
      "date": "2024-01-16",
      "views": 78
    }
  ],
  "topReferrers": [
    {
      "referrer": "whatsapp",
      "views": 120
    },
    {
      "referrer": "direct",
      "views": 89
    }
  ],
  "deviceBreakdown": {
    "mobile": 156,
    "desktop": 89
  }
}
```

---

## Appendix: Database Migration Example

```sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Create templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  design_config JSONB NOT NULL,
  thumbnail_url VARCHAR(255),
  visibility VARCHAR(50) DEFAULT 'active',
  created_by UUID NOT NULL REFERENCES users(id),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_templates_visibility ON templates(visibility);
CREATE INDEX idx_templates_category ON templates(category);

-- Create invitations table
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  content JSONB,
  design_config JSONB,
  status VARCHAR(50) DEFAULT 'draft',
  published_url VARCHAR(255),
  published_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_invitations_user_id ON invitations(user_id);
CREATE INDEX idx_invitations_slug ON invitations(slug);

-- Create sections table
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  section_type VARCHAR(100) NOT NULL,
  content JSONB,
  enabled BOOLEAN DEFAULT true,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sections_invitation_id ON sections(invitation_id);

-- Create images table
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255),
  position JSONB,
  size JSONB,
  crop_config JSONB,
  file_size INTEGER,
  mime_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_images_invitation_id ON images(invitation_id);

-- Create analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  user_agent VARCHAR(500),
  ip_address VARCHAR(45),
  referrer VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_invitation_id ON analytics(invitation_id);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);
```

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-01-15 | Design Team | Initial design document |

---

**Design Document Status:** Ready for Review

**Next Steps:**
1. Review design with stakeholders
2. Gather feedback on architecture and component design
3. Proceed to task creation phase
4. Begin implementation of Phase 1 features
