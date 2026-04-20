import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function GoogleRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Google sign-in"
      body="Continue with Google to connect your SideHuzle account."
      icon="logo-google"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}