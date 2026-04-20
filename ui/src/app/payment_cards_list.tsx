import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function PaymentCardsListRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Payment cards"
      body="Manage saved payment cards."
      icon="card-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}