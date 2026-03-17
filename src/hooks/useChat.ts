import { useEffect } from "react"
import { useChatStore } from "../store/chatStore"
import { websocketService } from "../services/websocketService"
import type { Message } from "../types/Message"
import type { BackendMessage } from "@/types/BackendMessage"
import api from "../api/axios"

export const useChat = () => {

  const {
    messages,
    addMessage,
    setMessages,
    activeConversation,
    setActiveConversation,
  } = useChatStore()

  // 1. Fetch existing messages when conversation changes
  useEffect(() => {
    if (activeConversation === null) return

    const fetchMessages = async () => {
      try {
        const res = await api.get<BackendMessage[]>(
          `/api/conversations/${activeConversation}/messages`
        )

        // normalize backend → frontend
        const normalized: Message[] = res.data.map((msg) => ({
          id:  Number(msg.id),
          conversationId: Number(msg.conversationId),
          senderId: String(msg.senderId),
          content: msg.content,
          role: msg.type,
          createdAt: msg.timestamp,
          status: "SENT",
        }))

        setMessages(normalized)
      } catch (err) {
        console.error("Failed to fetch messages", err)
      }
    }

    fetchMessages()

  }, [activeConversation, setMessages])

  // 2. WebSocket connection + subscription
  useEffect(() => {

    if (activeConversation === null) return

    websocketService.connect(
      (msg) => addMessage(msg),
      () => {
        websocketService.subscribeToConversation(
          activeConversation,
          (msg) => addMessage(msg)
        )
      }
    )

  }, [activeConversation, addMessage])

  // 3. Cleanup only on unmount
  useEffect(() => {
    return () => {
      websocketService.disconnect()
    }
  }, [])

  // 4. Send message (optimistic UI)
  const sendMessage = (content: string) => {
    if (activeConversation === null) return

    const message: Message = {
      id: -Date.now(),
      conversationId: activeConversation,
      senderId: "1",
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
    sendMessage,
    activeConversation,
    setActiveConversation,
  }
}