import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function PaymentCardsManageRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Manage payments"
      body="Update billing methods and payment preferences."
      icon="wallet-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}