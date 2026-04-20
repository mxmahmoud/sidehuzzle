import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function MembershipCancelConfirmRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Cancel membership"
      body="Review your plan before changing membership status."
      icon="close-circle-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}