import { useEffect, useRef, useCallback } from "react"
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

  // Stable ref so WS callbacks always see the current conversation id
  const activeConversationRef = useRef<number | null>(activeConversation)
  useEffect(() => {
    activeConversationRef.current = activeConversation
  }, [activeConversation])

  // ── Fetch messages when active conversation changes ─────────────────────
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
          role: msg.type as Message["role"],
          createdAt: msg.timestamp,
          status: "SENT" as const,
        }))

        setMessages(normalized)
      } catch (err) {
        console.error("Failed to fetch messages", err)
      }
    }

    fetchMessages()
  }, [activeConversation, setMessages])

  // ── WebSocket: connect once, re-subscribe on conversation change ─────────
  useEffect(() => {
    if (activeConversation === null) return

    // ✅ StrictMode guard: track whether this effect instance is still active.
    // React StrictMode fires mount → cleanup → mount in dev. Without this flag,
    // both mount cycles subscribe, giving two listeners on the same topic.
    let active = true

    const subscribe = () => {
      if (!active) return // cleanup already ran — don't subscribe

      websocketService.subscribeToConversation(
        activeConversation,
        (msg: Message) => {
          // Discard messages that arrived for an old conversation
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
      // Only drop the topic subscription — keep the WS connection alive
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

      // Refresh sidebar title after backend confirms category
      setTimeout(() => refreshConversations(), 1200)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // ── Derived: has a category been confirmed by the backend? ──────────────
  // True once the backend sends the SYSTEM "Category set to: X" message
  const hasCategory = messages.some(
    (m) => m.role === "SYSTEM" && m.content.startsWith("Category set to:")
  )

  return {
    messages,
    sendMessage,
    setCategory,
    activeConversation,
    setActiveConversation,
    refreshConversations,
    hasCategory,
  }
}