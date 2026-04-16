import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import type { ListingMode } from '@/stores/discoveryStore';
import { useThemeColors } from '@/theme/useThemeColors';
import { motion, radius, space } from '@/theme/tokens';

type IconName = keyof typeof Ionicons.glyphMap;

type Option<T extends string> = {
  value: T;
  label: string;
  icon: IconName;
};

const MARKET_OPTIONS: Array<Option<ListingMode>> = [
  { value: 'job', label: 'Jobs', icon: 'briefcase-outline' },
  { value: 'group', label: 'All', icon: 'shapes-outline' },
  { value: 'worker', label: 'Pros', icon: 'person-outline' },
];

type Props = {
  listingMode: ListingMode;
  onListingModeChange: (mode: ListingMode) => void;
};

export function DiscoveryModeControls({
  listingMode,
  onListingModeChange,
}: Props) {
  const c = useThemeColors();

  return (
    <View style={styles.row}>
      <View style={[styles.marketTrack, { backgroundColor: c.glass_input, borderColor: c.glass_border }]}>
        {MARKET_OPTIONS.map((option) => {
          const active = option.value === listingMode;
          return (
            <Pressable
              key={option.value}
              onPress={() => onListingModeChange(option.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Show ${option.label}`}
              style={({ hovered, pressed }) => [
                styles.marketButton,
                Platform.OS === 'web' ? styles.motion : undefined,
                active ? styles.activeButton : undefined,
                hovered && Platform.OS === 'web' ? styles.hovered : undefined,
                pressed ? styles.pressed : undefined,
                hovered && Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined,
              ]}
            >
              {active ? (
                <LinearGradient
                  pointerEvents="none"
                  colors={[c.surface_selected, c.glass_elevated]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
              <Ionicons name={option.icon} size={15} color={active ? c.accent_primary : c.text_secondary} />
              <Text style={[styles.marketText, { color: active ? c.text_primary : c.text_secondary }]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    flexWrap: 'wrap',
  },
  marketTrack: {
    flex: 1,
    minWidth: 210,
    maxWidth: 360,
    minHeight: 42,
    borderRadius: radius.button,
    borderWidth: 1,
    padding: 3,
    flexDirection: 'row',
    gap: 3,
  },
  marketButton: {
    flex: 1,
    minHeight: 36,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  activeButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.78)',
  },
  motion: {
    transitionDuration: `${motion.standardMs}ms`,
    transitionProperty: 'background-color, border-color, opacity, transform',
    transitionTimingFunction: motion.easeInOut,
  } as ViewStyle,
  hovered: {
    transform: [{ translateY: -2 }],
    // @ts-ignore web-only
    boxShadow: '0px 14px 34px rgba(17, 41, 34, 0.16), inset 0px 1px 0px rgba(255,255,255,0.36)',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  marketText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
});
