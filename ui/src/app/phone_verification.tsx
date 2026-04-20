import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function PhoneVerificationRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Verify phone"
      body="Use phone verification to increase trust."
      icon="call-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}