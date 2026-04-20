import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function PaymentMethodsEmptyRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="No payment methods"
      body="Add a payment method before booking work."
      icon="card-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}