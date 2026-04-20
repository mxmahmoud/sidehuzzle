import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function AccountInfoEditRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Edit profile"
      body="Update public profile details and trust information."
      icon="person-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}