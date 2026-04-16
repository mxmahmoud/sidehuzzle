import { Platform, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useThemeColors } from '@/theme/useThemeColors';
import { motion, radius, space } from '@/theme/tokens';

type Props = {
  children: React.ReactNode;
  error?: string;
  style?: StyleProp<ViewStyle>;
};

export function GlassInputFrame({ children, error, style }: Props) {
  const c = useThemeColors();

  return (
    <View
      style={[
        styles.frame,
        {
          backgroundColor: c.glass_input,
          borderColor: error ? c.accent_warning : c.glass_border,
          borderTopColor: error ? c.accent_warning : c.glass_border_top,
        },
        Platform.OS === 'web' ? styles.webGlass : undefined,
        style,
      ]}
    >
      {children}
      {error ? <Text style={[styles.errorText, { color: c.accent_warning }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1,
    borderRadius: radius.input,
    overflow: 'hidden',
  },
  webGlass: {
    // @ts-ignore web-only glass
    WebkitBackdropFilter: 'blur(16px)',
    backdropFilter: 'blur(16px)',
    transitionDuration: `${motion.fastMs}ms`,
    transitionProperty: 'border-color, background-color, box-shadow',
    transitionTimingFunction: motion.easeOut,
  } as ViewStyle,
  errorText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
  },
});
