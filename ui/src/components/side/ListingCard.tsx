import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { ImageBackground, Platform, Pressable, View, type ViewStyle } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { GlassSurface } from '@/components/side/GlassSurface';
import { readableTaskType } from '@/data/listingPresentation';
import type { DiscoveryListing } from '@/data/listingTypes';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/theme/useThemeColors';

type Props = {
  item: DiscoveryListing;
  selected?: boolean;
  saved?: boolean;
  compact?: boolean;
  onPress: () => void;
  onPreview?: () => void;
  onSave?: () => void;
};

export function ListingCard({ item, selected, saved, compact, onPress, onPreview, onSave }: Props) {
  const [hovered, setHovered] = useState(false);
  const c = useThemeColors();
  const kindClass = item.kind === 'job' ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary';

  return (
    <GlassSurface
      selected={selected}
      variant="surface"
      className={cn(
        'flex-row items-stretch gap-side-sm p-side-sm',
        compact ? 'min-w-[300px]' : undefined,
        hovered ? 'web:-translate-y-1 web:shadow-hard-5' : undefined,
        Platform.OS === 'web' ? 'web:transition-all' : undefined,
      )}
    >
      <Pressable
        testID={`listing-card-${item.id}`}
        onPress={onPress}
        onHoverIn={() => {
          setHovered(true);
          onPreview?.();
        }}
        onHoverOut={() => setHovered(false)}
        onFocus={() => {
          setHovered(true);
          onPreview?.();
        }}
        onBlur={() => setHovered(false)}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}. ${item.rateLabel}. ${item.distanceKm.toFixed(1)} kilometers away.`}
        className="min-h-[128px] flex-1 flex-row gap-side-md web:cursor-pointer"
        style={({ pressed }) => [pressed ? ({ opacity: 0.82, transform: [{ scale: 0.992 }] } as ViewStyle) : undefined]}
      >
        <ImageBackground
          source={{ uri: item.imageUrl }}
          imageStyle={{ borderRadius: 8, transform: hovered && Platform.OS === 'web' ? [{ scale: 1.035 }] : undefined }}
          className="min-h-[124px] w-28 overflow-hidden rounded-lg p-side-sm"
          style={{ backgroundColor: item.imageColor }}
        >
          <Badge className={cn('self-start rounded-lg border border-border', kindClass)}>
            <Text className="text-[11px] font-extrabold leading-4">{readableTaskType(item.taskType, item.kind)}</Text>
          </Badge>
        </ImageBackground>

        <View className="min-w-0 flex-1 gap-[6px]">
          <View className="flex-row justify-between gap-side-sm">
            <Text className="min-w-0 flex-1 text-[12px] font-bold leading-4 text-muted-foreground" numberOfLines={1}>
              {item.locationLabel}
            </Text>
            <Text className="text-[12px] font-semibold leading-4 text-muted-foreground">{item.distanceKm.toFixed(1)} km</Text>
          </View>

          <Text className="text-[17px] font-bold leading-6" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="text-[13px] font-medium leading-[18px] text-muted-foreground" numberOfLines={2}>
            {item.subtitle}
          </Text>

          <View className="flex-row flex-wrap gap-side-xs">
            {item.trustSignals.slice(0, compact ? 1 : 2).map((signal) => (
              <View key={signal} className="max-w-[48%] rounded-lg border border-border bg-background/55 px-side-sm py-[3px]">
                <Text className="text-[11px] font-bold leading-4 text-muted-foreground" numberOfLines={1}>
                  {signal}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-auto flex-row items-center justify-between gap-side-sm">
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={14} color={c.star} />
              <Text className="text-[13px] font-bold leading-[18px] text-muted-foreground">
                {item.rating.toFixed(1)} ({item.reviewCount})
              </Text>
            </View>
            <Text className="text-[18px] font-extrabold leading-6">{item.rateLabel}</Text>
          </View>
        </View>
      </Pressable>

      <Pressable
        onPress={onSave}
        accessibilityRole="button"
        accessibilityLabel={`Save ${item.title}`}
        accessibilityState={{ selected: !!saved }}
        className="size-11 items-center justify-center rounded-lg border border-border bg-background/55 web:cursor-pointer"
        style={({ pressed }) => [pressed ? ({ opacity: 0.82, transform: [{ scale: 0.96 }] } as ViewStyle) : undefined]}
      >
        <Ionicons name={saved ? 'heart' : 'heart-outline'} size={18} color={saved ? c.accent_primary : c.text_secondary} />
      </Pressable>
    </GlassSurface>
  );
}
