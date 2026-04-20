import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { GlassSurface } from '@/components/side/GlassSurface';
import { useThemeColors } from '@/theme/useThemeColors';

type Props = {
  name?: string;
  title?: string;
  eyebrow?: string;
  body?: string;
  subtitle?: string;
  imageUrl?: string;
  meta?: string;
};

export function ProfileHeader({ name, title, eyebrow, body, subtitle, imageUrl, meta }: Props) {
  const c = useThemeColors();
  const displayName = title ?? name ?? 'Profile';
  const detail = body ?? subtitle;

  return (
    <GlassSurface variant="elevated" className="flex-row items-center gap-side-md p-side-lg">
      <Avatar alt={displayName} className="size-16">
        {imageUrl ? <AvatarImage source={{ uri: imageUrl }} /> : null}
        <AvatarFallback>
          <Text className="text-[18px] font-black">{displayName.slice(0, 1).toUpperCase()}</Text>
        </AvatarFallback>
      </Avatar>
      <View className="min-w-0 flex-1 gap-side-xs">
        {eyebrow ? <Text className="text-[12px] font-extrabold uppercase leading-4 tracking-[0px] text-primary">{eyebrow}</Text> : null}
        <Text className="text-[24px] font-bold leading-[30px]" numberOfLines={1}>
          {displayName}
        </Text>
        {detail ? <Text className="text-[14px] leading-[21px] text-muted-foreground">{detail}</Text> : null}
        {meta ? (
          <View className="flex-row items-center gap-side-xs">
            <Ionicons name="shield-checkmark-outline" size={15} color={c.accent_primary} />
            <Text className="text-[12px] font-bold leading-4 text-muted-foreground">{meta}</Text>
          </View>
        ) : null}
      </View>
    </GlassSurface>
  );
}
