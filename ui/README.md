# Sidehuzle UI (Expo / React Native)

Cross-platform client (**iOS**, **Android**, **web**) aligned with the product SSOT at the repo root [`product_ui_ssot.json`](../product_ui_ssot.json).

## Runtime versions

- **Expo SDK**: `56.x` canary (see `expo` in `package.json`).
- **React Native**: `0.84.x` (pinned by the canary SDK via `npx expo install --fix`).
- **New Architecture** only (Expo SDK 55+ default).

Canary builds can change without notice; prefer **development builds** for anything beyond quick iteration. **Expo Go** often lags or mismatches canary SDKs.

## Commands

```bash
cd ui
npm install
npm run start          # dev server
npm run web            # same as expo start --web
npm run ios            # simulator (macOS + Xcode)
npm run android        # emulator / device
```

Static web export:

```bash
npx expo export --platform web
```

Output is written to `dist/`.

## SSOT assets and codegen

- A copy of the SSOT lives at [`src/ssot/product_ui_ssot.json`](src/ssot/product_ui_ssot.json) for bundling and tooling.
- Generated types and modal metadata: [`src/ssot/generated/pageRegistry.ts`](src/ssot/generated/pageRegistry.ts).
- Regenerate registry **and** auto-generated stub routes from the repo root:

  ```bash
  python3 scripts/emit_ui_ssot_registry.py
  ```

  Or, after editing [`scripts/build_ui_ssot.py`](../scripts/build_ui_ssot.py):

  ```bash
  python3 scripts/build_ui_ssot.py --emit-ui-registry
  ```

  **Note:** the emitter **skips** hand-maintained route files (landing, map, auth, guest-gated tabs, etc.). See `HAND_AUTHORED` in [`scripts/emit_ui_ssot_registry.py`](../scripts/emit_ui_ssot_registry.py).

From inside `ui/`:

```bash
npm run ssot:emit
```

## Architecture (SSOT `implementation_foundation`)

- **Navigation**: Expo Router (`src/app/`), routes named after stable `page_id` values.
- **Async data**: TanStack Query; discovery uses mock APIs under `src/data/`.
- **UI state**: Zustand (`src/stores/`) for discovery mode, selection sync, and guest session stub.
- **Lists**: FlashList (`@shopify/flash-list`).
- **Sheets / gestures**: `react-native-reanimated`, `react-native-gesture-handler`, `@gorhom/bottom-sheet`.
- **Maps**: `react-native-maps` on iOS/Android, `react-leaflet` + `leaflet` on web. Tile requests are cached on web through `public/tile-cache-sw.js` to reduce repeated provider hits.

## Web map tiles

The web map is provider-configurable through Expo public env vars:

```bash
EXPO_PUBLIC_TILE_URL_TEMPLATE=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
EXPO_PUBLIC_TILE_ATTRIBUTION=&copy; OpenStreetMap contributors
EXPO_PUBLIC_TILE_SUBDOMAINS=abc
EXPO_PUBLIC_TILE_CACHE_HOSTS=tile.openstreetmap.org
EXPO_PUBLIC_TILE_MAX_ZOOM=19
```

Notes:

- The service worker caches `GET` tile requests for the configured hosts with a cache-first fallback-to-network strategy.
- This reduces repeat tile traffic, but it does **not** replace provider licensing or fair-use limits for first-time uncached tiles.
- For production, point these env vars at a provider with terms that match your expected traffic and offline/cache policy.

## Guest gating

`zustand` session defaults to **guest**. Messages / Post / Notifications tabs wrap content in `GuestGate`, which routes to `signup_gate`. Account shows a lightweight shell with sign-in / sign-up links. Demo flows: **Log in** or **Sign up** sets the session to signed-in.
