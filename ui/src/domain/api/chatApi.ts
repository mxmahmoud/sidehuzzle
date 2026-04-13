import { apiGet } from '@/data/api'

import { chatMessageSchema, chatRoomSchema, type ChatMessage, type ChatRoom } from '@/data/contract'

export async function getChatThreads(): Promise<ChatRoom[]> {
  return chatRoomSchema.array().parse(await apiGet('/chat/rooms'))
}

export async function getChatMessages(threadId: string | number): Promise<ChatMessage[]> {
  return chatMessageSchema.array().parse(await apiGet(`/chat/rooms/${threadId}/messages`))
}
