import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, withDelay, withSequence } from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';
import { useIsDark } from '@/theme/useThemeColors';
import { radius, space } from '@/theme/tokens';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = radius.chip, style }: SkeletonProps) {
  const isDark = useIsDark();
  const shimmer = useSharedValue(-1);

  const shimmerColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const shimmerHighlight = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.8)';

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shimmer.value }],
    };
  });

  // Trigger shimmer animation on mount
  shimmer.value = withRepeat(
    withTiming(1, { duration: 1200 }),
    -1,
    false,
  );

  return (
    <View
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius,
          backgroundColor: shimmerColor,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            backgroundColor: shimmerHighlight,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Skeleton width={88} height={104} borderRadius={radius.card} />
        <View style={styles.cardBody}>
          <Skeleton width="40%" height={12} />
          <Skeleton width="90%" height={16} />
          <Skeleton width="75%" height={16} />
          <View style={styles.cardFooter}>
            <Skeleton width="30%" height={12} />
            <Skeleton width="20%" height={14} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '60%',
    transform: [{ skewX: '-20deg' }],
  },
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: space.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: space.md,
  },
  cardRow: {
    flexDirection: 'row',
    gap: space.md,
    alignItems: 'flex-start',
  },
  cardBody: {
    flex: 1,
    gap: space.sm,
    paddingTop: space.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
});
