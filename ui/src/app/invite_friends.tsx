import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function InviteFriendsRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Invite friends"
      body="Bring trusted people into your marketplace network."
      icon="mail-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}