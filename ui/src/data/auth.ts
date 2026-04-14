import { apiPost, getApiBaseUrl } from '@/data/api'
import { useSessionStore, type SessionUser } from '@/stores/sessionStore'
import { userReadSchema } from '@/data/contract'

export type LoginPayload = {
  email: string
  password: string
}

export type SignupPayload = {
  email: string
  password: string
  username?: string
  first_name?: string
  last_name?: string
}

export type OAuthProvider = 'google' | 'apple' | 'microsoft' | 'facebook'

export async function login(payload: LoginPayload): Promise<SessionUser> {
  const user = userReadSchema.parse(
    await apiPost('/login/json', payload),
  )
  useSessionStore.getState().signIn(user)
  return useSessionStore.getState().user!
}

export async function signup(payload: SignupPayload): Promise<SessionUser> {
  const user = userReadSchema.parse(
    await apiPost('/register', payload),
  )
  useSessionStore.getState().signIn(user)
  return useSessionStore.getState().user!
}

export function getOAuthLoginUrl(provider: OAuthProvider): string {
  return `${getApiBaseUrl()}/login/${provider}`
}

export async function assertAuthBackendReachable(): Promise<void> {
  const baseUrl = getApiBaseUrl()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 2500)

  try {
    const response = await fetch(`${baseUrl}/health`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
    if (!response.ok) {
      throw new Error(`FastAPI returned ${response.status}`)
    }
  } catch {
    throw new Error(
      `FastAPI is not reachable at ${baseUrl}. Start the backend or set EXPO_PUBLIC_API_BASE_URL before using Google sign-in.`,
    )
  } finally {
    clearTimeout(timeout)
  }
}

export async function logout(): Promise<void> {
  await apiPost('/logout/json', {})
  useSessionStore.getState().signOut()
}
