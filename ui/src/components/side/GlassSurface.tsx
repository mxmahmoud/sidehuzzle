import type { ReactNode } from 'react';
import { Platform, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { cn } from '@/lib/utils';
import { shadow } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';

export type GlassSurfaceVariant = 'surface' | 'elevated' | 'chrome' | 'input' | 'sheet' | 'control' | 'controlSelected' | 'backdrop';

type Props = {
  children: ReactNode;
  variant?: GlassSurfaceVariant;
  selected?: boolean;
  disabled?: boolean;
  pressable?: boolean;
  onPress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link' | 'summary' | 'adjustable' | 'none' | 'image' | 'keyboardkey' | 'text';
};

const variantClass: Record<GlassSurfaceVariant, string> = {
  surface: 'border-border',
  elevated: 'border-border shadow-hard-5',
  chrome: 'border-border',
  input: 'border-input',
  sheet: 'border-border shadow-hard-5',
  control: 'border-border',
  controlSelected: 'border-primary',
  backdrop: 'border-transparent',
};

function blurTint() {
  return Platform.OS === 'web' ? 'systemMaterial' : 'systemThinMaterial';
}

export function GlassSurface({
  children,
  variant = 'surface',
  selected,
  disabled,
  pressable,
  onPress,
  className,
  style,
  testID,
  accessibilityLabel,
  accessibilityRole,
}: Props) {
  const c = useThemeColors();
  const backgroundByVariant: Record<GlassSurfaceVariant, string> = {
    surface: c.glass_surface,
    elevated: c.glass_elevated,
    chrome: c.glass_chrome,
    input: c.glass_input,
    sheet: c.glass_sheet,
    control: c.glass_control,
    controlSelected: c.glass_control_selected,
    backdrop: c.glass_backdrop,
  };
  const blurByVariant: Record<GlassSurfaceVariant, number> = {
    surface: c.glass_blur_surface,
    elevated: c.glass_blur_elevated,
    chrome: c.glass_blur_chrome,
    input: c.glass_blur_input,
    sheet: c.glass_blur_sheet,
    control: c.glass_blur_control,
    controlSelected: c.glass_blur_control,
    backdrop: c.glass_blur_backdrop,
  };
  const blur = blurByVariant[variant];
  const materialStyle = [
    {
      backgroundColor: selected ? c.surface_selected : backgroundByVariant[variant],
      borderColor: selected || variant === 'controlSelected' ? c.accent_primary : variant === 'input' ? c.border_strong : variant === 'backdrop' ? 'transparent' : c.glass_border,
    },
    Platform.OS === 'web'
      ? ({
          boxShadow:
            variant === 'elevated' || variant === 'sheet'
              ? shadow.card.boxShadow
              : variant === 'chrome' || variant === 'control' || variant === 'controlSelected'
                ? shadow.chrome.boxShadow
                : shadow.soft.boxShadow,
          WebkitBackdropFilter: `blur(${blur}px) saturate(165%)`,
          backdropFilter: `blur(${blur}px) saturate(165%)`,
        } as ViewStyle)
      : variant === 'elevated' || variant === 'sheet' || variant === 'chrome'
        ? ({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.18,
            shadowRadius: 24,
            elevation: 10,
          } as ViewStyle)
        : undefined,
    style,
  ] as StyleProp<ViewStyle>;

  const surfaceClassName = cn(
    'relative overflow-hidden rounded-lg border p-side-md',
    variantClass[variant],
    Platform.OS === 'web' ? 'web:backdrop-blur-xl' : undefined,
    selected ? 'border-primary' : undefined,
    disabled ? 'opacity-50' : undefined,
    className,
  );

  const content = (
    <>
      {Platform.OS !== 'web' ? (
        <BlurView
          pointerEvents="none"
          intensity={blur}
          tint={blurTint() as never}
          style={[{ position: 'absolute', inset: 0 } as ViewStyle]}
        />
      ) : null}
      <View pointerEvents="none" className="absolute inset-0 border-t opacity-80" style={{ borderColor: c.glass_border_top }} />
      {children}
    </>
  );

  if (pressable) {
    return (
      <Pressable
        testID={testID}
        disabled={disabled || !onPress}
        onPress={onPress}
        accessibilityRole={accessibilityRole ?? 'button'}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: !!disabled, selected: !!selected }}
        className={cn(surfaceClassName, 'web:cursor-pointer')}
        style={materialStyle}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View testID={testID} className={surfaceClassName} style={materialStyle}>
      {content}
    </View>
  );
}
