import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function DeclineRatingRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Decline rating"
      body="Skip feedback for this completed interaction."
      icon="remove-circle-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}