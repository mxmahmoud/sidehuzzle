import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import { GlassSurface } from '@/components/side/GlassSurface';
import { Text } from '@/components/ui/text';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/theme/useThemeColors';

type Option<T extends string> = {
  value: T;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

type Props<T extends string> = {
  value: T;
  options: Array<Option<T>>;
  onChange: (value: T) => void;
  className?: string;
  testID?: string;
};

export function SegmentedControl<T extends string>({ value, options, onChange, className, testID }: Props<T>) {
  const c = useThemeColors();

  return (
    <GlassSurface variant="chrome" className={cn('min-h-[42px] flex-row gap-[3px] p-[3px]', className)} testID={testID}>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(next) => {
          if (next) onChange(next as T);
        }}
        className="min-w-0 flex-1"
      >
        {options.map((option, index) => {
          const selected = value === option.value;
          return (
            <View key={option.value} className="min-w-[72px] flex-1">
              <ToggleGroupItem
                value={option.value}
                isFirst={index === 0}
                isLast={index === options.length - 1}
                className={cn('min-h-9 w-full gap-side-xs rounded-md px-side-sm', selected ? 'bg-transparent active:bg-transparent' : undefined)}
                style={{ backgroundColor: selected ? c.glass_control_selected : 'transparent' }}
                accessibilityLabel={option.label}
              >
                {option.icon ? <Ionicons name={option.icon} size={16} color={selected ? c.accent_primary : c.text_primary} /> : null}
                <Text className="text-[14px] font-bold leading-[18px]" style={{ color: selected ? c.accent_primary : c.text_primary }}>
                  {option.label}
                </Text>
              </ToggleGroupItem>
            </View>
          );
        })}
      </ToggleGroup>
    </GlassSurface>
  );
}
