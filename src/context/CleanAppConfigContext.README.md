# CleanAppConfigContext

React context provider for managing CleanApp theme configuration state.

## Overview

The `CleanAppConfigContext` provides a centralized way to manage and access CleanApp theme configuration throughout the application. It handles:

- Fetching configuration from the `/api/public/settings` endpoint
- Loading and error state management
- Type-safe access to all configuration properties
- Default configuration fallback
- Configuration refetching

## Requirements

This implementation satisfies the following requirements:

- **16.1**: Provides CleanApp_Config_Context for managing theme configuration state
- **16.2**: Initializes context with configuration data from the API
- **16.3**: Provides configuration data to all child Theme_Components
- **16.4**: Handles loading states and error states appropriately
- **16.5**: Provides type-safe access to configuration properties

## Usage

### Basic Usage

```tsx
import { CleanAppConfigProvider, useCleanAppConfig } from '@/context/CleanAppConfigContext'

function MyComponent() {
  const { config, isLoading, error } = useCleanAppConfig()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div style={{ color: config.colors.primary }}>
      <h1>{config.hero.title}</h1>
    </div>
  )
}

function App() {
  return (
    <CleanAppConfigProvider>
      <MyComponent />
    </CleanAppConfigProvider>
  )
}
```

### With Member Slug

```tsx
<CleanAppConfigProvider slug="john-doe">
  <CleanAppLanding />
</CleanAppConfigProvider>
```

### With Member ID

```tsx
<CleanAppConfigProvider memberId="123">
  <CleanAppLanding />
</CleanAppConfigProvider>
```

### With Initial Config (SSR)

```tsx
// In a server component
const initialConfig = await fetchConfig()

// Pass to client component
<CleanAppConfigProvider initialConfig={initialConfig}>
  <CleanAppLanding />
</CleanAppConfigProvider>
```

### Refetching Configuration

```tsx
function RefreshButton() {
  const { refetch, isLoading } = useCleanAppConfig()

  return (
    <button onClick={refetch} disabled={isLoading}>
      Refresh
    </button>
  )
}
```

## API Reference

### CleanAppConfigProvider

Provider component that manages configuration state.

**Props:**

- `children: ReactNode` - Child components
- `slug?: string` - Optional member slug to fetch configuration for
- `memberId?: string` - Optional member ID to fetch configuration for
- `initialConfig?: CleanAppThemeConfig` - Optional initial configuration

### useCleanAppConfig

Hook to access configuration from context. Must be used within a `CleanAppConfigProvider`.

**Returns:**

```typescript
{
  config: CleanAppThemeConfig,
  isLoading: boolean,
  error: string | null,
  refetch: () => Promise<void>
}
```

**Throws:** Error if used outside of `CleanAppConfigProvider`

### useCleanAppConfigSafe

Safe version of `useCleanAppConfig` that returns default values if used outside provider.

**Returns:** Same as `useCleanAppConfig` but never throws

## Configuration Structure

The configuration object follows the `CleanAppThemeConfig` type:

```typescript
{
  hero: {
    title: string
    subtitle?: string
    ctaText: string
    backgroundImage?: string
    heroImage?: string
  },
  features: {
    title?: string
    items: Array<{
      icon: string
      title: string
      description: string
    }>
  },
  pricing: {
    title?: string
    tiers: Array<{
      name: string
      price: string
      features: string[]
      ctaText: string
      recommended?: boolean
    }>
  },
  faq: {
    title?: string
    items: Array<{
      question: string
      answer: string
    }>
  },
  footer: {
    text?: string
    contactEmail?: string
    contactPhone?: string
    socialMedia?: {
      facebook?: string
      instagram?: string
      twitter?: string
      whatsapp?: string
    }
  },
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    backgroundSecondary?: string
    textPrimary: string
    textSecondary: string
  }
}
```

## Error Handling

The context handles errors gracefully:

1. If the API request fails, the error is stored in the `error` state
2. The configuration falls back to `DEFAULT_CLEANAPP_CONFIG`
3. Components can check the `error` state and display appropriate messages

## Loading States

The context provides loading state management:

1. `isLoading` is `true` during initial fetch
2. `isLoading` is `true` during refetch
3. Components can show loading indicators based on this state

## Default Configuration

If no custom configuration is found or if an error occurs, the context uses `DEFAULT_CLEANAPP_CONFIG` from `@/lib/schemas/cleanapp-theme`.

## Testing

See `__example__CleanAppConfigUsage.tsx` for usage examples.

## Related Files

- `src/lib/schemas/cleanapp-theme.ts` - Type definitions and schemas
- `src/app/api/public/settings/route.ts` - API endpoint
- `src/context/__example__CleanAppConfigUsage.tsx` - Usage examples
