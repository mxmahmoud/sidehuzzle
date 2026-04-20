import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function UserProfileExternalRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Public profile"
      body="Review trust signals, work history, and public details."
      icon="person-circle-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}