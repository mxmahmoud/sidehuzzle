import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function ConfirmationHelpWantedPostedRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Job posted"
      body="Your request is live for trusted pros nearby."
      icon="briefcase-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}