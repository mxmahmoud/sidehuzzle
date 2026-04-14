import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import { useIsDark, useThemeColors } from '@/theme/useThemeColors';

export function AmbientGlassBackground() {
  const c = useThemeColors();
  const isDark = useIsDark();

  const webBackground =
    Platform.OS === 'web'
      ? ({
          backgroundImage: isDark
            ? [
                'linear-gradient(135deg, #17211E 0%, #24342F 46%, #1C2925 100%)',
                'linear-gradient(110deg, rgba(77, 208, 178, 0.18) 0%, rgba(77, 208, 178, 0.02) 34%, transparent 68%)',
                'linear-gradient(250deg, rgba(112, 167, 255, 0.16) 0%, rgba(112, 167, 255, 0.02) 40%, transparent 72%)',
                'repeating-linear-gradient(90deg, rgba(255,255,255,0.055) 0 1px, transparent 1px 92px)',
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 92px)',
              ].join(', ')
            : [
                'linear-gradient(135deg, #F8FCF9 0%, #E7F4EF 42%, #F6FAF8 72%, #EAF3F4 100%)',
                'linear-gradient(115deg, rgba(15, 118, 110, 0.13) 0%, rgba(15, 118, 110, 0.035) 36%, transparent 70%)',
                'linear-gradient(245deg, rgba(37, 99, 235, 0.12) 0%, rgba(37, 99, 235, 0.025) 38%, transparent 72%)',
                'repeating-linear-gradient(90deg, rgba(19,32,27,0.055) 0 1px, transparent 1px 88px)',
                'repeating-linear-gradient(0deg, rgba(19,32,27,0.045) 0 1px, transparent 1px 88px)',
              ].join(', '),
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 88px 88px, 88px 88px',
          backgroundPosition: 'center',
        } as ViewStyle)
      : undefined;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.root, { backgroundColor: c.background_alt }]}>
      <LinearGradient
        colors={isDark ? ['#17211E', '#24342F', '#1C2925'] : ['#F8FCF9', '#E7F4EF', '#F6FAF8', '#EAF3F4']}
        locations={isDark ? [0, 0.46, 1] : [0, 0.42, 0.72, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, webBackground]} />
      <View
        style={[
          styles.lightBand,
          styles.lightBandTop,
          { backgroundColor: isDark ? 'rgba(77, 208, 178, 0.10)' : 'rgba(15, 118, 110, 0.10)' },
        ]}
      />
      <View
        style={[
          styles.lightBand,
          styles.lightBandBottom,
          { backgroundColor: isDark ? 'rgba(112, 167, 255, 0.10)' : 'rgba(37, 99, 235, 0.08)' },
        ]}
      />
      <View style={[styles.vignette, { borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.72)' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
  },
  lightBand: {
    position: 'absolute',
    left: -48,
    right: -48,
    height: 190,
    opacity: 0.9,
  },
  lightBandTop: {
    top: 56,
    transform: [{ rotate: '-8deg' }],
  },
  lightBandBottom: {
    bottom: 68,
    transform: [{ rotate: '7deg' }],
  },
  vignette: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: 14,
    bottom: 14,
    borderWidth: 1,
    opacity: 0.55,
  },
});
