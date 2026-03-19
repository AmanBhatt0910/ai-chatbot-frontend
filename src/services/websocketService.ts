import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs"
import type { StompSubscription } from "@stomp/stompjs"
import type { Message } from "../types/Message"

let stompClient: Client | null = null
let subscription: StompSubscription | null = null
let isConnecting = false
let pendingSubscription: (() => void) | null = null

export const websocketService = {

  connect: (onConnectCallback?: () => void) => {
    // Already connected — run callback immediately
    if (stompClient?.connected) {
      onConnectCallback?.()
      return stompClient
    }

    // Mid-connection — queue the callback, don't create a second client
    if (isConnecting) {
      if (onConnectCallback) pendingSubscription = onConnectCallback
      return stompClient
    }

    isConnecting = true

    const token = localStorage.getItem("token")

    const socket = new SockJS(
      `${import.meta.env.VITE_API_BASE_URL}/ws?token=${token}`
    )

    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log("✅ WebSocket connected")
        isConnecting = false
        onConnectCallback?.()
        if (pendingSubscription) {
          pendingSubscription()
          pendingSubscription = null
        }
      },
      onDisconnect: () => {
        console.log("🔌 WebSocket disconnected")
        isConnecting = false
      },
      onStompError: (frame) => {
        console.error("❌ Broker error:", frame.headers["message"])
        isConnecting = false
      },
    })

    stompClient.activate()
    return stompClient
  },

  subscribeToConversation: (
    conversationId: number,
    callback: (msg: Message) => void
  ) => {
    if (subscription) {
      subscription.unsubscribe()
      subscription = null
    }

    if (!stompClient?.connected) {
      console.warn("⚠️ WS not connected — subscription skipped")
      return
    }

    subscription = stompClient.subscribe(
      `/topic/conversations/${conversationId}`,
      (frame) => {
        const raw = JSON.parse(frame.body)

        const normalized: Message = {
          id: Number(raw.id ?? 0),
          conversationId: Number(raw.conversationId ?? conversationId),
          senderId: String(raw.senderId ?? "system"),
          content: raw.content,
          role: raw.type as Message["role"],
          createdAt: raw.timestamp ?? new Date().toISOString(),
          status: "SENT",
        }

        callback(normalized)
      }
    )

    console.log(`📡 Subscribed to conversation ${conversationId}`)
  },

  sendMessage: (payload: {
    conversationId: number
    content: string
    type: string
  }) => {
    if (!stompClient?.connected) {
      console.error("❌ Cannot send — WebSocket not connected")
      return
    }

    stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify({
        conversationId: payload.conversationId,
        content: payload.content,
        type: payload.type,
      }),
    })
  },

  // Unsubscribe from topic only — keeps WS alive for conversation switching
  unsubscribe: () => {
    if (subscription) {
      subscription.unsubscribe()
      subscription = null
    }
  },

  // Full teardown — only call on logout
  disconnect: () => {
    subscription?.unsubscribe()
    subscription = null
    stompClient?.deactivate()
    stompClient = null
    isConnecting = false
    pendingSubscription = null
  },

  isConnected: () => stompClient?.connected ?? false,
}