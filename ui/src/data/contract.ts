import { z } from 'zod'

const nullableDateTime = z.string().datetime().nullable()

// Auth — /session returns UserRead directly, or null
export const userReadSchema = z.object({
  id: z.number().int(),
  username: z.string().nullable().optional(),
  email: z.string().email(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  // name is a computed_field from first_name + last_name
  name: z.string().nullable().optional(),
  active: z.boolean().optional(),
})
export type UserRead = z.infer<typeof userReadSchema>

export const authSessionSchema = userReadSchema.nullable()
export type AuthSession = UserRead | null

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const taskSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  short_description: z.string(),
  description: z.string(),
  price: z.number().nullable().optional(),
  price_type: z.enum(['fixed', 'per_hour', 'per_day']).nullable().optional(),
  task_type: z.enum(['task', 'tasker']).nullable().optional(),
  asap: z.boolean().optional(),
  professional: z.boolean().optional(),
  recurring: z.boolean().optional(),
  remote_work: z.boolean().optional(),
  work_required_from: nullableDateTime.optional(),
  work_required_to: nullableDateTime.optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  user_id: z.number().int().nullable().optional(),
  category_id: z.number().int().nullable().optional(),
  address_id: z.number().int().nullable().optional(),
  active: z.boolean().optional(),
  status: z.string().optional(),
  completed_at: z.string().nullable().optional(),
  distance_km: z.number().optional(),
})

export const taskCreateSchema = z.object({
  name: z.string().min(1, 'Title is required').max(200),
  short_description: z.string().min(1, 'Short description is required').max(500),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  price_type: z.enum(['fixed', 'per_hour', 'per_day']).optional(),
  task_type: z.enum(['task', 'tasker']).optional(),
  asap: z.boolean().optional(),
  professional: z.boolean().optional(),
  recurring: z.boolean().optional(),
  remote_work: z.boolean().optional(),
  work_required_from: nullableDateTime.optional(),
  work_required_to: nullableDateTime.optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  category_id: z.number().int().positive('Category is required'),
  address_id: z.number().int().positive('Address is required'),
})

export const addressCreateSchema = z.object({
  street: z.string().min(1),
  house_number: z.string().min(1),
  staircase: z.string().optional(),
  floor: z.string().optional(),
  door: z.string().optional(),
  zipCode: z.string().min(1),
  city: z.string().min(1),
  state_id: z.number().int().positive(),
  country_id: z.number().int().positive(),
})

export const categorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  parent_id: z.number().int().nullable().optional(),
})

export const stateSchema = z.object({
  id: z.number().int(),
  name: z.string(),
})

export const countrySchema = z.object({
  id: z.number().int(),
  name: z.string(),
})

export const chatMessageSchema = z.object({
  id: z.number().int(),
  content: z.string(),
  timestamp: z.string().datetime(),
  sender_id: z.number().int(),
})

export const chatRoomSchema = z.object({
  id: z.number().int(),
  task_id: z.number().int(),
  creator_id: z.number().int(),
  participant_id: z.number().int(),
  messages: z.array(chatMessageSchema).default([]),
})

export const referenceDataSchema = z.object({
  categories: z.array(categorySchema),
  countries: z.array(countrySchema),
  states: z.array(stateSchema),
})

export type Task = z.infer<typeof taskSchema>
export type TaskCreate = z.infer<typeof taskCreateSchema>
export type AddressCreate = z.infer<typeof addressCreateSchema>
export type ChatMessage = z.infer<typeof chatMessageSchema>
export type ChatRoom = z.infer<typeof chatRoomSchema>
export type ReferenceData = z.infer<typeof referenceDataSchema>
