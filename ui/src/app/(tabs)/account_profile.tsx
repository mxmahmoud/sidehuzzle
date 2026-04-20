import { TabScene } from '@/components/side/TabScene';
import { AccountProfileScreen } from '@/features/marketplace/AccountProfileScreen';

export default function AccountProfileRoute() {
  return (
    <TabScene>
      <AccountProfileScreen />
    </TabScene>
  );
}
