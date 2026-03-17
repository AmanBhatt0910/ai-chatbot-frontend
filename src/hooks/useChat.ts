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
    setTyping,
  } = useChatStore()


  useEffect(() => {
    if (activeConversation === null) return

    const fetchMessages = async () => {
      try {
        const res = await api.get<BackendMessage[]>(
          `/api/conversations/${activeConversation}/messages`
        )

        const normalized: Message[] = res.data.map((msg) => ({
          id: Number(msg.id),
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

  // 🔥 WebSocket connection
  useEffect(() => {
    if (activeConversation === null) return

    websocketService.connect(() => {
      websocketService.subscribeToConversation(
        activeConversation,
        (msg) => {
          addMessage(msg)
          if (msg.role === "AI") {
            setTyping(false)
          }
        }
      )
    })

    return () => {
      websocketService.disconnect()
    }

  }, [activeConversation])

  // 🔥 Send message
  const sendMessage = (content: string) => {
    if (activeConversation === null) return

    setTyping(true)

    const message: Message = {
      id: -Date.now(),
      conversationId: activeConversation,
      senderId: "optimistic",
      content,
      role: "USER",
      createdAt: new Date().toISOString(),
      status: "SENDING",
    }

    websocketService.sendMessage(message)
  }

  return {
    messages,
    sendMessage,
    activeConversation,
    setActiveConversation,
  }
}