import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
export default function UserPostedJobsListRoute() {
  return (
    <GenericRouteScreen
      eyebrow="SideHuzle"
      title="Posted jobs"
      body="Review jobs this user has posted."
      icon="briefcase-outline"
      actions={[{ label: 'Back to marketplace', href: '/(tabs)/landing_page', icon: 'map-outline', variant: 'primary' }]}
    />
  );
}