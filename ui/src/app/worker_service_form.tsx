import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { zodResolver } from '@/lib/zodResolver';
import { Picker } from '@react-native-picker/picker';
import { createTask } from '@/domain/api/taskApi';
import { taskCreateSchema, type TaskCreate } from '@/data/contract';
import { useThemeColors } from '@/theme/useThemeColors';
import { AmbientGlassBackground } from '@/components/AmbientGlassBackground';
import { GlassCard } from '@/components/GlassCard';
import { GlassFormFooter, GlassFormHeader, formLayoutStyles } from '@/components/GlassFormChrome';
import { GlassInputFrame } from '@/components/GlassInputFrame';
import { radius, space } from '@/theme/tokens';



function GlassInput({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <GlassInputFrame error={error}>
      {children}
    </GlassInputFrame>
  );
}

export default function WorkerServiceFormRoute() {
  const c = useThemeColors();
  const router = useRouter();
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
      price_type: 'per_hour',
      task_type: 'tasker',
      asap: false,
      professional: true,
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
      await createTask({ ...data, professional: true });
      router.replace('/confirmation_service_listed');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: c.background_alt }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <AmbientGlassBackground />
      <GlassFormHeader title="Offer a service" meta="1 of 1" />

      <ScrollView contentContainerStyle={formLayoutStyles.content} keyboardShouldPersistTaps="handled">
        <GlassCard variant="elevated" style={{ padding: space.xl, gap: space.xl }}>
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: c.text_secondary }]}>Service title *</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <GlassInput error={errors.name?.message}>
                  <TextInput
                    style={[styles.input, { color: c.text_primary }]}
                    placeholder="e.g. Professional deep cleaning services"
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
                    placeholder="Describe your service, experience, and what makes you stand out..."
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
            <Text style={[styles.label, { color: c.text_secondary }]}>Your rate</Text>
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
                      <Picker.Item label="per hour" value="per_hour" />
                      <Picker.Item label="fixed" value="fixed" />
                      <Picker.Item label="per day" value="per_day" />
                    </Picker>
                  </GlassInput>
                )}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: c.text_secondary }]}>Service type</Text>
            <View style={styles.toggleRow}>
              {(['tasker', 'task'] as const).map((type) => (
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
                            value === type ? c.surface_selected : c.glass_input,
                          borderColor: value === type ? c.accent_primary : c.glass_border,
                          borderWidth: 1,
                        },
                      ]}
                      accessibilityRole="button"
                    >
                      <Text
                        style={{
                          color: value === type ? c.accent_primary : c.text_secondary,
                          fontSize: 13,
                          fontWeight: '600',
                        }}
                      >
                        {type === 'tasker' ? 'Service profile' : 'Job request'}
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
                { key: 'remote_work', label: 'Remote ok' },
                { key: 'recurring', label: 'Recurring clients' },
                { key: 'asap', label: 'Available ASAP' },
              ].map(({ key, label }) => (
                <Controller
                  key={key}
                  control={control}
                  name={key as 'remote_work' | 'recurring' | 'asap'}
                  render={({ field: { value, onChange } }) => (
                    <Pressable
                      onPress={() => onChange(!value)}
                      style={[
                        styles.checkItem,
                        {
                          backgroundColor: value ? c.surface_selected : c.glass_input,
                          borderColor: value ? c.accent_primary : c.glass_border,
                          borderWidth: 1,
                        },
                      ]}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: !!value }}
                    >
                      <Ionicons
                        name={value ? 'checkbox' : 'square-outline'}
                        size={16}
                        color={value ? c.accent_primary : c.text_secondary}
                      />
                      <Text style={{ color: value ? c.accent_primary : c.text_secondary, fontSize: 13, fontWeight: '500' }}>
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
                    placeholder="Add details about your skills, equipment, coverage area..."
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
            <View style={[styles.errorBanner, { backgroundColor: 'rgba(255,107,87,0.12)', borderColor: c.accent_warning, borderWidth: 1, borderRadius: radius.button }]}>
              <Ionicons name="alert-circle" size={18} color={c.accent_warning} />
              <Text style={{ color: c.accent_warning, fontSize: 14 }}>{serverError}</Text>
            </View>
          )}
        </GlassCard>
      </ScrollView>

      <GlassFormFooter
        primaryLabel={isSubmitting ? 'Publishing...' : 'Publish service'}
        icon={isSubmitting ? undefined : 'checkmark-circle-outline'}
        disabled={isSubmitting}
        onPrimaryPress={handleSubmit(onSubmit)}
      />
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
