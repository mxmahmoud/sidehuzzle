import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function ChangePasswordFormRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Change password"
      body="Keep your SideHuzle account secure."
      icon="lock-closed-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}