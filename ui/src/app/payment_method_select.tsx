import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function PaymentMethodSelectRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Select payment"
      body="Choose how this booking should be paid."
      icon="cash-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}