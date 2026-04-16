/**
 * Sidehuzle semantic design tokens.
 *
 * The palette follows the UI/UX Pro Max liquid-glass direction while keeping the
 * marketplace readable, map-led, and accessible in both light and dark modes.
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
  glass_border: string;
  glass_border_top: string;
  glass_blur_surface: number;
  glass_blur_elevated: number;
  glass_blur_chrome: number;
  glass_blur_input: number;
  glass_blur_sheet: number;
  pin_job: string;
  pin_worker: string;
  star: string;
};

export const colors = {
  dark: {
    background: '#17211E',
    background_alt: '#1D2925',
    surface_primary: 'rgba(28, 40, 36, 0.68)',
    surface_secondary: 'rgba(22, 31, 28, 0.90)',
    surface_elevated: 'rgba(35, 50, 45, 0.62)',
    surface_overlay: 'rgba(15, 23, 20, 0.72)',
    surface_selected: 'rgba(77, 208, 178, 0.18)',
    text_primary: '#F6F8F4',
    text_secondary: '#B7C4BD',
    text_muted: '#83918B',
    accent_primary: '#4DD0B2',
    accent_primary_strong: '#14B89A',
    accent_positive: '#37C978',
    accent_warning: '#F3B95F',
    accent_danger: '#FF6B5A',
    border_subtle: 'rgba(255, 255, 255, 0.12)',
    border_glass: 'rgba(255, 255, 255, 0.18)',
    border_strong: 'rgba(255, 255, 255, 0.30)',
    glass_surface: 'rgba(28, 40, 36, 0.48)',
    glass_elevated: 'rgba(35, 50, 45, 0.58)',
    glass_chrome: 'rgba(24, 35, 31, 0.60)',
    glass_input: 'rgba(21, 31, 28, 0.48)',
    glass_sheet: 'rgba(28, 40, 36, 0.72)',
    glass_border: 'rgba(255, 255, 255, 0.22)',
    glass_border_top: 'rgba(255, 255, 255, 0.40)',
    glass_blur_surface: 22,
    glass_blur_elevated: 30,
    glass_blur_chrome: 22,
    glass_blur_input: 16,
    glass_blur_sheet: 34,
    pin_job: '#FF7A59',
    pin_worker: '#70A7FF',
    star: '#F3B95F',
  },
  light: {
    background: '#F7FBF8',
    background_alt: '#EAF4EF',
    surface_primary: 'rgba(255, 255, 255, 0.62)',
    surface_secondary: 'rgba(241, 248, 244, 0.88)',
    surface_elevated: 'rgba(255, 255, 255, 0.72)',
    surface_overlay: 'rgba(255, 255, 255, 0.84)',
    surface_selected: 'rgba(15, 118, 110, 0.12)',
    text_primary: '#13201B',
    text_secondary: '#52635B',
    text_muted: '#718179',
    accent_primary: '#0F766E',
    accent_primary_strong: '#0B5F59',
    accent_positive: '#0E7A4F',
    accent_warning: '#B45309',
    accent_danger: '#B9382F',
    border_subtle: 'rgba(19, 32, 27, 0.10)',
    border_glass: 'rgba(255, 255, 255, 0.92)',
    border_strong: 'rgba(19, 32, 27, 0.20)',
    glass_surface: 'rgba(255, 255, 255, 0.52)',
    glass_elevated: 'rgba(255, 255, 255, 0.68)',
    glass_chrome: 'rgba(255, 255, 255, 0.58)',
    glass_input: 'rgba(255, 255, 255, 0.54)',
    glass_sheet: 'rgba(255, 255, 255, 0.74)',
    glass_border: 'rgba(255, 255, 255, 0.92)',
    glass_border_top: 'rgba(255, 255, 255, 0.98)',
    glass_blur_surface: 22,
    glass_blur_elevated: 30,
    glass_blur_chrome: 22,
    glass_blur_input: 16,
    glass_blur_sheet: 34,
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
    boxShadow: '0px 18px 48px rgba(17, 41, 34, 0.16), inset 0px 1px 0px rgba(255,255,255,0.30)',
  },
  soft: {
    boxShadow: '0px 10px 26px rgba(17, 41, 34, 0.11), inset 0px 1px 0px rgba(255,255,255,0.22)',
  },
  chrome: {
    boxShadow: '0px 12px 34px rgba(17, 41, 34, 0.14), inset 0px 1px 0px rgba(255,255,255,0.30)',
  },
  hover: {
    boxShadow: '0px 26px 70px rgba(17, 41, 34, 0.24), 0px 0px 0px 1px rgba(255,255,255,0.18), inset 0px 1px 0px rgba(255,255,255,0.42)',
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
