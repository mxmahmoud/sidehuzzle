import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function SettingsNotificationsRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Notification settings"
      body="Choose which marketplace updates reach you."
      icon="notifications-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}