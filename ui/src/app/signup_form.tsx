import { Stack } from 'expo-router'
import { AuthPanel } from '@/components/AuthPanel'

export default function SignupFormRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AuthPanel mode="signup" />
    </>
  )
}
