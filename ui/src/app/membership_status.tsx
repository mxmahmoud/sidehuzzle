import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function MembershipStatusRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Membership status"
      body="Check your current plan and renewal state."
      icon="ribbon-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}