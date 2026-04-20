import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function UserReviewsRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="User reviews"
      body="Read customer and worker feedback."
      icon="star-half-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}