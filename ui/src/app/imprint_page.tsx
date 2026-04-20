import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function ImprintPageRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Imprint"
      body="Legal and company information for SideHuzle."
      icon="document-text-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}