# Repo guidance refresh

## Purpose
Replace the legacy scaffold-era markdown guidance with a smaller set of durable repo instructions that better support a premium, production-grade frontend rewrite.

## Rules to keep
- Treat the backend as authoritative and professionally implemented.
- Extend the backend or database only when a real frontend flow needs it.
- Design for desktop web, mobile web, and React Native mobile as distinct layout targets.
- Keep the shared domain logic and design system consistent across surfaces.
- Build real end-to-end flows, not placeholder-first shells.
- Verify before claiming work is complete.

## Rules to drop or rewrite
- RN version arguments from the legacy docs.
- Scaffold-heavy assumptions that accept thin shell pages as acceptable deliverables.
- Prompt-style instructions that encode outdated architecture choices.
- Conflicting navigation naming and implementation-era details.

## Recommended repo guidance surfaces
1. Skills for process discipline and collaboration style.
2. Rules for project-specific standards and expectations.
3. Agents for specialized inspection, review, and verification tasks.
4. Memory for durable collaboration preferences and project direction.

## Suggested skill set for this repo
### 1. Brainstorming / design skill
Use for any new feature, significant rewrite, or ambiguous UI direction. It should force context review, one-question-at-a-time clarification, and a written design before implementation.

### 2. Writing plans skill
Use after a design is approved. It should break the approved design into an implementation plan with concrete steps and checkpoints.

### 3. Executing plans skill
Use when the plan is ready and implementation should proceed in a controlled way.

### 4. Systematic debugging skill
Use when a bug, warning, or unexpected behavior appears. It should require root-cause analysis before fixes.

### 5. Verification-before-completion skill
Use before claiming anything is finished. It should require evidence from tests, builds, or runtime checks.

### 6. Writing skills skill
Use when creating or updating repo-specific skills so the harness behavior stays aligned with this project.

## Suggested repo-specific rules
- Do not start implementation before a design has been written and accepted.
- Do not treat generated SSOT pages as sufficient if the user wants polished production UX.
- Do not invent frontend behavior that the backend cannot support without making the backend extension explicit.
- Prefer small, well-bounded feature modules over broad accidental coupling.
- Preserve premium interaction quality over mechanical completeness.

## Suggested agents for this repo
- general-purpose agent for inspections and research
- code-review agent for finished implementation chunks
- debugging agent for runtime or test failures
- optional parallel inspection agents when discovery and backend review can be done independently

## Durable memory worth keeping
- The project direction is a premium, map-first marketplace app.
- The rewrite is expected to work across desktop web, mobile web, and React Native mobile.
- The browser should be able to run through the full journey.
- The user prefers direct, local work and does not want git pushes.
