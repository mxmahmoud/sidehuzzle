import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function PostActionsSheetRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Post actions"
      body="Manage this listing and its visibility."
      icon="ellipsis-horizontal-circle-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}