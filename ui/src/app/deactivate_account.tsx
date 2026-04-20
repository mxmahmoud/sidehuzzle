import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function DeactivateAccountRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Deactivate account"
      body="Review account status before making irreversible changes."
      icon="alert-circle-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}