import { TabScene } from '@/components/side/TabScene';
import { MarketplaceHomeScreen } from '@/features/marketplace/MarketplaceHomeScreen';

export default function LandingPageRoute() {
  return (
    <TabScene edgeToEdge>
      <MarketplaceHomeScreen />
    </TabScene>
  );
}
