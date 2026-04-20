import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function UnfollowConfirmationModalRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Unfollow user"
      body="Confirm whether to remove this profile from followed users."
      icon="person-remove-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}