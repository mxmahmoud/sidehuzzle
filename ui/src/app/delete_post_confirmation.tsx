import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function DeletePostConfirmationRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Delete post"
      body="Confirm whether this listing should be removed."
      icon="trash-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}