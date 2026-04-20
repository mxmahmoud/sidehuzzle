import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function SettingsPrivacyRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Privacy settings"
      body="Control profile visibility and safety preferences."
      icon="shield-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}