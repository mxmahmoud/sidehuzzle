import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function ChatThreadRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Conversation"
      body="Keep messages, offers, and job context together."
      icon="chatbubble-ellipses-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}