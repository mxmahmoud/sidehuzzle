import { useEffect } from 'react';
import { Platform, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { GlassCard } from '@/components/GlassCard';
import { radius, shadow, space } from '@/theme/tokens';

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AnchoredGlassPanel({ open, onClose, children, style }: Props) {
  useEffect(() => {
    if (!open || Platform.OS !== 'web' || typeof window === 'undefined') return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <GlassCard
      variant="sheet"
      style={[
        styles.panel,
        Platform.OS === 'web' ? ({ boxShadow: shadow.hover.boxShadow } as ViewStyle) : undefined,
        style,
      ]}
    >
      {children}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 30,
    borderRadius: radius.sheet,
    padding: space.lg,
  },
});
