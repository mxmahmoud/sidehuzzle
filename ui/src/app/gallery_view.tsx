import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function GalleryViewRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Gallery"
      body="Review listing photos and project evidence."
      icon="images-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}