import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/side/Button';
import { GlassSurface } from '@/components/side/GlassSurface';
import { useThemeColors } from '@/theme/useThemeColors';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'default' | 'warning' | 'danger';
  testID?: string;
};

export function StateView({ icon, title, body, actionLabel, onAction, tone = 'default', testID }: Props) {
  const c = useThemeColors();
  const iconColor = tone === 'danger' ? c.accent_danger : tone === 'warning' ? c.accent_warning : c.accent_primary;
  return (
    <GlassSurface testID={testID} variant="elevated" className="items-center gap-side-md px-side-xl py-side-xl">
      <View className="size-12 items-center justify-center rounded-lg bg-secondary">
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <Text className="text-center text-[17px] font-bold leading-6">{title}</Text>
      {body ? <Text className="max-w-[340px] text-center text-[14px] leading-[21px] text-muted-foreground">{body}</Text> : null}
      {actionLabel && onAction ? <Button label={actionLabel} icon="arrow-forward" iconPosition="right" variant="primary" onPress={onAction} /> : null}
    </GlassSurface>
  );
}
