import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function MembershipPlansRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Membership plans"
      body="Compare marketplace membership options."
      icon="diamond-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}