import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function SubcategoriesListRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Subcategories"
      body="Choose a more specific service area."
      icon="list-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}