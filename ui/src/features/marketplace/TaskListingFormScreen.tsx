import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, Text, View } from 'react-native';
import { zodResolver } from '@/lib/zodResolver';
import { createTask } from '@/domain/api/taskApi';
import { taskCreateSchema, type TaskCreate } from '@/data/contract';
import { BottomActionBar } from '@/components/side/BottomActionBar';
import { Button } from '@/components/side/Button';
import { Chip } from '@/components/side/Button';
import { GlassSurface } from '@/components/side/GlassSurface';
import { ScreenShell } from '@/components/side/ScreenShell';
import { StateView } from '@/components/side/StateView';
import { TextField } from '@/components/side/TextField';
import { useThemeColors } from '@/theme/useThemeColors';
import { type as typeStyles } from '@/theme/tokens';

type Mode = 'job' | 'service';

const optionSets = {
  job: [
    { key: 'asap', label: 'ASAP' },
    { key: 'remote_work', label: 'Remote ok' },
    { key: 'recurring', label: 'Recurring' },
  ],
  service: [
    { key: 'remote_work', label: 'Remote ok' },
    { key: 'recurring', label: 'Recurring clients' },
    { key: 'asap', label: 'Available ASAP' },
  ],
} as const;

const attachmentOptions = [
  { label: 'Images', icon: 'image-outline', accept: 'image/*' },
  { label: 'PDFs', icon: 'document-text-outline', accept: 'application/pdf' },
  { label: 'Files', icon: 'attach-outline', accept: 'image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt' },
] as const;

function summaryFromDescription(description: string) {
  return description.trim().replace(/\s+/g, ' ').slice(0, 500);
}

function defaultsFor(mode: Mode): TaskCreate {
  return {
    name: '',
    short_description: '',
    description: '',
    price: 0,
    price_type: mode === 'service' ? 'per_hour' : 'fixed',
    task_type: mode === 'service' ? 'tasker' : 'task',
    asap: false,
    professional: mode === 'service',
    recurring: false,
    remote_work: false,
    work_required_from: undefined,
    work_required_to: undefined,
    latitude: undefined,
    longitude: undefined,
    category_id: 1,
    address_id: 1,
  };
}

export function TaskListingFormScreen({ mode }: { mode: Mode }) {
  const c = useThemeColors();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy =
    mode === 'service'
      ? {
          title: 'Offer a service',
          eyebrow: 'Freelancer listing',
          intro: 'Package your skills so nearby customers can understand the offer, rate, and fit quickly.',
          name: 'Service title',
          namePlaceholder: 'e.g. Professional deep cleaning services',
          description: 'Describe your service, experience, tools, coverage area, and what is included...',
          submit: 'Offer service',
          success: '/confirmation_service_listed' as const,
        }
      : {
          title: 'Post a job',
          eyebrow: 'Customer request',
          intro: 'Describe the job clearly so trusted pros can price it, ask useful questions, and send a strong offer.',
          name: "What's needed?",
          namePlaceholder: 'e.g. Moving help for 2BR apartment',
          description: 'Describe the job, access notes, timing, materials, requirements, and anything a pro should know...',
          submit: 'Post job',
          success: '/confirmation_help_wanted_posted' as const,
        };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TaskCreate>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: defaultsFor(mode),
  });
  const [attachments, setAttachments] = useState<string[]>([]);

  const pickAttachments = useCallback((accept: string) => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = accept;
    input.onchange = () => {
      const files = Array.from(input.files ?? []).map((file) => file.name);
      if (files.length) {
        setAttachments((current) => Array.from(new Set([...current, ...files])));
      }
    };
    input.click();
  }, []);

  const onSubmit = async (data: TaskCreate) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const description = data.description.trim();
      const payload = {
        ...data,
        description,
        short_description: summaryFromDescription(description),
      };
      await createTask(mode === 'service' ? { ...payload, professional: true, task_type: 'tasker' } : payload);
      router.replace(copy.success);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: c.background_alt }} testID={`${mode}-listing-form`}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenShell scroll keyboard maxWidth="md" contentClassName="gap-side-lg" withBackground>
        <GlassSurface variant="chrome" className="flex-row items-center gap-side-sm p-side-sm">
          <Button icon="arrow-back" variant="icon" accessibilityLabel="Back" onPress={() => router.back()} />
          <View className="min-w-0 flex-1">
            <Text className="text-[12px] font-extrabold uppercase leading-4 tracking-[0px]" style={{ color: c.accent_primary }}>
              {copy.eyebrow}
            </Text>
            <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>{copy.title}</Text>
          </View>
        </GlassSurface>

        <GlassSurface variant="elevated" className="gap-side-lg p-side-xl">
          <View className="gap-side-sm">
            <Text style={[typeStyles.title, { color: c.text_primary }]}>{copy.title}</Text>
            <Text className="text-[14px] leading-[22px]" style={{ color: c.text_secondary }}>
              {copy.intro}
            </Text>
          </View>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField label={`${copy.name} *`} placeholder={copy.namePlaceholder} value={value} onChangeText={onChange} onBlur={onBlur} error={errors.name?.message} />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Description *"
                placeholder={copy.description}
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  setValue('short_description', summaryFromDescription(text), { shouldDirty: true, shouldValidate: false });
                }}
                onBlur={onBlur}
                multiline
                numberOfLines={5}
                error={errors.description?.message ?? errors.short_description?.message}
              />
            )}
          />

          <View className="gap-side-sm">
            <Text className="text-[12px] font-extrabold uppercase leading-4 tracking-[0px]" style={{ color: c.text_secondary }}>
              Attachments
            </Text>
            <View
              className="gap-side-md rounded-lg border p-side-md"
              style={{ backgroundColor: c.glass_control, borderColor: c.glass_border }}
            >
              <Text className="text-[13px] leading-[19px]" style={{ color: c.text_secondary }}>
                Add photos, PDFs, certificates, quotes, plans, or reference files.
              </Text>
              <View className="flex-row flex-wrap gap-side-sm">
                {attachmentOptions.map((option) => (
                  <Chip
                    key={option.label}
                    icon={option.icon}
                    label={option.label}
                    onPress={() => pickAttachments(option.accept)}
                  />
                ))}
              </View>
              {attachments.length ? (
                <View className="gap-side-xs">
                  {attachments.slice(0, 4).map((fileName) => (
                    <View key={fileName} className="flex-row items-center gap-side-sm">
                      <Ionicons name="document-attach-outline" size={16} color={c.accent_primary} />
                      <Text className="min-w-0 flex-1 text-[13px] leading-[18px]" style={{ color: c.text_primary }} numberOfLines={1}>
                        {fileName}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </View>

          <View className="flex-row flex-wrap gap-side-sm">
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  containerClassName="min-w-[180px] flex-1"
                  label={mode === 'service' ? 'Your rate' : 'Budget'}
                  placeholder="0"
                  keyboardType="numeric"
                  value={value != null ? String(value) : ''}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
                    onChange(Number.isNaN(num) ? 0 : num);
                  }}
                  error={errors.price?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="price_type"
              render={({ field: { onChange, value } }) => (
                <View className="min-w-[180px] flex-1 gap-side-sm">
                  <Text className="text-[12px] font-extrabold uppercase leading-4 tracking-[0px]" style={{ color: c.text_secondary }}>
                    Price type
                  </Text>
                  <View className="flex-row flex-wrap gap-side-sm">
                    <Chip label="Fixed" selected={value === 'fixed'} onPress={() => onChange('fixed')} />
                    <Chip label="Hourly" selected={value === 'per_hour'} onPress={() => onChange('per_hour')} />
                    <Chip label="Daily" selected={value === 'per_day'} onPress={() => onChange('per_day')} />
                  </View>
                </View>
              )}
            />
          </View>

          <View className="gap-side-sm">
            <Text className="text-[12px] font-extrabold uppercase leading-4 tracking-[0px]" style={{ color: c.text_secondary }}>
              Listing type
            </Text>
            <Controller
              control={control}
              name="task_type"
              render={({ field: { value, onChange } }) => (
                <View className="flex-row flex-wrap gap-side-sm">
                  <Chip label="Post job" selected={value === 'task'} onPress={() => onChange('task')} />
                  <Chip label="Offer service" selected={value === 'tasker'} onPress={() => onChange('tasker')} />
                </View>
              )}
            />
          </View>

          <View className="gap-side-sm">
            <Text className="text-[12px] font-extrabold uppercase leading-4 tracking-[0px]" style={{ color: c.text_secondary }}>
              Options
            </Text>
            <View className="flex-row flex-wrap gap-side-sm">
              {optionSets[mode].map(({ key, label }) => (
                <Controller
                  key={key}
                  control={control}
                  name={key}
                  render={({ field: { value, onChange } }) => (
                    <Chip icon={value ? 'checkbox' : 'square-outline'} label={label} selected={!!value} onPress={() => onChange(!value)} />
                  )}
                />
              ))}
            </View>
          </View>

          {serverError ? (
            <StateView icon="alert-circle" title="Could not publish" body={serverError} tone="warning" />
          ) : null}
        </GlassSurface>
      </ScreenShell>

      <BottomActionBar>
        <Button
          label={isSubmitting ? 'Publishing...' : copy.submit}
          icon={isSubmitting ? undefined : mode === 'service' ? 'checkmark-circle-outline' : 'send'}
          variant="primary"
          className="flex-1"
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
          testID={`${mode}-listing-submit`}
        />
      </BottomActionBar>
    </View>
  );
}
