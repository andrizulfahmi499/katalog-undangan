# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Slow TTFB Due to Blocking Database Query
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: For deterministic bugs, scope the property to the concrete failing case(s) to ensure reproducibility
  - Test that accessing the landing page with active internet connection results in slow TTFB (>1000ms) due to blocking `await getFavicon()` database query
  - The test should measure TTFB and verify it exceeds acceptable thresholds when database query is in the critical path
  - Test implementation details from Bug Condition in design: `isBugCondition(input)` where `input.hasActiveInternetConnection == true AND generateMetadata() is called AND getFavicon() performs database query`
  - The test assertions should match the Expected Behavior Properties from design: fast metadata generation without database query
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause (e.g., "TTFB is 2-3 seconds when database query blocks metadata generation")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Unchanged Metadata and Configuration
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (all metadata fields except favicon, font loading, external scripts, UI components)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Property-based testing generates many test cases for stronger guarantees
  - Test that all metadata fields (title, description, keywords, authors, openGraph, twitter) remain unchanged
  - Test that font loading configuration (Geist, Geist_Mono, Playfair_Display with display: 'swap' and preload settings) remains unchanged
  - Test that external script loading (lordicon, model-viewer deferred until after page load) remains unchanged
  - Test that UI components (ThemeProvider, Toaster) render correctly
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Fix for blocking database query in generateMetadata()

  - [x] 3.1 Implement the fix
    - Remove the `import { db } from '@/lib/db'` statement from `src/app/layout.tsx`
    - Delete the entire `getFavicon()` function including the `cachedFavicon` variable
    - Convert `generateMetadata()` from async to synchronous by removing the `async` keyword
    - Remove the `await getFavicon()` call and replace with static constant: `const favicon = '/favicon-rose.svg'`
    - Preserve all other metadata fields (title, description, keywords, authors, openGraph, twitter) exactly as they are
    - Ensure font loading configuration, external script loading, and UI components remain unchanged
    - _Bug_Condition: isBugCondition(input) where input.hasActiveInternetConnection == true AND generateMetadata() is called AND getFavicon() performs database query_
    - _Expected_Behavior: generateMetadata() returns metadata synchronously using static default favicon without performing any database queries, ensuring fast TTFB_
    - _Preservation: All metadata fields except favicon, font loading configuration, external script loading, and UI component rendering remain unchanged_
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Fast TTFB Without Database Query
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify TTFB is now fast (<500ms) and no database queries are executed
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Unchanged Metadata and Configuration
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all metadata fields, font loading, external scripts, and UI components still work correctly after fix

- [x] 4. Checkpoint - Ensure all tests pass
  - Run all tests (bug condition exploration test + preservation tests)
  - Verify TTFB is fast (<500ms) using browser DevTools Network tab or Lighthouse
  - Verify no database queries to `globalSetting` table are logged
  - Verify favicon is `/favicon-rose.svg` in browser tab and page source
  - Verify all metadata fields are present and correct in page source HTML
  - Verify page renders immediately without blank screen delay
  - Ensure all tests pass, ask the user if questions arise
