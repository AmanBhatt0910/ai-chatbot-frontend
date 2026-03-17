import { create } from "zustand"
import type { Message } from "../types/Message"
import type { Conversation } from "../types/Conversation"

interface ChatState {
  messages: Message[]
  conversations: Conversation[]
  activeConversation: string | null
  isTyping: boolean

  setConversation: (id: string) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  setTyping: (typing: boolean) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  conversations: [],
  activeConversation: null,
  isTyping: false,

  setConversation: (id) =>
    set({
      activeConversation: id,
      messages: [],
    }),

  setMessages: (messages) =>
    set({
      messages,
    }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setTyping: (typing) =>
    set({
      isTyping: typing,
    }),
}))