import { ImageBackground, View } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { GlassSurface } from '@/components/side/GlassSurface';

type Props = {
  imageUrl?: string;
  imageColor?: string;
  badge: string;
  badgeTone?: 'job' | 'worker';
  title: string;
  subtitle?: string;
};

export function DetailHero({ imageUrl, imageColor, badge, badgeTone = 'job', title, subtitle }: Props) {
  return (
    <GlassSurface variant="elevated" className="overflow-hidden p-0">
      <ImageBackground
        source={imageUrl ? { uri: imageUrl } : undefined}
        imageStyle={{ borderRadius: 8 }}
        className="min-h-[220px] justify-end rounded-lg"
        style={{ backgroundColor: imageColor ?? 'rgba(15, 118, 110, 0.14)' }}
      >
        <View className="gap-side-sm p-side-lg">
          <Badge className={badgeTone === 'worker' ? 'self-start bg-primary/15' : 'self-start bg-destructive/15'}>
            <Text className="text-[11px] font-extrabold uppercase leading-4 tracking-[0px]">{badge}</Text>
          </Badge>
          <Text className="max-w-[720px] text-[30px] font-black leading-[36px]" numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? <Text className="max-w-[720px] text-[14px] font-medium leading-[22px] text-muted-foreground">{subtitle}</Text> : null}
        </View>
      </ImageBackground>
    </GlassSurface>
  );
}
