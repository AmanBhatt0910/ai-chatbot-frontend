import { create } from "zustand"
import type { Message } from "../types/Message"
import type { Conversation } from "../types/Conversation"

interface ChatState {
  messages: Message[]
  conversations: Conversation[]
  activeConversation: number | null
  isTyping: boolean

  setConversations: (conversations: Conversation[]) => void
  setActiveConversation: (id: number | null) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  setTyping: (typing: boolean) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  conversations: [],
  activeConversation: null,
  isTyping: false,

  setConversations: (conversations) =>
    set({ conversations }),

  setActiveConversation: (id) =>
    set({
      activeConversation: id,
      messages: [],
      isTyping: false, // reset typing indicator on conversation switch
    }),

  setMessages: (messages) =>
    set({ messages }),

  addMessage: (message) =>
    set((state) => {
      // Replace matching optimistic message (same content + SENDING status)
      const existingIndex = state.messages.findIndex(
        (m) =>
          m.status === "SENDING" &&
          m.content === message.content &&
          m.role === message.role
      )

      if (existingIndex !== -1) {
        const updated = [...state.messages]
        updated[existingIndex] = { ...message, status: "SENT" }
        return { messages: updated }
      }

      // Prevent duplicates for real messages (positive id)
      if (message.id > 0 && state.messages.some((m) => m.id === message.id)) {
        return state
      }

      return { messages: [...state.messages, message] }
    }),

  setTyping: (typing) =>
    set({ isTyping: typing }),
}))