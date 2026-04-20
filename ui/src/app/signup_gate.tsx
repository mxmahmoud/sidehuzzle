import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function SignupGateRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Create an account"
      body="Sign up to save activity, post work, and message safely."
      icon="person-add-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}