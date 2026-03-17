export interface BackendMessage {
  id: number
  conversationId: number | string
  senderId: number | string
  content: string
  type: "USER" | "AI"
  timestamp: string
}