import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function AccountSettingsRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Account settings"
      body="Manage security, privacy, notifications, and marketplace preferences."
      icon="settings-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}