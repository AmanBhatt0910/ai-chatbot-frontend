import { useEffect, useRef } from "react"
import type { Message } from "@/types/Message"
import ChatMessage from "./ChatMessage"
import TypingIndicator from "./TypingIndicator"
import { useChatStore } from "@/store/chatStore"

interface Props {
  messages: Message[]
}

export default function ChatWindow({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const { isTyping } = useChatStore()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Start a conversation 🚀
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 scroll-smooth">
      <div className="max-w-3xl mx-auto space-y-6">

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isOwn={msg.role === "USER"}
          />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}