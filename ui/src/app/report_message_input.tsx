import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function ReportMessageInputRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Report details"
      body="Add context so support can review the issue."
      icon="flag-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}