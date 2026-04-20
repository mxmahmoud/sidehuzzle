import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function OptionsMenuRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Options"
      body="Quick access to marketplace settings and support."
      icon="menu-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}