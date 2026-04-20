import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Platform, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/theme/useThemeColors';

type Props = {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  blur?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function GlassBackdrop({ children, className, contentClassName, blur = true, onPress, style, testID }: Props) {
  const c = useThemeColors();
  const backdropStyle = [
    {
      backgroundColor: blur ? c.glass_backdrop : 'transparent',
    },
    Platform.OS === 'web' && blur
      ? ({
          WebkitBackdropFilter: `blur(${c.glass_blur_backdrop}px) saturate(150%)`,
          backdropFilter: `blur(${c.glass_blur_backdrop}px) saturate(150%)`,
        } as ViewStyle)
      : undefined,
    style,
  ] as StyleProp<ViewStyle>;

  return (
    <View pointerEvents="box-none" className={cn('absolute inset-0', className)}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel="Close floating panel"
        className="absolute inset-0"
        onPress={onPress}
        style={backdropStyle}
      >
        {Platform.OS !== 'web' && blur ? (
          <BlurView
            pointerEvents="none"
            intensity={c.glass_blur_backdrop}
            tint="systemThinMaterial"
            style={{ position: 'absolute', inset: 0 } as ViewStyle}
          />
        ) : null}
      </Pressable>
      {children ? <View pointerEvents="box-none" className={contentClassName}>{children}</View> : null}
    </View>
  );
}
