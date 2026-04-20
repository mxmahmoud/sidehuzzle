import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function PaymentCardAddRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Add card"
      body="Add a payment method for bookings and payouts."
      icon="card-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}