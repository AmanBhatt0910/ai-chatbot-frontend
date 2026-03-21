import { useEffect, useRef, useCallback, useState } from "react"
import { useChatStore } from "../store/chatStore"
import { websocketService } from "../services/websocketService"
import type { Message } from "../types/Message"
import type { BackendMessage } from "@/types/BackendMessage"
import type { Conversation } from "@/types/Conversation"
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

  // True while fetching messages for a conversation — gates chip visibility
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)

  const activeConversationRef = useRef<number | null>(activeConversation)
  useEffect(() => {
    activeConversationRef.current = activeConversation
  }, [activeConversation])

  // ── Fetch messages when active conversation changes ─────────────────────
  useEffect(() => {
    if (activeConversation === null) return

    const fetchMessages = async () => {
      setIsLoadingMessages(true)
      try {
        const res = await api.get<BackendMessage[]>(
          `/api/conversations/${activeConversation}/messages`
        )

        const normalized: Message[] = res.data.map((msg) => ({
          id: Number(msg.id),
          conversationId: Number(msg.conversationId),
          senderId: String(msg.senderId),
          content: msg.content,
          role: msg.type as Message["role"],
          createdAt: msg.timestamp,
          status: "SENT" as const,
        }))

        setMessages(normalized)
      } catch (err) {
        console.error("Failed to fetch messages", err)
      } finally {
        setIsLoadingMessages(false)
      }
    }

    fetchMessages()
  }, [activeConversation, setMessages])

  // ── WebSocket: connect once, re-subscribe on conversation change ─────────
  useEffect(() => {
    if (activeConversation === null) return

    let active = true

    const subscribe = () => {
      if (!active) return

      websocketService.subscribeToConversation(
        activeConversation,
        (msg: Message) => {
          if (msg.conversationId !== activeConversationRef.current) return

          addMessage(msg)

          if (msg.role === "AI" || msg.role === "SYSTEM") {
            setTyping(false)
          }
        }
      )
    }

    if (websocketService.isConnected()) {
      subscribe()
    } else {
      websocketService.connect(subscribe)
    }

    return () => {
      active = false
      websocketService.unsubscribe()
    }
  }, [activeConversation]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Send a chat message ─────────────────────────────────────────────────
  const sendMessage = useCallback(
    (content: string) => {
      if (activeConversationRef.current === null) return

      setTyping(true)

      const tempId = -(performance.now() * 1000 | 0)

      const optimistic: Message = {
        id: tempId,
        conversationId: activeConversationRef.current,
        senderId: "optimistic",
        content,
        role: "USER",
        createdAt: new Date().toISOString(),
        status: "SENDING",
      }

      useChatStore.getState().addMessage(optimistic)

      websocketService.sendMessage({
        conversationId: activeConversationRef.current,
        content,
        type: "USER",
      })
    },
    [setTyping]
  )

  // ── Refresh conversation list ───────────────────────────────────────────
  const refreshConversations = async () => {
    try {
      const res = await api.get<Conversation[]>("/api/conversations")

      const mapped: Conversation[] = res.data.map((c) => ({
        id: c.id,
        title: c.title || "New Chat",
        createdAt: c.createdAt,
      }))

      useChatStore.setState({ conversations: mapped })
    } catch (err) {
      console.error("Failed to refresh conversations", err)
    }
  }

  // ── Set category via WebSocket ──────────────────────────────────────────
  const setCategory = useCallback(
    (category: string) => {
      if (activeConversationRef.current === null) return

      const tempId = -(performance.now() * 1000 | 0)

      const optimistic: Message = {
        id: tempId,
        conversationId: activeConversationRef.current,
        senderId: "optimistic",
        content: category,
        role: "USER",
        createdAt: new Date().toISOString(),
        status: "SENDING",
      }

      useChatStore.getState().addMessage(optimistic)

      websocketService.sendMessage({
        conversationId: activeConversationRef.current,
        content: category,
        type: "USER",
      })

      setTimeout(() => refreshConversations(), 1200)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // ── Derived: category confirmed once SYSTEM message arrives ────────────
  const hasCategory = messages.some(
    (m) => m.role === "SYSTEM" && m.content.startsWith("Category set to:")
  )

  // ── Derived: extract category name from SYSTEM message ─────────────────
  const categoryMessage = messages.find(
    (m) => m.role === "SYSTEM" && m.content.startsWith("Category set to:")
  )
  const activeCategory = categoryMessage
    ? categoryMessage.content.replace("Category set to:", "").replace(". You can now ask questions.", "").trim()
    : null

  return {
    messages,
    sendMessage,
    setCategory,
    activeConversation,
    setActiveConversation,
    refreshConversations,
    hasCategory,
    activeCategory,
    isLoadingMessages, // ← consumed by ChatInput to gate chip visibility
  }
}