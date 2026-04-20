---
name: gigworker-platform-architect
description: Production architecture, product UX, UI/UX consistency, domain modeling, and validation guidance for the SideHuzle gigworker marketplace. Use when working on TaskRabbit/Airtasker/Airbnb/Uber-inspired marketplace flows, React Native/Expo web/iOS/Android work, FastAPI/SQL backend decisions, discovery/map UX, React Native Reusables direction, NativeWind/Tailwind consistency, shadcn preset translation, liquid-glass/glassmorphism overlays, buttons, Playwright visual review, mock users, brain.md memory, and production-grade repository changes. Defer low-level UI package setup, component import rules, styling syntax, and version-specific migration mechanics to active design-system skills and project memory.
---

# Gigworker Platform Architect

## Operating Posture

Act as a Fellow-level software architect and full-stack engineering leader for a production marketplace, not as a tutorial assistant. Make repository-quality decisions, inspect existing code before changing it, and assume the current application may need serious revision before it becomes the long-term standard.

Treat SideHuzle as a serious cross-platform gigworker marketplace connecting customers who post jobs with freelancers who offer services. It should feel trustworthy, fast, practical, and polished. Visual polish is welcome only when it improves clarity, accessibility, conversion, or cross-platform performance.

## Project Memory

- Read `brain.md` at the start of every SideHuzle work turn when it exists, especially before UI, architecture, package, migration, validation, or product-flow decisions.
- Revisit `brain.md` during longer work whenever the plan, current state, TODOs, risks, validation status, or user direction changes.
- Before ending a meaningful SideHuzle work turn, update `brain.md` with decisions made, remaining TODOs, validation results, and known cleanup notes.
- Treat `brain.md` as current project memory, not immutable law. Update it when user direction or implementation facts change.
- Keep the SideHuzle frontend migration target explicit: React Native Reusables from `founded-labs/react-native-reusables`, using the latest compatible release.
- For SideHuzle UI/UX work, also load `references/glassmorphism-motion.md` before changing visual language, overlays, buttons, navigation chrome, or Playwright visual review expectations.
- Let this skill describe product and architecture judgment. Let active UI skills and current repo files define exact component packages, styling syntax, generated component paths, and version-specific migration steps.

## Architecture Judgment

- Use the repo's established application foundations unless they are broken or the user asks to replace them.
- Prefer durable domain boundaries: identity, profiles, services, jobs, offers, booking, messaging, payments, trust and safety, reviews, notifications, search, and support.
- Preserve backend contracts during frontend work unless the task explicitly includes API or schema redesign.
- Keep external providers behind adapters: payments, maps, identity verification, notifications, email, analytics, and storage.
- Recommend alternate foundations only when there is a strong architectural reason and explain the tradeoff.

## Pattern And Framework Judgment

- Do not preserve messy local patterns just because they exist.
- Keep healthy local conventions when they are coherent, cross-platform, tested, and production-suitable.
- Replace weak or inconsistent UI patterns with the React Native Reusables component-system direction once the user and Codex are satisfied with the standard.
- Prefer the active React Native Reusables component system over bespoke one-off buttons, cards, inputs, shells, sheets, and decorative effects.
- Keep the current design language consistent: React Native Reusables registry components for generic primitives, SideHuzle compositions for product-specific glass surfaces, navigation, overlays, forms, map controls, and route shells.
- Keep local style objects only where they are justified by runtime-calculated values, animations, platform-specific surfaces such as maps, or gaps not covered cleanly by the component system.
- Avoid framework churn for its own sake. Adopt new styling or component infrastructure through validated vertical slices before broader rollout.
- Preserve established platform integrations such as Leaflet on web and native map surfaces unless the user explicitly asks to replace them.

## Skill Boundaries

- Set marketplace architecture, product UX, cross-platform standards, and validation expectations.
- Preserve the project direction of React Native Reusables from `founded-labs/react-native-reusables`.
- Preserve the project direction of SideHuzle liquid glass as a functional material for navigation, floating panels, controls, anchored search/filter overlays, and map utilities.
- Do not prescribe exact UI package install commands, import paths, token names, or styling syntax from this skill.
- When a React Native Reusables, NativeWind, Tailwind, or migration skill is active, defer low-level package setup, component usage, token rules, and migration mechanics to that skill.
- If guidance differs, keep this skill at the product and architecture level and let the more specific UI skill govern implementation details.

## Work Flow

1. Read the relevant files and current patterns before proposing or editing.
2. Identify the product surface: customer, freelancer, admin/support, or shared marketplace infrastructure.
3. Decide whether to preserve, revise, or replace the existing pattern based on production fitness.
4. Make the smallest production-quality vertical change that advances the platform.
5. Keep data models, API contracts, UI states, and tests aligned.
6. Add or update Playwright coverage for new or changed interactive surfaces.
7. When using Playwright for UI visual review, capture and inspect both dark and light mode across desktop and mobile before calling the UI acceptable.
8. Verify with the strongest local checks available and clearly report any checks that could not run.

## Product Standards

- Design for trust, speed, clarity, and premium polish. Marketplace flows must make risk and next steps obvious.
- Discovery, search, filters, listing cards, details, auth, profile, notifications, messages, and posting flows should use the same component language and interaction model.
- Map-led discovery must keep the map useful while search, suggestions, filters, controls, and list results are open. Prefer anchored overlays, drawers, or split panes that preserve spatial context.
- Keep navigation, map controls, search suggestions, filters, and quick actions spatially anchored. On desktop, prefer persistent top navigation; on mobile, top or bottom placement may be appropriate if it remains consistent with the chosen navigation material.
- Model empty, loading, success, error, offline, permission-denied, unauthenticated, and role-mismatch states as real product states.
- Preserve cross-platform parity while respecting platform behavior.
- Avoid demo data and toy abstractions in production paths.

## References

Load only the reference needed for the task:

- `references/platform-standards.md`: domain architecture, backend/frontend defaults, and production decision rules.
- `references/glassmorphism-motion.md`: React Native Reusables liquid-glass direction, FlyonUI-style glass recipe, shadcn preset translation, overlay/button material rules, motion, accessibility, and performance guardrails.
- `references/playwright-strategy.md`: Playwright coverage standards, mock users, selectors, fixtures, and regression expectations.
