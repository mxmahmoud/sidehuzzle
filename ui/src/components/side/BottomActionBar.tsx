import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassSurface } from '@/components/side/GlassSurface';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function BottomActionBar({ children, className, style }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <GlassSurface
      variant="chrome"
      className={cn('relative z-[4] flex-row items-center justify-center gap-side-md rounded-t-lg border px-side-lg pt-side-md', className)}
      style={[{ paddingBottom: insets.bottom + 12 }, style]}
    >
      <View className="w-full flex-row items-center justify-center gap-side-md">{children}</View>
    </GlassSurface>
  );
}
