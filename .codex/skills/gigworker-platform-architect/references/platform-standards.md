# Platform Standards

## Mission

Build SideHuzle as a production-grade marketplace for customers and freelancers. The product is inspired by TaskRabbit, Airtasker, Airbnb, and Uber, but should form its own opinionated system rather than cloning any one service.

## Architecture Defaults

- Frontend: shared React Native codebase targeting web, Android, and iOS.
- Backend: SQL database, FastAPI API layer, Granian runtime.
- API style: explicit contracts, typed request/response models, role-aware authorization, and predictable error envelopes.
- Data model: durable relational entities with migrations, constraints, indexes, and lifecycle state machines where state matters.
- Validation: enforce critical invariants both at API boundaries and the database layer.
- Background work: use a clear queue/job mechanism for notifications, search indexing, payment reconciliation, and trust/safety workflows when the repo introduces that infrastructure.

## Revision Posture

- Assume the current project may be messy and may need architectural and UI revision before it becomes the durable standard.
- Preserve existing code only when it is understandable, tested, cross-platform, and consistent with the intended marketplace direction.
- Prefer a deliberate new standard over continuing inconsistent hand-written styling or ad hoc abstractions.
- Adopt Tailwind, NativeWind, or Tailwind-style component primitives when they improve shared design tokens, speed, consistency, and maintainability across web, iOS, and Android.
- Validate any new styling framework or component approach through one production-quality vertical slice before broad migration.
- Once the user and Codex are satisfied with a pattern, treat it as the project standard and avoid unnecessary churn.

## Core Domains

Treat these as first-class product domains when designing schemas, APIs, or screens:

- Identity and authentication
- Customer and freelancer profiles
- Service catalogs and skills
- Job posting and request intake
- Offers, bids, booking, and scheduling
- Messaging and negotiation
- Payments, payouts, refunds, disputes, and platform fees
- Reviews, ratings, badges, verification, and trust signals
- Discovery, search, filtering, and recommendations
- Notifications across push, email, in-app, and SMS where supported
- Admin, moderation, support, fraud, and safety operations

## Marketplace Rules

- Separate customer intent from freelancer supply. A job request, service listing, offer, booking, and completed transaction should not collapse into one vague object.
- Track lifecycle states explicitly. Avoid boolean piles for workflows such as posted, offered, accepted, in-progress, completed, cancelled, disputed, refunded.
- Design for trust: verification, cancellation policies, dispute evidence, reviews, response time, and payment status should be visible where decisions happen.
- Assume multi-role accounts are possible unless the repo has decided otherwise.
- Keep external providers behind adapters: payments, maps, identity verification, notifications, email, analytics, and storage.

## Engineering Standards

- Use existing local patterns as evidence, not law.
- Keep code changes scoped and cohesive.
- Add migrations and tests with backend data model changes.
- Add API tests for authorization and state transitions, not just happy paths.
- Keep secrets and provider credentials out of source.
- Make failures observable through structured errors and logs.
- Avoid tutorial scaffolding, placeholder business logic, and "later" comments in production paths.
