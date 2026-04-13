import { apiGet } from '@/data/api'

import { taskSchema, type Task } from '@/data/contract'

export interface TaskSearchParams {
  limit?: number
  offset?: number
  order?: string
  category?: string
  distance?: number
}

export async function searchTasks(params: TaskSearchParams = {}): Promise<Task[]> {
  const query = new URLSearchParams()

  if (params.limit) query.set('limit', String(params.limit))
  if (params.offset) query.set('offset', String(params.offset))
  if (params.order) query.set('order', params.order)
  if (params.category) query.set('category', params.category)
  if (params.distance) query.set('distance', String(params.distance))

  const qs = query.toString()

  return (await apiGet(`/tasks/search${qs ? `?${qs}` : ''}`)).map((task) =>
    taskSchema.parse(task),
  )
}

export async function getTaskById(taskId: string | number): Promise<Task> {
  return taskSchema.parse(await apiGet(`/tasks/${taskId}`))
}
