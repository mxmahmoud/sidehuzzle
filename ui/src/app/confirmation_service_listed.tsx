import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function ConfirmationServiceListedRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Service listed"
      body="Customers can now discover and request your service."
      icon="checkmark-circle-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}