import { useEffect } from "react"
import { useChatStore } from "../store/chatStore"
import { websocketService } from "../services/websocketService"
import type { Message } from "../types/Message"

export const useChat = () => {

  const messages = useChatStore((s) => s.messages)
  const addMessage = useChatStore((s) => s.addMessage)
  const isTyping = useChatStore((s) => s.isTyping)
  const setTyping = useChatStore((s) => s.setTyping)

  const conversationId = "default"

  useEffect(() => {

    const client = websocketService.connect((msg) => {
      addMessage(msg)
    })

    // Wait until connected before subscribing
    const interval = setInterval(() => {
      if (client.connected) {
        websocketService.subscribeToConversation(conversationId, (msg) => {
          addMessage(msg)
        })
        clearInterval(interval)
      }
    }, 300)

    return () => {
      websocketService.disconnect()
    }

  }, [])

  const sendMessage = (content: string) => {

    const message: Message = {
      id: crypto.randomUUID(),
      conversationId,
      senderId: "user",
      content,
      role: "USER",
      createdAt: new Date().toISOString(),
      status: "SENDING",
    }

    addMessage(message)

    websocketService.sendMessage(message)
  }

  return {
    messages,
    isTyping,
    sendMessage,
    setTyping,
  }
}