import { describe, expect, it } from 'vitest';
import { colors, radius, shadow, space, type } from './tokens';

describe('dark luxury tokens', () => {
  it('exposes the updated dark luxury glass theme contract', () => {
    expect(colors.dark).toEqual({
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
    });

    expect(shadow).toEqual({
      card: { boxShadow: '0px 18px 48px rgba(0, 0, 0, 0.28)' },
      soft: { boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.16)' },
    });

    expect(radius).toEqual({
      card: 22,
      sheet: 32,
      chip: 999,
      button: 16,
    });

    expect(space).toEqual({
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
    });

    expect(type).toEqual({
      title: { fontSize: 22, fontWeight: '700' },
      subtitle: { fontSize: 16, fontWeight: '600' },
      body: { fontSize: 15, fontWeight: '400' },
      caption: { fontSize: 13, fontWeight: '500' },
      price: { fontSize: 18, fontWeight: '700' },
    });
  });
});
