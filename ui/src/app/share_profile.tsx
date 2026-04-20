import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function ShareProfileRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Share profile"
      body="Send your public profile to customers or collaborators."
      icon="share-social-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}