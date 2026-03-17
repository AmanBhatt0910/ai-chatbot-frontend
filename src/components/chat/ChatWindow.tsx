import { useEffect, useRef } from "react"
import type { Message } from "@/types/Message"
import ChatMessage from "./ChatMessage"

interface Props {
  messages: Message[]
}

export default function ChatWindow({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          isOwn={msg.role === "USER"}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  )
}