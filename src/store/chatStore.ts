import { create } from "zustand"
import type { Message } from "../types/Message"
import type { Conversation } from "../types/Conversation"

interface ChatState {
  messages: Message[]
  conversations: Conversation[]
  activeConversation: number | null
  isTyping: boolean

  setConversations: (conversations: Conversation[]) => void
  setActiveConversation: (id: number) => void
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
    }),

  setMessages: (messages) =>
    set({ messages }),

  addMessage: (message) =>
    set((state) => {

      // 1. Try to find matching optimistic message
      const existingIndex = state.messages.findIndex(
        (m) =>
          m.senderId === message.senderId &&
          m.content === message.content &&
          m.status === "SENDING"
      )

      // 2. If found → REPLACE it with backend message
      if (existingIndex !== -1) {
        const updatedMessages = [...state.messages]
        updatedMessages[existingIndex] = {
          ...message,
          status: "SENT",
        }

        return { messages: updatedMessages }
      }

      // 3. Otherwise → normal add (AI message etc.)
      return {
        messages: [...state.messages, message],
      }
    }),

  setTyping: (typing) =>
    set({ isTyping: typing }),
}))