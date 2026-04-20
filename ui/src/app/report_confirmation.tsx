import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function ReportConfirmationRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Report sent"
      body="Trust and safety will review the report."
      icon="shield-checkmark-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}