import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function CategoriesOverviewRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Categories"
      body="Browse common job and service categories."
      icon="grid-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}