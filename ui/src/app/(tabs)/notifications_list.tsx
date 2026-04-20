import { TabScene } from '@/components/side/TabScene';
import { NotificationsScreen } from '@/features/marketplace/NotificationsScreen';

export default function NotificationsListRoute() {
  return (
    <TabScene>
      <NotificationsScreen />
    </TabScene>
  );
}
