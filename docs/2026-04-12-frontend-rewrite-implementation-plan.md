# Frontend rewrite implementation plan

## Objective
Deliver a production-ready rewrite of the Sidehuzle frontend that feels premium, runs end-to-end in the browser, and remains coherent across desktop web, mobile web, and React Native mobile.

This plan assumes:
- the backend is authoritative
- the current frontend is a brittle starting point
- backend or database extensions may be required for real product flows
- local-only work only; no git pushes

## Delivery principles
- Prefer real flows over placeholder shells.
- Keep shared domain logic shared.
- Allow layout differences by surface.
- Extend the backend when durable product state is missing.
- Verify before considering any step complete.

## Existing surfaces to preserve
- Expo Router app shell in `ui/src/app/`
- query/cache stack in TanStack Query
- Zustand for UI state where appropriate
- map stack on web and native
- existing SSOT page registry and authored routes
- theme tokens and dark/light support

## Phase 1: Normalize repo guidance and operating rules
Goal: make the repo’s working rules explicit and durable so future implementation stays aligned.

Work items:
1. Keep the new design spec and repo guidance refresh docs as the canonical high-level references.
2. Convert the useful intent from the legacy docs into durable guidance surfaces rather than continuing to rely on those legacy files.
3. Keep the current plugin set in mind as the likely implementation path for future skills/rules/agents.
4. Avoid carrying forward stale RN version arguments, scaffold-era assumptions, or contradictory naming.

Outcome:
- a stable instruction layer for future frontend work
- a clear product/engineering posture for the rewrite

## Phase 2: Establish the shell and navigation contract
Goal: ensure the app’s root structure is intentional and consistent across surfaces.

Work items:
1. Preserve Expo Router as the route backbone.
2. Keep web top navigation and mobile bottom tabs as distinct presentation modes.
3. Confirm the root route lands in the main discovery experience.
4. Keep modals and nested stack screens available for filters, details, chat, reports, and secondary flows.
5. Confirm theme wiring remains global and stable.

Current relevant files:
- `ui/src/app/_layout.tsx`
- `ui/src/app/index.tsx`
- `ui/src/app/(tabs)/_layout.tsx`
- `ui/src/components/WebTopNav.tsx`
- `ui/src/theme/useThemeColors.ts`
- `ui/src/theme/tokens.ts`

Outcome:
- a consistent shell that does not feel like a generic scaffold
- correct navigation differences by surface

## Phase 3: Define the shared domain/data layer
Goal: give the frontend a real contract with the backend.

Work items:
1. Add or normalize backend client helpers.
2. Define typed resource models for discovery, auth, tasks, chat, notifications, account, and supporting reference data.
3. Standardize query keys and mutation conventions.
4. Establish how selection and filter state should flow through shared state and query state.

Needed backend awareness:
- session-based auth
- task discovery and filtering
- task/job detail data
- chat room/message data
- user/profile data
- reference data for forms and filters

Potential backend extension work if required:
- richer discovery/listing support
- saved/favorites support
- notification feed support
- chat read-state support
- profile/review support
- attachment/media support
- posting workflow fields

Outcome:
- frontend screens can render from real contracts instead of hardcoded mock assumptions

## Phase 4: Rebuild the discovery experience first
Goal: deliver the flagship experience with premium interaction quality.

Work items:
1. Rework the landing/discovery surface around a map-first layout.
2. Keep map and list as a synchronized discovery state.
3. Support desktop split behavior and mobile drawer/stack behavior.
4. Preserve strong search visibility and filtering entry points.
5. Make cards feel premium and easy to scan.
6. Ensure selection sync and transitions feel deliberate and stable.

Current relevant files:
- `ui/src/features/landing/LandingScreen.tsx`
- `ui/src/components/MapSurface.web.tsx`
- `ui/src/components/MapSurface.native.tsx`
- `ui/src/data/mockListings.ts`
- `ui/src/app/search_screen.tsx`
- `ui/src/app/discovery_filter.tsx`
- `ui/src/app/search_results.tsx`

Key outputs:
- one flagship discovery surface that feels finished
- one shared discovery state model across devices
- no disconnected map/list behavior

## Phase 5: Make the primary detail and action flows production-grade
Goal: ensure browsing can turn into action without dead ends.

Work items:
1. Rework job detail and worker detail screens.
2. Ensure message/request entry points are clear and natural.
3. Make post creation and confirmation flows feel guided and polished.
4. Ensure notifications and management views fit the product model.
5. Keep account/profile as a real destination, not a stub.

Current relevant files:
- `ui/src/app/job_description.tsx`
- `ui/src/app/worker_description.tsx`
- `ui/src/app/offer_service.tsx`
- `ui/src/app/send_help_request_to_worker.tsx`
- `ui/src/app/(tabs)/requests_posts_hub.tsx`
- `ui/src/app/(tabs)/post_type_selector.tsx`
- `ui/src/app/(tabs)/notifications_list.tsx`
- `ui/src/app/(tabs)/account_profile.tsx`

Outcome:
- a browser user can move from discovery into details, posting, or messaging without the experience falling apart

## Phase 6: Decide and implement backend/database extensions
Goal: add only the durable backend support the product truly needs.

Work items:
1. Review each critical frontend flow against actual backend support.
2. Add endpoints or fields only when the frontend needs real persistence or canonical server state.
3. Keep any new data model changes normalized and minimal.
4. Avoid using frontend-only persistence for durable product behavior.

Likely extension candidates if missing:
- favorites/saved items
- notification feed
- richer chat thread state
- posting form fields
- profile/review and gallery data
- saved search or preference state

Outcome:
- the frontend remains honest about what the backend can support

## Phase 7: Build the remaining utility and secondary surfaces
Goal: keep the app coherent beyond the primary conversion path.

Work items:
1. Implement or refine saved/history/categories/reviews/report/membership/settings-like surfaces where the product truly needs them.
2. Keep these surfaces visually aligned with the premium shell.
3. Ensure they do not dilute the main discovery and conversion experience.

Outcome:
- secondary screens feel intentional, not decorative

## Phase 8: Tighten visual and interaction quality
Goal: make the product feel premium and production-ready.

Work items:
1. Normalize typography, spacing, card shape, and hierarchy.
2. Ensure light/dark theme behavior is consistent.
3. Keep motion restrained and purposeful.
4. Review map overlays, bottom sheets, buttons, and tab behavior for polish.
5. Eliminate scaffold-like cues where they remain.

Outcome:
- a calm, modern, elegant consumer UI

## Phase 9: Verification and regression checks
Goal: verify the rewrite actually works across the expected surfaces.

Checks to run:
- typecheck/build for the frontend
- browser runtime validation of the full app journey
- mobile runtime validation where possible
- auth flow sanity checks
- discovery/filter/detail/message/post/account path checks
- map cleanup / selection sync regression checks
- warning hygiene review for web and native

Completion criteria for a phase:
- the feature works in the target surface
- the implementation matches the plan
- no known broken interaction is left behind

## Phase 10: Guidance refresh follow-through
Goal: make the repo easier to work in after this rewrite.

Work items:
1. Convert the best operating rules into durable repo guidance surfaces.
2. Keep memory notes short and useful.
3. Prefer skills/rules/agents for ongoing discipline instead of bloated markdown handoffs.
4. Make future work start from the new design/spec rather than the legacy docs.

## Recommended implementation order
1. Shell and navigation contract
2. Shared domain/data layer
3. Discovery rewrite
4. Detail/action flows
5. Backend/database extensions
6. Secondary surfaces
7. Polish and verification
8. Guidance refresh follow-through

## Immediate next actions
- inspect current frontend feature boundaries in `ui/src/`
- map current frontend calls to backend routes and models
- identify the minimal backend extensions needed for the first full flow
- start the shared domain layer if it does not already exist
