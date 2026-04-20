import { apiGet } from '@/data/api'
import { userReadSchema, type UserRead } from '@/data/contract'

export async function getCurrentUser(): Promise<UserRead> {
  return userReadSchema.parse(await apiGet('/me'))
}

export async function getUserProfile(userId: string | number): Promise<UserRead> {
  return userReadSchema.parse(await apiGet(`/users/${userId}`))
}

export async function getUserReviews(userId: string | number) {
  return apiGet(`/users/${userId}/reviews`)
}
