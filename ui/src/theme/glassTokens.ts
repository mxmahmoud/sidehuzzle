/**
 * Glassmorphism design tokens
 * Proper light/dark glass surfaces with semantic blur, opacity, and border values
 * Following ui-ux-pro-max glassmorphism style guidelines
 */

export type GlassVariant = 'surface' | 'elevated' | 'chrome' | 'input' | 'sheet';

export const glassBlur = {
  /** Cards, list items — moderate blur for content hierarchy */
  surface: 24,
  /** Bottom sheets, modals, overlays — stronger blur for elevation */
  elevated: 32,
  /** App bars, headers, navigation chrome */
  chrome: 20,
  /** Text inputs, form fields */
  input: 16,
  /** Bottom sheets specifically — extra blur for sheet rising from background */
  sheet: 40,
} as const;

export const glassOpacity = {
  dark: {
    /** Cards, content blocks */
    surface: { bg: 0.08, border: 0.14, borderTop: 0.22 },
    /** Elevated elements: sheets, modals */
    elevated: { bg: 0.12, border: 0.18, borderTop: 0.28 },
    /** Navigation bars, headers */
    chrome: { bg: 0.10, border: 0.16, borderTop: 0.24 },
    /** Input fields */
    input: { bg: 0.06, border: 0.12, borderTop: 0.18 },
    /** Bottom sheet — slightly more opaque to feel solid */
    sheet: { bg: 0.14, border: 0.20, borderTop: 0.32 },
  },
  light: {
    /** Light glass — more opaque white to feel premium */
    surface: { bg: 0.68, border: 0.88, borderTop: 0.95 },
    elevated: { bg: 0.75, border: 0.90, borderTop: 0.98 },
    chrome: { bg: 0.72, border: 0.85, borderTop: 0.92 },
    input: { bg: 0.60, border: 0.80, borderTop: 0.90 },
    sheet: { bg: 0.80, border: 0.92, borderTop: 0.98 },
  },
} as const;

/** Warm accent tint for selected/active glass states */
export const glassSelectedTint = {
  dark: { bg: 0.15, border: 0.45, borderTop: 0.55, color: '#D8B46A' },
  light: { bg: 0.12, border: 0.40, borderTop: 0.50, color: '#3D5AFE' },
} as const;

/** Animation timing following ux-pro-max animation guidelines (150–300ms) */
export const glassMotion = {
  /** Micro-interaction feedback (button press, toggle) */
  press: 120,
  /** State change (modal open, sheet rise) */
  state: 220,
  /** Page transition */
  transition: 300,
} as const;

/** Inner glow / highlight on top edge for premium glass feel */
export const glassHighlight = {
  dark: 'rgba(255,255,255,0.12)',
  light: 'rgba(255,255,255,0.70)',
} as const;
