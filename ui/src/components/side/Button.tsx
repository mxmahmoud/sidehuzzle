import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { Platform, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { Button as RegistryButton } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { shadow } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';

type IconName = keyof typeof Ionicons.glyphMap;
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'chip' | 'danger' | 'icon';

type Props = {
  label?: string;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  variant?: ButtonVariant;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  className?: string;
  textClassName?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
};

const variantMap: Record<ButtonVariant, React.ComponentProps<typeof RegistryButton>['variant']> = {
  primary: 'default',
  secondary: 'outline',
  ghost: 'ghost',
  chip: 'secondary',
  danger: 'destructive',
  icon: 'outline',
};

export function Button({
  label,
  icon,
  iconPosition = 'left',
  variant = 'secondary',
  selected,
  disabled,
  onPress,
  accessibilityLabel,
  className,
  textClassName,
  style,
  textStyle,
  testID,
}: Props) {
  const iconOnly = variant === 'icon' || (!label && !!icon);
  const c = useThemeColors();
  const isGlassControl = variant === 'secondary' || variant === 'chip' || variant === 'icon';
  const iconColor = variant === 'primary' ? c.background : variant === 'danger' ? '#FFFFFF' : selected ? c.accent_primary : c.text_primary;
  const iconNode = icon ? <Ionicons name={icon} size={iconOnly ? 20 : 17} color={iconColor} /> : null;
  const materialStyle = [
    isGlassControl
      ? ({
          backgroundColor: selected ? c.glass_control_selected : c.glass_control,
          borderColor: selected ? c.accent_primary : c.glass_border,
        } as ViewStyle)
      : variant === 'ghost'
        ? ({ backgroundColor: 'transparent', borderColor: 'transparent' } as ViewStyle)
        : undefined,
    Platform.OS === 'web' && isGlassControl
      ? ({
          boxShadow: shadow.chrome.boxShadow,
          WebkitBackdropFilter: `blur(${c.glass_blur_control}px) saturate(165%)`,
          backdropFilter: `blur(${c.glass_blur_control}px) saturate(165%)`,
        } as ViewStyle)
      : undefined,
    style,
  ] as StyleProp<ViewStyle>;

  return (
    <RegistryButton
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled, selected: !!selected }}
      variant={variantMap[variant]}
      size={iconOnly ? 'icon' : variant === 'chip' ? 'sm' : 'default'}
      className={cn(
        'rounded-lg',
        isGlassControl ? 'relative overflow-hidden border' : undefined,
        variant === 'primary' ? 'bg-primary' : undefined,
        variant === 'chip' ? 'min-h-[38px] px-side-md' : undefined,
        selected ? 'border-primary bg-primary/10' : undefined,
        disabled ? 'opacity-50' : undefined,
        className,
      )}
      style={materialStyle as never}
    >
      {Platform.OS !== 'web' && isGlassControl ? (
        <BlurView
          pointerEvents="none"
          intensity={c.glass_blur_control}
          tint={'systemThinMaterial' as never}
          style={{ position: 'absolute', inset: 0 } as ViewStyle}
        />
      ) : null}
      {isGlassControl ? <View pointerEvents="none" className="absolute inset-0 border-t opacity-70" style={{ borderColor: c.glass_border_top }} /> : null}
      {iconPosition === 'left' ? iconNode : null}
      {label ? (
        <Text
          className={cn(
            'text-center text-[14px] font-bold leading-[18px]',
            variant === 'primary' || variant === 'danger' ? 'text-primary-foreground' : undefined,
            selected ? 'text-primary' : undefined,
            textClassName,
          )}
          style={textStyle}
        >
          {label}
        </Text>
      ) : null}
      {iconPosition === 'right' ? iconNode : null}
    </RegistryButton>
  );
}

export function IconButton(props: Omit<Props, 'variant' | 'label'>) {
  return <Button {...props} variant="icon" />;
}

export function Chip(props: Omit<Props, 'variant'>) {
  return <Button {...props} variant="chip" />;
}
