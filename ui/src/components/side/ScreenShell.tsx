import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/theme/useThemeColors';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  keyboard?: boolean;
  withBackground?: boolean;
  padded?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  className?: string;
  contentClassName?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const widthClass = {
  sm: 'max-w-[640px]',
  md: 'max-w-[760px]',
  lg: 'max-w-[920px]',
  xl: 'max-w-[1180px]',
  none: '',
};

export function ScreenShell({
  children,
  scroll,
  keyboard,
  withBackground = true,
  padded = true,
  maxWidth = 'lg',
  className,
  contentClassName,
  style,
  testID,
}: Props) {
  const insets = useSafeAreaInsets();
  const c = useThemeColors();
  const contentClasses = cn(
    'relative z-[1] w-full self-center',
    scroll ? 'min-h-full' : 'flex-1',
    widthClass[maxWidth],
    padded ? 'px-side-xl py-side-xl' : undefined,
    contentClassName,
  );

  const content = scroll ? (
    <ScrollView
      className="relative z-[1] flex-1 side-web-scrollbar"
      keyboardShouldPersistTaps="handled"
      contentContainerClassName={contentClasses}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={contentClasses}>{children}</View>
  );

  return (
    <View
      testID={testID}
      className={cn('flex-1', className)}
      style={[{ backgroundColor: Platform.OS === 'web' ? 'transparent' : c.background }, style]}
    >
      {withBackground ? (
        <View
          pointerEvents="none"
          className="absolute inset-0"
          style={{ backgroundColor: Platform.OS === 'web' ? 'transparent' : c.background }}
        />
      ) : null}
      {keyboard ? (
        <KeyboardAvoidingView
          className="relative z-[1] flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </View>
  );
}
