import { apiGet, apiPost } from '@/data/api'
import { DEFAULT_CENTER } from '@/data/listingCoordinates'
import { taskSchema, categorySchema, type Task, type TaskCreate } from '@/data/contract'

export interface TaskSearchParams {
  limit?: number
  offset?: number
  order?: string
  category?: string
  distance?: number
  search?: string
  min_price?: number
  max_price?: number
  task_type?: 'task' | 'tasker'
}

export async function searchTasks(params: TaskSearchParams = {}): Promise<Task[]> {
  const query = new URLSearchParams()

  if (params.limit) query.set('limit', String(params.limit))
  if (params.offset) query.set('offset', String(params.offset))
  query.set('latitude', String(DEFAULT_CENTER.latitude))
  query.set('longitude', String(DEFAULT_CENTER.longitude))
  query.set('radius_km', String(params.distance ?? 10))
  query.set('limit', String(params.limit ?? 20))
  query.set('offset', String(params.offset ?? 0))
  if (params.order) query.set('sort_by', params.order)
  if (params.category) query.set('category', params.category)
  if (params.search) query.set('search', params.search)
  if (params.min_price != null) query.set('min_price', String(params.min_price))
  if (params.max_price != null) query.set('max_price', String(params.max_price))
  if (params.task_type) query.set('task_type', params.task_type)
  const qs = query.toString()

  const items = await apiGet<Task[]>(`/tasks/search${qs ? `?${qs}` : ''}`)
  return items.map((task) => taskSchema.parse(task))
}

export async function getTaskById(taskId: string | number): Promise<Task> {
  return taskSchema.parse(await apiGet(`/tasks/${taskId}`))
}

export async function createTask(data: TaskCreate): Promise<Task> {
  return taskSchema.parse(await apiPost('/tasks/', data))
}

export async function getCategories() {
  return categorySchema.array().parse(await apiGet('/categories/'))
}
