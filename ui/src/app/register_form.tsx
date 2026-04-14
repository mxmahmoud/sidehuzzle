import { Redirect } from 'expo-router'

// Legacy route — users who end up here should go to signup_form
export default function RegisterFormRoute() {
  return <Redirect href="/signup_form" />
}
