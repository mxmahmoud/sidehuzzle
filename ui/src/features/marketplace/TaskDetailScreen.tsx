import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Text, View } from 'react-native';
import { BottomActionBar } from '@/components/side/BottomActionBar';
import { Button } from '@/components/side/Button';
import { DetailHero } from '@/components/side/DetailHero';
import { GlassSurface } from '@/components/side/GlassSurface';
import { ScreenShell } from '@/components/side/ScreenShell';
import { StateView } from '@/components/side/StateView';
import { getTaskById } from '@/domain/api/taskApi';
import { readableTaskType, taskToListing } from '@/data/listingPresentation';
import { useThemeColors } from '@/theme/useThemeColors';
import { type as typeStyles } from '@/theme/tokens';

type Mode = 'job' | 'worker';

export function TaskDetailScreen({ mode }: { mode: Mode }) {
  const c = useThemeColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: task, isLoading, isError, refetch } = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskById(id ?? '0'),
    enabled: id != null,
  });
  const listing = task ? taskToListing(task, 0) : null;
  const isWorker = mode === 'worker';

  return (
    <View className="flex-1" style={{ backgroundColor: c.background_alt }} testID={`${mode}-detail`}>
      <Stack.Screen options={{ title: isWorker ? 'Worker profile' : 'Job detail', headerShown: true }} />
      <ScreenShell scroll maxWidth="lg" contentClassName="gap-side-lg" withBackground>
        {isLoading ? (
          <StateView icon="hourglass-outline" title={isWorker ? 'Loading worker profile' : 'Loading job'} body="Fetching the latest marketplace details." />
        ) : isError || !task ? (
          <StateView
            icon="alert-circle-outline"
            title={isWorker ? 'Worker not found' : 'Job not found'}
            body="The listing may have expired or the backend is unavailable."
            actionLabel="Retry"
            tone="warning"
            onAction={() => void refetch()}
          />
        ) : (
          <>
            <DetailHero
              imageUrl={listing?.imageUrl}
              imageColor={listing?.imageColor}
              badge={isWorker ? 'Service profile' : 'Job request'}
              badgeTone={isWorker ? 'worker' : 'job'}
              title={task.name}
              subtitle={task.short_description ?? task.description ?? 'No description provided.'}
            />

            <View className="flex-row flex-wrap gap-side-sm">
              <GlassSurface variant="surface" className="min-w-[150px] flex-1 items-center gap-side-xs p-side-md">
                <Text className="text-[12px] font-bold leading-4" style={{ color: c.text_secondary }}>
                  Rate
                </Text>
                <Text style={[typeStyles.price, { color: c.text_primary }]}>{listing?.rateLabel ?? 'Contact'}</Text>
              </GlassSurface>
              <GlassSurface variant="surface" className="min-w-[150px] flex-1 items-center gap-side-xs p-side-md">
                <Text className="text-[12px] font-bold leading-4" style={{ color: c.text_secondary }}>
                  Type
                </Text>
                <Text style={[typeStyles.price, { color: c.text_primary }]}>{readableTaskType(task.task_type, isWorker ? 'worker' : 'job')}</Text>
              </GlassSurface>
              <GlassSurface variant="surface" className="min-w-[150px] flex-1 items-center gap-side-xs p-side-md">
                <Text className="text-[12px] font-bold leading-4" style={{ color: c.text_secondary }}>
                  Distance
                </Text>
                <Text style={[typeStyles.price, { color: c.text_primary }]}>{task.distance_km != null ? `${task.distance_km.toFixed(1)} km` : listing?.locationLabel ?? 'Nearby'}</Text>
              </GlassSurface>
            </View>

            <GlassSurface variant="surface" className="gap-side-md p-side-lg">
              <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>{isWorker ? 'Trust and profile' : 'Poster profile'}</Text>
              <Text className="text-[14px] leading-[22px]" style={{ color: c.text_secondary }}>
                {isWorker ? 'Review service history, ratings, and verified profile signals before sending a request.' : "Open the poster's profile before applying so expectations are clear."}
              </Text>
              <View className="flex-row flex-wrap gap-side-sm">
                {isWorker ? <Button label="View reviews" icon="star-outline" variant="secondary" onPress={() => router.push({ pathname: '/user_reviews', params: { id } })} /> : null}
                <Button label="View full profile" icon="person-outline" variant="secondary" onPress={() => router.push({ pathname: '/user_profile_external', params: { id: String(task.user_id) } })} />
              </View>
            </GlassSurface>

            {task.description ? (
              <GlassSurface variant="surface" className="gap-side-sm p-side-lg">
                <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>{isWorker ? 'About' : 'Description'}</Text>
                <Text className="text-[14px] leading-[22px]" style={{ color: c.text_secondary }}>
                  {task.description}
                </Text>
              </GlassSurface>
            ) : null}
          </>
        )}
      </ScreenShell>

      {task ? (
        <BottomActionBar>
          <Button
            label={isWorker ? 'Request this worker' : 'Apply to this job'}
            icon={isWorker ? 'send' : 'briefcase-outline'}
            variant="primary"
            className="flex-1"
            onPress={() => {
              if (!id) return;
              router.push({ pathname: isWorker ? '/send_help_request_to_worker' : '/offer_service', params: { id } });
            }}
            testID={`${mode}-detail-primary-action`}
          />
        </BottomActionBar>
      ) : null}
    </View>
  );
}
