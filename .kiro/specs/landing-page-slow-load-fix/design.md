# Landing Page Slow Load Fix - Bugfix Design

## Overview

The landing page experiences significant delay when accessed with an active internet connection due to a blocking database query in the `generateMetadata()` function. The function calls `await getFavicon()` which performs a synchronous database query to fetch a custom favicon, blocking the entire metadata generation and delaying Time to First Byte (TTFB). The fix removes this blocking database call and uses a static default favicon instead, ensuring fast page load times regardless of database response time.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when the landing page is accessed with an active internet connection and `generateMetadata()` executes the blocking `await getFavicon()` database query
- **Property (P)**: The desired behavior - metadata should be generated synchronously without database queries, using a static default favicon
- **Preservation**: All other metadata fields (title, description, keywords, openGraph, twitter), font loading configuration, external script loading, and UI component rendering must remain unchanged
- **generateMetadata()**: The Next.js function in `src/app/layout.tsx` that generates page metadata including favicon, title, description, and social media tags
- **getFavicon()**: The async function that queries the database to retrieve a custom favicon from the `globalSetting` table
- **TTFB (Time to First Byte)**: The time between the browser request and receiving the first byte of the response - currently slow due to blocking database query

## Bug Details

### Bug Condition

The bug manifests when the landing page is accessed with an active internet connection. The `generateMetadata()` function executes `await getFavicon()`, which performs a blocking database query to the `globalSetting` table. This query blocks the entire metadata generation process, preventing Next.js from sending the initial HTML response until the database query completes. When the database is slow or under load, this causes significant delays in TTFB and page rendering.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type PageRequest
  OUTPUT: boolean
  
  RETURN input.hasActiveInternetConnection == true
         AND generateMetadata() is called
         AND getFavicon() performs database query
         AND database query blocks metadata generation
END FUNCTION
```

### Examples

- **Example 1**: User accesses https://katalog-id.vercel.app/ with active internet → `generateMetadata()` calls `await getFavicon()` → database query takes 2-3 seconds → page shows blank screen for 2-3 seconds → page finally renders
- **Example 2**: User accesses landing page with slow database connection → `await getFavicon()` waits for slow query → TTFB is 5+ seconds → poor user experience
- **Example 3**: User accesses landing page with offline mode → database connection fails immediately → fallback to `/favicon-rose.svg` happens instantly → page renders immediately without delay
- **Edge Case**: Database is completely down → `await getFavicon()` eventually times out after several seconds → fallback occurs but only after long delay → page load is still slow

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- All metadata fields (title, description, keywords, authors) must continue to be generated with the same values
- OpenGraph metadata (title, description, url, siteName, type, images) must remain unchanged
- Twitter card metadata must remain unchanged
- Font loading configuration (Geist, Geist_Mono, Playfair_Display) with `display: 'swap'` and preload settings must remain unchanged
- External script loading (lordicon, model-viewer) deferred until after page load must remain unchanged
- All UI components (ThemeProvider, Toaster) must continue to render with the same behavior
- The default favicon `/favicon-rose.svg` must be used (same as the current fallback)

**Scope:**
All inputs that do NOT involve the `generateMetadata()` function's favicon generation should be completely unaffected by this fix. This includes:
- All other metadata generation logic
- Font loading and optimization
- External script loading strategy
- Layout component rendering and children
- Theme provider functionality

## Hypothesized Root Cause

Based on the bug description and code analysis, the root cause is clear:

1. **Blocking Async Database Query**: The `generateMetadata()` function is marked as `async` and uses `await getFavicon()`, which performs a database query. Next.js waits for this async function to complete before generating the page metadata and sending the response to the browser.

2. **Database Query in Critical Path**: The `getFavicon()` function queries the `globalSetting` table using Prisma:
   ```typescript
   const setting = await db.globalSetting.findUnique({
     where: { id: 'global' },
     select: { landingPageFavicon: true },
   })
   ```
   This query is in the critical rendering path, blocking the entire page load.

3. **Slow Database Response**: When the database is slow, under load, or has network latency, the query takes several seconds to complete, directly translating to slow TTFB and delayed page rendering.

4. **Offline Mode Works Fast**: When offline, the database connection fails immediately (connection refused), the catch block executes instantly, and the fallback favicon is used without delay. This explains why offline mode is faster than online mode.

## Correctness Properties

Property 1: Bug Condition - Fast Metadata Generation Without Database Query

_For any_ page request where the landing page is accessed, the fixed `generateMetadata()` function SHALL return metadata synchronously using a static default favicon (`/favicon-rose.svg`) without performing any database queries, ensuring fast TTFB and immediate page rendering.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - Unchanged Metadata and Configuration

_For any_ metadata field that is NOT the favicon (title, description, keywords, openGraph, twitter, authors), the fixed code SHALL produce exactly the same metadata values as the original code, preserving all existing SEO and social media metadata. Additionally, all font loading configuration, external script loading, and UI component rendering SHALL remain unchanged.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

## Fix Implementation

### Changes Required

**File**: `src/app/layout.tsx`

**Function**: `generateMetadata()` and `getFavicon()`

**Specific Changes**:

1. **Remove Database Import**: Remove the `import { db } from '@/lib/db'` statement since database access is no longer needed in this file.

2. **Remove getFavicon() Function**: Delete the entire `getFavicon()` function including:
   - The `cachedFavicon` variable
   - The entire async function implementation
   - All database query logic

3. **Convert generateMetadata() to Synchronous**: Change `generateMetadata()` from an async function to a synchronous function:
   - Remove the `async` keyword from the function signature
   - Remove the `await getFavicon()` call
   - Directly assign the static favicon value

4. **Use Static Default Favicon**: Replace the dynamic favicon retrieval with a static constant:
   ```typescript
   const favicon = '/favicon-rose.svg'
   ```

5. **Preserve All Other Metadata**: Ensure all other metadata fields (title, description, keywords, authors, openGraph, twitter) remain exactly the same.

### Complete Implementation

The fixed `generateMetadata()` function should look like:

```typescript
export function generateMetadata(): Metadata {
  const favicon = '/favicon-rose.svg'

  return {
    metadataBase: new URL('https://katalog-id.vercel.app'),
    title: "Katalog Undanganku - Platform Undangan Pernikahan Digital Terbaik",
    description: "Buat undangan pernikahan digital yang elegan, modern, dan mudah dibagikan. Berbagai tema undangan dengan fitur lengkap untuk momen spesial Anda.",
    keywords: ["Undangan Pernikahan Digital", "Wedding Invitation", "Undangan Online", "Undangan Pernikahan", "Digital Wedding", "Wedding Invitation Indonesia"],
    authors: [{ name: "Katalog Undanganku Team" }],
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    openGraph: {
      title: "Katalog Undanganku - Undangan Pernikahan Digital",
      description: "Buat undangan pernikahan digital yang elegan dan modern dengan berbagai pilihan tema",
      url: "/",
      siteName: "Katalog Undanganku",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: "Katalog Undanganku - Undangan Pernikahan Digital",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Katalog Undanganku - Undangan Pernikahan Digital",
      description: "Platform undangan pernikahan digital terbaik di Indonesia",
      images: ["/logo.png"],
    },
  }
}
```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code by measuring TTFB and observing slow page loads, then verify the fix works correctly by confirming fast TTFB and preserved functionality.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Measure TTFB and page load times to confirm the blocking database query is causing the delay.

**Test Plan**: Access the landing page with an active internet connection and measure TTFB using browser DevTools Network tab or Lighthouse. Simulate slow database responses to observe the impact on page load time. Run these tests on the UNFIXED code to observe failures and confirm the root cause.

**Test Cases**:
1. **Normal Database Response Test**: Access landing page with normal database → measure TTFB → observe 1-3 second delay (will fail on unfixed code)
2. **Slow Database Response Test**: Simulate slow database query (add artificial delay) → measure TTFB → observe 5+ second delay (will fail on unfixed code)
3. **Offline Mode Test**: Access landing page with offline mode → measure TTFB → observe instant load (passes on unfixed code, confirming fallback works)
4. **Browser DevTools Network Analysis**: Use Chrome DevTools Network tab → observe "Waiting (TTFB)" time → confirm it matches database query time (will show long wait on unfixed code)

**Expected Counterexamples**:
- TTFB is slow (1-5+ seconds) when database query is in the critical path
- Page shows blank screen while waiting for metadata generation to complete
- Possible causes: blocking `await getFavicon()` call, slow database response, database query in critical rendering path

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds (landing page access with active internet), the fixed function produces fast TTFB and immediate page rendering.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := generateMetadata_fixed()
  ASSERT result.generationTime < 100ms
  ASSERT result.favicon == '/favicon-rose.svg'
  ASSERT NO database queries are executed
END FOR
```

**Test Plan**: After implementing the fix, access the landing page multiple times and measure TTFB. Verify that:
- TTFB is consistently fast (<500ms)
- No database queries are logged
- Favicon is `/favicon-rose.svg`
- Page renders immediately without blank screen delay

**Test Cases**:
1. **Fast TTFB Test**: Access landing page → measure TTFB → assert TTFB < 500ms
2. **No Database Query Test**: Monitor database logs → access landing page → assert no queries to `globalSetting` table
3. **Correct Favicon Test**: Inspect page metadata → assert favicon is `/favicon-rose.svg`
4. **Lighthouse Performance Test**: Run Lighthouse → assert TTFB score is green (< 800ms)

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold (all other metadata generation and page rendering), the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT generateMetadata_original(input).title == generateMetadata_fixed(input).title
  ASSERT generateMetadata_original(input).description == generateMetadata_fixed(input).description
  ASSERT generateMetadata_original(input).openGraph == generateMetadata_fixed(input).openGraph
  ASSERT generateMetadata_original(input).twitter == generateMetadata_fixed(input).twitter
  ASSERT fontLoading_original() == fontLoading_fixed()
  ASSERT externalScripts_original() == externalScripts_fixed()
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for all metadata fields, font loading, and UI rendering, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Metadata Preservation Test**: Compare all metadata fields (title, description, keywords, authors, openGraph, twitter) between unfixed and fixed versions → assert all fields are identical except favicon
2. **Font Loading Preservation Test**: Verify font loading configuration (Geist, Geist_Mono, Playfair_Display) with `display: 'swap'` and preload settings → assert configuration is unchanged
3. **External Scripts Preservation Test**: Verify lordicon and model-viewer scripts are still deferred until after page load → assert script loading behavior is unchanged
4. **UI Component Preservation Test**: Verify ThemeProvider, Toaster, and all children render correctly → assert UI behavior is unchanged
5. **SEO Preservation Test**: Use SEO analysis tools to verify all meta tags are present and correct → assert SEO metadata is unchanged

### Unit Tests

- Test that `generateMetadata()` returns metadata synchronously without async operations
- Test that favicon is always `/favicon-rose.svg`
- Test that all metadata fields contain expected values
- Test that no database imports or queries exist in the file

### Property-Based Tests

- Generate random page requests and verify TTFB is consistently fast (<500ms)
- Generate random metadata field access patterns and verify all fields return expected values
- Test that font loading configuration remains consistent across multiple page loads
- Test that external script loading behavior is preserved across different network conditions

### Integration Tests

- Test full page load flow from request to render with TTFB measurement
- Test that favicon appears correctly in browser tab
- Test that all metadata is correctly rendered in page source HTML
- Test that SEO crawlers can access all metadata without delays
- Test that page load performance meets Lighthouse thresholds (TTFB < 800ms, FCP < 1.8s)
