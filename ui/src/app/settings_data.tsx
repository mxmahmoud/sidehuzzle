import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function SettingsDataRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Data settings"
      body="Manage exports, deletion, and marketplace data controls."
      icon="server-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}