import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ImageBackground, Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { GlassCard } from '@/components/GlassCard';
import { readableTaskType } from '@/data/listingPresentation';
import type { DiscoveryListing } from '@/data/listingTypes';
import { useThemeColors } from '@/theme/useThemeColors';
import { motion, radius, shadow, space, type as typeStyles } from '@/theme/tokens';

type Props = {
  item: DiscoveryListing;
  selected?: boolean;
  compact?: boolean;
  onPress: () => void;
  onPreview?: () => void;
  onSave?: () => void;
};

export function ListingCard({ item, selected, compact, onPress, onPreview, onSave }: Props) {
  const c = useThemeColors();
  const kindColor = item.kind === 'job' ? c.pin_job : c.pin_worker;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <GlassCard
      selected={selected}
      variant="surface"
      style={[styles.card, Platform.OS === 'web' && isHovered ? styles.cardHover : undefined, compact && styles.cardCompact]}
    >
      <Pressable
        onPress={onPress}
        onHoverIn={() => {
          setIsHovered(true);
          onPreview?.();
        }}
        onHoverOut={() => setIsHovered(false)}
        onFocus={() => {
          setIsHovered(true);
          onPreview?.();
        }}
        onBlur={() => setIsHovered(false)}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}. ${item.rateLabel}. ${item.distanceKm.toFixed(1)} kilometers away.`}
        style={({ pressed, hovered }) => [
          styles.mainAction,
          Platform.OS === 'web' ? styles.mainActionMotion : undefined,
          hovered && Platform.OS === 'web' ? styles.mainActionHover : undefined,
          pressed ? styles.pressed : undefined,
          hovered && Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined,
        ]}
      >
        <ImageBackground
          source={{ uri: item.imageUrl }}
          imageStyle={[styles.image, Platform.OS === 'web' && isHovered ? styles.imageHover : undefined]}
          style={[styles.imageFrame, { backgroundColor: item.imageColor }]}
        >
          <View style={[styles.kindBadge, { backgroundColor: c.surface_overlay, borderColor: c.border_glass }]}>
            <View style={[styles.kindDot, { backgroundColor: kindColor }]} />
            <Text style={[styles.kindText, { color: c.text_primary }]}>
              {readableTaskType(item.taskType, item.kind)}
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.body}>
          <View style={styles.topRow}>
            <Text style={[styles.location, { color: c.text_secondary }]} numberOfLines={1}>
              {item.locationLabel}
            </Text>
            <Text style={[styles.distance, { color: c.text_muted }]}>{item.distanceKm.toFixed(1)} km</Text>
          </View>

          <Text style={[typeStyles.subtitle, { color: c.text_primary }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[typeStyles.caption, { color: c.text_secondary }]} numberOfLines={2}>
            {item.subtitle}
          </Text>

          <View style={styles.signalRow}>
            {item.trustSignals.slice(0, compact ? 1 : 2).map((signal) => (
              <View key={signal} style={[styles.signalPill, { borderColor: c.glass_border, backgroundColor: c.glass_input }]}>
                <Text style={[styles.signalText, { color: c.text_secondary }]} numberOfLines={1}>
                  {signal}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={c.star} />
              <Text style={[styles.rating, { color: c.text_secondary }]}>
                {item.rating.toFixed(1)} ({item.reviewCount})
              </Text>
            </View>
            <Text style={[typeStyles.price, { color: c.text_primary }]}>{item.rateLabel}</Text>
          </View>
        </View>
      </Pressable>

      <Pressable
        onPress={onSave}
        accessibilityRole="button"
        accessibilityLabel={`Save ${item.title}`}
        style={({ pressed, hovered }) => [
          styles.saveButton,
          { borderColor: c.glass_border, backgroundColor: c.glass_input },
          Platform.OS === 'web' ? styles.saveButtonMotion : undefined,
          hovered && Platform.OS === 'web' ? styles.saveButtonHover : undefined,
          pressed ? styles.pressed : undefined,
          hovered && Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined,
        ]}
      >
        <Ionicons name="heart-outline" size={18} color={c.text_secondary} />
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: space.sm,
    flexDirection: 'row',
    gap: space.sm,
    alignItems: 'stretch',
  },
  cardCompact: {
    minWidth: 300,
  },
  cardHover: {
    transform: [{ translateY: -5 }],
    // @ts-ignore web-only
    boxShadow: shadow.hover.boxShadow,
  },
  mainAction: {
    flex: 1,
    flexDirection: 'row',
    gap: space.md,
    minHeight: 128,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.992 }],
  },
  mainActionMotion: {
    transitionDuration: `${motion.standardMs}ms`,
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion.easeOut,
  } as ViewStyle,
  mainActionHover: {
    transform: [{ translateY: -1 }],
  },
  imageFrame: {
    width: 112,
    minHeight: 124,
    borderRadius: radius.card,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    padding: space.sm,
  },
  image: {
    borderRadius: radius.card,
  },
  imageHover: {
    transform: [{ scale: 1.035 }],
  },
  kindBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.chip,
    borderWidth: 1,
    paddingHorizontal: space.sm,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  kindDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  kindText: {
    fontSize: 11,
    fontWeight: '800',
  },
  body: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  location: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
  },
  distance: {
    fontSize: 12,
    fontWeight: '600',
  },
  signalRow: {
    flexDirection: 'row',
    gap: space.xs,
    flexWrap: 'wrap',
  },
  signalPill: {
    borderWidth: 1,
    borderRadius: radius.chip,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    maxWidth: '48%',
  },
  signalText: {
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 13,
    fontWeight: '700',
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonMotion: {
    transitionDuration: `${motion.fastMs}ms`,
    transitionProperty: 'background-color, border-color, transform, opacity',
    transitionTimingFunction: motion.easeOut,
  } as ViewStyle,
  saveButtonHover: {
    transform: [{ translateY: -2 }],
  },
});
