import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function ApplicantsListRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Applicants"
      body="Review people who responded to your open jobs."
      icon="people-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}