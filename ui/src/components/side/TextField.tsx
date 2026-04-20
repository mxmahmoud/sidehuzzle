import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform, TextInput, View, type TextInputProps } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/theme/useThemeColors';

type Props = TextInputProps & {
  label: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  containerClassName?: string;
};

export function TextField({ label, error, icon, containerClassName, className, multiline, style, ...props }: Props) {
  const InputComponent = Input as unknown as typeof TextInput;
  const c = useThemeColors();
  return (
    <View className={cn('gap-side-sm', containerClassName)}>
      <Text className="text-[12px] font-extrabold uppercase leading-4 tracking-[0px] text-muted-foreground">{label}</Text>
      <View className="relative">
        {icon ? (
          <View className="absolute left-side-md top-0 z-[1] h-11 justify-center">
            <Ionicons name={icon} size={17} color={c.text_secondary} />
          </View>
        ) : null}
        <InputComponent
          multiline={multiline}
          className={cn(icon ? 'pl-10' : undefined, multiline ? 'min-h-[118px] py-side-md' : 'min-h-11', error ? 'border-destructive' : undefined, className)}
          textAlignVertical={multiline ? 'top' : props.textAlignVertical}
          style={[
            {
              backgroundColor: c.glass_input,
              borderColor: error ? c.accent_danger : c.glass_border,
              color: c.text_primary,
            },
            Platform.OS === 'web'
              ? ({
                  outlineStyle: 'none',
                  WebkitBackdropFilter: `blur(${c.glass_blur_input}px) saturate(165%)`,
                  backdropFilter: `blur(${c.glass_blur_input}px) saturate(165%)`,
                } as never)
              : undefined,
            style,
          ]}
          {...props}
        />
      </View>
      {error ? <Text className="text-[12px] font-semibold leading-4 text-destructive">{error}</Text> : null}
    </View>
  );
}
