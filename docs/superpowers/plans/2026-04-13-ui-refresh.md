# Dark Luxury Glass UI Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the frontend’s visual system into a cohesive dark luxury glass interface with cinematic depth, refined motion, and premium interaction polish across core marketplace screens.

**Architecture:** The refresh should start from the global theme tokens and shared chrome so the new aesthetic propagates consistently, then sweep the flagship discovery surface and the most visible app shells, and finally normalize remaining screens to match the new language. Keep the underlying product flows and route structure intact; the work is visual system replacement and surface-level interaction refinement, not feature redesign.

**Tech Stack:** Expo Router, React Native, React Native Web, StyleSheet, theme tokens, shared UI components, Expo vector icons, FlashList, map surfaces, existing backend-driven data hooks.

---

### Task 1: Recast the global theme tokens

**Files:**
- Modify: `ui/src/theme/tokens.ts`
- Modify: `ui/src/theme/useThemeColors.ts`
- Test: `ui/src/theme/useThemeColors.test.ts` if present, otherwise create `ui/src/theme/tokens.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import { tokens } from './tokens'

describe('dark luxury tokens', () => {
  it('exposes deep surfaces and luminous accents', () => {
    expect(tokens.color.surface_primary).toBeDefined()
    expect(tokens.color.accent_primary).toBeDefined()
    expect(tokens.shadow.card).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test ui/src/theme/tokens.test.ts -v`
Expected: FAIL because the new dark luxury token values are not present yet.

- [ ] **Step 3: Write minimal implementation**

```ts
export const tokens = {
  color: {
    surface_primary: '#0A0C10',
    surface_secondary: '#0F131A',
    surface_elevated: 'rgba(18, 24, 33, 0.78)',
    surface_selected: 'rgba(34, 46, 62, 0.92)',
    text_primary: '#F5F7FB',
    text_secondary: 'rgba(212, 220, 233, 0.76)',
    accent_primary: '#D8B46A',
    accent_secondary: '#7CC7FF',
    border_subtle: 'rgba(255, 255, 255, 0.10)',
    border_strong: 'rgba(255, 255, 255, 0.18)',
  },
  shadow: {
    soft: {
      shadowColor: '#000000',
      shadowOpacity: 0.22,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    card: {
      shadowColor: '#000000',
      shadowOpacity: 0.30,
      shadowRadius: 26,
      shadowOffset: { width: 0, height: 14 },
      elevation: 16,
    },
  },
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test ui/src/theme/tokens.test.ts -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/theme/tokens.ts ui/src/theme/useThemeColors.ts ui/src/theme/tokens.test.ts
git commit -m "feat: establish dark luxury theme tokens"
```

### Task 2: Upgrade the global shell and navigation chrome

**Files:**
- Modify: `ui/src/app/_layout.tsx`
- Modify: `ui/src/app/(tabs)/_layout.tsx`
- Modify: `ui/src/components/WebTopNav.tsx`
- Test: `ui/src/components/WebTopNav.test.tsx` if present, otherwise add a snapshot or render test for the top nav shell

- [ ] **Step 1: Write the failing test**

```tsx
import { render } from '@testing-library/react-native'
import { WebTopNav } from './WebTopNav'

describe('WebTopNav', () => {
  it('renders premium navigation chrome', () => {
    const { getByText } = render(<WebTopNav />)
    expect(getByText('Home')).toBeTruthy()
    expect(getByText('Messages')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test ui/src/components/WebTopNav.test.tsx -v`
Expected: FAIL until the updated chrome exists.

- [ ] **Step 3: Write minimal implementation**

```tsx
export function WebTopNav() {
  return (
    <View style={{ backdropFilter: 'blur(24px)', backgroundColor: 'rgba(8, 10, 14, 0.72)' }}>
      {/* premium top navigation with luminous active state */}
    </View>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test ui/src/components/WebTopNav.test.tsx -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/app/_layout.tsx ui/src/app/(tabs)/_layout.tsx ui/src/components/WebTopNav.tsx ui/src/components/WebTopNav.test.tsx
git commit -m "feat: refresh app shell chrome"
```

### Task 3: Restyle the flagship discovery surface

**Files:**
- Modify: `ui/src/features/landing/LandingScreen.tsx`
- Modify: `ui/src/components/MapSurface.web.tsx`
- Modify: `ui/src/components/MapSurface.native.tsx`
- Modify: `ui/src/stores/discoveryStore.ts`
- Test: `ui/src/features/landing/LandingScreen.test.tsx` if present, otherwise add a render test for split mode and selection sync

- [ ] **Step 1: Write the failing test**

```tsx
import { render } from '@testing-library/react-native'
import { LandingScreen } from './LandingScreen'

describe('LandingScreen split discovery', () => {
  it('shows synchronized map and list chrome in split mode', () => {
    const { getByText } = render(<LandingScreen />)
    expect(getByText('Find trusted work. Discover nearby pros.')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test ui/src/features/landing/LandingScreen.test.tsx -v`
Expected: FAIL until the new split-first styling lands.

- [ ] **Step 3: Write minimal implementation**

```tsx
<View style={{ borderRadius: 32, backgroundColor: 'rgba(18, 24, 33, 0.82)', shadowOpacity: 0.3 }}>
  <MapSurface listings={listings} compact={viewMode === 'split'} />
</View>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test ui/src/features/landing/LandingScreen.test.tsx -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/features/landing/LandingScreen.tsx ui/src/components/MapSurface.web.tsx ui/src/components/MapSurface.native.tsx ui/src/stores/discoveryStore.ts ui/src/features/landing/LandingScreen.test.tsx
git commit -m "feat: restyle discovery surface"
```

### Task 4: Sweep the visible marketplace screens

**Files:**
- Modify: `ui/src/app/search_screen.tsx`
- Modify: `ui/src/app/search_results.tsx`
- Modify: `ui/src/app/discovery_filter.tsx`
- Modify: `ui/src/app/map_view.tsx`
- Modify: `ui/src/app/job_description.tsx`
- Modify: `ui/src/app/worker_description.tsx`
- Modify: `ui/src/app/offer_service.tsx`
- Modify: `ui/src/app/send_help_request_to_worker.tsx`
- Modify: `ui/src/app/(tabs)/notifications_list.tsx`
- Modify: `ui/src/app/(tabs)/account_profile.tsx`
- Modify: `ui/src/app/(tabs)/requests_posts_hub.tsx`
- Modify: `ui/src/app/(tabs)/post_type_selector.tsx`
- Test: screen-level render tests for any screen that currently has no coverage and is touched in this task

- [ ] **Step 1: Write the failing test**

```tsx
import { render } from '@testing-library/react-native'
import { SearchScreen } from '@/app/search_screen'

describe('SearchScreen premium styling', () => {
  it('renders the glass search shell', () => {
    const { getByText } = render(<SearchScreen />)
    expect(getByText('Search')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test ui/src/app/search_screen.test.tsx -v`
Expected: FAIL until the screen is restyled.

- [ ] **Step 3: Write minimal implementation**

```tsx
<View style={{ borderRadius: 28, backgroundColor: 'rgba(15, 19, 26, 0.82)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}>
  {/* premium card, sheet, and form styling */}
</View>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test ui/src/app/search_screen.test.tsx -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/app/search_screen.tsx ui/src/app/search_results.tsx ui/src/app/discovery_filter.tsx ui/src/app/map_view.tsx ui/src/app/job_description.tsx ui/src/app/worker_description.tsx ui/src/app/offer_service.tsx ui/src/app/send_help_request_to_worker.tsx ui/src/app/(tabs)/notifications_list.tsx ui/src/app/(tabs)/account_profile.tsx ui/src/app/(tabs)/requests_posts_hub.tsx ui/src/app/(tabs)/post_type_selector.tsx
git commit -m "feat: sweep marketplace screens with premium styling"
```

### Task 5: Polish motion, overlays, and interaction feedback

**Files:**
- Modify: `ui/src/components/GuestGate.tsx`
- Modify: `ui/src/components/SsotRouteScreen.tsx`
- Modify: any shared overlay, sheet, button, or card primitives that were introduced during the sweep
- Test: targeted component tests for hover/press/overlay states where supported on web and native

- [ ] **Step 1: Write the failing test**

```tsx
import { render } from '@testing-library/react-native'
import { GuestGate } from './GuestGate'

describe('GuestGate overlay polish', () => {
  it('uses a glass-like dimmed overlay', () => {
    const { getByText } = render(<GuestGate />)
    expect(getByText('Continue as guest')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test ui/src/components/GuestGate.test.tsx -v`
Expected: FAIL until the overlay polish is applied.

- [ ] **Step 3: Write minimal implementation**

```tsx
<View style={{ backgroundColor: 'rgba(4, 6, 10, 0.72)', backdropFilter: 'blur(18px)' }}>
  {/* refined motion and overlay treatment */}
</View>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test ui/src/components/GuestGate.test.tsx -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/GuestGate.tsx ui/src/components/SsotRouteScreen.tsx
git commit -m "feat: polish overlay and motion treatment"
```

### Task 6: Verify the refreshed UI end to end

**Files:**
- No new files expected
- Review: all files touched above

- [ ] **Step 1: Run the frontend checks**

Run: `pnpm test && pnpm lint && pnpm typecheck`
Expected: all checks pass without new UI regressions.

- [ ] **Step 2: Run the app and inspect the premium surfaces**

Run: `pnpm dev`
Expected: landing, search, detail, and account surfaces all share the dark luxury glass language.

- [ ] **Step 3: Confirm the highest-traffic flows**

Check: discovery, search, detail, filter, posting, and account navigation all remain functional with the new styling.
Expected: no broken routes, no unreadable text, no clipped overlays.

- [ ] **Step 4: Commit**

```bash
git add ui/src
git commit -m "feat: complete dark luxury glass refresh"
```

## Self-review coverage
- Global theme and tokens: Task 1
- Shell and navigation chrome: Task 2
- Flagship discovery experience: Task 3
- Visible marketplace screens: Task 4
- Motion and overlays: Task 5
- Verification: Task 6

## Gaps to watch during implementation
- If a shared card, sheet, or button primitive emerges during the sweep, it should be normalized once rather than copied across many screens.
- If the app lacks the test harness assumed above, the implementer should add the smallest viable render test setup before writing component tests.
