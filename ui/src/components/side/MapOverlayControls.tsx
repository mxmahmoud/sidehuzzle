import type { ReactNode } from 'react';
import { View } from 'react-native';
import { GlassSurface } from '@/components/side/GlassSurface';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
};

const positionClass = {
  'top-left': 'left-side-md top-side-md',
  'top-right': 'right-side-md top-side-md',
  'bottom-left': 'bottom-side-md left-side-md',
  'bottom-right': 'bottom-side-md right-side-md',
};

export function MapOverlayControls({ children, position = 'top-right', className }: Props) {
  return (
    <View className={cn('absolute z-[6] gap-side-sm', positionClass[position], className)}>
      <GlassSurface variant="chrome" className="gap-side-sm p-side-sm">
        {children}
      </GlassSurface>
    </View>
  );
}
