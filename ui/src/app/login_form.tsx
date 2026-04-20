import { Stack } from 'expo-router';
import { MarketplaceAuthPanel } from '@/features/marketplace/MarketplaceAuthPanel';

export default function LoginFormRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <MarketplaceAuthPanel mode="login" />
    </>
  );
}
