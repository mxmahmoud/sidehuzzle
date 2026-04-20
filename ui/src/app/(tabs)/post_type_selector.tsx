import { GuestGate } from '@/components/GuestGate';
import { GenericRouteScreen } from '@/components/side/GenericRouteScreen';
import { TabScene } from '@/components/side/TabScene';

export default function PostTypeSelectorRoute() {
  return (
    <TabScene>
      <GuestGate>
        <GenericRouteScreen
          eyebrow="Create"
          title="What do you want to post?"
          body="Choose whether you need help from a trusted pro or want to offer your own service."
          icon="add-circle-outline"
          actions={[
            { label: 'Post Job', href: '/help_request_form', icon: 'briefcase-outline', variant: 'primary' },
            { label: 'Offer Service', href: '/worker_service_form', icon: 'shield-checkmark-outline', variant: 'secondary' },
          ]}
        />
      </GuestGate>
    </TabScene>
  );
}
