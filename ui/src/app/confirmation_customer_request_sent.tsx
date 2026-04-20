import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function ConfirmationCustomerRequestSentRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Request sent"
      body="The worker can now respond with availability and next steps."
      icon="send-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}