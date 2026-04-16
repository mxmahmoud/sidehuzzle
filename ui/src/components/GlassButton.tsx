import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, StyleSheet, Text, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useThemeColors } from '@/theme/useThemeColors';
import { motion, radius, shadow, space } from '@/theme/tokens';

type IconName = keyof typeof Ionicons.glyphMap;

type GlassButtonVariant = 'primary' | 'secondary' | 'ghost' | 'chip' | 'icon';

type Props = {
  label?: string;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  variant?: GlassButtonVariant;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function GlassButton({
  label,
  icon,
  iconPosition = 'left',
  variant = 'secondary',
  selected,
  disabled,
  onPress,
  accessibilityLabel,
  style,
  textStyle,
}: Props) {
  const c = useThemeColors();
  const isPrimary = variant === 'primary';
  const isIconOnly = variant === 'icon' || (!label && icon);
  const fg = isPrimary ? '#FFFFFF' : selected ? c.text_primary : c.text_secondary;
  const bg = isPrimary ? c.accent_primary : selected ? c.surface_selected : variant === 'ghost' ? 'transparent' : c.glass_input;
  const border = isPrimary ? c.accent_primary_strong : selected ? c.glass_border_top : c.glass_border;
  const iconNode = icon ? <Ionicons name={icon} size={isIconOnly ? 19 : 16} color={fg} /> : null;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled, selected: !!selected }}
      style={({ hovered, pressed }) => [
        styles.base,
        isIconOnly ? styles.iconOnly : styles.withLabel,
        variant === 'chip' ? styles.chip : undefined,
        {
          backgroundColor: bg,
          borderColor: border,
          opacity: disabled ? 0.48 : 1,
        },
        Platform.OS === 'web' ? styles.motion : undefined,
        hovered && Platform.OS === 'web' && !disabled ? styles.hovered : undefined,
        pressed && !disabled ? styles.pressed : undefined,
        hovered && Platform.OS === 'web' && !disabled ? ({ cursor: 'pointer' } as ViewStyle) : undefined,
        style,
      ]}
    >
      {!isPrimary ? (
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {iconPosition === 'left' ? iconNode : null}
      {label ? <Text style={[styles.label, { color: fg }, textStyle]}>{label}</Text> : null}
      {iconPosition === 'right' ? iconNode : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderRadius: radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  withLabel: {
    flexDirection: 'row',
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
  },
  iconOnly: {
    width: 44,
    height: 44,
    padding: 0,
  },
  chip: {
    minHeight: 38,
    paddingHorizontal: space.md,
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
  },
  motion: {
    transitionDuration: `${motion.standardMs}ms`,
    transitionProperty: 'background-color, border-color, box-shadow, opacity, transform',
    transitionTimingFunction: motion.easeOut,
  } as ViewStyle,
  hovered: {
    transform: [{ translateY: -2 }],
    // @ts-ignore web-only
    boxShadow: shadow.hover.boxShadow,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.985 }],
  },
});
