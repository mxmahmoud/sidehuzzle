/**
 * Sidehuzle semantic design tokens.
 *
 * The palette keeps the marketplace readable, map-led, and accessible in both
 * light and dark modes.
 */

export type ThemeColors = {
  background: string;
  background_alt: string;
  surface_primary: string;
  surface_secondary: string;
  surface_elevated: string;
  surface_overlay: string;
  surface_selected: string;
  text_primary: string;
  text_secondary: string;
  text_muted: string;
  accent_primary: string;
  accent_primary_strong: string;
  accent_positive: string;
  accent_warning: string;
  accent_danger: string;
  border_subtle: string;
  border_glass: string;
  border_strong: string;
  glass_surface: string;
  glass_elevated: string;
  glass_chrome: string;
  glass_input: string;
  glass_sheet: string;
  glass_control: string;
  glass_control_selected: string;
  glass_backdrop: string;
  glass_border: string;
  glass_border_top: string;
  glass_blur_surface: number;
  glass_blur_elevated: number;
  glass_blur_chrome: number;
  glass_blur_input: number;
  glass_blur_sheet: number;
  glass_blur_control: number;
  glass_blur_backdrop: number;
  pin_job: string;
  pin_worker: string;
  star: string;
};

export const colors = {
  dark: {
    background: '#090A0A',
    background_alt: '#101211',
    surface_primary: 'rgba(31, 34, 32, 0.62)',
    surface_secondary: 'rgba(48, 51, 48, 0.66)',
    surface_elevated: 'rgba(34, 37, 35, 0.72)',
    surface_overlay: 'rgba(11, 12, 12, 0.72)',
    surface_selected: 'rgba(139, 213, 111, 0.18)',
    text_primary: '#F5F6F3',
    text_secondary: '#C2C9C1',
    text_muted: '#8F998F',
    accent_primary: '#8BD56F',
    accent_primary_strong: '#66BE4B',
    accent_positive: '#8BD56F',
    accent_warning: '#F3B95F',
    accent_danger: '#FF6467',
    border_subtle: 'rgba(255, 255, 255, 0.08)',
    border_glass: 'rgba(255, 255, 255, 0.16)',
    border_strong: 'rgba(255, 255, 255, 0.26)',
    glass_surface: 'rgba(34, 37, 35, 0.26)',
    glass_elevated: 'rgba(39, 42, 39, 0.34)',
    glass_chrome: 'rgba(42, 45, 42, 0.25)',
    glass_input: 'rgba(44, 47, 44, 0.30)',
    glass_sheet: 'rgba(43, 46, 43, 0.42)',
    glass_control: 'rgba(50, 53, 50, 0.20)',
    glass_control_selected: 'rgba(139, 213, 111, 0.11)',
    glass_backdrop: 'rgba(8, 10, 9, 0.24)',
    glass_border: 'rgba(255, 255, 255, 0.16)',
    glass_border_top: 'rgba(255, 255, 255, 0.32)',
    glass_blur_surface: 48,
    glass_blur_elevated: 56,
    glass_blur_chrome: 54,
    glass_blur_input: 46,
    glass_blur_sheet: 64,
    glass_blur_control: 52,
    glass_blur_backdrop: 34,
    pin_job: '#FF7A59',
    pin_worker: '#70A7FF',
    star: '#F3B95F',
  },
  light: {
    background: '#F6F7F4',
    background_alt: '#EEF1ED',
    surface_primary: 'rgba(255, 255, 255, 0.62)',
    surface_secondary: 'rgba(239, 242, 238, 0.70)',
    surface_elevated: 'rgba(255, 255, 255, 0.74)',
    surface_overlay: 'rgba(247, 249, 246, 0.74)',
    surface_selected: 'rgba(72, 125, 62, 0.13)',
    text_primary: '#111411',
    text_secondary: '#505B51',
    text_muted: '#687268',
    accent_primary: '#487D3E',
    accent_primary_strong: '#36672E',
    accent_positive: '#487D3E',
    accent_warning: '#B45309',
    accent_danger: '#B9382F',
    border_subtle: 'rgba(17, 20, 17, 0.08)',
    border_glass: 'rgba(17, 20, 17, 0.11)',
    border_strong: 'rgba(17, 20, 17, 0.18)',
    glass_surface: 'rgba(255, 255, 255, 0.28)',
    glass_elevated: 'rgba(255, 255, 255, 0.36)',
    glass_chrome: 'rgba(255, 255, 255, 0.30)',
    glass_input: 'rgba(255, 255, 255, 0.36)',
    glass_sheet: 'rgba(255, 255, 255, 0.44)',
    glass_control: 'rgba(255, 255, 255, 0.22)',
    glass_control_selected: 'rgba(72, 125, 62, 0.08)',
    glass_backdrop: 'rgba(232, 236, 230, 0.26)',
    glass_border: 'rgba(255, 255, 255, 0.62)',
    glass_border_top: 'rgba(255, 255, 255, 0.80)',
    glass_blur_surface: 46,
    glass_blur_elevated: 54,
    glass_blur_chrome: 52,
    glass_blur_input: 42,
    glass_blur_sheet: 62,
    glass_blur_control: 50,
    glass_blur_backdrop: 32,
    pin_job: '#D95F3D',
    pin_worker: '#2563EB',
    star: '#D79A13',
  },
} as const;

export const radius = {
  card: 8,
  sheet: 8,
  chip: 8,
  button: 8,
  input: 8,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const shadow = {
  card: {
    boxShadow: '0px 18px 54px rgba(8, 10, 9, 0.18), inset 0px 1px 0px rgba(255,255,255,0.24)',
  },
  soft: {
    boxShadow: '0px 10px 30px rgba(8, 10, 9, 0.12), inset 0px 1px 0px rgba(255,255,255,0.18)',
  },
  chrome: {
    boxShadow: '0px 14px 40px rgba(8, 10, 9, 0.14), inset 0px 1px 0px rgba(255,255,255,0.22)',
  },
  hover: {
    boxShadow: '0px 24px 70px rgba(8, 10, 9, 0.20), 0px 0px 0px 1px rgba(255,255,255,0.14), inset 0px 1px 0px rgba(255,255,255,0.30)',
  },
} as const;

export const motion = {
  fastMs: 150,
  standardMs: 220,
  slowMs: 300,
  easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const type = {
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const, letterSpacing: 0 },
  headline: { fontSize: 30, lineHeight: 36, fontWeight: '800' as const, letterSpacing: 0 },
  subtitle: { fontSize: 17, lineHeight: 24, fontWeight: '700' as const, letterSpacing: 0 },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const, letterSpacing: 0 },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const, letterSpacing: 0 },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '700' as const, letterSpacing: 0 },
  price: { fontSize: 18, lineHeight: 24, fontWeight: '800' as const, letterSpacing: 0 },
};
