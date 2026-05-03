# CleanApp Theme Type Definitions

This directory contains Zod schemas and TypeScript type definitions for the CleanApp landing page theme.

## Overview

The CleanApp theme provides a comprehensive type system for theme configuration, ensuring type-safe access to all configuration properties across components and API endpoints.

## Files

- **`cleanapp-theme.ts`** - Main schema and type definitions file
- **`cleanapp-theme.example.ts`** - Usage examples and helper functions

## Available Types

### Core Configuration Type

- **`CleanAppThemeConfig`** - Complete theme configuration containing all sections

### Section Types

- **`HeroConfig`** - Hero section with title, subtitle, CTA, and images
- **`FeaturesConfig`** - Features section with 3-6 feature items
- **`PricingConfig`** - Pricing section with pricing tiers
- **`FAQConfig`** - FAQ section with 3-10 FAQ items
- **`FooterConfig`** - Footer section with contact info and social links
- **`ColorPalette`** - Color palette with all customizable colors

### Item Types

- **`FeatureItem`** - Individual feature with icon, title, and description
- **`PricingTier`** - Individual pricing tier with name, price, features, and CTA
- **`FAQItem`** - Individual FAQ with question and answer
- **`SocialMedia`** - Social media links configuration

## Usage

### Importing Types

```typescript
import type {
  CleanAppThemeConfig,
  HeroConfig,
  FeaturesConfig,
  ColorPalette,
} from '@/lib/schemas/cleanapp-theme'
```

### Using in Components

```typescript
import type { HeroConfig } from '@/lib/schemas/cleanapp-theme'

interface HeroProps {
  config: HeroConfig
}

export function Hero({ config }: HeroProps) {
  return (
    <section>
      <h1>{config.title}</h1>
      {config.subtitle && <p>{config.subtitle}</p>}
      <button>{config.ctaText}</button>
    </section>
  )
}
```

### Using in API Endpoints

```typescript
import { CleanAppThemeConfigSchema } from '@/lib/schemas/cleanapp-theme'
import type { CleanAppThemeConfig } from '@/lib/schemas/cleanapp-theme'

export async function POST(request: Request) {
  const body = await request.json()
  
  // Validate with Zod schema
  const result = CleanAppThemeConfigSchema.safeParse(body.config)
  
  if (!result.success) {
    return Response.json({ error: result.error }, { status: 400 })
  }
  
  // Use validated config with type safety
  const config: CleanAppThemeConfig = result.data
  // ...
}
```

### Using with React Context

```typescript
import { createContext, useContext } from 'react'
import type { CleanAppThemeConfig } from '@/lib/schemas/cleanapp-theme'

interface CleanAppConfigContextType {
  config: CleanAppThemeConfig | null
  loading: boolean
  error: Error | null
}

const CleanAppConfigContext = createContext<CleanAppConfigContextType | null>(null)

export function useCleanAppConfig() {
  const context = useContext(CleanAppConfigContext)
  if (!context) {
    throw new Error('useCleanAppConfig must be used within CleanAppConfigProvider')
  }
  return context
}
```

## Validation

All types are backed by Zod schemas that provide runtime validation:

- **Hero title**: Required, max 200 characters
- **Feature items**: 3-6 items required
- **Pricing tiers**: 1-5 tiers allowed
- **FAQ items**: 3-10 items required
- **Colors**: Must be valid hex colors (e.g., #FF5733 or #F57)
- **URLs**: Must be valid URLs or empty strings

## Default Configuration

A default configuration is provided in `DEFAULT_CLEANAPP_CONFIG`:

```typescript
import { DEFAULT_CLEANAPP_CONFIG } from '@/lib/schemas/cleanapp-theme'

// Use as fallback when no custom config exists
const config = member.landingPageConfig || DEFAULT_CLEANAPP_CONFIG
```

## Examples

See `cleanapp-theme.example.ts` for comprehensive usage examples including:

- Creating configuration objects
- Using types in React components
- API handler implementations
- Type guards and helper functions
- Partial configuration updates

## Requirements

This type system satisfies:

- **Requirement 16.5**: Type-safe access to configuration properties
- **Requirement 2.2**: Configuration structure validation
- **Requirement 16.3**: Context data propagation to components

## Related Files

- API Endpoints:
  - `src/app/api/admin/theme-config/route.ts` - Admin configuration API
  - `src/app/api/public/settings/route.ts` - Public settings API
- Context (to be implemented):
  - `src/context/CleanAppConfigContext.tsx` - React context provider
- Components (to be implemented):
  - `src/components/landing/cleanapp/*` - Theme components
