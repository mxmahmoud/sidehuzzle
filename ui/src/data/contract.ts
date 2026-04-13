import { z } from 'zod'

const nullableDateTime = z.string().datetime().nullable()

const authUserSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  email: z.string().email(),
})

export const authSessionSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
  user: authUserSchema,
})

export const taskSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  short_description: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  price: z.number().nullable().optional(),
  price_type: z.string().nullable().optional(),
  task_type: z.string().nullable().optional(),
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
  distance_km: z.number().optional(),
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

const referenceItemSchema = z.object({
  id: z.number().int(),
  name: z.string(),
})

export const referenceDataSchema = z.object({
  categories: z.array(referenceItemSchema),
  countries: z.array(referenceItemSchema),
  states: z.array(referenceItemSchema),
  roles: z.array(referenceItemSchema),
})

export type AuthSession = z.infer<typeof authSessionSchema>
export type Task = z.infer<typeof taskSchema>
export type ChatMessage = z.infer<typeof chatMessageSchema>
export type ChatRoom = z.infer<typeof chatRoomSchema>
export type ReferenceData = z.infer<typeof referenceDataSchema>
