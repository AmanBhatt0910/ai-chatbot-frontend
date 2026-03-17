import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs"
import type { StompSubscription } from "@stomp/stompjs"
import type { Message } from "../types/Message"

let stompClient: Client | null = null
let subscription: StompSubscription | null = null

export const websocketService = {

  connect: (
    onConnectCallback?: () => void
  ) => {

    if (stompClient?.connected) return stompClient

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
        console.log("WebSocket connected")
        onConnectCallback?.()
      },

      onStompError: (frame) => {
        console.error("Broker error:", frame.headers["message"])
      },
    })

    stompClient.activate()

    return stompClient
  },

  subscribeToConversation: (
    conversationId: number,
    callback: (msg: Message) => void
  ) => {

    if (!stompClient || !stompClient.connected) return

    if (subscription) {
      subscription.unsubscribe()
    }

    subscription = stompClient.subscribe(
      `/topic/conversations/${conversationId}`,
      (message) => {

        const raw = JSON.parse(message.body)

        const normalized: Message = {
          id: Number(raw.id),
          conversationId: Number(raw.conversationId),
          senderId: String(raw.senderId),
          content: raw.content,
          role: raw.type,
          createdAt: raw.timestamp,
          status: "SENT",
        }

        callback(normalized)
      }
    )
  },

  sendMessage: (message: Message) => {
    if (!stompClient || !stompClient.connected) return

    stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify({
      conversationId: message.conversationId,
      content: message.content,
    })
    })
  },

  disconnect: () => {
    subscription?.unsubscribe()
    stompClient?.deactivate()
    stompClient = null
    subscription = null
  },
}