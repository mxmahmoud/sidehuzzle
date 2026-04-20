import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function ReportReasonSelectionRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Report reason"
      body="Choose the issue that best matches what happened."
      icon="warning-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}