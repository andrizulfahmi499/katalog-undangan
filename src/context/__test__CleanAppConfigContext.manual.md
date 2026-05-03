# Manual Testing Guide for CleanAppConfigContext

This guide provides manual testing steps to verify the CleanAppConfigContext implementation.

## Prerequisites

1. Ensure the database is set up with Prisma
2. Ensure the API endpoint `/api/public/settings` is running
3. Have at least one member with `landingPageTheme` set to `'cleanapp'`

## Test Cases

### Test 1: Context Initialization with Default Config

**Steps:**
1. Create a test component that uses `CleanAppConfigProvider` without props
2. Use `useCleanAppConfig` hook inside the component
3. Render the component

**Expected Result:**
- Context should initialize with `DEFAULT_CLEANAPP_CONFIG`
- `isLoading` should be `true` initially, then `false` after fetch
- `error` should be `null` if API is working
- `config` should contain valid CleanApp configuration

**Test Code:**
```tsx
import { CleanAppConfigProvider, useCleanAppConfig } from '@/context/CleanAppConfigContext'

function TestComponent() {
  const { config, isLoading, error } = useCleanAppConfig()
  
  return (
    <div>
      <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
      <p>Error: {error || 'None'}</p>
      <p>Hero Title: {config.hero.title}</p>
      <p>Primary Color: {config.colors.primary}</p>
    </div>
  )
}

function App() {
  return (
    <CleanAppConfigProvider>
      <TestComponent />
    </CleanAppConfigProvider>
  )
}
```

### Test 2: Context Initialization with Member Slug

**Steps:**
1. Create a member in the database with a custom slug (e.g., "test-member")
2. Set the member's `landingPageTheme` to `'cleanapp'`
3. Optionally set custom `landingPageConfig`
4. Create a test component with `CleanAppConfigProvider` using the slug
5. Render the component

**Expected Result:**
- Context should fetch configuration for the specific member
- If member has custom config, it should be used
- If member has no custom config, default config should be used
- `isLoading` should transition from `true` to `false`
- `error` should be `null` if member exists

**Test Code:**
```tsx
<CleanAppConfigProvider slug="test-member">
  <TestComponent />
</CleanAppConfigProvider>
```

### Test 3: Context with Initial Config (SSR)

**Steps:**
1. Create a test component with `initialConfig` prop
2. Pass a custom configuration object
3. Render the component

**Expected Result:**
- Context should use the provided initial config
- `isLoading` should be `false` immediately
- No API fetch should occur
- `config` should match the provided initial config

**Test Code:**
```tsx
const customConfig = {
  ...DEFAULT_CLEANAPP_CONFIG,
  hero: {
    ...DEFAULT_CLEANAPP_CONFIG.hero,
    title: 'Custom Title',
  },
}

<CleanAppConfigProvider initialConfig={customConfig}>
  <TestComponent />
</CleanAppConfigProvider>
```

### Test 4: Error Handling

**Steps:**
1. Create a test component with an invalid slug
2. Render the component

**Expected Result:**
- Context should handle the error gracefully
- `error` should contain an error message
- `config` should fall back to `DEFAULT_CLEANAPP_CONFIG`
- Component should not crash

**Test Code:**
```tsx
<CleanAppConfigProvider slug="non-existent-member">
  <TestComponent />
</CleanAppConfigProvider>
```

### Test 5: Refetch Functionality

**Steps:**
1. Create a test component with a refetch button
2. Click the refetch button
3. Observe the loading state and config update

**Expected Result:**
- `isLoading` should become `true` when refetch is called
- API should be called again
- `isLoading` should become `false` after fetch completes
- `config` should be updated with fresh data

**Test Code:**
```tsx
function TestComponent() {
  const { config, isLoading, refetch } = useCleanAppConfig()
  
  return (
    <div>
      <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
      <p>Hero Title: {config.hero.title}</p>
      <button onClick={refetch}>Refetch</button>
    </div>
  )
}
```

### Test 6: Hook Outside Provider

**Steps:**
1. Try to use `useCleanAppConfig` outside of `CleanAppConfigProvider`
2. Observe the error

**Expected Result:**
- Should throw an error: "useCleanAppConfig must be used within a CleanAppConfigProvider"

**Test Code:**
```tsx
function TestComponent() {
  const { config } = useCleanAppConfig() // Should throw error
  return <div>{config.hero.title}</div>
}

// Render without provider
<TestComponent />
```

### Test 7: Safe Hook Outside Provider

**Steps:**
1. Use `useCleanAppConfigSafe` outside of `CleanAppConfigProvider`
2. Observe the behavior

**Expected Result:**
- Should NOT throw an error
- Should return default config
- `isLoading` should be `false`
- `error` should be `null`

**Test Code:**
```tsx
function TestComponent() {
  const { config, isLoading, error } = useCleanAppConfigSafe()
  return (
    <div>
      <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
      <p>Error: {error || 'None'}</p>
      <p>Hero Title: {config.hero.title}</p>
    </div>
  )
}

// Render without provider
<TestComponent />
```

### Test 8: Type Safety

**Steps:**
1. Try to access a non-existent property on `config`
2. Observe TypeScript error

**Expected Result:**
- TypeScript should show an error for non-existent properties
- Autocomplete should work for valid properties

**Test Code:**
```tsx
function TestComponent() {
  const { config } = useCleanAppConfig()
  
  // Should work
  const title = config.hero.title
  
  // Should show TypeScript error
  const invalid = config.nonExistent.property
  
  return <div>{title}</div>
}
```

## Verification Checklist

- [ ] Context initializes correctly with default config
- [ ] Context fetches config for specific member slug
- [ ] Context fetches config for specific member ID
- [ ] Context uses initial config when provided
- [ ] Context handles API errors gracefully
- [ ] Context falls back to default config on error
- [ ] Loading state transitions correctly
- [ ] Refetch functionality works
- [ ] Hook throws error when used outside provider
- [ ] Safe hook returns defaults when used outside provider
- [ ] TypeScript provides type safety for config properties
- [ ] No memory leaks or unnecessary re-renders

## Performance Considerations

1. **Initial Load**: Context should only fetch once on mount
2. **Re-renders**: Context should not cause unnecessary re-renders
3. **Memory**: Context should clean up properly on unmount
4. **Caching**: Consider adding caching for repeated fetches

## Integration with Components

After verifying the context works correctly, test integration with actual CleanApp components:

1. CleanAppHero should access hero config
2. CleanAppFeatures should access features config
3. CleanAppPricing should access pricing config
4. CleanAppFAQ should access FAQ config
5. CleanAppFooter should access footer config
6. All components should access colors config

## Notes

- This is a manual testing guide. Automated tests should be added later.
- Test in different browsers and devices
- Test with different network conditions (slow 3G, offline)
- Test with different member configurations
- Monitor console for errors or warnings
