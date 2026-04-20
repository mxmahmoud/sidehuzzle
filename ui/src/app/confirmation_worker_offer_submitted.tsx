import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function ConfirmationWorkerOfferSubmittedRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Offer submitted"
      body="The customer can review your rate and message."
      icon="paper-plane-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}