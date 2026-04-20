import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function AuthSuccessSplashRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="You are signed in"
      body="Your marketplace session is ready."
      icon="checkmark-circle-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}