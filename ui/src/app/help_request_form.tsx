import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { zodResolver } from '@/lib/zodResolver';
import { Picker } from '@react-native-picker/picker';
import { createTask } from '@/domain/api/taskApi';
import { taskCreateSchema, type TaskCreate } from '@/data/contract';
import { useThemeColors } from '@/theme/useThemeColors';
import { GlassCard } from '@/components/GlassCard';
import { radius, space, type as typeStyles } from '@/theme/tokens';


function GlassInput({
  error,
  children,
}: {
  error?: string;
  children: React.ReactNode;
}) {
  const c = useThemeColors();
  const g = { bg: c.glass_surface, border: c.glass_border, borderTop: c.glass_border_top };
  return (
    <View
      style={{
        backgroundColor: g.bg,
        borderColor: error ? c.accent_warning : g.border,
        borderWidth: 1,
        borderRadius: radius.button,
        overflow: 'hidden',
      }}
    >
      {children}
      {error && (
        <Text style={[styles.errorText, { color: c.accent_warning }]}>{error}</Text>
      )}
    </View>
  );
}

export default function HelpRequestFormRoute() {
  const c = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskCreate>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: {
      name: '',
      short_description: '',
      description: '',
      price: 0,
      price_type: 'fixed',
      task_type: 'task',
      asap: false,
      professional: false,
      recurring: false,
      remote_work: false,
      work_required_from: undefined,
      work_required_to: undefined,
      latitude: undefined,
      longitude: undefined,
      category_id: 1,
      address_id: 1,
    },
  });

  const onSubmit = async (data: TaskCreate) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      await createTask(data);
      router.replace('/confirmation_help_wanted_posted');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const g = { bg: c.glass_surface, border: c.glass_border, borderTop: c.glass_border_top };

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      {/* Glass Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + space.sm,
            backgroundColor: g.bg,
            borderBottomColor: g.border,
            // @ts-ignore – web-only
            WebkitBackdropFilter: 'blur(24px)',
            backdropFilter: 'blur(24px)',
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button">
          <Ionicons name="arrow-back" size={22} color={c.text_primary} />
        </Pressable>
        <Text style={[typeStyles.subtitle, { color: c.text_primary, flex: 1 }]}>Post a job</Text>
        <View
          style={[
            styles.stepBadge,
            { backgroundColor: g.bg, borderColor: g.border, borderWidth: 1 },
          ]}
        >
          <Text style={{ color: c.text_secondary, fontSize: 12, fontWeight: '600' }}>1 of 1</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <GlassCard style={{ padding: space.xl, gap: space.xl }}>
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: c.text_secondary }]}>What's needed? *</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <GlassInput error={errors.name?.message}>
                  <TextInput
                    style={[styles.input, { color: c.text_primary }]}
                    placeholder="e.g. Moving help for 2BR apartment"
                    placeholderTextColor={c.text_secondary}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    maxLength={200}
                  />
                </GlassInput>
              )}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: c.text_secondary }]}>Short description *</Text>
            <Controller
              control={control}
              name="short_description"
              render={({ field: { onChange, onBlur, value } }) => (
                <GlassInput error={errors.short_description?.message}>
                  <TextInput
                    style={[styles.input, styles.multilineInput, { color: c.text_primary }]}
                    placeholder="Briefly describe the job..."
                    placeholderTextColor={c.text_secondary}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline
                    numberOfLines={3}
                    maxLength={500}
                  />
                </GlassInput>
              )}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: c.text_secondary }]}>Budget</Text>
            <View style={styles.row}>
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, onBlur, value } }) => (
                  <GlassInput>
                    <TextInput
                      style={[styles.input, { color: c.text_primary, flex: 1 }]}
                      placeholder="0"
                      placeholderTextColor={c.text_secondary}
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        const num = parseFloat(text.replace(/[^0-9.]/g, ''));
                        onChange(isNaN(num) ? undefined : num);
                      }}
                      value={value != null ? String(value) : ''}
                    />
                  </GlassInput>
                )}
              />
              <Controller
                control={control}
                name="price_type"
                render={({ field: { onChange, value } }) => (
                  <GlassInput>
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={{ color: c.text_primary, height: 52 }}
                      itemStyle={{ color: c.text_primary }}
                    >
                      <Picker.Item label="Fixed" value="fixed" />
                      <Picker.Item label="Hourly" value="per_hour" />
                      <Picker.Item label="Daily" value="per_day" />
                    </Picker>
                  </GlassInput>
                )}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: c.text_secondary }]}>Job type</Text>
            <View style={styles.toggleRow}>
              {(['task', 'tasker'] as const).map((type) => (
                <Controller
                  key={type}
                  control={control}
                  name="task_type"
                  render={({ field: { value, onChange } }) => (
                    <Pressable
                      onPress={() => onChange(type)}
                      style={[
                        styles.toggleChip,
                        {
                          backgroundColor:
                            value === type ? 'rgba(109,156,255,0.22)' : g.bg,
                          borderColor: value === type ? c.pin_job : g.border,
                          borderWidth: 1,
                        },
                      ]}
                      accessibilityRole="button"
                    >
                      <Text
                        style={{
                          color: value === type ? c.pin_job : c.text_secondary,
                          fontSize: 13,
                          fontWeight: '600',
                        }}
                      >
                        {type === 'task' ? 'Job request' : 'Service profile'}
                      </Text>
                    </Pressable>
                  )}
                />
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: c.text_secondary }]}>Options</Text>
            <View style={styles.checkRow}>
              {[
                { key: 'asap', label: 'ASAP' },
                { key: 'remote_work', label: 'Remote ok' },
                { key: 'recurring', label: 'Recurring' },
              ].map(({ key, label }) => (
                <Controller
                  key={key}
                  control={control}
                  name={key as 'asap' | 'remote_work' | 'recurring'}
                  render={({ field: { value, onChange } }) => (
                    <Pressable
                      onPress={() => onChange(!value)}
                      style={[
                        styles.checkItem,
                        {
                          backgroundColor: value ? 'rgba(109,156,255,0.18)' : g.bg,
                          borderColor: value ? c.pin_job : g.border,
                          borderWidth: 1,
                        },
                      ]}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: !!value }}
                    >
                      <Ionicons
                        name={value ? 'checkbox' : 'square-outline'}
                        size={16}
                        color={value ? c.pin_job : c.text_secondary}
                      />
                      <Text style={{ color: value ? c.pin_job : c.text_secondary, fontSize: 13, fontWeight: '500' }}>
                        {label}
                      </Text>
                    </Pressable>
                  )}
                />
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: c.text_secondary }]}>Full description *</Text>
            <GlassInput>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, styles.multilineInput, { color: c.text_primary }]}
                    placeholder="Add any details, access notes, requirements..."
                    placeholderTextColor={c.text_secondary}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline
                    numberOfLines={5}
                  />
                )}
              />
            </GlassInput>
          </View>

          {serverError && (
            <View
              style={[
                styles.errorBanner,
                { backgroundColor: 'rgba(255,107,87,0.12)', borderColor: c.accent_warning, borderWidth: 1, borderRadius: radius.button },
              ]}
            >
              <Ionicons name="alert-circle" size={18} color={c.accent_warning} />
              <Text style={{ color: c.accent_warning, fontSize: 14 }}>{serverError}</Text>
            </View>
          )}
        </GlassCard>
      </ScrollView>

      {/* Glass Footer */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: g.bg,
            borderTopColor: g.border,
            // @ts-ignore – web-only
            WebkitBackdropFilter: 'blur(24px)',
            backdropFilter: 'blur(24px)',
            paddingBottom: insets.bottom + space.md,
          },
        ]}
      >
        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={[
            styles.submitBtn,
            {
              backgroundColor: isSubmitting ? c.text_secondary : c.accent_primary,
            },
          ]}
          accessibilityRole="button"
        >
          {isSubmitting ? (
            <Text style={styles.submitBtnText}>Posting...</Text>
          ) : (
            <>
              <Ionicons name="send" size={18} color="#FFF" />
              <Text style={styles.submitBtnText}>Post job request</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingBottom: space.md,
    borderBottomWidth: 1,
  },
  backBtn: { padding: space.xs },
  stepBadge: {
    borderRadius: radius.chip,
    paddingHorizontal: space.md,
    paddingVertical: 4,
  },
  content: { padding: space.md, gap: space.md },
  fieldGroup: { gap: space.sm },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  input: { fontSize: 15, paddingHorizontal: space.md, paddingVertical: space.md, minHeight: 48 },
  multilineInput: { minHeight: 96, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: space.sm, alignItems: 'center' },
  toggleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  toggleChip: { borderRadius: radius.chip, paddingHorizontal: space.md, paddingVertical: space.sm },
  checkRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderRadius: radius.chip,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  errorText: { fontSize: 12, fontWeight: '500', paddingHorizontal: space.md, paddingBottom: space.sm },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md },
  footer: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
    borderTopWidth: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    borderRadius: radius.button,
    paddingVertical: space.lg,
  },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
