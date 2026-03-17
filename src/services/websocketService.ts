import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs"
import type { Message } from "../types/Message"

let stompClient: Client | null = null

export const websocketService = {

  connect: (onMessage: (msg: Message) => void) => {

    const socket = new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`)

    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("WebSocket connected")
      },

      onStompError: (frame) => {
        console.error("Broker error:", frame.headers["message"])
      },
    })

    stompClient.activate()

    return stompClient
  },

  subscribeToConversation: (conversationId: string, callback: (msg: Message) => void) => {
    if (!stompClient || !stompClient.connected) return

    stompClient.subscribe(
      `/topic/conversations/${conversationId}`,
      (message) => {
        const parsed: Message = JSON.parse(message.body)
        callback(parsed)
      }
    )
  },

  sendMessage: (message: Message) => {
    if (!stompClient || !stompClient.connected) return

    stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify(message),
    })
  },

  disconnect: () => {
    stompClient?.deactivate()
    stompClient = null
  },
}