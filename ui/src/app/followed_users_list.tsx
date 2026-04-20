import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function FollowedUsersListRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Followed users"
      body="Keep track of workers and customers you may want to hire again."
      icon="people-circle-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}