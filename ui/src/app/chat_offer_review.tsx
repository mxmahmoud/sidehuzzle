import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function ChatOfferReviewRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Review offer"
      body="Check offer details before accepting or continuing the chat."
      icon="pricetag-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}