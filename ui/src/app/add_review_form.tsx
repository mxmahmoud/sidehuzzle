import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function AddReviewFormRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Add review"
      body="Share clear feedback after a completed job or service."
      icon="star-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}