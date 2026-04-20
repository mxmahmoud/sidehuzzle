import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function ForgotPasswordRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Reset password"
      body="Get back into your account safely."
      icon="key-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}