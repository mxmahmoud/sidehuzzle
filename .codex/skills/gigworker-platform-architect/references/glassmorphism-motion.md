# Liquid Glass And Motion

## Direction

Use React Native Reusables-compatible liquid glass as a disciplined material system: translucent surfaces, real blur, adaptive tint, depth, light, reflection, crisp hierarchy, and readable foreground content. Prefer capabilities and patterns from `founded-labs/react-native-reusables` when compatible with the current Expo, NativeWind, and React Native setup. Keep web, iOS, and Android fallbacks in the same visual language.

Source guidance to preserve:

- React Native Reusables registry components provide generic primitives. SideHuzle compositions provide product-specific surfaces, shells, overlays, navigation, buttons, forms, and map utilities.
- NativeWind/Tailwind is the styling bridge. Keep the shadcn preset `b5KJfbz06` as visual/token guidance only: compact radius, mist neutrals, clear blue accent, readable typography, and translucent navigation.
- FlyonUI's glass recipe maps to SideHuzle as translucent fill, backdrop blur, subtle border, soft shadow, and foreground contrast.
- Apple-style material guidance maps to SideHuzle as functional depth, adaptive tint, sparing use, readable layers, and reduce-transparency or stronger-fill fallbacks.
- Do not reintroduce removed component systems or one-off custom glass/button stacks.

Source links:

- FlyonUI glassmorphism with Tailwind: https://flyonui.com/blog/glassmorphism-with-tailwind-css/
- Apple Human Interface Guidelines, Materials: https://developer.apple.com/design/human-interface-guidelines/materials
- Apple Liquid Glass overview: https://developer.apple.com/documentation/technologyoverviews/liquid-glass
- Apple custom Liquid Glass views: https://developer.apple.com/documentation/SwiftUI/Applying-Liquid-Glass-to-custom-views

## Glass Rules

- Use glass for navigation, key panels, overlays, bottom sheets, search/filter surfaces, and elevated controls.
- Use blur-backed backdrops behind anchored dropdowns, filter panels, popovers, drawers, and hover surfaces. The backdrop should close on outside click, route blur, primary nav click, close action, apply, or reset.
- Keep one active overlay layer at a time. Avoid overlapping anchored drawers, dropdowns, or tab scenes.
- Use material tiers consistently: `chrome`, `input`, `sheet`, `control`, `controlSelected`, and `backdrop`.
- Secondary, icon, chip, navigation, and map utility buttons can use glass. Primary and destructive CTAs should stay more opaque for trust, contrast, and accessibility.
- Pair transparency with strong contrast, readable text, and solid fallback backgrounds.
- Use depth sparingly. Too many translucent layers make the product feel fragile and reduce trust.
- Use stronger dimming behind clear overlays when the map/list background is visually busy.
- Avoid decorative blur blobs, gradient orbs, and one-note color washes. Prefer functional layered materials over background gimmicks.
- Keep radius restrained and consistent. Use sharper premium geometry unless an approved design system says otherwise.
- Ensure forms, pricing, payment, booking, and safety states remain clearer than the visual effect.

## Tailwind And Tokens

- Prefer tokenized utility styling over one-off inline styles when it makes the UI more coherent.
- Consider Tailwind or NativeWind if it can support shared React Native styling on web, iOS, and Android without degrading native feel.
- Build reusable glass, button, input, sheet, nav, card, list, and status primitives by composing React Native Reusables-style components before spreading repeated utility strings everywhere.
- Keep the design system inspectable: semantic tokens, variant names, spacing scale, motion durations, elevation, blur levels, and accessibility states.
- `ui/src/components/ui` should remain registry-owned. Put SideHuzle-specific compositions in `ui/src/components/side`.
- Keep local `StyleSheet.create` and inline style escape hatches limited to maps, blur wrappers, runtime animation, platform sizing, or unsupported native CSS.

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
- Preserve Leaflet on web and native maps on iOS/Android.
- Every UI visual review must include Playwright screenshots for dark and light mode. For responsive surfaces, capture both desktop and mobile before approving the change.
