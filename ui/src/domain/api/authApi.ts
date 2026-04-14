import { apiPost, apiGet, apiDelete } from '@/data/api'
import {
  type UserRead,
  type AuthSession,
  authSessionSchema,
  loginSchema,
} from '@/data/contract'

/**
 * Check for an existing session on app load.
 * Returns the logged-in user, or null if not authenticated.
 */
export async function getSession(): Promise<AuthSession> {
  return authSessionSchema.parse(await apiGet('/session'))
}

/**
 * Log in with email + password.
 * Sets the session cookie on the response automatically.
 * Returns the authenticated UserRead on success.
 */
export async function login(credentials: {
  email: string
  password: string
}): Promise<UserRead> {
  const parsed = loginSchema.parse(credentials)
  return await apiPost<UserRead>('/login/json', parsed)
}

/**
 * Log out the current user. Clears the session cookie.
 */
export async function logout(): Promise<void> {
  await apiPost('/logout/json', {})
}

/**
 * Register a new user account.
 * Does NOT log in automatically — call login() after registration.
 */
export async function register(data: {
  email: string
  password: string
  username?: string
  first_name?: string
  last_name?: string
}): Promise<UserRead> {
  return await apiPost<UserRead>('/register', data)
}

/**
 * Request a password reset email for the given address.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  await apiPost('/forgot-password', { email })
}
