import { apiGet } from '@/data/api'

export async function fetchNotifications() {
  return apiGet('/notifications')
}
