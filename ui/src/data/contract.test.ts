import { describe, expect, it } from 'vitest'

import {
  authSessionSchema,
  chatMessageSchema,
  chatRoomSchema,
  referenceDataSchema,
  taskSchema,
} from './contract'

describe('shared contract schemas', () => {
  it('accepts auth session payloads with current user and tokens', () => {
    const payload = authSessionSchema.parse({
      access_token: 'access-token',
      refresh_token: 'refresh-token',
      token_type: 'bearer',
      user: {
        id: 7,
        username: 'cortex',
        email: 'cortex@example.com',
      },
    })

    expect(payload.user.username).toBe('cortex')
  })

  it('accepts task payloads with nearby distance metadata', () => {
    const payload = taskSchema.parse({
      id: 11,
      name: 'Fix sink',
      short_description: 'Leaking',
      description: 'Kitchen sink needs repair',
      price: 50,
      price_type: 'fixed',
      task_type: 'service',
      asap: true,
      professional: false,
      recurring: false,
      remote_work: false,
      work_required_from: null,
      work_required_to: null,
      latitude: 51.5,
      longitude: -0.12,
      user_id: 2,
      category_id: 9,
      address_id: 4,
      active: true,
      distance_km: 1.2,
    })

    expect(payload.distance_km).toBe(1.2)
  })

  it('accepts chat payloads with nested messages', () => {
    const payload = chatRoomSchema.parse({
      id: 3,
      task_id: 11,
      creator_id: 2,
      participant_id: 4,
      messages: [
        {
          id: 1,
          content: 'Hello',
          timestamp: '2026-04-12T10:00:00Z',
          sender_id: 2,
        },
      ],
    })

    expect(payload.messages).toHaveLength(1)
    expect(chatMessageSchema.parse(payload.messages[0]).content).toBe('Hello')
  })

  it('accepts reference data payloads for categories and locations', () => {
    const payload = referenceDataSchema.parse({
      categories: [{ id: 1, name: 'Plumbing' }],
      countries: [{ id: 44, name: 'United Kingdom' }],
      states: [{ id: 6, name: 'London' }],
      roles: [{ id: 2, name: 'Provider' }],
    })

    expect(payload.categories[0].name).toBe('Plumbing')
  })
})
