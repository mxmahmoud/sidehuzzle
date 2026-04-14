import { Stack } from 'expo-router';
import { AuthPanel } from '@/components/AuthPanel';

export default function LoginFormRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <AuthPanel mode="login" />
    </>
  );
}
