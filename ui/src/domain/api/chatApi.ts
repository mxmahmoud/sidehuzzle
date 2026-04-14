import { apiGet, apiPost } from '@/data/api'
import { chatMessageSchema, chatRoomSchema, type ChatMessage, type ChatRoom } from '@/data/contract'

export async function getChatThreads(): Promise<ChatRoom[]> {
  return chatRoomSchema.array().parse(await apiGet('/chats/'))
}

export async function getChatMessages(threadId: string | number): Promise<ChatMessage[]> {
  return chatMessageSchema.array().parse(await apiGet(`/chats/${threadId}/messages`))
}

export async function createChatRoom(taskId: number, participantId: number): Promise<ChatRoom> {
  return chatRoomSchema.parse(await apiPost('/chats/', { task_id: taskId, participant_id: participantId }))
}

export async function sendChatMessage(threadId: string | number, content: string): Promise<ChatMessage> {
  return chatMessageSchema.parse(await apiPost(`/chats/${threadId}/messages`, { content }))
}
