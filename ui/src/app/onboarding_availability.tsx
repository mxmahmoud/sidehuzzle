import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function OnboardingAvailabilityRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Availability"
      body="Tell customers when you can take work."
      icon="calendar-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}