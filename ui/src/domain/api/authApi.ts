import { apiGet } from '@/data/api'

import { authSessionSchema, type AuthSession } from '@/data/contract'

export async function getSession(): Promise<AuthSession> {
  return authSessionSchema.parse(await apiGet('/auth/session'))
}

export async function logout() {
  return apiGet('/auth/logout')
}
