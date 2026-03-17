export type MessageRole = "USER" | "AI"

export interface Message {
  id: number
  conversationId: number
  senderId: string
  content: string
  role: MessageRole
  createdAt: string
  status?: "SENDING" | "SENT" | "FAILED"
}