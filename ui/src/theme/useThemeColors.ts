import { useColorScheme } from 'react-native';
import { colors, type ThemeColors } from '@/theme/tokens';
import { useThemeStore } from '@/stores/themeStore';

export function useThemeColors(): ThemeColors {
  const systemScheme = useColorScheme();
  const preference = useThemeStore((s) => s.preference);

  if (preference === 'light') return colors.light;
  if (preference === 'dark') return colors.dark;
  return systemScheme === 'dark' ? colors.dark : colors.light;
}

export function useIsDark(): boolean {
  const systemScheme = useColorScheme();
  const preference = useThemeStore((s) => s.preference);

  if (preference === 'light') return false;
  if (preference === 'dark') return true;
  return systemScheme === 'dark';
}
