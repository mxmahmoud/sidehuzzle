# Playwright Strategy

## Coverage Standard

Use Playwright as a required validation layer for the web target of the shared React Native app. Aim to exercise every meaningful user-facing interactive element, route, modal, panel, form field, menu, tab, state toggle, and primary card action. Do not waste effort asserting inert decorative nodes.

When a feature changes, update Playwright coverage in the same work unless there is a clear reason it cannot be done.

## Stable Selectors

- Add stable `testID` or `data-testid` values for interactive elements.
- Prefer user-facing roles and labels when they are stable and accessible.
- Do not rely on fragile generated class names, animation timing, or layout coordinates.
- Include selectors for glass panels, floating navigation, bottom sheets, dialogs, and animated controls when they contain actions.

## Mock Users

Maintain realistic seeded personas for E2E tests:

- Customer: verified profile, saved address, payment method, posted job, received offers, active chat, completed booking.
- Freelancer: verified profile, service listings, availability, payout setup, incoming job request, sent offer, active booking, completed job.
- New user: minimal onboarding state, no listings, no bookings, no payment method.
- Admin/support where relevant: can inspect reports, disputes, flagged users, and transaction support state.

Use deterministic IDs and fixture factories. Avoid tests that depend on live external providers.

## Test Environment

- Prefer a seeded SQL test database or API-level fixture setup.
- Mock or sandbox payments, maps, notifications, email, SMS, identity verification, analytics, and file uploads.
- Reset state between tests or isolate each test with generated fixture namespaces.
- Provide predictable clocks for booking windows, deadlines, expiry, and animation-sensitive flows.

## Regression Expectations

For each major surface, cover:

- Rendering and navigation entry points
- Form validation and recovery
- Auth and role-gated behavior
- Empty, loading, success, error, and permission states
- Keyboard and pointer interactions
- Mobile and desktop web viewports
- Reduced-motion behavior for animated flows
- Visual smoke checks for glass surfaces where regressions would be costly

Keep tests purposeful and fast enough to run locally. Split slow full-marketplace journeys from focused component or route-level tests when needed.

## Visual Review Rule

When Playwright is used to judge UI appearance, capture and inspect the same surface in both dark mode and light mode. For responsive surfaces, include desktop and mobile screenshots. Do not approve glassmorphism, navigation chrome, overlays, map controls, or landing/discovery changes from a single theme or single viewport.
