import { apiGet } from '@/data/api'

export async function getCurrentUser() {
  return apiGet('/me')
}

export async function getUserProfile(userId: string | number) {
  return apiGet(`/users/${userId}`)
}

export async function getUserReviews(userId: string | number) {
  return apiGet(`/users/${userId}/reviews`)
}
