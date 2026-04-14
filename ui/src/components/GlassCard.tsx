/**
 * GlassCard — Glassmorphism card component
 *
 * Design: Frosted-glass surface with translucent background,
 * subtle border, and blur backdrop.
 * Supports dark/light modes and multiple visual variants.
 *
 * Following ui-ux-pro-max guidelines:
 * - blur-purpose: blur indicates background dismissal, not decoration
 * - elevation-consistent: one variant = one elevation level
 * - state-clarity: pressed/selected/disabled states visually distinct
 * - animation: 120ms press feedback within 150–300ms micro-interaction window
 * - web: uses boxShadow + WebkitBackdropFilter (shadow* props deprecated on web)
 */

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useThemeColors, useIsDark } from '@/theme/useThemeColors';
import { motion, radius, shadow, space } from '@/theme/tokens';

export type GlassVariant = 'surface' | 'elevated' | 'chrome' | 'input' | 'sheet';

type GlassCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Turn into a Pressable (adds press feedback + disabled states) */
  pressable?: boolean;
  onPress?: () => void;
  /** Tint with accent color (selected/active state) */
  selected?: boolean;
  disabled?: boolean;
  /** Visual elevation variant (default: 'surface') */
  variant?: GlassVariant;
};

export function GlassCard({
  children,
  style,
  pressable,
  onPress,
  selected,
  disabled,
  variant = 'surface',
}: GlassCardProps) {
  const c = useThemeColors();
  const isDark = useIsDark();

  // Resolve glass surface colors per variant
  const bgMap: Record<GlassVariant, string> = {
    surface: c.glass_surface,
    elevated: c.glass_elevated,
    chrome: c.glass_chrome,
    input: c.glass_input,
    sheet: c.glass_sheet,
  };

  const selectedBg = c.surface_selected;
  const selectedBorder = isDark
    ? 'rgba(77,208,178,0.48)'
    : 'rgba(15,118,110,0.42)';
  const selectedBorderTop = isDark
    ? 'rgba(77,208,178,0.62)'
    : 'rgba(15,118,110,0.50)';

  const blurValue = c[`glass_blur_${variant}` as keyof typeof c] as number;
  const blurTint = isDark ? 'dark' : 'light';
  const highlightColors = isDark
    ? (['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.035)', 'rgba(255,255,255,0.02)'] as const)
    : (['rgba(255,255,255,0.86)', 'rgba(255,255,255,0.30)', 'rgba(255,255,255,0.10)'] as const);

  // Glass styles — order matters: glassStyle first, then boxShadow overrides
  const glassStyle: ViewStyle = {
    backgroundColor: selected ? selectedBg : bgMap[variant],
    borderWidth: 1,
    borderColor: selected ? selectedBorder : c.glass_border,
    borderTopColor: selected ? selectedBorderTop : c.glass_border_top,
    borderRadius: radius.card,
    padding: space.md,
    overflow: 'hidden',
    // backdrop-filter: needs -webkit- prefix for React Native Web
    backdropFilter: `blur(${blurValue}px)`,
    // @ts-ignore – web-only
    WebkitBackdropFilter: `blur(${blurValue}px)`,
    // shadow* props deprecated on web – use boxShadow for web, shadow* for native
    ...Platform.select({
      web: {
        boxShadow: shadow.card.boxShadow,
        transitionDuration: `${motion.standardMs}ms`,
        transitionProperty: 'background-color, border-color, box-shadow, opacity, transform',
        transitionTimingFunction: motion.easeOut,
      } as ViewStyle,
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 8,
      },
    }),
  };

  if (!pressable) {
    return (
      <BlurView
        intensity={blurValue}
        tint={blurTint}
        style={[
          glassStyle,
          disabled ? { opacity: 0.45 } : undefined,
          style,
        ]}
      >
        <LinearGradient
          pointerEvents="none"
          colors={highlightColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[{ opacity: selected ? 0.7 : 0.52 }, { position: 'absolute', left: 0, right: 0, top: 0, height: '58%' }]}
        />
        {children}
      </BlurView>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        glassStyle,
        pressed && !disabled ? { opacity: 0.8, transform: [{ scale: 0.985 }] } : undefined,
        disabled ? { opacity: 0.45 } : undefined,
        Platform.OS === 'web' ? ({ cursor: disabled || !onPress ? 'not-allowed' : 'pointer' } as ViewStyle) : undefined,
        style,
      ]}
      disabled={disabled || !onPress}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
    >
      <BlurView intensity={blurValue} tint={blurTint} style={StyleSheet.absoluteFill} />
      <LinearGradient
        pointerEvents="none"
        colors={highlightColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[{ opacity: selected ? 0.7 : 0.52 }, { position: 'absolute', left: 0, right: 0, top: 0, height: '58%' }]}
      />
      {children}
    </Pressable>
  );
}
