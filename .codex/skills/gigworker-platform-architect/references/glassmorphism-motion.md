# Glassmorphism And Motion

## Direction

Use glassmorphism as a disciplined material system: translucent surfaces, blur, depth, light, reflection, and crisp hierarchy. The product should feel sleek, premium, modern, and tactile without becoming noisy or illegible.

## Glass Rules

- Use glass for navigation, key panels, overlays, bottom sheets, search/filter surfaces, and elevated controls.
- Pair transparency with strong contrast, readable text, and solid fallback backgrounds.
- Use depth sparingly. Too many translucent layers make the product feel fragile and reduce trust.
- Avoid decorative blur blobs, gradient orbs, and one-note color washes. Prefer functional layered materials over background gimmicks.
- Keep radius restrained and consistent. Use sharper premium geometry unless an approved design system says otherwise.
- Ensure forms, pricing, payment, booking, and safety states remain clearer than the visual effect.

## Tailwind And Tokens

- Prefer tokenized utility styling over one-off inline styles when it makes the UI more coherent.
- Consider Tailwind or NativeWind if it can support shared React Native styling on web, iOS, and Android without degrading native feel.
- Build reusable glass, button, input, sheet, nav, card, list, and status primitives before spreading repeated utility strings everywhere.
- Keep the design system inspectable: semantic tokens, variant names, spacing scale, motion durations, elevation, blur levels, and accessibility states.

## Palette And Typography

- Avoid dominant purple/purple-blue gradient, beige/cream/sand/tan, dark blue/slate, and brown/orange/espresso themes.
- Use a balanced palette with neutral glass surfaces, confident accent colors, and semantic status colors.
- Do not use negative letter spacing.
- Do not scale font size directly with viewport width.
- Make long labels fit across mobile and desktop without clipping.

## Motion Rules

- Use animation to communicate cause and effect: screen transitions, opening panels, selection, drag, progress, submit, success, error, and live marketplace updates.
- Prefer shared primitives such as React Native Reanimated, Animated, or the repo's established motion utilities.
- Keep animations fast and interruptible. Avoid blocking core actions behind flourish.
- Respect reduced-motion settings.
- Stabilize layout dimensions before animating. Hover, loading, error, and success states should not shift boards, cards, grids, toolbars, or primary actions.
- Test animated components after transitions settle, and add reduced-motion paths for deterministic automation.

## Cross-Platform Implementation

- Prefer React Native primitives and platform-aware wrappers that work on web, iOS, and Android.
- Use blur/material APIs only through reusable components with fallbacks.
- Keep glass components accessible: roles, labels, hit targets, focus rings, keyboard flow, and screen reader labels.
- Avoid nested cards. Use glass as a surface material, not as a reason to stack framed boxes.
