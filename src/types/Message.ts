export type MessageRole = "USER" | "AI"

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  role: MessageRole
  createdAt: string
  status?: "SENDING" | "SENT" | "FAILED"
}