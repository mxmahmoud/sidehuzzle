# Frontend rewrite implementation plan v2

## Starting point
The frontend rewrite will be executed against the current Expo Router app in `ui/`, with the backend treated as authoritative but still subject to additive extensions where the product needs durable state that is not yet supported.

## What we know now
- `ui` already has Expo Router, theme tokens, query/client wiring, tabs, web nav, and map surfaces.
- The backend already exposes task search/nearby support and chat routes, plus session-based auth and a broad resource surface.
- The current frontend still relies on placeholder-heavy flows in several places and needs stronger real-product behavior.

## Priority order
1. Discovery and shell quality
2. Shared backend/domain contract
3. Detail and action flows
4. Chat and posting flows
5. Backend extensions where necessary
6. Secondary surfaces and polish

## Phase 1: Frontend shell audit
Goal: understand the actual current surface boundaries before changing behavior.

Work items:
- inspect the authored route files in `ui/src/app/`
- identify which routes are already functional and which are still thin shells
- map discovery, auth, detail, chat, and account flows to current files
- identify any route that should be kept minimal for now

Why this first:
- the current app already has structure, so the rewrite should refine and replace carefully rather than flatten everything into a new architecture

## Phase 2: Shared backend contract layer
Goal: move the frontend toward real backend consumption.

Work items:
- create a shared API layer for auth, tasks, chat, and reference data
- define typed models for the shapes already exposed by the backend
- standardize query keys and mutation helpers
- isolate session handling and request/error normalization

Backend fields/routes already relevant:
- task search and nearby routes
- task CRUD routes generated through the generic router
- chat room creation/messages/websocket route
- user/auth routes
- categories, addresses, countries, states, ratings, roles, timeslots

## Phase 3: Discovery rewrite
Goal: make the flagship screen feel premium and finished.

Work items:
- implement a real discovery screen that uses backend data where available
- maintain map/list sync as a single shared state
- preserve the mobile drawer behavior and desktop split behavior
- make search and filters part of the same discovery state
- upgrade cards to feel premium and scan-friendly

Notes:
- on web, keep Leaflet with tile caching
- on mobile, keep native map behavior and surface-appropriate interactions
- discovery should be the first place where the design system is visibly proven

## Phase 4: Detail and action flows
Goal: turn browsing into real action.

Work items:
- make job and worker detail screens complete enough to support actual decisions
- wire the primary action paths from detail screens into chat or request/post flows
- make confirmations feel intentional rather than template-like
- ensure account/profile surfaces are reachable and meaningful

## Phase 5: Chat and messaging
Goal: make messaging a real first-class product surface.

Work items:
- align the frontend with the backend chat room/message contract
- determine whether the current backend websocket is sufficient or needs auth/state hardening
- implement conversation list and thread behavior in the UI
- make entry points from discovery and detail routes feel natural

Backend extension candidates if needed:
- chat room listing by user
- message read state
- participant metadata in list views

## Phase 6: Posting and management
Goal: make posting and lifecycle management production-grade.

Work items:
- refine post creation flows
- ensure post confirmations are real destinations
- add management views for user-created posts, requests, or offers as needed
- align any posting fields with the backend schema

Backend extension candidates if needed:
- additional task fields
- attachments/media
- saved drafts or stateful posting workflow support

## Phase 7: Secondary surfaces
Goal: keep the product coherent without overbuilding low-value screens.

Work items:
- review which utility pages deserve full treatment
- keep low-priority routes minimal unless they are part of the conversion path
- make any secondary surface visually consistent with the premium system

## Phase 8: Visual refinement and device-specific polish
Goal: make the product feel deliberate on each surface.

Work items:
- refine spacing, typography, card shape, and elevation
- ensure top nav and bottom tab behavior remains correct per surface
- review layout density differences between desktop web, mobile web, and native mobile
- keep light/dark mode behavior consistent
- eliminate remaining scaffold-like cues

## Phase 9: Verification
Goal: confirm the rewrite actually works.

Checks:
- frontend typecheck/build
- browser journey through the full app
- key route transitions from discovery to detail to action to account
- map/list selection sync on web
- mobile surface sanity checks where possible
- backend contract validation for any new API work

## Phase 10: Guidance and operating discipline
Goal: make future work easier and more consistent.

Work items:
- keep the new design spec and implementation plan as canonical references
- replace old scaffold-era guidance with the new repo guidance refresh
- convert useful operating norms into durable skills/rules/agents rather than more handoff markdown

## Immediate next coding target
The next practical code target is the shared backend/domain contract layer, because it reduces mock dependence and gives the discovery rewrite a real foundation.
