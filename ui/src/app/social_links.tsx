import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function SocialLinksRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Social links"
      body="Connect public proof and professional presence."
      icon="link-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}