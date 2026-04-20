import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function SavedPostsRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Saved posts"
      body="Return to jobs and pros you saved."
      icon="bookmark-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}