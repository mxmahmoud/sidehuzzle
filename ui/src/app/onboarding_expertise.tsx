import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function OnboardingExpertiseRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Expertise"
      body="Add skills that help customers choose you."
      icon="construct-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}