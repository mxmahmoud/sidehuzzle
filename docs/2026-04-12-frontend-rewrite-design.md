# Frontend rewrite design

## Goal
Rewrite the frontend into a production-grade, premium marketplace app that works across desktop web, mobile web, and React Native mobile, while staying tightly integrated with the backend and able to run through the full app in the browser.

The current frontend should be treated as a brittle starting point, not as the target architecture. The target is a cohesive consumer product with strong visual polish, map-first discovery, and fully runnable end-to-end flows.

## Product direction
The product is a premium marketplace connecting customers who need work done with freelancers who offer services. The experience should feel modern, elegant, spatial, and trustworthy.

Core product properties:
- map-first discovery
- card-driven browsing
- clear trust and price signals
- low-friction posting and messaging
- shared codebase across web and mobile
- device-specific layout behavior where needed

The frontend should not be designed as a web page translated into mobile. It should be designed as a marketplace app with separate layout targets for:
- desktop web
- mobile web
- React Native mobile

Those surfaces should share the same domain logic, design system, and data access patterns, but each surface should be allowed to use a different layout density and interaction model.

## What the app must support
The rewrite must support a full user journey, not just a polished discovery screen.

Primary flows:
- sign up, log in, log out
- landing and discovery
- search and filtering
- map/list synchronization
- detail pages for jobs and workers
- messaging and request flows
- posting flows
- notifications and management views
- account and profile views
- saved or followed or history-style utility surfaces where supported by the backend

If a flow is visible in the UI but missing backend support, the backend should be extended rather than faked in the frontend, unless the feature is intentionally out of scope.

## Backend assumption
Treat the backend as authoritative and professionally implemented, but not necessarily complete for every frontend ambition.

That means:
- consume the backend as the source of truth for auth, discovery, profile, chat, and task data
- add backend and database extensions only when a frontend flow genuinely needs them
- avoid frontend-only persistence hacks for real product state
- keep the backend contract explicit and stable

Likely backend extension areas, if current endpoints do not already cover them:
- richer discovery/listing support
- saved/favorited content
- notification feed state
- gallery or attachment support
- richer chat thread/read-state support
- account preference persistence
- posting workflow fields needed by the UI
- profile and review views where missing

## UI architecture
The frontend should be organized into four layers.

### 1. App shell
Responsibilities:
- route structure
- auth gating
- top navigation on web
- bottom tabs on mobile
- global overlays and modals
- theme wiring

The shell should stay thin and not own business logic.

### 2. Shared domain layer
Responsibilities:
- backend client and request helpers
- query and mutation hooks
- typed resource models
- session state
- cache coordination
- shared filtering and selection state where needed

This layer should be reused across surfaces.

### 3. Feature modules
Responsibilities:
- discovery
- detail
- posting
- chat/messages
- notifications
- account
- auth

Each feature should own its own UI and domain interactions. Features should be understandable without reading unrelated screens.

### 4. Surface adapters
Responsibilities:
- desktop web layout
- mobile web layout
- native mobile layout

These adapters should determine how the same feature is presented, not what the feature means.

## Navigation model
Keep the current app structure direction, but make it feel intentional and premium.

Primary bottom tabs:
- Home
- Messages
- Post
- Notifications
- Account

Web should use a top navigation bar instead of visible bottom tabs. Mobile should use a bottom tab bar. Modals and nested stack screens should still exist for filters, details, chat, reports, and similar secondary flows.

The root route should land on the main discovery experience, not on a dead-end shell.

## Discovery experience
The flagship experience is a map-first discovery screen.

Required structure:
- top interactive map region
- floating search bar
- optional filter controls
- lower card/list region or draggable drawer
- synchronized map and list selection
- responsive behavior across desktop and mobile

Behavioral rules:
- map and card list are one shared discovery state
- selecting a card highlights the map item
- selecting a map item highlights the card
- desktop web can use a more spacious split layout
- mobile web and native mobile should use denser stacked or drawer-like layouts
- the experience should never feel like two disconnected screens

Visual direction for discovery:
- generous spacing
- rounded cards
- clear hierarchy
- subtle elevation
- high-quality imagery when available
- minimal clutter
- strong search prominence without overpowering the map

## Screen scope
The rewrite should prioritize these surfaces.

### Must be production-grade
- landing/discovery
- login/sign up
- search and filters
- job detail
- worker detail
- messages/chat
- post creation and confirmation
- account/profile
- notifications

### Should be implemented if backend support exists or is added
- saved content
- history or activity views
- category browsing
- reviews and trust views
- applicants or request management
- gallery/media views
- report flows
- membership or settings surfaces if they are real product requirements

### Can remain minimal until needed
- secondary informational pages
- rarely used utility screens
- any route that is not part of the main conversion path

## Design system direction
The UI should feel like a polished consumer marketplace, not an admin panel or tutorial app.

Design principles:
- premium, calm, and modern
- clear hierarchy
- strong typography
- generous spacing
- touch-friendly controls
- restrained motion
- consistent elevation and radius
- stable color semantics across themes

The design system should support both light and dark themes.

## Interaction principles
- discovery should feel spatial and immediate
- list cards should be easy to scan and easy to activate
- primary calls to action should be obvious
- secondary actions should not fight the main action
- map interactions should feel coordinated with list interactions
- device-specific interaction differences are allowed and expected

## Data and state principles
- backend is the source of truth for durable product state
- frontend state should be used for transient UI concerns and optimistic interactions only when appropriate
- query caching should be intentional and shared where useful
- selection state for discovery should be shared across map and list
- forms should use typed validation and submit real backend payloads

## Backend and database extension policy
If a frontend flow needs a real backend capability, add it to the backend instead of hardcoding it in the frontend.

Preferred backend extension order:
1. extend an existing resource or endpoint
2. add a new route or view model
3. add database fields or tables only when required for durable product behavior

Do not extend the backend for speculative future ideas. Extend it only for visible product needs.

## Repo guidance refresh
The old md guidance files should be treated as intent history, not as the final operating manual.

The new repo guidance should enforce:
- premium product standards
- backend-authoritative development
- real end-to-end flows
- device-aware layout decisions
- no placeholder-first mentality
- no vibecoded shortcuts
- verification before claiming completion

The repo should use durable guidance mechanisms that are easier to follow than large legacy markdown handoffs.

Recommended guidance surfaces:
- skills for how to brainstorm, write plans, implement, verify, and review
- rules for repository-specific quality expectations
- agents for specialized inspection and review tasks
- memory notes for durable collaboration preferences and project direction

## Implementation sequence
1. Normalize repo guidance and capture the real product direction.
2. Lock the shared design system and shell behavior.
3. Build the shared backend/domain layer.
4. Rebuild discovery end-to-end with real backend data.
5. Wire auth, detail, posting, and chat flows.
6. Add notifications, account, saved, and management surfaces.
7. Add backend/database extensions where the product needs them.
8. Verify the full browser journey and then device-specific layouts.

## Success criteria
The rewrite is successful when:
- the app feels like one coherent premium product
- the browser can run through the full journey without dead ends
- desktop web, mobile web, and native mobile each feel appropriate to their surface
- the backend and frontend share real contracts instead of placeholder behavior
- the old scaffold-heavy feel is gone
- the result is production-ready rather than prototype-like
