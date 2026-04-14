import { apiGet, apiPost, apiPatch } from '@/data/api'
import { z } from 'zod'

export const notificationSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string(),
  message: z.string(),
  kind: z.string(),
  read: z.boolean(),
  link: z.string().nullable(),
  created_at: z.string().nullable(),
})

export type Notification = z.infer<typeof notificationSchema>

export type NotificationList = Notification[]

export async function getNotifications(params?: {
  unread_only?: boolean
  limit?: number
  offset?: number
}): Promise<NotificationList> {
  const qs = new URLSearchParams()
  if (params?.unread_only) qs.set('unread_only', 'true')
  if (params?.limit) qs.set('limit', String(params.limit))
  if (params?.offset) qs.set('offset', String(params.offset))
  const query = qs.toString() ? `?${qs.toString()}` : ''
  return notificationSchema.array().parse(await apiGet(`/notifications${query}`))
}

export async function getUnreadCount(): Promise<{ unread_count: number }> {
  return await apiGet('/notifications/unread-count')
}

export async function markRead(notificationId: number): Promise<Notification> {
  return notificationSchema.parse(
    await apiPatch(`/notifications/${notificationId}/read`, {}),
  )
}

export async function markAllRead(): Promise<{ updated: number }> {
  return await apiPost('/notifications/read-all', {})
}
