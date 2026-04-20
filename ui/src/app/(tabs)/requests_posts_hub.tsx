import { TabScene } from '@/components/side/TabScene';
import { ActivityHubScreen } from '@/features/marketplace/ActivityHubScreen';

export default function RequestsPostsHubRoute() {
  return (
    <TabScene>
      <ActivityHubScreen />
    </TabScene>
  );
}
