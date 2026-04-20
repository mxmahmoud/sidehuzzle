import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function HistoryPageRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="History"
      body="See previous work, requests, and marketplace activity."
      icon="time-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}