import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function SortByModalRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Sort results"
      body="Choose how marketplace results are ordered."
      icon="swap-vertical-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}