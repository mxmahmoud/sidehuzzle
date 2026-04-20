import { useIsFocused } from '@react-navigation/native';
import type { ReactNode } from 'react';
import { Platform, View, useWindowDimensions } from 'react-native';
import { useThemeColors } from '@/theme/useThemeColors';

type Props = {
  children: ReactNode;
  edgeToEdge?: boolean;
};

export function TabScene({ children, edgeToEdge }: Props) {
  const isFocused = useIsFocused();
  const c = useThemeColors();
  const { width } = useWindowDimensions();
  const needsNavOffset = Platform.OS === 'web' && width >= 1024 && !edgeToEdge;

  return (
    <View className="flex-1" style={[{ backgroundColor: c.background_alt }, needsNavOffset ? { paddingTop: 78 } : undefined]}>
      {isFocused ? children : null}
    </View>
  );
}
