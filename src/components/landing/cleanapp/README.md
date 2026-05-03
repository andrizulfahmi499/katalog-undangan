# CleanApp Theme Components

This directory contains all components for the CleanApp landing page theme.

## Overview

The CleanApp theme is a mobile-first landing page theme with a clean, modern mobile app aesthetic. It provides comprehensive customization capabilities for text, images, and colors.

## Components

### CleanAppLanding (Root Component)

Main landing page component that wraps all CleanApp sections with `CleanAppConfigProvider`.

**Usage:**
```tsx
import { CleanAppLanding } from '@/components/landing/cleanapp'

<CleanAppLanding slug="member-slug" />
```

**Features:**
- Wraps all components with CleanAppConfigProvider
- Handles loading and error states
- Implements mobile-first responsive design
- Provides clean, modern mobile app aesthetic

**Props:**
- `slug?: string` - Optional member slug to fetch configuration for
- `memberId?: string` - Optional member ID to fetch configuration for

### Current Implementation Status

✅ **Completed:**
- CleanAppLanding root component with provider wrapper
- Loading state with spinner
- Error state with retry functionality
- Placeholder components for all sections:
  - CleanAppHero
  - CleanAppFeatures
  - CleanAppTemplateGrid
  - CleanAppPricing
  - CleanAppOrderForm
  - CleanAppFAQ
  - CleanAppFooter
  - CleanAppBottomNav

🚧 **TODO (Future Tasks):**
- Implement full CleanAppHero with login modal (Task 5.1, 5.2)
- Implement CleanAppFeatures with card-based layout (Task 6.1)
- Implement CleanAppTemplateGrid with category filtering (Task 7.1, 7.2, 7.3)
- Implement CleanAppPricing with tier cards (Task 9.1)
- Implement CleanAppOrderForm with validation (Task 10.1)
- Implement CleanAppFAQ with accordion (Task 11.1)
- Implement CleanAppFooter with social links (Task 12.1)
- Implement CleanAppBottomNav with scroll behavior (Task 12.5)

## Architecture

```
CleanAppLanding (Root)
├── CleanAppConfigProvider (Context)
│   └── CleanAppContent
│       ├── CleanAppHero
│       ├── CleanAppFeatures
│       ├── CleanAppTemplateGrid
│       ├── CleanAppPricing
│       ├── CleanAppOrderForm
│       ├── CleanAppFAQ
│       ├── CleanAppFooter
│       └── CleanAppBottomNav
```

## Configuration

The CleanApp theme uses the `CleanAppConfigContext` to provide theme configuration to all components. Configuration is fetched from `/api/public/settings` and includes:

- **Hero**: Title, subtitle, CTA text, images
- **Features**: Feature items with icons, titles, descriptions
- **Pricing**: Pricing tiers with features and CTAs
- **FAQ**: FAQ items with questions and answers
- **Footer**: Footer text, contact info, social media links
- **Colors**: Complete color palette (primary, secondary, accent, backgrounds, text colors)

## Requirements

- Requirements: 1.3 (Theme Selection and Rendering)
- Requirements: 6.1 (Mobile-First Responsive Design)
- Requirements: 16.1, 16.2 (Configuration Context Management)

## Related Files

- `src/context/CleanAppConfigContext.tsx` - Configuration context provider
- `src/lib/schemas/cleanapp-theme.ts` - Type definitions and schemas
- `.kiro/specs/cleanapp-theme/` - Complete specification documents
