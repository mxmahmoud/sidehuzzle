/**
 * Semantic design tokens aligned with product_ui_ssot.json visual_design_system.semantic_tokens
 * Supports both dark and light modes.
 */

export type ThemeColors = {
  surface_primary: string;
  surface_secondary: string;
  surface_elevated: string;
  surface_overlay: string;
  surface_selected: string;
  text_primary: string;
  text_secondary: string;
  accent_primary: string;
  accent_positive: string;
  accent_warning: string;
  border_subtle: string;
  pin_job: string;
  pin_worker: string;
};

export const colors = {
  dark: {
    surface_primary: '#0A0C10',
    surface_secondary: '#0F131A',
    surface_elevated: 'rgba(18, 24, 33, 0.78)',
    surface_overlay: 'rgba(4, 6, 10, 0.72)',
    surface_selected: 'rgba(34, 46, 62, 0.92)',
    text_primary: '#F5F7FB',
    text_secondary: 'rgba(212, 220, 233, 0.76)',
    accent_primary: '#D8B46A',
    accent_positive: '#39D08F',
    accent_warning: '#7CC7FF',
    border_subtle: 'rgba(255, 255, 255, 0.10)',
    pin_job: '#7CC7FF',
    pin_worker: '#D8B46A',
  },
  light: {
    surface_primary: '#FFFFFF',
    surface_secondary: '#F4F4F5',
    surface_elevated: '#ECEDEF',
    surface_overlay: 'rgba(255,255,255,0.92)',
    surface_selected: '#E8EEFF',
    text_primary: '#121826',
    text_secondary: '#647085',
    accent_primary: '#3D5AFE',
    accent_positive: '#059669',
    accent_warning: '#D97706',
    border_subtle: '#D9DDE5',
    pin_job: '#1D4ED8',
    pin_worker: '#DB2777',
  },
} as const;

export const shadow = {
  card: {
    boxShadow: '0px 18px 48px rgba(0, 0, 0, 0.28)',
  },
  soft: {
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.16)',
  },
} as const;

export const radius = {
  card: 22,
  sheet: 32,
  chip: 999,
  button: 16,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const shadow = {
  card: {
    boxShadow: '0px 18px 48px rgba(0, 0, 0, 0.28)',
  },
  soft: {
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.16)',
  },
} as const;

export const type = {
  title: { fontSize: 22, fontWeight: '700' as const },
  subtitle: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  price: { fontSize: 18, fontWeight: '700' as const },
};
