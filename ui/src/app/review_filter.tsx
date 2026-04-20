import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function ReviewFilterRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Review filters"
      body="Narrow reviews by signal and rating."
      icon="filter-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}