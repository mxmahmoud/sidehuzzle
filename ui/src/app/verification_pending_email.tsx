import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function VerificationPendingEmailRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Check your email"
      body="Finish verification from your inbox."
      icon="mail-open-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}