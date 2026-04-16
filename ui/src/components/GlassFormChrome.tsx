import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassButton } from '@/components/GlassButton';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

type HeaderProps = {
  title: string;
  meta?: string;
  backLabel?: string;
};

type FooterProps = {
  primaryLabel: string;
  onPrimaryPress: () => void;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function GlassFormHeader({ title, meta, backLabel = 'Back' }: HeaderProps) {
  const c = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.headerShell,
        {
          paddingTop: Platform.OS === 'web' ? space.sm : insets.top + space.sm,
          backgroundColor: c.glass_chrome,
          borderBottomColor: c.glass_border,
          borderTopColor: c.glass_border_top,
        },
        Platform.OS === 'web' ? styles.webGlass : undefined,
      ]}
    >
      <View style={styles.headerInner}>
        <GlassButton icon="arrow-back" variant="icon" onPress={() => router.back()} accessibilityLabel={backLabel} />
        <View style={styles.headerTitleBlock}>
          <Text style={[typeStyles.subtitle, { color: c.text_primary }]} numberOfLines={1}>
            {title}
          </Text>
          {meta ? <Text style={[typeStyles.caption, { color: c.text_secondary }]}>{meta}</Text> : null}
        </View>
      </View>
    </View>
  );
}

export function GlassFormFooter({ primaryLabel, onPrimaryPress, disabled, icon }: FooterProps) {
  const c = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footerShell,
        {
          backgroundColor: c.glass_chrome,
          borderTopColor: c.glass_border,
          paddingBottom: insets.bottom + space.md,
        },
        Platform.OS === 'web' ? styles.webGlass : undefined,
      ]}
    >
      <View style={styles.footerInner}>
        <GlassButton
          label={primaryLabel}
          icon={icon}
          variant="primary"
          disabled={disabled}
          onPress={onPrimaryPress}
          style={styles.primaryAction}
        />
      </View>
    </View>
  );
}

export const formLayoutStyles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    padding: space.xl,
    gap: space.lg,
  },
  wideContent: {
    width: '100%',
    maxWidth: 920,
    alignSelf: 'center',
    padding: space.xl,
    gap: space.lg,
  },
  fieldGroup: {
    gap: space.sm,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0,
  },
  input: {
    fontSize: 15,
    lineHeight: 21,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 116,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: space.sm,
    alignItems: 'stretch',
    flexWrap: 'wrap',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.button,
    borderWidth: 1,
  },
});

const styles = StyleSheet.create({
  headerShell: {
    borderBottomWidth: 1,
    paddingHorizontal: space.md,
    paddingBottom: space.md,
    zIndex: 5,
  },
  headerInner: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  headerTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  footerShell: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
    borderTopWidth: 1,
    zIndex: 5,
  },
  footerInner: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
  },
  primaryAction: {
    width: '100%',
  },
  webGlass: {
    // @ts-ignore web-only glass
    WebkitBackdropFilter: 'blur(24px) saturate(1.2)',
    backdropFilter: 'blur(24px) saturate(1.2)',
  } as ViewStyle,
});
